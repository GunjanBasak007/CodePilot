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

export function DashboardOverview({
  data,
}: DashboardOverviewProps) {
  return (
    <main className="flex flex-1 flex-col gap-6 p-6">
      {!data.githubConnected ? (
        <Card>
          <CardHeader>
            <CardTitle>Connect GitHub</CardTitle>
            <CardDescription>
              Connect your GitHub account to start syncing repositories and
              receiving AI-powered pull request reviews.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Button
              nativeButton={false}
              render={<Link href="/dashboard/github" />}
            >
              Connect GitHub
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Workspace Overview</CardTitle>
            <CardDescription>
              {data.accountLogin
                ? `Connected to GitHub as ${data.accountLogin}.`
                : "Your GitHub workspace is connected."}
            </CardDescription>
          </CardHeader>

          <CardContent className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              nativeButton={false}
              render={<Link href="/dashboard/repos" />}
            >
              View Repositories
            </Button>

            <Button
              variant="outline"
              nativeButton={false}
              render={<Link href="/dashboard/pull-request" />}
            >
              View Pull Requests
            </Button>
          </CardContent>
        </Card>
      )}

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader>
            <CardDescription>Repositories</CardDescription>
            <CardTitle className="text-3xl tracking-normal">
              {data.repositories}
            </CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-xs text-muted-foreground">
              {data.syncedRepositories} synced codebase
              {data.syncedRepositories === 1 ? "" : "s"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>Pull Requests</CardDescription>
            <CardTitle className="text-3xl tracking-normal">
              {data.pullRequests}
            </CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-xs text-muted-foreground">
              {data.reviewedPullRequests} reviewed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>In Progress</CardDescription>
            <CardTitle className="text-3xl tracking-normal">
              {data.pendingPullRequests + data.processingPullRequests}
            </CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-xs text-muted-foreground">
              {data.pendingPullRequests} pending ·{" "}
              {data.processingPullRequests} processing
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>AI Reviews This Month</CardDescription>
            <CardTitle className="text-3xl tracking-normal">
              {data.usage.used}
              {data.usage.limit !== null ? ` / ${data.usage.limit}` : ""}
            </CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-xs text-muted-foreground">
              {data.plan === "pro"
                ? "Pro · Unlimited reviews"
                : "Free plan"}
            </p>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Recent Pull Requests</CardTitle>
            <CardDescription>
              Latest pull requests received by CodePilot.
            </CardDescription>
          </CardHeader>

          <CardContent className="p-0">
            {data.recentPullRequests.length === 0 ? (
              <div className="px-8 py-10 text-sm text-muted-foreground">
                No pull requests have been received yet.
              </div>
            ) : (
              <div className="divide-y divide-border">
                {data.recentPullRequests.map((pullRequest) => (
                  <Link
                    key={pullRequest.id}
                    href={`/dashboard/pull-request/${pullRequest.id}`}
                    className="flex items-center justify-between gap-4 px-8 py-4 transition-colors hover:bg-muted/40"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">
                        #{pullRequest.prNumber} {pullRequest.title}
                      </p>

                      <p className="mt-1 truncate text-xs text-muted-foreground">
                        {pullRequest.repoFullName}
                      </p>
                    </div>

                    <div className="flex shrink-0 flex-col items-end gap-2">
                      <span
                        className={statusBadge(
                          getStatusTone(pullRequest.status),
                        )}
                      >
                        {formatStatus(pullRequest.status)}
                      </span>

                      <span className="text-xs text-muted-foreground">
                        {pullRequest.reviewedAt
                          ? formatDistanceToNow(
                              new Date(pullRequest.reviewedAt),
                              { addSuffix: true },
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

        <Card>
          <CardHeader>
            <CardTitle>Review Status</CardTitle>
            <CardDescription>
              Current pull request review distribution.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Reviewed</span>
              <span className="font-medium">
                {data.reviewedPullRequests}
              </span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Processing</span>
              <span className="font-medium">
                {data.processingPullRequests}
              </span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Pending</span>
              <span className="font-medium">
                {data.pendingPullRequests}
              </span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Rate Limited</span>
              <span className="font-medium">
                {data.rateLimitedPullRequests}
              </span>
            </div>

            <div className="border-t border-border pt-4">
              <p className="text-xs text-muted-foreground">
                {data.usage.limit === null
                  ? "Your Pro plan currently has unlimited AI reviews."
                  : `${Math.max(
                      data.usage.limit - data.usage.used,
                      0,
                    )} review${
                      Math.max(data.usage.limit - data.usage.used, 0) === 1
                        ? ""
                        : "s"
                    } remaining this month.`}
              </p>
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}