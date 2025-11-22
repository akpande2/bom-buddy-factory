import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Upload, FileSpreadsheet, Package, Truck, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const actions = [
  {
    title: "Create New PR",
    description: "Start a new purchase requisition",
    icon: Plus,
    color: "text-blue-500",
    bgColor: "bg-blue-50 hover:bg-blue-100",
  },
  {
    title: "Upload OPS",
    description: "Upload order processing sheet",
    icon: Upload,
    color: "text-purple-500",
    bgColor: "bg-purple-50 hover:bg-purple-100",
  },
  {
    title: "Generate Comparative Sheet",
    description: "Create vendor comparison",
    icon: FileSpreadsheet,
    color: "text-green-500",
    bgColor: "bg-green-50 hover:bg-green-100",
  },
  {
    title: "Raise PO",
    description: "Issue purchase order",
    icon: Package,
    color: "text-orange-500",
    bgColor: "bg-orange-50 hover:bg-orange-100",
  },
  {
    title: "Upload GRN",
    description: "Submit goods receipt note",
    icon: Truck,
    color: "text-emerald-500",
    bgColor: "bg-emerald-50 hover:bg-emerald-100",
  },
  {
    title: "Raise Issue",
    description: "Report a problem or concern",
    icon: AlertCircle,
    color: "text-red-500",
    bgColor: "bg-red-50 hover:bg-red-100",
  },
];

export const ActionPanel = () => {
  const navigate = useNavigate();

  const handleActionClick = (title: string) => {
    if (title === "Upload OPS") {
      navigate("/ops-form");
    } else if (title === "Create New PR") {
      navigate("/pr-form");
    }
  };

  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle className="text-base">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="grid grid-cols-2 gap-3">
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <Button
                key={action.title}
                variant="outline"
                className={`h-auto flex-col items-start p-4 border-2 hover:border-primary/50 transition-all ${action.bgColor}`}
                onClick={() => handleActionClick(action.title)}
              >
                <div className="flex items-center gap-3 w-full mb-2">
                  <div className={`p-2 rounded-lg bg-background ${action.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-sm font-semibold text-foreground text-left">
                    {action.title}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground text-left w-full">
                  {action.description}
                </p>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
