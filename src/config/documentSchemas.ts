import { FieldSchema } from "@/components/DocumentFormWithPDF";

export const documentSchemas = {
  OPS: [
    {
      name: "itemDescription",
      label: "Item Description",
      type: "textarea" as const,
      placeholder: "Detailed description of the item",
      required: true,
    },
    {
      name: "specifications",
      label: "Specifications",
      type: "textarea" as const,
      placeholder: "Technical specifications and requirements",
      required: true,
    },
    {
      name: "warranty",
      label: "Warranty",
      type: "text" as const,
      placeholder: "e.g., 12 months, 24 months",
      required: false,
    },
    {
      name: "deliveryDate",
      label: "Required Delivery Date",
      type: "date" as const,
      required: true,
    },
    {
      name: "previousPrice",
      label: "Previous Purchase Price",
      type: "number" as const,
      placeholder: "Enter amount",
      required: false,
    },
    {
      name: "justification",
      label: "Justification",
      type: "textarea" as const,
      placeholder: "Reason for this purchase request",
      required: true,
    },
  ] as FieldSchema[],

  PR: [
    {
      name: "prNumber",
      label: "PR Number",
      type: "text" as const,
      placeholder: "e.g., PR-2025-001",
      required: true,
    },
    {
      name: "department",
      label: "Department",
      type: "select" as const,
      placeholder: "Select department",
      required: true,
      options: ["Production", "Maintenance", "Quality Control", "Warehouse", "Administration"],
    },
    {
      name: "requestedBy",
      label: "Requested By",
      type: "text" as const,
      placeholder: "Name of requester",
      required: true,
    },
    {
      name: "date",
      label: "Date",
      type: "date" as const,
      required: true,
    },
    {
      name: "itemName",
      label: "Item Name",
      type: "text" as const,
      placeholder: "Name of the item",
      required: true,
    },
    {
      name: "quantity",
      label: "Quantity",
      type: "number" as const,
      placeholder: "Enter quantity",
      required: true,
    },
    {
      name: "estimatedCost",
      label: "Estimated Cost",
      type: "number" as const,
      placeholder: "Enter estimated cost",
      required: true,
    },
    {
      name: "linkedOpsNumber",
      label: "Linked OPS Number",
      type: "text" as const,
      placeholder: "e.g., OPS-2025-001",
      required: false,
    },
  ] as FieldSchema[],

  LOI: [
    {
      name: "loiNumber",
      label: "LOI Number",
      type: "text" as const,
      placeholder: "e.g., LOI-2025-001",
      required: true,
    },
    {
      name: "vendorName",
      label: "Vendor Name",
      type: "text" as const,
      placeholder: "Name of the vendor",
      required: true,
    },
    {
      name: "purpose",
      label: "Purpose",
      type: "textarea" as const,
      placeholder: "Purpose of this Letter of Intent",
      required: true,
    },
    {
      name: "linkedPrNumber",
      label: "Linked PR Number",
      type: "text" as const,
      placeholder: "e.g., PR-2025-001",
      required: false,
    },
    {
      name: "expectedOrderValue",
      label: "Expected Order Value",
      type: "number" as const,
      placeholder: "Enter expected order value",
      required: true,
    },
    {
      name: "validityPeriod",
      label: "Validity Period",
      type: "text" as const,
      placeholder: "e.g., 30 days, 60 days",
      required: true,
    },
  ] as FieldSchema[],

  PO: [
    {
      name: "poNumber",
      label: "PO Number",
      type: "text" as const,
      placeholder: "e.g., PO-2025-001",
      required: true,
    },
    {
      name: "vendorName",
      label: "Vendor Name",
      type: "text" as const,
      placeholder: "Name of the vendor",
      required: true,
    },
    {
      name: "vendorAddress",
      label: "Vendor Address",
      type: "textarea" as const,
      placeholder: "Complete vendor address",
      required: true,
    },
    {
      name: "itemDescription",
      label: "Item Description",
      type: "textarea" as const,
      placeholder: "Detailed item description",
      required: true,
    },
    {
      name: "quantity",
      label: "Quantity",
      type: "number" as const,
      placeholder: "Enter quantity",
      required: true,
    },
    {
      name: "unitPrice",
      label: "Unit Price",
      type: "number" as const,
      placeholder: "Price per unit",
      required: true,
    },
    {
      name: "taxes",
      label: "Taxes",
      type: "number" as const,
      placeholder: "Tax amount or percentage",
      required: false,
    },
    {
      name: "deliveryDate",
      label: "Delivery Date",
      type: "date" as const,
      required: true,
    },
    {
      name: "linkedPrNumber",
      label: "Linked PR Number",
      type: "text" as const,
      placeholder: "e.g., PR-2025-001",
      required: false,
    },
    {
      name: "linkedLoiNumber",
      label: "Linked LOI Number",
      type: "text" as const,
      placeholder: "e.g., LOI-2025-001",
      required: false,
    },
  ] as FieldSchema[],

  GRN: [
    {
      name: "grnNumber",
      label: "GRN Number",
      type: "text" as const,
      placeholder: "e.g., GRN-2025-001",
      required: true,
    },
    {
      name: "poNumber",
      label: "PO Number",
      type: "text" as const,
      placeholder: "e.g., PO-2025-001",
      required: true,
    },
    {
      name: "deliveryDate",
      label: "Delivery Date",
      type: "date" as const,
      required: true,
    },
    {
      name: "quantityReceived",
      label: "Quantity Received",
      type: "number" as const,
      placeholder: "Enter quantity received",
      required: true,
    },
    {
      name: "conditionOfGoods",
      label: "Condition of Goods",
      type: "select" as const,
      placeholder: "Select condition",
      required: true,
      options: ["Excellent", "Good", "Acceptable", "Damaged", "Rejected"],
    },
    {
      name: "remarks",
      label: "Remarks",
      type: "textarea" as const,
      placeholder: "Additional notes or observations",
      required: false,
    },
  ] as FieldSchema[],
};

