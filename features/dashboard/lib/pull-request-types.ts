export type PullRequestStatus =
  | "pending"
  | "processing"
  | "reviewed"
  | "rate_limited";

export type PullRequestListItem = {
  id: string;
  repoFullName: string;
  prNumber: number;
  title: string;
  authorLogin: string | null;
  status: PullRequestStatus;
  reviewedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};