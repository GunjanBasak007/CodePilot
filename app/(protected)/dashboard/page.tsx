import { DashboardHeader } from "@/features/dashboard/components/dashboard-header";
import { DashboardOverview } from "@/features/dashboard/components/dashboard-overview";
import { getDashboardOverview } from "@/features/dashboard/server/overview";
import { requireAuth } from "@/features/auth/actions";

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