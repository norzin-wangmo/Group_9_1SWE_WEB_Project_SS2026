import Image from "next/image";
export default function ProductCard({ product }) {
  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-md transition hover:-translate-y-1 hover:shadow-xl">
      <div className="relative h-52">
        <Image
          fill
          src={product.image}
          alt={product.name}
          className="object-cover"
        />
      </div>

      <div className="p-5">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-slate-900">{product.name}</h3>
          <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700">
            Nu. {product.price}
          </span>
        </div>

        <p className="mt-2 text-sm text-slate-600">{product.description}</p>

        <div className="mt-4 space-y-1 text-sm text-slate-500">
          <p>Category: {product.category}</p>
          <p>Condition: {product.condition}</p>
          <p>Location: {product.location}</p>
          <p>Seller: {product.seller}</p>
        </div>

        <button className="mt-5 w-full rounded-lg bg-blue-700 py-2 font-semibold text-white hover:bg-blue-800">
          Contact Seller
        </button>
      </div>
    </div>
  );
}