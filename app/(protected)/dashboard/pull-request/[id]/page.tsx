import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Button } from "@/components/ui/button";

import { requireAuth } from "@/features/auth/actions";
import { DashboardHeader } from "@/features/dashboard/components/dashboard-header";
import { PullRequestReview } from "@/features/dashboard/components/pull-request-review";
import { PullRequestReviewStatus } from "@/features/dashboard/components/pull-request-review-status";
import { getUserPullRequest } from "@/features/dashboard/server/pull-requests";
import { statusBadge } from "@/features/dashboard/lib/status-style";

type PullRequestPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export const metadata: Metadata = {
  title: "Pull Request · Dashboard",
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
    case "rate_limited":
      return "Rate Limited";

    case "pending":
      return "Pending";

    case "processing":
      return "Processing";

    case "reviewed":
      return "Reviewed";

    default:
      return status;
  }
}

export default async function PullRequestDetailPage({
  params,
}: PullRequestPageProps) {
  const session = await requireAuth();
  const { id } = await params;

  const pullRequest = await getUserPullRequest(session.user.id, id);

  if (!pullRequest) {
    notFound();
  }

  const githubUrl = `https://github.com/${pullRequest.repoFullName}/pull/${pullRequest.prNumber}`;

  return (
    <>
      <PullRequestReviewStatus status={pullRequest.status} />

      <DashboardHeader
        title={`Pull Request #${pullRequest.prNumber}`}
        description={pullRequest.repoFullName}
      />

      <main className="flex flex-1 flex-col gap-6 p-6">
        <div>
          <Button
            variant="ghost"
            nativeButton={false}
            render={<Link href="/dashboard/pull-request" />}
            className="px-0"
          >
            ← Back to Pull Requests
          </Button>
        </div>

        <section className="flex flex-col gap-4 border border-border p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <p className="text-sm text-muted-foreground">
                {pullRequest.repoFullName} · #{pullRequest.prNumber}
              </p>

              <h2 className="mt-1 text-lg font-medium">
                {pullRequest.title}
              </h2>

              <p className="mt-2 text-sm text-muted-foreground">
                {pullRequest.authorLogin
                  ? `Opened by ${pullRequest.authorLogin}`
                  : "Author unavailable"}
              </p>
            </div>

            <span className={statusBadge(getStatusTone(pullRequest.status))}>
              {formatStatus(pullRequest.status)}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              nativeButton={false}
              render={
                <a
                  href={githubUrl}
                  target="_blank"
                  rel="noreferrer"
                />
              }
            >
              Open on GitHub ↗
            </Button>

            {pullRequest.reviewedAt ? (
              <span className="text-xs text-muted-foreground">
                Reviewed {new Date(pullRequest.reviewedAt).toLocaleString()}
              </span>
            ) : null}
          </div>
        </section>

        <section className="border border-border p-5">
          <h2 className="text-sm font-medium uppercase tracking-wide">
            AI Review
          </h2>

          <div className="mt-4">
            {pullRequest.reviewComment ? (
              <PullRequestReview review={pullRequest.reviewComment} />
            ) : (
              <p className="text-sm text-muted-foreground">
                {pullRequest.status === "processing"
                  ? "The AI review is currently being generated."
                  : pullRequest.status === "pending"
                    ? "This pull request is waiting to be reviewed."
                    : pullRequest.status === "rate_limited"
                      ? "This pull request could not be reviewed because the account has reached its monthly review limit."
                      : "No review content is available."}
              </p>
            )}
          </div>
        </section>
      </main>
    </>
  );
}