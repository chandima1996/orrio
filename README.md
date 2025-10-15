# Orrio - AI Hotel Management System 🏨✨

Orrio is a modern, full-stack hotel booking platform built with the MERN stack, designed to revolutionize the hotel search experience. It leverages the power of OpenAI to provide an intelligent, semantic search that allows users to find hotels based on the "vibe" or experience they describe, rather than just keywords.

This project serves as a comprehensive, industry-standard example of a modern web application, incorporating everything from complex backend architecture and third-party API integrations to a sleek, responsive frontend with advanced UI features.

**Live Demo:** [orrio-app.netlify.app](https://orrio-app.netlify.app) _(Note: This is a placeholder link)_

---

## 🚀 Key Features

### User-Facing Features
* **🧠 AI-Powered Semantic Search:** Describe your ideal stay (e.g., "a quiet beachside hotel with a pool") and get perfectly matched results.
* **🔍 Advanced Filtering & Sorting:** Filter hotels by guest count, location, hotel class, user rating, and amenities. Sort rooms by price.
* **🌗 Light & Dark Mode:** A beautiful, themeable UI for user comfort.
* **💵 Multi-Currency Support:** Toggle between USD and LKR for all displayed prices.
* **🔐 Secure User Authentication:** Full sign-up, sign-in, and profile management powered by Clerk.
* **💳 Integrated Payments:** A complete booking flow with secure payment processing via Stripe.
* **👤 User Dashboard:** A personal space for users to manage their details, view booking history (upcoming/past), and manage their favorite hotels.
* **🎨 Dynamic UI:** Features like skeleton loaders, interactive 3D-style effects on hover, and responsive design for a premium user experience.

### Admin-Facing Features
* **👑 Role-Based Admin Dashboard:** A separate, secure dashboard for administrators.
* **🏨 Full Hotel Management (CRUD):** Admins can create, read, update, and delete hotels.
* **🚪 Full Room Management (CRUD):** Admins can add, edit, and delete rooms associated with specific hotels.
* **👥 Full User Management (CRUD):** Admins can view all users, update their details, and manage their roles (promote to admin/demote to user) via Clerk integration.

---

## 💻 Technology Stack

### Frontend
* **Framework:** React 18
* **UI Library:** shadcn/ui
* **Styling:** Tailwind CSS
* **State Management:** React Context API, `useState`, `useEffect`
* **Routing:** React Router DOM
* **Animations:** Framer Motion
* **Forms:** React Hook Form with Zod for validation
* **Build Tool:** Vite

### Backend
* **Runtime:** Node.js
* **Framework:** Express.js
* **Language:** TypeScript
* **Architecture:** MVC (Models-Views-Controllers)

### Database
* **Type:** NoSQL
* **Service:** MongoDB Atlas

### APIs & Services
* **Authentication:** Clerk
* **AI Search:** OpenAI (GPT-3.5-Turbo for Chat Completion)
* **Payments:** Stripe
* **Deployment:**
    * **Frontend:** Netlify
    * **Backend:** Render

---

## 📂 Project Structure
orrio-app/
├── client/         # React Frontend Application
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── data/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
└── server/         # Node.js/Express Backend Application
├── src/
│   ├── controllers/
│   ├── data/
│   ├── models/
│   ├── routes/
│   └── index.ts
├── seeder/
└── package.json



## ⚙️ Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

* Node.js (v18 or later)
* npm or yarn
* Git

### 1. Clone the Repository

```bash
git clone [https://github.com/your-username/orrio-app.git](https://github.com/your-username/orrio-app.git)
cd orrio-app


# Navigate to the server directory
cd server

# Install dependencies
npm install

# Create a .env file in the /server root and add the following variables:
MONGO_URI=your_mongodb_connection_string
CLERK_SECRET_KEY=your_clerk_secret_key
OPENAI_API_KEY=your_openai_api_key
STRIPE_SECRET_KEY=your_stripe_secret_key
FRONTEND_URL=http://localhost:5173

# Seed the database with sample hotels and rooms
npm run data:import

# Start the backend server
npm run dev

# Navigate to the client directory from the root
cd client

# Install dependencies
npm install

# Create a .env file in the /client root and add the following variables:
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
VITE_API_BASE_URL=http://localhost:5001

# Start the frontend development server
npm run dev
