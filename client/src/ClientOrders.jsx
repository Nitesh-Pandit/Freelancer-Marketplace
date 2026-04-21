import React, { useState, useEffect } from 'react';
import ChatWindow from './ChatWindow';
import './ClientOrders.css';

function ClientOrders({ user, token }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [unreadMessages, setUnreadMessages] = useState({});

  useEffect(() => {
    fetchOrders();
    // Fetch unread messages every 3 seconds
    const interval = setInterval(fetchUnreadMessages, 3000);
    return () => clearInterval(interval);
  }, [token]);

  const fetchUnreadMessages = async () => {
    try {
      const response = await fetch('https://freelancer-marketplace-1.onrender.com/api/messages/unread', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        // Create a map of order ID to unread count
        const unreadMap = {};
        if (data.unreadByOrder) {
          Object.entries(data.unreadByOrder).forEach(([orderId, count]) => {
            unreadMap[orderId] = count;
          });
        }
        setUnreadMessages(unreadMap);
      }
    } catch (err) {
      console.error('Error fetching unread messages:', err);
    }
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://freelancer-marketplace-1.onrender.com/api/orders/client/my-orders', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setOrders(data.orders || []);
        setError('');
      } else {
        setError(data.message || 'Failed to fetch orders');
      }
    } catch (err) {
      setError('Server error. Please try again.');
      console.error('Fetch orders error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;

    try {
      const response = await fetch(`https://freelancer-marketplace-1.onrender.com/api/orders/${orderId}/cancel`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok) {
        setOrders(orders.map(order =>
          order._id === orderId ? { ...order, status: 'cancelled' } : order
        ));
      } else {
        setError(data.message || 'Failed to cancel order');
      }
    } catch (err) {
      setError('Server error. Please try again.');
      console.error('Cancel order error:', err);
    }
  };

  if (selectedOrder) {
    return (
      <ChatWindow
        order={selectedOrder}
        user={user}
        token={token}
        onBack={() => setSelectedOrder(null)}
      />
    );
  }

  if (loading) {
    return (
      <div className="client-orders">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading your orders...</p>
        </div>
      </div>
    );
  }

  const filteredOrders = filterStatus === 'all'
    ? orders
    : orders.filter(order => order.status === filterStatus);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'pending';
      case 'accepted':
        return 'accepted';
      case 'completed':
        return 'completed';
      case 'cancelled':
        return 'cancelled';
      default:
        return 'pending';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'pending':
        return '⏳ Waiting for Response';
      case 'accepted':
        return '✓ Accepted';
      case 'completed':
        return '✓✓ Completed';
      case 'cancelled':
        return '✕ Cancelled';
      default:
        return status;
    }
  };

  return (
    <div className="client-orders">
      <div className="orders-header">
        <h2>👔 My Hires</h2>
        <p>Track your hired freelancers and projects</p>
      </div>

      {error && (
        <div className="alert alert-error">
          <span>{error}</span>
          <button className="alert-close" onClick={() => setError('')}>✕</button>
        </div>
      )}

      {/* FILTER TABS */}
      <div className="filter-tabs">
        <button
          className={`filter-tab ${filterStatus === 'all' ? 'active' : ''}`}
          onClick={() => setFilterStatus('all')}
        >
          All ({orders.length})
        </button>
        <button
          className={`filter-tab ${filterStatus === 'pending' ? 'active' : ''}`}
          onClick={() => setFilterStatus('pending')}
        >
          Pending ({orders.filter(o => o.status === 'pending').length})
        </button>
        <button
          className={`filter-tab ${filterStatus === 'accepted' ? 'active' : ''}`}
          onClick={() => setFilterStatus('accepted')}
        >
          Active ({orders.filter(o => o.status === 'accepted').length})
        </button>
        <button
          className={`filter-tab ${filterStatus === 'completed' ? 'active' : ''}`}
          onClick={() => setFilterStatus('completed')}
        >
          Completed ({orders.filter(o => o.status === 'completed').length})
        </button>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">💼</div>
          <h3>No {filterStatus !== 'all' ? filterStatus : ''} Hires Yet</h3>
          <p>Start by browsing and hiring freelancers</p>
        </div>
      ) : (
        <div className="orders-grid">
          {filteredOrders.map(order => (
            <div key={order._id} className="order-card">
              <div className="order-header">
                <div className="freelancer-info">
                  <div className="freelancer-avatar">
                    {order.freelancerName.charAt(0).toUpperCase()}
                  </div>
                  <div className="info-text">
                    <h3 className="freelancer-name">{order.freelancerName}</h3>
                    <p className="gig-title">{order.gigTitle}</p>
                  </div>
                </div>
                <span className={`status-badge ${getStatusColor(order.status)}`}>
                  {getStatusLabel(order.status)}
                </span>
              </div>

              <div className="order-details">
                <div className="detail-item">
                  <span className="detail-label">Price</span>
                  <span className="detail-value">${order.price.toFixed(2)}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Ordered</span>
                  <span className="detail-value">
                    {new Date(order.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>
              </div>

              <div className="order-actions">
                {order.status === 'accepted' && (
                  <div className="chat-btn-wrapper">
                    <button
                      className="chat-btn"
                      onClick={() => setSelectedOrder(order)}
                    >
                      💬 Open Chat
                    </button>
                    {unreadMessages[order._id] > 0 && (
                      <span className="unread-badge">{unreadMessages[order._id]}</span>
                    )}
                  </div>
                )}
                {order.status === 'pending' && (
                  <button
                    className="cancel-btn"
                    onClick={() => handleCancelOrder(order._id)}
                  >
                    Cancel Order
                  </button>
                )}
                {order.status === 'completed' && (
                  <button className="completed-btn" disabled>
                    ✓ Completed
                  </button>
                )}
                {order.status === 'cancelled' && (
                  <button className="cancelled-btn" disabled>
                    ✕ Cancelled
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ClientOrders;
