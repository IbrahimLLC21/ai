// File: /app/api/associate-subscription/route.ts

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

    const result = await prismadb.userSubscription.upsert({
      where: { userId },
      update: {
        paypalSubscriptionId: subscriptionId,
        // Other fields to update if needed
      },
      create: {
        userId,
        paypalSubscriptionId: subscriptionId,
        // Other fields to create if needed
      },
    });

    console.log("Subscription associated successfully:", result);
    return new NextResponse("Subscription associated successfully", { status: 200 });
  } catch (error) {
    console.error("Error associating subscription:", (error as Error).message || error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
