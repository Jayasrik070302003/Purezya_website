# Purazya - Authentication & Dashboard

A premium, production-ready full-stack authentication system and dashboard built for the Purazya brand.

## Tech Stack
- **Frontend**: React.js, Tailwind CSS, Framer Motion, Lucide Icons
- **Backend**: Node.js, Express, JWT
- **Database**: MySQL

## Prerequisites
- Node.js installed
- MySQL Server running

## Setup Instructions

### 1. Database Setup
1. Create a MySQL database named `Purazya_db`.
2. The `users` table will be automatically created when the backend starts.

### 2. Backend Installation
1. Navigate to the `backend` folder.
2. Create a `.env` file based on `.env.example`.
3. Fill in your database credentials and a secret JWT key.
4. Run:
   ```bash
   npm install
   npm start
   ```

### 3. Frontend Installation
1. Navigate to the `frontend` folder.
2. Run:
   ```bash
   npm install
   npm run dev
   ```

## Features
- **Secure Authentication**: JWT-based login and registration with password hashing (bcrypt).
- **Responsive Dashboard**: Beautiful, mobile-friendly dashboard with organic aesthetics.
- **Protected Routes**: Secure access to user-specific data.
- **Premium Design**: Custom organic color palette, smooth animations, and modern typography.
