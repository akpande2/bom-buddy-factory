import { Users, FileText, ShoppingBag, Truck, Receipt } from "lucide-react";
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

const salesItems = [
  { title: "Leads", url: "/sales/leads", icon: Users },
  { title: "Quotations", url: "/sales/quotations", icon: FileText },
  { title: "Sales Orders", url: "/sales/orders", icon: ShoppingBag },
  { title: "Delivery Challans", url: "/sales/challans", icon: Truck },
  { title: "Invoices", url: "/sales/invoices", icon: Receipt },
];

export function SalesSidebar() {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon" className="border-r border-border">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-muted-foreground">
            Sales Management
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {salesItems.map((item) => (
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
