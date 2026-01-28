# Hihello Web Application

The web application for the Hihello communication platform, built with React and Vite.

## Features

- User authentication (login/register)
- Real-time messaging
- Friend connections
- Profile management
- Responsive design for all devices

## Tech Stack

- React 18
- Vite
- Tailwind CSS
- React Router v6
- Axios for API calls
- Socket.io client for real-time features

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root of the frontend-web directory with the following:
```env
VITE_API_BASE_URL=http://localhost:5000
```

3. Start the development server:
```bash
npm run dev
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally

## Folder Structure

```
src/
├── components/     # Reusable UI components
├── contexts/       # React contexts for state management
├── pages/          # Page components
├── services/       # API services and utilities
├── utils/          # Utility functions
├── assets/         # Images, icons, etc.
├── App.jsx         # Main application component
├── main.jsx        # Entry point
└── index.css       # Global styles
```

## API Integration

The app communicates with the backend API at `/api` endpoints. Make sure the backend server is running on port 5000 when developing locally.