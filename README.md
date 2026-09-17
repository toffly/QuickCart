# QuickCart

QuickCart is a full-stack e-commerce application designed for online shopping, order management, admin operations, and delivery logistics. The project combines a React + Vite storefront with an Express + Prisma backend and PostgreSQL data layer.

## Overview

This project includes:

- Customer storefront with product browsing, search, category filtering, and deals
- Product detail pages and checkout flow
- User authentication and saved delivery addresses
- Order tracking with live status updates and OTP verification
- Admin dashboard for managing products, orders, and delivery partners
- Delivery partner login and order dashboard
- Image uploads via Cloudinary
- Email notifications and background automation via Inngest

## Tech Stack

### Frontend
- React 19
- TypeScript
- Vite
- React Router
- Tailwind CSS
- Axios
- Leaflet / React Leaflet for map-based delivery tracking

### Backend
- Node.js
- Express 5
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT authentication
- Cloudinary
- Nodemailer
- Inngest

## Project Structure

```text
quickcart/
├── client/                 # React frontend
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.ts
├── server/                 # Express API and Prisma setup
│   ├── controller/
│   ├── middleware/
│   ├── routes/
│   ├── prisma/
│   ├── config/
│   ├── inngest/
│   ├── generated/
│   ├── server.ts
│   └── package.json
├── .gitignore
├── README.md
└── package.json (if added later)
```

## Features

### Customer Experience
- Browse products and flash deals
- Search and filter catalog items
- View product details and ratings
- Manage shipping addresses
- Place orders and proceed through checkout
- Track order status and order history

### Admin
- View dashboard metrics and order activity
- Create, update, and delete products
- Manage order state and delivery assignment
- Manage delivery partner records

### Delivery
- Delivery partner login
- Assigned order overview
- OTP-based verification and delivery operations

## Prerequisites

Before running the project, make sure you have:

- Node.js 18+ and npm
- PostgreSQL database
- Cloudinary account for image uploads
- SMTP email provider credentials
- Inngest keys for background automation

## Environment Setup

Create a `.env` file in the `server` directory and add the required environment variables for your local setup.

Use values for:
- database connection string
- JWT secret
- admin email list
- Cloudinary credentials
- email SMTP credentials
- Inngest keys

> Keep all secrets out of version control. Do not commit your `.env` file to GitHub.

## Installation

1. Clone the repository

```bash
git clone <repository-url>
cd quickcart
```

2. Install frontend dependencies

```bash
cd client
npm install
```

3. Install backend dependencies

```bash
cd ../server
npm install
```

## Database Setup

Generate Prisma client and sync the schema with your database:

```bash
cd server
npx prisma generate
npx prisma db push
```

Optional seed data:

```bash
npm run seed
```

## Running the App

Start the backend:

```bash
cd server
npm run server
```

Start the frontend:

```bash
cd client
npm run dev
```

The frontend typically runs at:

```text
http://localhost:5173
```

The backend API runs at:

```text
http://localhost:3000
```

## Available Scripts

### Frontend (`client`)
- `npm run dev` — start Vite dev server
- `npm run build` — production build
- `npm run preview` — preview production build
- `npm run lint` — run ESLint checks

### Backend (`server`)
- `npm run server` — start the Express server with Nodemon
- `npm start` — start server with tsx
- `npm run build` — TypeScript compile
- `npm run seed` — populate seed data

## Notes

- The frontend uses environment variables such as `VITE_BASE_URL` for the API base URL.
- The server exposes authentication, product, order, upload, admin, and delivery APIs under the `/api` namespace.
- Delivery tracking and notifications rely on live order updates and configured external services.

## License

This project is currently provided as a development project without a formal public license file. Please confirm licensing requirements before using it in production or publishing it publicly.

## Contributing

Pull requests and feature suggestions are welcome. For local development, keep the frontend and backend environment variables aligned and verify the Prisma schema before applying database changes.

For security, do not include any real credentials, tokens, or private service configuration in this repository.
