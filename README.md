# Financial Projections Web App

## Overview
A small business financial projections web application built with Next.js, TypeScript, and SQLite.

## Features
- User Authentication
- Expense and Revenue Tracking
- Financial Projections Dashboard
- Type Management for Expenses and Revenues

## Prerequisites
- Node.js (v18 or later)
- npm

## Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/financial-projections.git
cd financial-projections
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
Create a `.env.local` file in the project root with the following:
```
JWT_SECRET=your_very_long_and_secure_random_secret
```

## Running the Application

### Development Mode
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build
```bash
npm run build
npm start
```

## Deployment

### Vercel
1. Install Vercel CLI
```bash
npm install -g vercel
```

2. Deploy
```bash
vercel
```

### Other Platforms
- Ensure Node.js is supported
- Set environment variables
- Use `npm run build` and `npm start`

## Database
- SQLite is used for data persistence
- Database is automatically created and migrated on first run
- Located at `financial-projections.db` in the project root

## Security
- Passwords are hashed using bcrypt
- JWT used for authentication
- Middleware protects routes

## Technologies
- Next.js 13
- TypeScript
- SQLite
- Tailwind CSS
- JWT Authentication
- Bcrypt

## License
MIT License
