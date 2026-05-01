"use client";

import { useProductStore } from "../store/productStore";
import ProductCard from "../components/ProductCard";

export default function Home() {
  const products = useProductStore((state) => state.products);

  return (
    <div>
      <h1> EasyBuy Marketplace</h1>

      <div style={{
        display: "flex",
        gap: "20px",
        flexWrap: "wrap"
      }}>
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}