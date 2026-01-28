import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const HomePage = () => {
  const { currentUser } = useAuth();

  return (
    <div className="min-h-[calc(100vh-140px)] bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Simple, Friendly Communication
          </h1>
          
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Hihello makes it easy to connect with friends and family through quick greetings and messages. 
            Keep in touch without the clutter of complex features.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
            {!currentUser ? (
              <>
                <Link 
                  to="/register" 
                  className="px-8 py-4 bg-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:bg-indigo-700 transition-colors text-lg"
                >
                  Get Started - It's Free
                </Link>
                <Link 
                  to="/login" 
                  className="px-8 py-4 bg-white text-indigo-600 font-semibold rounded-lg shadow-lg border border-indigo-200 hover:bg-indigo-50 transition-colors text-lg"
                >
                  Sign In
                </Link>
              </>
            ) : (
              <Link 
                to="/dashboard" 
                className="px-8 py-4 bg-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:bg-indigo-700 transition-colors text-lg"
              >
                Go to Dashboard
              </Link>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="text-4xl mb-4">💬</div>
              <h3 className="text-xl font-semibold mb-2">Easy Messaging</h3>
              <p className="text-gray-600">
                Send quick messages, photos, and voice notes to stay connected with your contacts.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="text-4xl mb-4">🔒</div>
              <h3 className="text-xl font-semibold mb-2">Privacy Focused</h3>
              <p className="text-gray-600">
                Control who can contact you and manage your privacy settings easily.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="text-4xl mb-4">📱</div>
              <h3 className="text-xl font-semibold mb-2">Cross Platform</h3>
              <p className="text-gray-600">
                Access your conversations on web, iOS, and Android devices seamlessly.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;