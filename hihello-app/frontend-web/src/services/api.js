import axios from 'axios';

// Create an axios instance with base configuration
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://api.hihello-app.com' 
  : 'http://localhost:5000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors globally
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear auth data and redirect to login
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Authentication endpoints
export const authAPI = {
  login: (email, password) => apiClient.post('/api/users/login', { email, password }),
  register: (userData) => apiClient.post('/api/users/register', userData),
  getProfile: () => apiClient.get('/api/users/profile'),
  updateProfile: (profileData) => apiClient.put('/api/users/profile', profileData),
  searchUsers: (query, limit = 10, page = 1) => 
    apiClient.get(`/api/users/search?q=${query}&limit=${limit}&page=${page}`)
};

// Message endpoints
export const messageAPI = {
  sendMessage: (messageData) => apiClient.post('/api/messages', messageData),
  getConversation: (userId) => apiClient.get(`/api/messages/conversation/${userId}`),
  getConversations: () => apiClient.get('/api/messages/conversations'),
  markAsRead: (userId) => apiClient.put(`/api/messages/read/${userId}`),
  deleteMessage: (messageId) => apiClient.delete(`/api/messages/${messageId}`)
};

// Notification endpoints
export const notificationAPI = {
  getNotifications: () => apiClient.get('/api/notifications'),
  getUnreadCount: () => apiClient.get('/api/notifications/unread/count'),
  markAsRead: (notificationId) => apiClient.put(`/api/notifications/read/${notificationId}`),
  markAllAsRead: () => apiClient.put('/api/notifications/read-all')
};

export default apiClient;