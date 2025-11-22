import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { cn } from "@/lib/utils";

const sampleRequests = [
  {
    id: "PR-2024-001",
    item: "Motor 1200W",
    vendor: "Bajaj Electric",
    stage: "MD Approval",
    amount: "₹45,000",
    daysPending: 3,
  },
  {
    id: "PO-2024-045",
    item: "Plastic Base",
    vendor: "Supreme Plastics",
    stage: "PO Issued",
    amount: "₹32,500",
    daysPending: 1,
  },
  {
    id: "PR-2024-002",
    item: "Fan Blade Set",
    vendor: "Crompton Parts",
    stage: "SCM Review",
    amount: "₹18,750",
    daysPending: 5,
  },
  {
    id: "PR-2024-003",
    item: "Capacitor 2.5μF",
    vendor: "Anchor Electronics",
    stage: "Comparative Sheet",
    amount: "₹8,400",
    daysPending: 7,
  },
  {
    id: "PO-2024-046",
    item: "Motor Housing",
    vendor: "Maharaja Industries",
    stage: "GRN",
    amount: "₹52,000",
    daysPending: 2,
  },
  {
    id: "PR-2024-004",
    item: "Control Panel PCB",
    vendor: "TechCircuit Systems",
    stage: "PR Created",
    amount: "₹25,600",
    daysPending: 4,
  },
  {
    id: "PR-2024-005",
    item: "Bearing Set",
    vendor: "SKF Bearings",
    stage: "MD Approval",
    amount: "₹15,300",
    daysPending: 2,
  },
  {
    id: "PO-2024-047",
    item: "Wiring Harness",
    vendor: "Bosch Automotive",
    stage: "PO Issued",
    amount: "₹12,800",
    daysPending: 1,
  },
];

const getStageColor = (stage: string) => {
  switch (stage) {
    case "OPS Submitted":
    case "PR Created":
      return "bg-blue-100 text-blue-700 border-blue-200";
    case "Comparative Sheet":
      return "bg-purple-100 text-purple-700 border-purple-200";
    case "SCM Review":
      return "bg-pink-100 text-pink-700 border-pink-200";
    case "MD Approval":
      return "bg-orange-100 text-orange-700 border-orange-200";
    case "PO Issued":
      return "bg-green-100 text-green-700 border-green-200";
    case "GRN":
      return "bg-emerald-100 text-emerald-700 border-emerald-200";
    default:
      return "bg-muted text-muted-foreground";
  }
};

const getDaysPendingColor = (days: number) => {
  if (days <= 2) return "text-green-600";
  if (days <= 5) return "text-orange-600";
  return "text-red-600";
};

export const ActiveRequestsTable = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Active Procurement Requests</span>
          <Badge variant="secondary">{sampleRequests.length} requests</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-semibold">PR/PO Number</TableHead>
                <TableHead className="font-semibold">Item</TableHead>
                <TableHead className="font-semibold">Vendor</TableHead>
                <TableHead className="font-semibold">Stage</TableHead>
                <TableHead className="font-semibold text-right">Amount</TableHead>
                <TableHead className="font-semibold text-center">Days Pending</TableHead>
                <TableHead className="font-semibold text-center">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sampleRequests.map((request) => (
                <TableRow key={request.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">{request.id}</TableCell>
                  <TableCell>{request.item}</TableCell>
                  <TableCell className="text-muted-foreground">{request.vendor}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn("font-medium", getStageColor(request.stage))}>
                      {request.stage}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-medium">{request.amount}</TableCell>
                  <TableCell className="text-center">
                    <span className={cn("font-semibold", getDaysPendingColor(request.daysPending))}>
                      {request.daysPending} {request.daysPending === 1 ? 'day' : 'days'}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
