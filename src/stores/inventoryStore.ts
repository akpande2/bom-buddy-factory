import { create } from "zustand";
import { persist } from "zustand/middleware";

// ============= INTERFACES =============

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

export interface Warehouse {
  id: string;
  name: string;
  code: string;
  location: string;
  manager: string;
  contact: string;
  capacity: number;
  occupied: number;
  itemCount: number;
  status: "Active" | "Inactive";
  type: "Main" | "Regional" | "Transit";
  bins?: Bin[];
}

export interface Bin {
  id: string;
  binCode: string;
  rackNumber: string;
  capacity: number;
  occupied: number;
  assignedItems?: { itemId: string; itemName: string; quantity: number }[];
}

export interface StockTransaction {
  id: string;
  date: string;
  itemCode: string;
  itemName: string;
  transactionType: "GRN" | "Issue" | "Return" | "Adjustment";
  quantityIn: number;
  quantityOut: number;
  warehouse: string;
  balance: number;
  remarks: string;
}

// ============= STORE INTERFACE =============

interface InventoryStore {
  // Items
  items: InventoryItem[];
  addItem: (item: InventoryItem) => void;
  updateItem: (id: string, updatedItem: Partial<InventoryItem>) => void;
  deleteItem: (id: string) => void;
  getItemById: (id: string) => InventoryItem | undefined;
  
  // Warehouses
  warehouses: Warehouse[];
  addWarehouse: (warehouse: Warehouse) => void;
  updateWarehouse: (id: string, updatedWarehouse: Partial<Warehouse>) => void;
  deleteWarehouse: (id: string) => void;
  getWarehouseById: (id: string) => Warehouse | undefined;
  
  // Stock Transactions
  transactions: StockTransaction[];
  recordTransaction: (transaction: Omit<StockTransaction, 'id' | 'balance'>) => void;
  getTransactionsByItem: (itemCode: string) => StockTransaction[];
  getTransactionsByWarehouse: (warehouse: string) => StockTransaction[];
}

// ============= STORE IMPLEMENTATION =============

export const useInventoryStore = create<InventoryStore>()(
  persist(
    (set, get) => ({
      // ============= ITEMS DATA =============
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

      // ============= WAREHOUSES DATA =============
      warehouses: [
        { id: "1", name: "Main Manufacturing Warehouse", code: "WH-001", location: "Pune, Maharashtra", manager: "Rajesh Kumar", contact: "9876543210", capacity: 10000, occupied: 7200, itemCount: 145, status: "Active", type: "Main" },
        { id: "2", name: "Regional Warehouse - North", code: "WH-002", location: "Delhi, NCR", manager: "Amit Singh", contact: "9876543211", capacity: 5000, occupied: 3800, itemCount: 89, status: "Active", type: "Regional" },
        { id: "3", name: "Regional Warehouse - South", code: "WH-003", location: "Bangalore, Karnataka", manager: "Priya Sharma", contact: "9876543212", capacity: 5000, occupied: 4200, itemCount: 112, status: "Active", type: "Regional" },
        { id: "4", name: "Transit Hub - Mumbai", code: "WH-004", location: "Mumbai, Maharashtra", manager: "Vikram Patel", contact: "9876543213", capacity: 2000, occupied: 800, itemCount: 34, status: "Active", type: "Transit" },
        { id: "5", name: "Regional Warehouse - East", code: "WH-005", location: "Kolkata, West Bengal", manager: "Suresh Reddy", contact: "9876543214", capacity: 4000, occupied: 2100, itemCount: 67, status: "Inactive", type: "Regional" },
      ],

      // ============= TRANSACTIONS DATA =============
      transactions: [
        { id: "1", date: "2025-11-22", itemCode: "MTR-001", itemName: "Motor Assembly XL", transactionType: "GRN", quantityIn: 50, quantityOut: 0, warehouse: "WH-001", balance: 145, remarks: "Received from PO-2024-156" },
        { id: "2", date: "2025-11-22", itemCode: "BLD-048", itemName: "Blade Set - 48 inch", transactionType: "Issue", quantityIn: 0, quantityOut: 30, warehouse: "WH-001", balance: 78, remarks: "Issued for production WO-2024-889" },
        { id: "3", date: "2025-11-21", itemCode: "CAP-2.5", itemName: "Capacitor 2.5 μF", transactionType: "GRN", quantityIn: 200, quantityOut: 0, warehouse: "WH-002", balance: 322, remarks: "New stock received" },
        { id: "4", date: "2025-11-21", itemCode: "COP-WND", itemName: "Copper Winding Wire", transactionType: "Adjustment", quantityIn: 0, quantityOut: 12, warehouse: "WH-001", balance: 856, remarks: "Stock count adjustment - damage" },
        { id: "5", date: "2025-11-20", itemCode: "MTR-001", itemName: "Motor Assembly XL", transactionType: "Issue", quantityIn: 0, quantityOut: 20, warehouse: "WH-003", balance: 95, remarks: "Production usage" },
        { id: "6", date: "2025-11-20", itemCode: "BLD-048", itemName: "Blade Set - 48 inch", transactionType: "Return", quantityIn: 25, quantityOut: 0, warehouse: "WH-001", balance: 108, remarks: "Returned from production - excess" },
        { id: "7", date: "2025-11-19", itemCode: "CAP-2.5", itemName: "Capacitor 2.5 μF", transactionType: "Issue", quantityIn: 0, quantityOut: 80, warehouse: "WH-002", balance: 122, remarks: "Assembly line requisition" },
      ],

      // ============= ITEMS FUNCTIONS =============
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

      // ============= WAREHOUSES FUNCTIONS =============
      addWarehouse: (warehouse) =>
        set((state) => ({
          warehouses: [...state.warehouses, warehouse],
        })),

      updateWarehouse: (id, updatedWarehouse) =>
        set((state) => ({
          warehouses: state.warehouses.map((wh) =>
            wh.id === id ? { ...wh, ...updatedWarehouse } : wh
          ),
        })),

      deleteWarehouse: (id) =>
        set((state) => ({
          warehouses: state.warehouses.filter((wh) => wh.id !== id),
        })),

      getWarehouseById: (id) => {
        return get().warehouses.find((wh) => wh.id === id);
      },

      // ============= TRANSACTIONS FUNCTIONS =============
      recordTransaction: (transaction) => {
        const state = get();
        
        // Calculate balance based on existing transactions for this item and warehouse
        const existingTransactions = state.transactions
          .filter((t) => t.itemCode === transaction.itemCode && t.warehouse === transaction.warehouse)
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        
        const previousBalance = existingTransactions.length > 0 ? existingTransactions[0].balance : 0;
        const newBalance = previousBalance + transaction.quantityIn - transaction.quantityOut;

        const newTransaction: StockTransaction = {
          ...transaction,
          id: Date.now().toString(),
          balance: newBalance,
        };

        set((state) => ({
          transactions: [newTransaction, ...state.transactions],
        }));

        // Update item's current stock
        const item = state.items.find((i) => i.sku === transaction.itemCode);
        if (item) {
          const stockChange = transaction.quantityIn - transaction.quantityOut;
          set((state) => ({
            items: state.items.map((i) =>
              i.sku === transaction.itemCode
                ? { ...i, currentStock: i.currentStock + stockChange }
                : i
            ),
          }));
        }
      },

      getTransactionsByItem: (itemCode) => {
        return get().transactions.filter((t) => t.itemCode === itemCode);
      },

      getTransactionsByWarehouse: (warehouse) => {
        return get().transactions.filter((t) => t.warehouse === warehouse);
      },
    }),
    {
      name: "inventory-store",
    }
  )
);
