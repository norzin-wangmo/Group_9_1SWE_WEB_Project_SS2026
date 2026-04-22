"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useProductStore } from "../../store/productStore";

export default function AddProduct() {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("All");

  const addProduct = useProductStore((state) => state.addProduct);
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();

    const newProduct = {
      id: Date.now(),
      title,
      price: Number(price),
      category,
      status: "PENDING", //  ADMIN APPROVAL SYSTEM
      seller: "Current User",
    };

    addProduct(newProduct);

    router.push("/");
  };

  return (
    <div>
      <h1>Add Product</h1>

      <form onSubmit={handleSubmit}>
        {/* PRODUCT NAME */}
        <input
          placeholder="Product Name"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        {/* PRICE */}
        <input
          placeholder="Price"
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />

        {/* CATEGORY */}
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="All">All</option>
          <option value="Electronic">Electronic</option>
          <option value="Furniture">Furniture</option>
          <option value="Clothing">Clothing</option>
          <option value="Sports">Sports</option>
          <option value="Musical Instrument">Musical Instrument</option>
          <option value="Home & Garden">Home & Garden</option>
          <option value="Books">Books</option>
        </select>

        {/* SUBMIT */}
        <button type="submit">Submit for Approval</button>
      </form>
    </div>
  );
}