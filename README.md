# 🚀 TechThrive – Modern Tech E-Commerce Platform

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat&logo=next.js)
![React](https://img.shields.io/badge/React-18-blue?style=flat&logo=react)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-green?style=flat&logo=mongodb)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-Styling-06B6D4?style=flat&logo=tailwindcss)
![License](https://img.shields.io/badge/License-MIT-yellow)

TechThrive is a **full-stack, modern, and scalable e-commerce platform** built with **Next.js 15**, **TypeScript**, and **MongoDB**.  
It’s designed for **tech products** like mobiles, laptops, accessories, and more, offering a **smooth shopping experience** with secure authentication and a powerful admin dashboard.

---

## ✨ Features

✅ **Modern UI** – Built with TailwindCSS for sleek, responsive design  
✅ **Authentication** – Google, GitHub, and Email/Password login with NextAuth  
✅ **Admin Dashboard** – Manage products, categories, and orders  
✅ **Product Management** – Add, edit, and delete products with Cloudinary image uploads  
✅ **Category System** – Organize products into categories (Mobiles, Laptops, Accessories, etc.)  
✅ **Cart & Checkout** – Fully functional cart system with secure checkout flow  
✅ **SEO Optimized** – Better rankings with Next.js 15 App Router  
✅ **API Routes** – Secure & scalable backend built right into Next.js  

---

## 📂 Project Structure

**app/**   Contains Next.js App Router pages, layouts, and route handlers. This is where your core application UI and routing logic live.
**components/**   Houses reusable UI components (buttons, navbars, forms, modals, etc.) used across the project for consistency.
**lib/**   Stores utility functions like database connections, authentication helpers, API wrappers, and other shared logic.
**models/**   Contains Mongoose models that define the structure and schema for your MongoDB collections.
**public/**   Static files such as images, icons, favicons, and fonts accessible directly via /.
**types/**  Holds TypeScript type definitions & interfaces to ensure type safety across the project.
**constants/**	Stores application-wide constants such as API endpoints, role names, and default settings.
**features/**	Contains feature-specific logic grouped by functionality (e.g., product management, user dashboard).
**assets/**	Stores design assets like illustrations, logos, and SVGs used in the UI.
**config/**	Configuration files for third-party services, API settings, and project environment setup.
**hooks/**	Custom React hooks for handling reusable logic like authentication, form handling, and state management.
**.env.local**	Environment variables for local development (API keys, DB URIs) — not committed to GitHub.
**package.json**	Lists project dependencies, scripts, and metadata for managing the project.


---

## ⚡ Tech Stack

- **Frontend:** Next.js 15, React 18, TailwindCSS
- **Backend:** Next.js API Routes, MongoDB, Mongoose
- **Auth:** NextAuth.js (Google, GitHub, Credentials)
- **Image Uploads:** Cloudinary
- **State Management:** React Hooks / Context API

---

## 🛠 Installation & Setup

**1️⃣ Clone the Repository**
```bash
git clone https://github.com/AsadUllahBilal/TechThrive.git
cd TechThrive
