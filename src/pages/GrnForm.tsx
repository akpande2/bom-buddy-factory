import { useState } from "react";
import { DocumentFormWithPDF, FieldSchema } from "@/components/DocumentFormWithPDF";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { toast } from "sonner";

const grnSchema: FieldSchema[] = [
  {
    name: "grnNumber",
    label: "GRN Number",
    type: "text",
    placeholder: "e.g., GRN-2025-001",
    required: true,
  },
  {
    name: "poNumber",
    label: "PO Number",
    type: "text",
    placeholder: "e.g., PO-2025-001",
    required: true,
  },
  {
    name: "deliveryDate",
    label: "Delivery Date",
    type: "date",
    required: true,
  },
  {
    name: "quantityReceived",
    label: "Quantity Received",
    type: "number",
    placeholder: "Enter quantity received",
    required: true,
  },
  {
    name: "conditionOfGoods",
    label: "Condition of Goods",
    type: "select",
    placeholder: "Select condition",
    required: true,
    options: ["Excellent", "Good", "Acceptable", "Damaged", "Rejected"],
  },
  {
    name: "remarks",
    label: "Remarks",
    type: "textarea",
    placeholder: "Additional notes or observations",
    required: false,
  },
];

const GrnForm = () => {
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
              Goods Receipt Note (GRN)
            </h1>
            <p className="text-muted-foreground mt-1">
              Record receipt of goods against Purchase Order
            </p>
          </div>
          <Button variant="outline" onClick={handleSaveDraft} className="gap-2">
            <Save className="h-4 w-4" />
            Save Draft
          </Button>
        </div>

        <DocumentFormWithPDF
          schema={grnSchema}
          title="Goods Receipt Note (GRN)"
          onPDFGenerated={handlePDFGenerated}
          additionalContent={(data) =>
            `\n\nInspection Summary:\nGoods received on ${data.deliveryDate} against PO ${data.poNumber}.\nCondition: ${data.conditionOfGoods}\nQuantity Received: ${data.quantityReceived}\n\nThis document confirms the receipt and inspection of goods.`
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

export default GrnForm;
