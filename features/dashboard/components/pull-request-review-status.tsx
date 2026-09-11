"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

type PullRequestReviewStatusProps = {
  status: string;
};

export function PullRequestReviewStatus({
  status,
}: PullRequestReviewStatusProps) {
  const router = useRouter();

  useEffect(() => {
    if (status !== "pending" && status !== "processing") {
      return;
    }

    const interval = setInterval(() => {
      router.refresh();
    }, 5000);

    return () => clearInterval(interval);
  }, [router, status]);

  return null;
}