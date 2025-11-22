import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, ClipboardList, Mail, Package, Truck, Download, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface StoredDocument {
  type: string;
  title: string;
  timestamp: number;
  data: string;
  formData: Record<string, any>;
}

const documentTypes = [
  { type: "OPS", icon: FileText, color: "text-blue-500" },
  { type: "PR", icon: ClipboardList, color: "text-indigo-500" },
  { type: "LOI", icon: Mail, color: "text-cyan-500" },
  { type: "PO", icon: Package, color: "text-green-500" },
  { type: "GRN", icon: Truck, color: "text-emerald-500" },
];

export const DocumentRepository = () => {
  const [documents, setDocuments] = useState<StoredDocument[]>([]);
  const [previewDoc, setPreviewDoc] = useState<StoredDocument | null>(null);

  useEffect(() => {
    loadDocuments();
    
    // Listen for storage changes
    const handleStorageChange = () => {
      loadDocuments();
    };
    
    window.addEventListener("storage", handleStorageChange);
    // Also check periodically for same-tab updates
    const interval = setInterval(loadDocuments, 1000);
    
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const loadDocuments = () => {
    const stored = localStorage.getItem("procurement_documents");
    if (stored) {
      setDocuments(JSON.parse(stored));
    }
  };

  const handleDownload = (doc: StoredDocument) => {
    const link = document.createElement("a");
    link.href = doc.data;
    link.download = `${doc.type}_${new Date(doc.timestamp).toLocaleDateString()}.pdf`;
    link.click();
  };

  const handlePreview = (doc: StoredDocument) => {
    setPreviewDoc(doc);
  };

  const getDocumentByType = (type: string) => {
    return documents.find((doc) => doc.type === type);
  };

  return (
    <>
      <Card className="h-full">
        <CardHeader className="border-b">
          <CardTitle className="text-base">Document Repository</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y">
            {documentTypes.map((docType) => {
              const Icon = docType.icon;
              const doc = getDocumentByType(docType.type);
              
              return (
                <div
                  key={docType.type}
                  className="px-4 py-3 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className={cn("p-2 rounded-lg bg-muted/50", docType.color)}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className="text-sm font-medium text-foreground">
                      {docType.type} PDF
                    </span>
                  </div>
                  
                  {doc ? (
                    <div className="flex gap-2 ml-11">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownload(doc)}
                        className="flex-1 h-8 text-xs gap-1"
                      >
                        <Download className="h-3 w-3" />
                        Download
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePreview(doc)}
                        className="flex-1 h-8 text-xs gap-1"
                      >
                        <Eye className="h-3 w-3" />
                        Preview
                      </Button>
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground ml-11">
                      No document generated yet
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!previewDoc} onOpenChange={() => setPreviewDoc(null)}>
        <DialogContent className="max-w-4xl h-[80vh]">
          <DialogHeader>
            <DialogTitle>{previewDoc?.type} - Preview</DialogTitle>
          </DialogHeader>
          {previewDoc && (
            <iframe
              src={previewDoc.data}
              className="w-full h-full border rounded"
              title="PDF Preview"
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
