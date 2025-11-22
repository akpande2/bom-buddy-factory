import { useState } from "react";
import { Search, Download, Filter, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface LedgerEntry {
  id: string;
  date: string;
  itemCode: string;
  itemName: string;
  transactionType: "GRN" | "Issue" | "Return" | "Adjustment";
  quantityIn: number;
  quantityOut: number;
  warehouse: string;
  balance: number;
  remarks: string;
}

const stockInSchema = z.object({
  itemCode: z.string().min(1, "Item is required"),
  warehouse: z.string().min(1, "Warehouse is required"),
  quantity: z.coerce.number().min(1, "Quantity must be at least 1"),
  reference: z.string().min(1, "Reference is required"),
  remarks: z.string().optional(),
});

const stockOutSchema = z.object({
  itemCode: z.string().min(1, "Item is required"),
  warehouse: z.string().min(1, "Warehouse is required"),
  quantity: z.coerce.number().min(1, "Quantity must be at least 1"),
  reason: z.enum(["Production", "Sample", "Scrap", "Return"], {
    required_error: "Reason is required",
  }),
});

const StockLedger = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState<string>("all");
  const [selectedWarehouse, setSelectedWarehouse] = useState<string>("all");
  const [entries, setEntries] = useState<LedgerEntry[]>([
    { id: "1", date: "2025-11-22", itemCode: "MTR-001", itemName: "Motor Assembly XL", transactionType: "GRN", quantityIn: 50, quantityOut: 0, warehouse: "WH-001", balance: 145, remarks: "Received from PO-2024-156" },
    { id: "2", date: "2025-11-22", itemCode: "BLD-048", itemName: "Blade Set - 48 inch", transactionType: "Issue", quantityIn: 0, quantityOut: 30, warehouse: "WH-001", balance: 78, remarks: "Issued for production WO-2024-889" },
    { id: "3", date: "2025-11-21", itemCode: "CAP-2.5", itemName: "Capacitor 2.5 μF", transactionType: "GRN", quantityIn: 200, quantityOut: 0, warehouse: "WH-002", balance: 322, remarks: "New stock received" },
    { id: "4", date: "2025-11-21", itemCode: "COP-WND", itemName: "Copper Winding", transactionType: "Adjustment", quantityIn: 0, quantityOut: 12, warehouse: "WH-001", balance: 856, remarks: "Stock count adjustment - damage" },
    { id: "5", date: "2025-11-20", itemCode: "MTR-001", itemName: "Motor Assembly XL", transactionType: "Issue", quantityIn: 0, quantityOut: 20, warehouse: "WH-003", balance: 95, remarks: "Production usage" },
    { id: "6", date: "2025-11-20", itemCode: "BLD-048", itemName: "Blade Set - 48 inch", transactionType: "Return", quantityIn: 25, quantityOut: 0, warehouse: "WH-001", balance: 108, remarks: "Returned from production - excess" },
    { id: "7", date: "2025-11-19", itemCode: "CAP-2.5", itemName: "Capacitor 2.5 μF", transactionType: "Issue", quantityIn: 0, quantityOut: 80, warehouse: "WH-002", balance: 122, remarks: "Assembly line requisition" },
  ]);
  const [stockInOpen, setStockInOpen] = useState(false);
  const [stockOutOpen, setStockOutOpen] = useState(false);
  const { toast } = useToast();

  // Mock items data
  const items = [
    { code: "MTR-001", name: "Motor Assembly XL" },
    { code: "BLD-048", name: "Blade Set - 48 inch" },
    { code: "CAP-2.5", name: "Capacitor 2.5 μF" },
    { code: "COP-WND", name: "Copper Winding" },
  ];

  const warehouses = ["WH-001", "WH-002", "WH-003"];

  const stockInForm = useForm<z.infer<typeof stockInSchema>>({
    resolver: zodResolver(stockInSchema),
    defaultValues: {
      itemCode: "",
      warehouse: "",
      quantity: 0,
      reference: "",
      remarks: "",
    },
  });

  const stockOutForm = useForm<z.infer<typeof stockOutSchema>>({
    resolver: zodResolver(stockOutSchema),
    defaultValues: {
      itemCode: "",
      warehouse: "",
      quantity: 0,
      reason: undefined,
    },
  });

  const getLatestBalance = (itemCode: string, warehouse: string) => {
    const itemEntries = entries
      .filter((e) => e.itemCode === itemCode && e.warehouse === warehouse)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return itemEntries.length > 0 ? itemEntries[0].balance : 0;
  };

  const onStockIn = (values: z.infer<typeof stockInSchema>) => {
    const item = items.find((i) => i.code === values.itemCode);
    const currentBalance = getLatestBalance(values.itemCode, values.warehouse);
    const newBalance = currentBalance + values.quantity;

    const newEntry: LedgerEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString().split("T")[0],
      itemCode: values.itemCode,
      itemName: item?.name || "",
      transactionType: "GRN",
      quantityIn: values.quantity,
      quantityOut: 0,
      warehouse: values.warehouse,
      balance: newBalance,
      remarks: values.remarks || values.reference,
    };

    setEntries([newEntry, ...entries]);
    toast({
      title: "Stock In Successful",
      description: `Added ${values.quantity} units of ${item?.name}`,
    });
    stockInForm.reset();
    setStockInOpen(false);
  };

  const onStockOut = (values: z.infer<typeof stockOutSchema>) => {
    const item = items.find((i) => i.code === values.itemCode);
    const currentBalance = getLatestBalance(values.itemCode, values.warehouse);
    
    if (currentBalance < values.quantity) {
      toast({
        title: "Insufficient Stock",
        description: `Only ${currentBalance} units available`,
        variant: "destructive",
      });
      return;
    }

    const newBalance = currentBalance - values.quantity;

    const newEntry: LedgerEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString().split("T")[0],
      itemCode: values.itemCode,
      itemName: item?.name || "",
      transactionType: "Issue",
      quantityIn: 0,
      quantityOut: values.quantity,
      warehouse: values.warehouse,
      balance: newBalance,
      remarks: `${values.reason}`,
    };

    setEntries([newEntry, ...entries]);
    toast({
      title: "Stock Out Successful",
      description: `Issued ${values.quantity} units of ${item?.name}`,
    });
    stockOutForm.reset();
    setStockOutOpen(false);
  };

  const filteredEntries = entries.filter((entry) => {
    const matchesSearch =
      entry.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.itemCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.remarks.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesItem = selectedItem === "all" || entry.itemCode === selectedItem;
    const matchesWarehouse = selectedWarehouse === "all" || entry.warehouse === selectedWarehouse;
    return matchesSearch && matchesItem && matchesWarehouse;
  });

  const uniqueItems = Array.from(new Set(entries.map((e) => e.itemCode)));
  const uniqueWarehouses = Array.from(new Set(entries.map((e) => e.warehouse)));

  const getTransactionBadge = (type: string) => {
    switch (type) {
      case "GRN":
        return <Badge className="bg-green-500">GRN</Badge>;
      case "Issue":
        return <Badge className="bg-red-500">Issue</Badge>;
      case "Return":
        return <Badge className="bg-blue-500">Return</Badge>;
      case "Adjustment":
        return <Badge variant="outline">Adjustment</Badge>;
      default:
        return <Badge variant="secondary">{type}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Stock Ledger</h1>
          <p className="text-muted-foreground mt-1">Track all stock movements and transactions</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={stockInOpen} onOpenChange={setStockInOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Stock In
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-background">
              <DialogHeader>
                <DialogTitle>Stock In</DialogTitle>
                <DialogDescription>Add stock to your inventory</DialogDescription>
              </DialogHeader>
              <Form {...stockInForm}>
                <form onSubmit={stockInForm.handleSubmit(onStockIn)} className="space-y-4">
                  <FormField
                    control={stockInForm.control}
                    name="itemCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Item</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-background">
                              <SelectValue placeholder="Select item" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-background z-50">
                            {items.map((item) => (
                              <SelectItem key={item.code} value={item.code}>
                                {item.code} - {item.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={stockInForm.control}
                    name="warehouse"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Warehouse</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-background">
                              <SelectValue placeholder="Select warehouse" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-background z-50">
                            {warehouses.map((wh) => (
                              <SelectItem key={wh} value={wh}>
                                {wh}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={stockInForm.control}
                    name="quantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quantity</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="Enter quantity" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={stockInForm.control}
                    name="reference"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Reference</FormLabel>
                        <FormControl>
                          <Input placeholder="GRN No./Manual reference" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={stockInForm.control}
                    name="remarks"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Remarks</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Optional remarks" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full">
                    Add Stock
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>

          <Dialog open={stockOutOpen} onOpenChange={setStockOutOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Minus className="h-4 w-4" />
                Stock Out
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-background">
              <DialogHeader>
                <DialogTitle>Stock Out</DialogTitle>
                <DialogDescription>Issue stock from your inventory</DialogDescription>
              </DialogHeader>
              <Form {...stockOutForm}>
                <form onSubmit={stockOutForm.handleSubmit(onStockOut)} className="space-y-4">
                  <FormField
                    control={stockOutForm.control}
                    name="itemCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Item</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-background">
                              <SelectValue placeholder="Select item" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-background z-50">
                            {items.map((item) => (
                              <SelectItem key={item.code} value={item.code}>
                                {item.code} - {item.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={stockOutForm.control}
                    name="warehouse"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Warehouse</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-background">
                              <SelectValue placeholder="Select warehouse" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-background z-50">
                            {warehouses.map((wh) => (
                              <SelectItem key={wh} value={wh}>
                                {wh}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={stockOutForm.control}
                    name="quantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quantity</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="Enter quantity" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={stockOutForm.control}
                    name="reason"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Reason</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-background">
                              <SelectValue placeholder="Select reason" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-background z-50">
                            <SelectItem value="Production">Production</SelectItem>
                            <SelectItem value="Sample">Sample</SelectItem>
                            <SelectItem value="Scrap">Scrap</SelectItem>
                            <SelectItem value="Return">Return</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full">
                    Issue Stock
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>

          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>Complete record of all inventory movements</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by item, code, or remarks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedItem} onValueChange={setSelectedItem}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="All Items" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Items</SelectItem>
                {uniqueItems.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedWarehouse} onValueChange={setSelectedWarehouse}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="All Warehouses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Warehouses</SelectItem>
                {uniqueWarehouses.map((wh) => (
                  <SelectItem key={wh} value={wh}>
                    {wh}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Item Code</TableHead>
                  <TableHead>Item Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Warehouse</TableHead>
                  <TableHead className="text-right">Quantity In</TableHead>
                  <TableHead className="text-right">Quantity Out</TableHead>
                  <TableHead className="text-right">Balance</TableHead>
                  <TableHead>Remarks</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEntries.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell className="text-sm">{new Date(entry.date).toLocaleDateString()}</TableCell>
                    <TableCell className="font-mono text-sm">{entry.itemCode}</TableCell>
                    <TableCell className="font-medium">{entry.itemName}</TableCell>
                    <TableCell>{getTransactionBadge(entry.transactionType)}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{entry.warehouse}</Badge>
                    </TableCell>
                    <TableCell className="text-right font-semibold text-green-600">
                      {entry.quantityIn > 0 ? `+${entry.quantityIn}` : "-"}
                    </TableCell>
                    <TableCell className="text-right font-semibold text-red-600">
                      {entry.quantityOut > 0 ? entry.quantityOut : "-"}
                    </TableCell>
                    <TableCell className="text-right font-semibold">{entry.balance}</TableCell>
                    <TableCell className="text-sm text-muted-foreground max-w-xs truncate">
                      {entry.remarks}
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

export default StockLedger;
