import { Outlet } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { InventorySidebar } from "@/components/InventorySidebar";

const InventoryLayout = () => {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="h-screen flex overflow-hidden">
        <InventorySidebar />
        <div className="flex-1 overflow-auto bg-background">
          <main className="p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default InventoryLayout;
