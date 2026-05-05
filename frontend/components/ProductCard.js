"use client";

import Link from "next/link";

export default function ProductCard({ product }) {
  return (
    <div className="card">
      <img src={product.image} />

      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h3>{product.title}</h3>
        <p style={{ color: "blue" }}>Nu.{product.price}</p>
      </div>

      <p>{product.seller}</p>
    </div>
  );
}