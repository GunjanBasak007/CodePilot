"use client";

import { format } from "date-fns";
import {
  CreditCardIcon,
  GithubLogoIcon,
  UserCircleIcon,
} from "@phosphor-icons/react";

import { UpgradeButton } from "@/features/billing/components/upgrade-button";
import { CancelSubscriptionButton } from "@/features/billing/components/cancel-subscription-button";
import type { UserSubscription } from "@/features/dashboard/lib/types";
import { statusBadge } from "@/features/dashboard/lib/status-style";
import { PLAN_DETAILS } from "@/features/settings/lib/plan-details";
import type { SettingsProfile } from "@/features/settings/types";
import type { UsageSummary } from "@/features/billing/server/usage";

import { cn } from "@/lib/utils";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

import {
  getDisplayName,
  getInitials,
} from "@/features/auth/components/user-menu";

type SettingsContentProps = {
  profile: SettingsProfile;
  subscription: UserSubscription;
  usage: UsageSummary;
};

function formatRenewalDate(
  renewsAt: string | null,
): string | null {
  if (!renewsAt) {
    return null;
  }

  return format(
    new Date(renewsAt),
    "MMMM d, yyyy",
  );
}

function getSubscriptionStatusLabel(
  status: UserSubscription["status"],
): string {
  switch (status) {
    case "active":
      return "Active";
    case "trialing":
      return "Trial";
    case "canceled":
      return "Canceled";
    default:
      return status;
  }
}

function getUsagePercentage(
  usage: UsageSummary,
): number {
  if (usage.limit === null || usage.limit === 0) {
    return 0;
  }

  return Math.min(
    100,
    Math.round((usage.used / usage.limit) * 100),
  );
}

