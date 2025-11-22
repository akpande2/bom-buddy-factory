import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Pencil, Trash2, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useWarehouseStore, type Bin } from "@/stores/warehouseStore";
import { toast } from "sonner";
import { z } from "zod";

const binSchema = z.object({
  binCode: z.string().trim().min(1, "Bin code is required").max(20, "Code too long"),
  rackNumber: z.string().trim().min(1, "Rack number is required").max(20, "Rack number too long"),
  capacity: z.number().min(1, "Capacity must be greater than 0"),
});

const WarehouseDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getWarehouseById, updateWarehouse } = useWarehouseStore();

  const warehouse = id ? getWarehouseById(id) : null;

  const [isBinDialogOpen, setIsBinDialogOpen] = useState(false);
  const [editingBin, setEditingBin] = useState<Bin | null>(null);
  const [deleteBinDialog, setDeleteBinDialog] = useState<Bin | null>(null);

  const [binFormData, setBinFormData] = useState({
    binCode: "",
    rackNumber: "",
    capacity: 100,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!warehouse) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground">Warehouse Not Found</h2>
          <p className="text-muted-foreground mt-2">The warehouse you're looking for doesn't exist.</p>
          <Button className="mt-4" onClick={() => navigate("/inventory/warehouses")}>
            Back to Warehouses
          </Button>
        </div>
      </div>
    );
  }

  const getOccupancyPercentage = (occupied: number, capacity: number) => {
    return Math.round((occupied / capacity) * 100);
  };

  const resetBinForm = () => {
    setBinFormData({
      binCode: "",
      rackNumber: "",
      capacity: 100,
    });
    setErrors({});
    setEditingBin(null);
  };

  const handleOpenBinDialog = () => {
    resetBinForm();
    setIsBinDialogOpen(true);
  };

  const handleEditBin = (bin: Bin) => {
    setEditingBin(bin);
    setBinFormData({
      binCode: bin.binCode,
      rackNumber: bin.rackNumber,
      capacity: bin.capacity,
    });
    setIsBinDialogOpen(true);
  };

  const handleSubmitBin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      const validatedData = binSchema.parse(binFormData);

      const currentBins = warehouse.bins || [];

      if (editingBin) {
        const updatedBins = currentBins.map((bin) =>
          bin.id === editingBin.id
            ? {
                ...bin,
                binCode: validatedData.binCode,
                rackNumber: validatedData.rackNumber,
                capacity: validatedData.capacity,
              }
            : bin
        );
        updateWarehouse(warehouse.id, { bins: updatedBins });
        toast.success("Bin updated successfully");
      } else {
        const newBin: Bin = {
          id: Date.now().toString(),
          binCode: validatedData.binCode,
          rackNumber: validatedData.rackNumber,
          capacity: validatedData.capacity,
          occupied: 0,
          assignedItems: [],
        };
        updateWarehouse(warehouse.id, { bins: [...currentBins, newBin] });
        toast.success("Bin added successfully");
      }

      setIsBinDialogOpen(false);
      resetBinForm();
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

  const handleDeleteBin = () => {
    if (deleteBinDialog && warehouse.bins) {
      const updatedBins = warehouse.bins.filter((bin) => bin.id !== deleteBinDialog.id);
      updateWarehouse(warehouse.id, { bins: updatedBins });
      toast.success("Bin deleted successfully");
      setDeleteBinDialog(null);
    }
  };

  const occupancyPercent = getOccupancyPercentage(warehouse.occupied, warehouse.capacity);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/inventory/warehouses")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-foreground">{warehouse.name}</h1>
          <p className="text-muted-foreground mt-1">
            <span className="font-mono">{warehouse.code}</span> • {warehouse.location}
          </p>
        </div>
        <Badge variant={warehouse.status === "Active" ? "default" : "secondary"}>
          {warehouse.status}
        </Badge>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="bins">Bins & Racks</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 mt-6">
          {/* Stats Grid */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{warehouse.itemCount}</div>
                <p className="text-xs text-muted-foreground mt-1">Items in warehouse</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Capacity Usage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{occupancyPercent}%</div>
                <div className="mt-2">
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        occupancyPercent >= 80
                          ? "bg-destructive"
                          : occupancyPercent >= 60
                          ? "bg-yellow-500"
                          : "bg-primary"
                      }`}
                      style={{ width: `${occupancyPercent}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {warehouse.occupied} / {warehouse.capacity} units
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Warehouse Type</CardTitle>
              </CardHeader>
              <CardContent>
                <Badge variant="outline" className="text-base">
                  {warehouse.type}
                </Badge>
              </CardContent>
            </Card>
          </div>

          {/* Details */}
          <Card>
            <CardHeader>
              <CardTitle>Warehouse Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Manager</Label>
                  <p className="font-medium">{warehouse.manager}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Contact</Label>
                  <p className="font-medium font-mono">{warehouse.contact}</p>
                </div>
                <div className="col-span-2">
                  <Label className="text-muted-foreground">Location</Label>
                  <p className="font-medium">{warehouse.location}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bins" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Bins & Racks</CardTitle>
                  <CardDescription>Manage storage bins and rack assignments</CardDescription>
                </div>
                <Button className="gap-2" onClick={handleOpenBinDialog}>
                  <Plus className="h-4 w-4" />
                  Add Bin
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {warehouse.bins && warehouse.bins.length > 0 ? (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Bin Code</TableHead>
                        <TableHead>Rack Number</TableHead>
                        <TableHead className="text-right">Capacity</TableHead>
                        <TableHead className="text-right">Occupied</TableHead>
                        <TableHead>Usage</TableHead>
                        <TableHead>Assigned Items</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {warehouse.bins.map((bin) => {
                        const binOccupancy = getOccupancyPercentage(bin.occupied, bin.capacity);
                        return (
                          <TableRow key={bin.id}>
                            <TableCell className="font-mono font-medium">{bin.binCode}</TableCell>
                            <TableCell className="font-mono">{bin.rackNumber}</TableCell>
                            <TableCell className="text-right">{bin.capacity}</TableCell>
                            <TableCell className="text-right">{bin.occupied}</TableCell>
                            <TableCell>
                              <div className="space-y-1 min-w-[120px]">
                                <div className="text-xs font-medium">{binOccupancy}%</div>
                                <div className="w-full bg-muted rounded-full h-1.5">
                                  <div
                                    className={`h-1.5 rounded-full ${
                                      binOccupancy >= 80
                                        ? "bg-destructive"
                                        : binOccupancy >= 60
                                        ? "bg-yellow-500"
                                        : "bg-primary"
                                    }`}
                                    style={{ width: `${binOccupancy}%` }}
                                  />
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              {bin.assignedItems && bin.assignedItems.length > 0 ? (
                                <div className="flex items-center gap-2">
                                  <Package className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-sm">{bin.assignedItems.length} items</span>
                                </div>
                              ) : (
                                <span className="text-sm text-muted-foreground">No items</span>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button variant="ghost" size="icon" onClick={() => handleEditBin(bin)}>
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => setDeleteBinDialog(bin)}>
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-12 border rounded-lg border-dashed">
                  <p className="text-muted-foreground mb-4">No bins configured yet</p>
                  <Button onClick={handleOpenBinDialog}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add First Bin
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add/Edit Bin Dialog */}
      <Dialog open={isBinDialogOpen} onOpenChange={(open) => {
        setIsBinDialogOpen(open);
        if (!open) resetBinForm();
      }}>
        <DialogContent className="max-w-lg bg-background">
          <DialogHeader>
            <DialogTitle>{editingBin ? "Edit Bin" : "Add New Bin"}</DialogTitle>
            <DialogDescription>
              {editingBin ? "Update bin details" : "Create a new storage bin"}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmitBin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="binCode">
                Bin Code <span className="text-destructive">*</span>
              </Label>
              <Input
                id="binCode"
                value={binFormData.binCode}
                onChange={(e) => setBinFormData({ ...binFormData, binCode: e.target.value.toUpperCase() })}
                placeholder="BIN-A01"
              />
              {errors.binCode && <p className="text-sm text-destructive">{errors.binCode}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="rackNumber">
                Rack Number <span className="text-destructive">*</span>
              </Label>
              <Input
                id="rackNumber"
                value={binFormData.rackNumber}
                onChange={(e) => setBinFormData({ ...binFormData, rackNumber: e.target.value.toUpperCase() })}
                placeholder="RACK-01"
              />
              {errors.rackNumber && <p className="text-sm text-destructive">{errors.rackNumber}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="capacity">
                Capacity (units) <span className="text-destructive">*</span>
              </Label>
              <Input
                id="capacity"
                type="number"
                min="1"
                value={binFormData.capacity}
                onChange={(e) => setBinFormData({ ...binFormData, capacity: parseInt(e.target.value) || 1 })}
              />
              {errors.capacity && <p className="text-sm text-destructive">{errors.capacity}</p>}
            </div>

            <Separator />

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsBinDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">{editingBin ? "Update Bin" : "Add Bin"}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteBinDialog} onOpenChange={() => setDeleteBinDialog(null)}>
        <AlertDialogContent className="bg-background">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Bin</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete bin "{deleteBinDialog?.binCode}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteBin} className="bg-destructive hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default WarehouseDetail;
