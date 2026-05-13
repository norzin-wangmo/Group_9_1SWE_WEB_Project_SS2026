export default function SearchBar({ search, setSearch }) {
  return (
    <div className="mx-auto mb-8 max-w-2xl">
      <input
        type="text"
        placeholder="Search products..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full rounded-xl border border-slate-300 px-5 py-3 outline-none focus:border-blue-600"
      />
    </div>
  );
}