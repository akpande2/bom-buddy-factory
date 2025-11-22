import { useState } from "react";
import { Search, Download, Filter } from "lucide-react";
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

interface LedgerEntry {
  id: string;
  date: string;
  itemCode: string;
  itemName: string;
  transactionType: "IN" | "OUT" | "ADJUST";
  quantity: number;
  warehouse: string;
  reference: string;
  balance: number;
}

const StockLedger = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [entries] = useState<LedgerEntry[]>([
    { id: "1", date: "2025-11-22", itemCode: "MTR-001", itemName: "Motor Assembly XL", transactionType: "IN", quantity: 50, warehouse: "WH-001", reference: "PO-2024-156", balance: 145 },
    { id: "2", date: "2025-11-22", itemCode: "BLD-048", itemName: "Blade Set - 48 inch", transactionType: "OUT", quantity: -30, warehouse: "WH-001", reference: "WO-2024-889", balance: 78 },
    { id: "3", date: "2025-11-21", itemCode: "CAP-2.5", itemName: "Capacitor 2.5 μF", transactionType: "IN", quantity: 200, warehouse: "WH-002", reference: "PO-2024-155", balance: 322 },
    { id: "4", date: "2025-11-21", itemCode: "COP-WND", itemName: "Copper Winding", transactionType: "ADJUST", quantity: -12, warehouse: "WH-001", reference: "ADJ-2024-023", balance: 856 },
    { id: "5", date: "2025-11-20", itemCode: "MTR-001", itemName: "Motor Assembly XL", transactionType: "OUT", quantity: -20, warehouse: "WH-003", reference: "WO-2024-887", balance: 95 },
    { id: "6", date: "2025-11-20", itemCode: "BLD-048", itemName: "Blade Set - 48 inch", transactionType: "IN", quantity: 100, warehouse: "WH-001", reference: "PO-2024-154", balance: 108 },
  ]);

  const filteredEntries = entries.filter(
    (entry) =>
      entry.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.itemCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.reference.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getTransactionBadge = (type: string) => {
    switch (type) {
      case "IN":
        return <Badge className="bg-green-500">IN</Badge>;
      case "OUT":
        return <Badge className="bg-red-500">OUT</Badge>;
      case "ADJUST":
        return <Badge variant="outline">ADJUST</Badge>;
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
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by item, code, or reference..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Item Code</TableHead>
                  <TableHead>Item Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Quantity</TableHead>
                  <TableHead>Warehouse</TableHead>
                  <TableHead>Reference</TableHead>
                  <TableHead className="text-right">Balance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEntries.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell className="text-sm">{new Date(entry.date).toLocaleDateString()}</TableCell>
                    <TableCell className="font-mono text-sm">{entry.itemCode}</TableCell>
                    <TableCell className="font-medium">{entry.itemName}</TableCell>
                    <TableCell>{getTransactionBadge(entry.transactionType)}</TableCell>
                    <TableCell className={`text-right font-semibold ${
                      entry.quantity > 0 ? "text-green-600" : "text-red-600"
                    }`}>
                      {entry.quantity > 0 ? "+" : ""}{entry.quantity}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{entry.warehouse}</Badge>
                    </TableCell>
                    <TableCell className="font-mono text-sm">{entry.reference}</TableCell>
                    <TableCell className="text-right font-semibold">{entry.balance}</TableCell>
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
