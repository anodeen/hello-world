import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { messageAPI } from '../services/api';

const MessagesPage = () => {
  const { currentUser } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  // Fetch conversations list
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await messageAPI.getConversations();
        setConversations(response.data.conversations);
        
        // If we have conversations, select the first one
        if (response.data.conversations.length > 0) {
          setSelectedConversation(response.data.conversations[0]);
        }
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

  // Fetch messages for selected conversation
  useEffect(() => {
    if (selectedConversation) {
      const fetchMessages = async () => {
        try {
          const response = await messageAPI.getConversation(selectedConversation._id);
          setMessages(response.data.messages);
        } catch (error) {
          console.error('Error fetching messages:', error);
        }
      };

      fetchMessages();
    }
  }, [selectedConversation]);

  // Scroll to bottom of messages
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;

    try {
      // In a real implementation, we would send the message to the backend
      // For now, we'll just add it to the local state
      const messageData = {
        sender: currentUser._id,
        recipient: selectedConversation._id,
        messageType: 'text',
        content: newMessage,
        timestamp: new Date()
      };
      
      // Optimistically add the message to the UI
      setMessages(prev => [...prev, {
        ...messageData,
        sender: currentUser,
        recipient: selectedConversation.user
      }]);
      
      // Clear the input field
      setNewMessage('');
      
      // In a real implementation, we would call the API:
      // await messageAPI.sendMessage(messageData);
    } catch (error) {
      console.error('Error sending message:', error);
      // Remove the optimistic message if there was an error
      setMessages(prev => prev.slice(0, -1));
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex h-[calc(100vh-140px)] bg-gray-50">
      {/* Conversations sidebar */}
      <div className="w-1/3 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Messages</h2>
        </div>
        
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <div className="overflow-y-auto flex-grow">
            {conversations.map((conversation) => (
              <div
                key={conversation._id}
                className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 ${
                  selectedConversation?._id === conversation._id ? 'bg-indigo-50' : ''
                }`}
                onClick={() => setSelectedConversation(conversation)}
              >
                <div className="flex items-center">
                  <div className="flex-shrink-0 mr-3">
                    {conversation.user.profilePicture ? (
                      <img
                        src={conversation.user.profilePicture}
                        alt={conversation.user.firstName}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold">
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
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-600 text-white">
                          {conversation.unreadCount}
                        </span>
                      )}
                    </div>
                    <p className="text-gray-500 text-sm truncate">
                      {conversation.lastMessage.content || 'New conversation'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Chat area */}
      <div className="w-2/3 flex flex-col">
        {selectedConversation ? (
          <>
            {/* Chat header */}
            <div className="bg-white p-4 border-b border-gray-200 flex items-center">
              <div className="flex-shrink-0 mr-3">
                {selectedConversation.user.profilePicture ? (
                  <img
                    src={selectedConversation.user.profilePicture}
                    alt={selectedConversation.user.firstName}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold">
                    {selectedConversation.user.firstName.charAt(0)}
                  </div>
                )}
              </div>
              <div>
                <h3 className="font-medium text-gray-900">
                  {selectedConversation.user.firstName} {selectedConversation.user.lastName}
                </h3>
                <p className="text-sm text-gray-500">Online now</p>
              </div>
            </div>
            
            {/* Messages container */}
            <div className="flex-grow overflow-y-auto p-4 bg-gray-100">
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.sender._id === currentUser._id ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs md:max-w-md px-4 py-2 rounded-lg ${
                        message.sender._id === currentUser._id
                          ? 'bg-indigo-600 text-white'
                          : 'bg-white text-gray-800'
                      }`}
                    >
                      <p>{message.content}</p>
                      <p
                        className={`text-xs mt-1 ${
                          message.sender._id === currentUser._id
                            ? 'text-indigo-200'
                            : 'text-gray-500'
                        }`}
                      >
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </div>
            
            {/* Message input */}
            <div className="bg-white p-4 border-t border-gray-200">
              <form onSubmit={handleSendMessage} className="flex items-center">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-grow border border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
                <button
                  type="submit"
                  className="bg-indigo-600 text-white px-6 py-2 rounded-r-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Send
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-grow flex items-center justify-center bg-gray-100">
            <div className="text-center">
              <div className="text-5xl mb-4">💬</div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">Select a conversation</h3>
              <p className="text-gray-500">Choose a conversation from the list to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagesPage;