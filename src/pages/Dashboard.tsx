import DashboardStats from "@/components/DashboardStats";

const Dashboard = () => {
  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Overview of your inventory and production metrics</p>
      </div>
      <DashboardStats />
    </div>
  );
};

export default Dashboard;
