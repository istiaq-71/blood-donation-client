import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import './MyDonationRequests.css';

const MyDonationRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchRequests();
  }, [currentPage, statusFilter]);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const params = {
        myRequests: 'true',
        page: currentPage,
        limit: 10
      };
      if (statusFilter) params.status = statusFilter;

      const response = await api.get('/donation-requests', { params });

      if (response.data.success) {
        setRequests(response.data.data.donationRequests);
        setTotalPages(response.data.data.pagination.totalPages);
      }
    } catch (error) {
      toast.error('Failed to fetch requests');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm('Are you sure you want to delete this donation request? This action cannot be undone.');
    if (confirmed) {
      try {
        await api.delete(`/donation-requests/${id}`);
        toast.success('Donation request deleted successfully');
        fetchRequests();
      } catch (error) {
        const errorMessage = error.response?.data?.message || 'Failed to delete request';
        toast.error(errorMessage);
      }
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.patch(`/donation-requests/${id}/status`, { status: newStatus });
      toast.success('Status updated successfully');
      fetchRequests();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="my-requests-page">
      <div className="page-header">
        <h2>My Donation Requests</h2>
        <Link to="/dashboard/create-donation-request" className="btn btn-primary">
          Create New Request
        </Link>
      </div>

      <div className="filter-section">
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="filter-select"
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="inprogress">In Progress</option>
          <option value="done">Done</option>
          <option value="canceled">Canceled</option>
        </select>
      </div>

      {loading ? (
        <div className="loading">Loading...</div>
      ) : requests.length === 0 ? (
        <div className="no-requests">
          <p>No donation requests found.</p>
        </div>
      ) : (
        <>
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
                {requests.map((request) => (
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

          {totalPages > 1 && (
            <div className="pagination">
              <button
                className="pagination-btn"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <span className="pagination-info">
                Page {currentPage} of {totalPages}
              </span>
              <button
                className="pagination-btn"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MyDonationRequests;

