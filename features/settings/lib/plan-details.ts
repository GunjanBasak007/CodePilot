import type { SubscriptionPlan } from "@/features/dashboard/lib/types";

export const PLAN_DETAILS: Record<
  SubscriptionPlan,
  {
    label: string;
    features: string[];
  }
> = {
  free: {
    label: "Free",
    features: [
      "Up to 5 AI reviews per month",
      "Public and private repository access",
      "Community support",
    ],
  },

  pro: {
    label: "Pro",
    features: [
      "Unlimited AI reviews",
      "Public and private repository access",
    ],
  },
};