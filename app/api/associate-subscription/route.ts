// File: /app/api/associate-subscription/route.ts
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs'; 
import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";
import { auth as clerkAuth } from "@clerk/nextjs";

export async function POST(req: Request) {
  try {
    const { subscriptionId } = await req.json();
    const { userId } = clerkAuth();

    console.log("Request body:", { subscriptionId });
    console.log("User ID from Clerk:", userId);

    if (!subscriptionId || !userId) {
      console.error("Missing subscriptionId or userId");
      return new NextResponse("Invalid request data", { status: 400 });
    }

    // Verify if the userSubscription entry exists or not
    const existingSubscription = await prismadb.userSubscription.findUnique({
      where: { userId },
    });

    if (existingSubscription) {
      // Update existing subscription
      const result = await prismadb.userSubscription.update({
        where: { userId },
        data: {
          paypalSubscriptionId: subscriptionId,
          // Other fields to update if needed
        },
      });
      console.log("Subscription updated successfully:", result);
    } else {
      // Create new subscription entry
      const result = await prismadb.userSubscription.create({
        data: {
          userId,
          paypalSubscriptionId: subscriptionId,
          // Other fields to create if needed
        },
      });
      console.log("Subscription created successfully:", result);
    }

    return new NextResponse("Subscription associated successfully", { status: 200 });
  } catch (error) {
    console.error("Error associating subscription:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
