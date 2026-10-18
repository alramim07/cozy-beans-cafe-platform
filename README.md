# Olive & Oak Café 🌿

A simple, clean, mobile-friendly café website built with the **MERN stack** (MongoDB, Express, React, Node.js).

> Fresh food, warm drinks, friendly faces.

## Tech Stack

- **Frontend:** React (Vite), React Router, plain CSS
- **Backend:** Node.js + Express
- **Database:** MongoDB + Mongoose
- **Other:** dotenv, cors, axios

## Project Structure

```
olive-oak-cafe/
├── client/                 # React frontend (Vite)
│   └── src/
│       ├── components/     # Navbar, Footer, MenuItemCard, Hero, ContactForm
│       ├── pages/          # Home, About, Menu, Contact
│       ├── App.jsx
│       ├── api.js          # shared axios instance
│       └── index.css
├── server/                 # Express backend
│   ├── models/             # MenuItem.js, Message.js
│   ├── routes/             # menuRoutes.js, contactRoutes.js
│   ├── seed.js             # seeds 16 sample menu items
│   ├── server.js
│   └── .env.example
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB running locally (or a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster)

### 1. Install dependencies

```bash
cd server && npm install
cd ../client && npm install
```

### 2. Configure the server

```bash
cd server
cp .env.example .env
# edit .env if your MongoDB URI or ports differ
```

### 3. Seed the menu data

```bash
npm run seed
```

You should see: `Seeded 16 menu items`.

### 4. Run in development (two terminals)

```bash
# Terminal 1 — backend (http://localhost:5000)
cd server
npm run dev

# Terminal 2 — frontend (http://localhost:5173)
cd client
npm run dev
```

Open **http://localhost:5173** in your browser.

## API Endpoints

| Method | Endpoint             | Description                                  |
| ------ | -------------------- | -------------------------------------------- |
| GET    | `/api/menu`          | All menu items (`?category=breakfast` filter) |
| GET    | `/api/menu/popular`  | Popular items only (`popular: true`)          |
| POST   | `/api/contact`       | Validate and save a contact message           |

### Example contact request

```bash
curl -X POST http://localhost:5000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Sam","email":"sam@example.com","message":"Hello!"}'
```

## Features

- Sticky navigation with a hamburger menu on mobile
- Menu grouped into Breakfast, Lunch, and Drinks & Desserts with category filter tabs
- Contact form with client + server validation, saved to MongoDB
- Loading and error states on data fetches
- Fade-in effect on scroll (respects `prefers-reduced-motion`)
- Fully responsive: phones, tablets, and desktops
- Color palette: brown `#6F4E37`, cream `#FFF8E7`, green `#5B7B4A`