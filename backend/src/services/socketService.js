const ChatMessage = require('../models/ChatMessage');

/**
 * Initialize Socket.io for real-time chat
 */
const initSocketService = (io) => {
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);
    
    // Join asteroid-specific room
    socket.on('join-asteroid', async (asteroidId) => {
      socket.join(`asteroid-${asteroidId}`);
      console.log(`User ${socket.id} joined asteroid room: ${asteroidId}`);
      
      // Send recent messages
      try {
        const messages = await ChatMessage.find({ asteroidId })
          .sort({ createdAt: -1 })
          .limit(50)
          .populate('userId', 'name');
        
        socket.emit('previous-messages', messages.reverse());
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    });
    
    // Leave asteroid room
    socket.on('leave-asteroid', (asteroidId) => {
      socket.leave(`asteroid-${asteroidId}`);
      console.log(`User ${socket.id} left asteroid room: ${asteroidId}`);
    });
    
    // Handle new message
    socket.on('send-message', async (data) => {
      try {
        const { userId, userName, asteroidId, message } = data;
        
        // Save message to database
        const chatMessage = await ChatMessage.create({
          userId,
          userName,
          asteroidId,
          message,
        });
        
        // Broadcast to all users in the asteroid room
        io.to(`asteroid-${asteroidId}`).emit('new-message', {
          _id: chatMessage._id,
          userId,
          userName,
          asteroidId,
          message,
          createdAt: chatMessage.createdAt,
        });
      } catch (error) {
        console.error('Error sending message:', error);
        socket.emit('message-error', { error: 'Failed to send message' });
      }
    });
    
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
};

module.exports = { initSocketService };
