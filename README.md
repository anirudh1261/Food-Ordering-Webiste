# 🍔 CraveCraft — Full-Stack Food Ordering System

A complete, production-grade, responsive Food Ordering System built with **React.js**, **Tailwind CSS**, **Node.js**, **Express.js**, and **MongoDB**. Designed with a modern, clean, minimal aesthetic featuring warm cream backgrounds, coral/orange accents, smooth transitions, and a complete suite of customer and admin features.

---

## 🌟 Key Features

### 👤 Customer Experience
* **Home Page**:
  * Modern hero section with culinary photography and tagline: *"Delicious Food, Delivered To Your Door."*
  * Search bar for dishes, ingredients, and categories.
  * Interactive category browser with smooth navigation.
  * Popular & trending dishes grid with one-click cart additions.
  * Best-selling restaurants & curated kitchens showcase.
  * Special offers & discount coupons with one-click code application.
  * Customer reviews and testimonials.
  * Full-featured navigation and footer.
* **Food Menu Page**:
  * Rich food cards with zoom effects, descriptions, prices, veg/non-veg indicators, prep times, and ratings.
  * Instant category filter pills.
  * Veg-only and Non-veg dietary filters.
  * Real-time search query filtering.
  * Sorting options (Popularity, Price: Low to High, Price: High to Low, Highest Rated).
  * In-card quantity stepper `[-] [count] [+]` for quick cart adjustments.
* **Food Details Page**:
  * Large image presentation with zoom.
  * Dietary indicators, calorie count, preparation time, and hygiene guarantee.
  * Dynamic quantity selector and price calculation.
  * Related food recommendations from the same culinary category.
* **Shopping Cart**:
  * Persistent cart saved in `localStorage`.
  * Quantity increment/decrement and item removal.
  * Dynamic subtotal, tax (5%), and delivery fee calculation (Free above $30).
  * Working coupon system (`CRAVE30` for 30% off, `FREESHIP` for free delivery, `PIZZALOVE` for $5 off).
  * Illustrated empty state with a *"Browse Menu"* call-to-action.
* **Checkout & Payment**:
  * Pre-fills name, phone, and delivery address from profile.
  * Delivery instructions / notes input.
  * Payment options: **Cash on Delivery** and **Simulated Online Payment (Card / UPI)**.
  * Order summary breakdown and confirmation.
* **Live Order Tracking & Confirmation**:
  * Interactive 5-stage status stepper:
    `Order Placed` ➔ `Confirmed` ➔ `In Kitchen (Preparing)` ➔ `On The Way (Out for Delivery)` ➔ `Delivered`.
  * Order ID reference, timestamp, delivery details, and items summary.
* **Order History ("My Orders")**:
  * View past orders with live status badges.
  * One-click **Reorder** button to instantly reload items into cart.
* **User Authentication**:
  * JWT-based authentication with bcrypt password hashing.
  * User profile management (update name, phone, delivery address).
  * **Instant Demo Login**: 1-click login for Customer (`john@example.com`) and Admin (`admin@foodie.com`).

---

### 🛡️ Admin Dashboard (`/admin`)
* **Professional Sidebar Layout**: Quick switching between overview, orders, foods, categories, and customers.
* **Dashboard Overview**:
  * Metric cards: Total Revenue, Total Orders, Total Customers, Total Menu Products.
  * Visual Charts (Recharts): Weekly Revenue Trends area chart and Cuisine Category distribution.
  * Live orders table with instant inline status updater.
* **Menu Dishes Management (`/admin/foods`)**:
  * Add new food items with name, price, category, image URL, description, prep time, veg/non-veg, and availability.
  * Edit existing food items.
  * Delete food items with modal confirmation.
  * Instant "In Stock" / "Sold Out" availability toggle.
* **Categories Management (`/admin/categories`)**:
  * Add, edit, and delete food categories.
* **Customer Orders Management (`/admin/orders`)**:
  * Filter orders by status (*Pending, Confirmed, Preparing, Out for Delivery, Delivered, Cancelled*).
  * Search orders by Customer name, phone, or Order ID.
  * Modal with full order receipt, customer phone, notes, and items breakdown.
  * Change status directly to update customer tracking in real time.
* **Customer Directory (`/admin/customers`)**:
  * View registered users, contact numbers, delivery addresses, roles, and join dates.
* **Role-Based Authorization**:
  * Non-admin users are blocked from `/admin/*` routes with an unauthorized notification.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Tailwind CSS, React Router v6, Axios, Lucide React, Recharts, React Hot Toast, Vite |
| **Backend** | Node.js, Express.js, JWT (`jsonwebtoken`), `bcryptjs`, `cors`, `dotenv` |
| **Database** | MongoDB, Mongoose *(with built-in in-memory fallback for zero-setup execution)* |

---

## 📁 Project Structure

