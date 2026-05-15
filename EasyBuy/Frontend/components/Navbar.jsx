"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import useAuthStore from "@/store/authStore";

export default function Navbar() {

  const router = useRouter();

  const { user } = useAuthStore();

  const handleSellItem = () => {

    if (!user) {

      const confirmLogin = window.confirm(
        "You need to login or register first to add a product."
      );

      if (confirmLogin) {
        router.push("/login");
      }

      return;
    }

    router.push("/add-product");
  };

  return (

    <nav className="flex items-center justify-between border-b bg-white px-6 py-4">

      {/* Left Logo */}
      <Link
        href="/"
        className="text-2xl font-bold text-blue-700"
      >
        EasyBuy
      </Link>

      {/* Middle Categories */}
      <div className="flex items-center gap-6 text-sm font-medium">

        <Link
          href="/products"
          className="transition hover:text-blue-700 hover:underline"
        >
          All
        </Link>

        <Link
          href="/products?category=Electronics"
          className="transition hover:text-blue-700 hover:underline"
        >
          Electronics
        </Link>

        <Link
          href="/products?category=Furniture"
          className="transition hover:text-blue-700 hover:underline"
        >
          Furniture
        </Link>

        <Link
          href="/products?category=Clothing"
          className="transition hover:text-blue-700 hover:underline"
        >
          Clothing
        </Link>

        <Link
          href="/products?category=Sports"
          className="transition hover:text-blue-700 hover:underline"
        >
          Sports
        </Link>

        <Link
          href="/products?category=Books"
          className="transition hover:text-blue-700 hover:underline"
        >
          Books
        </Link>

      </div>

      {/* Right Side */}
      <div className="flex items-center gap-4">

        <button
          onClick={handleSellItem}
          className="
            rounded-lg bg-blue-700 px-4 py-2 text-white
            transition hover:bg-blue-800
          "
        >
          Sell Item
        </button>

        <Link
          href="/login"
          className="
            rounded-lg border px-4 py-2
            transition hover:bg-slate-100
          "
        >
          Login
        </Link>

      </div>

    </nav>
  );
}