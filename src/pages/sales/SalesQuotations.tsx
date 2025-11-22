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

const SalesQuotations = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const dummyQuotations = [
    { id: "QT-001", customer: "ABC Industries", date: "2024-01-15", amount: "₹1,50,000", status: "Sent", validTill: "2024-02-15" },
    { id: "QT-002", customer: "XYZ Corp", date: "2024-01-16", amount: "₹2,75,000", status: "Accepted", validTill: "2024-02-16" },
    { id: "QT-003", customer: "LMN Ltd", date: "2024-01-17", amount: "₹95,000", status: "Draft", validTill: "2024-02-17" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Sales Quotations</h1>
          <p className="text-muted-foreground">Create and manage sales quotations</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Quotation
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search quotations..."
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
              <TableHead>Quotation ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Valid Till</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {dummyQuotations.map((quotation) => (
              <TableRow key={quotation.id}>
                <TableCell className="font-medium">{quotation.id}</TableCell>
                <TableCell>{quotation.customer}</TableCell>
                <TableCell>{quotation.date}</TableCell>
                <TableCell>{quotation.amount}</TableCell>
                <TableCell>{quotation.validTill}</TableCell>
                <TableCell>
                  <Badge variant={quotation.status === "Accepted" ? "default" : "secondary"}>
                    {quotation.status}
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

export default SalesQuotations;
