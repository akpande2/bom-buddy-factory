import { Card } from "@/components/ui/card";

export const MainContent = () => {
  return (
    <div className="flex-1 p-6 bg-background overflow-auto">
      <Card className="h-full min-h-[600px] flex items-center justify-center border-dashed">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
            <span className="text-2xl">📋</span>
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Main Content Area
          </h3>
          <p className="text-sm text-muted-foreground max-w-md">
            This is the main content placeholder. Business logic and data tables will be displayed here.
          </p>
        </div>
      </Card>
    </div>
  );
};
