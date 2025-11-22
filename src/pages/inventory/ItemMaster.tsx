import { useState } from "react";
import { Plus, Search, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface Item {
  id: string;
  itemCode: string;
  name: string;
  category: string;
  uom: string;
  reorderLevel: number;
  currentStock: number;
  status: "Active" | "Inactive";
}

const ItemMaster = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [items] = useState<Item[]>([
    { id: "1", itemCode: "MTR-001", name: "Motor Assembly XL", category: "Motors", uom: "Pcs", reorderLevel: 50, currentStock: 145, status: "Active" },
    { id: "2", itemCode: "BLD-048", name: "Blade Set - 48 inch", category: "Blades", uom: "Set", reorderLevel: 25, currentStock: 78, status: "Active" },
    { id: "3", itemCode: "CAP-2.5", name: "Capacitor 2.5 μF", category: "Electrical", uom: "Pcs", reorderLevel: 100, currentStock: 322, status: "Active" },
    { id: "4", itemCode: "COP-WND", name: "Copper Winding", category: "Raw Material", uom: "Kg", reorderLevel: 200, currentStock: 856, status: "Active" },
    { id: "5", itemCode: "PLT-BASE", name: "Plastic Base", category: "Components", uom: "Pcs", reorderLevel: 75, currentStock: 42, status: "Inactive" },
  ]);

  const filteredItems = items.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.itemCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Item Master</h1>
          <p className="text-muted-foreground mt-1">Manage inventory items and their details</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add New Item
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Items Catalog</CardTitle>
          <CardDescription>Search and manage all inventory items</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by item code, name, or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item Code</TableHead>
                  <TableHead>Item Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>UOM</TableHead>
                  <TableHead>Reorder Level</TableHead>
                  <TableHead>Current Stock</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-mono text-sm">{item.itemCode}</TableCell>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{item.category}</Badge>
                    </TableCell>
                    <TableCell>{item.uom}</TableCell>
                    <TableCell>{item.reorderLevel}</TableCell>
                    <TableCell>
                      <span className={item.currentStock < item.reorderLevel ? "text-destructive font-semibold" : ""}>
                        {item.currentStock}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={item.status === "Active" ? "default" : "secondary"}>
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ItemMaster;
