import { useState } from "react";
import { toast } from "sonner";

export const useDocumentForm = () => {
  const [savedDraft, setSavedDraft] = useState<Record<string, any> | null>(null);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const handlePDFGenerated = (blob: Blob, formData: Record<string, any>) => {
    console.log("PDF Generated:", { blob, formData });
    setSavedDraft(formData);
    setLastSaved(new Date());
  };

  const handleSaveDraft = () => {
    toast.success("Draft saved locally!");
    setLastSaved(new Date());
  };

  return {
    savedDraft,
    lastSaved,
    handlePDFGenerated,
    handleSaveDraft,
  };
};
