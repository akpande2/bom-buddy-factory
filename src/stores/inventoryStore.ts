import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface InventoryItem {
  id: string;
  // General Info
  itemName: string;
  sku: string;
  category: string;
  itemType: "Raw Material" | "Finished Good" | "Consumable" | "Asset";
  description?: string;
  
  // India Compliance
  hsnSacCode: string;
  gstRate: 0 | 5 | 12 | 18 | 28;
  
  // Stock Details
  uom: string;
  openingStock: number;
  currentStock: number;
  reorderLevel: number;
  maxStockLevel: number;
  
  // Costing
  standardCost: number;
  lastPurchasePrice?: number;
  
  status: "Active" | "Inactive";
}

interface InventoryStore {
  items: InventoryItem[];
  addItem: (item: InventoryItem) => void;
  updateItem: (id: string, updatedItem: Partial<InventoryItem>) => void;
  deleteItem: (id: string) => void;
  getItemById: (id: string) => InventoryItem | undefined;
}

export const useInventoryStore = create<InventoryStore>()(
  persist(
    (set, get) => ({
      items: [
        { id: "1", itemName: "Motor Assembly XL", sku: "MTR-001", category: "Motors", itemType: "Raw Material", hsnSacCode: "8501", uom: "Pcs", openingStock: 100, currentStock: 145, gstRate: 18, reorderLevel: 50, maxStockLevel: 200, standardCost: 1200, lastPurchasePrice: 1180, status: "Active" },
        { id: "2", itemName: "Blade Set - 48 inch", sku: "BLD-048", category: "Blades", itemType: "Finished Good", hsnSacCode: "8414", uom: "Set", openingStock: 50, currentStock: 78, gstRate: 18, reorderLevel: 25, maxStockLevel: 150, standardCost: 450, lastPurchasePrice: 445, status: "Active" },
        { id: "3", itemName: "Capacitor 2.5 μF", sku: "CAP-2.5", category: "Electrical", itemType: "Raw Material", hsnSacCode: "8532", uom: "Pcs", openingStock: 500, currentStock: 322, gstRate: 18, reorderLevel: 100, maxStockLevel: 1000, standardCost: 25, lastPurchasePrice: 24, status: "Active" },
        { id: "4", itemName: "Copper Winding Wire", sku: "COP-WND", category: "Raw Material", itemType: "Raw Material", hsnSacCode: "7408", uom: "Kg", openingStock: 1000, currentStock: 856, gstRate: 18, reorderLevel: 200, maxStockLevel: 2000, standardCost: 650, lastPurchasePrice: 645, status: "Active" },
        { id: "5", itemName: "Plastic Base Plate", sku: "PLT-BASE", category: "Components", itemType: "Raw Material", hsnSacCode: "3926", uom: "Pcs", openingStock: 80, currentStock: 42, gstRate: 18, reorderLevel: 30, maxStockLevel: 200, standardCost: 85, lastPurchasePrice: 82, status: "Active" },
        { id: "6", itemName: "Mounting Bracket", sku: "BRK-MNT", category: "Hardware", itemType: "Raw Material", hsnSacCode: "7326", uom: "Pcs", openingStock: 200, currentStock: 167, gstRate: 18, reorderLevel: 50, maxStockLevel: 500, standardCost: 35, lastPurchasePrice: 34, status: "Active" },
        { id: "7", itemName: "Regulator Panel", sku: "REG-PNL", category: "Electrical", itemType: "Finished Good", hsnSacCode: "8537", uom: "Pcs", openingStock: 75, currentStock: 58, gstRate: 28, reorderLevel: 30, maxStockLevel: 150, standardCost: 280, lastPurchasePrice: 275, status: "Active" },
        { id: "8", itemName: "Cable Wire 3-Core", sku: "CBL-3CR", category: "Electrical", itemType: "Raw Material", hsnSacCode: "8544", uom: "Meter", openingStock: 1500, currentStock: 1234, gstRate: 18, reorderLevel: 300, maxStockLevel: 3000, standardCost: 45, lastPurchasePrice: 44, status: "Active" },
        { id: "9", itemName: "Ball Bearing 6203", sku: "BRG-6203", category: "Hardware", itemType: "Consumable", hsnSacCode: "8482", uom: "Pcs", openingStock: 300, currentStock: 245, gstRate: 18, reorderLevel: 100, maxStockLevel: 500, standardCost: 95, lastPurchasePrice: 93, status: "Active" },
        { id: "10", itemName: "Paint - Enamel White", sku: "PNT-WHT", category: "Finishing", itemType: "Consumable", hsnSacCode: "3208", uom: "Ltr", openingStock: 100, currentStock: 23, gstRate: 28, reorderLevel: 20, maxStockLevel: 200, standardCost: 320, lastPurchasePrice: 315, status: "Inactive" },
        { id: "11", itemName: "Packaging Box - Medium", sku: "PKG-MD", category: "Packaging", itemType: "Consumable", hsnSacCode: "4819", uom: "Pcs", openingStock: 500, currentStock: 342, gstRate: 12, reorderLevel: 100, maxStockLevel: 1000, standardCost: 15, lastPurchasePrice: 14, status: "Active" },
        { id: "12", itemName: "Assembly Screws M4", sku: "SCR-M4", category: "Hardware", itemType: "Consumable", hsnSacCode: "7318", uom: "Pcs", openingStock: 5000, currentStock: 3456, gstRate: 18, reorderLevel: 1000, maxStockLevel: 10000, standardCost: 2, lastPurchasePrice: 1.9, status: "Active" },
      ],

      addItem: (item) =>
        set((state) => ({
          items: [...state.items, item],
        })),

      updateItem: (id, updatedItem) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, ...updatedItem } : item
          ),
        })),

      deleteItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        })),

      getItemById: (id) => {
        return get().items.find((item) => item.id === id);
      },
    }),
    {
      name: "inventory-items",
    }
  )
);
