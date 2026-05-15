"use client";

import { useSearchParams } from "next/navigation";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";

import { products } from "@/data/products";

export default function ProductsPage() {

  const searchParams = useSearchParams();

  const category = searchParams.get("category");

  // Filter products
  const filteredProducts = category
    ? products.filter(
        (product) =>
          product.category === category
      )
    : products;

  return (

    <main className="min-h-screen bg-slate-50">

      <Navbar />

      <section className="mx-auto max-w-7xl px-4 py-16">

        <h1 className="mb-8 text-3xl font-bold text-slate-900">

          {category
            ? `${category} Products`
            : "All Products"}

        </h1>

        {filteredProducts.length === 0 ? (

          <p>No products found.</p>

        ) : (

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

            {filteredProducts.map((product) => (

              <ProductCard
                key={product.id}
                product={product}
              />

            ))}

          </div>

        )}

      </section>

      <Footer />

    </main>
  );
}