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

const SalesOrders = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const dummyOrders = [
    { id: "SO-001", customer: "ABC Industries", date: "2024-01-20", amount: "₹1,50,000", status: "Confirmed", deliveryDate: "2024-02-20" },
    { id: "SO-002", customer: "XYZ Corp", date: "2024-01-21", amount: "₹2,75,000", status: "Processing", deliveryDate: "2024-02-25" },
    { id: "SO-003", customer: "LMN Ltd", date: "2024-01-22", amount: "₹95,000", status: "Pending", deliveryDate: "2024-02-22" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Sales Orders</h1>
          <p className="text-muted-foreground">Track and manage sales orders</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Sales Order
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search orders..."
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
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Order Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Delivery Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {dummyOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.id}</TableCell>
                <TableCell>{order.customer}</TableCell>
                <TableCell>{order.date}</TableCell>
                <TableCell>{order.amount}</TableCell>
                <TableCell>{order.deliveryDate}</TableCell>
                <TableCell>
                  <Badge variant={order.status === "Confirmed" ? "default" : "secondary"}>
                    {order.status}
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

export default SalesOrders;
