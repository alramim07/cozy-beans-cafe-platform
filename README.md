# The Cozy Beans ☕

A modern, clean, mobile-friendly café website built with the **MERN stack** (MongoDB, Express, React, Node.js).

> Fresh beans, warm vibes, good times.

---

## 🌐 Live Demo
- **Frontend:** https://thecozybeans.netlify.app
- **Admin Panel:** https://thecozybeans.netlify.app/admin/login
- **API:** https://thecozybeans-api.onrender.com

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 18, Vite, React Router, Axios |
| **Styling** | Plain CSS (CSS Variables, Grid/Flexbox, Animations) |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB Atlas, Mongoose ODM |
| **Auth** | JWT (httpOnly cookies), bcryptjs |
| **Dev Tools** | Vite, ESLint, dotenv, cookie-parser |

---

## ✨ Features

### Public Site
- **Home** — Hero with CTA, popular items carousel
- **About** — Story + value cards with hover animations
- **Menu** — Filterable tabs (Breakfast, Lunch, Drinks, Desserts)
- **Contact** — Form with validation + map embed
- **Responsive** — Mobile-first, hamburger nav, smooth animations
- **Design System** — Playfair Display + DM Sans, CSS variables, hover/focus states

### Admin Panel (`/admin/login`)
- **JWT Auth** — httpOnly cookies, bcrypt password hashing, rate limiting
- **Dashboard** — Stats cards (total items, popular, unread messages)
- **Menu Management** — Full CRUD with image preview, category badges
- **Messages** — Read/unread toggle, delete, sortable table

---

## 📁 Project Structure

```
thecozybeans/
├── client/                     # React frontend (Vite)
│   ├── public/
│   ├── src/
│   │   ├── components/         # Navbar, Footer, Hero, MenuItemCard, ContactForm, ScrollReveal
│   │   ├── pages/              # Home, About, Menu, Contact
│   │   ├── pages/admin/        # AdminLogin, AdminDashboard, AdminMenu, AdminMessages
│   │   ├── hooks/              # useAuth, useScrollReveal
│   │   ├── api.js              # Axios instance (proxied in dev)
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css           # Full design system (CSS variables, animations)
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   └── .env.example
├── server/                     # Express backend
│   ├── middleware/             # auth.js (JWT verification)
│   ├── models/                 # MenuItem.js, Message.js, Admin.js
│   ├── routes/                 # menuRoutes, contactRoutes, adminRoutes
│   ├── createAdmin.js          # Creates admin from .env
│   ├── seed.js                 # Seeds 16 menu items
│   ├── server.js               # Express entry point
│   ├── package.json
│   └── .env.example
├── start-servers.ps1           # Windows dev startup script
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (free tier)

---

### 1. Clone & Install

```bash
git clone https://github.com/alramim07/thecozybeans.git
cd thecozybeans

# Install server deps
cd server && npm install

# Install client deps
cd ../client && npm install
```

---

### 2. Configure Environment

**Server (`server/.env`):**
```bash
cd server
cp .env.example .env
# Edit .env with your values
```

```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<pass>@cluster0.9rrgxnq.mongodb.net/thecozybeans?retryWrites=true&w=majority
CLIENT_URL=http://localhost:5173
JWT_SECRET=your-super-long-random-secret-key-here
ADMIN_EMAIL=admin@thecozybeans.com
ADMIN_PASSWORD=YourStrongPassword123!
```

**Client (`client/.env`):**
```bash
cd ../client
cp .env.example .env
```

```env
VITE_API_URL=http://localhost:5000
```

---

### 3. Seed Database

```bash
cd server
npm run create-admin   # Creates admin user from .env
npm run seed           # Seeds 16 menu items
```

---

### 4. Run Locally (Development)

**Option A: Windows PowerShell Script**
```powershell
.\start-servers.ps1
```

**Option B: Two Terminals**
```bash
# Terminal 1 - Backend (port 5000)
cd server && npm run dev

# Terminal 2 - Frontend (port 5173)
cd client && npm run dev
```

Open **http://localhost:5173**

---

## 🔐 Environment Variables Explained

### `JWT_SECRET`
**Where to find/generate:** You create this yourself. It must be a **long, random string** used to sign JWT tokens.

**Generate one:**
```bash
# Option 1: Node.js
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Option 2: OpenSSL
openssl rand -hex 64

