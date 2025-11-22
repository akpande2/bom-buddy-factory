import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Warehouse, TrendingUp, FileText } from "lucide-react";

const InventoryDashboard = () => {
  const stats = [
    {
      title: "Total Items",
      value: "1,247",
      description: "Active inventory items",
      icon: Package,
      trend: "+12%",
    },
    {
      title: "Warehouses",
      value: "8",
      description: "Active storage locations",
      icon: Warehouse,
      trend: "—",
    },
    {
      title: "Stock Value",
      value: "₹45.2L",
      description: "Total inventory worth",
      icon: TrendingUp,
      trend: "+8%",
    },
    {
      title: "GRN Pending",
      value: "23",
      description: "Awaiting goods receipt",
      icon: FileText,
      trend: "-5%",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Inventory Dashboard</h1>
        <p className="text-muted-foreground mt-1">Monitor and manage your inventory operations</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
              <div className="flex items-center mt-2">
                <span className={`text-xs font-medium ${stat.trend.startsWith('+') ? 'text-green-500' : stat.trend.startsWith('-') ? 'text-red-500' : 'text-muted-foreground'}`}>
                  {stat.trend}
                </span>
                <span className="text-xs text-muted-foreground ml-1">from last month</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Overview */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Low Stock Alerts</CardTitle>
            <CardDescription>Items below reorder level</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { name: "Motor Assembly XL", qty: 15, reorder: 50 },
                { name: "Blade Set - 48 inch", qty: 8, reorder: 25 },
                { name: "Capacitor 2.5 μF", qty: 22, reorder: 100 },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium text-sm">{item.name}</p>
                    <p className="text-xs text-muted-foreground">Reorder level: {item.reorder}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-destructive">{item.qty} units</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Stock Movements</CardTitle>
            <CardDescription>Last 5 transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { type: "IN", item: "Copper Winding", qty: "+500", date: "2 hours ago" },
                { type: "OUT", item: "Motor Assembly", qty: "-120", date: "5 hours ago" },
                { type: "IN", item: "Blade Set", qty: "+200", date: "1 day ago" },
              ].map((txn, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold ${
                      txn.type === "IN" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    }`}>
                      {txn.type}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{txn.item}</p>
                      <p className="text-xs text-muted-foreground">{txn.date}</p>
                    </div>
                  </div>
                  <p className={`text-sm font-semibold ${txn.type === "IN" ? "text-green-600" : "text-red-600"}`}>
                    {txn.qty}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InventoryDashboard;
