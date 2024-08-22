import { auth as clerkAuth, currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import axios from "axios";
import prismadb from "@/lib/prismadb";
import { absoluteUrl } from "@/lib/utils";

// Define the PayPal Plan ID and construct the settings URL
const settingsUrl = absoluteUrl("/settings");
const paypalPlanId = "P-5W517324EF186111LM3AOABA"; // New PayPal Plan ID

export async function GET() {
  try {
    // Authenticate the user
    const { userId } = clerkAuth();
    const user = await currentUser();

    // Check if the user is authenticated
    if (!userId || !user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Retrieve the user's subscription information from the database
    const userSubscription = await prismadb.userSubscription.findUnique({
      where: { userId },
    });

    // If the user already has a PayPal subscription, return the settings URL
    if (userSubscription && userSubscription.paypalSubscriptionId) {
      return new NextResponse(JSON.stringify({ url: settingsUrl }), {
        status: 200,
      });
    }

    // Ensure the user has an email address
    const userEmail = user.emailAddresses[0]?.emailAddress;
    if (!userEmail) {
      return new NextResponse("Email address not found", { status: 400 });
    }

    // Create a base64-encoded authorization header for the PayPal API request
    const authHeader = Buffer.from(
      `${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET}`
    ).toString("base64");

    // Make the PayPal API request to create a new subscription
    const response = await axios.post(
      "https://api-m.paypal.com/v1/billing/subscriptions",
      {
        plan_id: paypalPlanId, // Use the new Plan ID variable here
        application_context: {
          return_url: settingsUrl,
          cancel_url: settingsUrl,
        },
        subscriber: {
          email_address: userEmail,
          custom_id: userId, // Include custom ID if needed
        },
      },
      {
        headers: {
          Authorization: `Basic ${authHeader}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Find the approval URL in the PayPal response
    const approvalUrlLink = response.data.links.find(
      (link: any) => link.rel === "approve"
    );

    if (!approvalUrlLink) {
      throw new Error("Approval URL not found in PayPal response");
    }

    const approvalUrl = approvalUrlLink.href;

    // Save the subscription ID and other relevant data in the database
    await prismadb.userSubscription.upsert({
      where: { userId },
      update: {
        paypalSubscriptionId: response.data.id,
        paypalPlanId: paypalPlanId,
      },
      create: {
        userId,
        paypalSubscriptionId: response.data.id,
        paypalPlanId: paypalPlanId,
      },
    });

    // Return the approval URL to the client
    return new NextResponse(JSON.stringify({ url: approvalUrl }), {
      status: 200,
    });
  } catch (error) {
    console.error("[PAYPAL_ERROR]", error.response?.data || error.message);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
