import { Card } from "@/components/ui/card";
import { Package, TrendingUp, AlertCircle, CheckCircle } from "lucide-react";

const DashboardStats = () => {
  const stats = [
    {
      title: "Total Components",
      value: "245",
      change: "+12%",
      icon: Package,
      trend: "up",
      color: "text-primary",
    },
    {
      title: "Active Materials",
      value: "189",
      change: "+5%",
      icon: CheckCircle,
      trend: "up",
      color: "text-success",
    },
    {
      title: "Low Stock Items",
      value: "23",
      change: "+8",
      icon: AlertCircle,
      trend: "warning",
      color: "text-warning",
    },
    {
      title: "Usage This Month",
      value: "1,247",
      change: "+18%",
      icon: TrendingUp,
      trend: "up",
      color: "text-secondary",
    },
  ];

  const recentActivity = [
    { item: "Motor Assembly Unit", action: "Used", quantity: 45, time: "2 hours ago", status: "success" },
    { item: "Fan Blade Set", action: "Used", quantity: 120, time: "4 hours ago", status: "success" },
    { item: "Bearing Component", action: "Low Stock Alert", quantity: 15, time: "6 hours ago", status: "warning" },
    { item: "Control Panel PCB", action: "Used", quantity: 30, time: "8 hours ago", status: "success" },
    { item: "Power Cable Assembly", action: "Used", quantity: 85, time: "1 day ago", status: "success" },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                  <p className={`text-sm font-medium ${stat.color}`}>{stat.change} from last month</p>
                </div>
                <div className={`p-3 bg-muted rounded-lg ${stat.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <Card className="p-6">
        <h2 className="text-xl font-bold text-foreground mb-6">Recent Activity</h2>
        <div className="space-y-4">
          {recentActivity.map((activity, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-2 h-2 rounded-full ${
                    activity.status === "success" ? "bg-success" : "bg-warning"
                  }`}
                />
                <div>
                  <p className="font-medium text-foreground">{activity.item}</p>
                  <p className="text-sm text-muted-foreground">{activity.action}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-foreground">{activity.quantity} units</p>
                <p className="text-sm text-muted-foreground">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default DashboardStats;
