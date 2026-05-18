# Backend 
---

## What's included

| File | Purpose |
|---|---|
| `prisma/schema.prisma` | **Replace** your existing schema — adds 4 new tables + 3 enums |
| `src/controllers/notificationController.js` | New |
| `src/controllers/paymentController.js` | New |
| `src/controllers/approvalController.js` | New |
| `src/routes/notificationRoutes.js` | New |
| `src/routes/paymentRoutes.js` | New |
| `src/routes/approvalRoutes.js` | New |
| `src/validation/schemas.js` | **Replace** — adds 3 new Zod schemas |
| `src/server.js` | **Replace** — registers 3 new route groups |

---

## New database tables

| Table | Description |
|---|---|
| `notifications` | In-app notifications per user (type, title, body, isRead, link) |
| `payments` | Payment records for listing/upload fees |
| `upload_requests` | Seller submits a request to publish a product |
| `admin_reviews` | Admin approve/reject decision linked to an upload request |

---

## How to apply

1. Copy all files into your `EasyBuy/Backend/` folder, replacing files where noted above.

2. Run the Prisma migration:
   ```bash
   npx prisma migrate dev --name add_notifications_payments_approvals
   ```

3. Regenerate the Prisma client:
   ```bash
   npx prisma generate
   ```

4. Restart your dev server:
   ```bash
   npm run dev
   ```

---

## API Endpoints added

### Notifications  `/api/notifications`
| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/` | User | Get my notifications (supports `?unreadOnly=true&page=1&limit=20`) |
| GET | `/unread-count` | User | Count of unread notifications |
| PATCH | `/read-all` | User | Mark all notifications as read |
| PATCH | `/:id/read` | User | Mark one notification as read |
| DELETE | `/:id` | User | Delete a notification |

### Payments  `/api/payments`
| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/` | User | Record a payment (listing fee) |
| GET | `/` | User | My payment history (supports `?status=COMPLETED`) |
| GET | `/admin/all` | Admin | All payments across all users |
| GET | `/:id` | User/Admin | Single payment detail |

### Approvals  `/api/approvals`
| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/request` | User | Submit upload request for a product |
| GET | `/my-requests` | User | My upload requests + status |
| GET | `/pending` | Admin | All PENDING requests (review queue) |
| GET | `/all` | Admin | All requests with optional filters |
| POST | `/:requestId/review` | Admin | Approve or reject a request |
| GET | `/:requestId` | User/Admin | Single request detail |

---

## Typical seller workflow

1. Seller creates a product (`POST /api/products`)
2. Seller submits upload request (`POST /api/approvals/request` with `productId`)
3. Seller pays listing fee (`POST /api/payments` with `uploadRequestId`)
4. Admin reviews queue (`GET /api/approvals/pending`)
5. Admin approves/rejects (`POST /api/approvals/:requestId/review`)
6. Seller receives a notification automatically
