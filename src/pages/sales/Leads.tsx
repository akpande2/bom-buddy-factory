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

const Leads = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const dummyLeads = [
    { id: 1, name: "ABC Industries", contact: "John Doe", phone: "+91 98765 43210", email: "john@abc.com", status: "New", source: "Website" },
    { id: 2, name: "XYZ Corp", contact: "Jane Smith", phone: "+91 98765 43211", email: "jane@xyz.com", status: "Qualified", source: "Referral" },
    { id: 3, name: "LMN Ltd", contact: "Bob Johnson", phone: "+91 98765 43212", email: "bob@lmn.com", status: "Contacted", source: "Cold Call" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Leads</h1>
          <p className="text-muted-foreground">Manage your sales leads</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Lead
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search leads..."
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
              <TableHead>Company Name</TableHead>
              <TableHead>Contact Person</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {dummyLeads.map((lead) => (
              <TableRow key={lead.id}>
                <TableCell className="font-medium">{lead.name}</TableCell>
                <TableCell>{lead.contact}</TableCell>
                <TableCell>{lead.phone}</TableCell>
                <TableCell>{lead.email}</TableCell>
                <TableCell>
                  <Badge variant={lead.status === "New" ? "default" : "secondary"}>
                    {lead.status}
                  </Badge>
                </TableCell>
                <TableCell>{lead.source}</TableCell>
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

export default Leads;
