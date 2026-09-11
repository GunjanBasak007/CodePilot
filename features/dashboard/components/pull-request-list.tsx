"use client";

import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { useMemo, useState } from "react";
import { ArrowUpRightIcon } from "@phosphor-icons/react";

import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
    <div className="flex flex-1 flex-col gap-4 p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Tabs
          value={filter}
          onValueChange={(value) => setFilter(value as Filter)}
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

        <Input
          placeholder="Search pull requests..."
          className="max-w-xs"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>

      <div className="rounded-none border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Repository</TableHead>
              <TableHead>Pull Request</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">
                Reviewed
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {visiblePullRequests.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="h-24 text-center text-muted-foreground"
                >
                  {pullRequests.length === 0
                    ? "No pull requests found."
                    : "No pull requests match your search."}
                </TableCell>
              </TableRow>
            ) : (
              visiblePullRequests.map((pullRequest) => (
                <PullRequestRow
                  key={pullRequest.id}
                  pullRequest={pullRequest}
                />
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function PullRequestRow({
  pullRequest,
}: {
  pullRequest: PullRequestListItem;
}) {
  const tone = getStatusTone(pullRequest.status);

  return (
    <TableRow>
      <TableCell>
        <span className="font-medium">
          {pullRequest.repoFullName}
        </span>
      </TableCell>

      <TableCell>
        <Link
          href={`/dashboard/pull-request/${pullRequest.id}`}
          className="group inline-flex max-w-80 items-center gap-1"
        >
          <span className="truncate">
            #{pullRequest.prNumber} {pullRequest.title}
          </span>

          <ArrowUpRightIcon className="size-3 shrink-0 opacity-0 transition-opacity group-hover:opacity-100" />
        </Link>
      </TableCell>

      <TableCell className="text-muted-foreground">
        {pullRequest.authorLogin ?? "—"}
      </TableCell>

      <TableCell>
        <span className={statusBadge(tone)}>
          {formatStatus(pullRequest.status)}
        </span>
      </TableCell>

      <TableCell className="text-right text-muted-foreground">
        {pullRequest.reviewedAt
          ? formatDistanceToNow(
              new Date(pullRequest.reviewedAt),
              {
                addSuffix: true,
              },
            )
          : "—"}
      </TableCell>
    </TableRow>
  );
}