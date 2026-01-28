// Configuration settings for the hihello app backend
require('dotenv').config();

module.exports = {
  // Database configuration
  database: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/hihello',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  },

  // JWT configuration
  jwt: {
    secret: process.env.JWT_SECRET || 'hihello_jwt_secret_key',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  },

  // Server configuration
  server: {
    port: process.env.PORT || 5000,
    host: process.env.HOST || 'localhost'
  },

  // Cloudinary configuration (for image uploads)
  cloudinary: {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  },

  // Push notification configuration
  pushNotifications: {
    fcm_server_key: process.env.FCM_SERVER_KEY
  },

  // Application settings
  app: {
    name: 'Hihello',
    version: '1.0.0',
    description: 'Simple communication platform for friendly interactions'
  }
};