import { Icon, StatCard } from "@/components/ui";

const SuperAdminDashboard = () => {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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
