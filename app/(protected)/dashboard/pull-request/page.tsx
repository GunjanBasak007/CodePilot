import type { Metadata } from "next";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { requireAuth } from "@/features/auth/actions";
import { DashboardHeader } from "@/features/dashboard/components/dashboard-header";
import { PullRequestList } from "@/features/dashboard/components/pull-request-list";
import { DASHBOARD_ROUTES } from "@/features/dashboard/lib/routes";
import { getInstallationStatus } from "@/features/github/server/installation";
import { getUserPullRequests } from "@/features/dashboard/server/pull-requests";

export const metadata: Metadata = {
  title: "Pull Requests · Dashboard",
};

function PullRequestsNotConnected() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 p-6">
      <p className="text-sm text-muted-foreground">
        Install the GitHub App first to see your pull requests.
      </p>

      <Button
        nativeButton={false}
        render={<Link href={DASHBOARD_ROUTES.github} />}
      >
        Go to GitHub App
      </Button>
    </div>
  );
}

export default async function DashboardPullRequestPage() {
  const session = await requireAuth();

  const installation = await getInstallationStatus(session.user.id);

  const header = (
    <DashboardHeader
      title="Pull Requests"
      description="AI-generated reviews for your GitHub pull requests."
    />
  );

  if (!installation.connected) {
    return (
      <>
        {header}
        <PullRequestsNotConnected />
      </>
    );
  }

  const pullRequests = await getUserPullRequests(session.user.id);

  return (
    <>
      {header}
      <PullRequestList pullRequests={pullRequests} />
    </>
  );
}