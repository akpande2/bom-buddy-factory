import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

interface DocumentFormLayoutProps {
  title: string;
  description: string;
  onSaveDraft: () => void;
  children: ReactNode;
  showDraftStatus?: boolean;
  lastSaved?: Date | null;
}

export const DocumentFormLayout = ({
  title,
  description,
  onSaveDraft,
  children,
  showDraftStatus = false,
  lastSaved,
}: DocumentFormLayoutProps) => {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">{title}</h1>
            <p className="text-muted-foreground mt-1">{description}</p>
          </div>
          <Button variant="outline" onClick={onSaveDraft} className="gap-2">
            <Save className="h-4 w-4" />
            Save Draft
          </Button>
        </div>

        {children}

        {showDraftStatus && lastSaved && (
          <div className="text-sm text-muted-foreground text-center">
            Last saved: {lastSaved.toLocaleString()}
          </div>
        )}
      </div>
    </div>
  );
};
