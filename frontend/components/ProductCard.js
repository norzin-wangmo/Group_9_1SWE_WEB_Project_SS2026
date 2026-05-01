"use client";

import Link from "next/link";

export default function ProductCard({ product }) {
  return (
    <div style={{
      border: "1px solid #eee",
      borderRadius: "10px",
      padding: "10px",
      width: "250px"
    }}>
      
      {/* Image */}
      <img
        src={product.image}
        alt={product.title}
        style={{
          width: "100%",
          borderRadius: "10px"
        }}
      />

      {/* Title + Price */}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h4>{product.title}</h4>
        <p style={{ color: "blue" }}>Nu.{product.price}</p>
      </div>

      {/* Seller + time */}
      <p>{product.seller}</p>
      <p style={{ color: "gray" }}>{product.time}</p>
    </div>
  );
}