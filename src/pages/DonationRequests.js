import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './DonationRequests.css';

const DonationRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchRequests();
  }, [currentPage]);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const response = await api.get('/donation-requests', {
        params: {
          pendingOnly: 'true',
          page: currentPage,
          limit: 10
        }
      });

      if (response.data.success) {
        setRequests(response.data.data.donationRequests);
        setTotalPages(response.data.data.pagination.totalPages);
      }
    } catch (error) {
      toast.error('Failed to fetch donation requests');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid Date';
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="donation-requests-page">
      <Navbar />
      <div className="requests-container">
        <h1 className="page-title">Blood Donation Requests</h1>
        <p className="page-subtitle">Urgent blood donation requests from people in need</p>

        {loading ? (
          <div className="loading">Loading...</div>
        ) : requests.length === 0 ? (
          <div className="no-requests">
            <p>No pending donation requests at the moment.</p>
          </div>
        ) : (
          <>
            <div className="requests-grid">
              {requests.map((request) => (
                <div key={request._id} className="request-card">
                  <div className="request-header">
                    <h3 className="request-recipient">{request.recipientName}</h3>
                    <span className={`request-status status-${request.status}`}>
                      {request.status}
                    </span>
                  </div>
                  <div className="request-details">
                    <p className="request-info">
                      <strong>Blood Group:</strong> {request.bloodGroup}
                    </p>
                    <p className="request-info">
                      <strong>Location:</strong> {request.recipientDistrict}, {request.recipientUpazila}
                    </p>
                    <p className="request-info">
                      <strong>Hospital:</strong> {request.hospitalName}
                    </p>
                    <p className="request-info">
                      <strong>Date:</strong> {formatDate(request.donationDate)}
                    </p>
                    <p className="request-info">
                      <strong>Time:</strong> {request.donationTime}
                    </p>
                  </div>
                  <Link
                    to={`/donation-requests/${request._id}`}
                    className="btn btn-primary btn-view"
                  >
                    View Details
                  </Link>
                </div>
              ))}
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
      <Footer />
    </div>
  );
};

export default DonationRequests;

