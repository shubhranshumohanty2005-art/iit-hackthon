import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import socket from '../services/socket';
import './Chat.css';

const Chat = ({ asteroidId }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!asteroidId || !user) return;

    // Connect socket
    socket.connect();

    // Set up event listeners
    const handleConnect = () => {
      setIsConnected(true);
      socket.emit('join-asteroid', asteroidId);
    };

    const handleDisconnect = () => {
      setIsConnected(false);
    };

    const handlePreviousMessages = (msgs) => {
      setMessages(msgs);
    };

    const handleNewMessage = (message) => {
      setMessages((prev) => [...prev, message]);
    };

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('previous-messages', handlePreviousMessages);
    socket.on('new-message', handleNewMessage);

    // If already connected, join room
    if (socket.connected) {
      handleConnect();
    }

    // Cleanup
    return () => {
      socket.emit('leave-asteroid', asteroidId);
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('previous-messages', handlePreviousMessages);
      socket.off('new-message', handleNewMessage);
    };
  }, [asteroidId, user]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !user) return;

    socket.emit('send-message', {
      userId: user._id || user.id,
      userName: user.name || user.username,
      asteroidId,
      message: newMessage.trim(),
    });

    setNewMessage('');
  };

  if (!user) {
    return (
      <div className="chat-container">
        <div className="chat-login-prompt">
          <p>Please login to join the discussion</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h3>💬 Discussion</h3>
        <span className={`chat-status ${isConnected ? 'connected' : 'disconnected'}`}>
          {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
        </span>
      </div>

      <div className="chat-messages">
        {messages.length === 0 ? (
          <div className="chat-empty">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg._id}
              className={`chat-message ${
                msg.userId === (user._id || user.id) ? 'own-message' : 'other-message'
              }`}
            >
              <div className="message-header">
                <span className="message-author">{msg.userName}</span>
                <span className="message-time">
                  {new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
              <div className="message-content">{msg.message}</div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <form className="chat-input-form" onSubmit={handleSendMessage}>
        <input
          type="text"
          className="chat-input"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          maxLength={500}
          disabled={!isConnected}
        />
        <button
          type="submit"
          className="chat-send-btn"
          disabled={!newMessage.trim() || !isConnected}
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default Chat;
