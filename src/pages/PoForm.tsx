import { DocumentFormWithPDF } from "@/components/DocumentFormWithPDF";
import { DocumentFormLayout } from "@/components/DocumentFormLayout";
import { useDocumentForm } from "@/hooks/useDocumentForm";
import { documentSchemas, documentConfig } from "@/config/documentSchemas";

const PoForm = () => {
  const { savedDraft, lastSaved, handlePDFGenerated, handleSaveDraft } = useDocumentForm();

  return (
    <DocumentFormLayout
      title={documentConfig.PO.title}
      description={documentConfig.PO.description}
      onSaveDraft={handleSaveDraft}
      showDraftStatus={!!savedDraft}
      lastSaved={lastSaved}
    >
      <DocumentFormWithPDF
        schema={documentSchemas.PO}
        title={documentConfig.PO.title}
        onPDFGenerated={handlePDFGenerated}
        additionalContent={documentConfig.PO.additionalContent}
      />
    </DocumentFormLayout>
  );
};

export default PoForm;
