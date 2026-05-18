"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import useAuthStore from "@/store/authStore";
import { getPendingRequests, reviewUploadRequest, getAllPaymentsAdmin } from "@/lib/api";

export default function AdminPage() {
  const router = useRouter();
  const { user } = useAuthStore();

  const [tab, setTab] = useState("approvals");
  const [requests, setRequests] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    if (!user) { router.push("/login"); return; }
    if (user.role !== "ADMIN") { router.push("/"); return; }
    loadData();
  }, [user]);

  const loadData = async () => {
    setLoading(true);
    const [reqData, payData] = await Promise.all([
      getPendingRequests(),
      getAllPaymentsAdmin(),
    ]);
    if (reqData.uploadRequests) setRequests(reqData.uploadRequests);
    if (payData.payments) setPayments(payData.payments);
    setLoading(false);
  };

  const handleReview = async (requestId, decision) => {
    const reason = decision === "REJECTED"
      ? prompt("Reason for rejection (optional):") || ""
      : "";

    setActionLoading(requestId);
    const data = await reviewUploadRequest(requestId, { decision, reason });
    if (data.uploadRequest) {
      setRequests((prev) => prev.filter((r) => r.id !== requestId));
      alert(`Request ${decision.toLowerCase()} successfully.`);
    } else {
      alert(data.message || "Action failed.");
    }
    setActionLoading(null);
  };

  const statusBadge = (status) => {
    const colors = {
      COMPLETED: "bg-green-100 text-green-700",
      PENDING: "bg-yellow-100 text-yellow-700",
      FAILED: "bg-red-100 text-red-700",
      REFUNDED: "bg-slate-100 text-slate-600",
    };
    return (
      <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${colors[status] || colors.PENDING}`}>
        {status}
      </span>
    );
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />

      <section className="mx-auto max-w-6xl px-4 py-16">
        <h1 className="mb-8 text-3xl font-bold text-slate-900">Admin Dashboard</h1>

        {/* Tabs */}
        <div className="mb-6 flex gap-2">
          <button
            onClick={() => setTab("approvals")}
            className={`rounded-lg px-5 py-2 text-sm font-semibold ${tab === "approvals" ? "bg-blue-700 text-white" : "bg-white text-slate-700 border"}`}
          >
            Pending Approvals ({requests.length})
          </button>
          <button
            onClick={() => setTab("payments")}
            className={`rounded-lg px-5 py-2 text-sm font-semibold ${tab === "payments" ? "bg-blue-700 text-white" : "bg-white text-slate-700 border"}`}
          >
            All Payments ({payments.length})
          </button>
        </div>

        {loading && <p className="text-slate-500">Loading...</p>}

        {/* Approvals tab */}
        {!loading && tab === "approvals" && (
          <div className="space-y-4">
            {requests.length === 0 && (
              <p className="text-slate-500">No pending requests. 🎉</p>
            )}
            {requests.map((req) => (
              <div key={req.id} className="rounded-2xl bg-white p-6 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold text-slate-900">{req.product?.name}</p>
                    <p className="text-sm text-slate-500">
                      Seller: {req.user?.name} ({req.user?.email})
                    </p>
                    <p className="text-sm text-slate-500">
                      Price: Nu. {req.product?.price} · Stock: {req.product?.stock}
                    </p>
                    {req.note && (
                      <p className="mt-2 rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-600">
                        Note: {req.note}
                      </p>
                    )}
                    <p className="mt-1 text-xs text-slate-400">
                      Submitted: {new Date(req.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <button
                      disabled={actionLoading === req.id}
                      onClick={() => handleReview(req.id, "APPROVED")}
                      className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-60"
                    >
                      Approve
                    </button>
                    <button
                      disabled={actionLoading === req.id}
                      onClick={() => handleReview(req.id, "REJECTED")}
                      className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Payments tab */}
        {!loading && tab === "payments" && (
          <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-6 py-3">User</th>
                  <th className="px-6 py-3">Amount</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Description</th>
                  <th className="px-6 py-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {payments.map((pay) => (
                  <tr key={pay.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <p className="font-medium text-slate-800">{pay.user?.name}</p>
                      <p className="text-xs text-slate-400">{pay.user?.email}</p>
                    </td>
                    <td className="px-6 py-4 font-semibold">Nu. {pay.amount.toFixed(2)}</td>
                    <td className="px-6 py-4">{statusBadge(pay.status)}</td>
                    <td className="px-6 py-4 text-slate-500">{pay.description || "—"}</td>
                    <td className="px-6 py-4 text-slate-400 text-xs">
                      {new Date(pay.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
                {payments.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-slate-400">
                      No payments yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}