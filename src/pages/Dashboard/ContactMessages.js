import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import './ContactMessages.css';

const ContactMessages = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [unreadCount, setUnreadCount] = useState(0);
  const [filter, setFilter] = useState('all'); // 'all', 'read', 'unread'
  const [selectedMessage, setSelectedMessage] = useState(null);

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchMessages();
    }
  }, [user, currentPage, filter]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const isRead = filter === 'all' ? undefined : filter === 'read' ? 'true' : 'false';
      const response = await api.get('/contact-messages', {
        params: {
          page: currentPage,
          limit: 10,
          ...(isRead !== undefined && { isRead })
        }
      });

      if (response.data.success) {
        setMessages(response.data.data.messages);
        setTotalPages(response.data.data.pagination.totalPages);
        setUnreadCount(response.data.data.unreadCount);
      }
    } catch (error) {
      console.error('Error fetching contact messages:', error);
      toast.error('Failed to load contact messages');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (messageId) => {
    try {
      const response = await api.patch(`/contact-messages/${messageId}/read`);
      if (response.data.success) {
        toast.success('Message marked as read');
        fetchMessages();
        if (selectedMessage?._id === messageId) {
          setSelectedMessage({ ...selectedMessage, isRead: true });
        }
      }
    } catch (error) {
      toast.error('Failed to mark message as read');
    }
  };

  const handleDelete = async (messageId) => {
    if (!window.confirm('Are you sure you want to delete this message?')) {
      return;
    }

    try {
      const response = await api.delete(`/contact-messages/${messageId}`);
      if (response.data.success) {
        toast.success('Message deleted successfully');
        fetchMessages();
        if (selectedMessage?._id === messageId) {
          setSelectedMessage(null);
        }
      }
    } catch (error) {
      toast.error('Failed to delete message');
    }
  };

  const handleViewMessage = (message) => {
    setSelectedMessage(message);
    if (!message.isRead) {
      handleMarkAsRead(message._id);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (user?.role !== 'admin') {
    return (
      <div className="contact-messages-page">
        <div className="error-message">
          <h2>Access Denied</h2>
          <p>Only administrators can view contact messages.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="contact-messages-page">
      <div className="messages-header">
        <div>
          <h2>Contact Messages</h2>
          <p className="messages-subtitle">
            {unreadCount > 0 && (
              <span className="unread-badge">{unreadCount} unread message{unreadCount > 1 ? 's' : ''}</span>
            )}
          </p>
        </div>
        <div className="filter-buttons">
          <button
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => {
              setFilter('all');
              setCurrentPage(1);
            }}
          >
            All
          </button>
          <button
            className={`filter-btn ${filter === 'unread' ? 'active' : ''}`}
            onClick={() => {
              setFilter('unread');
              setCurrentPage(1);
            }}
          >
            Unread
          </button>
          <button
            className={`filter-btn ${filter === 'read' ? 'active' : ''}`}
            onClick={() => {
              setFilter('read');
              setCurrentPage(1);
            }}
          >
            Read
          </button>
        </div>
      </div>

      <div className="messages-container">
        <div className="messages-list">
          {loading ? (
            <div className="loading">Loading messages...</div>
          ) : messages.length === 0 ? (
            <div className="no-messages">No contact messages found.</div>
          ) : (
            messages.map((message) => (
              <div
                key={message._id}
                className={`message-item ${!message.isRead ? 'unread' : ''} ${selectedMessage?._id === message._id ? 'selected' : ''}`}
                onClick={() => handleViewMessage(message)}
              >
                <div className="message-header">
                  <div className="message-sender">
                    <strong>{message.name}</strong>
                    {!message.isRead && <span className="unread-dot"></span>}
                  </div>
                  <span className="message-date">{formatDate(message.createdAt)}</span>
                </div>
                <div className="message-email">{message.email}</div>
                <div className="message-preview">
                  {message.message.length > 100
                    ? `${message.message.substring(0, 100)}...`
                    : message.message}
                </div>
                <div className="message-actions">
                  {!message.isRead && (
                    <button
                      className="btn-mark-read"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMarkAsRead(message._id);
                      }}
                    >
                      Mark as Read
                    </button>
                  )}
                  <button
                    className="btn-delete"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(message._id);
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {selectedMessage && (
          <div className="message-detail">
            <div className="message-detail-header">
              <h3>Message Details</h3>
              <button className="btn-close" onClick={() => setSelectedMessage(null)}>
                ×
              </button>
            </div>
            <div className="message-detail-content">
              <div className="detail-item">
                <strong>From:</strong>
                <span>{selectedMessage.name}</span>
              </div>
              <div className="detail-item">
                <strong>Email:</strong>
                <span>{selectedMessage.email}</span>
              </div>
              <div className="detail-item">
                <strong>Date:</strong>
                <span>{formatDate(selectedMessage.createdAt)}</span>
              </div>
              <div className="detail-item">
                <strong>Status:</strong>
                <span className={selectedMessage.isRead ? 'status-read' : 'status-unread'}>
                  {selectedMessage.isRead ? 'Read' : 'Unread'}
                </span>
              </div>
              <div className="detail-message">
                <strong>Message:</strong>
                <p>{selectedMessage.message}</p>
              </div>
            </div>
            <div className="message-detail-actions">
              {!selectedMessage.isRead && (
                <button
                  className="btn btn-primary"
                  onClick={() => handleMarkAsRead(selectedMessage._id)}
                >
                  Mark as Read
                </button>
              )}
              <button
                className="btn btn-danger"
                onClick={() => handleDelete(selectedMessage._id)}
              >
                Delete Message
              </button>
            </div>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button
            className="pagination-btn"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            Previous
          </button>
          <span className="pagination-info">
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="pagination-btn"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ContactMessages;

