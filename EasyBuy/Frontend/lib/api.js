// lib/api.js
// Central place for all backend API calls.
// Every function reads the token from localStorage automatically.

const API_URL = "http://localhost:5000/api";

// ─── Helper ───────────────────────────────────────────────────────────────────
function authHeaders() {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export async function registerUser(data) {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function loginUser(data) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function getMe() {
  const res = await fetch(`${API_URL}/auth/me`, {
    headers: authHeaders(),
  });
  return res.json();
}

export async function updateMe(data) {
  const res = await fetch(`${API_URL}/auth/me`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  return res.json();
}

// ─── Products ─────────────────────────────────────────────────────────────────

export async function getProducts(params = {}) {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${API_URL}/products?${query}`);
  return res.json();
}

export async function getProductById(id) {
  const res = await fetch(`${API_URL}/products/${id}`);
  return res.json();
}

export async function getMyProducts() {
  const res = await fetch(`${API_URL}/products/user/my`, {
    headers: authHeaders(),
  });
  return res.json();
}

export async function createProduct(data) {
  const res = await fetch(`${API_URL}/products`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateProduct(id, data) {
  const res = await fetch(`${API_URL}/products/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteProduct(id) {
  const res = await fetch(`${API_URL}/products/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  return res.json();
}

// ─── Categories ───────────────────────────────────────────────────────────────

export async function getCategories() {
  const res = await fetch(`${API_URL}/categories`);
  return res.json();
}

// ─── Messages / Chat ──────────────────────────────────────────────────────────

export async function sendMessage(data) {
  const res = await fetch(`${API_URL}/messages`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function getInbox() {
  const res = await fetch(`${API_URL}/messages/inbox`, {
    headers: authHeaders(),
  });
  return res.json();
}

export async function getConversation(userId) {
  const res = await fetch(`${API_URL}/messages/conversation/${userId}`, {
    headers: authHeaders(),
  });
  return res.json();
}

export async function getUnreadMessageCount() {
  const res = await fetch(`${API_URL}/messages/unread-count`, {
    headers: authHeaders(),
  });
  return res.json();
}

// ─── Notifications ────────────────────────────────────────────────────────────

export async function getNotifications(params = {}) {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${API_URL}/notifications?${query}`, {
    headers: authHeaders(),
  });
  return res.json();
}

export async function getUnreadNotificationCount() {
  const res = await fetch(`${API_URL}/notifications/unread-count`, {
    headers: authHeaders(),
  });
  return res.json();
}

export async function markNotificationRead(id) {
  const res = await fetch(`${API_URL}/notifications/${id}/read`, {
    method: "PATCH",
    headers: authHeaders(),
  });
  return res.json();
}

export async function markAllNotificationsRead() {
  const res = await fetch(`${API_URL}/notifications/read-all`, {
    method: "PATCH",
    headers: authHeaders(),
  });
  return res.json();
}

// ─── Payments ─────────────────────────────────────────────────────────────────

export async function createPayment(data) {
  const res = await fetch(`${API_URL}/payments`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function getMyPayments() {
  const res = await fetch(`${API_URL}/payments`, {
    headers: authHeaders(),
  });
  return res.json();
}

// ─── Approvals ────────────────────────────────────────────────────────────────

export async function submitUploadRequest(data) {
  const res = await fetch(`${API_URL}/approvals/request`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function getMyUploadRequests() {
  const res = await fetch(`${API_URL}/approvals/my-requests`, {
    headers: authHeaders(),
  });
  return res.json();
}

// ─── Admin ────────────────────────────────────────────────────────────────────

export async function getPendingRequests() {
  const res = await fetch(`${API_URL}/approvals/pending`, {
    headers: authHeaders(),
  });
  return res.json();
}

export async function reviewUploadRequest(requestId, data) {
  const res = await fetch(`${API_URL}/approvals/${requestId}/review`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function getAllPaymentsAdmin() {
  const res = await fetch(`${API_URL}/payments/admin/all`, {
    headers: authHeaders(),
  });
  return res.json();
}