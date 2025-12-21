import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import './AllBloodDonationRequests.css';

const AllBloodDonationRequests = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchRequests();
  }, [currentPage, statusFilter]);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const params = {
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

  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.patch(`/donation-requests/${id}/status`, { status: newStatus });
      toast.success('Status updated successfully');
      fetchRequests();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this request?')) {
      try {
        await api.delete(`/donation-requests/${id}`);
        toast.success('Request deleted successfully');
        fetchRequests();
      } catch (error) {
        toast.error('Failed to delete request');
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const canEdit = user?.role === 'admin';
  const canUpdateStatus = user?.role === 'admin' || user?.role === 'volunteer';

  return (
    <div className="all-requests-page">
      <div className="page-header">
        <h2>All Blood Donation Requests</h2>
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
      </div>

      {loading ? (
        <div className="loading">Loading...</div>
      ) : requests.length === 0 ? (
        <div className="no-requests">No requests found.</div>
      ) : (
        <>
          <div className="requests-table-container">
            <table className="requests-table">
              <thead>
                <tr>
                  <th>Recipient Name</th>
                  <th>Requester</th>
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
                    <td>{request.requesterName}</td>
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
                        {canUpdateStatus && (
                          <select
                            value={request.status}
                            onChange={(e) => handleStatusChange(request._id, e.target.value)}
                            className="status-select"
                          >
                            <option value="pending">Pending</option>
                            <option value="inprogress">In Progress</option>
                            <option value="done">Done</option>
                            <option value="canceled">Canceled</option>
                          </select>
                        )}
                        {canEdit && (
                          <>
                            <button
                              className="btn-action btn-primary"
                              onClick={() => {
                                // Admin can edit any request, requester can edit their own
                                if (user?.role === 'admin' || request.requesterId?._id === user?._id || request.requesterId === user?._id) {
                                  navigate(`/dashboard/my-donation-requests/edit/${request._id}`);
                                } else {
                                  toast.error('You can only edit your own requests');
                                }
                              }}
                            >
                              Edit
                            </button>
                            <button
                              className="btn-action btn-danger"
                              onClick={() => {
                                // Admin can delete any request, requester can delete their own
                                if (user?.role === 'admin' || request.requesterId?._id === user?._id || request.requesterId === user?._id) {
                                  handleDelete(request._id);
                                } else {
                                  toast.error('You can only delete your own requests');
                                }
                              }}
                            >
                              Delete
                            </button>
                            <button
                              className="btn-action btn-view"
                              onClick={() => navigate(`/donation-requests/${request._id}`)}
                            >
                              View
                            </button>
                          </>
                        )}
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

export default AllBloodDonationRequests;

