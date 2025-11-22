import { DocumentFormWithPDF } from "@/components/DocumentFormWithPDF";
import { DocumentFormLayout } from "@/components/DocumentFormLayout";
import { useDocumentForm } from "@/hooks/useDocumentForm";
import { documentSchemas, documentConfig } from "@/config/documentSchemas";

const PrForm = () => {
  const { savedDraft, lastSaved, handlePDFGenerated, handleSaveDraft } = useDocumentForm();

  return (
    <DocumentFormLayout
      title={documentConfig.PR.title}
      description={documentConfig.PR.description}
      onSaveDraft={handleSaveDraft}
      showDraftStatus={!!savedDraft}
      lastSaved={lastSaved}
    >
      <DocumentFormWithPDF
        schema={documentSchemas.PR}
        title={documentConfig.PR.title}
        onPDFGenerated={handlePDFGenerated}
        additionalContent={documentConfig.PR.additionalContent}
      />
    </DocumentFormLayout>
  );
};

export default PrForm;
