import { DocumentFormWithPDF } from "@/components/DocumentFormWithPDF";
import { DocumentFormLayout } from "@/components/DocumentFormLayout";
import { useDocumentForm } from "@/hooks/useDocumentForm";
import { documentSchemas, documentConfig } from "@/config/documentSchemas";

const GrnForm = () => {
  const { savedDraft, lastSaved, handlePDFGenerated, handleSaveDraft } = useDocumentForm();

  return (
    <DocumentFormLayout
      title={documentConfig.GRN.title}
      description={documentConfig.GRN.description}
      onSaveDraft={handleSaveDraft}
      showDraftStatus={!!savedDraft}
      lastSaved={lastSaved}
    >
      <DocumentFormWithPDF
        schema={documentSchemas.GRN}
        title={documentConfig.GRN.title}
        onPDFGenerated={handlePDFGenerated}
        additionalContent={documentConfig.GRN.additionalContent}
      />
    </DocumentFormLayout>
  );
};

export default GrnForm;
