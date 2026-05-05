"use client";

import CategoryBar from "../components/CategoryBar";
import ProductCard from "../components/ProductCard";
import { useProductStore } from "../store/productStore";

export default function Home() {
  const products = useProductStore((state) => 
    state.getFilteredProducts());

  return (
    <div>
      <h1>EasyBuy Marketplace</h1>

      <CategoryBar/>

      <div>
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}