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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { useInventoryStore, type InventoryItem } from "@/stores/inventoryStore";
import { toast } from "sonner";
import { z } from "zod";

const itemSchema = z.object({
  itemName: z.string().trim().min(1, "Item name is required").max(200, "Name too long"),
  sku: z.string().trim().min(1, "SKU is required").max(50, "SKU too long"),
  category: z.string().trim().min(1, "Category is required").max(100, "Category too long"),
  itemType: z.enum(["Raw Material", "Finished Good", "Consumable", "Asset"], {
    required_error: "Item type is required",
  }),
  description: z.string().trim().max(1000, "Description too long").optional(),
  hsnSacCode: z.string().trim().min(1, "HSN/SAC code is required").max(20, "HSN/SAC code too long"),
  gstRate: z.number().refine((val) => [0, 5, 12, 18, 28].includes(val), "Invalid GST rate"),
  uom: z.string().trim().min(1, "Unit of measure is required"),
  openingStock: z.number().min(0, "Opening stock cannot be negative"),
  reorderLevel: z.number().min(0, "Reorder level cannot be negative"),
  maxStockLevel: z.number().min(0, "Max stock level cannot be negative"),
  standardCost: z.number().min(0, "Standard cost cannot be negative"),
  lastPurchasePrice: z.number().min(0, "Last purchase price cannot be negative").optional(),
  status: z.enum(["Active", "Inactive"]),
});

