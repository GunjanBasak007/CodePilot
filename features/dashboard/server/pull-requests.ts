import { prisma } from "@/lib/db";

import type {
  PullRequestListItem,
  PullRequestStatus,
} from "@/features/dashboard/lib/pull-request-types";

function normalizePullRequestStatus(status: string): PullRequestStatus {
  switch (status) {
    case "pending":
    case "processing":
    case "reviewed":
    case "rate_limited":
      return status;
    default:
      return "pending";
  }
}

export async function getUserPullRequests(
  userId: string,
): Promise<PullRequestListItem[]> {
  const installation = await prisma.githubInstallation.findUnique({
    where: {
      userId,
    },
    select: {
      installationId: true,
    },
  });

  if (!installation) {
    return [];
  }

  const pullRequests = await prisma.pullRequest.findMany({
    where: {
      installationId: installation.installationId,
    },
    orderBy: {
      updatedAt: "desc",
    },
    select: {
      id: true,
      repoFullName: true,
      prNumber: true,
      title: true,
      authorLogin: true,
      status: true,
      reviewedAt: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return pullRequests.map((pullRequest) => ({
    ...pullRequest,
    status: normalizePullRequestStatus(pullRequest.status),
  }));
}

export async function getUserPullRequest(
  userId: string,
  pullRequestId: string,
) {
  const installation = await prisma.githubInstallation.findUnique({
    where: {
      userId,
    },
    select: {
      installationId: true,
    },
  });

  if (!installation) {
    return null;
  }

  return prisma.pullRequest.findFirst({
    where: {
      id: pullRequestId,
      installationId: installation.installationId,
    },
    select: {
      id: true,
      repoFullName: true,
      prNumber: true,
      title: true,
      authorLogin: true,
      headSha: true,
      baseBranch: true,
      status: true,
      reviewComment: true,
      reviewedAt: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}