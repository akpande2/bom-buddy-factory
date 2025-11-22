import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, FileText, CheckCircle, Clock, XCircle, ArrowRight, Search } from "lucide-react";
import { toast } from "@/hooks/use-toast";

type P2PStatus = "OPS" | "PR" | "SCM" | "CS" | "MD_Review" | "MD_Approved" | "LOI" | "PO_Issued" | "GRN" | "Completed";

interface P2POrder {
  id: string;
  opsNo: string;
  prNo?: string;
  csNo?: string;
  poNo?: string;
  grnNo?: string;
  itemDescription: string;
  quantity: number;
  warranty?: string;
  deliveryDate: string;
  previousPrice?: number;
  status: P2PStatus;
  createdDate: string;
  suppliers?: string[];
  recommendedSupplier?: string;
  approvedPrice?: number;
}

interface ComparativeSheet {
  id: string;
  csNo: string;
  prNo: string;
  itemDescription: string;
  vendors: Array<{
    name: string;
    price: number;
    warranty: string;
    deliveryDays: number;
    freight: number;
    totalPrice: number;
  }>;
  recommendedSupplier: string;
  status: "Draft" | "Submitted" | "Approved" | "Rejected";
}

const PurchaseOrders = () => {
  const [openOPSDialog, setOpenOPSDialog] = useState(false);
  const [openPRDialog, setOpenPRDialog] = useState(false);
  const [openCSDialog, setOpenCSDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [orders, setOrders] = useState<P2POrder[]>([
    {
      id: "1",
      opsNo: "OPS-001",
      prNo: "PR-001",
      csNo: "CS-001",
      poNo: "PO-001",
      itemDescription: "Motor 1200W",
      quantity: 100,
      warranty: "1 Year",
      deliveryDate: "2024-02-15",
      previousPrice: 450,
      status: "PO_Issued",
      createdDate: "2024-01-10",
      suppliers: ["Bajaj", "Maharaja", "Crompton"],
      recommendedSupplier: "Bajaj",
      approvedPrice: 445,
    },
    {
      id: "2",
      opsNo: "OPS-002",
      prNo: "PR-002",
      csNo: "CS-002",
      itemDescription: "Plastic Base",
      quantity: 500,
      warranty: "6 Months",
      deliveryDate: "2024-02-20",
      previousPrice: 85,
      status: "MD_Review",
      createdDate: "2024-01-12",
      suppliers: ["Supplier A", "Supplier B"],
      recommendedSupplier: "Supplier A",
    },
    {
      id: "3",
      opsNo: "OPS-003",
      prNo: "PR-003",
      itemDescription: "Guard Front",
      quantity: 200,
      deliveryDate: "2024-02-25",
      status: "CS",
      createdDate: "2024-01-15",
    },
  ]);

  const [comparativeSheets, setComparativeSheets] = useState<ComparativeSheet[]>([
    {
      id: "1",
      csNo: "CS-001",
      prNo: "PR-001",
      itemDescription: "Motor 1200W",
      vendors: [
        { name: "Bajaj", price: 445, warranty: "1 Year", deliveryDays: 15, freight: 50, totalPrice: 495 },
        { name: "Maharaja", price: 460, warranty: "1 Year", deliveryDays: 20, freight: 45, totalPrice: 505 },
        { name: "Crompton", price: 455, warranty: "6 Months", deliveryDays: 10, freight: 55, totalPrice: 510 },
      ],
      recommendedSupplier: "Bajaj",
      status: "Approved",
    },
  ]);

  const getStatusColor = (status: P2PStatus) => {
    switch (status) {
      case "OPS":
      case "PR":
        return "bg-muted text-muted-foreground";
      case "SCM":
      case "CS":
        return "bg-warning text-warning-foreground";
      case "MD_Review":
        return "bg-primary text-primary-foreground";
      case "MD_Approved":
      case "LOI":
        return "bg-accent text-accent-foreground";
      case "PO_Issued":
        return "bg-success text-success-foreground";
      case "GRN":
      case "Completed":
        return "bg-success text-success-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getStatusLabel = (status: P2PStatus) => {
    switch (status) {
      case "OPS": return "Order Processing";
      case "PR": return "Purchase Requisition";
      case "SCM": return "SCM Review";
      case "CS": return "Comparative Sheet";
      case "MD_Review": return "MD Review";
      case "MD_Approved": return "MD Approved";
      case "LOI": return "Letter of Intent";
      case "PO_Issued": return "PO Issued";
      case "GRN": return "GRN Pending";
      case "Completed": return "Completed";
      default: return status;
    }
  };

  const handleCreateOPS = () => {
    toast({
      title: "OPS Created",
      description: "Order Processing Sheet has been created successfully.",
    });
    setOpenOPSDialog(false);
  };

  const handleCreatePR = () => {
    toast({
      title: "PR Created",
      description: "Purchase Requisition has been created successfully.",
    });
    setOpenPRDialog(false);
  };

  const handleCreateCS = () => {
    toast({
      title: "CS Created",
      description: "Comparative Sheet has been created successfully.",
    });
    setOpenCSDialog(false);
  };

  const p2pSteps = [
    { key: "OPS", label: "OPS", icon: FileText },
    { key: "PR", label: "PR", icon: FileText },
    { key: "SCM", label: "SCM", icon: Clock },
    { key: "CS", label: "CS", icon: FileText },
    { key: "MD_Review", label: "MD Review", icon: Clock },
    { key: "MD_Approved", label: "MD Approved", icon: CheckCircle },
    { key: "LOI", label: "LOI", icon: FileText },
    { key: "PO_Issued", label: "PO", icon: CheckCircle },
    { key: "GRN", label: "GRN", icon: FileText },
  ];

  // Filter orders based on search query
  const filteredOrders = orders.filter((order) => {
    const query = searchQuery.toLowerCase();
    return (
      order.opsNo.toLowerCase().includes(query) ||
      order.prNo?.toLowerCase().includes(query) ||
      order.csNo?.toLowerCase().includes(query) ||
      order.poNo?.toLowerCase().includes(query) ||
      order.grnNo?.toLowerCase().includes(query) ||
      order.recommendedSupplier?.toLowerCase().includes(query) ||
      order.suppliers?.some(supplier => supplier.toLowerCase().includes(query)) ||
      order.itemDescription.toLowerCase().includes(query)
    );
  });

  // Filter comparative sheets based on search query
  const filteredComparativeSheets = comparativeSheets.filter((cs) => {
    const query = searchQuery.toLowerCase();
    return (
      cs.csNo.toLowerCase().includes(query) ||
      cs.prNo.toLowerCase().includes(query) ||
      cs.recommendedSupplier.toLowerCase().includes(query) ||
      cs.vendors.some(vendor => vendor.name.toLowerCase().includes(query)) ||
      cs.itemDescription.toLowerCase().includes(query)
    );
  });

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">Purchase to Procure (P2P)</h1>
        <p className="text-muted-foreground mt-1">Manage complete procurement workflow</p>
      </div>

      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search PR/PO/CS/GRN/Vendor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active">Active Orders</TabsTrigger>
          <TabsTrigger value="comparative">Comparative Sheets</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Active P2P Orders</h2>
            <div className="flex gap-2">
              <Dialog open={openOPSDialog} onOpenChange={setOpenOPSDialog}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    New OPS
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Create Order Processing Sheet (OPS)</DialogTitle>
                    <DialogDescription>
                      Enter details for the new order processing sheet
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="item">Item Description</Label>
                        <Input id="item" placeholder="Enter item description" />
                      </div>
                      <div>
                        <Label htmlFor="quantity">Quantity</Label>
                        <Input id="quantity" type="number" placeholder="Enter quantity" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="warranty">Warranty</Label>
                        <Input id="warranty" placeholder="e.g., 1 Year" />
                      </div>
                      <div>
                        <Label htmlFor="delivery">Delivery Date</Label>
                        <Input id="delivery" type="date" />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="previous-price">Previous Price (Optional)</Label>
                      <Input id="previous-price" type="number" placeholder="Enter previous price" />
                    </div>
                    <div>
                      <Label htmlFor="notes">Additional Notes</Label>
                      <Textarea id="notes" placeholder="Any additional information" />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setOpenOPSDialog(false)}>Cancel</Button>
                    <Button onClick={handleCreateOPS}>Create OPS</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <Card>
            <CardContent className="pt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>OPS No.</TableHead>
                    <TableHead>Item Description</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Delivery Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.opsNo}</TableCell>
                      <TableCell>{order.itemDescription}</TableCell>
                      <TableCell>{order.quantity}</TableCell>
                      <TableCell>{order.deliveryDate}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(order.status)}>
                          {getStatusLabel(order.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {p2pSteps.map((step, idx) => (
                            <div key={step.key} className="flex items-center">
                              <div
                                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                                  p2pSteps.findIndex(s => s.key === order.status) >= idx
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-muted text-muted-foreground"
                                }`}
                              >
                                {idx + 1}
                              </div>
                              {idx < p2pSteps.length - 1 && (
                                <ArrowRight className="w-3 h-3 mx-1 text-muted-foreground" />
                              )}
                            </div>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">View Details</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comparative" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Comparative Sheets</h2>
            <Dialog open={openCSDialog} onOpenChange={setOpenCSDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  New CS
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create Comparative Sheet (CS)</DialogTitle>
                  <DialogDescription>
                    Add vendor quotes and compare prices
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="pr-no">PR Number</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select PR" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pr-001">PR-001</SelectItem>
                          <SelectItem value="pr-002">PR-002</SelectItem>
                          <SelectItem value="pr-003">PR-003</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="cs-item">Item Description</Label>
                      <Input id="cs-item" placeholder="Auto-filled from PR" disabled />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Vendor Quotations</h3>
                    <div className="space-y-4 border rounded-lg p-4">
                      <div className="grid grid-cols-6 gap-2 text-sm font-medium">
                        <div>Vendor</div>
                        <div>Price</div>
                        <div>Warranty</div>
                        <div>Delivery</div>
                        <div>Freight</div>
                        <div>Total</div>
                      </div>
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="grid grid-cols-6 gap-2">
                          <Input placeholder="Vendor name" />
                          <Input type="number" placeholder="Price" />
                          <Input placeholder="Warranty" />
                          <Input type="number" placeholder="Days" />
                          <Input type="number" placeholder="Freight" />
                          <Input type="number" placeholder="Total" disabled />
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="recommended">Recommended Supplier</Label>
                    <Input id="recommended" placeholder="Enter recommended supplier" />
                  </div>
                  <div>
                    <Label htmlFor="cs-notes">Notes & Justification</Label>
                    <Textarea id="cs-notes" placeholder="Explain why this supplier is recommended" />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setOpenCSDialog(false)}>Cancel</Button>
                  <Button onClick={handleCreateCS}>Create & Submit CS</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardContent className="pt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>CS No.</TableHead>
                    <TableHead>PR No.</TableHead>
                    <TableHead>Item</TableHead>
                    <TableHead>Vendors</TableHead>
                    <TableHead>Recommended</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredComparativeSheets.map((cs) => (
                    <TableRow key={cs.id}>
                      <TableCell className="font-medium">{cs.csNo}</TableCell>
                      <TableCell>{cs.prNo}</TableCell>
                      <TableCell>{cs.itemDescription}</TableCell>
                      <TableCell>{cs.vendors.length} vendors</TableCell>
                      <TableCell className="font-medium text-primary">{cs.recommendedSupplier}</TableCell>
                      <TableCell>
                        <Badge variant={cs.status === "Approved" ? "default" : "secondary"}>
                          {cs.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">View Details</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Completed Orders</CardTitle>
              <CardDescription>Orders that have completed the full P2P cycle</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>PO No.</TableHead>
                    <TableHead>GRN No.</TableHead>
                    <TableHead>Item</TableHead>
                    <TableHead>Supplier</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Completed Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">PO-001</TableCell>
                    <TableCell>GRN-001</TableCell>
                    <TableCell>Motor 1200W</TableCell>
                    <TableCell>Bajaj</TableCell>
                    <TableCell>₹44,500</TableCell>
                    <TableCell>2024-01-20</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PurchaseOrders;