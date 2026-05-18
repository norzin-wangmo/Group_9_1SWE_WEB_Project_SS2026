"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import useAuthStore from "@/store/authStore";
import { createProduct, getCategories } from "@/lib/api";

export default function AddProductPage() {
  const router = useRouter();
  const { user } = useAuthStore();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    categoryId: "",
    description: "",
    imageUrl: "",
    stock: 1,
  });

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      alert("Please login first.");
      router.push("/login");
    }
  }, [user, router]);

  // Load categories from backend
  useEffect(() => {
    getCategories().then((data) => {
      if (data.categories) setCategories(data.categories);
    });
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.name || !formData.price) {
      setError("Product name and price are required.");
      return;
    }

    setLoading(true);
    try {
      const data = await createProduct({
        name: formData.name,
        price: parseFloat(formData.price),
        categoryId: formData.categoryId ? parseInt(formData.categoryId) : undefined,
        description: formData.description || undefined,
        imageUrl: formData.imageUrl || undefined,
        stock: parseInt(formData.stock) || 1,
      });

      if (data.product) {
        alert("Product listed successfully!");
        router.push("/products");
      } else {
        setError(data.message || "Failed to create product.");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />

      <section className="mx-auto max-w-3xl px-4 py-16">
        <div className="rounded-2xl bg-white p-8 shadow-md">
          <h1 className="text-3xl font-bold text-slate-900">Add Product</h1>
          <p className="mt-2 text-slate-600">Fill in product details to list your item.</p>

          {error && (
            <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
          )}

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">

            <input
              type="text"
              name="name"
              placeholder="Product Name"
              onChange={handleChange}
              required
              className="w-full rounded-lg border px-4 py-3"
            />

            <input
              type="number"
              name="price"
              placeholder="Price (Nu.)"
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              className="w-full rounded-lg border px-4 py-3"
            />

            <input
              type="number"
              name="stock"
              placeholder="Stock / Quantity"
              onChange={handleChange}
              min="0"
              defaultValue={1}
              className="w-full rounded-lg border px-4 py-3"
            />

            {/* Category from backend */}
            <select
              name="categoryId"
              defaultValue=""
              onChange={handleChange}
              className="w-full rounded-lg border px-4 py-3"
            >
              <option value="">Select Category (optional)</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>

            <textarea
              name="description"
              placeholder="Description (optional)"
              rows="4"
              onChange={handleChange}
              className="w-full rounded-lg border px-4 py-3"
            />

            <input
              type="url"
              name="imageUrl"
              placeholder="Image URL (optional)"
              onChange={handleChange}
              className="w-full rounded-lg border px-4 py-3"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-blue-700 py-3 font-semibold text-white hover:bg-blue-800 disabled:opacity-60"
            >
              {loading ? "Submitting..." : "Submit Product"}
            </button>
          </form>
        </div>
      </section>

      <Footer />
    </main>
  );
}