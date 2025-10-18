# Cartify 🛒

Cartify is a full-stack **E-Commerce Web Application** designed to provide a seamless shopping experience for customers while also empowering store owners and admins with management tools.

The project follows **clean architecture principles** and applies **design patterns** to ensure scalability, maintainability, and clarity in the codebase.

---

## 🚀 Features

### 👤 Client (Customer)

* **Home Page**: Explore products, categories, offers.
* **Category Page**: Browse by category with filters and sorting.
* **Product Details Page**: View detailed product info, reviews, and ratings.
* **Cart Page**: Add/remove/update items and apply coupons.
* **Checkout Page**: Secure shipping and payment options (COD, card, wallet).
* **Order Tracking**: Track current and past orders.
* **Wishlist Page**: Save products for later.
* **Profile & Settings**: Manage personal info, addresses, payment methods.
* **Notifications**: Stay updated on offers and order status.
* **Support / Help**: FAQs, support tickets, chat.

### 🏬 Store Owner

* **Store Registration**: Create and manage store profile.
* **Dashboard**: Overview of sales, orders, and products.
* **Product Management**: Add/edit/delete products.
* **Orders Management**: Process incoming orders.
* **Store Profile**: Public profile showcasing products.
* **Analytics**: Sales insights, best-selling products.

### 🔑 Admin

* **Admin Dashboard**: Global overview of users, stores, and sales.
* **User Management**: Manage clients and store owners.
* **Store Management**: Approve/suspend/delete stores.
* **Product Management**: Approve, edit, or delete products.
* **Order Management**: Platform-wide control of orders.
* **Category Management**: Manage product categories/subcategories.
* **Reports & Analytics**: Export reports and apply filters.
* **System Notifications**: Handle alerts and flagged activities.
* **Settings**: Configure payments, shipping, and policies.

---

## 🛠️ Tech Stack

### Frontend

* **HTML, CSS, JavaScript**
* **Bootstrap**  (styling and responsive design)

### Backend

* **ASP.NET Core** (RESTful APIs)
* **Entity Framework Core** (ORM)
* **SQL Server** (database)

### Architecture & Patterns

* **Clean Architecture**
* **Repository & Unit of Work Pattern**
* **Dependency Injection**
* **DTOs & Automapper**

### Other Tools

* **JWT Authentication**
* **Docker** (optional for deployment)
* **CI/CD Pipelines** (GitHub Actions / GitLab CI)

---

## 📂 Project Structure

```bash
Cartify/
│── frontend/       # Client-side code (HTML, CSS, JS)
│── backend/        # ASP.NET Core API
│── docs/           # Documentation
│── scripts/        # Deployment/automation scripts
│── README.md       # Project overview
```

---

## 👥 Team Members

* Ahmed Ayad 
* Taqey Eldeen
* Mark Osama
* Mohamed Raouf
* Mustafa Nasr

---

## 📌 Setup Instructions

### Backend

1. Clone the repository:

   ```bash
   git clone https://github.com/Taqey/Cartify.git
   cd Cartify/backend
   ```
2. Update `appsettings.json` with your **DB connection string**.
3. Run migrations:

   ```bash
   dotnet ef database update
   ```
4. Run the API:

   ```bash
   dotnet run
   ```

### Frontend

1. Navigate to `frontend/`.
2. Open `index.html` in a browser or serve with:

   ```bash
   npm install -g serve
   serve .
   ```

---

## 📅 Roadmap

* ✅ Frontend (UI/UX, Client Pages)
* 🔄 Backend (ASP.NET Core APIs, DB schema)
* ⏳ Integration (Frontend ↔ Backend)
* ⏳ Deployment (Docker + Cloud Hosting)

---

## 📜 License

This project is licensed under the **MIT License** – free to use and modify.
