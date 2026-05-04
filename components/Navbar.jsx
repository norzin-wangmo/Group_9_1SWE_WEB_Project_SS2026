import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-2xl font-bold text-blue-700">
          EasyBuy
        </Link>

        <div className="hidden gap-6 md:flex">
          <Link href="/" className="hover:text-blue-700">Home</Link>
          <Link href="/products" className="hover:text-blue-700">Products</Link>
          <Link href="/add-product" className="hover:text-blue-700">Add Product</Link>
          <Link href="/login" className="hover:text-blue-700">Login</Link>
        </div>

        <Link
          href="/add-product"
          className="rounded-lg bg-blue-700 px-4 py-2 text-white hover:bg-blue-800"
        >
          Sell Item
        </Link>
      </div>
    </nav>
  );
}