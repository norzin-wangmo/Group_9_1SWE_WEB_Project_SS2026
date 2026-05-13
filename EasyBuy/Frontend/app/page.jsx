import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import SectionTitle from "@/components/SectionTitle";
import ProductCard from "@/components/ProductCard";
import Footer from "@/components/Footer";
import { products } from "@/data/products";

export default function HomePage() {
  const featuredProducts = products.slice(0, 3);

  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />
      <Hero />

      <section className="mx-auto max-w-7xl px-4 py-16">
        <SectionTitle
          title="Featured Products"
          subtitle="Popular items listed by students on campus"
        />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}