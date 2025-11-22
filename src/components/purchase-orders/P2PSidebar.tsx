import { FileText, ClipboardList, FileSpreadsheet, Package, CheckCircle, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface P2PSidebarProps {
  activeSection?: string;
}

const navigationItems = [
  { id: "ops", label: "Order Processing", icon: FileText, badge: "3" },
  { id: "pr", label: "Purchase Requisitions", icon: ClipboardList, badge: "5" },
  { id: "cs", label: "Comparative Sheets", icon: FileSpreadsheet, badge: "2" },
  { id: "po", label: "Purchase Orders", icon: Package, badge: "8" },
  { id: "grn", label: "Goods Receipt", icon: CheckCircle, badge: "4" },
  { id: "analytics", label: "Analytics", icon: TrendingUp },
];

export const P2PSidebar = ({ activeSection = "ops" }: P2PSidebarProps) => {
  return (
    <div className="w-64 border-r bg-card h-full flex flex-col">
      <div className="p-4 border-b">
        <h3 className="font-semibold text-sm text-foreground">P2P Workflow</h3>
        <p className="text-xs text-muted-foreground mt-1">Procurement stages</p>
      </div>

      <nav className="flex-1 p-2 space-y-1">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          
          return (
            <button
              key={item.id}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground font-medium"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              <span className="flex-1 text-left">{item.label}</span>
              {item.badge && (
                <span
                  className={cn(
                    "px-2 py-0.5 rounded-full text-xs font-medium",
                    isActive
                      ? "bg-primary-foreground/20 text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t">
        <div className="bg-muted/50 rounded-lg p-3">
          <p className="text-xs font-medium text-foreground">Quick Stats</p>
          <div className="mt-2 space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Active Orders</span>
              <span className="font-medium text-foreground">12</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Pending Approvals</span>
              <span className="font-medium text-foreground">5</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
