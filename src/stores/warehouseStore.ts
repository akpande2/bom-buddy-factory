import { create } from "zustand";
import { persist } from "zustand/middleware";

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

interface WarehouseStore {
  warehouses: Warehouse[];
  addWarehouse: (warehouse: Warehouse) => void;
  updateWarehouse: (id: string, updatedWarehouse: Partial<Warehouse>) => void;
  deleteWarehouse: (id: string) => void;
  getWarehouseById: (id: string) => Warehouse | undefined;
}

export const useWarehouseStore = create<WarehouseStore>()(
  persist(
    (set, get) => ({
      warehouses: [
        { id: "1", name: "Main Manufacturing Warehouse", code: "WH-001", location: "Pune, Maharashtra", manager: "Rajesh Kumar", contact: "9876543210", capacity: 10000, occupied: 7200, itemCount: 145, status: "Active", type: "Main" },
        { id: "2", name: "Regional Warehouse - North", code: "WH-002", location: "Delhi, NCR", manager: "Amit Singh", contact: "9876543211", capacity: 5000, occupied: 3800, itemCount: 89, status: "Active", type: "Regional" },
        { id: "3", name: "Regional Warehouse - South", code: "WH-003", location: "Bangalore, Karnataka", manager: "Priya Sharma", contact: "9876543212", capacity: 5000, occupied: 4200, itemCount: 112, status: "Active", type: "Regional" },
        { id: "4", name: "Transit Hub - Mumbai", code: "WH-004", location: "Mumbai, Maharashtra", manager: "Vikram Patel", contact: "9876543213", capacity: 2000, occupied: 800, itemCount: 34, status: "Active", type: "Transit" },
        { id: "5", name: "Regional Warehouse - East", code: "WH-005", location: "Kolkata, West Bengal", manager: "Suresh Reddy", contact: "9876543214", capacity: 4000, occupied: 2100, itemCount: 67, status: "Inactive", type: "Regional" },
      ],

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
    }),
    {
      name: "warehouses",
    }
  )
);
