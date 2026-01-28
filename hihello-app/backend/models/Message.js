const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  messageType: {
    type: String,
    enum: ['text', 'image', 'video', 'gif', 'emoji', 'sticker', 'voice_note'],
    default: 'text'
  },
  content: {
    type: String,
    required: function() {
      return this.messageType === 'text';
    },
    maxlength: 5000
  },
  mediaUrl: {
    type: String, // URL to the media file (image, video, gif, etc.)
    default: null
  },
  thumbnailUrl: {
    type: String, // URL to the thumbnail of the media
    default: null
  },
  duration: {
    type: Number, // Duration of voice note or video in seconds
    default: null
  },
  readStatus: {
    type: Boolean,
    default: false
  },
  deliveredStatus: {
    type: Boolean,
    default: false
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  reactions: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    reaction: {
      type: String, // emoji or reaction type
      maxlength: 10
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  isDeleted: {
    type: Boolean,
    default: false
  },
  deleteTimestamp: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Index for efficient querying
messageSchema.index({ recipient: 1, timestamp: -1 });
messageSchema.index({ sender: 1, timestamp: -1 });
messageSchema.index({ sender: 1, recipient: 1, timestamp: -1 });

// Method to mark message as read
messageSchema.methods.markAsRead = function() {
  this.readStatus = true;
  return this.save();
};

// Method to mark message as delivered
messageSchema.methods.markAsDelivered = function() {
  this.deliveredStatus = true;
  return this.save();
};

module.exports = mongoose.model('Message', messageSchema);