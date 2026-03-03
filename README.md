````markdown
# NextShop 🛒

**NextShop** is a modern, full-stack grocery e-commerce web application built with *Next.js 16*, *React 19*,
*TypeScript*, and *MongoDB*. It supports multiple user roles (User, Admin, Delivery Boy), real-time order tracking,
and a smooth, responsive interface.

---

## Table of Contents

- [Features](#features)  
- [Tech Stack](#tech-stack)  
- [Installation](#installation)  
- [Environment Variables](#environment-variables)  
- [Available Scripts](#available-scripts)  
- [Project Structure](#project-structure)  
- [Future Enhancements](#future-enhancements)  
- [License](#license)  

---

## Features

### User
- Browse groceries with search and filter options
- Place and track orders in real-time
- Responsive mobile-friendly dashboard
- Profile management and update mobile/role
- Realtime chat update with DeliveryBoy

### Admin
- Add, edit, and view groceries
- Manage orders and update statuses
- Admin dashboard analytics

### Delivery Boy
- Accept assignments
- Real-time geolocation updates for deliveries
- Manage current and completed orders
- Realtime chat update with user

### Common
- Authentication & authorization with **NextAuth.js**
- Real-time updates using **Socket.IO**
- Payment processing via **Stripe**
- Image uploads via **Cloudinary**
- Interactive maps with **Leaflet**

---

## Tech Stack

- **Frontend:** Next.js, React, TypeScript, Tailwind CSS  
- **Backend:** Next.js API Routes, Node.js, Express (via API routes)  
- **Database:** MongoDB with Mongoose  
- **Authentication:** NextAuth.js  
- **Real-Time:** Socket.IO  
- **Payment:** Stripe API  
- **Image Hosting:** Cloudinary  
- **Maps:** Leaflet, react-leaflet  

---

## Installation

1. Clone the repository:  

```bash
git clone [https://github.com/jakaria2055/nextshop]
cd nextshop
````

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables (see below)

4. Run the development server:

```bash
npm run dev
```

Server will start on: `http://localhost:3000`

---

## Environment Variables

Create a `.env` file in the root directory and add the following variables:

```env
MONGODB_URL=your_mongodb_connection_string
AUTH_SECRET=your_nextauth_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
GOOGLE_CLIENT_ID=your google client ID fror nodemailer
GOOGLE_CLIENT_SECRET=your google client Secret fror nodemailer
NEXT_BASE_URL="http://localhost:3000"
STRIPE_WEBHOOK_SECRET=your stripe webhook secret
## Run_This_for_refresh_WebHook  =  stripe listen --forward-to localhost:3000/api/user/stripe/webhook##
NEXT_PUBLIC_SOCKET_SERVER=socket server address
GEMINI_API_KEY=gemini api key
```

> Replace all placeholders with your actual credentials.

---

## Available Scripts

| Script          | Description                           |
| --------------- | ------------------------------------- |
| `npm run dev`   | Starts the Next.js development server |
| `npm run build` | Builds the application for production |
| `npm run start` | Starts the production server          |
| `npm run lint`  | Runs ESLint for code linting          |

---

## Project Structure

```text
nextshop/
├─ public/              # Static assets (images, icons, SVGs)
├─ src/
│  ├─ app/              # Next.js pages (User, Admin, Auth, etc.)
│  ├─ components/       # React components
│  ├─ lib/              # Database, Cloudinary, Socket helpers
│  ├─ models/           # Mongoose models
│  ├─ redux/            # Redux store and slices
│  ├─ hooks/            # Custom React hooks
│  ├─ auth.ts           # Authentication helper
│  ├─ Provider.tsx      # Redux & Context Provider
│  └─ ...               # Other helper files
├─ package.json
├─ tsconfig.json
├─ tailwind.config.js
└─ next.config.ts
```

---

## Future Enhancements

* Implement advanced full-text search for groceries
* Add reviews and ratings for products
* Multi-language support (Bangla & English)

---

Made by **Jakaria Ahmed**

```
