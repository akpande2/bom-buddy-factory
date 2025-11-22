import { useState } from "react";
import { DocumentFormWithPDF, FieldSchema } from "@/components/DocumentFormWithPDF";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { toast } from "sonner";

const poSchema: FieldSchema[] = [
  {
    name: "poNumber",
    label: "PO Number",
    type: "text",
    placeholder: "e.g., PO-2025-001",
    required: true,
  },
  {
    name: "vendorName",
    label: "Vendor Name",
    type: "text",
    placeholder: "Name of the vendor",
    required: true,
  },
  {
    name: "vendorAddress",
    label: "Vendor Address",
    type: "textarea",
    placeholder: "Complete vendor address",
    required: true,
  },
  {
    name: "itemDescription",
    label: "Item Description",
    type: "textarea",
    placeholder: "Detailed item description",
    required: true,
  },
  {
    name: "quantity",
    label: "Quantity",
    type: "number",
    placeholder: "Enter quantity",
    required: true,
  },
  {
    name: "unitPrice",
    label: "Unit Price",
    type: "number",
    placeholder: "Price per unit",
    required: true,
  },
  {
    name: "taxes",
    label: "Taxes",
    type: "number",
    placeholder: "Tax amount or percentage",
    required: false,
  },
  {
    name: "deliveryDate",
    label: "Delivery Date",
    type: "date",
    required: true,
  },
  {
    name: "linkedPrNumber",
    label: "Linked PR Number",
    type: "text",
    placeholder: "e.g., PR-2025-001",
    required: false,
  },
  {
    name: "linkedLoiNumber",
    label: "Linked LOI Number",
    type: "text",
    placeholder: "e.g., LOI-2025-001",
    required: false,
  },
];

const PoForm = () => {
  const [savedDraft, setSavedDraft] = useState<Record<string, any> | null>(null);

  const handlePDFGenerated = (blob: Blob, formData: Record<string, any>) => {
    console.log("PDF Generated:", { blob, formData });
    setSavedDraft(formData);
  };

  const handleSaveDraft = () => {
    toast.success("Draft saved locally!");
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Purchase Order (PO)
            </h1>
            <p className="text-muted-foreground mt-1">
              Issue a formal Purchase Order to vendor
            </p>
          </div>
          <Button variant="outline" onClick={handleSaveDraft} className="gap-2">
            <Save className="h-4 w-4" />
            Save Draft
          </Button>
        </div>

        <DocumentFormWithPDF
          schema={poSchema}
          title="Purchase Order (PO)"
          onPDFGenerated={handlePDFGenerated}
          additionalContent={(data) => {
            const total = (Number(data.quantity) || 0) * (Number(data.unitPrice) || 0);
            const taxAmount = Number(data.taxes) || 0;
            const grandTotal = total + taxAmount;
            return `\n\nPayment Terms:\nTotal Amount: ${total}\nTaxes: ${taxAmount}\nGrand Total: ${grandTotal}\n\nThis Purchase Order is legally binding. Goods must be delivered by ${data.deliveryDate}.`;
          }}
        />

        {savedDraft && (
          <div className="text-sm text-muted-foreground text-center">
            Last saved: {new Date().toLocaleString()}
          </div>
        )}
      </div>
    </div>
  );
};

export default PoForm;
