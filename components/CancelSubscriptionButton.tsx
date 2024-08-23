import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";

export default function CancelSubscriptionButton() {
  const [loading, setLoading] = useState(false);

  const handleCancelSubscription = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/cancel-subscription", {
        method: "POST",
      });

      if (response.ok) {
        toast.success("Subscription cancelled successfully!");
        // Optionally redirect or update UI
      } else {
        throw new Error("Failed to cancel subscription");
      }
    } catch (error) {
      toast.error("An error occurred while cancelling the subscription.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="destructive"
      disabled={loading}
      onClick={handleCancelSubscription}
    >
      {loading ? "Cancelling..." : "Cancel Subscription"}
    </Button>
  );
}
