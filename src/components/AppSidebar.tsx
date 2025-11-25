import { LayoutDashboard, Package, ShoppingCart, FileText, Settings, Building2, ReceiptText, Users, Warehouse, ClipboardList, GitCompareArrows, FileSpreadsheet, Truck, Receipt, Wrench, DollarSign, CreditCard, BookOpen, Banknote, CheckCircle, BarChart3, Archive, TrendingDown } from "lucide-react";
import { NavLink } from "@/components/NavLink";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const topLevelItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Reports", url: "/reports", icon: FileText },
  { title: "Settings", url: "/settings", icon: Settings },
];

const masterDataItems = [
  { title: "Items", url: "/inventory/items", icon: Package },
  { title: "Vendors", url: "/vendors", icon: Building2 },
  { title: "Customers", url: "#", icon: Users },
  { title: "Warehouses", url: "/inventory/warehouses", icon: Warehouse },
];

const procurementItems = [
  { title: "Purchase Requisitions", url: "#", icon: ClipboardList },
  { title: "Purchase Orders", url: "/purchase-orders", icon: ShoppingCart },
];

const inventoryWarehouseItems = [
  { title: "Stock Ledger", url: "/inventory/stock-ledger", icon: BookOpen },
  { title: "Stock Transfer", url: "#", icon: GitCompareArrows },
];

const salesDistributionItems = [
  { title: "Quotations", url: "/sales/quotations", icon: FileSpreadsheet },
  { title: "Sales Orders", url: "/sales/orders", icon: ReceiptText },
  { title: "Delivery", url: "/sales/challans", icon: Truck },
  { title: "Invoices", url: "/sales/invoices", icon: Receipt },
];

const productionItems = [
  { title: "BOM", url: "/bom", icon: FileText },
  { title: "Work Orders", url: "#", icon: Wrench },
];

const financeItems = [
  { title: "Accounts Payable", url: "#", icon: DollarSign },
  { title: "Accounts Receivable", url: "#", icon: CreditCard },
  { title: "General Ledger", url: "#", icon: BookOpen },
  { title: "Payments", url: "#", icon: Banknote },
];

const qualityControlItems = [
  { title: "QC Checks", url: "#", icon: CheckCircle },
  { title: "QC Reports", url: "#", icon: BarChart3 },
];

const assetsItems = [
  { title: "Fixed Assets", url: "#", icon: Archive },
  { title: "Depreciation Schedule", url: "#", icon: TrendingDown },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon" className="border-r border-border">
      <SidebarContent>
        {/* Top Level Items */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {topLevelItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={isCollapsed ? item.title : undefined}>
                    <NavLink 
                      to={item.url} 
                      end
                      className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground" 
                      activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Master Data */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-muted-foreground">Master Data</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {masterDataItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={isCollapsed ? item.title : undefined}>
                    <NavLink 
                      to={item.url} 
                      end
                      className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground" 
                      activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Procurement */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-muted-foreground">Procurement</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {procurementItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={isCollapsed ? item.title : undefined}>
                    <NavLink 
                      to={item.url} 
                      end
                      className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground" 
                      activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Inventory & Warehouse */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-muted-foreground">Inventory & Warehouse</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {inventoryWarehouseItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={isCollapsed ? item.title : undefined}>
                    <NavLink 
                      to={item.url} 
                      end
                      className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground" 
                      activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Sales & Distribution */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-muted-foreground">Sales & Distribution</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {salesDistributionItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={isCollapsed ? item.title : undefined}>
                    <NavLink 
                      to={item.url} 
                      end
                      className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground" 
                      activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Production / Manufacturing */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-muted-foreground">Production / Manufacturing</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {productionItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={isCollapsed ? item.title : undefined}>
                    <NavLink 
                      to={item.url} 
                      end
                      className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground" 
                      activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Finance & Accounting */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-muted-foreground">Finance & Accounting</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {financeItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={isCollapsed ? item.title : undefined}>
                    <NavLink 
                      to={item.url} 
                      end
                      className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground" 
                      activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Quality Control */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-muted-foreground">Quality Control</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {qualityControlItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={isCollapsed ? item.title : undefined}>
                    <NavLink 
                      to={item.url} 
                      end
                      className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground" 
                      activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Assets */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-muted-foreground">Assets</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {assetsItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={isCollapsed ? item.title : undefined}>
                    <NavLink 
                      to={item.url} 
                      end
                      className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground" 
                      activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
