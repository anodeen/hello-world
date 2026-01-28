import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { SocketProvider } from './contexts/SocketContext';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import MessagesPage from './pages/MessagesPage';
import FriendsPage from './pages/FriendsPage';
import SettingsPage from './pages/SettingsPage';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

function App() {
  const token = localStorage.getItem('token');

  return (
    <AuthProvider>
      <SocketProvider>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route 
                path="/login" 
                element={token ? <Navigate to="/dashboard" /> : <LoginPage />} 
              />
              <Route 
                path="/register" 
                element={token ? <Navigate to="/dashboard" /> : <RegisterPage />} 
              />
              <Route 
                path="/dashboard" 
                element={!token ? <Navigate to="/login" /> : <DashboardPage />} 
              />
              <Route 
                path="/profile" 
                element={!token ? <Navigate to="/login" /> : <ProfilePage />} 
              />
              <Route 
                path="/messages" 
                element={!token ? <Navigate to="/login" /> : <MessagesPage />} 
              />
              <Route 
                path="/friends" 
                element={!token ? <Navigate to="/login" /> : <FriendsPage />} 
              />
              <Route 
                path="/settings" 
                element={!token ? <Navigate to="/login" /> : <SettingsPage />} 
              />
            </Routes>
          </main>
          
          <Footer />
        </div>
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;