"use client";

import Link from "next/link";

export default function ProductCard({ product }) {
  return (
    <div style={{ border: "1px solid gray", padding: "10px", margin: "10px" }}>
      <Link href={`/product/${product.id}`}>
        <h3>{product.title}</h3>
      </Link>
      <p>Price: {product.price}</p>
      <p>Status: {product.status}</p>
    </div>
  );
}