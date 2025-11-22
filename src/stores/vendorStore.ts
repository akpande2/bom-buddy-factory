import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Vendor {
  id: string;
  name: string;
  vendorType: "Manufacturer" | "Trader" | "Service Provider";
  website?: string;
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  gstNumber: string;
  panNumber: string;
  msmeNumber?: string;
  udyamNumber?: string;
  isoCertificates?: string;
  isoCertificatesName?: string;
  bankName: string;
  branchName: string;
  accountNumber: string;
  ifscCode: string;
  cancelledCheque?: string;
  cancelledChequeName?: string;
  rating: number;
  status: "Active" | "Inactive";
  productCategories?: string[];
  notes?: { id: string; text: string; date: string; author: string }[];
  additionalDocuments?: { id: string; name: string; uploadDate: string; type: string; data: string }[];
  documentVault?: {
    gstCertificate?: { name: string; uploadDate: string; data: string };
    msmeCertificate?: { name: string; uploadDate: string; data: string };
    isoCertificates?: { id: string; name: string; uploadDate: string; data: string }[];
    cancelledCheque?: { name: string; uploadDate: string; data: string };
  };
  ratings?: {
    deliveryTimeliness: number;
    quality: number;
    pricingConsistency: number;
    communication: number;
  };
  timeline?: {
    createdAt?: string;
    firstPODate?: string;
    lastDeliveryDate?: string;
    lastRatingUpdate?: string;
  };
}

interface VendorStore {
  vendors: Vendor[];
  addVendor: (vendor: Vendor) => void;
  updateVendor: (id: string, updatedVendor: Partial<Vendor>) => void;
  deleteVendor: (id: string) => void;
  getVendorById: (id: string) => Vendor | undefined;
  getActiveVendors: () => Vendor[];
}

export const useVendorStore = create<VendorStore>()(
  persist(
    (set, get) => ({
      vendors: [],

      addVendor: (vendor) =>
        set((state) => ({
          vendors: [...state.vendors, vendor],
        })),

      updateVendor: (id, updatedVendor) =>
        set((state) => ({
          vendors: state.vendors.map((v) =>
            v.id === id ? { ...v, ...updatedVendor } : v
          ),
        })),

      deleteVendor: (id) =>
        set((state) => ({
          vendors: state.vendors.filter((v) => v.id !== id),
        })),

      getVendorById: (id) => {
        return get().vendors.find((v) => v.id === id);
      },

      getActiveVendors: () => {
        return get().vendors.filter((v) => v.status === "Active");
      },
    }),
    {
      name: "vendors",
    }
  )
);
