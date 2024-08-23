import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("Webhook Payload:", JSON.stringify(body, null, 2)); // Log the full payload

    if (!body.resource) {
      console.error("Resource is missing in the webhook payload");
      return new NextResponse("Invalid Payload", { status: 400 });
    }

    const eventType = body.event_type;
    const resource = body.resource;

    // Extract relevant information from the payload
    const subscriptionId = resource.id;
    const state = resource.state;
    const planId = resource.plan?.id || 'unknown'; // Ensure planId is extracted correctly
    const currentPeriodEnd = new Date(resource.agreement_details?.final_payment_due_date || Date.now());

    console.log("Subscription ID:", subscriptionId);
    console.log("State:", state);
    console.log("Plan ID:", planId);
    console.log("Current Period End:", currentPeriodEnd);

    if (eventType === "BILLING.SUBSCRIPTION.CREATED" || eventType === "BILLING.SUBSCRIPTION.ACTIVATED") {
      const userId = await getUserIdFromSubscription(subscriptionId);
      if (!userId) {
        console.error("User ID could not be determined");
        return new NextResponse("User ID Not Found", { status: 400 });
      }

      console.log("Fetched User ID:", userId);

      const existingSubscription = await prismadb.userSubscription.findUnique({
        where: { paypalSubscriptionId: subscriptionId },
      });

      if (existingSubscription) {
        console.log("Existing Subscription:", existingSubscription);
      } else {
        console.log("No existing subscription found. Creating new record...");
        await prismadb.userSubscription.create({
          data: {
            userId,
            paypalSubscriptionId: subscriptionId,
            paypalPlanId: planId, // Save the plan ID here
            paypalCurrentPeriodEnd: currentPeriodEnd,
          },
        });
        console.log("Created new subscription record.");
      }
    }

    return new NextResponse(null, { status: 200 });
  } catch (error) {
    console.error("Webhook Error:", (error as Error).message || error);
    return new NextResponse("Webhook Error", { status: 500 });
  }
}

async function getUserIdFromSubscription(subscriptionId: string): Promise<string | null> {
  try {
    // Using the existing UserSubscription model
    const subscription = await prismadb.userSubscription.findUnique({
      where: { paypalSubscriptionId: subscriptionId }, // Look up by paypalSubscriptionId
      select: { userId: true }, // Select only the userId field
    });

    return subscription ? subscription.userId : null;
  } catch (error) {
    console.error("Error fetching user ID:", (error as Error).message || error);
    return null;
  }
}

