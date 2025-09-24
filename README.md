# 🛒 E-Commerce Platform

A full-stack e-commerce platform built with **React, Node.js, and MongoDB**.  
Includes secure authentication, product management, shopping cart, and payment gateway integration.

---

## 🚀 Features

- 🔑 JWT authentication & authorization (login/signup).
- 📦 Product listing, search, and category filtering.
- 🛒 Shopping cart with add/remove/update functionality.
- 💳 Secure checkout with integrated payment gateway.
- 📜 Order history & transaction tracking.
- 📱 Responsive design with React & Tailwind CSS.
- ⚡ RESTful API backend built with Express.

---

## 🛠️ Tech Stack

**Frontend:** React, Tailwind CSS, Vite  
**Backend:** Node.js, Express.js  
**Database:** MongoDB (Mongoose ODM)  
**Authentication:** JWT, bcrypt  
**Payments:** Stripe / PayPal (configurable)  
**Deployment:** Vercel (frontend) & Vercel (backend)

---

## 📂 Project Structure

/client → React frontend
/server → Node.js & Express backend
/server/models → MongoDB schemas
/server/routes → API routes

---

## ⚡ Getting Started

### ✅ Prerequisites

- Node.js (v16+)
- MongoDB installed locally OR use [MongoDB Atlas](https://www.mongodb.com/atlas)
- Payment gateway API keys (Stripe or PayPal)

---

### 🔧 Installation

```bash
# Clone the repository
git clone  https://github.com/Ahmedomia/krist-back.git
cd ecommerce-platform

# Install dependencies
cd client && npm install
cd ../server && npm install


# Start backend
cd server
npm run dev

# Start frontend
cd client
npm run dev

# API Endpoints (Examples)

#Auth
POST /api/auth/signup   → Register user
POST /api/auth/login    → Login user

#Products
GET    /api/products        → List products
GET    /api/products/:id    → Get single product

#Future Improvements
⭐ Add product reviews & ratings.
❤️ Implement wishlists & favorites.

#Author
Ahmed Omia
- [GitHub](https://github.com/Ahmedomia)
```
