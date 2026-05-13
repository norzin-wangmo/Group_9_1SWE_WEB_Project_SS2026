"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import SearchBar from "@/components/SearchBar";
import SectionTitle from "@/components/SectionTitle";
import { products } from "@/data/products";

export default function ProductsPage() {
  const [search, setSearch] = useState("");

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase()) ||
    product.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />

      <section className="mx-auto max-w-7xl px-4 py-16">
        <SectionTitle
          title="Product Listing"
          subtitle="Search and browse products uploaded by students"
        />

        <SearchBar search={search} setSearch={setSearch} />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <p className="col-span-full text-center text-slate-500">
              No products found.
            </p>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}