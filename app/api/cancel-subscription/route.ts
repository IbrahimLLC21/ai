// /app/api/cancel-subscription/route.ts
import { auth as clerkAuth, currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import axios from "axios";
import prismadb from "@/lib/prismadb";

export async function POST(req: Request) {
  try {
    // Authenticate the user
    const { userId } = clerkAuth();
    const user = await currentUser();

    if (!userId || !user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Retrieve the user's subscription information from the database
    const userSubscription = await prismadb.userSubscription.findUnique({
      where: { userId },
    });

    if (!userSubscription || !userSubscription.paypalSubscriptionId) {
      return new NextResponse("No subscription found", { status: 404 });
    }

    // Create a base64-encoded authorization header for the PayPal API request
    const authHeader = Buffer.from(
      `${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET}`
    ).toString("base64");

    // Make the PayPal API request to cancel the subscription
    const response = await axios.post(
      `https://api-m.paypal.com/v1/billing/subscriptions/${userSubscription.paypalSubscriptionId}/cancel`,
      {},
      {
        headers: {
          Authorization: `Basic ${authHeader}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status !== 204) {
      throw new Error("Failed to cancel subscription");
    }

    // Update the subscription status in the database
    await prismadb.userSubscription.update({
      where: { userId },
      data: {
        paypalSubscriptionId: null,
        paypalPlanId: null,
        paypalCurrentPeriodEnd: null,
      },
    });

    return new NextResponse("Subscription cancelled successfully", { status: 200 });
  } catch (error) {
    console.error("[CANCEL_SUBSCRIPTION_ERROR]", error.response?.data || error.message);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
