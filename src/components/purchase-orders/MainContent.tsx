import { KPICards } from "@/components/purchase-orders/KPICards";
import { PipelineStages } from "@/components/purchase-orders/PipelineStages";
import { ActiveRequestsTable } from "@/components/purchase-orders/ActiveRequestsTable";
import { DocumentRepository } from "@/components/purchase-orders/DocumentRepository";
import { PRTimeline } from "@/components/purchase-orders/PRTimeline";
import { VendorComparisonCharts } from "@/components/purchase-orders/VendorComparisonCharts";
import { FilterBar } from "@/components/purchase-orders/FilterBar";
import { ActionPanel } from "@/components/purchase-orders/ActionPanel";

export const MainContent = () => {
  return (
    <div className="flex-1 flex gap-6 p-6 bg-background overflow-hidden">
      <div className="flex-1 overflow-auto space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-1">Dashboard Overview</h2>
          <p className="text-sm text-muted-foreground">Key procurement metrics at a glance</p>
        </div>
        
        <KPICards />
        
        <PipelineStages />
        
        <ActionPanel />
        
        <FilterBar />
        
        <ActiveRequestsTable />
        
        <VendorComparisonCharts />
        
        <PRTimeline />
      </div>
      
      <div className="w-80 flex-shrink-0 overflow-auto">
        <DocumentRepository />
      </div>
    </div>
  );
};
