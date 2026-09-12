"use client";

import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { useMemo, useState } from "react";
import { ArrowUpRightIcon } from "@phosphor-icons/react";

import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { statusBadge } from "../lib/status-style";
import type {
  PullRequestListItem,
  PullRequestStatus,
} from "../lib/pull-request-types";

type Filter =
  | "all"
  | "pending"
  | "processing"
  | "reviewed"
  | "rate_limited";

type PullRequestListProps = {
  pullRequests: PullRequestListItem[];
};

function getStatusTone(
  status: PullRequestStatus,
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

function formatStatus(status: PullRequestStatus) {
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

function getReviewDescription(status: PullRequestStatus) {
  switch (status) {
    case "reviewed":
      return "Review completed";
    case "processing":
      return "Review in progress";
    case "pending":
      return "Waiting for review";
    case "rate_limited":
      return "Monthly limit reached";
    default:
      return "Status unavailable";
  }
}

export function PullRequestList({
  pullRequests,
}: PullRequestListProps) {
  const [filter, setFilter] = useState<Filter>("all");
  const [search, setSearch] = useState("");

  const counts = useMemo(
    () => ({
      all: pullRequests.length,
      pending: pullRequests.filter(
        (pullRequest) => pullRequest.status === "pending",
      ).length,
      processing: pullRequests.filter(
        (pullRequest) => pullRequest.status === "processing",
      ).length,
      reviewed: pullRequests.filter(
        (pullRequest) => pullRequest.status === "reviewed",
      ).length,
      rate_limited: pullRequests.filter(
        (pullRequest) => pullRequest.status === "rate_limited",
      ).length,
    }),
    [pullRequests],
  );

  const visiblePullRequests = useMemo(() => {
    const query = search.trim().toLowerCase();

    return pullRequests.filter((pullRequest) => {
      if (
        filter !== "all" &&
        pullRequest.status !== filter
      ) {
        return false;
      }

      if (!query) {
        return true;
      }

      return (
        pullRequest.repoFullName.toLowerCase().includes(query) ||
        pullRequest.title.toLowerCase().includes(query) ||
        pullRequest.authorLogin?.toLowerCase().includes(query) ||
        `#${pullRequest.prNumber}`.includes(query)
      );
    });
  }, [pullRequests, filter, search]);

  return (
    <div className="flex flex-1 flex-col gap-5 p-6">
      {/* Controls */}
      <section className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="overflow-x-auto">
          <Tabs
            value={filter}
            onValueChange={(value) =>
              setFilter(value as Filter)
            }
          >
            <TabsList>
              <TabsTrigger value="all">
                All ({counts.all})
              </TabsTrigger>

              <TabsTrigger value="pending">
                Pending ({counts.pending})
              </TabsTrigger>

              <TabsTrigger value="processing">
                Processing ({counts.processing})
              </TabsTrigger>

              <TabsTrigger value="reviewed">
                Reviewed ({counts.reviewed})
              </TabsTrigger>

              <TabsTrigger value="rate_limited">
                Rate Limited ({counts.rate_limited})
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <Input
          placeholder="Search pull requests..."
          className="w-full lg:max-w-sm"
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
          }
        />
      </section>

      {/* List */}
      <section className="overflow-hidden rounded-lg border border-border">
        {visiblePullRequests.length === 0 ? (
          <div className="flex min-h-64 items-center justify-center px-6 text-center">
            <div>
              <p className="text-sm font-medium">
                {pullRequests.length === 0
                  ? "No pull requests yet"
                  : "No pull requests match your search"}
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                {pullRequests.length === 0
                  ? "Pull requests received through your connected GitHub repositories will appear here."
                  : "Try a different search term or review status."}
              </p>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {visiblePullRequests.map((pullRequest) => (
              <PullRequestRow
                key={pullRequest.id}
                pullRequest={pullRequest}
              />
            ))}
          </div>
        )}
      </section>

      {visiblePullRequests.length > 0 ? (
        <p className="text-xs text-muted-foreground">
          Showing {visiblePullRequests.length} of{" "}
          {pullRequests.length} pull requests.
        </p>
      ) : null}
    </div>
  );
}

function PullRequestRow({
  pullRequest,
}: {
  pullRequest: PullRequestListItem;
}) {
  const tone = getStatusTone(pullRequest.status);

  const reviewedTime = pullRequest.reviewedAt
    ? formatDistanceToNow(
        new Date(pullRequest.reviewedAt),
        {
          addSuffix: true,
        },
      )
    : null;

  return (
    <Link
      href={`/dashboard/pull-request/${pullRequest.id}`}
      className="group block px-5 py-5 transition-colors hover:bg-muted/30 sm:px-6"
    >
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        {/* Main PR information */}
        <div className="min-w-0 flex-1">
          <div className="flex min-w-0 items-start gap-3">
            <div className="min-w-0 flex-1">
              <div className="flex min-w-0 items-center gap-2">
                <span className="shrink-0 text-xs text-muted-foreground">
                  #{pullRequest.prNumber}
                </span>

                <h3 className="truncate text-sm font-medium">
                  {pullRequest.title}
                </h3>

                <ArrowUpRightIcon className="size-3 shrink-0 opacity-0 transition-opacity group-hover:opacity-100" />
              </div>

              <p className="mt-1 truncate text-xs text-muted-foreground">
                {pullRequest.repoFullName}
              </p>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
            <span>
              {pullRequest.authorLogin ?? "Unknown author"}
            </span>

            <span className="hidden text-border sm:inline">
              /
            </span>

            <span>
              {reviewedTime
                ? `Reviewed ${reviewedTime}`
                : "Not reviewed yet"}
            </span>
          </div>
        </div>

        {/* Review signal */}
        <div className="flex shrink-0 items-start justify-between gap-6 sm:items-center lg:min-w-64 lg:justify-end">
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground">
                Status
            </p>

            <p className="mt-1 text-sm font-medium">
              {getReviewDescription(
                pullRequest.status,
              )}
            </p>
          </div>

          <span className={statusBadge(tone)}>
            {formatStatus(pullRequest.status)}
          </span>
        </div>
      </div>
    </Link>
  );
}