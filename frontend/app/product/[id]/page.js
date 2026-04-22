"use client";

import { useParams } from "next/navigation";
import { useProductStore } from "../../../store/productStore";

export default function ProductDetails() {
  const { id } = useParams();
  const getProductById = useProductStore((state) => state.getProductById);

  const product = getProductById(id);

  if (!product) return <p>Product not found</p>;

  return (
    <div>
      <h1>{product.title}</h1>
      <p>Price: {product.price}</p>
      <p>Status: {product.status}</p>
      <p>Seller: {product.seller}</p>
      <p>Category: {product.category}</p>
    </div>
  );
}