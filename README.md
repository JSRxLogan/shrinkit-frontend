
---

# 🌐 ShrinkIt Frontend

ShrinkIt Frontend is a **modern URL shortener web app** built with **React, Tailwind CSS, and React Router**. It provides a clean and minimal UI for users to **sign up, log in, shorten long links, copy them instantly, and track their performance with analytics**. Designed with responsiveness and smooth UX in mind, ShrinkIt makes managing your links fast and intuitive.

---

## ✨ Features

* 🔑 **User Authentication**
  Secure signup & login using JWT-based sessions with protected routes.

* 🔗 **URL Shortening**
  Generate unique, shortened links instantly.

* 📋 **Copy-to-Clipboard**
  One-click copy for quick sharing.

* 📊 **Dashboard & Analytics**
  View all your links, sorted by date or clicks, with basic charts.

* 🗑️ **Link Management**
  Delete or manage your shortened URLs directly from the dashboard.

* 🌙 **Dark UI**
  Built with Tailwind CSS for a sleek and responsive dark-themed design.

---

## 🛠️ Tech Stack

**Frontend:**

* ⚛️ React
* 🎨 Tailwind CSS
* 🔄 React Router
* 📦 Axios

**Backend (paired project):**

* Express.js
* MongoDB (Atlas)
* JWT Auth

---

## 🚀 Getting Started

### 1️⃣ Clone the repo

```bash
git clone https://github.com/your-username/shrinkit-frontend.git
cd shrinkit-frontend
```

### 2️⃣ Install dependencies

```bash
npm install
```

### 3️⃣ Setup environment

Create a `.env` file in the root with:

```env
VITE_API_BASE_URL=https://your-backend-url.com
```

### 4️⃣ Run locally

```bash
npm run dev
```

The app will start at [http://localhost:5173](http://localhost:5173).

---

## 📷 Screenshots

> *(Add your project screenshots here)*

* **Login Page**
* **Dashboard with links list**
* **Analytics Chart**

---

## 📂 Project Structure

```
shrinkit-frontend/
 ├── src/
 │   ├── components/   # Reusable UI components
 │   ├── pages/        # Page components (Login, Dashboard, etc.)
 │   ├── redux/        # State management (if used)
 │   ├── utils/        # Helper functions
 │   └── App.jsx
 ├── public/
 ├── package.json
 └── README.md
```

---

## 🧑‍💻 Deployment

This project is optimized for **Vercel deployment**.

1. Push to GitHub
2. Import repo on [Vercel](https://vercel.com)
3. Set environment variable `VITE_API_BASE_URL` to your backend URL
4. Deploy 🚀

---

## 📈 Roadmap

* Add custom alias support for short URLs
* Advanced analytics (location, device stats)
* User profile management
* Public API access

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!
Feel free to fork this repo and submit a pull request.

---

