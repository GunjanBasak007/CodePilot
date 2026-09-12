import { getUserInstallationId } from "@/features/github/server/installation";
import { getInstallationReposPage } from "@/features/github/server/repos";
import { getUserSubscription } from "@/features/billing/server/subscription";
import { getUsageSummary } from "@/features/billing/server/usage";
import { prisma } from "@/lib/db";

export type DashboardOverviewData = {
  githubConnected: boolean;
  accountLogin: string | null;
  repositories: number;
  syncedRepositories: number;
  pullRequests: number;
  reviewedPullRequests: number;
  pendingPullRequests: number;
  processingPullRequests: number;
  rateLimitedPullRequests: number;
  usage: {
    used: number;
    limit: number | null;
  };
  plan: "free" | "pro";
  recentPullRequests: Array<{
    id: string;
    repoFullName: string;
    prNumber: number;
    title: string;
    status: string;
    reviewedAt: Date | null;
  }>;
};

export async function getDashboardOverview(
  userId: string,
): Promise<DashboardOverviewData> {
  const installation = await prisma.githubInstallation.findUnique({
    where: {
      userId,
    },
    select: {
      installationId: true,
      accountLogin: true,
    },
  });

  const githubConnected = Boolean(installation);

  let repositories = 0;

  if (installation) {
    const repoPage = await getInstallationReposPage(
      installation.installationId,
      1,
    );

    repositories = repoPage.totalCount;
  }

  const [
    syncedRepositories,
    pullRequests,
    reviewedPullRequests,
    pendingPullRequests,
    processingPullRequests,
    rateLimitedPullRequests,
    recentPullRequests,
    usage,
    subscription,
  ] = await Promise.all([
    installation
      ? prisma.repoSync.count({
          where: {
            installationId: installation.installationId,
            status: "synced",
          },
        })
      : 0,

    installation
      ? prisma.pullRequest.count({
          where: {
            installationId: installation.installationId,
          },
        })
      : 0,

    installation
      ? prisma.pullRequest.count({
          where: {
            installationId: installation.installationId,
            status: "reviewed",
          },
        })
      : 0,

    installation
      ? prisma.pullRequest.count({
          where: {
            installationId: installation.installationId,
            status: "pending",
          },
        })
      : 0,

    installation
      ? prisma.pullRequest.count({
          where: {
            installationId: installation.installationId,
            status: "processing",
          },
        })
      : 0,

    installation
      ? prisma.pullRequest.count({
          where: {
            installationId: installation.installationId,
            status: "rate_limited",
          },
        })
      : 0,

    installation
      ? prisma.pullRequest.findMany({
          where: {
            installationId: installation.installationId,
          },
          orderBy: {
            updatedAt: "desc",
          },
          take: 5,
          select: {
            id: true,
            repoFullName: true,
            prNumber: true,
            title: true,
            status: true,
            reviewedAt: true,
          },
        })
      : [],

    getUsageSummary(userId),

    getUserSubscription(userId),
  ]);

  return {
    githubConnected,
    accountLogin: installation?.accountLogin ?? null,
    repositories,
    syncedRepositories,
    pullRequests,
    reviewedPullRequests,
    pendingPullRequests,
    processingPullRequests,
    rateLimitedPullRequests,
    usage,
    plan: subscription.plan,
    recentPullRequests,
  };
}