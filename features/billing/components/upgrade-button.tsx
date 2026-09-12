"use client";

import { useRouter } from "next/navigation";
import Script from "next/script";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { startProSubscription } from "@/lib/billing";
import { cn } from "@/lib/utils";
import { statusButtonClass } from "@/features/dashboard/lib/status-style";

type UpgradeButtonProps = {
  className?: string;
};

type RazorpayCheckout = new (options: Record<string, unknown>) => {
  open: () => void;
};

declare global {
  interface Window {
    Razorpay?: RazorpayCheckout;
  }
}

const RAZORPAY_SCRIPT_URL =
  "https://checkout.razorpay.com/v1/checkout.js";

export function UpgradeButton({
  className,
}: UpgradeButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleUpgrade() {
    const key = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;

    if (!key) {
      toast.error("Razorpay is not configured yet.");
      return;
    }

    if (!window.Razorpay) {
      toast.error(
        "Checkout is still loading, please try again in a moment.",
      );
      return;
    }

    setLoading(true);

    try {
      const { subscriptionId } =
        await startProSubscription();

      const checkout = new window.Razorpay({
        key,
        subscription_id: subscriptionId,
        name: "Code Pilot",
        description: "Pro plan — unlimited AI reviews",
        handler: () => {
          toast.success(
            "Payment successful! Your Pro plan will activate shortly.",
          );
          router.refresh();
        },
      });

      checkout.open();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Could not start checkout.";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Script
        src={RAZORPAY_SCRIPT_URL}
        strategy="lazyOnload"
      />

      <Button
        type="button"
        onClick={handleUpgrade}
        disabled={loading}
        className={cn(
          statusButtonClass.success,
          className,
        )}
      >
        {loading
          ? "Opening checkout…"
          : "Upgrade to Pro"}
      </Button>
    </>
  );
}