"use client";

import Link from "next/link";
import { useAuthStore } from "../store/authStore";

export default function Navbar() {
  const user = useAuthStore((state) => state.user);

  return (
    <nav style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
      <Link href="/">Home</Link>
      <Link href="/add-product">Add Product</Link>

      {!user ? (
        <>
          <Link href="/login">Login</Link>
          <Link href="/register">Register</Link>
        </>
      ) : (
        <p>Welcome, {user.name}</p>
      )}
    </nav>
  );
}