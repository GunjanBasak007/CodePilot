import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { statusBadge } from "@/features/dashboard/lib/status-style";
import type { DashboardOverviewData } from "@/features/dashboard/server/overview";

type DashboardOverviewProps = {
  data: DashboardOverviewData;
};

function getStatusTone(
  status: string,
): "success" | "warning" | "danger" | "info" | "neutral" {
  switch (status) {
    case "reviewed":
      return "success";
    case "processing":
      return "info";
    case "pending":
      return "warning";
    case "rate_limited":
      return "danger";
    default:
      return "neutral";
  }
}

function formatStatus(status: string) {
  switch (status) {
    case "reviewed":
      return "Reviewed";
    case "processing":
      return "Processing";
    case "pending":
      return "Pending";
    case "rate_limited":
      return "Rate Limited";
    default:
      return status;
  }
}

function getUsagePercentage(used: number, limit: number | null) {
  if (limit === null || limit === 0) {
    return 0;
  }

  return Math.min(Math.round((used / limit) * 100), 100);
}

export function DashboardOverview({ data }: DashboardOverviewProps) {
  const usagePercentage = getUsagePercentage(data.usage.used, data.usage.limit);

  const remainingReviews =
    data.usage.limit === null
      ? null
      : Math.max(data.usage.limit - data.usage.used, 0);

  return (
    <main className="flex flex-1 flex-col p-6">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        {/* Workspace header */}
        <section className="flex flex-col gap-2">
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
            Workspace
          </p>

          <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">
                {data.accountLogin
                  ? `${data.accountLogin}'s workspace`
                  : "Your workspace"}
              </h1>

              <p className="mt-1 text-sm text-muted-foreground">
                {data.githubConnected
                  ? "Monitor repositories, reviews, and codebase activity in one place."
                  : "Connect GitHub to start reviewing pull requests."}
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                nativeButton={false}
                render={<Link href="/dashboard/repos" />}
              >
                Repositories
              </Button>

              <Button
                size="sm"
                nativeButton={false}
                render={<Link href="/dashboard/pull-request" />}
              >
                Pull Requests
              </Button>
            </div>
          </div>
        </section>

        {/* Primary metrics */}
        <section className="grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2 xl:grid-cols-4">
          <Metric
            label="Repositories"
            value={data.repositories}
            detail={`${data.syncedRepositories} indexed`}
          />

          <Metric
            label="Pull Requests"
            value={data.pullRequests}
            detail={`${data.reviewedPullRequests} reviewed`}
          />

          <Metric
            label="In Progress"
            value={data.pendingPullRequests + data.processingPullRequests}
            detail={`${data.pendingPullRequests} pending · ${data.processingPullRequests} processing`}
          />

          <Metric
            label="AI Reviews"
            value={data.usage.used}
            detail={
              data.usage.limit === null
                ? "Pro · unlimited"
                : `${remainingReviews} remaining`
            }
          />
        </section>

        {/* Main content */}
        <section className="grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(300px,0.8fr)]">
          {/* Recent PRs */}
          <Card className="overflow-hidden">
            <CardHeader className="border-b border-border">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <CardTitle>Recent pull requests</CardTitle>
                  <CardDescription>
                    The latest PR activity received by CodePilot.
                  </CardDescription>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  nativeButton={false}
                  render={<Link href="/dashboard/pull-request" />}
                >
                  View all
                </Button>
              </div>
            </CardHeader>

            <CardContent className="p-0">
              {data.recentPullRequests.length === 0 ? (
                <div className="px-6 py-12 text-center">
                  <p className="text-sm font-medium">No pull requests yet</p>

                  <p className="mt-1 text-sm text-muted-foreground">
                    Open a pull request on a connected repository to start a
                    review.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {data.recentPullRequests.map((pullRequest) => (
                    <Link
                      key={pullRequest.id}
                      href={`/dashboard/pull-request/${pullRequest.id}`}
                      className="flex items-center gap-4 px-6 py-4 transition-colors hover:bg-muted/40"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex min-w-0 items-center gap-2">
                          <span className="shrink-0 text-xs text-muted-foreground">
                            #{pullRequest.prNumber}
                          </span>

                          <p className="truncate text-sm font-medium">
                            {pullRequest.title}
                          </p>
                        </div>

                        <p className="mt-1 truncate text-xs text-muted-foreground">
                          {pullRequest.repoFullName}
                        </p>
                      </div>

                      <div className="flex shrink-0 items-center gap-3">
                        <span
                          className={statusBadge(
                            getStatusTone(pullRequest.status),
                          )}
                        >
                          {formatStatus(pullRequest.status)}
                        </span>

                        <span className="hidden text-xs text-muted-foreground sm:block">
                          {pullRequest.reviewedAt
                            ? formatDistanceToNow(
                                new Date(pullRequest.reviewedAt),
                                {
                                  addSuffix: true,
                                },
                              )
                            : "Not reviewed"}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Review activity */}
          <Card>
            <CardHeader>
              <CardTitle>Review activity</CardTitle>
              <CardDescription>
                Current state of your pull request reviews.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-5">
              <ReviewRow label="Reviewed" value={data.reviewedPullRequests} />

              <ReviewRow
                label="Processing"
                value={data.processingPullRequests}
              />

              <ReviewRow label="Pending" value={data.pendingPullRequests} />

              <ReviewRow
                label="Rate Limited"
                value={data.rateLimitedPullRequests}
              />

              <div className="border-t border-border pt-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium">Monthly usage</p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      {data.usage.limit === null
                        ? "Pro plan · unlimited reviews"
                        : `${data.usage.used} of ${data.usage.limit} reviews used`}
                    </p>
                  </div>

                  <span className="text-sm font-medium">
                    {data.usage.limit === null ? "∞" : `${usagePercentage}%`}
                  </span>
                </div>

                {data.usage.limit !== null ? (
                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-foreground transition-all"
                      style={{
                        width: `${usagePercentage}%`,
                      }}
                    />
                  </div>
                ) : null}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Workspace status */}
        <section className="grid gap-6 md:grid-cols-3">
          <InfoBlock
            label="GitHub"
            value={
              data.githubConnected
                ? (data.accountLogin ?? "Connected")
                : "Not connected"
            }
            description={
              data.githubConnected
                ? "Repository access is available."
                : "Connect GitHub to start using CodePilot."
            }
            href="/dashboard/github"
          />

          <InfoBlock
            label="Codebases"
            value={`${data.syncedRepositories} indexed`}
            description="Repositories available as review context."
            href="/dashboard/repos"
          />

          <InfoBlock
            label="Plan"
            value={data.plan === "pro" ? "Pro" : "Free"}
            description={
              data.plan === "pro"
                ? "Unlimited AI reviews."
                : `${remainingReviews ?? 0} reviews remaining this month.`
            }
            href="/dashboard/settings"
          />
        </section>
      </div>
    </main>
  );
}

function Metric({
  label,
  value,
  detail,
}: {
  label: string;
  value: number;
  detail: string;
}) {
  return (
    <div className="bg-background px-5 py-5">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>

      <div className="mt-2 flex items-end justify-between gap-3">
        <p className="text-2xl font-semibold tracking-tight">{value}</p>

        <p className="pb-0.5 text-right text-xs text-muted-foreground">
          {detail}
        </p>
      </div>
    </div>
  );
}

function ReviewRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-sm text-muted-foreground">{label}</span>

      <span className="text-sm font-medium">{value}</span>
    </div>
  );
}

function InfoBlock({
  label,
  value,
  description,
  href,
}: {
  label: string;
  value: string;
  description: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="rounded-lg border border-border p-5 transition-colors hover:bg-muted/40"
    >
      <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
        {label}
      </p>

      <p className="mt-2 text-sm font-semibold">{value}</p>

      <p className="mt-1 text-xs leading-5 text-muted-foreground">
        {description}
      </p>
    </Link>
  );
}
