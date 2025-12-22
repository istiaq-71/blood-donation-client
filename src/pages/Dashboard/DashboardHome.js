import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import './Dashboard.css';

const DashboardHome = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [recentRequests, setRecentRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      if (user?.role === 'admin' || user?.role === 'volunteer') {
        const statsResponse = await api.get('/stats/dashboard');
        if (statsResponse.data.success) {
          setStats(statsResponse.data.data);
        }
      }

      if (user?.role === 'donor') {
        const requestsResponse = await api.get('/donation-requests', {
          params: {
            myRequests: 'true',
            limit: 3
          }
        });
        if (requestsResponse.data.success) {
          setRecentRequests(requestsResponse.data.data.donationRequests);
        }
      }
    } catch (error) {
      toast.error('Failed to fetch dashboard data');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.patch(`/donation-requests/${id}/status`, { status: newStatus });
      toast.success('Status updated successfully');
      fetchDashboardData();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this request?')) {
      try {
        await api.delete(`/donation-requests/${id}`);
        toast.success('Request deleted successfully');
        fetchDashboardData();
      } catch (error) {
        toast.error('Failed to delete request');
      }
    }
  };

  if (loading) {
    return <div className="dashboard-loading">Loading...</div>;
  }

  return (
    <div className="dashboard-home">
      <div className="welcome-section">
        <h2 className="welcome-title">
          Welcome back, {user?.name}! 👋
        </h2>
        <p className="welcome-subtitle">
          Here's what's happening with your account today.
        </p>
      </div>

      {(user?.role === 'admin' || user?.role === 'volunteer') && stats && (
        <div className="stats-cards">
          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-content">
              <h3 className="stat-number">{stats.totalUsers}</h3>
              <p className="stat-label">Total Donors</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">💰</div>
            <div className="stat-content">
              <h3 className="stat-number">${stats.totalFunding.toFixed(2)}</h3>
              <p className="stat-label">Total Funding</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🩸</div>
            <div className="stat-content">
              <h3 className="stat-number">{stats.totalRequests}</h3>
              <p className="stat-label">Total Requests</p>
            </div>
          </div>
        </div>
      )}

      {user?.role === 'donor' && recentRequests.length > 0 && (
        <div className="recent-requests-section">
          <div className="section-header">
            <h3 className="section-title">Recent Donation Requests</h3>
            <Link to="/dashboard/my-donation-requests" className="view-all-link">
              View All
            </Link>
          </div>
          <div className="requests-table-container">
            <table className="requests-table">
              <thead>
                <tr>
                  <th>Recipient Name</th>
                  <th>Location</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Blood Group</th>
                  <th>Status</th>
                  <th>Donor Info</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentRequests.map((request) => (
                  <tr key={request._id}>
                    <td>{request.recipientName}</td>
                    <td>{request.recipientDistrict}, {request.recipientUpazila}</td>
                    <td>{formatDate(request.donationDate)}</td>
                    <td>{request.donationTime}</td>
                    <td>{request.bloodGroup}</td>
                    <td>
                      <span className={`status-badge status-${request.status}`}>
                        {request.status}
                      </span>
                    </td>
                    <td>
                      {request.status === 'inprogress' && request.donorName ? (
                        <div className="donor-info">
                          <p>{request.donorName}</p>
                          <p className="donor-email">{request.donorEmail}</p>
                        </div>
                      ) : (
                        <span className="no-donor">-</span>
                      )}
                    </td>
                    <td>
                      <div className="action-buttons">
                        {request.status === 'inprogress' && (
                          <>
                            <button
                              className="btn-action btn-success"
                              onClick={() => handleStatusChange(request._id, 'done')}
                            >
                              Done
                            </button>
                            <button
                              className="btn-action btn-danger"
                              onClick={() => handleStatusChange(request._id, 'canceled')}
                            >
                              Cancel
                            </button>
                          </>
                        )}
                        <button
                          className="btn-action btn-primary"
                          onClick={() => navigate(`/dashboard/my-donation-requests/edit/${request._id}`)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn-action btn-danger"
                          onClick={() => handleDelete(request._id)}
                        >
                          Delete
                        </button>
                        <button
                          className="btn-action btn-view"
                          onClick={() => navigate(`/donation-requests/${request._id}`)}
                        >
                          View
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Link
            to="/dashboard/my-donation-requests"
            className="btn btn-primary btn-view-all"
          >
            View My All Requests
          </Link>
        </div>
      )}
    </div>
  );
};

export default DashboardHome;

