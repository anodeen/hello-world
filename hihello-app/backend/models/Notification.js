const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: [
      'friend_request',
      'friend_request_accepted',
      'message',
      'reaction',
      'mention',
      'system',
      'promotional'
    ],
    required: true
  },
  title: {
    type: String,
    required: true,
    maxlength: 100
  },
  body: {
    type: String,
    required: true,
    maxlength: 500
  },
  data: {
    // Additional data related to the notification
    type: mongoose.Schema.Types.Mixed
  },
  isRead: {
    type: Boolean,
    default: false
  },
  isPushed: {
    type: Boolean,
    default: false
  },
  imageUrl: {
    type: String, // Optional image URL for rich notifications
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  expiresAt: {
    type: Date // When the notification expires
  }
}, {
  timestamps: true
});

// Index for efficient querying
notificationSchema.index({ userId: 1, createdAt: -1 });
notificationSchema.index({ userId: 1, isRead: 1 });
notificationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 30 }); // Expire after 30 days

// Method to mark notification as read
notificationSchema.methods.markAsRead = function() {
  this.isRead = true;
  return this.save();
};

// Method to mark notification as pushed
notificationSchema.methods.markAsPushed = function() {
  this.isPushed = true;
  return this.save();
};

module.exports = mongoose.model('Notification', notificationSchema);