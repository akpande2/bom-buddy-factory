import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const stages = [
  { title: "OPS Submitted", count: 12, color: "bg-blue-500" },
  { title: "PR Created", count: 8, color: "bg-indigo-500" },
  { title: "Comparative Sheet", count: 5, color: "bg-purple-500" },
  { title: "SCM Review", count: 6, color: "bg-pink-500" },
  { title: "MD Approval", count: 4, color: "bg-orange-500" },
  { title: "PO Issued", count: 15, color: "bg-green-500" },
  { title: "GRN", count: 3, color: "bg-emerald-500" },
];

export const PipelineStages = () => {
  return (
    <div className="space-y-3">
      <div>
        <h3 className="text-lg font-semibold text-foreground">Procurement Pipeline</h3>
        <p className="text-sm text-muted-foreground">Current orders in each stage</p>
      </div>
      
      <div className="flex items-center gap-3 overflow-x-auto pb-2">
        {stages.map((stage, index) => (
          <div key={stage.title} className="flex items-center gap-3 flex-shrink-0">
            <Card className="hover:shadow-md transition-all hover:-translate-y-0.5 cursor-pointer min-w-[180px]">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className={cn("w-2 h-2 rounded-full", stage.color)} />
                  <Badge variant="secondary" className="font-semibold">
                    {stage.count}
                  </Badge>
                </div>
                <h4 className="font-medium text-sm text-foreground leading-tight">
                  {stage.title}
                </h4>
              </CardContent>
            </Card>
            
            {index < stages.length - 1 && (
              <ArrowRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
