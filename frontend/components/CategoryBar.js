"use client";

import { categories } from "../data/categories";
import { useProductStore } from "../store/productStore";

export default function CategoryBar() {
  const setCategory = useProductStore((state) => state.setCategory);

  return (
    <div style={{ display: "flex", gap: "10px" }}>
      {categories.map((cat) => (
        <button key={cat} onClick={() => setCategory(cat)}>
          {cat}
        </button>
      ))}
    </div>
  );
}