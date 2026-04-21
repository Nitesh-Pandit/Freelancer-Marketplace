import React, { useState, useEffect } from 'react';
import ChatWindow from './ChatWindow';
import './FreelancerOrders.css';

function FreelancerOrders({ user, token }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [activeTab, setActiveTab] = useState('pending');
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
      const response = await fetch('https://freelancer-marketplace-1.onrender.com/api/orders/freelancer/all', {
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

  const handleAcceptOrder = async (orderId) => {
    try {
      const response = await fetch(`https://freelancer-marketplace-1.onrender.com/api/orders/${orderId}/accept`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok) {
        // Update local state
        setOrders(orders.map(order =>
          order._id === orderId ? { ...order, status: 'accepted' } : order
        ));
        // Show chat window for accepted order
        setSelectedOrder({ ...data.order, status: 'accepted' });
      } else {
        setError(data.message || 'Failed to accept order');
      }
    } catch (err) {
      setError('Server error. Please try again.');
      console.error('Accept order error:', err);
    }
  };

  const handleRejectOrder = async (orderId) => {
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
        // Remove from orders list
        setOrders(orders.filter(order => order._id !== orderId));
      } else {
        setError(data.message || 'Failed to reject order');
      }
    } catch (err) {
      setError('Server error. Please try again.');
      console.error('Reject order error:', err);
    }
  };

  if (selectedOrder && selectedOrder.status === 'accepted') {
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
      <div className="freelancer-orders">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading orders...</p>
        </div>
      </div>
    );
  }

  const pendingOrders = orders.filter(order => order.status === 'pending');
  const acceptedOrders = orders.filter(order => order.status === 'accepted');
  const completedOrders = orders.filter(order => order.status === 'completed');
  const cancelledOrders = orders.filter(order => order.status === 'cancelled');

  const getFilteredOrders = () => {
    switch (activeTab) {
      case 'pending':
        return pendingOrders;
      case 'accepted':
        return acceptedOrders;
      case 'completed':
        return completedOrders;
      case 'cancelled':
        return cancelledOrders;
      case 'all':
      default:
        return orders;
    }
  };

  const filteredOrders = getFilteredOrders();
  const totalCount = orders.length;
  const pendingCount = pendingOrders.length;
  const acceptedCount = acceptedOrders.length;
  const completedCount = completedOrders.length;
  const cancelledCount = cancelledOrders.length;

  return (
    <div className="freelancer-orders">
      <div className="orders-header">
        <h2>📦 All Orders</h2>
        <p>Total: {totalCount} {totalCount === 1 ? 'order' : 'orders'}</p>
      </div>

      <div className="filter-tabs">
        <button
          className={`filter-tab ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          All ({totalCount})
        </button>
        <button
          className={`filter-tab ${activeTab === 'pending' ? 'active' : ''}`}
          onClick={() => setActiveTab('pending')}
        >
          Pending ({pendingCount})
        </button>
        <button
          className={`filter-tab ${activeTab === 'accepted' ? 'active' : ''}`}
          onClick={() => setActiveTab('accepted')}
        >
          In Progress ({acceptedCount})
        </button>
        <button
          className={`filter-tab ${activeTab === 'completed' ? 'active' : ''}`}
          onClick={() => setActiveTab('completed')}
        >
          Completed ({completedCount})
        </button>
        <button
          className={`filter-tab ${activeTab === 'cancelled' ? 'active' : ''}`}
          onClick={() => setActiveTab('cancelled')}
        >
          Cancelled ({cancelledCount})
        </button>
      </div>

      {error && (
        <div className="alert alert-error">
          <span>{error}</span>
          <button className="alert-close" onClick={() => setError('')}>✕</button>
        </div>
      )}

      {filteredOrders.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <h3>No Orders</h3>
          <p>{activeTab === 'all' ? 'New clients will appear here when they hire you' : `No ${activeTab} orders yet`}</p>
        </div>
      ) : (
        <div className="orders-list">
          {filteredOrders.map(order => (
            <div key={order._id} className="order-card">
              <div className="order-status">
                <span className={`status-badge ${order.status}`}>
                  {order.status === 'pending' && '⏳ Pending'}
                  {order.status === 'accepted' && '✓ In Progress'}
                  {order.status === 'completed' && '✔ Completed'}
                  {order.status === 'cancelled' && '✕ Cancelled'}
                </span>
              </div>

              <div className="order-client-info">
                <div className="client-avatar">
                  {order.clientId?.name?.charAt(0).toUpperCase() || '?'}
                </div>
                <div className="client-details">
                  <h3 className="client-name">{order.clientId?.name || 'Unknown Client'}</h3>
                  <p className="client-email">{order.clientId?.email || 'N/A'}</p>
                </div>
              </div>

              <div className="order-gig-info">
                <h4 className="gig-title">{order.gigId?.title || 'Unknown Gig'}</h4>
                <p className="gig-meta">Price: <span className="price">${order.price?.toFixed(2) || '0.00'}</span></p>
              </div>

              <div className="order-meta-info">
                <div className="meta-item">
                  <span className="meta-label">Requested</span>
                  <span className="meta-value">
                    {new Date(order.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </div>

              <div className="order-actions">
                {order.status === 'pending' && (
                  <>
                    <button
                      className="accept-btn"
                      onClick={() => handleAcceptOrder(order._id)}
                    >
                      ✓ Accept & Chat
                    </button>
                    <button
                      className="reject-btn"
                      onClick={() => handleRejectOrder(order._id)}
                    >
                      ✕ Decline
                    </button>
                  </>
                )}
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
                {order.status === 'completed' && (
                  <div className="completed-btn">✓ Completed</div>
                )}
                {order.status === 'cancelled' && (
                  <div className="cancelled-btn">✕ Cancelled</div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default FreelancerOrders;
