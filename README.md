# Student Course Enrollment Management System

A full-stack web application for managing student course enrollments with a clean, responsive UI and robust RESTful API.

## 📌 Overview

This project is a complete **Student Course Enrollment Management System** built as part of a Full Stack Engineer assignment. It allows administrators to perform CRUD operations on student records, search/filter enrollments, and manage status tracking—all within a modern, responsive interface.

The application follows **MVC architecture** on the backend and uses **React with Tailwind CSS** for a polished, mobile-friendly frontend.

---

## ✨ Features

### Core Requirements
- ✅ Dashboard: View all students in a sortable table/card layout with Name, Email, Course, and Status
- ✅ Search: Filter students by name in real-time
- ✅ Filter: Filter by course (dynamically generated from existing data)
- ✅ Add Student: Form with client-side validation (email format, phone digits 7-15)
- ✅ Edit Student: Pre-populated form to update existing records
- ✅ Delete Student: Confirmation dialog before removal
- ✅ Status Badges: Color-coded badges with row highlighting for "Pending" status

### Backend & Database
- ✅ RESTful API: Full CRUD operations with Express.js
- ✅ MongoDB Integration: Mongoose schema with validation
- ✅ MVC Structure: Models, Controllers, Routes
- ✅ Error Handling: Comprehensive try-catch blocks and meaningful error messages

### Bonus Features
- ✅ Pagination: Server-side pagination (10 items per page)
- ✅ Responsive Design: Mobile-first approach with Tailwind CSS
- ⬜ Authentication (Optional)
- ⬜ Docker Setup (Optional)

---

## 🛠 Tech Stack

### Frontend
- React 18
- Tailwind CSS
- Axios
- React Hooks (useState, useEffect, useMemo)

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- CORS
- Dotenv

### Development Tools
- Nodemon
- Concurrently
- Git

---

## 📁 Project Structure

```
student-management-intern/
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── App.js
│   │   └── index.js
│   ├── package.json
│   └── tailwind.config.js
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── .env
│   ├── server.js
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## 🚀 Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/kavindisathsarani/Student-Management-Intern.git
cd Student-Management-Intern
```

### 2️⃣ Backend Setup
```bash
cd server
npm install
```

Create a `.env` file inside the `server` folder:

```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
```

Start backend:
```bash
npm run dev
```

Backend runs at:
```
http://localhost:5000
```

### 3️⃣ Frontend Setup
```bash
cd ../client
npm install
```

Create a `.env` file inside the `client` folder:

```
REACT_APP_API_URL=http://localhost:5000/api
```

Start frontend:
```bash
npm start
```

Frontend runs at:
```
http://localhost:3000
```

---

## 🔐 Environment Variables

### Backend (.env)

| Variable | Description |
|----------|-------------|
| PORT | Server port |
| MONGODB_URI | MongoDB connection string |
| NODE_ENV | Environment mode |

### Frontend (.env)

| Variable | Description |
|----------|-------------|
| REACT_APP_API_URL | Backend API base URL |

---

## 📡 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Endpoints

| Method | Endpoint | Description |
|--------|----------|------------|
| GET | /students | Get paginated students |
| POST | /students | Create student |
| PUT | /students/:id | Update student |
| DELETE | /students/:id | Delete student |

### Sample Response

```json
{
  "items": [
    {
      "_id": "65a1b2c3d4e5f6a7b8c9d0e1",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "1234567890",
      "course": "Web Development",
      "status": "Enrolled",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "page": 1,
  "pages": 5,
  "total": 48
}
```

---

## 🎨 Frontend Overview

### Key Highlights
- Centralized state management using React Hooks
- Dynamic filtering and search
- Responsive layouts (Desktop, Tablet, Mobile)
- Form validation with visual feedback
- Loading indicators and empty states

---

## 🎥 Demo Video

```
https://drive.google.com/file/d/1m-LdEdf7ZdH0_Gg36YNIghoP72Imr_fa/view?usp=sharing

```

---

## ⭐ Bonus Features Implemented

- Server-side pagination
- Responsive mobile card layout
- Loading spinners
- Status badge color coding
- Form validation with error messages

---

## 📊 Evaluation Criteria Fulfilled

- Full Stack Connectivity (React ↔ Express ↔ MongoDB)
- Clean MVC Backend Architecture
- Proper Error Handling
- Responsive UI/UX
- Input Validation
- Documentation

---

## 👩‍💻 Author

**Kavindi Sathsarani**  
GitHub: https://github.com/kavindisathsarani  
---

## 📄 License

This project was developed as part of a job application assignment.

---

⭐ If you found this helpful, consider giving the repository a star!

