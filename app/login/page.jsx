import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />

      <section className="mx-auto max-w-md px-4 py-16">
        <div className="rounded-2xl bg-white p-8 shadow-md">
          <h1 className="text-3xl font-bold text-slate-900">Login</h1>
          <p className="mt-2 text-slate-600">Login to manage your products.</p>

          <form className="mt-8 space-y-5">
            <input className="w-full rounded-lg border px-4 py-3" placeholder="Email" />
            <input className="w-full rounded-lg border px-4 py-3" placeholder="Password" type="password" />

            <button className="w-full rounded-lg bg-blue-700 py-3 font-semibold text-white hover:bg-blue-800">
              Login
            </button>
          </form>
        </div>
      </section>

      <Footer />
    </main>
  );
}