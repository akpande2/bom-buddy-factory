import { useState } from "react";
import { Plus, MapPin, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Warehouse {
  id: string;
  name: string;
  code: string;
  location: string;
  capacity: number;
  occupied: number;
  status: "Active" | "Inactive";
  type: "Main" | "Regional" | "Transit";
}

const Warehouses = () => {
  const [warehouses] = useState<Warehouse[]>([
    { id: "1", name: "Main Manufacturing Warehouse", code: "WH-001", location: "Pune, Maharashtra", capacity: 10000, occupied: 7200, status: "Active", type: "Main" },
    { id: "2", name: "Regional Warehouse - North", code: "WH-002", location: "Delhi, NCR", capacity: 5000, occupied: 3800, status: "Active", type: "Regional" },
    { id: "3", name: "Regional Warehouse - South", code: "WH-003", location: "Bangalore, Karnataka", capacity: 5000, occupied: 4200, status: "Active", type: "Regional" },
    { id: "4", name: "Transit Hub - Mumbai", code: "WH-004", location: "Mumbai, Maharashtra", capacity: 2000, occupied: 800, status: "Active", type: "Transit" },
    { id: "5", name: "Regional Warehouse - East", code: "WH-005", location: "Kolkata, West Bengal", capacity: 4000, occupied: 2100, status: "Inactive", type: "Regional" },
  ]);

  const getOccupancyPercentage = (occupied: number, capacity: number) => {
    return Math.round((occupied / capacity) * 100);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Warehouses</h1>
          <p className="text-muted-foreground mt-1">Manage storage locations and capacity</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Warehouse
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {warehouses.map((warehouse) => {
          const occupancyPercent = getOccupancyPercentage(warehouse.occupied, warehouse.capacity);
          return (
            <Card key={warehouse.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{warehouse.name}</CardTitle>
                    <CardDescription className="mt-1">{warehouse.code}</CardDescription>
                  </div>
                  <Badge variant={warehouse.status === "Active" ? "default" : "secondary"}>
                    {warehouse.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{warehouse.location}</span>
                </div>

                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Capacity Usage</span>
                    <span className="font-semibold">{occupancyPercent}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2.5">
                    <div
                      className={`h-2.5 rounded-full transition-all ${
                        occupancyPercent >= 80
                          ? "bg-destructive"
                          : occupancyPercent >= 60
                          ? "bg-yellow-500"
                          : "bg-primary"
                      }`}
                      style={{ width: `${occupancyPercent}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground mt-1">
                    <span>{warehouse.occupied} units</span>
                    <span>{warehouse.capacity} total</span>
                  </div>
                </div>

                <div className="pt-2 border-t">
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-muted-foreground" />
                    <Badge variant="outline">{warehouse.type}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default Warehouses;
