import { useState } from "react";
import { Search, Download, Filter } from "lucide-react";
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

const StockLedger = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState<string>("all");
  const [selectedWarehouse, setSelectedWarehouse] = useState<string>("all");
  const [entries] = useState<LedgerEntry[]>([
    { id: "1", date: "2025-11-22", itemCode: "MTR-001", itemName: "Motor Assembly XL", transactionType: "GRN", quantityIn: 50, quantityOut: 0, warehouse: "WH-001", balance: 145, remarks: "Received from PO-2024-156" },
    { id: "2", date: "2025-11-22", itemCode: "BLD-048", itemName: "Blade Set - 48 inch", transactionType: "Issue", quantityIn: 0, quantityOut: 30, warehouse: "WH-001", balance: 78, remarks: "Issued for production WO-2024-889" },
    { id: "3", date: "2025-11-21", itemCode: "CAP-2.5", itemName: "Capacitor 2.5 μF", transactionType: "GRN", quantityIn: 200, quantityOut: 0, warehouse: "WH-002", balance: 322, remarks: "New stock received" },
    { id: "4", date: "2025-11-21", itemCode: "COP-WND", itemName: "Copper Winding", transactionType: "Adjustment", quantityIn: 0, quantityOut: 12, warehouse: "WH-001", balance: 856, remarks: "Stock count adjustment - damage" },
    { id: "5", date: "2025-11-20", itemCode: "MTR-001", itemName: "Motor Assembly XL", transactionType: "Issue", quantityIn: 0, quantityOut: 20, warehouse: "WH-003", balance: 95, remarks: "Production usage" },
    { id: "6", date: "2025-11-20", itemCode: "BLD-048", itemName: "Blade Set - 48 inch", transactionType: "Return", quantityIn: 25, quantityOut: 0, warehouse: "WH-001", balance: 108, remarks: "Returned from production - excess" },
    { id: "7", date: "2025-11-19", itemCode: "CAP-2.5", itemName: "Capacitor 2.5 μF", transactionType: "Issue", quantityIn: 0, quantityOut: 80, warehouse: "WH-002", balance: 122, remarks: "Assembly line requisition" },
  ]);

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
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
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
