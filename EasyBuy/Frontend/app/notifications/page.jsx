"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import useAuthStore from "@/store/authStore";
import { getNotifications, markNotificationRead, markAllNotificationsRead } from "@/lib/api";

export default function NotificationsPage() {
  const router = useRouter();
  const { user } = useAuthStore();

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }
    fetchNotifications();
  }, [user]);

  const fetchNotifications = async () => {
    setLoading(true);
    const data = await getNotifications();
    if (data.notifications) setNotifications(data.notifications);
    setLoading(false);
  };

  const handleMarkRead = async (id) => {
    await markNotificationRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const handleMarkAllRead = async () => {
    await markAllNotificationsRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const typeColors = {
    PRODUCT_APPROVED: "bg-green-100 text-green-700",
    PRODUCT_REJECTED: "bg-red-100 text-red-700",
    PAYMENT_RECEIVED: "bg-blue-100 text-blue-700",
    MESSAGE: "bg-purple-100 text-purple-700",
    SYSTEM: "bg-slate-100 text-slate-700",
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />

      <section className="mx-auto max-w-3xl px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Notifications</h1>
          {notifications.some((n) => !n.isRead) && (
            <button
              onClick={handleMarkAllRead}
              className="rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800"
            >
              Mark all as read
            </button>
          )}
        </div>

        {loading && <p className="text-slate-500">Loading...</p>}

        {!loading && notifications.length === 0 && (
          <p className="text-slate-500">No notifications yet.</p>
        )}

        <div className="space-y-3">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              className={`rounded-xl p-4 shadow-sm ${notif.isRead ? "bg-white" : "bg-blue-50 border border-blue-200"}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <span className={`mb-1 inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${typeColors[notif.type] || typeColors.SYSTEM}`}>
                    {notif.type.replace(/_/g, " ")}
                  </span>
                  <p className="font-semibold text-slate-900">{notif.title}</p>
                  <p className="mt-1 text-sm text-slate-600">{notif.body}</p>
                  <p className="mt-1 text-xs text-slate-400">
                    {new Date(notif.createdAt).toLocaleString()}
                  </p>
                </div>
                {!notif.isRead && (
                  <button
                    onClick={() => handleMarkRead(notif.id)}
                    className="shrink-0 rounded-lg border border-blue-300 px-3 py-1 text-xs text-blue-700 hover:bg-blue-100"
                  >
                    Mark read
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}