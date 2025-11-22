import { LayoutDashboard, Package, Warehouse, FileText, RefreshCcw, List } from "lucide-react";
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

const inventorySubPages = [
  { title: "Inventory Dashboard", url: "/inventory", icon: LayoutDashboard },
  { title: "Item Master", url: "/inventory/item-master", icon: Package },
  { title: "Items List", url: "/inventory/items", icon: List },
  { title: "Warehouses", url: "/inventory/warehouses", icon: Warehouse },
  { title: "Stock Ledger", url: "/inventory/stock-ledger", icon: FileText },
  { title: "GRN Integration", url: "/inventory/grn-integration", icon: RefreshCcw },
];

export function InventorySidebar() {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon" className="border-r border-border">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-muted-foreground">
            Inventory Module
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {inventorySubPages.map((item) => (
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
