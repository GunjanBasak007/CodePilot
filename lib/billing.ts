"use server";

import { getServerSession } from "@/features/auth/actions";
import {
  cancelProSubscription,
  createProSubscription,
  getUserSubscription,
} from "@/features/billing/server/subscription";
import { redirect } from "next/navigation";

export async function startProSubscription() {
  const session = await getServerSession();

  if (!session) {
    redirect("/sign-in");
  }

  return createProSubscription(session.user.id);
}

export async function cancelSubscription() {
  const session = await getServerSession();

  if (!session) {
    redirect("/sign-in");
  }

  await cancelProSubscription(session.user.id);
}

export async function getCurrentSubscriptionPlan() {
  const session = await getServerSession();

  if (!session) {
    return "Free";
  }

  const subscription = await getUserSubscription(session.user.id);

  return subscription.plan === "pro" ? "Pro" : "Free";
}