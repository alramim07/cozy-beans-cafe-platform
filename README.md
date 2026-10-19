# Olive & Oak Café ☕🌿

A modern, responsive, full-stack café website built with the **MERN stack** (MongoDB, Express, React, Node.js).

> Fresh food, warm drinks, friendly faces.

---

## 🌐 Live Deployments
- **Frontend (Netlify):** [oliveandoak.netlify.app](https://oliveandoak.netlify.app)
- **Backend API (Render):** [olive-oak-cafe-api.onrender.com](https://olive-oak-cafe-api.onrender.com)
- **Admin Panel:** [oliveandoak.netlify.app/admin/login](https://oliveandoak.netlify.app/admin/login)

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 18, Vite, React Router 6, Axios |
| **Styling** | Modern CSS (CSS Variables, Flexbox/Grid, Responsive Media Queries, Animations) |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB Atlas, Mongoose ODM |
| **Authentication** | JWT (httpOnly cookies, cross-origin withCredentials), bcryptjs |
| **Security & Utilities** | Helmet, Express Rate Limit, Cookie-Parser, CORS |

---

## ✨ Features

### ☕ Public Customer Site
- **Home Page** — Hero banner with CTAs, customer favorites showcase, and warm community styling.
- **Our Story / About** — Company story and philosophy with interactive, animated value cards.
- **Menu** — Categorized offerings (Breakfast, Lunch, Drinks, Desserts) with filter tabs and popularity tags.
- **Contact & Visit Us** — Dynamic contact information, interactive Google Map embed, and inquiry contact form with instant validation.
- **Dynamic Footer** — Automatically synchronizes opening hours, contact details, and social links with admin settings.
- **Fully Responsive** — Optimized for mobile phones (320px+), tablets, laptops, and ultra-wide desktops.

### 🔐 Admin Management Panel (`/admin`)
- **Dashboard** — Live business overview with stat cards, menu category distributions, and recent message alerts.
- **Menu Management** — Add, edit, preview, and delete menu items with pricing, category tags, and "Popular" flags.
- **Messages Inbox** — Read, mark read/unread, and manage customer inquiries submitted through the contact form.
- **About Page Editor** — Dynamically edit story headings, narrative text, story images, and custom value cards.
- **Contact & Location Management** — Dynamically manage physical address, phone, email, Google Maps embed link (with real-time interactive preview), and daily opening hours.
- **Collapsible Sidebar & Mobile Drawer** — Collapses to icon-only mode with custom café logo badge on desktop, and transforms into a drawer on mobile viewports.

---

## 📁 Project Structure

```
olive-oak-cafe/
├── client/                     # React frontend (Vite)
│   ├── src/
│   │   ├── components/         # Navbar, Footer, Hero, MenuItemCard, ContactForm, AdminLayout, ScrollReveal
│   │   ├── pages/              # Home, About, Menu, Contact
│   │   ├── pages/admin/        # AdminLogin, AdminDashboard, AdminMenu, AdminMessages, AdminAbout, AdminSettings
│   │   ├── hooks/              # useAuth, useScrollReveal
│   │   ├── api.js              # Axios instance configured with withCredentials
│   │   ├── App.jsx             # Main routing and layout separation
│   │   ├── main.jsx
│   │   └── index.css           # Complete café design system & responsive styling
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── server/                     # Express backend
│   ├── middleware/             # auth.js (JWT authentication verification)
│   ├── models/                 # MenuItem.js, Message.js, Admin.js, AboutContent.js, SiteSettings.js
│   ├── routes/                 # menuRoutes, contactRoutes, adminRoutes, aboutRoutes, settingsRoutes
│   ├── createAdmin.js          # Admin account initializer
│   ├── seed.js                 # Database seed script for menu items
│   ├── server.js               # Express application entry point
│   └── package.json
├── start-servers.ps1           # Local development startup script
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas cluster or local MongoDB instance

---

### 1. Installation

```bash
# Clone the repository
git clone https://github.com/alramim07/Simple-Cafe-website.git
cd Simple-Cafe-website

# Install backend dependencies
cd server && npm install

# Install frontend dependencies
cd ../client && npm install
```

---

### 2. Configure Environment

**Backend (`server/.env`):**
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
CLIENT_URL=http://localhost:5173
JWT_SECRET=your_super_secret_jwt_key
ADMIN_EMAIL=admin@oliveandoak.cafe
ADMIN_PASSWORD=YourSecurePassword123!
```

**Frontend (`client/.env`):**
```env
VITE_API_URL=http://localhost:5000
```

---

### 3. Initialize Admin & Seed Data

```bash
cd server
npm run create-admin   # Initializes admin user from .env
npm run seed           # Populates initial menu items
```

---

### 4. Running Locally

**Using the PowerShell script (Windows):**
```powershell
.\start-servers.ps1
```

**Or run in separate terminals:**
```bash
# Terminal 1 - Backend (port 5000)
cd server && npm run dev

# Terminal 2 - Frontend (port 5173)
cd client && npm run dev
```

Visit:
- Website: **http://localhost:5173**
- Admin Panel: **http://localhost:5173/admin/login**

---

## 📡 API Reference

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/health` | Public | Server health status check |
| GET | `/api/menu` | Public | List all menu items |
| GET | `/api/menu/popular` | Public | List customer favorite items |
| POST | `/api/contact` | Public | Submit customer contact message |
| GET | `/api/about` | Public | Get About page content and value cards |
| GET | `/api/settings` | Public | Get contact info, map URL, and opening hours |
| POST | `/api/admin/login` | Public | Authenticate administrator |
| POST | `/api/admin/logout` | Admin | Clear session cookie |
| GET | `/api/admin/me` | Admin | Fetch authenticated admin details |
| POST | `/api/menu` | Admin | Create new menu item |
| PUT | `/api/menu/:id` | Admin | Update existing menu item |
| DELETE | `/api/menu/:id` | Admin | Remove menu item |
| GET | `/api/contact` | Admin | List all received contact messages |
| PATCH | `/api/contact/:id` | Admin | Toggle message read/unread status |
| DELETE | `/api/contact/:id` | Admin | Delete contact message |
| PUT | `/api/about` | Admin | Update About story text, images, and cards |
| PUT | `/api/settings` | Admin | Update contact details, Google Map, and hours |

---

## 🎨 Design System

| Token | Hex | Role |
|-------|-----|------|
| `--brown-900` | `#2D1E16` | Main text color, dark header/footer accents |
| `--brown-700` | `#4A3427` | Headings, primary brand tone |
| `--cream-50` | `#FDF6EC` | Light warm background |
| `--cream-100` | `#F5ECD9` | Card and secondary panel background |
| `--sage-500` | `#6B8E5C` | Primary natural accent, active badges, CTAs |
| `--gold-500` | `#D4A574` | Highlights, badges, decorative accents |
| `--terracotta-500` | `#C46D4A` | Danger actions, unread indicators, tag accents |

- **Fonts:** *Playfair Display* (Display & Headings) and *DM Sans* (Body & Interface).

---

## 📄 License
MIT License.