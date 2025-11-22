import { useState } from "react";
import { DocumentFormWithPDF, FieldSchema } from "@/components/DocumentFormWithPDF";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { toast } from "sonner";

const loiSchema: FieldSchema[] = [
  {
    name: "loiNumber",
    label: "LOI Number",
    type: "text",
    placeholder: "e.g., LOI-2025-001",
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
    name: "purpose",
    label: "Purpose",
    type: "textarea",
    placeholder: "Purpose of this Letter of Intent",
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
    name: "expectedOrderValue",
    label: "Expected Order Value",
    type: "number",
    placeholder: "Enter expected order value",
    required: true,
  },
  {
    name: "validityPeriod",
    label: "Validity Period",
    type: "text",
    placeholder: "e.g., 30 days, 60 days",
    required: true,
  },
];

const LoiForm = () => {
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
              Letter of Intent (LOI)
            </h1>
            <p className="text-muted-foreground mt-1">
              Create a Letter of Intent to express interest with selected vendor
            </p>
          </div>
          <Button variant="outline" onClick={handleSaveDraft} className="gap-2">
            <Save className="h-4 w-4" />
            Save Draft
          </Button>
        </div>

        <DocumentFormWithPDF
          schema={loiSchema}
          title="Letter of Intent (LOI)"
          onPDFGenerated={handlePDFGenerated}
          additionalContent={(data) =>
            `\n\nLegal Notice:\nThis Letter of Intent expresses the organization's intention to proceed with the vendor for the specified purpose. This document is valid for ${data.validityPeriod} from the date of issuance.`
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

export default LoiForm;
