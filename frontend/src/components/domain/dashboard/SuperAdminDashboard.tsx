import { Icon, StatCard } from "@/components/ui";

const SuperAdminDashboard = () => {
  return (
    <div className="flex flex-col gap-6">
      {/* here show state card componet of total users  */}
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
  );
};

export default SuperAdminDashboard;
