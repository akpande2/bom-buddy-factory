import { FileCheck, AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const GRNIntegration = () => {
  const pendingGRNs = [
    { id: "GRN-2024-089", poNumber: "PO-2024-156", vendor: "ABC Motors Ltd", itemCount: 3, expectedDate: "2025-11-25", status: "Pending" },
    { id: "GRN-2024-088", poNumber: "PO-2024-155", vendor: "XYZ Components", itemCount: 5, expectedDate: "2025-11-23", status: "Received" },
    { id: "GRN-2024-087", poNumber: "PO-2024-154", vendor: "Copper Wire Inc", itemCount: 2, expectedDate: "2025-11-20", status: "Verified" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">GRN Integration</h1>
        <p className="text-muted-foreground mt-1">Goods Receipt Note tracking and inventory updates</p>
      </div>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Read-Only Mode</AlertTitle>
        <AlertDescription>
          This is a placeholder module showing how GRN data would integrate with inventory. Full integration will sync with the Purchase Orders module.
        </AlertDescription>
      </Alert>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending GRNs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">5</div>
            <p className="text-xs text-muted-foreground mt-1">Awaiting goods receipt</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Received Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">12</div>
            <p className="text-xs text-muted-foreground mt-1">Items received and verified</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Value Added</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">₹8.4L</div>
            <p className="text-xs text-muted-foreground mt-1">Stock value this week</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <FileCheck className="h-5 w-5 text-primary" />
            <CardTitle>Recent GRNs</CardTitle>
          </div>
          <CardDescription>Latest goods receipt notes and their status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {pendingGRNs.map((grn) => (
              <div key={grn.id} className="flex items-center justify-between p-4 border rounded-lg bg-muted/30">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <p className="font-semibold">{grn.id}</p>
                    <Badge 
                      variant={
                        grn.status === "Verified" 
                          ? "default" 
                          : grn.status === "Received" 
                          ? "secondary" 
                          : "outline"
                      }
                    >
                      {grn.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">PO: {grn.poNumber} • Vendor: {grn.vendor}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>{grn.itemCount} items</span>
                    <span>Expected: {new Date(grn.expectedDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-dashed">
        <CardHeader>
          <CardTitle className="text-muted-foreground">Integration Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span>Purchase Orders Module</span>
              <Badge variant="outline">Connected</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Auto Stock Update</span>
              <Badge variant="outline">Enabled</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Real-time Sync</span>
              <Badge variant="secondary">Coming Soon</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GRNIntegration;
