"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

import useAuthStore from "@/store/authStore";

export default function AddProductPage() {

  const router = useRouter();

  const { user } = useAuthStore();

  // Redirect if not logged in
  useEffect(() => {

    if (!user) {

      alert("Please login first");

      router.push("/login");
    }

  }, [user, router]);

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "",
    condition: "",
    description: "",
    image: null,
  });

  // Handle input change
  const handleChange = (e) => {

    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle image upload
  const handleImageChange = (e) => {

    setFormData({
      ...formData,
      image: e.target.files[0],
    });
  };

  // Handle form submit
  const handleSubmit = async (e) => {

    e.preventDefault();

    console.log(formData);

    // Validation
    if (
      !formData.name ||
      !formData.price ||
      !formData.category ||
      !formData.condition ||
      !formData.image
    ) {

      alert("Please fill all required fields");

      return;
    }

    try {

      const productData = {
        name: formData.name,
        price: formData.price,
        category: formData.category,
        condition: formData.condition,
        description: formData.description,
        imageName: formData.image?.name,
      };

      const response = await fetch(
        "http://localhost:5000/api/products",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(productData),
        }
      );

      const data = await response.json();

      if (response.ok) {

        alert("Product submitted successfully");

        router.push("/");
      } else {

        alert(data.message);
      }

    } catch (error) {

      console.log(error);

      alert("Something went wrong");
    }
  };

  return (

    <main className="min-h-screen bg-slate-50">

      <Navbar />

      <section className="mx-auto max-w-3xl px-4 py-16">

        <div className="rounded-2xl bg-white p-8 shadow-md">

          <h1 className="text-3xl font-bold text-slate-900">
            Add Product
          </h1>

          <p className="mt-2 text-slate-600">
            Fill in product details to list your item.
          </p>

          <form
            onSubmit={handleSubmit}
            className="mt-8 space-y-5"
          >

            {/* Product Name */}
            <input
              type="text"
              name="name"
              placeholder="Product Name"
              onChange={handleChange}
              className="w-full rounded-lg border px-4 py-3"
            />

            {/* Price */}
            <input
              type="number"
              name="price"
              placeholder="Price"
              onChange={handleChange}
              className="w-full rounded-lg border px-4 py-3"
            />

            {/* Category Dropdown */}
            <select
              name="category"
              defaultValue=""
              onChange={handleChange}
              className="w-full rounded-lg border px-4 py-3"
            >

              <option value="" disabled>
                Select Category
              </option>

              <option value="Electronics">
                Electronics
              </option>

              <option value="Furniture">
                Furniture
              </option>

              <option value="Clothing">
                Clothing
              </option>

              <option value="Sports">
                Sports
              </option>

              <option value="Home & Garden">
                Home & Garden
              </option>

              <option value="Musical Instruments">
                Musical Instruments
              </option>

              <option value="Books">
                Books
              </option>

            </select>

            {/* Condition */}
            <input
              type="text"
              name="condition"
              placeholder="Condition"
              onChange={handleChange}
              className="w-full rounded-lg border px-4 py-3"
            />

            {/* Description */}
            <textarea
              name="description"
              placeholder="Description (Optional)"
              rows="4"
              onChange={handleChange}
              className="w-full rounded-lg border px-4 py-3"
            />

            {/* Image Upload */}
        <div className="w-full">
              
          <label
            className="
              flex cursor-pointer items-center justify-center
              rounded-lg border border-dashed
              border-slate-400 bg-slate-100
              px-4 py-6 text-slate-600
              hover:bg-slate-200
            "
          >

            {formData.image
              ? formData.image.name
              : "Upload Product Image or PDF"}

            <input
              type="file"
              accept="image/*,.pdf,.doc,.docx"
              onChange={handleImageChange}
              className="hidden"
            />

          </label>

        </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full rounded-lg bg-blue-700 py-3 font-semibold text-white hover:bg-blue-800"
            >
              Submit Product
            </button>

          </form>
        </div>
      </section>

      <Footer />

    </main>
  );
}