const Items = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [gstFilter, setGstFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [reorderFilter, setReorderFilter] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<InventoryItem | null>(null);

  const { items, addItem, updateItem, deleteItem } = useInventoryStore();

  const [formData, setFormData] = useState({
    itemName: "",
    sku: "",
    category: "",
    itemType: "Raw Material" as "Raw Material" | "Finished Good" | "Consumable" | "Asset",
    description: "",
    hsnSacCode: "",
    gstRate: 18 as 0 | 5 | 12 | 18 | 28,
    uom: "Pcs",
    openingStock: 0,
    reorderLevel: 0,
    maxStockLevel: 0,
    standardCost: 0,
    lastPurchasePrice: 0,
    status: "Active" as "Active" | "Inactive",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Get unique categories
  const categories = useMemo(() => {
    const cats = new Set(items.map(item => item.category));
    return Array.from(cats).sort();
  }, [items]);

  const resetForm = () => {
    setFormData({
      itemName: "",
      sku: "",
      category: "",
      itemType: "Raw Material",
      description: "",
      hsnSacCode: "",
      gstRate: 18,
      uom: "Pcs",
      openingStock: 0,
      reorderLevel: 0,
      maxStockLevel: 0,
      standardCost: 0,
      lastPurchasePrice: 0,
      status: "Active",
    });
    setErrors({});
    setEditingItem(null);
  };

  const handleOpenDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const handleEdit = (item: InventoryItem) => {
    setEditingItem(item);
    setFormData({
      itemName: item.itemName,
      sku: item.sku,
      category: item.category,
      itemType: item.itemType,
      description: item.description || "",
      hsnSacCode: item.hsnSacCode,
      gstRate: item.gstRate,
      uom: item.uom,
      openingStock: item.openingStock,
      reorderLevel: item.reorderLevel,
      maxStockLevel: item.maxStockLevel,
      standardCost: item.standardCost,
      lastPurchasePrice: item.lastPurchasePrice || 0,
      status: item.status,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      const validatedData = itemSchema.parse(formData);

      if (editingItem) {
        updateItem(editingItem.id, {
          itemName: validatedData.itemName,
          sku: validatedData.sku,
          category: validatedData.category,
          itemType: validatedData.itemType,
          description: validatedData.description,
          hsnSacCode: validatedData.hsnSacCode,
          gstRate: validatedData.gstRate as 0 | 5 | 12 | 18 | 28,
          uom: validatedData.uom,
          openingStock: validatedData.openingStock,
          reorderLevel: validatedData.reorderLevel,
          maxStockLevel: validatedData.maxStockLevel,
          standardCost: validatedData.standardCost,
          lastPurchasePrice: validatedData.lastPurchasePrice,
          status: validatedData.status,
        });
        toast.success("Item updated successfully");
      } else {
        const newItem: InventoryItem = {
          id: Date.now().toString(),
          itemName: validatedData.itemName,
          sku: validatedData.sku,
          category: validatedData.category,
          itemType: validatedData.itemType,
          description: validatedData.description,
          hsnSacCode: validatedData.hsnSacCode,
          gstRate: validatedData.gstRate as 0 | 5 | 12 | 18 | 28,
          uom: validatedData.uom,
          openingStock: validatedData.openingStock,
          currentStock: validatedData.openingStock,
          reorderLevel: validatedData.reorderLevel,
          maxStockLevel: validatedData.maxStockLevel,
          standardCost: validatedData.standardCost,
          lastPurchasePrice: validatedData.lastPurchasePrice,
          status: validatedData.status,
        };
        addItem(newItem);
        toast.success("Item added successfully");
      }

      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0].toString()] = err.message;
          }
        });
        setErrors(fieldErrors);
        toast.error("Please fix the validation errors");
      }
    }
  };

  const handleDelete = () => {
    if (deleteDialog) {
      deleteItem(deleteDialog.id);
      toast.success("Item deleted successfully");
      setDeleteDialog(null);
    }
  };

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch =
        item.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.hsnSacCode.includes(searchQuery);

      const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;
      const matchesGst = gstFilter === "all" || item.gstRate.toString() === gstFilter;
      const matchesStatus = statusFilter === "all" || item.status === statusFilter;
      const matchesReorder = reorderFilter === "all" || 
        (reorderFilter === "reorder" && item.currentStock < item.reorderLevel);

      return matchesSearch && matchesCategory && matchesGst && matchesStatus && matchesReorder;
    });
  }, [items, searchQuery, categoryFilter, gstFilter, statusFilter, reorderFilter]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Inventory Items</h1>
          <p className="text-muted-foreground mt-1">Complete catalog of all inventory items</p>
        </div>
        <Button className="gap-2" onClick={handleOpenDialog}>
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
              <SelectContent className="bg-background z-50">
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
              <SelectContent className="bg-background z-50">
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
              <SelectContent className="bg-background z-50">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            <Select value={reorderFilter} onValueChange={setReorderFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Stock Level" />
              </SelectTrigger>
              <SelectContent className="bg-background z-50">
                <SelectItem value="all">All Items</SelectItem>
                <SelectItem value="reorder">Below Reorder Level</SelectItem>
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
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          {item.itemName}
                          {item.currentStock < item.reorderLevel && (
                            <Badge className="bg-red-500 text-white">Reorder Needed</Badge>
                          )}
                        </div>
                      </TableCell>
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
                          <Button variant="ghost" size="icon" title="Edit Item" onClick={() => handleEdit(item)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" title="Delete Item" onClick={() => setDeleteDialog(item)}>
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

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={(open) => {
        setIsDialogOpen(open);
        if (!open) resetForm();
      }}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-background">
          <DialogHeader>
            <DialogTitle>{editingItem ? "Edit Item" : "Add New Item"}</DialogTitle>
            <DialogDescription>
              {editingItem ? "Update item details below" : "Enter item information for inventory"}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* General Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">General Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="itemName">
                    Item Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="itemName"
                    value={formData.itemName}
                    onChange={(e) => setFormData({ ...formData, itemName: e.target.value })}
                  />
                  {errors.itemName && <p className="text-sm text-destructive">{errors.itemName}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sku">
                    SKU / Item Code <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="sku"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value.toUpperCase() })}
                  />
                  {errors.sku && <p className="text-sm text-destructive">{errors.sku}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">
                    Category <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  />
                  {errors.category && <p className="text-sm text-destructive">{errors.category}</p>}
                </div>
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="itemType">
                    Item Type <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={formData.itemType}
                    onValueChange={(val: "Raw Material" | "Finished Good" | "Consumable" | "Asset") =>
                      setFormData({ ...formData, itemType: val })
                    }
                  >
                    <SelectTrigger className="bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-background z-50">
                      <SelectItem value="Raw Material">Raw Material</SelectItem>
                      <SelectItem value="Finished Good">Finished Good</SelectItem>
                      <SelectItem value="Consumable">Consumable</SelectItem>
                      <SelectItem value="Asset">Asset</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.itemType && <p className="text-sm text-destructive">{errors.itemType}</p>}
                </div>
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                  {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
                </div>
              </div>
            </div>

            <Separator />

            {/* India Compliance */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">India Compliance</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="hsnSacCode">
                    HSN/SAC Code <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="hsnSacCode"
                    value={formData.hsnSacCode}
                    onChange={(e) => setFormData({ ...formData, hsnSacCode: e.target.value })}
                    placeholder="e.g., 8501"
                  />
                  {errors.hsnSacCode && <p className="text-sm text-destructive">{errors.hsnSacCode}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gstRate">
                    GST Rate <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={formData.gstRate.toString()}
                    onValueChange={(val) => setFormData({ ...formData, gstRate: parseInt(val) as 0 | 5 | 12 | 18 | 28 })}
                  >
                    <SelectTrigger className="bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-background z-50">
                      <SelectItem value="0">0%</SelectItem>
                      <SelectItem value="5">5%</SelectItem>
                      <SelectItem value="12">12%</SelectItem>
                      <SelectItem value="18">18%</SelectItem>
                      <SelectItem value="28">28%</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.gstRate && <p className="text-sm text-destructive">{errors.gstRate}</p>}
                </div>
              </div>
            </div>

            <Separator />

            {/* Stock Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Stock Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="uom">
                    Unit of Measure <span className="text-destructive">*</span>
                  </Label>
                  <Select value={formData.uom} onValueChange={(val) => setFormData({ ...formData, uom: val })}>
                    <SelectTrigger className="bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-background z-50">
                      <SelectItem value="Pcs">Pieces (Pcs)</SelectItem>
                      <SelectItem value="Kg">Kilograms (Kg)</SelectItem>
                      <SelectItem value="Ltr">Liters (Ltr)</SelectItem>
                      <SelectItem value="Meter">Meters</SelectItem>
                      <SelectItem value="Box">Box</SelectItem>
                      <SelectItem value="Set">Set</SelectItem>
                      <SelectItem value="Roll">Roll</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.uom && <p className="text-sm text-destructive">{errors.uom}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="openingStock">
                    Opening Stock <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="openingStock"
                    type="number"
                    min="0"
                    value={formData.openingStock}
                    onChange={(e) => setFormData({ ...formData, openingStock: parseFloat(e.target.value) || 0 })}
                  />
                  {errors.openingStock && <p className="text-sm text-destructive">{errors.openingStock}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reorderLevel">
                    Reorder Level <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="reorderLevel"
                    type="number"
                    min="0"
                    value={formData.reorderLevel}
                    onChange={(e) => setFormData({ ...formData, reorderLevel: parseFloat(e.target.value) || 0 })}
                  />
                  {errors.reorderLevel && <p className="text-sm text-destructive">{errors.reorderLevel}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxStockLevel">
                    Maximum Stock Level <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="maxStockLevel"
                    type="number"
                    min="0"
                    value={formData.maxStockLevel}
                    onChange={(e) => setFormData({ ...formData, maxStockLevel: parseFloat(e.target.value) || 0 })}
                  />
                  {errors.maxStockLevel && <p className="text-sm text-destructive">{errors.maxStockLevel}</p>}
                </div>
              </div>
            </div>

            <Separator />

            {/* Costing */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Costing</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="standardCost">
                    Standard Cost (₹) <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="standardCost"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.standardCost}
                    onChange={(e) => setFormData({ ...formData, standardCost: parseFloat(e.target.value) || 0 })}
                  />
                  {errors.standardCost && <p className="text-sm text-destructive">{errors.standardCost}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastPurchasePrice">Last Purchase Price (₹)</Label>
                  <Input
                    id="lastPurchasePrice"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.lastPurchasePrice}
                    onChange={(e) => setFormData({ ...formData, lastPurchasePrice: parseFloat(e.target.value) || 0 })}
                  />
                  {errors.lastPurchasePrice && <p className="text-sm text-destructive">{errors.lastPurchasePrice}</p>}
                </div>
              </div>
            </div>

            <Separator />

            {/* Status */}
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(val: "Active" | "Inactive") => setFormData({ ...formData, status: val })}
              >
                <SelectTrigger className="bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-background z-50">
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">{editingItem ? "Update Item" : "Add Item"}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteDialog} onOpenChange={() => setDeleteDialog(null)}>
        <AlertDialogContent className="bg-background">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Item</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deleteDialog?.itemName}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Items;
