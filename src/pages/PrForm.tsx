import { useState } from "react";
import { DocumentFormWithPDF, FieldSchema } from "@/components/DocumentFormWithPDF";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { toast } from "sonner";

const prSchema: FieldSchema[] = [
  {
    name: "prNumber",
    label: "PR Number",
    type: "text",
    placeholder: "e.g., PR-2025-001",
    required: true,
  },
  {
    name: "department",
    label: "Department",
    type: "select",
    placeholder: "Select department",
    required: true,
    options: ["Production", "Maintenance", "Quality Control", "Warehouse", "Administration"],
  },
  {
    name: "requestedBy",
    label: "Requested By",
    type: "text",
    placeholder: "Name of requester",
    required: true,
  },
  {
    name: "date",
    label: "Date",
    type: "date",
    required: true,
  },
  {
    name: "itemName",
    label: "Item Name",
    type: "text",
    placeholder: "Name of the item",
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
    name: "estimatedCost",
    label: "Estimated Cost",
    type: "number",
    placeholder: "Enter estimated cost",
    required: true,
  },
  {
    name: "linkedOpsNumber",
    label: "Linked OPS Number",
    type: "text",
    placeholder: "e.g., OPS-2025-001",
    required: false,
  },
];

const PrForm = () => {
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
              Purchase Requisition (PR)
            </h1>
            <p className="text-muted-foreground mt-1">
              Create a new Purchase Requisition for approval workflow
            </p>
          </div>
          <Button variant="outline" onClick={handleSaveDraft} className="gap-2">
            <Save className="h-4 w-4" />
            Save Draft
          </Button>
        </div>

        <DocumentFormWithPDF
          schema={prSchema}
          title="Purchase Requisition (PR)"
          onPDFGenerated={handlePDFGenerated}
          additionalContent={(data) =>
            `\n\nApproval Workflow:\nThis PR requires approval from Department Head, SCM Team, and Management before proceeding to Comparative Sheet generation.`
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

export default PrForm;
