# 🏥 MedSync - Smart Hospital Management System

<div align="center">

**Revolutionizing Healthcare Management**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-18.x-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18.x-blue.svg)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.x-green.svg)](https://www.mongodb.com/)

[Live Demo](https://medi-connect-in.netlify.app) • [Report Bug](https://github.com/rnt07s/Medsync/issues) • [Request Feature](https://github.com/rtn07s/Medsync/issues)

</div>

---

## 📋 Table of Contents

- [About The Project](#-about-the-project)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Running the Project](#-running-the-project)
- [API Documentation](#-api-documentation)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 About The Project

MedSync is a comprehensive hospital management system designed to streamline healthcare operations. It provides an integrated platform for managing OPD registrations, hospital resources, doctor appointments, and patient records.

### Why MedSync?

- **Eliminate Long Queues**: Online OPD registration and appointment booking
- **Real-time Tracking**: Monitor bed availability and hospital resources
- **Seamless Experience**: User-friendly interface for patients and healthcare providers
- **City-wide Integration**: Scalable architecture for multiple hospitals

---

## ✨ Features

### 🏥 For Patients
| Feature | Description |
|---------|-------------|
| **Easy OPD Registration** | Book appointments with just a few clicks |
| **Hospital Search** | Find nearby hospitals on an interactive map |
| **Doctor Selection** | Choose doctors based on department and availability |
| **Appointment History** | Track all past and upcoming appointments |
| **Lab Test Booking** | Schedule lab tests online |

### 🏨 For Hospitals
| Feature | Description |
|---------|-------------|
| **Dashboard Management** | Comprehensive hospital management dashboard |
| **Doctor Management** | Add, edit, and manage doctor profiles |
| **Appointment Tracking** | View and manage all patient appointments |
| **Resource Management** | Track beds, equipment, and services |

### 🔐 Security Features
- **JWT Authentication** - Secure token-based authentication
- **Role-based Access** - Different access levels for users and hospitals
- **Password Encryption** - Bcrypt-based password hashing
- **Input Validation** - Zod schema validation on all inputs

---

## 🛠 Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| **React.js 18** | UI Framework |
| **Recoil** | State Management |
| **Tailwind CSS** | Styling |
| **Framer Motion** | Animations |
| **Leaflet** | Interactive Maps |
| **Axios** | HTTP Client |
| **React Router v6** | Navigation |
| **Lucide React** | Icons |

### Backend
| Technology | Purpose |
|------------|---------|
| **Node.js** | Runtime Environment |
| **Express.js** | Web Framework |
| **MongoDB** | Database |
| **Mongoose** | ODM |
| **JWT** | Authentication |
| **Zod** | Validation |
| **Nodemailer** | Email Service |
| **Bcrypt** | Password Hashing |

---

## 📁 Project Structure

```
MedSync/
├── 📂 client/                    # Frontend React Application
│   ├── 📂 public/               # Static files
│   │   ├── 📂 images/          # Public images
│   │   └── index.html          # HTML template
│   ├── 📂 src/
│   │   ├── 📂 assets/          # Static assets (images, fonts)
│   │   ├── 📂 components/      # Reusable React components
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── ...
│   │   ├── 📂 pages/           # Page components
│   │   │   ├── Home.jsx
│   │   │   ├── About.jsx
│   │   │   ├── AuthForm.jsx
│   │   │   └── ...
│   │   ├── 📂 store/           # Recoil state management
│   │   ├── 📂 data/            # Static data & API URLs
│   │   ├── 📂 styles/          # CSS stylesheets
│   │   ├── App.js              # Root component
│   │   └── index.js            # Entry point
│   ├── package.json
│   └── tailwind.config.js
│
├── 📂 server/                    # Backend Node.js Application
│   ├── 📂 config/              # Configuration files
│   ├── 📂 controllers/         # Route controllers
│   │   ├── 📂 auth/           # Authentication controllers
│   │   ├── 📂 hospital/       # Hospital controllers
│   │   ├── 📂 user/           # User controllers
│   │   └── 📂 appointments/   # Appointment controllers
│   ├── 📂 middlewares/         # Express middlewares
│   ├── 📂 models/              # Mongoose models
│   ├── 📂 routes/              # API routes
│   ├── 📂 utils/               # Utility functions
│   │   ├── 📂 bcrypt/         # Password hashing
│   │   ├── 📂 cors/           # CORS configuration
│   │   └── 📂 db/             # Database connection
│   ├── 📂 validators/          # Zod validation schemas
│   ├── index.js               # Server entry point
│   └── package.json
│
├── README.md
└── LICENSE
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

| Software | Version | Download |
|----------|---------|----------|
| **Node.js** | v16.x or higher | [Download](https://nodejs.org/) |
| **npm** | v8.x or higher | Comes with Node.js |
| **MongoDB** | v5.x or higher | [Download](https://www.mongodb.com/try/download/community) |
| **Git** | Latest | [Download](https://git-scm.com/) |

### Installation

#### Step 1: Clone the Repository

```bash
git clone https://github.com/YourUsername/MedSync.git
cd MedSync
```

#### Step 2: Install Backend Dependencies

```bash
cd server
npm install
```

#### Step 3: Install Frontend Dependencies

```bash
cd ../client
npm install
```

### Environment Variables

#### Backend Environment Variables

Create a `.env` file in the `server` directory:

```env
# Server Configuration
PORT=8081
NODE_ENV=development

# MongoDB Connection
MONGO_URI=mongodb://localhost:27017/medsync
# For MongoDB Atlas:
# MONGO_URI=mongodb+srv://<username>:<password>@cluster.xxxxx.mongodb.net/medsync

# JWT Secret (use a strong random string)
JWT_SECRET=your-super-secret-jwt-key-here

# Email Configuration (for OTP and notifications)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

#### Frontend Environment Variables (Optional)

Create a `.env` file in the `client` directory:

```env
REACT_APP_API_URL=http://localhost:8081
```

---

## ▶️ Running the Project

### Quick Start (Development)

You need **two terminal windows** to run both servers:

#### Terminal 1 - Start Backend Server

```bash
cd server
npm run dev
```

✅ Backend will run at: `http://localhost:8081`

#### Terminal 2 - Start Frontend Server

```bash
cd client
npm start
```

✅ Frontend will run at: `http://localhost:3000`

### Verify Installation

1. Open browser: `http://localhost:3000`
2. You should see the MedSync homepage
3. Try registering a new account to verify backend connection

---

## 📡 API Documentation

### Base URL
```
http://localhost:8081
```

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/auth/register` | Register new user/hospital |
| `POST` | `/auth/login` | User/Hospital login |
| `GET` | `/auth/profile` | Get user profile |
| `POST` | `/auth/profile/edit/:id` | Update profile |

### Hospital Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/hospitalapi` | Get all hospitals |
| `GET` | `/hospitalapi/:id` | Get hospital by ID |
| `GET` | `/hospitalapi/search` | Search hospitals |

### Appointment Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/appointments/register` | Book new appointment |
| `GET` | `/appointments/available-slots` | Get available time slots |

---

## ⚠️ Troubleshooting

### Common Issues & Solutions

#### 1. MongoDB Connection Failed
```
Error: MongoNetworkError: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution**: 
- Make sure MongoDB is running
- Check your `MONGO_URI` in `.env` file
- For Windows: Run `net start MongoDB` in admin terminal

#### 2. Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::8081
```
**Solution** (Windows PowerShell):
```powershell
# Find process using port
netstat -ano | findstr :8081

# Kill the process
taskkill /PID <PID_NUMBER> /F
```

#### 3. CORS Error in Browser
**Solution**: The CORS is already configured to allow `localhost`. If issues persist, check `server/utils/cors/corsConfig.js`

#### 4. Node Modules Issues
```bash
# Delete and reinstall
Remove-Item -Recurse -Force node_modules, package-lock.json
npm install
```

#### 5. JWT Token Invalid
**Solution**: 
- Clear browser cookies/localStorage
- Restart the backend server
- Check `JWT_SECRET` is set in `.env`

---

## 🤝 Contributing

Contributions are welcome! 

1. **Fork** the repository
2. **Create** your feature branch: `git checkout -b feature/AmazingFeature`
3. **Commit** your changes: `git commit -m 'Add AmazingFeature'`
4. **Push** to the branch: `git push origin feature/AmazingFeature`
5. **Open** a Pull Request

---

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 📞 Contact

**Rauneet Singh**
- GitHub: [@rnt07s](https://github.com/rnt07s)
- LinkedIn: [rauneet-singh](https://www.linkedin.com/in/rauneet-singh-5676ab250/)

---

<div align="center">

**⭐ Star this repository if you found it helpful! ⭐**

Made with ❤️ for Healthcare

</div>
