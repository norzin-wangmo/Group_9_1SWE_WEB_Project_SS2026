"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function RegisterPage() {

  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {

    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const response = await fetch(
        "http://localhost:5000/api/auth/register",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      console.log(data);

      if (!response.ok) {

        alert(data.message);

        return;
      }

      alert("Registration successful");

      router.push("/login");

    } catch (error) {

      console.log(error);

      alert("Server connection failed");
    }
  };

  return (

    <main className="min-h-screen bg-slate-50">

      <Navbar />

      <section className="flex items-center justify-center px-4 py-16">

        <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-md">

          <h1 className="text-3xl font-bold text-slate-900">
            Register
          </h1>

          <form
            onSubmit={handleSubmit}
            className="mt-8 space-y-5"
          >

            <input
              type="text"
              name="name"
              placeholder="Full Name"
              onChange={handleChange}
              className="w-full rounded-lg border px-4 py-3"
            />

            <input
              type="email"
              name="email"
              placeholder="12345678.cst@rub.edu.bt"
              onChange={handleChange}
              className="w-full rounded-lg border px-4 py-3"
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              className="w-full rounded-lg border px-4 py-3"
            />

            <button
              type="submit"
              className="
                w-full rounded-lg
                bg-blue-700 py-3
                font-semibold text-white
              "
            >
              Register
            </button>

          </form>

          <p className="mt-6 text-center text-slate-600">

            Already have an account?

            <Link
              href="/login"
              className="ml-2 font-semibold text-blue-700"
            >
              Login
            </Link>

          </p>

        </div>

      </section>

      <Footer />

    </main>
  );
}