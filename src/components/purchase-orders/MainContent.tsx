import { KPICards } from "@/components/purchase-orders/KPICards";
import { PipelineStages } from "@/components/purchase-orders/PipelineStages";
import { ActiveRequestsTable } from "@/components/purchase-orders/ActiveRequestsTable";

export const MainContent = () => {
  return (
    <div className="flex-1 p-6 bg-background overflow-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-1">Dashboard Overview</h2>
        <p className="text-sm text-muted-foreground">Key procurement metrics at a glance</p>
      </div>
      
      <KPICards />
      
      <PipelineStages />
      
      <ActiveRequestsTable />
    </div>
  );
};
