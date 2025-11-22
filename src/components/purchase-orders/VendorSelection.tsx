import { useState, useEffect } from "react";
import { Plus, Building2, Star } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { z } from "zod";
import { useVendorStore, type Vendor } from "@/stores/vendorStore";

interface VendorSelectionProps {
  selectedVendorId?: string;
  onVendorSelect?: (vendor: Vendor | null) => void;
}

const quickAddVendorSchema = z.object({
  name: z.string().trim().min(1, "Vendor name is required").max(100),
  gstNumber: z.string().trim().regex(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, "Invalid GST format"),
  email: z.string().trim().email("Invalid email"),
  phone: z.string().trim().regex(/^[0-9]{10}$/, "Phone must be 10 digits"),
  contactPerson: z.string().trim().min(1, "Contact person is required"),
});

export const VendorSelection = ({ selectedVendorId, onVendorSelect }: VendorSelectionProps) => {
  const { getActiveVendors, addVendor, getVendorById } = useVendorStore();
  const vendors = getActiveVendors();
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    gstNumber: "",
    email: "",
    phone: "",
    contactPerson: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Set selected vendor if provided
  useEffect(() => {
    if (selectedVendorId) {
      const vendor = getVendorById(selectedVendorId);
      if (vendor) {
        setSelectedVendor(vendor);
        onVendorSelect?.(vendor);
      }
    }
  }, [selectedVendorId, getVendorById, onVendorSelect]);

  const handleVendorChange = (vendorId: string) => {
    const vendor = vendors.find((v) => v.id === vendorId);
    setSelectedVendor(vendor || null);
    onVendorSelect?.(vendor || null);
  };

  const calculateOverallRating = (vendor: Vendor) => {
    if (!vendor.ratings) return vendor.rating || 0;
    const values = Object.values(vendor.ratings).filter((v) => v > 0);
    if (values.length === 0) return vendor.rating || 0;
    return Number((values.reduce((a, b) => a + b, 0) / values.length).toFixed(1));
  };

  const handleQuickAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      const validatedData = quickAddVendorSchema.parse(formData);

      const newVendor: Vendor = {
        id: Date.now().toString(),
        name: validatedData.name,
        vendorType: "Manufacturer",
        contactPerson: validatedData.contactPerson,
        phone: validatedData.phone,
        email: validatedData.email,
        address: "",
        gstNumber: validatedData.gstNumber,
        panNumber: "",
        bankName: "",
        branchName: "",
        accountNumber: "",
        ifscCode: "",
        rating: 3,
        status: "Active",
      };

      // Save to store
      addVendor(newVendor);

      // Update state
      setSelectedVendor(newVendor);
      onVendorSelect?.(newVendor);

      // Reset form
      setFormData({
        name: "",
        gstNumber: "",
        email: "",
        phone: "",
        contactPerson: "",
      });
      setIsQuickAddOpen(false);
      toast.success("Vendor created successfully");
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0].toString()] = err.message;
          }
        });
        setErrors(fieldErrors);
        toast.error("Please fix the validation errors");
      }
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Vendor Selection
          </CardTitle>
          <CardDescription>Select vendor for this procurement request</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="vendor">Select Vendor</Label>
            <div className="flex gap-2">
              <Select value={selectedVendor?.id || ""} onValueChange={handleVendorChange}>
                <SelectTrigger id="vendor" className="flex-1 bg-background">
                  <SelectValue placeholder="Choose a vendor..." />
                </SelectTrigger>
                <SelectContent className="bg-popover z-50">
                  {vendors.map((vendor) => (
                    <SelectItem key={vendor.id} value={vendor.id} className="cursor-pointer">
                      <div className="flex items-center justify-between w-full">
                        <span>{vendor.name}</span>
                        <Badge variant="secondary" className="ml-2">
                          <Star className="h-3 w-3 fill-yellow-500 text-yellow-500 mr-1" />
                          {calculateOverallRating(vendor).toFixed(1)}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={() => setIsQuickAddOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                New
              </Button>
            </div>
          </div>

          {selectedVendor && (
            <div className="pt-4 space-y-3 border-t">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-muted-foreground">Vendor Name</Label>
                  <p className="text-sm font-medium">{selectedVendor.name}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Overall Rating</Label>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                    <span className="text-sm font-medium">{calculateOverallRating(selectedVendor).toFixed(1)}/5.0</span>
                  </div>
                </div>
                <div className="col-span-2">
                  <Label className="text-xs text-muted-foreground">GST Number</Label>
                  <p className="text-sm font-medium font-mono">{selectedVendor.gstNumber}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Contact Person</Label>
                  <p className="text-sm font-medium">{selectedVendor.contactPerson}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Phone</Label>
                  <p className="text-sm font-medium">{selectedVendor.phone}</p>
                </div>
                <div className="col-span-2">
                  <Label className="text-xs text-muted-foreground">Email</Label>
                  <p className="text-sm font-medium">{selectedVendor.email}</p>
                </div>
              </div>

              {selectedVendor.ratings && (
                <div className="pt-2">
                  <Label className="text-xs text-muted-foreground mb-2 block">Performance Ratings</Label>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Delivery:</span>
                      <span className="font-medium">{selectedVendor.ratings.deliveryTimeliness}/5</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Quality:</span>
                      <span className="font-medium">{selectedVendor.ratings.quality}/5</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Pricing:</span>
                      <span className="font-medium">{selectedVendor.ratings.pricingConsistency}/5</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Communication:</span>
                      <span className="font-medium">{selectedVendor.ratings.communication}/5</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {vendors.length === 0 && (
            <div className="text-center py-6">
              <p className="text-sm text-muted-foreground mb-3">No active vendors found</p>
              <Button variant="outline" onClick={() => setIsQuickAddOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create First Vendor
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Add Vendor Dialog */}
      <Dialog open={isQuickAddOpen} onOpenChange={setIsQuickAddOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Quick Add Vendor</DialogTitle>
            <DialogDescription>Add basic vendor details. You can complete the full profile later.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleQuickAddSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="qName">
                Vendor Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="qName"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter vendor name"
              />
              {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="qGst">
                GST Number <span className="text-destructive">*</span>
              </Label>
              <Input
                id="qGst"
                value={formData.gstNumber}
                onChange={(e) => setFormData({ ...formData, gstNumber: e.target.value.toUpperCase() })}
                placeholder="22AAAAA0000A1Z5"
              />
              {errors.gstNumber && <p className="text-sm text-destructive">{errors.gstNumber}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="qContact">
                Contact Person <span className="text-destructive">*</span>
              </Label>
              <Input
                id="qContact"
                value={formData.contactPerson}
                onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                placeholder="Contact person name"
              />
              {errors.contactPerson && <p className="text-sm text-destructive">{errors.contactPerson}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="qEmail">
                  Email <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="qEmail"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="email@example.com"
                />
                {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="qPhone">
                  Phone <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="qPhone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, "").slice(0, 10) })}
                  placeholder="10 digit number"
                />
                {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsQuickAddOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Create Vendor</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};
