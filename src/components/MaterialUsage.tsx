import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Calendar, Package } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface UsageRecord {
  id: string;
  date: string;
  partNumber: string;
  description: string;
  quantity: number;
  unit: string;
  orderNumber: string;
  operator: string;
}

const MaterialUsage = () => {
  const { toast } = useToast();
  const [usageRecords] = useState<UsageRecord[]>([
    {
      id: "1",
      date: "2025-01-20",
      partNumber: "MTR-001",
      description: "AC Motor 220V 50Hz",
      quantity: 45,
      unit: "piece",
      orderNumber: "ORD-2025-001",
      operator: "John Smith",
    },
    {
      id: "2",
      date: "2025-01-20",
      partNumber: "BLD-003",
      description: "Fan Blade Assembly 18 inch",
      quantity: 120,
      unit: "set",
      orderNumber: "ORD-2025-002",
      operator: "Sarah Johnson",
    },
    {
      id: "3",
      date: "2025-01-19",
      partNumber: "PCB-007",
      description: "Control Panel PCB",
      quantity: 30,
      unit: "piece",
      orderNumber: "ORD-2025-003",
      operator: "Mike Chen",
    },
    {
      id: "4",
      date: "2025-01-19",
      partNumber: "CBL-012",
      description: "Power Cable 2m",
      quantity: 85,
      unit: "piece",
      orderNumber: "ORD-2025-004",
      operator: "Emily Davis",
    },
    {
      id: "5",
      date: "2025-01-18",
      partNumber: "HSG-002",
      description: "Motor Housing Steel",
      quantity: 62,
      unit: "piece",
      orderNumber: "ORD-2025-005",
      operator: "John Smith",
    },
  ]);

  const handleAddUsage = () => {
    toast({
      title: "Feature Coming Soon",
      description: "Material usage recording interface will be available in the next update.",
    });
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Material Usage Tracking</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Track material consumption for production orders
            </p>
          </div>
          <Button onClick={handleAddUsage} className="gap-2">
            <Plus className="w-4 h-4" />
            Record Usage
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="p-4 bg-muted/30">
            <p className="text-sm text-muted-foreground mb-1">Today's Usage</p>
            <p className="text-2xl font-bold text-foreground">165 items</p>
            <p className="text-xs text-success mt-1">+12% from yesterday</p>
          </Card>
          <Card className="p-4 bg-muted/30">
            <p className="text-sm text-muted-foreground mb-1">This Week</p>
            <p className="text-2xl font-bold text-foreground">847 items</p>
            <p className="text-xs text-success mt-1">+8% from last week</p>
          </Card>
          <Card className="p-4 bg-muted/30">
            <p className="text-sm text-muted-foreground mb-1">This Month</p>
            <p className="text-2xl font-bold text-foreground">3,421 items</p>
            <p className="text-xs text-success mt-1">+18% from last month</p>
          </Card>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-4 px-4 font-semibold text-sm text-foreground">Date</th>
                <th className="text-left py-4 px-4 font-semibold text-sm text-foreground">Part Number</th>
                <th className="text-left py-4 px-4 font-semibold text-sm text-foreground">Description</th>
                <th className="text-right py-4 px-4 font-semibold text-sm text-foreground">Quantity</th>
                <th className="text-left py-4 px-4 font-semibold text-sm text-foreground">Order #</th>
                <th className="text-left py-4 px-4 font-semibold text-sm text-foreground">Operator</th>
              </tr>
            </thead>
            <tbody>
              {usageRecords.map((record) => (
                <tr
                  key={record.id}
                  className="border-b border-border hover:bg-muted/50 transition-colors"
                >
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      {new Date(record.date).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-primary" />
                      <span className="font-mono text-sm font-medium text-foreground">
                        {record.partNumber}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-foreground">{record.description}</td>
                  <td className="py-4 px-4 text-right">
                    <span className="font-semibold text-foreground">{record.quantity}</span>
                    <span className="text-xs text-muted-foreground ml-1">{record.unit}</span>
                  </td>
                  <td className="py-4 px-4">
                    <Badge variant="outline">{record.orderNumber}</Badge>
                  </td>
                  <td className="py-4 px-4 text-sm text-muted-foreground">{record.operator}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default MaterialUsage;
