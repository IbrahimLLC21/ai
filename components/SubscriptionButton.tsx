"use client";

import React, { useState, useEffect } from "react";
import { Zap } from "lucide-react";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";

const paypalPlanId = "P-5W517324EF186111LM3AOABA";
const paypalClientId = "AVH5-CKwnYKdKK7fblmP3hlOYwnsVk_l5EiU4iBVBz099KT2tSv9Re5l5KoeDcb1EuPexfXG_HJudsB8";

export default function SubscriptionButton({ isPro = false }: { isPro: boolean }) {
  const [loading, setLoading] = useState<boolean>(false);
  const [paypalLoaded, setPaypalLoaded] = useState<boolean>(false);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = `https://www.paypal.com/sdk/js?client-id=${paypalClientId}&vault=true&intent=subscription`;
    script.setAttribute("data-sdk-integration-source", "button-factory");
    script.onload = () => setPaypalLoaded(true);
    script.onerror = () => {
      console.error("Failed to load PayPal SDK.");
      toast.error("Failed to load PayPal SDK.");
      window.location.reload(); // Reload the page on error
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handlePayPalAction = () => {
    if (!paypalLoaded || !(window as any).paypal) {
      console.error("PayPal SDK is not loaded.");
      return;
    }

    if (isPro) {
      if (window.confirm("Are you sure you want to cancel your subscription?")) {
        cancelSubscription();
      }
    } else {
      createSubscription();
    }
  };

  const createSubscription = () => {
    setLoading(true);

    (window as any).paypal.Buttons({
      style: {
        shape: 'rect',
        color: 'gold',
        layout: 'vertical',
        label: 'subscribe'
      },
      createSubscription: function (data: any, actions: any) {
        return actions.subscription.create({
          plan_id: paypalPlanId,
        });
      },
      onApprove: async function (data: any, actions: any) {
        console.log("Subscription approved:", data);

        try {
          const response = await fetch('/api/associate-subscription', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              subscriptionId: data.subscriptionID,
              userId: 'current_user_id', // Replace with the actual user ID
            }),
          });

          if (!response.ok) {
            throw new Error('Failed to associate subscription');
          }

          const result = await response.json();
          console.log("Subscription associated:", result);

          toast.success("Subscription successful!");
          window.location.href = "/settings"; // Redirect to settings page or another appropriate page
        } catch (error) {
          console.error("Failed to associate subscription:", error);
          toast.error("Subscription successfully");
          window.location.reload(); // Reload the page on error
        } finally {
          setLoading(false);
        }
      },
      onError: function (err: any) {
        console.error("PayPal Buttons error:", err);
        toast.error("Something went wrong with the subscription. Please try again.");
        window.location.reload(); // Reload the page on error
      },
      onCancel: function (data: any) {
        console.log("Subscription cancelled:", data);
        toast.error("Subscription was cancelled.");
        window.location.href = "/settings"; // Redirect to settings page or another appropriate page
      },
    }).render(`#paypal-button-container-${paypalPlanId}`);
  };

  const cancelSubscription = async () => {
    setLoading(true);

    try {
      const response = await fetch('/api/cancel-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: 'current_user_id', // Replace with the actual user ID
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to cancel subscription');
      }

      const result = await response.json();
      console.log("Subscription cancelled:", result);

      toast.success("Subscription cancelled successfully!");
      window.location.href = "/settings"; // Redirect to settings page or another appropriate page
    } catch (error) {
      console.error("Failed to cancel subscription:", error);
      toast.error("Cancellation Successful");
      window.location.reload(); // Reload the page on error
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative z-50">
      <Button
        disabled={loading}
        variant={isPro ? "default" : "premium"}
        onClick={handlePayPalAction}
      >
        {isPro ? "Cancel Subscription" : "Upgrade"}
        {!isPro && <Zap className="w-4 h-4 ml-2 fill-white" />}
      </Button>
      <div id={`paypal-button-container-${paypalPlanId}`} className="mt-4"></div>
    </div>
  );
}
