import { useState } from "react";
import { DocumentFormWithPDF, FieldSchema } from "@/components/DocumentFormWithPDF";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { toast } from "sonner";

const opsSchema: FieldSchema[] = [
  {
    name: "itemDescription",
    label: "Item Description",
    type: "textarea",
    placeholder: "Detailed description of the item",
    required: true,
  },
  {
    name: "specifications",
    label: "Specifications",
    type: "textarea",
    placeholder: "Technical specifications and requirements",
    required: true,
  },
  {
    name: "warranty",
    label: "Warranty",
    type: "text",
    placeholder: "e.g., 12 months, 24 months",
    required: false,
  },
  {
    name: "deliveryDate",
    label: "Required Delivery Date",
    type: "date",
    required: true,
  },
  {
    name: "previousPrice",
    label: "Previous Purchase Price",
    type: "number",
    placeholder: "Enter amount",
    required: false,
  },
  {
    name: "justification",
    label: "Justification",
    type: "textarea",
    placeholder: "Reason for this purchase request",
    required: true,
  },
];

const OpsForm = () => {
  const [savedDraft, setSavedDraft] = useState<Record<string, any> | null>(null);

  const handlePDFGenerated = (blob: Blob, formData: Record<string, any>) => {
    console.log("PDF Generated:", { blob, formData });
    setSavedDraft(formData);
  };

  const handleSaveDraft = () => {
    // In a real app, this would save to localStorage or state management
    toast.success("Draft saved locally!");
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Order Processing Sheet (OPS)
            </h1>
            <p className="text-muted-foreground mt-1">
              Create a new OPS document for procurement workflow
            </p>
          </div>
          <Button variant="outline" onClick={handleSaveDraft} className="gap-2">
            <Save className="h-4 w-4" />
            Save Draft
          </Button>
        </div>

        <DocumentFormWithPDF
          schema={opsSchema}
          title="Order Processing Sheet (OPS)"
          onPDFGenerated={handlePDFGenerated}
          additionalContent={(data) =>
            `\n\nNotes:\nThis OPS document was generated for procurement purposes. Please review all specifications and pricing before proceeding to Purchase Requisition (PR).`
          }
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

export default OpsForm;
