import { auth as clerkAuth } from "@clerk/nextjs";
import prismadb from "@/lib/prismadb";

const DAY_IN_MS = 86_400_000; // Correct constant for a day

export const checkSubscription = async () => {
  try {
    // Get the user ID from Clerk
    const { userId } = clerkAuth();
    console.log("User ID from Clerk:", userId);

    if (!userId) {
      console.error("User ID not found from Clerk.");
      return false;
    }

    // Retrieve the user's subscription information from the database
    const userSubscription = await prismadb.userSubscription.findUnique({
      where: { userId },
      select: {
        paypalSubscriptionId: true,
        paypalCurrentPeriodEnd: true,
        paypalPlanId: true
      }
    });

    console.log("Subscription Data from Database:", userSubscription);

    if (!userSubscription) {
      console.log("No subscription found for user:", userId);
      return false;
    }

    const { paypalCurrentPeriodEnd } = userSubscription;
    if (!paypalCurrentPeriodEnd) {
      console.log("No current period end date found for user:", userId);
      return false;
    }

    // Check if the subscription is still valid
    const currentPeriodEndTime = new Date(paypalCurrentPeriodEnd).getTime();
    const isValid = currentPeriodEndTime + DAY_IN_MS > Date.now();

    console.log("Current Period End:", paypalCurrentPeriodEnd);
    console.log("Validity Check:", isValid);

    return isValid;
  } catch (error) {
    console.error("Error checking subscription:", error.message || error);
    return false;
  }
};
