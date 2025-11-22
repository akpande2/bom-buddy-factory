import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Pencil, FileText, Upload, Download, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface Vendor {
  id: string;
  name: string;
  vendorType: "Manufacturer" | "Trader" | "Service Provider";
  website?: string;
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  gstNumber: string;
  panNumber: string;
  msmeNumber?: string;
  udyamNumber?: string;
  isoCertificates?: string;
  isoCertificatesName?: string;
  bankName: string;
  branchName: string;
  accountNumber: string;
  ifscCode: string;
  cancelledCheque?: string;
  cancelledChequeName?: string;
  rating: number;
  status: "Active" | "Inactive";
  productCategories?: string[];
  notes?: { id: string; text: string; date: string; author: string }[];
  additionalDocuments?: { id: string; name: string; uploadDate: string; type: string; data: string }[];
}

const VendorProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Get vendor from localStorage
  const getVendor = (): Vendor | null => {
    const vendorsData = localStorage.getItem("vendors");
    if (!vendorsData) return null;
    const vendors = JSON.parse(vendorsData);
    return vendors.find((v: Vendor) => v.id === id) || null;
  };

  const [vendor, setVendor] = useState<Vendor | null>(getVendor());
  const [isNoteDialogOpen, setIsNoteDialogOpen] = useState(false);
  const [isDocDialogOpen, setIsDocDialogOpen] = useState(false);
  const [isTagDialogOpen, setIsTagDialogOpen] = useState(false);
  const [newNote, setNewNote] = useState("");
  const [newTag, setNewTag] = useState("");
  const [uploadingDoc, setUploadingDoc] = useState<{ name: string; data: string } | null>(null);

  if (!vendor) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground">Vendor Not Found</h2>
          <p className="text-muted-foreground mt-2">The vendor you're looking for doesn't exist.</p>
          <Button className="mt-4" onClick={() => navigate("/vendors")}>
            Back to Vendors
          </Button>
        </div>
      </div>
    );
  }

  const updateVendor = (updatedVendor: Vendor) => {
    const vendorsData = localStorage.getItem("vendors");
    if (!vendorsData) return;

    const vendors = JSON.parse(vendorsData);
    const updatedVendors = vendors.map((v: Vendor) => (v.id === updatedVendor.id ? updatedVendor : v));
    localStorage.setItem("vendors", JSON.stringify(updatedVendors));
    setVendor(updatedVendor);
  };

  const handleAddNote = () => {
    if (!newNote.trim()) {
      toast.error("Please enter a note");
      return;
    }

    const note = {
      id: Date.now().toString(),
      text: newNote,
      date: new Date().toISOString(),
      author: "Current User",
    };

    const updatedVendor = {
      ...vendor,
      notes: [...(vendor.notes || []), note],
    };

    updateVendor(updatedVendor);
    setNewNote("");
    setIsNoteDialogOpen(false);
    toast.success("Note added successfully");
  };

  const handleDeleteNote = (noteId: string) => {
    const updatedVendor = {
      ...vendor,
      notes: vendor.notes?.filter((n) => n.id !== noteId) || [],
    };
    updateVendor(updatedVendor);
    toast.success("Note deleted");
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setUploadingDoc({
        name: file.name,
        data: reader.result as string,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleUploadDocument = () => {
    if (!uploadingDoc) {
      toast.error("Please select a document");
      return;
    }

    const doc = {
      id: Date.now().toString(),
      name: uploadingDoc.name,
      uploadDate: new Date().toISOString(),
      type: uploadingDoc.name.split(".").pop() || "unknown",
      data: uploadingDoc.data,
    };

    const updatedVendor = {
      ...vendor,
      additionalDocuments: [...(vendor.additionalDocuments || []), doc],
    };

    updateVendor(updatedVendor);
    setUploadingDoc(null);
    setIsDocDialogOpen(false);
    toast.success("Document uploaded successfully");
  };

  const handleDeleteDocument = (docId: string) => {
    const updatedVendor = {
      ...vendor,
      additionalDocuments: vendor.additionalDocuments?.filter((d) => d.id !== docId) || [],
    };
    updateVendor(updatedVendor);
    toast.success("Document deleted");
  };

  const handleAddTag = () => {
    if (!newTag.trim()) {
      toast.error("Please enter a category");
      return;
    }

    if (vendor.productCategories?.includes(newTag.trim())) {
      toast.error("Category already exists");
      return;
    }

    const updatedVendor = {
      ...vendor,
      productCategories: [...(vendor.productCategories || []), newTag.trim()],
    };

    updateVendor(updatedVendor);
    setNewTag("");
    setIsTagDialogOpen(false);
    toast.success("Category added");
  };

  const handleDeleteTag = (tag: string) => {
    const updatedVendor = {
      ...vendor,
      productCategories: vendor.productCategories?.filter((t) => t !== tag) || [],
    };
    updateVendor(updatedVendor);
    toast.success("Category removed");
  };

  const downloadFile = (data: string, filename: string) => {
    const link = document.createElement("a");
    link.href = data;
    link.download = filename;
    link.click();
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/vendors")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">{vendor.name}</h1>
            <p className="text-muted-foreground mt-1">
              <Badge variant="outline" className="mr-2">
                {vendor.vendorType}
              </Badge>
              <Badge variant={vendor.status === "Active" ? "default" : "secondary"}>{vendor.status}</Badge>
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsNoteDialogOpen(true)}>
            <FileText className="h-4 w-4 mr-2" />
            Add Note
          </Button>
          <Button variant="outline" onClick={() => setIsDocDialogOpen(true)}>
            <Upload className="h-4 w-4 mr-2" />
            Upload Document
          </Button>
          <Button onClick={() => navigate(`/vendors`)}>
            <Pencil className="h-4 w-4 mr-2" />
            Edit Vendor
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Vendor Information Card */}
          <Card>
            <CardHeader>
              <CardTitle>Vendor Information</CardTitle>
              <CardDescription>General details and contact information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Vendor Name</Label>
                  <p className="font-medium text-lg">{vendor.name}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Vendor Type</Label>
                  <p className="font-medium">
                    <Badge variant="outline">{vendor.vendorType}</Badge>
                  </p>
                </div>
                {vendor.website && (
                  <div className="col-span-2">
                    <Label className="text-muted-foreground">Website</Label>
                    <p className="font-medium">
                      <a href={vendor.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                        {vendor.website}
                      </a>
                    </p>
                  </div>
                )}
                <div>
                  <Label className="text-muted-foreground">Rating</Label>
                  <p className="font-medium flex items-center gap-1">
                    <span className="text-yellow-500">{"★".repeat(vendor.rating)}</span>
                    <span className="text-muted-foreground">{"☆".repeat(5 - vendor.rating)}</span>
                    <span className="ml-2">{vendor.rating}/5</span>
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Status</Label>
                  <div className="mt-1">
                    <Badge variant={vendor.status === "Active" ? "default" : "secondary"}>{vendor.status}</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Details Card */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Contact Person</Label>
                  <p className="font-medium">{vendor.contactPerson}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Phone</Label>
                  <p className="font-medium">{vendor.phone}</p>
                </div>
                <div className="col-span-2">
                  <Label className="text-muted-foreground">Email</Label>
                  <p className="font-medium">{vendor.email}</p>
                </div>
                <div className="col-span-2">
                  <Label className="text-muted-foreground">Address</Label>
                  <p className="font-medium">{vendor.address}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Compliance Badges */}
          <Card>
            <CardHeader>
              <CardTitle>Compliance & Registrations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg bg-muted/50">
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-sm font-semibold">GST Registration</Label>
                    <Badge variant="default">Verified</Badge>
                  </div>
                  <p className="font-mono text-sm">{vendor.gstNumber}</p>
                </div>
                <div className="p-4 border rounded-lg bg-muted/50">
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-sm font-semibold">PAN Number</Label>
                    <Badge variant="default">Verified</Badge>
                  </div>
                  <p className="font-mono text-sm">{vendor.panNumber}</p>
                </div>
                {vendor.msmeNumber && (
                  <div className="p-4 border rounded-lg bg-muted/50">
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-sm font-semibold">MSME Registration</Label>
                      <Badge variant="secondary">Registered</Badge>
                    </div>
                    <p className="font-mono text-sm">{vendor.msmeNumber}</p>
                  </div>
                )}
                {vendor.udyamNumber && (
                  <div className="p-4 border rounded-lg bg-muted/50">
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-sm font-semibold">Udyam Registration</Label>
                      <Badge variant="secondary">Registered</Badge>
                    </div>
                    <p className="font-mono text-sm">{vendor.udyamNumber}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Bank Details Card */}
          <Card>
            <CardHeader>
              <CardTitle>Bank Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Bank Name</Label>
                  <p className="font-medium">{vendor.bankName}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Branch</Label>
                  <p className="font-medium">{vendor.branchName}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Account Number</Label>
                  <p className="font-medium font-mono text-sm">{vendor.accountNumber}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">IFSC Code</Label>
                  <p className="font-medium font-mono text-sm">{vendor.ifscCode}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notes Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Notes</CardTitle>
                <Button size="sm" variant="outline" onClick={() => setIsNoteDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add Note
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {vendor.notes && vendor.notes.length > 0 ? (
                <div className="space-y-3">
                  {vendor.notes.map((note) => (
                    <div key={note.id} className="p-3 border rounded-lg bg-muted/30">
                      <div className="flex items-start justify-between mb-2">
                        <div className="text-xs text-muted-foreground">
                          {note.author} • {new Date(note.date).toLocaleDateString()}
                        </div>
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleDeleteNote(note.id)}>
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                      <p className="text-sm">{note.text}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">No notes added yet</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Documents & Categories */}
        <div className="space-y-6">
          {/* Product Categories */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Product Categories</CardTitle>
                <Button size="sm" variant="outline" onClick={() => setIsTagDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {vendor.productCategories && vendor.productCategories.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {vendor.productCategories.map((category) => (
                    <Badge key={category} variant="secondary" className="gap-1">
                      {category}
                      <button onClick={() => handleDeleteTag(category)} className="ml-1 hover:text-destructive">
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">No categories added</p>
              )}
            </CardContent>
          </Card>

          {/* Uploaded Documents */}
          <Card>
            <CardHeader>
              <CardTitle>Documents</CardTitle>
              <CardDescription>Compliance and additional documents</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {vendor.isoCertificates && (
                <div className="p-3 border rounded-lg bg-muted/30">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <Label className="text-sm font-medium">ISO Certificates</Label>
                      <p className="text-xs text-muted-foreground">{vendor.isoCertificatesName}</p>
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => downloadFile(vendor.isoCertificates!, vendor.isoCertificatesName || "iso-certificate")}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              {vendor.cancelledCheque && (
                <div className="p-3 border rounded-lg bg-muted/30">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <Label className="text-sm font-medium">Cancelled Cheque</Label>
                      <p className="text-xs text-muted-foreground">{vendor.cancelledChequeName}</p>
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => downloadFile(vendor.cancelledCheque!, vendor.cancelledChequeName || "cancelled-cheque")}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              {vendor.additionalDocuments && vendor.additionalDocuments.length > 0 && (
                <>
                  <Separator className="my-3" />
                  <Label className="text-sm font-semibold">Additional Documents</Label>
                  {vendor.additionalDocuments.map((doc) => (
                    <div key={doc.id} className="p-3 border rounded-lg bg-muted/30">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex-1">
                          <Label className="text-sm font-medium">{doc.name}</Label>
                          <p className="text-xs text-muted-foreground">
                            {new Date(doc.uploadDate).toLocaleDateString()} • {doc.type.toUpperCase()}
                          </p>
                        </div>
                        <div className="flex gap-1">
                          <Button size="icon" variant="ghost" onClick={() => downloadFile(doc.data, doc.name)}>
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button size="icon" variant="ghost" onClick={() => handleDeleteDocument(doc.id)}>
                            <X className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              )}

              {!vendor.isoCertificates && !vendor.cancelledCheque && (!vendor.additionalDocuments || vendor.additionalDocuments.length === 0) && (
                <p className="text-sm text-muted-foreground text-center py-4">No documents uploaded</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Add Note Dialog */}
      <Dialog open={isNoteDialogOpen} onOpenChange={setIsNoteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Note</DialogTitle>
            <DialogDescription>Add a note or comment about this vendor</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="note">Note</Label>
              <Textarea id="note" rows={4} value={newNote} onChange={(e) => setNewNote(e.target.value)} placeholder="Enter your note here..." />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsNoteDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddNote}>Add Note</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Upload Document Dialog */}
      <Dialog open={isDocDialogOpen} onOpenChange={setIsDocDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Document</DialogTitle>
            <DialogDescription>Upload additional documents for this vendor (Max 5MB)</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="document">Select Document</Label>
              <Input id="document" type="file" onChange={handleFileUpload} accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" />
              {uploadingDoc && <p className="text-sm text-muted-foreground">Selected: {uploadingDoc.name}</p>}
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsDocDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUploadDocument} disabled={!uploadingDoc}>
                Upload
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Category Dialog */}
      <Dialog open={isTagDialogOpen} onOpenChange={setIsTagDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Product Category</DialogTitle>
            <DialogDescription>Add a product category tag for this vendor</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category Name</Label>
              <Input
                id="category"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="e.g., Electronics, Raw Materials"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsTagDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddTag}>Add Category</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VendorProfile;
