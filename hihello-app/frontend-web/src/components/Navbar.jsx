import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FaBell, FaUser, FaSignOutAlt, FaHome } from 'react-icons/fa';

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-md py-4 px-6 flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center space-x-10">
        <Link to="/" className="text-2xl font-bold text-indigo-600 flex items-center">
          <span className="mr-2">👋</span>
          <span>Hihello</span>
        </Link>
        
        {currentUser && (
          <div className="hidden md:flex space-x-6">
            <Link to="/dashboard" className="text-gray-700 hover:text-indigo-600 font-medium">
              <div className="flex items-center">
                <FaHome className="mr-1" />
                <span>Home</span>
              </div>
            </Link>
            <Link to="/messages" className="text-gray-700 hover:text-indigo-600 font-medium relative">
              Messages
              {/* Uncomment when we implement notifications */}
              {/* <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">3</span> */}
            </Link>
            <Link to="/friends" className="text-gray-700 hover:text-indigo-600 font-medium">
              Friends
            </Link>
          </div>
        )}
      </div>

      <div className="flex items-center space-x-4">
        {currentUser ? (
          <>
            <Link to="/notifications" className="relative text-gray-700 hover:text-indigo-600">
              <FaBell size={20} />
              {/* Uncomment when we implement notifications */}
              {/* <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">3</span> */}
            </Link>
            
            <div className="relative group">
              <button className="flex items-center space-x-2 focus:outline-none">
                {currentUser.profilePicture ? (
                  <img 
                    src={currentUser.profilePicture} 
                    alt="Profile" 
                    className="w-8 h-8 rounded-full object-cover border-2 border-indigo-500"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold">
                    {currentUser.firstName.charAt(0)}
                  </div>
                )}
                <span className="hidden md:inline-block text-gray-700 font-medium">
                  {currentUser.firstName}
                </span>
              </button>
              
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-200 z-20 border border-gray-200">
                <Link 
                  to="/profile" 
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                >
                  <FaUser className="mr-2" /> Profile
                </Link>
                <Link 
                  to="/settings" 
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                >
                  <FaSignOutAlt className="mr-2" /> Logout
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="space-x-3">
            <Link 
              to="/login" 
              className="px-4 py-2 text-gray-700 font-medium hover:text-indigo-600"
            >
              Login
            </Link>
            <Link 
              to="/register" 
              className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 transition-colors"
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;