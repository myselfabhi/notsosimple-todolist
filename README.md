# NotSoSimple ToDo List

A full-stack todo list application with a separated frontend and backend architecture.

## Project Structure

```
notsosimple-todolist/
├── frontend/          # Next.js frontend application
├── backend/           # Express.js backend API
└── README.md          # This file
```

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

## Setup

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the `backend/` directory:
```bash
PORT=3001
MONGODB_URI=your_mongodb_connection_string
```

4. Start the backend server:
```bash
npm run dev
```

The backend API will be available at `http://localhost:3001`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the `frontend/` directory:
```bash
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

4. Start the frontend development server:
```bash
npm run dev
```

The frontend application will be available at `http://localhost:3000`

## Running Both Services

### Option 1: Separate Terminals

Open two terminal windows:

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### Option 2: Using npm scripts (if you have a root package.json)

You can create a root-level `package.json` with scripts to run both services concurrently using tools like `concurrently` or `npm-run-all`.

## API Documentation

See `API_DOCUMENTATION.md` for detailed API endpoint documentation.

## Technology Stack

### Frontend
- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Radix UI components

### Backend
- Express.js 5
- MongoDB
- Node.js

## Development

- Backend runs on port `3001`
- Frontend runs on port `3000`
- Ensure MongoDB is running and accessible
- CORS is enabled on the backend to allow frontend requests

## Production Build

### Backend
```bash
cd backend
npm start
```

### Frontend
```bash
cd frontend
npm run build
npm start
```
