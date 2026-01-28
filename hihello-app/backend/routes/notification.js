const express = require('express');
const jwt = require('jsonwebtoken');
const Notification = require('../models/Notification');
const User = require('../models/User');
const { jwt: jwtConfig } = require('../config/config');
const router = express.Router();

// Get user notifications
router.get('/', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const decoded = jwt.verify(token, jwtConfig.secret);
    const userId = decoded.userId;

    // Get notifications for the user
    const notifications = await Notification.find({ userId })
      .sort({ createdAt: -1 })
      .limit(50); // Limit to last 50 notifications

    res.json({
      notifications
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ 
      message: 'Error fetching notifications', 
      error: error.message 
    });
  }
});

// Get unread notifications count
router.get('/unread/count', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const decoded = jwt.verify(token, jwtConfig.secret);
    const userId = decoded.userId;

    // Count unread notifications
    const count = await Notification.countDocuments({ 
      userId, 
      isRead: false 
    });

    res.json({
      count
    });
  } catch (error) {
    console.error('Get unread notifications count error:', error);
    res.status(500).json({ 
      message: 'Error fetching unread notifications count', 
      error: error.message 
    });
  }
});

// Mark notification as read
router.put('/read/:notificationId', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const decoded = jwt.verify(token, jwtConfig.secret);
    const userId = decoded.userId;
    const notificationId = req.params.notificationId;

    // Find the notification
    const notification = await Notification.findOne({ 
      _id: notificationId, 
      userId 
    });

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    // Mark as read
    notification.isRead = true;
    await notification.save();

    res.json({
      message: 'Notification marked as read',
      notification
    });
  } catch (error) {
    console.error('Mark notification as read error:', error);
    res.status(500).json({ 
      message: 'Error marking notification as read', 
      error: error.message 
    });
  }
});

// Mark all notifications as read
router.put('/read-all', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const decoded = jwt.verify(token, jwtConfig.secret);
    const userId = decoded.userId;

    // Update all unread notifications to read
    const result = await Notification.updateMany(
      { 
        userId, 
        isRead: false 
      },
      { 
        isRead: true 
      }
    );

    res.json({
      message: `${result.modifiedCount} notifications marked as read`
    });
  } catch (error) {
    console.error('Mark all notifications as read error:', error);
    res.status(500).json({ 
      message: 'Error marking all notifications as read', 
      error: error.message 
    });
  }
});

// Create a new notification (typically called internally by other services)
router.post('/', async (req, res) => {
  try {
    // This endpoint would typically only be accessible internally
    // or have special authorization for admin/push services
    
    const { userId, type, title, body, data, imageUrl } = req.body;

    // Validate required fields
    if (!userId || !type || !title || !body) {
      return res.status(400).json({ 
        message: 'User ID, type, title, and body are required' 
      });
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Create new notification
    const notification = new Notification({
      userId,
      type,
      title,
      body,
      data,
      imageUrl
    });

    await notification.save();

    res.status(201).json({
      message: 'Notification created successfully',
      notification
    });
  } catch (error) {
    console.error('Create notification error:', error);
    res.status(500).json({ 
      message: 'Error creating notification', 
      error: error.message 
    });
  }
});

module.exports = router;