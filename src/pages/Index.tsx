import { useState } from "react";
import { Package, TrendingUp, AlertCircle, CheckCircle } from "lucide-react";
import DashboardStats from "@/components/DashboardStats";
import BillOfMaterials from "@/components/BillOfMaterials";
import MaterialUsage from "@/components/MaterialUsage";

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-gradient-primary border-b border-border shadow-md">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-card p-2 rounded-lg shadow-sm">
                <Package className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-primary-foreground">Fan Factory MRP</h1>
                <p className="text-sm text-primary-foreground/80">Material Resource Planning</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <nav className="bg-card border-b border-border shadow-sm">
        <div className="container mx-auto px-6">
          <div className="flex gap-1">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`px-6 py-4 text-sm font-medium transition-colors relative ${
                activeTab === "dashboard"
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Dashboard
              {activeTab === "dashboard" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
              )}
            </button>
            <button
              onClick={() => setActiveTab("bom")}
              className={`px-6 py-4 text-sm font-medium transition-colors relative ${
                activeTab === "bom"
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Bill of Materials
              {activeTab === "bom" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
              )}
            </button>
            <button
              onClick={() => setActiveTab("usage")}
              className={`px-6 py-4 text-sm font-medium transition-colors relative ${
                activeTab === "usage"
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Material Usage
              {activeTab === "usage" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
              )}
            </button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-6 py-8">
        {activeTab === "dashboard" && <DashboardStats />}
        {activeTab === "bom" && <BillOfMaterials />}
        {activeTab === "usage" && <MaterialUsage />}
      </main>
    </div>
  );
};

export default Index;
