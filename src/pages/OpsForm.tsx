import { DocumentFormWithPDF } from "@/components/DocumentFormWithPDF";
import { DocumentFormLayout } from "@/components/DocumentFormLayout";
import { useDocumentForm } from "@/hooks/useDocumentForm";
import { documentSchemas, documentConfig } from "@/config/documentSchemas";

const OpsForm = () => {
  const { savedDraft, lastSaved, handlePDFGenerated, handleSaveDraft } = useDocumentForm();

  return (
    <DocumentFormLayout
      title={documentConfig.OPS.title}
      description={documentConfig.OPS.description}
      onSaveDraft={handleSaveDraft}
      showDraftStatus={!!savedDraft}
      lastSaved={lastSaved}
    >
      <DocumentFormWithPDF
        schema={documentSchemas.OPS}
        title={documentConfig.OPS.title}
        onPDFGenerated={handlePDFGenerated}
        additionalContent={documentConfig.OPS.additionalContent}
      />
    </DocumentFormLayout>
  );
};

export default OpsForm;
