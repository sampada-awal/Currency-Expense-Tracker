# Currency Expense Tracker

This project has two parts:

- `backend`: an Express API that stores expenses in memory and converts currencies
- `frontend`: a Vite + React app that talks to the backend at `http://localhost:5000`

## Prerequisites

- Node.js 18 or newer
- npm

## Setup And Run

Run the backend and frontend in separate terminals.

### Backend

```bash
cd backend
npm install
npm start
```

The backend starts on `http://localhost:5000`.

### Frontend

```bash
cd frontend
npm install
npm start
```

The frontend starts on the Vite dev server, usually `http://localhost:5173`.

## Exchange Rate API

The app uses the free Frankfurter API through this endpoint:

- `https://api.frankfurter.dev/v2/rate/{from}/{to}`

No API key is required for the current implementation, so there is nothing to configure.

## Assumptions And Known Tradeoffs

- Expenses are stored in memory only, so all data is lost when the backend restarts.
- The frontend is hardcoded to call `http://localhost:5000`, so the backend must be running locally while developing.
- Currency conversion is limited to the currencies in `backend/currencies.js`.
- More time would go into persistent storage, environment-based configuration, better error handling, and automated tests.