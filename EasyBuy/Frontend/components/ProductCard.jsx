import Image from "next/image";
import Link from "next/link";

const PLACEHOLDER = "https://placehold.co/800x520/e2e8f0/94a3b8?text=No+Image";

export default function ProductCard({ product }) {
  // Backend returns imageUrl; old hardcoded data used image — support both
  const imageSrc = product.imageUrl || product.image || PLACEHOLDER;

  // Backend returns category as an object { id, name } or plain string
  const categoryName =
    typeof product.category === "object" && product.category !== null
      ? product.category.name
      : product.category || "—";

  // Backend returns seller as { id, name } object
  const sellerName =
    typeof product.seller === "object" && product.seller !== null
      ? product.seller.name
      : product.seller || "—";

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-md transition hover:-translate-y-1 hover:shadow-xl">
      <div className="relative h-52">
        <Image
          fill
          src={imageSrc}
          alt={product.name}
          className="object-cover"
          unoptimized // allows external URLs without next.config domain whitelist
        />
      </div>

      <div className="p-5">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-slate-900">{product.name}</h3>
          <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700">
            Nu. {product.price}
          </span>
        </div>

        {product.description && (
          <p className="mt-2 line-clamp-2 text-sm text-slate-600">
            {product.description}
          </p>
        )}

        <div className="mt-4 space-y-1 text-sm text-slate-500">
          {categoryName !== "—" && <p>Category: {categoryName}</p>}
          {product.condition && <p>Condition: {product.condition}</p>}
          {sellerName !== "—" && <p>Seller: {sellerName}</p>}
          {product.stock !== undefined && (
            <p className={product.stock === 0 ? "text-red-500" : ""}>
              {product.stock === 0 ? "Out of stock" : `Stock: ${product.stock}`}
            </p>
          )}
        </div>

        <Link
          href={`/chat?userId=${product.sellerId || product.seller?.id || ""}&userName=${encodeURIComponent(sellerName)}`}
          className="mt-5 block w-full rounded-lg bg-blue-700 py-2 text-center font-semibold text-white hover:bg-blue-800"
        >
          Contact Seller
        </Link>
      </div>
    </div>
  );
}