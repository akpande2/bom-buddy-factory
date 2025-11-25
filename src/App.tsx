import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Package } from "lucide-react";
import Dashboard from "./pages/Dashboard";
import BOM from "./pages/BOM";
import Usage from "./pages/Usage";
import Stock from "./pages/Stock";
import Quotations from "./pages/Quotations";
import PurchaseOrders from "./pages/PurchaseOrders";
import OpsForm from "./pages/OpsForm";
import PrForm from "./pages/PrForm";
import LoiForm from "./pages/LoiForm";
import PoForm from "./pages/PoForm";
import GrnForm from "./pages/GrnForm";
import Suppliers from "./pages/Suppliers";
import Vendors from "./pages/Vendors";
import VendorProfile from "./pages/VendorProfile";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import Customers from "./pages/Customers";
import InventoryLayout from "./pages/inventory/InventoryLayout";
import InventoryDashboard from "./pages/inventory/InventoryDashboard";
import ItemMaster from "./pages/inventory/ItemMaster";
import Warehouses from "./pages/inventory/Warehouses";
import WarehouseDetail from "./pages/inventory/WarehouseDetail";
import StockLedger from "./pages/inventory/StockLedger";
import StockTransfer from "./pages/inventory/StockTransfer";
import GRNIntegration from "./pages/inventory/GRNIntegration";
import Items from "./pages/inventory/Items";
import ItemDetail from "./pages/inventory/ItemDetail";
import PurchaseRequisitions from "./pages/procurement/PurchaseRequisitions";
import WorkOrders from "./pages/production/WorkOrders";
import AccountsPayable from "./pages/finance/AccountsPayable";
import AccountsReceivable from "./pages/finance/AccountsReceivable";
import GeneralLedger from "./pages/finance/GeneralLedger";
import Payments from "./pages/finance/Payments";
import QCChecks from "./pages/quality/QCChecks";
import QCReports from "./pages/quality/QCReports";
import FixedAssets from "./pages/assets/FixedAssets";
import DepreciationSchedule from "./pages/assets/DepreciationSchedule";
import SalesLayout from "./pages/sales/SalesLayout";
import Leads from "./pages/sales/Leads";
import SalesQuotations from "./pages/sales/SalesQuotations";
import SalesOrders from "./pages/sales/SalesOrders";
import DeliveryChallans from "./pages/sales/DeliveryChallans";
import Invoices from "./pages/sales/Invoices";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <SidebarProvider defaultOpen={true}>
          <div className="min-h-screen flex w-full">
            <AppSidebar />
            <SidebarInset className="flex-1">
              <header className="sticky top-0 z-10 bg-gradient-primary border-b border-border shadow-md">
                <div className="flex items-center gap-4 px-6 py-4">
                  <SidebarTrigger className="text-primary-foreground hover:bg-primary/10" />
                  <div className="flex items-center gap-3">
                    <div className="bg-card p-2 rounded-lg shadow-sm">
                      <Package className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h1 className="text-xl font-bold text-primary-foreground">Fan Factory MRP</h1>
                      <p className="text-xs text-primary-foreground/80">Material Resource Planning</p>
                    </div>
                  </div>
                </div>
              </header>
              <main className="flex-1 overflow-auto bg-background">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/customers" element={<Customers />} />
                  <Route path="/bom" element={<BOM />} />
                  <Route path="/usage" element={<Usage />} />
                  <Route path="/stock" element={<Stock />} />
                  <Route path="/quotations" element={<Quotations />} />
                  <Route path="/purchase-orders" element={<PurchaseOrders />} />
                  <Route path="/procurement/purchase-requisitions" element={<PurchaseRequisitions />} />
                  <Route path="/ops-form" element={<OpsForm />} />
                  <Route path="/pr-form" element={<PrForm />} />
                  <Route path="/loi-form" element={<LoiForm />} />
                  <Route path="/po-form" element={<PoForm />} />
                  <Route path="/grn-form" element={<GrnForm />} />
                  <Route path="/suppliers" element={<Suppliers />} />
                  <Route path="/vendors" element={<Vendors />} />
                  <Route path="/vendors/:id" element={<VendorProfile />} />
                  <Route path="/production/work-orders" element={<WorkOrders />} />
                  <Route path="/finance/accounts-payable" element={<AccountsPayable />} />
                  <Route path="/finance/accounts-receivable" element={<AccountsReceivable />} />
                  <Route path="/finance/general-ledger" element={<GeneralLedger />} />
                  <Route path="/finance/payments" element={<Payments />} />
                  <Route path="/quality/checks" element={<QCChecks />} />
                  <Route path="/quality/reports" element={<QCReports />} />
                  <Route path="/assets/fixed-assets" element={<FixedAssets />} />
                  <Route path="/assets/depreciation" element={<DepreciationSchedule />} />
                  <Route path="/inventory" element={<InventoryLayout />}>
                    <Route index element={<InventoryDashboard />} />
                    <Route path="item-master" element={<ItemMaster />} />
                    <Route path="items" element={<Items />} />
                    <Route path="items/:id" element={<ItemDetail />} />
                    <Route path="warehouses" element={<Warehouses />} />
                    <Route path="warehouses/:id" element={<WarehouseDetail />} />
                    <Route path="stock-ledger" element={<StockLedger />} />
                    <Route path="stock-transfer" element={<StockTransfer />} />
                    <Route path="grn-integration" element={<GRNIntegration />} />
                  </Route>
                  <Route path="/sales" element={<SalesLayout />}>
                    <Route path="leads" element={<Leads />} />
                    <Route path="quotations" element={<SalesQuotations />} />
                    <Route path="orders" element={<SalesOrders />} />
                    <Route path="challans" element={<DeliveryChallans />} />
                    <Route path="invoices" element={<Invoices />} />
                  </Route>
                  <Route path="/reports" element={<Reports />} />
                  <Route path="/settings" element={<Settings />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
            </SidebarInset>
          </div>
        </SidebarProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
