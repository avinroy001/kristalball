# KristalBall

KristalBall is a full-stack web application for asset and movement management, featuring user authentication, role-based access, and a modern React frontend.

## Features
- User registration and login (admin, commander, logistics roles)
- Asset management (CRUD)
- Movement tracking (CRUD)
- Role-based access control
- RESTful API with Express and MongoDB
- Modern React frontend with routing

## Project Structure

```
kristalball/
  backend/           # Express.js backend
    models/          # Mongoose models (User, Asset, Movement)
    routes/          # API routes (auth, register, asset, movement)
    controllers/     # Controllers for business logic
    middleware/      # Auth middleware (JWT)
    server.js        # Main server file
    package.json     # Backend dependencies
  public/            # React public assets
  src/               # React frontend
    pages/           # React pages (Login, Register, Dashboard)
    App.js           # Main app with routing
    ...
  package.json       # Frontend dependencies
  README.md          # Project documentation
```

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn
- MongoDB Atlas or local MongoDB instance

### Backend Setup
1. Navigate to the backend folder:
   ```sh
   cd backend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Update the MongoDB connection string in `server.js` if needed.
4. Start the backend server:
   ```sh
   npm start
   ```
   The backend runs on `http://localhost:3001` by default.

### Frontend Setup
1. In the root project folder:
   ```sh
   npm install
   ```
2. Start the React app:
   ```sh
   npm start
   ```
   The frontend runs on `http://localhost:3000` by default.

## API Endpoints

### Auth
- `POST /api/auth/register` — Register a new user
  - Body: `{ "username": "john", "password": "pass", "role": "admin" }`
- `POST /api/auth/login` — Login and receive JWT

### Assets
- `GET /api/assets` — List assets (protected)
- `POST /api/assets` — Create asset (protected)

### Movements
- `GET /api/movements` — List movements (protected)
- `POST /api/movements` — Create movement (protected)

## Sample Register Payload
```json
{
  "username": "john_doe",
  "password": "securePassword123",
  "role": "admin"
}
```

## Technologies Used
- React, React Router DOM, Axios
- Express.js, Mongoose, MongoDB
- JWT for authentication
- bcryptjs for password hashing
- CORS, Morgan

## Deployment
- Backend and frontend can be deployed separately (e.g., Render, Vercel, Netlify)
- Update API URLs in frontend as needed for production

## License
MIT
