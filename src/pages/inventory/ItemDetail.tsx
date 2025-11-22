import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Edit, Package, TrendingUp, FileText, History, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { useInventoryStore } from "@/stores/inventoryStore";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";

const adjustStockSchema = z.object({
  adjustment: z.coerce.number().refine((val) => val !== 0, "Adjustment cannot be zero"),
  reason: z.string().min(1, "Reason is required").max(500, "Reason too long"),
});

const ItemDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { getItemById } = useInventoryStore();
  const [adjustDialogOpen, setAdjustDialogOpen] = useState(false);
  const [valuationMethod, setValuationMethod] = useState("FIFO");

  const item = getItemById(id || "");

  const adjustForm = useForm<z.infer<typeof adjustStockSchema>>({
    resolver: zodResolver(adjustStockSchema),
    defaultValues: {
      adjustment: 0,
      reason: "",
    },
  });

  // Mock stock history data
  const stockHistory = [
    { date: "2025-11-22", type: "GRN", quantity: 50, balance: 145, reference: "GRN-2024-001" },
    { date: "2025-11-21", type: "Issue", quantity: -30, balance: 95, reference: "WO-2024-889" },
    { date: "2025-11-20", type: "GRN", quantity: 100, balance: 125, reference: "GRN-2024-002" },
    { date: "2025-11-19", type: "Issue", quantity: -20, balance: 25, reference: "WO-2024-887" },
    { date: "2025-11-18", type: "Adjustment", quantity: 5, balance: 45, reference: "ADJ-2024-001" },
  ];

  // Mock price history data
  const priceHistory = [
    { date: "2025-11-22", price: 1250, supplier: "Acme Motors Ltd", po: "PO-2024-156" },
    { date: "2025-10-15", price: 1200, supplier: "Acme Motors Ltd", po: "PO-2024-142" },
    { date: "2025-09-08", price: 1180, supplier: "XYZ Components", po: "PO-2024-128" },
    { date: "2025-08-12", price: 1220, supplier: "Acme Motors Ltd", po: "PO-2024-115" },
  ];

  // Mock linked POs & GRNs
  const linkedDocuments = [
    { type: "PO", number: "PO-2024-156", date: "2025-11-20", status: "Completed", quantity: 50 },
    { type: "GRN", number: "GRN-2024-001", date: "2025-11-22", status: "Received", quantity: 50 },
    { type: "PO", number: "PO-2024-142", date: "2025-10-10", status: "Completed", quantity: 100 },
    { type: "GRN", number: "GRN-2024-002", date: "2025-10-15", status: "Received", quantity: 100 },
  ];

  // Mock valuation data
  const valuationData = valuationMethod === "FIFO" ? [
    { batch: "Batch-001", date: "2025-10-15", quantity: 75, unitCost: 1200, totalValue: 90000, age: 38 },
    { batch: "Batch-002", date: "2025-11-22", quantity: 50, unitCost: 1250, totalValue: 62500, age: 0 },
    { batch: "Batch-003", date: "2025-09-08", quantity: 20, unitCost: 1180, totalValue: 23600, age: 75 },
  ] : [
    { batch: "WAVG-001", date: "2025-11-22", quantity: 145, unitCost: 1215, totalValue: 176175, age: 0 },
  ];

  const onAdjustStock = (values: z.infer<typeof adjustStockSchema>) => {
    // In a real app, this would update the stock ledger and item
    toast({
      title: "Stock Adjusted",
      description: `Stock adjusted by ${values.adjustment > 0 ? '+' : ''}${values.adjustment} units`,
    });
    adjustForm.reset();
    setAdjustDialogOpen(false);
  };

  if (!item) {
    return (
      <div className="space-y-6">
        <Button variant="outline" onClick={() => navigate("/inventory/items")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Items
        </Button>
        <Card>
          <CardContent className="py-12">
            <p className="text-center text-muted-foreground">Item not found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const needsReorder = item.currentStock < item.reorderLevel;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate("/inventory/items")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">{item.itemName}</h1>
            <p className="text-muted-foreground mt-1">SKU: {item.sku}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2" onClick={() => setAdjustDialogOpen(true)}>
            <History className="h-4 w-4" />
            Adjust Stock
          </Button>
          <Button className="gap-2">
            <Edit className="h-4 w-4" />
            Edit Item
          </Button>
        </div>
      </div>

      {/* Item Summary Card */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Package className="h-4 w-4" />
              Current Stock
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <div>
                <div className="text-3xl font-bold">{item.currentStock}</div>
                <p className="text-xs text-muted-foreground mt-1">{item.uom}</p>
              </div>
              {needsReorder && (
                <Badge className="bg-red-500">Reorder</Badge>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Reorder Level</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{item.reorderLevel}</div>
            <p className="text-xs text-muted-foreground mt-1">{item.uom}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Standard Cost</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">₹{item.standardCost}</div>
            <p className="text-xs text-muted-foreground mt-1">per {item.uom}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Stock Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">₹{(item.currentStock * item.standardCost).toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">Total value</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Item Details */}
        <Card>
          <CardHeader>
            <CardTitle>Item Details</CardTitle>
            <CardDescription>Complete item information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Category</p>
                <p className="font-medium">{item.category}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Item Type</p>
                <p className="font-medium">{item.itemType}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Unit of Measure</p>
                <p className="font-medium">{item.uom}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Status</p>
                <Badge variant={item.status === "Active" ? "default" : "secondary"}>
                  {item.status}
                </Badge>
              </div>
              <div className="col-span-2">
                <p className="text-muted-foreground">Description</p>
                <p className="font-medium">{item.description || "No description"}</p>
              </div>
            </div>
            
            <Separator />
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Opening Stock</p>
                <p className="font-medium">{item.openingStock} {item.uom}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Max Stock Level</p>
                <p className="font-medium">{item.maxStockLevel} {item.uom}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Last Purchase Price</p>
                <p className="font-medium">₹{item.lastPurchasePrice || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* GST & HSN Details */}
        <Card>
          <CardHeader>
            <CardTitle>GST & Compliance</CardTitle>
            <CardDescription>Tax and regulatory information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">HSN/SAC Code</p>
                <p className="font-mono font-medium text-lg">{item.hsnSacCode}</p>
              </div>
              <div>
                <p className="text-muted-foreground">GST Rate</p>
                <Badge variant="outline" className="font-mono text-lg">
                  {item.gstRate}%
                </Badge>
              </div>
            </div>

            <Separator />

            <div className="space-y-2 text-sm">
              <p className="text-muted-foreground">GST Breakdown (on Standard Cost)</p>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span>Base Amount:</span>
                  <span className="font-medium">₹{item.standardCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>GST ({item.gstRate}%):</span>
                  <span className="font-medium">₹{(item.standardCost * item.gstRate / 100).toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold">
                  <span>Total (Inc. GST):</span>
                  <span>₹{(item.standardCost * (1 + item.gstRate / 100)).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stock Valuation */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-primary" />
              <div>
                <CardTitle>Stock Valuation</CardTitle>
                <CardDescription>Inventory valuation using selected method</CardDescription>
              </div>
            </div>
            <Select value={valuationMethod} onValueChange={setValuationMethod}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="FIFO">FIFO (First In First Out)</SelectItem>
                <SelectItem value="WAVG">WAVG (Weighted Average)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Batch/Layer</TableHead>
                  <TableHead>Received Date</TableHead>
                  <TableHead className="text-right">Quantity</TableHead>
                  <TableHead className="text-right">Unit Cost</TableHead>
                  <TableHead className="text-right">Total Value</TableHead>
                  <TableHead className="text-right">Age (Days)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {valuationData.map((entry, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-mono font-medium">
                      {entry.batch}
                    </TableCell>
                    <TableCell className="text-sm">
                      {new Date(entry.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      {entry.quantity} {item.uom}
                    </TableCell>
                    <TableCell className="text-right">
                      ₹{entry.unitCost.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      ₹{entry.totalValue.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant={entry.age > 60 ? "destructive" : entry.age > 30 ? "secondary" : "outline"}>
                        {entry.age}d
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow className="bg-muted/50 font-semibold">
                  <TableCell colSpan={2}>Total Stock Value</TableCell>
                  <TableCell className="text-right">
                    {valuationData.reduce((sum, entry) => sum + entry.quantity, 0)} {item.uom}
                  </TableCell>
                  <TableCell className="text-right">
                    ₹{(valuationData.reduce((sum, entry) => sum + entry.totalValue, 0) / 
                      valuationData.reduce((sum, entry) => sum + entry.quantity, 0)).toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right">
                    ₹{valuationData.reduce((sum, entry) => sum + entry.totalValue, 0).toLocaleString()}
                  </TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Stock History */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <CardTitle>Stock Movement History</CardTitle>
          </div>
          <CardDescription>Recent stock transactions and movements</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Quantity</TableHead>
                  <TableHead className="text-right">Balance</TableHead>
                  <TableHead>Reference</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stockHistory.map((entry, index) => (
                  <TableRow key={index}>
                    <TableCell className="text-sm">
                      {new Date(entry.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Badge variant={
                        entry.type === "GRN" ? "default" : 
                        entry.type === "Issue" ? "secondary" : 
                        "outline"
                      }>
                        {entry.type}
                      </Badge>
                    </TableCell>
                    <TableCell className={`text-right font-semibold ${
                      entry.quantity > 0 ? "text-green-600" : "text-red-600"
                    }`}>
                      {entry.quantity > 0 ? "+" : ""}{entry.quantity}
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      {entry.balance}
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {entry.reference}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Price History */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <CardTitle>Price History</CardTitle>
          </div>
          <CardDescription>Last purchase price changes over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead>PO Reference</TableHead>
                  <TableHead className="text-right">Change</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {priceHistory.map((entry, index) => {
                  const prevPrice = priceHistory[index + 1]?.price;
                  const change = prevPrice ? ((entry.price - prevPrice) / prevPrice * 100) : 0;
                  
                  return (
                    <TableRow key={index}>
                      <TableCell className="text-sm">
                        {new Date(entry.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right font-semibold">
                        ₹{entry.price}
                      </TableCell>
                      <TableCell>{entry.supplier}</TableCell>
                      <TableCell className="font-mono text-sm">
                        {entry.po}
                      </TableCell>
                      <TableCell className="text-right">
                        {prevPrice ? (
                          <span className={change > 0 ? "text-red-600" : change < 0 ? "text-green-600" : ""}>
                            {change > 0 ? "+" : ""}{change.toFixed(1)}%
                          </span>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Linked POs & GRNs */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            <CardTitle>Linked Purchase Orders & GRNs</CardTitle>
          </div>
          <CardDescription>Associated procurement documents</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Document Number</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {linkedDocuments.map((doc, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Badge variant={doc.type === "PO" ? "default" : "secondary"}>
                        {doc.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono font-medium">
                      {doc.number}
                    </TableCell>
                    <TableCell className="text-sm">
                      {new Date(doc.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{doc.quantity} {item.uom}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{doc.status}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Adjust Stock Dialog */}
      <Dialog open={adjustDialogOpen} onOpenChange={setAdjustDialogOpen}>
        <DialogContent className="bg-background">
          <DialogHeader>
            <DialogTitle>Adjust Stock</DialogTitle>
            <DialogDescription>
              Make corrections to stock levels. Use positive numbers to add stock, negative to reduce.
            </DialogDescription>
          </DialogHeader>
          <Form {...adjustForm}>
            <form onSubmit={adjustForm.handleSubmit(onAdjustStock)} className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">Current Stock</p>
                <p className="text-2xl font-bold">{item.currentStock} {item.uom}</p>
              </div>

              <FormField
                control={adjustForm.control}
                name="adjustment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Adjustment Quantity</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="Enter adjustment (+ to add, - to reduce)" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                    {field.value !== 0 && (
                      <p className="text-sm text-muted-foreground">
                        New stock will be: <span className="font-semibold">
                          {item.currentStock + Number(field.value)} {item.uom}
                        </span>
                      </p>
                    )}
                  </FormItem>
                )}
              />

              <FormField
                control={adjustForm.control}
                name="reason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reason for Adjustment</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="e.g., Physical count correction, Damaged goods, etc." 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => {
                    adjustForm.reset();
                    setAdjustDialogOpen(false);
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" className="flex-1">
                  Adjust Stock
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ItemDetail;
