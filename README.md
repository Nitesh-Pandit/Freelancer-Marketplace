# Freelancer Marketplace - MERN Stack

A full-stack marketplace application built with MongoDB, Express, React, and Node.js.

## Project Structure

```
├── server/          # Node.js + Express backend
├── client/          # React frontend
└── README.md        # This file
```

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. **Install Server Dependencies**
   ```bash
   cd server
   npm install
   cd ..
   ```

2. **Install Client Dependencies**
   ```bash
   cd client
   npm install
   cd ..
   ```

### Running the Project

**Option 1: Run Both Server and Client Separately**

Terminal 1 - Start the Server:
```bash
cd server
npm run dev
```

Terminal 2 - Start the Client:
```bash
cd client
npm run dev
```

The server will run on `http://localhost:5000` and client on `http://localhost:3000`

## Environment Variables

### Server (.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/freelancer-marketplace
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
```

## API Endpoints

- `GET /api/health` - Health check endpoint

## Technologies Used

- **Frontend**: React 18, Vite, React Router, Axios
- **Backend**: Express, Node.js
- **Database**: MongoDB, Mongoose
- **Authentication**: JWT, bcryptjs
- **Other**: CORS, dotenv

## Development Commands

**Server:**
- `npm start` - Start server in production mode
- `npm run dev` - Start server with nodemon (development mode)

**Client:**
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## License
ISC
