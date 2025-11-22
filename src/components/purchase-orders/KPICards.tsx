import { Card, CardContent } from "@/components/ui/card";
import { FileText, Clock, Package, Truck, Timer, TrendingDown } from "lucide-react";

const kpiData = [
  {
    title: "Total PRs Raised",
    value: "247",
    icon: FileText,
    color: "text-blue-500",
  },
  {
    title: "Pending Approvals",
    value: "18",
    icon: Clock,
    color: "text-amber-500",
  },
  {
    title: "POs Issued",
    value: "189",
    icon: Package,
    color: "text-green-500",
  },
  {
    title: "Deliveries Pending",
    subtitle: "(GRN Not Done)",
    value: "34",
    icon: Truck,
    color: "text-orange-500",
  },
  {
    title: "Average Procurement Cycle Time",
    value: "12.5",
    unit: "days",
    icon: Timer,
    color: "text-purple-500",
  },
  {
    title: "Savings Identified",
    value: "₹2.4L",
    icon: TrendingDown,
    color: "text-emerald-500",
  },
];

export const KPICards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {kpiData.map((kpi, index) => {
        const Icon = kpi.icon;
        return (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className={`p-2 rounded-lg bg-muted/50 ${kpi.color}`}>
                  <Icon className="h-4 w-4" />
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground leading-tight">
                  {kpi.title}
                  {kpi.subtitle && (
                    <>
                      <br />
                      <span className="text-[10px]">{kpi.subtitle}</span>
                    </>
                  )}
                </p>
                <div className="flex items-baseline gap-1">
                  <p className="text-2xl font-bold text-foreground">{kpi.value}</p>
                  {kpi.unit && (
                    <span className="text-xs text-muted-foreground">{kpi.unit}</span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