```
Food_ordering_system/
├── client/                     # React Frontend
│   ├── public/
│   ├── src/
│   │   ├── components/         # Navbar, Footer, FoodCard, RatingStars, ProtectedRoute, AdminRoute
│   │   ├── context/            # AuthContext, CartContext (persistent)
│   │   ├── data/               # High-res Unsplash food items, restaurants, reviews
│   │   ├── pages/              # Home, Menu, FoodDetails, Cart, Checkout, OrderSuccess, MyOrders, Auth
│   │   │   └── admin/          # AdminLayout, Dashboard, Foods, Categories, Orders, Customers
│   │   ├── services/           # Axios instance with JWT interceptors
│   │   ├── App.jsx             # Route definitions
│   │   ├── main.jsx            # React root provider wrapper
│   │   └── index.css           # Custom Tailwind classes & veg/non-veg badges
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── server/                     # Express Backend
│   ├── config/
│   │   ├── db.js               # MongoDB connection handler
│   │   └── store.js            # Initial seed store and fallback in-memory repository
│   ├── middleware/
│   │   └── authMiddleware.js   # JWT protect and adminOnly middlewares
│   ├── models/
│   │   ├── User.js             # User Schema (name, email, password, phone, address, role)
│   │   ├── Food.js             # Food Schema (name, description, price, image, category, isVeg, available)
│   │   ├── Category.js         # Category Schema (name, image, description)
│   │   └── Order.js            # Order Schema (userId, items, address, payment, totals, status)
│   ├── routes/
│   │   ├── authRoutes.js       # Register, login
│   │   ├── foodRoutes.js       # Foods CRUD & filters
│   │   ├── categoryRoutes.js   # Categories CRUD
│   │   ├── orderRoutes.js      # Orders placement, my-orders, admin status updater
│   │   └── userRoutes.js       # User profile, customers list
│   ├── seed.js                 # Database seeder script
│   ├── server.js               # Express app entry point
│   ├── package.json
│   └── .env.example
│
├── package.json                # Root convenience scripts (run both frontend and backend concurrently)
└── README.md
```

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js** (v18 or higher recommended)
- **MongoDB** (local service on `mongodb://127.0.0.1:27017` or a MongoDB Atlas URI)
  > *Note: If MongoDB is not running locally, the server automatically activates its high-performance in-memory repository with pre-seeded data, ensuring immediate out-of-the-box functionality.*

---

### 2. Install Dependencies

You can install all dependencies with a single command from the root folder:
```bash
npm run install:all
```

---

### 3. Seed Database (Pre-loaded with sample food items)
Populate MongoDB with 12 gourmet dishes, 8 categories, and demo accounts:
```bash
npm run seed
```

---

### 4. Start the Complete Full-Stack Application

Run both backend and frontend together with a single command from the project root:
```bash
npm run dev
```

*Or run them in separate terminals if preferred:*
- **Backend**: `npm run server` (runs on `http://localhost:5000`)
- **Frontend**: `npm run client` (runs on `http://localhost:5173`)

---

## 🔑 Demo Credentials

For quick evaluation, use the one-click **"Demo Fill"** dropdown in the navigation bar, or enter these credentials manually:

| Account Type | Email | Password | Role |
|---|---|---|---|
| **Admin** | `admin@foodie.com` | `admin123` | Master Restaurant Admin (`/admin`) |
| **Customer** | `john@example.com` | `user123` | Customer with sample order history |

---

## 🎟️ Available Promo Codes

Test the checkout discount logic by applying any of these promo codes in the Shopping Cart:
- **`CRAVE30`** — 30% discount on order subtotal
- **`FREESHIP`** — Unlocks free delivery
- **`PIZZALOVE`** — $5.00 off total

---

## 📡 REST API Reference

### Authentication
- `POST /api/auth/register` — Register a customer account
- `POST /api/auth/login` — Authenticate and receive JWT token

### Food Menu
- `GET /api/foods` — List foods (supports `?category=...`, `?search=...`, `?isVeg=true/false`)
- `GET /api/foods/:id` — Get single food item
- `POST /api/foods` — Add new food item *(Admin)*
- `PUT /api/foods/:id` — Update food item *(Admin)*
- `DELETE /api/foods/:id` — Delete food item *(Admin)*

### Categories
- `GET /api/categories` — List all categories
- `POST /api/categories` — Create category *(Admin)*
- `PUT /api/categories/:id` — Update category *(Admin)*
- `DELETE /api/categories/:id` — Delete category *(Admin)*

### Orders
- `POST /api/orders` — Place new food order
- `GET /api/orders/my-orders` — Get authenticated user's order history
- `GET /api/orders/:id` — Get order status and tracking details
- `GET /api/orders` — Get all customer orders *(Admin)*
- `PUT /api/orders/:id/status` — Update order status *(Admin)*

### Users & Profiles
- `GET /api/users/profile` — Get current user profile
- `PUT /api/users/profile` — Update user profile (name, phone, address)
- `GET /api/users` — List all registered customers *(Admin)*

---

## 📄 License
ISC © CraveCraft Team. Built for premium dining and seamless delivery.
