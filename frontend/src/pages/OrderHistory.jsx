import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import '../styles/orderHistory.css';

const OrderHistory = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    
    const fetchOrders = async () => {
      try {
        const res = await fetch('/api/orders/myorders', {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        });
        const data = await res.json();
        setOrders(data.orders || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  if (!user) {
    return (
      <div className="order-history-container">
        <div className="empty-state">
          <h2>Please Login</h2>
          <p>You need to be logged in to view your orders.</p>
          <Link to="/login" className="btn">Go to Login</Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="order-history-container">
        <div className="loading-spinner">Loading your orders...</div>
      </div>
    );
  }

  return (
    <div className="order-history-container">
      <h1>Order History</h1>
      
      {orders.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">📦</span>
          <h2>No Orders Yet</h2>
          <p>Start shopping to see your orders here!</p>
          <Link to="/shop" className="btn">Browse Products</Link>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order._id} className="order-card">
              <div className="order-header">
                <div>
                  <h3>Order #{order._id.slice(-8).toUpperCase()}</h3>
                  <p className="order-date">
                    {new Date(order.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                </div>
                <div className="order-status-wrapper">
                  <span className={`order-status status-${order.status}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>
              </div>

              <div className="order-items">
                {order.products?.map((item, idx) => (
                  <div key={idx} className="order-item">
                    <img 
                      src={item.product?.imageUrl || 'https://via.placeholder.com/80'} 
                      alt={item.product?.name || 'Product'} 
                    />
                    <div className="order-item-info">
                      <h4>{item.product?.name || 'Product'}</h4>
                      <p>Qty: {item.quantity} × ₹{item.price?.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="order-footer">
                <div className="order-address">
                  <strong>Delivered to:</strong>
                  <p>{order.address?.fullname}, {order.address?.city}</p>
                </div>
                <div className="order-total">
                  <strong>Total:</strong>
                  <span className="amount">₹{order.totalAmount?.toFixed(2)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
