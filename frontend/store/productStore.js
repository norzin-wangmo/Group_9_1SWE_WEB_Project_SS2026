import { create } from "zustand";
import { dummyProducts } from "../data/dummyData";

export const useProductStore = create((set, get) => ({
  products: dummyProducts,

  addProduct: (newProduct) => {
    set((state) => ({
      products: [...state.products, newProduct],
    }));
  },

  getProductById: (id) => {
    return get().products.find((p) => p.id === Number(id));
  },
}));