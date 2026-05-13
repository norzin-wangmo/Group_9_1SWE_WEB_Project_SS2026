import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function AddProductPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />

      <section className="mx-auto max-w-3xl px-4 py-16">
        <div className="rounded-2xl bg-white p-8 shadow-md">
          <h1 className="text-3xl font-bold text-slate-900">Add Product</h1>
          <p className="mt-2 text-slate-600">
            Fill in product details to list an item for sale.
          </p>

          <form className="mt-8 space-y-5">
            <input className="w-full rounded-lg border px-4 py-3" placeholder="Product name" />
            <input className="w-full rounded-lg border px-4 py-3" placeholder="Price" />
            <input className="w-full rounded-lg border px-4 py-3" placeholder="Category" />
            <input className="w-full rounded-lg border px-4 py-3" placeholder="Condition" />
            <input className="w-full rounded-lg border px-4 py-3" placeholder="Location" />
            <textarea className="w-full rounded-lg border px-4 py-3" placeholder="Description" rows="4" />

            <button className="w-full rounded-lg bg-blue-700 py-3 font-semibold text-white hover:bg-blue-800">
              Submit Product
            </button>
          </form>
        </div>
      </section>

      <Footer />
    </main>
  );
}