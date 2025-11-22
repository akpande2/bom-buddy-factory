import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Pencil, FileText, Upload, Download, Plus, X, Eye, FileCheck, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useVendorStore } from "@/stores/vendorStore";
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
import type { Vendor } from "@/stores/vendorStore";

const VendorProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getVendorById, updateVendor } = useVendorStore();

  const vendor = id ? getVendorById(id) : null;
  const [isNoteDialogOpen, setIsNoteDialogOpen] = useState(false);
  const [isDocDialogOpen, setIsDocDialogOpen] = useState(false);
  const [isTagDialogOpen, setIsTagDialogOpen] = useState(false);
  const [isVaultUploadOpen, setIsVaultUploadOpen] = useState(false);
  const [isRatingDialogOpen, setIsRatingDialogOpen] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<{ name: string; data: string } | null>(null);
  const [vaultDocType, setVaultDocType] = useState<"gst" | "msme" | "iso" | "cheque">("gst");
  const [newNote, setNewNote] = useState("");
  const [newTag, setNewTag] = useState("");
  const [uploadingDoc, setUploadingDoc] = useState<{ name: string; data: string } | null>(null);
  const [ratings, setRatings] = useState({
    deliveryTimeliness: vendor?.ratings?.deliveryTimeliness || 0,
    quality: vendor?.ratings?.quality || 0,
    pricingConsistency: vendor?.ratings?.pricingConsistency || 0,
    communication: vendor?.ratings?.communication || 0,
  });

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

  const handleVendorUpdate = (updatedFields: Partial<Vendor>) => {
    updateVendor(vendor.id, updatedFields);
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

    updateVendor(vendor.id, updatedVendor);
    setNewNote("");
    setIsNoteDialogOpen(false);
    toast.success("Note added successfully");
  };

  const handleDeleteNote = (noteId: string) => {
    const updatedVendor = {
      ...vendor,
      notes: vendor.notes?.filter((n) => n.id !== noteId) || [],
    };
    updateVendor(vendor.id, updatedVendor);
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

    updateVendor(vendor.id, updatedVendor);
    setUploadingDoc(null);
    setIsDocDialogOpen(false);
    toast.success("Document uploaded successfully");
  };

  const handleDeleteDocument = (docId: string) => {
    const updatedVendor = {
      ...vendor,
      additionalDocuments: vendor.additionalDocuments?.filter((d) => d.id !== docId) || [],
    };
    updateVendor(vendor.id, updatedVendor);
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

    updateVendor(vendor.id, updatedVendor);
    setNewTag("");
    setIsTagDialogOpen(false);
    toast.success("Category added");
  };

  const handleDeleteTag = (tag: string) => {
    const updatedVendor = {
      ...vendor,
      productCategories: vendor.productCategories?.filter((t) => t !== tag) || [],
    };
    updateVendor(vendor.id, updatedVendor);
    toast.success("Category removed");
  };

  const downloadFile = (data: string, filename: string) => {
    const link = document.createElement("a");
    link.href = data;
    link.download = filename;
    link.click();
  };

  const handleVaultUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const docData = {
        name: file.name,
        uploadDate: new Date().toISOString(),
        data: reader.result as string,
      };

      const updatedVault = { ...(vendor.documentVault || {}) };

      if (vaultDocType === "iso") {
        // ISO can have multiple documents
        updatedVault.isoCertificates = [
          ...(updatedVault.isoCertificates || []),
          { id: Date.now().toString(), ...docData },
        ];
      } else if (vaultDocType === "gst") {
        updatedVault.gstCertificate = docData;
      } else if (vaultDocType === "msme") {
        updatedVault.msmeCertificate = docData;
      } else if (vaultDocType === "cheque") {
        updatedVault.cancelledCheque = docData;
      }

      const updatedVendor = {
        ...vendor,
        documentVault: updatedVault,
      };

      updateVendor(vendor.id, updatedVendor);
      setIsVaultUploadOpen(false);
      toast.success("Document uploaded to vault");
    };
    reader.readAsDataURL(file);
  };

  const handleDeleteVaultDoc = (type: "gst" | "msme" | "iso" | "cheque", isoId?: string) => {
    const updatedVault = { ...(vendor.documentVault || {}) };

    if (type === "iso" && isoId) {
      updatedVault.isoCertificates = updatedVault.isoCertificates?.filter((doc) => doc.id !== isoId) || [];
    } else if (type === "gst") {
      delete updatedVault.gstCertificate;
    } else if (type === "msme") {
      delete updatedVault.msmeCertificate;
    } else if (type === "cheque") {
      delete updatedVault.cancelledCheque;
    }

    const updatedVendor = {
      ...vendor,
      documentVault: updatedVault,
    };

    updateVendor(vendor.id, updatedVendor);
    toast.success("Document removed from vault");
  };

  const openVaultUploadDialog = (type: "gst" | "msme" | "iso" | "cheque") => {
    setVaultDocType(type);
    setIsVaultUploadOpen(true);
  };

  const calculateOverallRating = (ratingsObj: typeof ratings) => {
    const values = Object.values(ratingsObj).filter((v) => v > 0);
    if (values.length === 0) return 0;
    return Number((values.reduce((a, b) => a + b, 0) / values.length).toFixed(1));
  };

  const handleSaveRatings = () => {
    const updatedVendor = {
      ...vendor,
      ratings,
    };
    updateVendor(vendor.id, updatedVendor);
    setIsRatingDialogOpen(false);
    toast.success("Ratings updated successfully");
  };

  const RatingStars = ({ value, onChange, readonly = false }: { value: number; onChange?: (val: number) => void; readonly?: boolean }) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={readonly}
            onClick={() => !readonly && onChange?.(star)}
            className={`${readonly ? "cursor-default" : "cursor-pointer hover:scale-110"} transition-transform`}
          >
            <Star className={`h-5 w-5 ${star <= value ? "fill-yellow-500 text-yellow-500" : "text-muted-foreground"}`} />
          </button>
        ))}
      </div>
    );
  };

  const overallRating = vendor?.ratings ? calculateOverallRating(vendor.ratings) : 0;

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

          {/* Vendor Ratings Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-500" />
                    Vendor Ratings
                  </CardTitle>
                  <CardDescription>Performance metrics and evaluation</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={() => setIsRatingDialogOpen(true)}>
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit Ratings
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Overall Rating */}
              <div className="text-center p-4 border-2 border-primary/20 rounded-lg bg-primary/5">
                <Label className="text-sm text-muted-foreground">Overall Score</Label>
                <div className="flex items-center justify-center gap-2 mt-2">
                  <span className="text-4xl font-bold text-primary">{overallRating.toFixed(1)}</span>
                  <div className="flex flex-col items-start">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-4 w-4 ${star <= Math.round(overallRating) ? "fill-yellow-500 text-yellow-500" : "text-muted-foreground"}`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground">out of 5.0</span>
                  </div>
                </div>
              </div>

              {/* Individual Ratings */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Delivery Timeliness</Label>
                    <p className="text-xs text-muted-foreground">On-time delivery performance</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <RatingStars value={vendor.ratings?.deliveryTimeliness || 0} readonly />
                    <span className="text-sm font-medium w-8">{vendor.ratings?.deliveryTimeliness || 0}.0</span>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Quality</Label>
                    <p className="text-xs text-muted-foreground">Product/service quality standards</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <RatingStars value={vendor.ratings?.quality || 0} readonly />
                    <span className="text-sm font-medium w-8">{vendor.ratings?.quality || 0}.0</span>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Pricing Consistency</Label>
                    <p className="text-xs text-muted-foreground">Price stability and fairness</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <RatingStars value={vendor.ratings?.pricingConsistency || 0} readonly />
                    <span className="text-sm font-medium w-8">{vendor.ratings?.pricingConsistency || 0}.0</span>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Communication</Label>
                    <p className="text-xs text-muted-foreground">Responsiveness and clarity</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <RatingStars value={vendor.ratings?.communication || 0} readonly />
                    <span className="text-sm font-medium w-8">{vendor.ratings?.communication || 0}.0</span>
                  </div>
                </div>
              </div>

              {!vendor.ratings && (
                <div className="text-center py-4">
                  <p className="text-sm text-muted-foreground mb-3">No ratings added yet</p>
                  <Button variant="outline" size="sm" onClick={() => setIsRatingDialogOpen(true)}>
                    Add Ratings
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Document Vault Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileCheck className="h-5 w-5" />
                Document Vault
              </CardTitle>
              <CardDescription>Secure storage for compliance and statutory documents</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* GST Certificate */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-semibold">GST Certificate</Label>
                  {vendor.documentVault?.gstCertificate ? (
                    <Badge variant="secondary">Uploaded</Badge>
                  ) : (
                    <Badge variant="outline">Not Uploaded</Badge>
                  )}
                </div>
                {vendor.documentVault?.gstCertificate ? (
                  <div className="p-3 border rounded-lg bg-muted/30">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium">{vendor.documentVault.gstCertificate.name}</p>
                        <p className="text-xs text-muted-foreground">
                          Uploaded: {new Date(vendor.documentVault.gstCertificate.uploadDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() =>
                            setPreviewDoc({
                              name: vendor.documentVault!.gstCertificate!.name,
                              data: vendor.documentVault!.gstCertificate!.data,
                            })
                          }
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() =>
                            downloadFile(vendor.documentVault!.gstCertificate!.data, vendor.documentVault!.gstCertificate!.name)
                          }
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" onClick={() => handleDeleteVaultDoc("gst")}>
                          <X className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <Button size="sm" variant="outline" className="w-full" onClick={() => openVaultUploadDialog("gst")}>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload GST Certificate
                  </Button>
                )}
              </div>

              <Separator />

              {/* MSME Certificate */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-semibold">MSME Certificate</Label>
                  {vendor.documentVault?.msmeCertificate ? (
                    <Badge variant="secondary">Uploaded</Badge>
                  ) : (
                    <Badge variant="outline">Not Uploaded</Badge>
                  )}
                </div>
                {vendor.documentVault?.msmeCertificate ? (
                  <div className="p-3 border rounded-lg bg-muted/30">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium">{vendor.documentVault.msmeCertificate.name}</p>
                        <p className="text-xs text-muted-foreground">
                          Uploaded: {new Date(vendor.documentVault.msmeCertificate.uploadDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() =>
                            setPreviewDoc({
                              name: vendor.documentVault!.msmeCertificate!.name,
                              data: vendor.documentVault!.msmeCertificate!.data,
                            })
                          }
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() =>
                            downloadFile(vendor.documentVault!.msmeCertificate!.data, vendor.documentVault!.msmeCertificate!.name)
                          }
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" onClick={() => handleDeleteVaultDoc("msme")}>
                          <X className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <Button size="sm" variant="outline" className="w-full" onClick={() => openVaultUploadDialog("msme")}>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload MSME Certificate
                  </Button>
                )}
              </div>

              <Separator />

              {/* ISO Certificates */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-semibold">ISO Certificates</Label>
                  {vendor.documentVault?.isoCertificates && vendor.documentVault.isoCertificates.length > 0 ? (
                    <Badge variant="secondary">{vendor.documentVault.isoCertificates.length} Uploaded</Badge>
                  ) : (
                    <Badge variant="outline">Not Uploaded</Badge>
                  )}
                </div>
                {vendor.documentVault?.isoCertificates && vendor.documentVault.isoCertificates.length > 0 && (
                  <div className="space-y-2">
                    {vendor.documentVault.isoCertificates.map((doc) => (
                      <div key={doc.id} className="p-3 border rounded-lg bg-muted/30">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <p className="text-sm font-medium">{doc.name}</p>
                            <p className="text-xs text-muted-foreground">Uploaded: {new Date(doc.uploadDate).toLocaleDateString()}</p>
                          </div>
                          <div className="flex gap-1">
                            <Button size="icon" variant="ghost" onClick={() => setPreviewDoc({ name: doc.name, data: doc.data })}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="icon" variant="ghost" onClick={() => downloadFile(doc.data, doc.name)}>
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button size="icon" variant="ghost" onClick={() => handleDeleteVaultDoc("iso", doc.id)}>
                              <X className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <Button size="sm" variant="outline" className="w-full" onClick={() => openVaultUploadDialog("iso")}>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload ISO Certificate
                </Button>
              </div>

              <Separator />

              {/* Cancelled Cheque */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-semibold">Cancelled Cheque</Label>
                  {vendor.documentVault?.cancelledCheque ? (
                    <Badge variant="secondary">Uploaded</Badge>
                  ) : (
                    <Badge variant="outline">Not Uploaded</Badge>
                  )}
                </div>
                {vendor.documentVault?.cancelledCheque ? (
                  <div className="p-3 border rounded-lg bg-muted/30">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium">{vendor.documentVault.cancelledCheque.name}</p>
                        <p className="text-xs text-muted-foreground">
                          Uploaded: {new Date(vendor.documentVault.cancelledCheque.uploadDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() =>
                            setPreviewDoc({
                              name: vendor.documentVault!.cancelledCheque!.name,
                              data: vendor.documentVault!.cancelledCheque!.data,
                            })
                          }
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() =>
                            downloadFile(vendor.documentVault!.cancelledCheque!.data, vendor.documentVault!.cancelledCheque!.name)
                          }
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" onClick={() => handleDeleteVaultDoc("cheque")}>
                          <X className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <Button size="sm" variant="outline" className="w-full" onClick={() => openVaultUploadDialog("cheque")}>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Cancelled Cheque
                  </Button>
                )}
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

      {/* Vault Upload Dialog */}
      <Dialog open={isVaultUploadOpen} onOpenChange={setIsVaultUploadOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload to Document Vault</DialogTitle>
            <DialogDescription>
              Upload{" "}
              {vaultDocType === "gst"
                ? "GST Certificate"
                : vaultDocType === "msme"
                ? "MSME Certificate"
                : vaultDocType === "iso"
                ? "ISO Certificate"
                : "Cancelled Cheque"}{" "}
              (Max 5MB)
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="vaultDoc">Select Document</Label>
              <Input id="vaultDoc" type="file" onChange={handleVaultUpload} accept=".pdf,.jpg,.jpeg,.png" />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsVaultUploadOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Document Preview Dialog */}
      <Dialog open={!!previewDoc} onOpenChange={() => setPreviewDoc(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>{previewDoc?.name}</DialogTitle>
          </DialogHeader>
          {previewDoc && (
            <div className="overflow-auto max-h-[70vh]">
              {previewDoc.data.startsWith("data:application/pdf") ? (
                <iframe src={previewDoc.data} className="w-full h-[600px] border rounded-lg" title="Document Preview" />
              ) : (
                <img src={previewDoc.data} alt={previewDoc.name} className="w-full h-auto rounded-lg" />
              )}
            </div>
          )}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setPreviewDoc(null)}>
              Close
            </Button>
            {previewDoc && (
              <Button onClick={() => downloadFile(previewDoc.data, previewDoc.name)}>
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Ratings Dialog */}
      <Dialog open={isRatingDialogOpen} onOpenChange={setIsRatingDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Vendor Ratings</DialogTitle>
            <DialogDescription>Rate the vendor's performance across different metrics</DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            {/* Overall Preview */}
            <div className="text-center p-4 border rounded-lg bg-muted/30">
              <Label className="text-sm text-muted-foreground">Overall Score</Label>
              <div className="flex items-center justify-center gap-2 mt-2">
                <span className="text-3xl font-bold text-primary">{calculateOverallRating(ratings).toFixed(1)}</span>
                <span className="text-sm text-muted-foreground">out of 5.0</span>
              </div>
            </div>

            {/* Rating Categories */}
            <div className="space-y-5">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Delivery Timeliness</Label>
                <p className="text-xs text-muted-foreground mb-2">Rate their on-time delivery performance</p>
                <div className="flex items-center gap-3">
                  <RatingStars value={ratings.deliveryTimeliness} onChange={(val) => setRatings({ ...ratings, deliveryTimeliness: val })} />
                  <span className="text-sm font-medium">{ratings.deliveryTimeliness}.0</span>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label className="text-sm font-medium">Quality</Label>
                <p className="text-xs text-muted-foreground mb-2">Rate their product/service quality standards</p>
                <div className="flex items-center gap-3">
                  <RatingStars value={ratings.quality} onChange={(val) => setRatings({ ...ratings, quality: val })} />
                  <span className="text-sm font-medium">{ratings.quality}.0</span>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label className="text-sm font-medium">Pricing Consistency</Label>
                <p className="text-xs text-muted-foreground mb-2">Rate their price stability and fairness</p>
                <div className="flex items-center gap-3">
                  <RatingStars value={ratings.pricingConsistency} onChange={(val) => setRatings({ ...ratings, pricingConsistency: val })} />
                  <span className="text-sm font-medium">{ratings.pricingConsistency}.0</span>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label className="text-sm font-medium">Communication</Label>
                <p className="text-xs text-muted-foreground mb-2">Rate their responsiveness and clarity</p>
                <div className="flex items-center gap-3">
                  <RatingStars value={ratings.communication} onChange={(val) => setRatings({ ...ratings, communication: val })} />
                  <span className="text-sm font-medium">{ratings.communication}.0</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setIsRatingDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveRatings}>Save Ratings</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VendorProfile;
