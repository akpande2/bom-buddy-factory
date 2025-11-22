import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, ClipboardList, FileSpreadsheet, Eye, CheckCircle, Package, Mail, Truck, Receipt, FileCheck } from "lucide-react";
import { cn } from "@/lib/utils";

const timelineStages = [
  {
    title: "OPS",
    fullTitle: "Order Processing Sheet",
    icon: FileText,
    date: "15 Jan 2024, 10:30 AM",
    comment: "Initial requirement submitted by Production Team",
    status: "completed",
  },
  {
    title: "PR",
    fullTitle: "Purchase Requisition",
    icon: ClipboardList,
    date: "16 Jan 2024, 02:15 PM",
    comment: "Approved by Department Head - Urgent requirement",
    status: "completed",
  },
  {
    title: "CS",
    fullTitle: "Comparative Sheet",
    icon: FileSpreadsheet,
    date: "18 Jan 2024, 11:00 AM",
    comment: "Quotes received from 3 vendors. Bajaj offers best value.",
    status: "completed",
  },
  {
    title: "SCM",
    fullTitle: "SCM Review",
    icon: Eye,
    date: "19 Jan 2024, 09:45 AM",
    comment: "Supply Chain reviewed. Recommended Bajaj Electric.",
    status: "completed",
  },
  {
    title: "MD",
    fullTitle: "MD Approval",
    icon: CheckCircle,
    date: "20 Jan 2024, 04:20 PM",
    comment: "Approved by Managing Director",
    status: "completed",
  },
  {
    title: "PO",
    fullTitle: "Purchase Order",
    icon: Package,
    date: "21 Jan 2024, 10:00 AM",
    comment: "PO issued to Bajaj Electric. PO# PO-2024-045",
    status: "completed",
  },
  {
    title: "LOI",
    fullTitle: "Letter of Intent",
    icon: Mail,
    date: "21 Jan 2024, 03:30 PM",
    comment: "LOI sent to vendor. Awaiting acknowledgment.",
    status: "completed",
  },
  {
    title: "Delivery",
    fullTitle: "Delivery Expected",
    icon: Truck,
    date: "28 Jan 2024 (Expected)",
    comment: "Vendor confirmed delivery for this date",
    status: "current",
  },
  {
    title: "GRN",
    fullTitle: "Goods Receipt Note",
    icon: Receipt,
    date: "Pending",
    comment: "Awaiting delivery to generate GRN",
    status: "pending",
  },
  {
    title: "Invoice",
    fullTitle: "Invoice Matching",
    icon: FileCheck,
    date: "Pending",
    comment: "Invoice matching will be done after GRN",
    status: "pending",
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "completed":
      return "bg-green-500 border-green-500";
    case "current":
      return "bg-orange-500 border-orange-500 ring-4 ring-orange-100";
    case "pending":
      return "bg-muted border-border";
    default:
      return "bg-muted border-border";
  }
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case "completed":
      return <Badge className="bg-green-100 text-green-700 border-green-200">Completed</Badge>;
    case "current":
      return <Badge className="bg-orange-100 text-orange-700 border-orange-200">In Progress</Badge>;
    case "pending":
      return <Badge variant="secondary">Pending</Badge>;
    default:
      return null;
  }
};

export const PRTimeline = () => {
  return (
    <Card>
      <CardHeader className="border-b">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">PR/PO Timeline</CardTitle>
          <Badge variant="outline">PR-2024-001</Badge>
        </div>
        <p className="text-sm text-muted-foreground mt-1">Motor 1200W - Bajaj Electric</p>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border" />
          
          {/* Timeline Items */}
          <div className="space-y-6">
            {timelineStages.map((stage, index) => {
              const Icon = stage.icon;
              return (
                <div key={stage.title} className="relative flex gap-4">
                  {/* Node */}
                  <div
                    className={cn(
                      "relative z-10 flex-shrink-0 w-12 h-12 rounded-full border-4 flex items-center justify-center",
                      getStatusColor(stage.status)
                    )}
                  >
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 pb-6">
                    <div className="flex items-start justify-between mb-1">
                      <div>
                        <h4 className="font-semibold text-foreground">{stage.title}</h4>
                        <p className="text-xs text-muted-foreground">{stage.fullTitle}</p>
                      </div>
                      {getStatusBadge(stage.status)}
                    </div>
                    
                    <p className="text-sm text-muted-foreground mt-2 mb-1">
                      📅 {stage.date}
                    </p>
                    
                    <p className="text-sm text-foreground bg-muted/50 rounded-lg p-3 mt-2">
                      {stage.comment}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
