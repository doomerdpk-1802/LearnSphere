# LearnSphere

LearnSphere is a full-stack **course selling application**.  
Users can sign up, browse courses, purchase them, and access their content.  
Admins can create and manage courses. The app features a **clean, responsive UI** with a Node.js backend and MongoDB as the database.

---

## ✨ Features

### 👩‍🎓 For Users

- Create an account and log in
- Browse all available courses
- Purchase courses securely
- Access purchased course content
- View "My Courses" dashboard

### 👨‍🏫 For Admins

- Secure admin authentication
- Add new courses (title, description, price, image, etc.)
- Update or delete existing courses
- Manage course catalog

### 🌐 General

- Responsive, mobile-friendly UI
- REST API powered by Node.js & Express
- MongoDB for persistent data storage
- JWT-based authentication for secure access

---

## 🛠️ Tech Stack

- **Frontend:** HTML, CSS, JavaScript (vanilla)
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose ODM)
- **Authentication:** JWT (JSON Web Token)

---

## 🚀 Getting Started

### Clone the repository

```bash
git clone https://github.com/doomerdpk-1802/LearnSphere.git
cd LearnSphere
```

### Install dependencies

```bash
npm install
```

### Setup environment variables

```bash
cp .env.example .env
```

### Run the application

**Development:**

```bash
npm run dev
```

**Production:**

```bash
npm run start
```

**Run with Docker (For local development):**

```bash
docker compose up --build
```

---

## 📁 Project Structure

```
.
├── public/            # Static assets (HTML, CSS, JS, favicon, etc.)
├── src/               # Application source
│   ├── db/            # Database connection & models
│   ├── middlewares/   # Authentication & role-based middlewares
│   ├── routes/        # Express routes (users, admin, courses)
│   └── validators/    # Input validation schemas
├── docker/            # Docker-related configs
├── .env.example       # Example env vars
├── docker-compose.yml # Docker setup
├── package.json       # Scripts & dependencies
└── README.md          # Project documentation
```

---
