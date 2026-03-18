# ⚙️ ElectroMart - E-Commerce Backend

## 🚀 Project Overview
ElectroMart Backend is a RESTful API built using Node.js and Express.js.  
It powers the ElectroMart e-commerce platform by handling authentication, product management, orders, and payments.

The backend connects with MongoDB to store and manage application data efficiently.

---

## 🛠️ Tech Stack
- Node.js  
- Express.js  
- MongoDB (Mongoose)  
- JWT Authentication  
- bcrypt (Password hashing)  
- dotenv (Environment variables)  

---

## ✨ Features
- 🔐 User Authentication (Register/Login)  
- 👤 Role-based access (Admin/User)  
- 📦 Product Management (CRUD)  
- 🗂️ Category Management  
- 🛒 Cart Management  
- 📑 Order Management  
- 💳 Payment Integration (if implemented)  
- 🔎 Search & filter APIs  

---

## 📁 Project Structure
backend/
│── controllers/
│── models/
│── routes/
│── middleware/
│── config/
│── utils/
│── server.js / app.js
│── package.json

---

## ⚙️ Installation & Setup

### 1. Clone the repository
git clone https://github.com/prakashRpk/ElectroMart-E-com-backend.git

### 2. Navigate to project folder
cd ElectroMart-E-com-backend

### 3. Install dependencies
npm install

### 4. Create .env file
Add the following variables:

PORT=5000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key

---

### 5. Run the server
npm start

Server runs at:
http://localhost:5000

---

## 🔗 API Endpoints (Sample)

### Auth
- POST /api/auth/register  
- POST /api/auth/login  

### Products
- GET /api/products  
- POST /api/products (Admin)  
- PUT /api/products/:id  
- DELETE /api/products/:id  

### Cart
- GET /api/cart  
- POST /api/cart  

### Orders
- POST /api/orders  
- GET /api/orders  

---

## 🔄 Frontend Repository
Frontend Repo:
https://github.com/prakashRpk/ElectroMart-E-com-frontend

---

## 📌 Future Improvements
- Payment Gateway Integration  
- Email Notifications  
- Order Tracking System  
- Admin Dashboard Analytics  

---

## 🤝 Contributing
Contributions are welcome! Feel free to fork and submit pull requests.

---

## 📄 License
This project is licensed under the MIT License.

---

## 👨‍💻 Author
Prakash R  
GitHub: https://github.com/prakashRpk
