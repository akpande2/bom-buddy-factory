import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const PurchaseOrders = () => {
  const orders = [
    { id: "PO-001", supplier: "Bajaj", items: 5, status: "Pending", date: "2024-01-15" },
    { id: "PO-002", supplier: "Maharaja", items: 3, status: "Approved", date: "2024-01-14" },
    { id: "PO-003", supplier: "Bajaj", items: 8, status: "Delivered", date: "2024-01-12" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending": return "bg-warning text-warning-foreground";
      case "Approved": return "bg-primary text-primary-foreground";
      case "Delivered": return "bg-success text-success-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">Purchase Orders</h1>
        <p className="text-muted-foreground mt-1">Manage and track purchase orders</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Purchase Orders</CardTitle>
          <CardDescription>View and manage your purchase orders</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="flex items-center justify-between border-b border-border pb-4 last:border-0">
                <div>
                  <p className="font-medium">{order.id}</p>
                  <p className="text-sm text-muted-foreground">{order.supplier} • {order.items} items</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground">{order.date}</span>
                  <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PurchaseOrders;
