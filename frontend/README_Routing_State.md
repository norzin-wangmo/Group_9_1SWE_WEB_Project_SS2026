# Routing and State Management (Person 2)

## Routing
We implemented Next.js App Router with the following routes:
- Home (/)
- Product Details (/product/[id])
- Add Product (/add-product)
- Login (/login)

## State Management
We used Zustand for global state.

### Product Store
- products → stores all product data
- addProduct() → adds new product
- getProductById() → fetches product by ID

### Auth Store
- user → current logged-in user
- login() → sets user
- logout() → removes user

## Data Flow
User interacts with UI → Zustand updates state → components re-render automatically.

## Key Advantage
Zustand simplifies state management without complex boilerplate like Redux.