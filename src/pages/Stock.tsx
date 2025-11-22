import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, AlertCircle, CheckCircle } from "lucide-react";

const Stock = () => {
  const stockData = [
    { name: "High Stock Items", count: 25, icon: CheckCircle, color: "text-success" },
    { name: "Low Stock Items", count: 8, icon: AlertCircle, color: "text-warning" },
    { name: "Out of Stock", count: 3, icon: AlertCircle, color: "text-destructive" },
  ];

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">Stock Management</h1>
        <p className="text-muted-foreground mt-1">Monitor and manage inventory stock levels</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3 mb-6">
        {stockData.map((item) => (
          <Card key={item.name}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{item.name}</CardTitle>
              <item.icon className={`h-4 w-4 ${item.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{item.count}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Stock Overview</CardTitle>
          <CardDescription>Detailed stock level information</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Stock management features coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Stock;
