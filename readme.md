# PaperGlow

Transform your digital memories into nostalgic, textured Polaroids.

---

## Overview

PaperGlow is a modern, responsive web application that brings back the magic of instant photography. Users can capture photos directly from their webcam or upload existing images, instantly transforming them into realistic digital Polaroids complete with authentic textures, subtle depth shadows, and the classic 1:1 aspect ratio.

---

## Features

* **Live Camera Capture**: Take photos directly from your browser using high-resolution webcam access.
* **Instant Uploads**: Upload and precisely crop existing photos into the classic 1:1 square format.
* **Authentic Aesthetics**: CSS-powered cardstock textures, realistic shadows, and dynamic lighting effects that make digital images feel like physical objects.
* **Secure Authentication**: Seamless login via Email/Password or Google OAuth (powered by Better Auth).
* **Personal Gallery**: A smoothly animated masonry grid to view, manage, and reminisce over your saved Polaroids.

---

## Tech Stack

### Frontend

* **Core**: React 18, Vite
* **Styling**: Styled Components
* **Animations**: Framer Motion
* **Icons**: Lucide React
* **Image Processing**: react-easy-crop

### Backend

* **Server**: Node.js, Express.js
* **Authentication**: Better Auth
* **Database**: PostgreSQL (Neon)
* **ORM**: Prisma or Drizzle
* **Storage**: Cloudinary

---

## Getting Started

Follow these steps to set up PaperGlow on your local machine.

### Prerequisites

* Node.js (v18 or higher)
* PostgreSQL database (or a free-tier Neon account)
* Cloudinary account
* Google Cloud Console project (for Google OAuth)

---

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/paperglow.git
cd paperglow
```

---

### 2. Backend Setup

Navigate to the backend directory and install dependencies:

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory and add the following:

```env
# Database
DATABASE_URL="postgresql://user:password@your-neon-hostname.neon.tech/dbname?sslmode=require"

# Authentication (Better Auth)
BETTER_AUTH_SECRET="your-super-secret-key"
BETTER_AUTH_URL="http://localhost:3000"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Cloudinary
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

Run database migrations and start the server:

```bash
npx prisma db push
npm run dev
```

---

### 3. Frontend Setup

Open a new terminal, navigate to the frontend directory, and install dependencies:

```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend` directory:

```env
VITE_API_URL="http://localhost:5000/api"
```

Start the Vite development server:

```bash
npm run dev
```

---

## Design System

PaperGlow relies on heavily encapsulated styling via Styled Components to prevent layout shifts. Polaroid frames avoid flat white backgrounds and instead use a highly compressed SVG noise overlay to simulate the tactile feel of chemical photo paper without compromising page load performance.

---

## Contributing

Contributions, issues, and feature requests are welcome. Please check the issues page if you would like to contribute.

---

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.
