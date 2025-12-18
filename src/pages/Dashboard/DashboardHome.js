import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import './Dashboard.css';

const DashboardHome = () => {
  const { user } = useAuth();
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
                      <Link
                        to={`/dashboard/my-donation-requests`}
                        className="action-link"
                      >
                        View
                      </Link>
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

