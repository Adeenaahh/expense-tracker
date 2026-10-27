# Personal Expense Tracker (MERN)

A responsive expense tracker built with React, Express, Node.js, and MongoDB Atlas.

## Features
- Add expenses with title, amount, category, and date
- View all saved expenses
- Edit and delete expenses with confirmation
- Automatically calculate total spending
- Validate required fields and positive amounts
- Responsive desktop and mobile interface

## Requirements
Install Node.js LTS. Have a MongoDB Atlas database and connection string ready.

## 1. Configure MongoDB
Open `backend/.env` and replace the placeholder MONGO_URI with your MongoDB Atlas connection string. In Atlas, ensure your test database user is allowed to connect and your IP is allowed in Network Access. Do not share real credentials publicly.

## 2. Start the backend
Open a terminal in the `backend` folder and run:
```bash
npm install
npm run dev
```
Expected message: `Connected to MongoDB Atlas` and `Backend running at http://localhost:5000`.

## 3. Start the frontend
Open a second terminal in the `frontend` folder and run:
```bash
npm install
npm run dev
```
Open the local URL printed by Vite, usually `http://localhost:5173`.

## API routes
- `GET /api/expenses` — list expenses
- `POST /api/expenses` — create an expense
- `PUT /api/expenses/:id` — update an expense
- `DELETE /api/expenses/:id` — delete an expense

## Before submission
- Test create, list, edit, delete, invalid amount, and total calculation.
- Push both folders to GitHub.
- The included `.env` files contain placeholders/local settings only. Replace the backend placeholder locally. Never commit real passwords or production secrets. If your instructor specifically requires `.env` in the repository, only submit a dummy/test configuration and make sure it contains no real credentials.
