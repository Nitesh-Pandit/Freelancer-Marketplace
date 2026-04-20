import React, { useState, useEffect, useRef } from 'react';
import RatingForm from './RatingForm';
import './ChatWindow.css';

function ChatWindow({ order, user, token, onBack }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [showRatingForm, setShowRatingForm] = useState(false);
  const [orderStatus, setOrderStatus] = useState(order.status);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchMessages();
    markMessagesAsRead();
    // Poll for new messages every 2 seconds
    const interval = setInterval(fetchMessages, 2000);
    return () => clearInterval(interval);
  }, [order._id, token]);

  const markMessagesAsRead = async () => {
    try {
      await fetch(`http://localhost:5000/api/messages/${order._id}/read`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
    } catch (err) {
      console.error('Error marking messages as read:', err);
    }
  };

  const handleCompleteOrder = async () => {
    setCompleting(true);
    try {
      const response = await fetch('http://localhost:5000/api/ratings/complete', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId: order._id,
        }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Server error: ${response.status} - ${errorData}`);
      }

      const data = await response.json();

      if (data.success || data.order) {
        setOrderStatus('completed');
        setShowRatingForm(true);
        setError('');
      } else {
        setError(data.message || 'Failed to complete order');
      }
    } catch (err) {
      setError('Server error. Please try again.');
      console.error('Complete order error:', err);
    } finally {
      setCompleting(false);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/messages/${order._id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setMessages(data.messages || []);
        setError('');
      } else {
        setError(data.message || 'Failed to fetch messages');
      }
    } catch (err) {
      console.error('Fetch messages error:', err);
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!newMessage.trim()) return;

    // Get receiver ID based on user role
    // Handle both cases where clientId/freelancerId might be an object or just an ID string
    const receiverId = user.role === 'freelancer'
      ? (typeof order.clientId === 'object' ? order.clientId._id : order.clientId)
      : (typeof order.freelancerId === 'object' ? order.freelancerId._id : order.freelancerId);

    setSending(true);
    try {
      const response = await fetch('http://localhost:5000/api/messages', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId: order._id,
          receiverId,
          message: newMessage.trim(),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setNewMessage('');
        setMessages([...messages, data.data]);
        setError('');
      } else {
        setError(data.message || 'Failed to send message');
      }
    } catch (err) {
      setError('Server error. Please try again.');
      console.error('Send message error:', err);
    } finally {
      setSending(false);
    }
  };

  const getOtherUserName = () => {
    if (user.role === 'freelancer') {
      // If sender is freelancer, receiver is client
      return typeof order.clientId === 'object' ? order.clientId.name : 'Client';
    } else {
      // If sender is client, receiver is freelancer
      return typeof order.freelancerId === 'object' ? order.freelancerId.name : 'Freelancer';
    }
  };

  const getGigTitle = () => {
    return typeof order.gigId === 'object' ? order.gigId.title : order.gigTitle || 'Gig';
  };

  // Ensure user ID is available for message direction
  const currentUserId = user?._id || user?.id;

  if (loading) {
    return (
      <div className="chat-window">
        <div className="chat-header">
          <button className="back-btn" onClick={onBack}>← Back</button>
          <h2>Loading chat...</h2>
        </div>
        <div className="chat-loading">
          <div className="spinner"></div>
          <p>Loading messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-window">
      {/* CHAT HEADER */}
      <div className="chat-header">
        <button className="back-btn" onClick={onBack}>← Back</button>
        <div className="chat-header-content">
          <h2>{getOtherUserName()}</h2>
          <p className="gig-name">{getGigTitle()}</p>
          <div className="status-container">
            <span className={`status-badge ${orderStatus}`}>
              {orderStatus === 'accepted' ? '✓ Accepted' : orderStatus === 'completed' ? '✓✓ Completed' : orderStatus}
            </span>
            {user.role === 'client' && orderStatus === 'accepted' && (
              <button
                className="complete-btn-header"
                onClick={handleCompleteOrder}
                disabled={completing}
              >
                {completing ? '⏳' : '✓ Mark Complete'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ERROR MESSAGE */}
      {error && (
        <div className="error-banner">
          <span>{error}</span>
          <button className="error-close" onClick={() => setError('')}>✕</button>
        </div>
      )}

      {/* MESSAGES AREA */}
      <div className="chat-messages">
        {messages.length === 0 ? (
          <div className="chat-empty">
            <div className="empty-icon">💬</div>
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((message, index) => (
            <div
              key={message._id || index}
              className={`message ${message.senderId === currentUserId ? 'sent' : 'received'}`}
            >
              <div className="message-bubble">
                <p className="message-text">{message.message}</p>
                <span className="message-time">
                  {new Date(message.createdAt).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* INPUT AREA */}
      {showRatingForm ? (
        <RatingForm
          order={order}
          user={user}
          token={token}
          onBack={onBack}
        />
      ) : (
        <div className="chat-input-area">
          <form onSubmit={handleSendMessage} className="chat-form">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              disabled={sending}
              className="message-input"
              maxLength={500}
            />
            <button
              type="submit"
              disabled={sending || !newMessage.trim()}
              className="send-btn"
            >
              {sending ? '⏳' : '📤'}
            </button>
          </form>
          <p className="char-count">
            {newMessage.length}/500
          </p>
        </div>
      )}
    </div>
  );
}

export default ChatWindow;
