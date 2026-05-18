"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { getProducts } from "@/lib/api";

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const category = searchParams.get("category");

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError("");
      try {
        const params = {};
        if (category) params.category = category;

        const data = await getProducts(params);

        if (data.products) {
          setProducts(data.products);
        } else {
          setError("Failed to load products.");
        }
      } catch (err) {
        setError("Cannot connect to server.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category]);

  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />

      <section className="mx-auto max-w-7xl px-4 py-16">
        <h1 className="mb-8 text-3xl font-bold text-slate-900">
          {category ? `${category} Products` : "All Products"}
        </h1>

        {loading && (
          <p className="text-slate-500">Loading products...</p>
        )}

        {error && (
          <p className="rounded-lg bg-red-50 px-4 py-3 text-red-600">{error}</p>
        )}

        {!loading && !error && products.length === 0 && (
          <p className="text-slate-500">No products found.</p>
        )}

        {!loading && products.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}