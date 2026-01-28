const express = require('express');
const jwt = require('jsonwebtoken');
const Message = require('../models/Message');
const User = require('../models/User');
const { jwt: jwtConfig } = require('../config/config');
const router = express.Router();

// Send a new message
router.post('/', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const decoded = jwt.verify(token, jwtConfig.secret);
    const senderId = decoded.userId;
    
    const { recipientId, messageType, content, mediaUrl } = req.body;

    // Validate required fields
    if (!recipientId) {
      return res.status(400).json({ message: 'Recipient ID is required' });
    }

    if (!messageType || !['text', 'image', 'video', 'gif', 'emoji', 'sticker', 'voice_note'].includes(messageType)) {
      return res.status(400).json({ message: 'Valid message type is required' });
    }

    if (messageType === 'text' && (!content || content.trim().length === 0)) {
      return res.status(400).json({ message: 'Content is required for text messages' });
    }

    // Check if recipient exists
    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({ message: 'Recipient not found' });
    }

    // Create new message
    const message = new Message({
      sender: senderId,
      recipient: recipientId,
      messageType,
      content: messageType === 'text' ? content : undefined,
      mediaUrl
    });

    await message.save();

    // Populate sender information for response
    await message.populate('sender', '_id username firstName lastName profilePicture');
    await message.populate('recipient', '_id username firstName lastName profilePicture');

    res.status(201).json({
      message: 'Message sent successfully',
      data: message
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ 
      message: 'Error sending message', 
      error: error.message 
    });
  }
});

// Get messages with a specific user
router.get('/conversation/:userId', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const decoded = jwt.verify(token, jwtConfig.secret);
    const currentUserId = decoded.userId;
    const otherUserId = req.params.userId;

    // Validate other user exists
    const otherUser = await User.findById(otherUserId);
    if (!otherUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get messages between these two users
    const messages = await Message.find({
      $or: [
        { sender: currentUserId, recipient: otherUserId },
        { sender: otherUserId, recipient: currentUserId }
      ],
      isDeleted: false
    })
    .populate('sender', '_id username firstName lastName profilePicture')
    .populate('recipient', '_id username firstName lastName profilePicture')
    .sort({ timestamp: -1 })
    .limit(50); // Limit to last 50 messages

    res.json({
      messages: messages.reverse(), // Reverse to show oldest first
      conversationWith: otherUser
    });
  } catch (error) {
    console.error('Get conversation error:', error);
    res.status(500).json({ 
      message: 'Error fetching conversation', 
      error: error.message 
    });
  }
});

// Get recent conversations for a user
router.get('/conversations', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const decoded = jwt.verify(token, jwtConfig.secret);
    const userId = decoded.userId;

    // Get all messages where the user is either sender or recipient
    const messages = await Message.aggregate([
      {
        $match: {
          $or: [
            { sender: userId },
            { recipient: userId }
          ],
          isDeleted: false
        }
      },
      {
        $sort: { timestamp: -1 }
      },
      {
        $group: {
          _id: {
            $cond: [
              { $eq: ['$sender', userId] },
              '$recipient',
              '$sender'
            ]
          },
          lastMessage: { $first: '$$ROOT' },
          unreadCount: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ['$recipient', userId] },
                    { $eq: ['$readStatus', false] }
                  ]
                },
                1,
                0
              ]
            }
          }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $unwind: '$user'
      },
      {
        $project: {
          _id: 1,
          lastMessage: {
            _id: '$lastMessage._id',
            content: '$lastMessage.content',
            messageType: '$lastMessage.messageType',
            mediaUrl: '$lastMessage.mediaUrl',
            timestamp: '$lastMessage.timestamp',
            sender: '$lastMessage.sender'
          },
          unreadCount: 1,
          user: {
            _id: '$user._id',
            username: '$user.username',
            firstName: '$user.firstName',
            lastName: '$user.lastName',
            profilePicture: '$user.profilePicture'
          }
        }
      },
      {
        $sort: { 'lastMessage.timestamp': -1 }
      }
    ]);

    res.json({
      conversations: messages
    });
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({ 
      message: 'Error fetching conversations', 
      error: error.message 
    });
  }
});

// Mark messages as read
router.put('/read/:userId', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const decoded = jwt.verify(token, jwtConfig.secret);
    const currentUserId = decoded.userId;
    const senderId = req.params.userId;

    // Update all unread messages from the sender to the current user
    const result = await Message.updateMany(
      {
        sender: senderId,
        recipient: currentUserId,
        readStatus: false
      },
      {
        readStatus: true
      }
    );

    res.json({
      message: `${result.modifiedCount} messages marked as read`
    });
  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(500).json({ 
      message: 'Error marking messages as read', 
      error: error.message 
    });
  }
});

// Delete a message
router.delete('/:messageId', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const decoded = jwt.verify(token, jwtConfig.secret);
    const userId = decoded.userId;
    const messageId = req.params.messageId;

    // Find the message
    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    // Check if the user is the sender of the message
    if (message.sender.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this message' });
    }

    // Soft delete the message
    message.isDeleted = true;
    message.deleteTimestamp = new Date();
    await message.save();

    res.json({
      message: 'Message deleted successfully'
    });
  } catch (error) {
    console.error('Delete message error:', error);
    res.status(500).json({ 
      message: 'Error deleting message', 
      error: error.message 
    });
  }
});

module.exports = router;