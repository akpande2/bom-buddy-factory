import { useState, useMemo } from "react";
import { Plus, Search, Eye, Pencil, Trash2 } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface InventoryItem {
  id: string;
  itemName: string;
  sku: string;
  hsnSacCode: string;
  uom: string;
  openingStock: number;
  currentStock: number;
  gstRate: 5 | 12 | 18 | 28;
  category: string;
  status: "Active" | "Inactive";
}

const Items = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [gstFilter, setGstFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const [items] = useState<InventoryItem[]>([
    { id: "1", itemName: "Motor Assembly XL", sku: "MTR-001", hsnSacCode: "8501", uom: "Pcs", openingStock: 100, currentStock: 145, gstRate: 18, category: "Motors", status: "Active" },
    { id: "2", itemName: "Blade Set - 48 inch", sku: "BLD-048", hsnSacCode: "8414", uom: "Set", openingStock: 50, currentStock: 78, gstRate: 18, category: "Blades", status: "Active" },
    { id: "3", itemName: "Capacitor 2.5 μF", sku: "CAP-2.5", hsnSacCode: "8532", uom: "Pcs", openingStock: 500, currentStock: 322, gstRate: 18, category: "Electrical", status: "Active" },
    { id: "4", itemName: "Copper Winding Wire", sku: "COP-WND", hsnSacCode: "7408", uom: "Kg", openingStock: 1000, currentStock: 856, gstRate: 18, category: "Raw Material", status: "Active" },
    { id: "5", itemName: "Plastic Base Plate", sku: "PLT-BASE", hsnSacCode: "3926", uom: "Pcs", openingStock: 80, currentStock: 42, gstRate: 18, category: "Components", status: "Active" },
    { id: "6", itemName: "Mounting Bracket", sku: "BRK-MNT", hsnSacCode: "7326", uom: "Pcs", openingStock: 200, currentStock: 167, gstRate: 18, category: "Hardware", status: "Active" },
    { id: "7", itemName: "Regulator Panel", sku: "REG-PNL", hsnSacCode: "8537", uom: "Pcs", openingStock: 75, currentStock: 58, gstRate: 28, category: "Electrical", status: "Active" },
    { id: "8", itemName: "Cable Wire 3-Core", sku: "CBL-3CR", hsnSacCode: "8544", uom: "Meter", openingStock: 1500, currentStock: 1234, gstRate: 18, category: "Electrical", status: "Active" },
    { id: "9", itemName: "Ball Bearing 6203", sku: "BRG-6203", hsnSacCode: "8482", uom: "Pcs", openingStock: 300, currentStock: 245, gstRate: 18, category: "Hardware", status: "Active" },
    { id: "10", itemName: "Paint - Enamel White", sku: "PNT-WHT", hsnSacCode: "3208", uom: "Ltr", openingStock: 100, currentStock: 23, gstRate: 28, category: "Finishing", status: "Inactive" },
    { id: "11", itemName: "Packaging Box - Medium", sku: "PKG-MD", hsnSacCode: "4819", uom: "Pcs", openingStock: 500, currentStock: 342, gstRate: 12, category: "Packaging", status: "Active" },
    { id: "12", itemName: "Assembly Screws M4", sku: "SCR-M4", hsnSacCode: "7318", uom: "Pcs", openingStock: 5000, currentStock: 3456, gstRate: 18, category: "Hardware", status: "Active" },
  ]);

  // Get unique categories
  const categories = useMemo(() => {
    const cats = new Set(items.map(item => item.category));
    return Array.from(cats).sort();
  }, [items]);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch =
        item.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.hsnSacCode.includes(searchQuery);

      const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;
      const matchesGst = gstFilter === "all" || item.gstRate.toString() === gstFilter;
      const matchesStatus = statusFilter === "all" || item.status === statusFilter;

      return matchesSearch && matchesCategory && matchesGst && matchesStatus;
    });
  }, [items, searchQuery, categoryFilter, gstFilter, statusFilter]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Inventory Items</h1>
          <p className="text-muted-foreground mt-1">Complete catalog of all inventory items</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add New Item
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Items List</CardTitle>
          <CardDescription>Search, filter, and manage inventory items</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, SKU, or HSN code..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={gstFilter} onValueChange={setGstFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="GST Rate" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All GST Rates</SelectItem>
                <SelectItem value="5">5%</SelectItem>
                <SelectItem value="12">12%</SelectItem>
                <SelectItem value="18">18%</SelectItem>
                <SelectItem value="28">28%</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Results count */}
          <div className="text-sm text-muted-foreground">
            Showing {filteredItems.length} of {items.length} items
          </div>

          {/* Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item Name</TableHead>
                  <TableHead>SKU / Item Code</TableHead>
                  <TableHead>HSN/SAC Code</TableHead>
                  <TableHead>UoM</TableHead>
                  <TableHead className="text-right">Opening Stock</TableHead>
                  <TableHead className="text-right">Current Stock</TableHead>
                  <TableHead>GST Rate</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.length > 0 ? (
                  filteredItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.itemName}</TableCell>
                      <TableCell className="font-mono text-sm">{item.sku}</TableCell>
                      <TableCell className="font-mono text-sm">{item.hsnSacCode}</TableCell>
                      <TableCell>{item.uom}</TableCell>
                      <TableCell className="text-right">{item.openingStock}</TableCell>
                      <TableCell className="text-right font-semibold">
                        {item.currentStock}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-mono">
                          {item.gstRate}%
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={item.status === "Active" ? "default" : "secondary"}>
                          {item.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" title="View Details">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" title="Edit Item">
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" title="Delete Item">
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                      No items found matching your criteria
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Items;
