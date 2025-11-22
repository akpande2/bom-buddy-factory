import { TopBar } from "@/components/purchase-orders/TopBar";
import { P2PSidebar } from "@/components/purchase-orders/P2PSidebar";
import { MainContent } from "@/components/purchase-orders/MainContent";

const PurchaseOrders = () => {

  return (
    <div className="h-screen flex flex-col">
      <TopBar />
      
      <div className="flex flex-1 overflow-hidden">
        <P2PSidebar activeSection="ops" />
        <MainContent />
      </div>
    </div>
  );
};

export default PurchaseOrders;