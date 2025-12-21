import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import './DonationHistory.css';

const DonationHistory = () => {
  const { user } = useAuth();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchDonationHistory();
  }, [currentPage, statusFilter]);

  const fetchDonationHistory = async () => {
    setLoading(true);
    try {
      const params = {
        donorId: user?._id,
        page: currentPage,
        limit: 10
      };
      if (statusFilter) params.status = statusFilter;

      const response = await api.get('/donation-requests', { params });

      if (response.data.success) {
        // Filter only requests where current user is the donor
        const myDonations = response.data.data.donationRequests.filter(
          request => {
            const donorId = request.donorId?._id || request.donorId;
            return donorId && donorId.toString() === user?._id?.toString();
          }
        );
        setDonations(myDonations);
        setTotalPages(response.data.data.pagination.totalPages);
      }
    } catch (error) {
      toast.error('Failed to fetch donation history');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return <div className="donation-history-loading">Loading donation history...</div>;
  }

  return (
    <div className="donation-history-page">
      <div className="donation-history-header">
        <h2 className="donation-history-title">My Donation History</h2>
        <p className="donation-history-subtitle">
          View all the blood donations you have made
        </p>
      </div>

      <div className="filter-section">
        <label htmlFor="status-filter">Filter by Status:</label>
        <select
          id="status-filter"
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="filter-select"
        >
          <option value="">All</option>
          <option value="inprogress">In Progress</option>
          <option value="done">Done</option>
          <option value="canceled">Canceled</option>
        </select>
      </div>

      {donations.length === 0 ? (
        <div className="no-donations">
          <p>You haven't made any donations yet.</p>
          <Link to="/donation-requests" className="btn btn-primary">
            Browse Donation Requests
          </Link>
        </div>
      ) : (
        <>
          <div className="donations-table-container">
            <table className="donations-table">
              <thead>
                <tr>
                  <th>Recipient Name</th>
                  <th>Location</th>
                  <th>Blood Group</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {donations.map((donation) => (
                  <tr key={donation._id}>
                    <td>{donation.recipientName}</td>
                    <td>
                      {donation.recipientDistrict}, {donation.recipientUpazila}
                    </td>
                    <td className="blood-group-cell">{donation.bloodGroup}</td>
                    <td>{formatDate(donation.donationDate)}</td>
                    <td>{donation.donationTime}</td>
                    <td>
                      <span className={`status-badge status-${donation.status}`}>
                        {donation.status}
                      </span>
                    </td>
                    <td>
                      <Link
                        to={`/donation-requests/${donation._id}`}
                        className="btn-link"
                      >
                        View Details
                      </Link>
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

export default DonationHistory;

