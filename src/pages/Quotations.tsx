import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, FileText, Download, Send } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface QuotationItem {
  id: string;
  itemDescription: string;
  partNumber: string;
  quantity: number;
  unitPrice: number;
  taxPercent: number;
  total: number;
}

interface Quotation {
  id: string;
  quotationNo: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  quotationDate: string;
  validUntil: string;
  items: QuotationItem[];
  subtotal: number;
  taxAmount: number;
  grandTotal: number;
  status: "Draft" | "Sent" | "Accepted" | "Rejected";
  notes?: string;
}

const Quotations = () => {
  const [openNewQuotation, setOpenNewQuotation] = useState(false);
  const [quotationItems, setQuotationItems] = useState<QuotationItem[]>([]);
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [validUntil, setValidUntil] = useState("");
  const [notes, setNotes] = useState("");

  const [existingQuotations] = useState<Quotation[]>([
    {
      id: "1",
      quotationNo: "QT-2024-001",
      customerName: "ABC Industries",
      customerEmail: "contact@abc.com",
      customerPhone: "+91 98765 43210",
      quotationDate: "2024-01-15",
      validUntil: "2024-02-15",
      items: [
        {
          id: "1",
          itemDescription: "Table Fan 16 inch",
          partNumber: "TF-16-001",
          quantity: 100,
          unitPrice: 850,
          taxPercent: 18,
          total: 100300,
        },
      ],
      subtotal: 85000,
      taxAmount: 15300,
      grandTotal: 100300,
      status: "Sent",
    },
  ]);

  const addQuotationItem = () => {
    const newItem: QuotationItem = {
      id: Date.now().toString(),
      itemDescription: "",
      partNumber: "",
      quantity: 1,
      unitPrice: 0,
      taxPercent: 18,
      total: 0,
    };
    setQuotationItems([...quotationItems, newItem]);
  };

  const removeQuotationItem = (id: string) => {
    setQuotationItems(quotationItems.filter((item) => item.id !== id));
  };

  const updateQuotationItem = (id: string, field: keyof QuotationItem, value: any) => {
    setQuotationItems(
      quotationItems.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value };
          // Calculate total when quantity, unit price, or tax changes
          if (field === "quantity" || field === "unitPrice" || field === "taxPercent") {
            const subtotal = updatedItem.quantity * updatedItem.unitPrice;
            const tax = (subtotal * updatedItem.taxPercent) / 100;
            updatedItem.total = subtotal + tax;
          }
          return updatedItem;
        }
        return item;
      })
    );
  };

  const calculateTotals = () => {
    const subtotal = quotationItems.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
    const taxAmount = quotationItems.reduce(
      (sum, item) => sum + (item.quantity * item.unitPrice * item.taxPercent) / 100,
      0
    );
    const grandTotal = subtotal + taxAmount;
    return { subtotal, taxAmount, grandTotal };
  };

  const handleCreateQuotation = () => {
    if (!customerName || !customerEmail || quotationItems.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please fill in customer details and add at least one item.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Quotation Created",
      description: `Quotation for ${customerName} has been created successfully.`,
    });
    setOpenNewQuotation(false);
    // Reset form
    setQuotationItems([]);
    setCustomerName("");
    setCustomerEmail("");
    setCustomerPhone("");
    setValidUntil("");
    setNotes("");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Draft":
        return "bg-muted text-muted-foreground";
      case "Sent":
        return "bg-primary text-primary-foreground";
      case "Accepted":
        return "bg-success text-success-foreground";
      case "Rejected":
        return "bg-destructive text-destructive-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const { subtotal, taxAmount, grandTotal } = calculateTotals();

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">Quotations</h1>
        <p className="text-muted-foreground mt-1">Create and manage customer quotations</p>
      </div>

      <div className="flex justify-end mb-4">
        <Dialog open={openNewQuotation} onOpenChange={setOpenNewQuotation}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Quotation
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Quotation</DialogTitle>
              <DialogDescription>Build a detailed quotation for your customer</DialogDescription>
            </DialogHeader>
            <div className="grid gap-6 py-4">
              {/* Customer Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Customer Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="customer-name">Customer Name *</Label>
                      <Input
                        id="customer-name"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="Enter customer name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="customer-email">Email Address *</Label>
                      <Input
                        id="customer-email"
                        type="email"
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        placeholder="customer@example.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="customer-phone">Phone Number</Label>
                      <Input
                        id="customer-phone"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        placeholder="+91 XXXXX XXXXX"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <Label htmlFor="valid-until">Valid Until</Label>
                      <Input
                        id="valid-until"
                        type="date"
                        value={validUntil}
                        onChange={(e) => setValidUntil(e.target.value)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quotation Items */}
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg">Quotation Items</CardTitle>
                    <Button onClick={addQuotationItem} variant="outline" size="sm">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Item
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {quotationItems.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No items added. Click "Add Item" to start.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[250px]">Item Description</TableHead>
                            <TableHead className="w-[150px]">Part Number</TableHead>
                            <TableHead className="w-[100px]">Quantity</TableHead>
                            <TableHead className="w-[120px]">Unit Price (₹)</TableHead>
                            <TableHead className="w-[100px]">Tax (%)</TableHead>
                            <TableHead className="w-[120px]">Total (₹)</TableHead>
                            <TableHead className="w-[50px]"></TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {quotationItems.map((item) => (
                            <TableRow key={item.id}>
                              <TableCell>
                                <Input
                                  value={item.itemDescription}
                                  onChange={(e) =>
                                    updateQuotationItem(item.id, "itemDescription", e.target.value)
                                  }
                                  placeholder="Item description"
                                />
                              </TableCell>
                              <TableCell>
                                <Input
                                  value={item.partNumber}
                                  onChange={(e) => updateQuotationItem(item.id, "partNumber", e.target.value)}
                                  placeholder="Part #"
                                />
                              </TableCell>
                              <TableCell>
                                <Input
                                  type="number"
                                  value={item.quantity}
                                  onChange={(e) =>
                                    updateQuotationItem(item.id, "quantity", parseInt(e.target.value) || 0)
                                  }
                                  min="1"
                                />
                              </TableCell>
                              <TableCell>
                                <Input
                                  type="number"
                                  value={item.unitPrice}
                                  onChange={(e) =>
                                    updateQuotationItem(item.id, "unitPrice", parseFloat(e.target.value) || 0)
                                  }
                                  min="0"
                                  step="0.01"
                                />
                              </TableCell>
                              <TableCell>
                                <Select
                                  value={item.taxPercent.toString()}
                                  onValueChange={(value) =>
                                    updateQuotationItem(item.id, "taxPercent", parseFloat(value))
                                  }
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="0">0%</SelectItem>
                                    <SelectItem value="5">5%</SelectItem>
                                    <SelectItem value="12">12%</SelectItem>
                                    <SelectItem value="18">18%</SelectItem>
                                    <SelectItem value="28">28%</SelectItem>
                                  </SelectContent>
                                </Select>
                              </TableCell>
                              <TableCell className="font-medium">
                                ₹{item.total.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
                              </TableCell>
                              <TableCell>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => removeQuotationItem(item.id)}
                                >
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>

                      {/* Totals */}
                      <div className="flex justify-end">
                        <div className="w-80 space-y-2 border-t pt-4">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Subtotal:</span>
                            <span className="font-medium">
                              ₹{subtotal.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Tax Amount:</span>
                            <span className="font-medium">
                              ₹{taxAmount.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
                            </span>
                          </div>
                          <div className="flex justify-between text-lg font-bold border-t pt-2">
                            <span>Grand Total:</span>
                            <span>₹{grandTotal.toLocaleString("en-IN", { maximumFractionDigits: 2 })}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Additional Notes */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Additional Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add any terms, conditions, or special notes for the customer..."
                    rows={4}
                  />
                </CardContent>
              </Card>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpenNewQuotation(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateQuotation}>Create Quotation</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Existing Quotations */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Quotations</CardTitle>
          <CardDescription>View and manage your customer quotations</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Quotation No.</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Valid Until</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {existingQuotations.map((quotation) => (
                <TableRow key={quotation.id}>
                  <TableCell className="font-medium">{quotation.quotationNo}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{quotation.customerName}</p>
                      <p className="text-sm text-muted-foreground">{quotation.customerEmail}</p>
                    </div>
                  </TableCell>
                  <TableCell>{quotation.quotationDate}</TableCell>
                  <TableCell>{quotation.validUntil}</TableCell>
                  <TableCell className="font-medium">
                    ₹{quotation.grandTotal.toLocaleString("en-IN")}
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(quotation.status)}>{quotation.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <FileText className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-1" />
                        PDF
                      </Button>
                      <Button variant="outline" size="sm">
                        <Send className="h-4 w-4 mr-1" />
                        Send
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Quotations;
