import Link from "next/link";

export default function Hero() {
  return (
    <section className="bg-linear-to-r from-blue-700 to-indigo-700 text-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-20 md:grid-cols-2 md:items-center">
        <div>
          <h1 className="text-4xl font-bold md:text-5xl">
            Buy and Sell Easily Inside Campus
          </h1>
          <p className="mt-5 text-lg text-blue-100">
            EasyBuy is a student marketplace where students can list products,
            browse affordable items, and contact sellers safely.
          </p>

          <div className="mt-8 flex gap-4">
            <Link href="/products" className="rounded-lg bg-white px-5 py-3 font-semibold text-blue-700">
              Browse Products
            </Link>
            <Link href="/add-product" className="rounded-lg border border-white px-5 py-3 font-semibold">
              Add Product
            </Link>
          </div>
        </div>

        <div className="rounded-2xl bg-white/10 p-6 shadow-lg">
          <h2 className="text-2xl font-bold">Why EasyBuy?</h2>
          <ul className="mt-4 space-y-3 text-blue-100">
            <li>✓ Student-focused marketplace</li>
            <li>✓ Affordable second-hand products</li>
            <li>✓ Simple product listing</li>
            <li>✓ Responsive and user-friendly UI</li>
          </ul>
        </div>
      </div>
    </section>
  );
}