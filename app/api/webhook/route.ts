export const dynamic = 'force-dynamic';
export const runtime = 'nodejs'; 
import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("Webhook Payload:", JSON.stringify(body, null, 2));

    if (!body.resource) {
      console.error("Resource is missing in the webhook payload");
      return new NextResponse("Invalid Payload", { status: 400 });
    }

    const eventType = body.event_type;
    const resource = body.resource;

    const subscriptionId = resource.id;
    const state = resource.state;
    const planId = resource.plan?.id || 'unknown';
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
        await prismadb.userSubscription.update({
          where: { paypalSubscriptionId: subscriptionId },
          data: {
            paypalPlanId: planId,
            paypalCurrentPeriodEnd: currentPeriodEnd,
          },
        });
        console.log("Updated existing subscription record.");
      } else {
        console.log("No existing subscription found. Creating new record...");
        await prismadb.userSubscription.create({
          data: {
            userId,
            paypalSubscriptionId: subscriptionId,
            paypalPlanId: planId,
            paypalCurrentPeriodEnd: currentPeriodEnd,
          },
        });
        console.log("Created new subscription record.");
      }
    } else if (eventType === "BILLING.SUBSCRIPTION.CANCELLED") {
      console.log("Subscription cancelled:", subscriptionId);

      // Optionally, delete the subscription record if appropriate
      await prismadb.userSubscription.deleteMany({
        where: { paypalSubscriptionId: subscriptionId },
      });
      console.log("Deleted subscription record.");
    }

    return new NextResponse(null, { status: 200 });
  } catch (error) {
    console.error("Webhook Error:", (error as Error).message || error);
    return new NextResponse("Webhook Error", { status: 500 });
  }
}

async function getUserIdFromSubscription(subscriptionId: string): Promise<string | null> {
  try {
    const subscription = await prismadb.userSubscription.findUnique({
      where: { paypalSubscriptionId: subscriptionId },
      select: { userId: true },
    });

    return subscription ? subscription.userId : null;
  } catch (error) {
    console.error("Error fetching user ID:", (error as Error).message || error);
    return null;
  }
}
