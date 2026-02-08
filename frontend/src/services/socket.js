import { io } from 'socket.io-client';

// Initialize Socket.io client
const SOCKET_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

const socket = io(SOCKET_URL, {
  autoConnect: false, // Connect manually when needed
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionAttempts: 5,
});

// Connection event handlers
socket.on('connect', () => {
  console.log('✅ Socket.io connected:', socket.id);
});

socket.on('disconnect', (reason) => {
  console.log('❌ Socket.io disconnected:', reason);
});

socket.on('connect_error', (error) => {
  console.error('Socket.io connection error:', error);
});

export default socket;
