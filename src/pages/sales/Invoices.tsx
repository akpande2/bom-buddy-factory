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

const Invoices = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const dummyInvoices = [
    { id: "INV-001", orderNo: "SO-001", customer: "ABC Industries", date: "2024-02-21", amount: "₹1,50,000", dueDate: "2024-03-21", status: "Paid" },
    { id: "INV-002", orderNo: "SO-002", customer: "XYZ Corp", date: "2024-02-26", amount: "₹2,75,000", dueDate: "2024-03-26", status: "Pending" },
    { id: "INV-003", orderNo: "SO-003", customer: "LMN Ltd", date: "2024-02-23", amount: "₹95,000", dueDate: "2024-03-23", status: "Overdue" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Invoices</h1>
          <p className="text-muted-foreground">Create and track sales invoices</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Invoice
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search invoices..."
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
              <TableHead>Invoice ID</TableHead>
              <TableHead>Order No</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {dummyInvoices.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell className="font-medium">{invoice.id}</TableCell>
                <TableCell>{invoice.orderNo}</TableCell>
                <TableCell>{invoice.customer}</TableCell>
                <TableCell>{invoice.date}</TableCell>
                <TableCell>{invoice.amount}</TableCell>
                <TableCell>{invoice.dueDate}</TableCell>
                <TableCell>
                  <Badge variant={
                    invoice.status === "Paid" ? "default" : 
                    invoice.status === "Overdue" ? "destructive" : 
                    "secondary"
                  }>
                    {invoice.status}
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

export default Invoices;
