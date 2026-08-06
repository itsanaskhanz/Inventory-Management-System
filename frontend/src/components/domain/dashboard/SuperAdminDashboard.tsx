import { Icon, StatCard, PageHeader } from "@/components/ui";

const SuperAdminDashboard = () => {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Overview"
        description="A high-level view of your platform"
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard
          title="Total Users"
          value="100"
          icon={<Icon name="Users" />}
          variant="secondary"
        />
        <StatCard
          title="UnPaid Users"
          value="50"
          icon={<Icon name="Users" />}
          variant="secondary"
        />
        <StatCard
          title="Paid Users"
          value="50"
          icon={<Icon name="Users" />}
          variant="secondary"
        />
      </div>
    </div>
  );
};

export default SuperAdminDashboard;