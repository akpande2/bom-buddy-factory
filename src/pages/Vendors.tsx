import { useState, useMemo } from "react";
import { Plus, Search, Eye, Pencil, Trash2, ArrowUpDown, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "application/pdf"];

const vendorSchema = z.object({
  // General Info
  name: z.string().trim().min(1, "Vendor name is required").max(100, "Name too long"),
  vendorType: z.enum(["Manufacturer", "Trader", "Service Provider"], {
    required_error: "Vendor type is required",
  }),
  website: z.string().trim().url("Invalid URL").optional().or(z.literal("")),

  // Contact Details
  contactPerson: z.string().trim().min(1, "Contact person is required").max(100, "Name too long"),
  phone: z.string().trim().regex(/^[0-9]{10}$/, "Phone must be 10 digits"),
  email: z.string().trim().email("Invalid email address").max(255, "Email too long"),
  address: z.string().trim().min(1, "Address is required").max(500, "Address too long"),

  // Compliance
  gstNumber: z
    .string()
    .trim()
    .regex(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, "Invalid GST format"),
  panNumber: z.string().trim().regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN format"),
  msmeNumber: z.string().trim().max(50, "MSME number too long").optional().or(z.literal("")),
  udyamNumber: z.string().trim().max(50, "Udyam number too long").optional().or(z.literal("")),
  isoCertificates: z.string().optional(), // base64 encoded

  // Bank Details
  bankName: z.string().trim().min(1, "Bank name is required").max(100, "Bank name too long"),
  branchName: z.string().trim().min(1, "Branch name is required").max(100, "Branch name too long"),
  accountNumber: z.string().trim().regex(/^[0-9]{9,18}$/, "Invalid account number (9-18 digits)"),
  ifscCode: z.string().trim().regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, "Invalid IFSC code"),
  cancelledCheque: z.string().optional(), // base64 encoded

  // Internal
  rating: z.number().min(1).max(5),
  status: z.enum(["Active", "Inactive"]),
});

type Vendor = z.infer<typeof vendorSchema> & {
  id: string;
  isoCertificatesName?: string;
  cancelledChequeName?: string;
};

type SortField = keyof Omit<Vendor, "id" | "isoCertificates" | "cancelledCheque" | "isoCertificatesName" | "cancelledChequeName">;
type SortDirection = "asc" | "desc";

