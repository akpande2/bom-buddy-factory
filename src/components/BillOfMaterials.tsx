import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Package } from "lucide-react";
import { bomData } from "@/data/bomData";

const BillOfMaterials = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredItems = bomData.filter(
    (item) =>
      item.partNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStockStatus = (stockLevel: number, reorderPoint: number) => {
    if (stockLevel < reorderPoint) {
      return { label: "Low Stock", variant: "destructive" as const };
    } else if (stockLevel < reorderPoint * 1.5) {
      return { label: "Medium", variant: "default" as const };
    }
    return { label: "Good", variant: "secondary" as const };
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-foreground">Bill of Materials</h2>
          <div className="relative w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search by part number, description, or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-4 px-4 font-semibold text-sm text-foreground">Part Number</th>
                <th className="text-left py-4 px-4 font-semibold text-sm text-foreground">Description</th>
                <th className="text-left py-4 px-4 font-semibold text-sm text-foreground">Category</th>
                <th className="text-right py-4 px-4 font-semibold text-sm text-foreground">Qty per Unit</th>
                <th className="text-left py-4 px-4 font-semibold text-sm text-foreground">Supplier</th>
                <th className="text-right py-4 px-4 font-semibold text-sm text-foreground">Stock Level</th>
                <th className="text-center py-4 px-4 font-semibold text-sm text-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item) => {
                const status = getStockStatus(item.stockLevel, item.reorderPoint);
                return (
                  <tr
                    key={item.id}
                    className="border-b border-border hover:bg-muted/50 transition-colors"
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4 text-primary" />
                        <span className="font-mono text-sm font-medium text-foreground">
                          {item.partNumber}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-foreground">{item.description}</td>
                    <td className="py-4 px-4">
                      <Badge variant="outline">{item.category}</Badge>
                    </td>
                    <td className="py-4 px-4 text-right text-foreground">
                      {item.quantityPerUnit} {item.unit}
                    </td>
                    <td className="py-4 px-4 text-sm text-muted-foreground">{item.supplier}</td>
                    <td className="py-4 px-4 text-right">
                      <span className="font-semibold text-foreground">{item.stockLevel}</span>
                      <span className="text-xs text-muted-foreground ml-1">
                        (min: {item.reorderPoint})
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <Badge variant={status.variant}>{status.label}</Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default BillOfMaterials;
