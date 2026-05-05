import { create } from "zustand";
import { dummyProducts } from "../data/dummyData";

export const useProductStore = create((set, get) => ({
  products: dummyProducts,
  selectedCategory: "All",

  setCategory: (category) => set({ selectedCategory: category }),

  getFilteredProducts: () => {
    const { products, selectedCategory } = get();

    if (selectedCategory === "All") return products;

    return products.filter(
      (p) => p.category === selectedCategory
    );
  }
}));