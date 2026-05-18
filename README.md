## Team Role: (Frontend Logic, Routing and State Management) Person 2

### Responsibility:

Frontend Logic, Routing, State Management and Frontend–Backend Integration

## Overview

- EasyBuy is a web-based marketplace platform developed for CST/RUB students to buy and sell products within the campus community. The system allows users to register using college email accounts, login securely, browse products by category, and upload products for selling.

- My responsibility in the project focused on frontend logic, application routing, state management, authentication flow, and frontend-backend API integration.

---

## Technologies Used

- Next.js
- React.js
- Tailwind CSS
- Zustand
- Fetch API
- Node.js Backend APIs

---

## Main Responsibilities Completed

## 1. Frontend Routing

 Implemented routing and navigation for multiple pages using Next.js App Router.

### Routes Managed
* `/`
* `/login`
* `/register`
* `/products`
* `/add-product`

### Features
- Navigation between pages
- Dynamic category filtering using query parameters
- Redirect users to login page before allowing product uploads

## 2. Authentication State Management
- Implemented frontend authentication handling using Zustand.

### Features
* Store logged-in user data
* Manage login state
* Protect add-product page access
* Redirect unauthenticated users

### Zustand Store
Created a centralized auth store to manage:
* current user
* login state
* logout functionality

## 3. Frontend and Backend API Integration
Connected frontend forms to backend authentication APIs.

### Connected APIs

| API Endpoint | Purpose |
|------|------|
| `api/auth/register` | Register new users |
| `/api/auth/login` | User login |

### Implemented Features
* Send POST requests using Fetch API
* Handle backend responses
* Display success and error messages
* Redirect users after successful login

## 4. Category Navigation and Filtering
Implemented category-based product filtering.

### Categories Added
* All
* Electronics
* Furniture
* Clothing
* Sports
* Books

### Features
* Navbar category navigation
* Query-based filtering
* Dynamic product rendering

## 5. Protected Product Upload Flow
Implemented protected navigation for product uploading.

### Features
* Users must login before adding products
* Alert message for unauthenticated users
* Automatic redirect to login page

## 6. Product Upload Form Logic
Implemented frontend logic for the Add Product form.

### Form Fields
* Product Name
* Price
* Category 
* Condition
* Description
* File Upload

### Validation
* Required field validation
* Form submission handling
* FormData integration for backend uploads

## Challenges Faced

### Backend Connection Issues
Initially, the frontend could not connect properly with backend authentication APIs due to:
* missing dependencies
* CORS configuration
* missing environment variables

### Solution
* installed required packages
* configured backend CORS
* added .env variables
* corrected frontend fetch requests

### Category Filtering Issues
* Product filtering initially failed because category names in product data did not exactly match navbar category names.

### Solution
Updated category names to ensure consistent filtering.

## Learning Outcomes
Through this project, I learned:
* Next.js routing
* frontend state management using Zustand
* frontend and backend integration
* handling API requests
* protected routing
* dynamic filtering
* responsive UI improvements
* debugging frontend/backend connection issues

## Conclusion

My role in the project focused on frontend logic, routing, authentication state management, and frontend-backend integration. The implemented features successfully provide secure login flow, protected product uploading, category-based browsing, and responsive navigation for the EasyBuy marketplace platform.