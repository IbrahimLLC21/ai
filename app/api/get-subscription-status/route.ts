// File: /app/api/get-subscription-status/route.ts
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs'; 
import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";
import { auth as clerkAuth } from "@clerk/nextjs";

export async function GET() {
  try {
    const { userId } = clerkAuth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const userSubscription = await prismadb.userSubscription.findUnique({
      where: { userId },
    });

    const status = userSubscription?.paypalPlanId ? 'Pro' : 'Free';

    return new NextResponse(JSON.stringify({ status }), { status: 200 });
  } catch (error) {
    console.error("Error fetching subscription status:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
