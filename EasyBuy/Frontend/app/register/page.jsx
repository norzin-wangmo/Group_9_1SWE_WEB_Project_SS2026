"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { registerUser } from "@/lib/api";

export default function RegisterPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await registerUser(formData);

      if (!data.token) {
        setError(data.message || "Registration failed.");
        return;
      }

      alert("Registration successful! Please log in.");
      router.push("/login");
    } catch (err) {
      setError("Cannot connect to server. Make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />
      <section className="flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-md">
          <h1 className="text-3xl font-bold text-slate-900">Register</h1>

          {error && (
            <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              onChange={handleChange}
              required
              className="w-full rounded-lg border px-4 py-3"
            />
            <input
              type="email"
              name="email"
              placeholder="12345678.cst@rub.edu.bt"
              onChange={handleChange}
              required
              className="w-full rounded-lg border px-4 py-3"
            />
            <input
              type="password"
              name="password"
              placeholder="Password (min 6 characters)"
              onChange={handleChange}
              required
              className="w-full rounded-lg border px-4 py-3"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-blue-700 py-3 font-semibold text-white disabled:opacity-60"
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </form>

          <p className="mt-6 text-center text-slate-600">
            Already have an account?
            <Link href="/login" className="ml-2 font-semibold text-blue-700">
              Login
            </Link>
          </p>
        </div>
      </section>
      <Footer />
    </main>
  );
}
