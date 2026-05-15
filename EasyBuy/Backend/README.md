# EasyBuy Backend API

Node.js + Express + PostgreSQL (Prisma) + JWT Authentication

---

## 📁 Project Structure

```
easybuy-backend/
├── prisma/
│   ├── schema.prisma        # Database models
│   └── seed.js              # Sample data seeder
├── src/
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── productController.js
│   │   └── messageController.js
│   ├── middleware/
│   │   ├── authMiddleware.js   # JWT protect + adminOnly
│   │   └── errorMiddleware.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js
│   │   └── messageRoutes.js
│   ├── utils/
│   │   ├── prisma.js          # Prisma client singleton
│   │   └── jwt.js             # Token helpers
│   └── server.js
├── .env.example
├── .gitignore
└── package.json
```

---

## ⚙️ Setup Instructions

### 1. Prerequisites
- Node.js v18+
- PostgreSQL installed and running

### 2. Install dependencies
```bash
cd EasyBuy/Backend
npm install
```

### 3. Configure environment
```bash
# Copy the example file
cp .env.example .env
```

Edit `.env` with your PostgreSQL credentials:
```env
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/easybuy_db"
JWT_SECRET="any_long_random_secret_string_here"
JWT_EXPIRES_IN="7d"
PORT=5000
CLIENT_URL="http://localhost:3000"
```

### 4. Create the database
In psql or pgAdmin, create the database:
```sql
CREATE DATABASE easybuy_db;
```

### 5. Run Prisma migrations
```bash
npm run db:generate   # Generate Prisma client
npm run db:migrate    # Apply schema to database (name: init)
```

### 6. (Optional) Seed sample data
```bash
npm run db:seed
```
This creates:
- Admin: `admin@easybuy.com` / `admin123`
- User:  `user@easybuy.com`  / `user123`
- 3 sample products + 1 message

### 7. Start the server
```bash
npm run dev     # Development (auto-restarts with nodemon)
npm start       # Production
```

Server runs at: `http://localhost:5000`

---

## 🔌 API Endpoints

### Auth — `/api/auth`
| Method | Endpoint       | Auth | Description         |
|--------|---------------|------|---------------------|
| POST   | `/register`   | No   | Create account      |
| POST   | `/login`      | No   | Login, get token    |
| GET    | `/me`         | Yes  | Get my profile      |
| PUT    | `/me`         | Yes  | Update name/password|

### Products — `/api/products`
| Method | Endpoint       | Auth | Description               |
|--------|---------------|------|---------------------------|
| GET    | `/`           | No   | List all (with filters)   |
| GET    | `/:id`        | No   | Get single product        |
| GET    | `/user/my`    | Yes  | My listed products        |
| POST   | `/`           | Yes  | Create product            |
| PUT    | `/:id`        | Yes  | Update product (owner)    |
| DELETE | `/:id`        | Yes  | Delete product (owner)    |

**Query params for GET /:** `?category=Electronics&search=phone&minPrice=10&maxPrice=100&page=1&limit=12`

### Messages — `/api/messages` (all require auth)
| Method | Endpoint                  | Description               |
|--------|--------------------------|---------------------------|
| POST   | `/`                      | Send a message            |
| GET    | `/inbox`                 | My received messages      |
| GET    | `/sent`                  | My sent messages          |
| GET    | `/unread-count`          | Count of unread messages  |
| GET    | `/conversation/:userId`  | Full chat with a user     |
| DELETE | `/:id`                   | Delete a sent message     |

---

## 🔐 Using JWT in Frontend

After login/register, store the token and send it in every protected request:

```js
// After login
const { token } = await res.json();
localStorage.setItem('token', token);

// For protected requests
fetch('http://localhost:5000/api/products', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`,
  },
  body: JSON.stringify({ name: 'My Product', price: 29.99 }),
});
```

---

## 🛠️ Useful Commands

```bash
npm run db:studio    # Open Prisma Studio (visual DB browser)
npm run db:migrate   # Apply new schema changes
```