function ProfileTab({
  profile,
}: {
  profile: SettingsProfile;
}) {
  const displayName = getDisplayName(profile);

  const initials = getInitials(profile);

  const memberSince = format(
    new Date(profile.memberSince),
    "MMMM d, yyyy",
  );

  return (
    <div className="space-y-6">
      <div>
        <p className="text-base font-semibold tracking-tight">
          Profile
        </p>

        <p className="mt-1 text-sm text-muted-foreground">
          Your account information is synced from GitHub.
        </p>
      </div>

      <Card>
        <CardContent className="p-6 sm:p-7">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            <Avatar size="lg" className="size-14">
              {profile.image ? (
                <AvatarImage
                  src={profile.image}
                  alt={displayName}
                />
              ) : null}

              <AvatarFallback>
                {initials}
              </AvatarFallback>
            </Avatar>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="truncate text-base font-semibold">
                  {displayName}
                </h2>

                <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/40 px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                  <GithubLogoIcon className="size-3" />
                  GitHub
                </span>
              </div>

              <p className="mt-1 truncate text-sm text-muted-foreground">
                {profile.email}
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                Member since {memberSince}
              </p>
            </div>
          </div>

          <div className="my-7 h-px bg-border" />

          <div className="space-y-5">
            <div className="grid gap-2">
              <Label
                htmlFor="settings-name"
                className="text-sm font-medium"
              >
                Display name
              </Label>

              <Input
                id="settings-name"
                value={profile.name}
                readOnly
                className="max-w-xl bg-muted/20"
              />
            </div>

            <div className="grid gap-2">
              <Label
                htmlFor="settings-email"
                className="text-sm font-medium"
              >
                Email
              </Label>

              <Input
                id="settings-email"
                type="email"
                value={profile.email}
                readOnly
                className="max-w-xl bg-muted/20"
              />
            </div>
          </div>

          <div className="mt-6 rounded-lg border border-border bg-muted/20 px-4 py-3">
            <p className="text-xs leading-5 text-muted-foreground">
              Profile details are managed through your GitHub
              account and cannot be edited from CodePilot.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function SubscriptionTab({
  subscription,
  usage,
}: {
  subscription: UserSubscription;
  usage: UsageSummary;
}) {
  const planDetails =
    PLAN_DETAILS[subscription.plan];

  const renewalDate = formatRenewalDate(
    subscription.renewsAt,
  );

  const isActive =
    subscription.status === "active" ||
    subscription.status === "trialing";

  const usagePercentage =
    getUsagePercentage(usage);

  const statusTone: "success" | "warning" | "neutral" =
    subscription.status === "active"
      ? "success"
      : subscription.status === "trialing"
        ? "success"
        : "warning";

  return (
    <div className="space-y-6">
      <div>
        <p className="text-base font-semibold tracking-tight">
          Subscription
        </p>

        <p className="mt-1 text-sm text-muted-foreground">
          Manage your CodePilot plan and AI review usage.
        </p>
      </div>

      <Card>
        <CardHeader className="border-b border-border px-6 py-6 sm:px-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-3">
              <div
                className={cn(
                  "flex size-10 shrink-0 items-center justify-center rounded-lg border",
                  isActive
                    ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                    : "border-border bg-muted text-muted-foreground",
                )}
              >
                <CreditCardIcon className="size-5" />
              </div>

              <div>
                <CardTitle className="text-base">
                  {planDetails.label} plan
                </CardTitle>

                <CardDescription className="mt-1">
                  {subscription.plan === "free"
                    ? "Your current CodePilot plan."
                    : "Your current CodePilot Pro subscription."}
                </CardDescription>
              </div>
            </div>

            <span
              className={statusBadge(statusTone)}
            >
              {getSubscriptionStatusLabel(
                subscription.status,
              )}
            </span>
          </div>
        </CardHeader>

        <CardContent className="space-y-7 px-6 py-7 sm:px-7">
          <section>
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-sm font-medium">
                  AI review usage
                </p>

                <p className="mt-1 text-sm text-muted-foreground">
                  {usage.limit === null
                    ? `${usage.used} reviews used this month`
                    : `${usage.used} of ${usage.limit} reviews used this month`}
                </p>
              </div>

              <p className="text-sm font-medium tabular-nums">
                {usage.limit === null
                  ? "Unlimited"
                  : `${usagePercentage}%`}
              </p>
            </div>

            {usage.limit !== null ? (
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className={cn(
                    "h-full rounded-full transition-all",
                    usagePercentage >= 100
                      ? "bg-red-500"
                      : "bg-foreground",
                  )}
                  style={{
                    width: `${usagePercentage}%`,
                  }}
                />
              </div>
            ) : (
              <div className="mt-4 h-2 rounded-full bg-emerald-500/15">
                <div className="h-full w-full rounded-full bg-emerald-500/50" />
              </div>
            )}
          </section>

          <section className="border-t border-border pt-7">
            <p className="text-sm font-medium">
              Plan includes
            </p>

            <div className="mt-4 divide-y divide-border rounded-lg border border-border">
              {planDetails.features.map(
                (feature) => (
                  <div
                    key={feature}
                    className="px-4 py-3 text-sm text-muted-foreground"
                  >
                    {feature}
                  </div>
                ),
              )}
            </div>
          </section>

          {renewalDate ? (
            <section className="border-t border-border pt-7">
              <div className="flex flex-col gap-1">
                <p className="text-sm font-medium">
                  Renewal
                </p>

                <p className="text-sm text-muted-foreground">
                  Your subscription renews on{" "}
                  <span className="font-medium text-foreground">
                    {renewalDate}
                  </span>
                  .
                </p>
              </div>
            </section>
          ) : null}

          <section className="border-t border-border pt-7">
            <div className="flex flex-col gap-4 rounded-lg border border-border bg-muted/20 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-medium">
                  {subscription.plan === "free"
                    ? "Need more reviews?"
                    : "Manage your subscription"}
                </p>

                <p className="mt-1 max-w-xl text-sm leading-5 text-muted-foreground">
                  {subscription.plan === "free"
                    ? "Upgrade to Pro for unlimited AI reviews on connected repositories."
                    : subscription.status === "canceled"
                      ? "Your subscription is canceled and will not renew."
                      : "Canceling keeps your Pro access active until the current billing period ends."}
                </p>
              </div>

              <div className="shrink-0">
                {subscription.plan === "free" ? (
                  <UpgradeButton />
                ) : (
                  <CancelSubscriptionButton
                    disabled={
                      subscription.status ===
                      "canceled"
                    }
                  />
                )}
              </div>
            </div>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}

export function SettingsContent({
  profile,
  subscription,
  usage,
}: SettingsContentProps) {
  return (
    <div className="flex flex-1 flex-col px-6 pb-8 pt-5">
      <Tabs
        defaultValue="profile"
        orientation="vertical"
        className="flex w-full flex-1 flex-col gap-8 lg:flex-row"
      >
        <aside className="w-full shrink-0 lg:w-52">
          <div className="mb-4">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
              Settings
            </p>

            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              Account and billing
            </p>
          </div>

          <TabsList className="h-auto w-full flex-col items-stretch justify-start gap-1 bg-transparent p-0">
            <TabsTrigger
              value="profile"
              className="w-full justify-start gap-2.5 px-3 py-2 text-sm font-medium data-[state=active]:bg-muted data-[state=active]:text-foreground"
            >
              <UserCircleIcon className="size-4" />
              Profile
            </TabsTrigger>

            <TabsTrigger
              value="subscription"
              className="w-full justify-start gap-2.5 px-3 py-2 text-sm font-medium data-[state=active]:bg-muted data-[state=active]:text-foreground"
            >
              <CreditCardIcon className="size-4" />
              Subscription
            </TabsTrigger>
          </TabsList>
        </aside>

        <main className="min-w-0 flex-1 lg:max-w-3xl">
          <TabsContent
            value="profile"
            className="mt-0"
          >
            <ProfileTab profile={profile} />
          </TabsContent>

          <TabsContent
            value="subscription"
            className="mt-0"
          >
            <SubscriptionTab
              subscription={subscription}
              usage={usage}
            />
          </TabsContent>
        </main>
      </Tabs>
    </div>
  );
}