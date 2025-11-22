import { DocumentFormWithPDF } from "@/components/DocumentFormWithPDF";
import { DocumentFormLayout } from "@/components/DocumentFormLayout";
import { useDocumentForm } from "@/hooks/useDocumentForm";
import { documentSchemas, documentConfig } from "@/config/documentSchemas";

const LoiForm = () => {
  const { savedDraft, lastSaved, handlePDFGenerated, handleSaveDraft } = useDocumentForm();

  return (
    <DocumentFormLayout
      title={documentConfig.LOI.title}
      description={documentConfig.LOI.description}
      onSaveDraft={handleSaveDraft}
      showDraftStatus={!!savedDraft}
      lastSaved={lastSaved}
    >
      <DocumentFormWithPDF
        schema={documentSchemas.LOI}
        title={documentConfig.LOI.title}
        onPDFGenerated={handlePDFGenerated}
        additionalContent={documentConfig.LOI.additionalContent}
      />
    </DocumentFormLayout>
  );
};

export default LoiForm;
