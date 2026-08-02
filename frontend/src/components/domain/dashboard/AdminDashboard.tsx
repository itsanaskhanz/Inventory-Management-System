import { Icon, StatCard } from "@/components/ui";

const AdminDashboard = () => {
  return (
    <div>
      <div className="flex flex-col gap-6">
        {/* here show state card componet of total users  */}
        <StatCard
          title="Total Products"
          value="100"
          icon={<Icon name="Package" />}
          variant="secondary"
        />
        <StatCard
          title="Total Categories"
          value="100"
          icon={<Icon name="LayoutGrid" />}
          variant="secondary"
        />
        <StatCard
          title="Total Revenue"
          value="100"
          icon={<Icon name="TrendingUp" />}
          variant="secondary"
        />
      </div>
    </div>
  );
};

export default AdminDashboard;
