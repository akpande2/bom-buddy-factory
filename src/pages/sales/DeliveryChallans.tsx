import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const DeliveryChallans = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const dummyChallans = [
    { id: "DC-001", orderNo: "SO-001", customer: "ABC Industries", date: "2024-02-20", items: 5, status: "Dispatched" },
    { id: "DC-002", orderNo: "SO-002", customer: "XYZ Corp", date: "2024-02-25", items: 8, status: "Delivered" },
    { id: "DC-003", orderNo: "SO-003", customer: "LMN Ltd", date: "2024-02-22", items: 3, status: "In Transit" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Delivery Challans</h1>
          <p className="text-muted-foreground">Manage delivery challans and shipments</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Delivery Challan
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search challans..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Challan ID</TableHead>
              <TableHead>Order No</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {dummyChallans.map((challan) => (
              <TableRow key={challan.id}>
                <TableCell className="font-medium">{challan.id}</TableCell>
                <TableCell>{challan.orderNo}</TableCell>
                <TableCell>{challan.customer}</TableCell>
                <TableCell>{challan.date}</TableCell>
                <TableCell>{challan.items}</TableCell>
                <TableCell>
                  <Badge variant={challan.status === "Delivered" ? "default" : "secondary"}>
                    {challan.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm">View</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default DeliveryChallans;
