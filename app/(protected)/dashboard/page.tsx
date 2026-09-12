import type { Metadata } from "next";

import { requireAuth } from "@/features/auth/actions";
import { DashboardHeader } from "@/features/dashboard/components/dashboard-header";
import { DashboardOverview } from "@/features/dashboard/components/dashboard-overview";
import { getDashboardOverview } from "@/features/dashboard/server/overview";

export const metadata: Metadata = {
  title: "Overview",
};

export default async function DashboardPage() {
  const session = await requireAuth();

  const overview = await getDashboardOverview(session.user.id);

  return (
    <>
      <DashboardHeader
        title="Dashboard"
        description="Overview of your CodePilot workspace."
      />

      <DashboardOverview data={overview} />
    </>
  );
}