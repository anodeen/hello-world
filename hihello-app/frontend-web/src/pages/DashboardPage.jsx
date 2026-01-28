import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { messageAPI } from '../services/api';

const DashboardPage = () => {
  const { currentUser } = useAuth();
  const [recentConversations, setRecentConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await messageAPI.getConversations();
        setRecentConversations(response.data.conversations);
      } catch (error) {
        console.error('Error fetching conversations:', error);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchConversations();
    }
  }, [currentUser]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {currentUser?.firstName}!
        </h1>
        <p className="text-gray-600 mt-2">
          Here's what's happening with your Hihello account today.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column - Recent Activity */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Recent Conversations</h2>
              <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                View all
              </button>
            </div>

            {loading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
              </div>
            ) : recentConversations.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No recent conversations yet.</p>
                <p className="text-gray-400 text-sm mt-2">
                  Start a conversation by sending a message to a friend.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentConversations.map((conversation) => (
                  <div 
                    key={conversation._id} 
                    className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                  >
                    <div className="flex-shrink-0 mr-4">
                      {conversation.user.profilePicture ? (
                        <img
                          src={conversation.user.profilePicture}
                          alt={conversation.user.firstName}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold">
                          {conversation.user.firstName.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className="flex-grow min-w-0">
                      <div className="flex justify-between">
                        <h3 className="font-medium text-gray-900 truncate">
                          {conversation.user.firstName} {conversation.user.lastName}
                        </h3>
                        {conversation.unreadCount > 0 && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                            {conversation.unreadCount}
                          </span>
                        )}
                      </div>
                      <p className="text-gray-500 text-sm truncate">
                        {conversation.lastMessage.content || 'New conversation'}
                      </p>
                      <p className="text-gray-400 text-xs mt-1">
                        {new Date(conversation.lastMessage.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right column - Quick Stats */}
        <div>
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Stats</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Friends</span>
                <span className="font-semibold">12</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Unread Messages</span>
                <span className="font-semibold">3</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Online Friends</span>
                <span className="font-semibold">5</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Today's Greetings</span>
                <span className="font-semibold">7</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <button className="w-full text-left px-4 py-3 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition-colors">
                📧 Send a new message
              </button>
              <button className="w-full text-left px-4 py-3 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition-colors">
                👥 Add a new friend
              </button>
              <button className="w-full text-left px-4 py-3 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition-colors">
                ⚙️ Update profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;