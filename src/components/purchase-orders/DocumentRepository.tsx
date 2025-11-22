import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, ClipboardList, FileSpreadsheet, StickyNote, CheckSquare, Package, Mail, Truck, Receipt } from "lucide-react";
import { cn } from "@/lib/utils";

const documentCategories = [
  { name: "OPS", icon: FileText, count: 24, color: "text-blue-500" },
  { name: "PR", icon: ClipboardList, count: 18, color: "text-indigo-500" },
  { name: "Comparative Sheet", icon: FileSpreadsheet, count: 12, color: "text-purple-500" },
  { name: "SCM Note", icon: StickyNote, count: 15, color: "text-pink-500" },
  { name: "MD Approval Note", icon: CheckSquare, count: 9, color: "text-orange-500" },
  { name: "PO", icon: Package, count: 32, color: "text-green-500" },
  { name: "LOI", icon: Mail, count: 7, color: "text-cyan-500" },
  { name: "GRN", icon: Truck, count: 28, color: "text-emerald-500" },
  { name: "Invoice", icon: Receipt, count: 25, color: "text-amber-500" },
];

export const DocumentRepository = () => {
  return (
    <Card className="h-full">
      <CardHeader className="border-b">
        <CardTitle className="flex items-center justify-between text-base">
          <span>Document Repository</span>
          <Badge variant="secondary" className="text-xs">
            {documentCategories.reduce((sum, cat) => sum + cat.count, 0)} files
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y">
          {documentCategories.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.name}
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-muted/50 transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <div className={cn("p-2 rounded-lg bg-muted/50", category.color)}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-medium text-foreground">
                    {category.name}
                  </span>
                </div>
                <Badge variant="outline" className="font-semibold">
                  {category.count}
                </Badge>
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
