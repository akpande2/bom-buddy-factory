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
import PurchaseOrders from "./pages/PurchaseOrders";
import Suppliers from "./pages/Suppliers";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

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
                  <Route path="/bom" element={<BOM />} />
                  <Route path="/usage" element={<Usage />} />
                  <Route path="/stock" element={<Stock />} />
                  <Route path="/purchase-orders" element={<PurchaseOrders />} />
                  <Route path="/suppliers" element={<Suppliers />} />
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