export const documentConfig = {
  OPS: {
    title: "Order Processing Sheet (OPS)",
    description: "Create a new OPS document for procurement workflow",
    additionalContent: (data: Record<string, any>) =>
      `\n\nNotes:\nThis OPS document was generated for procurement purposes. Please review all specifications and pricing before proceeding to Purchase Requisition (PR).`,
  },
  PR: {
    title: "Purchase Requisition (PR)",
    description: "Create a new Purchase Requisition for approval workflow",
    additionalContent: (data: Record<string, any>) =>
      `\n\nApproval Workflow:\nThis PR requires approval from Department Head, SCM Team, and Management before proceeding to Comparative Sheet generation.`,
  },
  LOI: {
    title: "Letter of Intent (LOI)",
    description: "Create a Letter of Intent to express interest with selected vendor",
    additionalContent: (data: Record<string, any>) =>
      `\n\nLegal Notice:\nThis Letter of Intent expresses the organization's intention to proceed with the vendor for the specified purpose. This document is valid for ${data.validityPeriod} from the date of issuance.`,
  },
  PO: {
    title: "Purchase Order (PO)",
    description: "Issue a formal Purchase Order to vendor",
    additionalContent: (data: Record<string, any>) => {
      const total = (Number(data.quantity) || 0) * (Number(data.unitPrice) || 0);
      const taxAmount = Number(data.taxes) || 0;
      const grandTotal = total + taxAmount;
      return `\n\nPayment Terms:\nTotal Amount: ${total}\nTaxes: ${taxAmount}\nGrand Total: ${grandTotal}\n\nThis Purchase Order is legally binding. Goods must be delivered by ${data.deliveryDate}.`;
    },
  },
  GRN: {
    title: "Goods Receipt Note (GRN)",
    description: "Record receipt of goods against Purchase Order",
    additionalContent: (data: Record<string, any>) =>
      `\n\nInspection Summary:\nGoods received on ${data.deliveryDate} against PO ${data.poNumber}.\nCondition: ${data.conditionOfGoods}\nQuantity Received: ${data.quantityReceived}\n\nThis document confirms the receipt and inspection of goods.`,
  },
};
