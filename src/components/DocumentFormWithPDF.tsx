import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileDown } from "lucide-react";
import { toast } from "sonner";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export interface FieldSchema {
  name: string;
  label: string;
  type: "text" | "textarea" | "number" | "date" | "select" | "email";
  placeholder?: string;
  required?: boolean;
  options?: string[];
  defaultValue?: string | number;
}

interface DocumentFormWithPDFProps {
  schema: FieldSchema[];
  title: string;
  onPDFGenerated?: (blob: Blob, formData: Record<string, any>) => void;
  additionalContent?: (data: Record<string, any>) => string;
}

interface StoredDocument {
  type: string;
  title: string;
  timestamp: number;
  data: string; // base64 encoded PDF
  formData: Record<string, any>;
}

export const DocumentFormWithPDF = ({
  schema,
  title,
  onPDFGenerated,
  additionalContent,
}: DocumentFormWithPDFProps) => {
  const { register, handleSubmit, setValue, watch } = useForm();

  const saveToLocalStorage = (blob: Blob, formData: Record<string, any>, documentType: string) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64data = reader.result as string;
      
      const storedDocs = localStorage.getItem("procurement_documents");
      const docs: StoredDocument[] = storedDocs ? JSON.parse(storedDocs) : [];
      
      const newDoc: StoredDocument = {
        type: documentType,
        title: title,
        timestamp: Date.now(),
        data: base64data,
        formData: formData,
      };
      
      // Remove old document of same type if exists
      const filteredDocs = docs.filter(doc => doc.type !== documentType);
      filteredDocs.push(newDoc);
      
      localStorage.setItem("procurement_documents", JSON.stringify(filteredDocs));
    };
    reader.readAsDataURL(blob);
  };

  const getDocumentType = (title: string): string => {
    if (title.includes("OPS")) return "OPS";
    if (title.includes("PR")) return "PR";
    if (title.includes("LOI")) return "LOI";
    if (title.includes("PO") && !title.includes("OPS")) return "PO";
    if (title.includes("GRN")) return "GRN";
    return "OTHER";
  };

  const generatePDF = (formData: Record<string, any>) => {
    const doc = new jsPDF();
    
    // Header
    doc.setFillColor(59, 130, 246);
    doc.rect(0, 0, 210, 40, "F");
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.text(title, 105, 20, { align: "center" });
    
    doc.setFontSize(10);
    const date = new Date().toLocaleDateString();
    doc.text(`Generated: ${date}`, 105, 30, { align: "center" });
    
    // Reset text color
    doc.setTextColor(0, 0, 0);
    
    // Form data table
    const tableData = schema.map((field) => [
      field.label,
      formData[field.name]?.toString() || "—",
    ]);
    
    autoTable(doc, {
      startY: 50,
      head: [["Field", "Value"]],
      body: tableData,
      theme: "grid",
      headStyles: {
        fillColor: [59, 130, 246],
        textColor: [255, 255, 255],
        fontStyle: "bold",
      },
      styles: {
        fontSize: 10,
        cellPadding: 5,
      },
      alternateRowStyles: {
        fillColor: [249, 250, 251],
      },
    });
    
    // Additional content if provided
    if (additionalContent) {
      const content = additionalContent(formData);
      const finalY = (doc as any).lastAutoTable.finalY || 50;
      doc.setFontSize(10);
      doc.text(content, 14, finalY + 20, { maxWidth: 180 });
    }
    
    // Footer
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(128, 128, 128);
      doc.text(
        `Page ${i} of ${pageCount}`,
        105,
        doc.internal.pageSize.height - 10,
        { align: "center" }
      );
    }
    
    // Generate blob
    const blob = doc.output("blob");
    
    // Save to localStorage
    const documentType = getDocumentType(title);
    saveToLocalStorage(blob, formData, documentType);
    
    // Download
    doc.save(`${title.replace(/\s+/g, "_")}_${Date.now()}.pdf`);
    
    // Callback
    if (onPDFGenerated) {
      onPDFGenerated(blob, formData);
    }
    
    toast.success("PDF generated and saved successfully!");
  };

  const onSubmit = (data: Record<string, any>) => {
    generatePDF(data);
  };

  const renderField = (field: FieldSchema) => {
    const value = watch(field.name);

    switch (field.type) {
      case "textarea":
        return (
          <Textarea
            {...register(field.name, { required: field.required })}
            placeholder={field.placeholder}
            className="resize-none"
            rows={4}
          />
        );

      case "select":
        return (
          <Select
            onValueChange={(val) => setValue(field.name, val)}
            defaultValue={field.defaultValue?.toString()}
          >
            <SelectTrigger>
              <SelectValue placeholder={field.placeholder || "Select..."} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      default:
        return (
          <Input
            {...register(field.name, { required: field.required })}
            type={field.type}
            placeholder={field.placeholder}
            defaultValue={field.defaultValue}
          />
        );
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {schema.map((field) => (
              <div
                key={field.name}
                className={field.type === "textarea" ? "md:col-span-2" : ""}
              >
                <Label htmlFor={field.name}>
                  {field.label}
                  {field.required && <span className="text-destructive ml-1">*</span>}
                </Label>
                <div className="mt-1.5">{renderField(field)}</div>
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-4">
            <Button type="submit" className="gap-2">
              <FileDown className="h-4 w-4" />
              Generate PDF
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
