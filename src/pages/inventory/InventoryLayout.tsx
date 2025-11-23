import { Outlet } from "react-router-dom";
import { InventorySidebar } from "@/components/InventorySidebar";

const InventoryLayout = () => {
  return (
    <div className="flex h-full overflow-hidden">
      <InventorySidebar />
      <div className="flex-1 overflow-auto">
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default InventoryLayout;