const Vendors = () => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);
  const [deleteVendor, setDeleteVendor] = useState<Vendor | null>(null);
  const [viewVendor, setViewVendor] = useState<Vendor | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [formData, setFormData] = useState({
    name: "",
    vendorType: "Manufacturer" as "Manufacturer" | "Trader" | "Service Provider",
    website: "",
    contactPerson: "",
    phone: "",
    email: "",
    address: "",
    gstNumber: "",
    panNumber: "",
    msmeNumber: "",
    udyamNumber: "",
    isoCertificates: "",
    isoCertificatesName: "",
    bankName: "",
    branchName: "",
    accountNumber: "",
    ifscCode: "",
    cancelledCheque: "",
    cancelledChequeName: "",
    rating: 3,
    status: "Active" as "Active" | "Inactive",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const filteredAndSortedVendors = useMemo(() => {
    let filtered = vendors.filter((vendor) => {
      const query = searchQuery.toLowerCase();
      return (
        vendor.name.toLowerCase().includes(query) ||
        vendor.email.toLowerCase().includes(query) ||
        vendor.contactPerson.toLowerCase().includes(query) ||
        vendor.phone.includes(query) ||
        vendor.gstNumber.toLowerCase().includes(query) ||
        vendor.panNumber.toLowerCase().includes(query) ||
        vendor.vendorType.toLowerCase().includes(query)
      );
    });

    filtered.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      const modifier = sortDirection === "asc" ? 1 : -1;

      if (typeof aValue === "string" && typeof bValue === "string") {
        return aValue.localeCompare(bValue) * modifier;
      }
      if (typeof aValue === "number" && typeof bValue === "number") {
        return (aValue - bValue) * modifier;
      }
      return 0;
    });

    return filtered;
  }, [vendors, searchQuery, sortField, sortDirection]);

  const resetForm = () => {
    setFormData({
      name: "",
      vendorType: "Manufacturer",
      website: "",
      contactPerson: "",
      phone: "",
      email: "",
      address: "",
      gstNumber: "",
      panNumber: "",
      msmeNumber: "",
      udyamNumber: "",
      isoCertificates: "",
      isoCertificatesName: "",
      bankName: "",
      branchName: "",
      accountNumber: "",
      ifscCode: "",
      cancelledCheque: "",
      cancelledChequeName: "",
      rating: 3,
      status: "Active",
    });
    setErrors({});
    setEditingVendor(null);
  };

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldName: "isoCertificates" | "cancelledCheque"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      setErrors({ ...errors, [fieldName]: "File size must be less than 5MB" });
      return;
    }

    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      setErrors({ ...errors, [fieldName]: "Only JPG, PNG, or PDF files are allowed" });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData({
        ...formData,
        [fieldName]: reader.result as string,
        [`${fieldName}Name`]: file.name,
      });
      setErrors({ ...errors, [fieldName]: "" });
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      const validatedData = vendorSchema.parse(formData);

      if (editingVendor) {
        setVendors(
          vendors.map((v) =>
            v.id === editingVendor.id
              ? {
                  ...validatedData,
                  id: editingVendor.id,
                  isoCertificatesName: formData.isoCertificatesName,
                  cancelledChequeName: formData.cancelledChequeName,
                }
              : v
          )
        );
        toast.success("Vendor updated successfully");
      } else {
        const newVendor: Vendor = {
          id: Date.now().toString(),
          ...validatedData,
          isoCertificatesName: formData.isoCertificatesName,
          cancelledChequeName: formData.cancelledChequeName,
        };
        setVendors([...vendors, newVendor]);
        toast.success("Vendor added successfully");
      }

      setIsOpen(false);
      resetForm();
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

  const handleEdit = (vendor: Vendor) => {
    setEditingVendor(vendor);
    setFormData({
      name: vendor.name,
      vendorType: vendor.vendorType,
      website: vendor.website || "",
      contactPerson: vendor.contactPerson,
      phone: vendor.phone,
      email: vendor.email,
      address: vendor.address,
      gstNumber: vendor.gstNumber,
      panNumber: vendor.panNumber,
      msmeNumber: vendor.msmeNumber || "",
      udyamNumber: vendor.udyamNumber || "",
      isoCertificates: vendor.isoCertificates || "",
      isoCertificatesName: vendor.isoCertificatesName || "",
      bankName: vendor.bankName,
      branchName: vendor.branchName,
      accountNumber: vendor.accountNumber,
      ifscCode: vendor.ifscCode,
      cancelledCheque: vendor.cancelledCheque || "",
      cancelledChequeName: vendor.cancelledChequeName || "",
      rating: vendor.rating,
      status: vendor.status,
    });
    setIsOpen(true);
  };

  const handleDelete = () => {
    if (deleteVendor) {
      setVendors(vendors.filter((v) => v.id !== deleteVendor.id));
      toast.success("Vendor deleted successfully");
      setDeleteVendor(null);
    }
  };

  const downloadFile = (base64Data: string, filename: string) => {
    const link = document.createElement("a");
    link.href = base64Data;
    link.download = filename;
    link.click();
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Vendor Management</h1>
          <p className="text-muted-foreground mt-1">Manage your vendor relationships</p>
        </div>

        <Dialog
          open={isOpen}
          onOpenChange={(open) => {
            setIsOpen(open);
            if (!open) resetForm();
          }}
        >
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add New Vendor
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingVendor ? "Edit Vendor" : "Add New Vendor"}</DialogTitle>
              <DialogDescription>
                {editingVendor ? "Update the vendor details below." : "Enter comprehensive vendor details."}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* General Info */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">General Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">
                      Vendor Name <span className="text-destructive">*</span>
                    </Label>
                    <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                    {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="vendorType">
                      Vendor Type <span className="text-destructive">*</span>
                    </Label>
                    <Select
                      value={formData.vendorType}
                      onValueChange={(val: "Manufacturer" | "Trader" | "Service Provider") =>
                        setFormData({ ...formData, vendorType: val })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Manufacturer">Manufacturer</SelectItem>
                        <SelectItem value="Trader">Trader</SelectItem>
                        <SelectItem value="Service Provider">Service Provider</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.vendorType && <p className="text-sm text-destructive">{errors.vendorType}</p>}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    placeholder="https://example.com"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  />
                  {errors.website && <p className="text-sm text-destructive">{errors.website}</p>}
                </div>
              </div>

              <Separator />

              {/* Contact Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Contact Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contactPerson">
                      Contact Person <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="contactPerson"
                      value={formData.contactPerson}
                      onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                    />
                    {errors.contactPerson && <p className="text-sm text-destructive">{errors.contactPerson}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">
                      Phone <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="phone"
                      placeholder="10 digit number"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, "").slice(0, 10) })}
                    />
                    {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">
                    Email <span className="text-destructive">*</span>
                  </Label>
                  <Input id="email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                  {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">
                    Address <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    id="address"
                    rows={3}
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  />
                  {errors.address && <p className="text-sm text-destructive">{errors.address}</p>}
                </div>
              </div>

              <Separator />

              {/* Compliance */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Compliance (India)</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="gstNumber">
                      GST Number <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="gstNumber"
                      placeholder="22AAAAA0000A1Z5"
                      value={formData.gstNumber}
                      onChange={(e) => setFormData({ ...formData, gstNumber: e.target.value.toUpperCase() })}
                    />
                    {errors.gstNumber && <p className="text-sm text-destructive">{errors.gstNumber}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="panNumber">
                      PAN Number <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="panNumber"
                      placeholder="AAAAA0000A"
                      value={formData.panNumber}
                      onChange={(e) => setFormData({ ...formData, panNumber: e.target.value.toUpperCase() })}
                    />
                    {errors.panNumber && <p className="text-sm text-destructive">{errors.panNumber}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="msmeNumber">MSME Registration Number</Label>
                    <Input
                      id="msmeNumber"
                      value={formData.msmeNumber}
                      onChange={(e) => setFormData({ ...formData, msmeNumber: e.target.value })}
                    />
                    {errors.msmeNumber && <p className="text-sm text-destructive">{errors.msmeNumber}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="udyamNumber">Udyam Registration</Label>
                    <Input
                      id="udyamNumber"
                      value={formData.udyamNumber}
                      onChange={(e) => setFormData({ ...formData, udyamNumber: e.target.value })}
                    />
                    {errors.udyamNumber && <p className="text-sm text-destructive">{errors.udyamNumber}</p>}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="isoCertificates">ISO Certificates (JPG, PNG, PDF - Max 5MB)</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="isoCertificates"
                      type="file"
                      accept=".jpg,.jpeg,.png,.pdf"
                      onChange={(e) => handleFileUpload(e, "isoCertificates")}
                      className="cursor-pointer"
                    />
                    {formData.isoCertificatesName && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => setFormData({ ...formData, isoCertificates: "", isoCertificatesName: "" })}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  {formData.isoCertificatesName && <p className="text-sm text-muted-foreground">Uploaded: {formData.isoCertificatesName}</p>}
                  {errors.isoCertificates && <p className="text-sm text-destructive">{errors.isoCertificates}</p>}
                </div>
              </div>

              <Separator />

              {/* Bank Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Bank Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="bankName">
                      Bank Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="bankName"
                      value={formData.bankName}
                      onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                    />
                    {errors.bankName && <p className="text-sm text-destructive">{errors.bankName}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="branchName">
                      Branch Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="branchName"
                      value={formData.branchName}
                      onChange={(e) => setFormData({ ...formData, branchName: e.target.value })}
                    />
                    {errors.branchName && <p className="text-sm text-destructive">{errors.branchName}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="accountNumber">
                      Account Number <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="accountNumber"
                      value={formData.accountNumber}
                      onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value.replace(/\D/g, "").slice(0, 18) })}
                    />
                    {errors.accountNumber && <p className="text-sm text-destructive">{errors.accountNumber}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ifscCode">
                      IFSC Code <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="ifscCode"
                      placeholder="ABCD0123456"
                      value={formData.ifscCode}
                      onChange={(e) => setFormData({ ...formData, ifscCode: e.target.value.toUpperCase() })}
                    />
                    {errors.ifscCode && <p className="text-sm text-destructive">{errors.ifscCode}</p>}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cancelledCheque">Cancelled Cheque (JPG, PNG, PDF - Max 5MB)</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="cancelledCheque"
                      type="file"
                      accept=".jpg,.jpeg,.png,.pdf"
                      onChange={(e) => handleFileUpload(e, "cancelledCheque")}
                      className="cursor-pointer"
                    />
                    {formData.cancelledChequeName && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => setFormData({ ...formData, cancelledCheque: "", cancelledChequeName: "" })}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  {formData.cancelledChequeName && <p className="text-sm text-muted-foreground">Uploaded: {formData.cancelledChequeName}</p>}
                  {errors.cancelledCheque && <p className="text-sm text-destructive">{errors.cancelledCheque}</p>}
                </div>
              </div>

              <Separator />

              {/* Internal */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Internal Settings</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="rating">
                      Vendor Rating (1-5) <span className="text-destructive">*</span>
                    </Label>
                    <Select value={formData.rating.toString()} onValueChange={(val) => setFormData({ ...formData, rating: parseInt(val) })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5].map((num) => (
                          <SelectItem key={num} value={num.toString()}>
                            {"★".repeat(num)} {num} Star{num !== 1 ? "s" : ""}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.rating && <p className="text-sm text-destructive">{errors.rating}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">
                      Status <span className="text-destructive">*</span>
                    </Label>
                    <Select
                      value={formData.status}
                      onValueChange={(val: "Active" | "Inactive") => setFormData({ ...formData, status: val })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.status && <p className="text-sm text-destructive">{errors.status}</p>}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">{editingVendor ? "Update Vendor" : "Add Vendor"}</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search vendors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {vendors.length > 0 ? (
        <div className="rounded-md border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="cursor-pointer" onClick={() => handleSort("name")}>
                  <div className="flex items-center gap-1">
                    Vendor Name
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort("vendorType")}>
                  <div className="flex items-center gap-1">
                    Type
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead>GST Number</TableHead>
                <TableHead>Contact Person</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort("rating")}>
                  <div className="flex items-center gap-1">
                    Rating
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort("status")}>
                  <div className="flex items-center gap-1">
                    Status
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedVendors.map((vendor) => (
                <TableRow key={vendor.id}>
                  <TableCell className="font-medium">{vendor.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{vendor.vendorType}</Badge>
                  </TableCell>
                  <TableCell className="font-mono text-xs">{vendor.gstNumber}</TableCell>
                  <TableCell>{vendor.contactPerson}</TableCell>
                  <TableCell>{vendor.phone}</TableCell>
                  <TableCell>{vendor.email}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-500">★</span>
                      <span>{vendor.rating}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={vendor.status === "Active" ? "default" : "secondary"}>{vendor.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => setViewVendor(vendor)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(vendor)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => setDeleteVendor(vendor)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="rounded-lg border border-dashed p-12 text-center">
          <p className="text-muted-foreground">No vendors added yet. Click "Add New Vendor" to get started.</p>
        </div>
      )}

      {/* View Dialog */}
      <Dialog open={!!viewVendor} onOpenChange={() => setViewVendor(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Vendor Details</DialogTitle>
          </DialogHeader>
          {viewVendor && (
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold mb-3 text-foreground">General Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Vendor Name</Label>
                    <p className="font-medium">{viewVendor.name}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Vendor Type</Label>
                    <p className="font-medium">
                      <Badge variant="outline">{viewVendor.vendorType}</Badge>
                    </p>
                  </div>
                  {viewVendor.website && (
                    <div className="col-span-2">
                      <Label className="text-muted-foreground">Website</Label>
                      <p className="font-medium">
                        <a href={viewVendor.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                          {viewVendor.website}
                        </a>
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-semibold mb-3 text-foreground">Contact Details</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Contact Person</Label>
                    <p className="font-medium">{viewVendor.contactPerson}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Phone</Label>
                    <p className="font-medium">{viewVendor.phone}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Email</Label>
                    <p className="font-medium">{viewVendor.email}</p>
                  </div>
                  <div className="col-span-2">
                    <Label className="text-muted-foreground">Address</Label>
                    <p className="font-medium">{viewVendor.address}</p>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-semibold mb-3 text-foreground">Compliance</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">GST Number</Label>
                    <p className="font-medium font-mono text-sm">{viewVendor.gstNumber}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">PAN Number</Label>
                    <p className="font-medium font-mono text-sm">{viewVendor.panNumber}</p>
                  </div>
                  {viewVendor.msmeNumber && (
                    <div>
                      <Label className="text-muted-foreground">MSME Number</Label>
                      <p className="font-medium">{viewVendor.msmeNumber}</p>
                    </div>
                  )}
                  {viewVendor.udyamNumber && (
                    <div>
                      <Label className="text-muted-foreground">Udyam Number</Label>
                      <p className="font-medium">{viewVendor.udyamNumber}</p>
                    </div>
                  )}
                  {viewVendor.isoCertificates && (
                    <div className="col-span-2">
                      <Label className="text-muted-foreground">ISO Certificates</Label>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-2"
                        onClick={() => downloadFile(viewVendor.isoCertificates!, viewVendor.isoCertificatesName || "iso-certificate")}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Download {viewVendor.isoCertificatesName}
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-semibold mb-3 text-foreground">Bank Details</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Bank Name</Label>
                    <p className="font-medium">{viewVendor.bankName}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Branch</Label>
                    <p className="font-medium">{viewVendor.branchName}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Account Number</Label>
                    <p className="font-medium font-mono text-sm">{viewVendor.accountNumber}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">IFSC Code</Label>
                    <p className="font-medium font-mono text-sm">{viewVendor.ifscCode}</p>
                  </div>
                  {viewVendor.cancelledCheque && (
                    <div className="col-span-2">
                      <Label className="text-muted-foreground">Cancelled Cheque</Label>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-2"
                        onClick={() =>
                          downloadFile(viewVendor.cancelledCheque!, viewVendor.cancelledChequeName || "cancelled-cheque")
                        }
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Download {viewVendor.cancelledChequeName}
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-semibold mb-3 text-foreground">Internal Settings</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Rating</Label>
                    <p className="font-medium flex items-center gap-1">
                      <span className="text-yellow-500">★</span>
                      {viewVendor.rating}
                    </p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Status</Label>
                    <div className="mt-1">
                      <Badge variant={viewVendor.status === "Active" ? "default" : "secondary"}>{viewVendor.status}</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={!!deleteVendor} onOpenChange={() => setDeleteVendor(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete <strong>{deleteVendor?.name}</strong>. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Vendors;
