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

      {/* Logo */}
      <Link
        href="/"
        className="text-2xl font-bold text-blue-700"
      >
        EasyBuy
      </Link>

      {/* Middle Navigation */}
      <div className="flex items-center gap-5 text-sm font-medium">

        <Link href="/">
          Home
        </Link>

        <Link href="/products">
          Products
        </Link>

        <Link href="/products?category=Electronics">
          Electronics
        </Link>

        <Link href="/products?category=Furniture">
          Furniture
        </Link>

        <Link href="/products?category=Clothing">
          Clothing
        </Link>

        <Link href="/products?category=Sports">
          Sports
        </Link>

        <Link href="/products?category=Books">
          Books
        </Link>

      </div>

      {/* Right Side */}
      <div className="flex items-center gap-4">

        <button
          onClick={handleSellItem}
          className="rounded-lg bg-blue-700 px-4 py-2 text-white"
        >
          Sell Item
        </button>

        <Link
          href="/login"
          className="rounded-lg border px-4 py-2"
        >
          Login
        </Link>

      </div>

    </nav>
  );
}