import { useState } from "react";
import { Search, FileText, ArrowRight } from "lucide-react";
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
import { useNavigate } from "react-router-dom";

interface GRNItem {
  itemCode: string;
  itemName: string;
  quantity: number;
  uom: string;
}

interface GRN {
  id: string;
  grnNumber: string;
  poNumber: string;
  vendor: string;
  date: string;
  status: "Pending" | "Completed" | "Partial";
  items: GRNItem[];
  warehouse: string;
  totalItems: number;
}

const GRNIntegration = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [grns] = useState<GRN[]>([
    {
      id: "1",
      grnNumber: "GRN-2024-001",
      poNumber: "PO-2024-156",
      vendor: "Acme Motors Ltd",
      date: "2025-11-22",
      status: "Pending",
      warehouse: "WH-001",
      totalItems: 2,
      items: [
        { itemCode: "MTR-001", itemName: "Motor Assembly XL", quantity: 50, uom: "pcs" },
        { itemCode: "BLD-048", itemName: "Blade Set - 48 inch", quantity: 100, uom: "pcs" },
      ],
    },
    {
      id: "2",
      grnNumber: "GRN-2024-002",
      poNumber: "PO-2024-155",
      vendor: "Electrical Components Co",
      date: "2025-11-21",
      status: "Completed",
      warehouse: "WH-002",
      totalItems: 1,
      items: [
        { itemCode: "CAP-2.5", itemName: "Capacitor 2.5 μF", quantity: 200, uom: "pcs" },
      ],
    },
    {
      id: "3",
      grnNumber: "GRN-2024-003",
      poNumber: "PO-2024-154",
      vendor: "Copper Wire Industries",
      date: "2025-11-20",
      status: "Pending",
      warehouse: "WH-001",
      totalItems: 2,
      items: [
        { itemCode: "COP-WND", itemName: "Copper Winding", quantity: 150, uom: "kg" },
        { itemCode: "MTR-001", itemName: "Motor Assembly XL", quantity: 25, uom: "pcs" },
      ],
    },
    {
      id: "4",
      grnNumber: "GRN-2024-004",
      poNumber: "PO-2024-153",
      vendor: "Acme Motors Ltd",
      date: "2025-11-19",
      status: "Partial",
      warehouse: "WH-003",
      totalItems: 1,
      items: [
        { itemCode: "BLD-048", itemName: "Blade Set - 48 inch", quantity: 75, uom: "pcs" },
      ],
    },
  ]);

  const filteredGRNs = grns.filter(
    (grn) =>
      grn.grnNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      grn.poNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      grn.vendor.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Completed":
        return <Badge className="bg-green-500">Completed</Badge>;
      case "Pending":
        return <Badge className="bg-yellow-500">Pending</Badge>;
      case "Partial":
        return <Badge className="bg-blue-500">Partial</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const handleAddToStock = (grn: GRN) => {
    // Navigate to stock ledger with GRN data
    navigate("/inventory/stock-ledger", {
      state: {
        grnData: grn,
        openStockIn: true,
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">GRN Integration</h1>
          <p className="text-muted-foreground mt-1">
            View and process Goods Receipt Notes
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>GRN List</CardTitle>
          <CardDescription>
            Click "Add to Stock" to process GRN items into inventory
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by GRN, PO, or vendor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>GRN Number</TableHead>
                  <TableHead>PO Number</TableHead>
                  <TableHead>Vendor</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Warehouse</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredGRNs.map((grn) => (
                  <TableRow key={grn.id}>
                    <TableCell className="font-mono font-medium">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        {grn.grnNumber}
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {grn.poNumber}
                    </TableCell>
                    <TableCell>{grn.vendor}</TableCell>
                    <TableCell className="text-sm">
                      {new Date(grn.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{grn.warehouse}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{grn.totalItems} items</Badge>
                    </TableCell>
                    <TableCell>{getStatusBadge(grn.status)}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-2"
                        onClick={() => handleAddToStock(grn)}
                        disabled={grn.status === "Completed"}
                      >
                        Add to Stock
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredGRNs.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No GRNs found matching your search.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default GRNIntegration;