# Option 3: Online (use only for dev)
# https://generate-secret.vercel.app/64
```

**Example output:** `a3f2b9c8d4e6f1a8b7c9d0e2f4a6b8c0d2e4f6a8b0c2e4f6a8b0c2e4f6a8b0c2`

> ⚠️ **Never commit this to git.** Use different secrets for dev/prod.

---

### `VITE_API_URL`
**Where to find:** This is your **backend API URL**.

| Environment | Value |
|-------------|-------|
| **Local dev** | `http://localhost:5000` |
| **Production (Netlify + Render)** | `https://your-api-name.onrender.com` |
| **Production (same domain)** | `/api` (if using Netlify Functions) |

**In Netlify:** Go to Site Settings → Environment Variables → Add `VITE_API_URL` with your Render API URL.

**In Vite config:** The proxy handles this automatically in dev (`vite.config.js`):
```js
proxy: {
  '/api': { target: 'http://127.0.0.1:5000', changeOrigin: true }
}
```

---

## 🌍 Production Deployment

### Backend → Render
1. Go to https://dashboard.render.com → **New +** → **Web Service**
2. Connect GitHub → `alramim07/thecozybeans`
3. **Root Directory:** `server`
4. **Build Command:** `npm install`
5. **Start Command:** `node server.js`
6. **Environment Variables:**
   ```
   PORT=10000
   MONGO_URI=mongodb+srv://...
   CLIENT_URL=https://thecozybeans.netlify.app
   JWT_SECRET=your-generated-secret
   ADMIN_EMAIL=admin@thecozybeans.com
   ADMIN_PASSWORD=YourStrongPassword123!
   NODE_ENV=production
   ```
6. Deploy → Get URL: `https://thecozybeans-api.onrender.com`

### Frontend → Netlify
1. Go to https://app.netlify.com → **Add new site** → **Import from Git**
2. Select GitHub → `alramim07/thecozybeans`
3. **Base directory:** `client`
4. **Build command:** `npm run build`
5. **Publish directory:** `dist`
6. **Environment Variable:**
   ```
   VITE_API_URL=https://thecozybeans-api.onrender.com
   ```
7. Deploy → Get URL: `https://thecozybeans.netlify.app`

### Update CORS
After Netlify deploy, update `CLIENT_URL` in Render:
```
CLIENT_URL=https://thecozybeans.netlify.app
```

---

## 📡 API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/health` | No | Health check |
| GET | `/api/menu` | No | All menu items |
| GET | `/api/menu?category=breakfast` | No | Filter by category |
| GET | `/api/menu/popular` | No | Popular items only |
| POST | `/api/contact` | No | Submit contact form |
| POST | `/api/admin/login` | No | Admin login |
| POST | `/api/admin/logout` | Yes | Admin logout |
| GET | `/api/admin/me` | Yes | Current admin |
| GET | `/api/menu` | Yes | List all (admin) |
| POST | `/api/menu` | Yes | Create menu item |
| PUT | `/api/menu/:id` | Yes | Update menu item |
| DELETE | `/api/menu/:id` | Yes | Delete menu item |
| GET | `/api/contact` | Yes | List messages |
| PATCH | `/api/contact/:id` | Yes | Mark read/unread |
| DELETE | `/api/contact/:id` | Yes | Delete message |

---

## 🎨 Design System

| Token | Value | Usage |
|-------|-------|-------|
| `--brown-900` | `#2D1E16` | Primary text, dark backgrounds |
| `--brown-700` | `#4A3427` | Headings, primary buttons |
| `--brown-500` | `#6B4F3D` | Secondary text |
| `--cream-50` | `#FDF6EC` | Page background |
| `--cream-100` | `#F5ECD9` | Card backgrounds |
| `--sage-500` | `#6B8E5C` | Primary accent, CTAs |
| `--sage-700` | `#4A623A` | Hover states |
| `--gold-500` | `#D4A574` | Highlights, badges |
| `--terracotta-500` | `#C46D4A` | Danger actions |

**Fonts:** Playfair Display (display) + DM Sans (UI)

---

## 📝 Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server (server: nodemon, client: Vite) |
| `npm run build` | Build client for production |
| `npm run seed` | Seed 16 menu items |
| `npm run create-admin` | Create admin from .env |
| `npm run dev` | Start both (via concurrently or script) |

---

## 📄 License

MIT License - feel free to use for your own café!