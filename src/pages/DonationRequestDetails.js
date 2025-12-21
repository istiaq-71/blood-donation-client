import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './DonationRequestDetails.css';

const DonationRequestDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDonateModal, setShowDonateModal] = useState(false);
  const [donating, setDonating] = useState(false);
  const [donorPhone, setDonorPhone] = useState('');

  useEffect(() => {
    fetchRequest();
  }, [id]);

  const fetchRequest = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/donation-requests/${id}`);
      if (response.data.success) {
        setRequest(response.data.data.donationRequest);
      }
    } catch (error) {
      toast.error('Failed to fetch request details');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDonate = async () => {
    if (!donorPhone.trim()) {
      toast.error('Please enter your phone number');
      return;
    }

    // Basic phone validation
    const phoneRegex = /^[0-9]{10,15}$/;
    if (!phoneRegex.test(donorPhone.replace(/[\s-]/g, ''))) {
      toast.error('Please enter a valid phone number');
      return;
    }

    setDonating(true);
    try {
      const response = await api.post(`/donation-requests/${id}/donate`, {
        phone: donorPhone.trim()
      });
      if (response.data.success) {
        toast.success('Donation confirmed successfully! The requester has been notified.');
        setShowDonateModal(false);
        setDonorPhone('');
        fetchRequest();
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to confirm donation';
      toast.error(errorMessage);
    } finally {
      setDonating(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="details-page">
        <Navbar />
        <div className="loading">Loading...</div>
        <Footer />
      </div>
    );
  }

  if (!request) {
    return (
      <div className="details-page">
        <Navbar />
        <div className="error">Request not found</div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="details-page">
      <Navbar />
      <div className="details-container">
        <div className="details-card">
          <h1 className="details-title">Donation Request Details</h1>

          <div className="details-content">
            <div className="detail-section">
              <h3>Recipient Information</h3>
              <div className="detail-grid">
                <div className="detail-item">
                  <strong>Recipient Name:</strong>
                  <span>{request.recipientName}</span>
                </div>
                <div className="detail-item">
                  <strong>Location:</strong>
                  <span>{request.recipientDistrict}, {request.recipientUpazila}</span>
                </div>
                <div className="detail-item">
                  <strong>Hospital:</strong>
                  <span>{request.hospitalName}</span>
                </div>
                <div className="detail-item">
                  <strong>Full Address:</strong>
                  <span>{request.fullAddress}</span>
                </div>
              </div>
            </div>

            <div className="detail-section">
              <h3>Donation Details</h3>
              <div className="detail-grid">
                <div className="detail-item">
                  <strong>Blood Group:</strong>
                  <span className="blood-group">{request.bloodGroup}</span>
                </div>
                <div className="detail-item">
                  <strong>Date:</strong>
                  <span>{formatDate(request.donationDate)}</span>
                </div>
                <div className="detail-item">
                  <strong>Time:</strong>
                  <span>{request.donationTime}</span>
                </div>
                <div className="detail-item">
                  <strong>Status:</strong>
                  <span className={`status-badge status-${request.status}`}>
                    {request.status}
                  </span>
                </div>
              </div>
            </div>

            <div className="detail-section">
              <h3>Request Message</h3>
              <p className="request-message">{request.requestMessage}</p>
            </div>

            {request.status === 'inprogress' && request.donorName && (
              <div className="detail-section">
                <h3>Donor Information</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <strong>Donor Name:</strong>
                    <span>{request.donorName}</span>
                  </div>
                  <div className="detail-item">
                    <strong>Donor Email:</strong>
                    <span>{request.donorEmail}</span>
                  </div>
                  {request.donorPhone && (
                    <div className="detail-item">
                      <strong>Donor Phone:</strong>
                      <span>{request.donorPhone}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {request.status === 'pending' && user && (
              <div className="donate-section">
                <button
                  className="btn btn-primary btn-donate"
                  onClick={() => setShowDonateModal(true)}
                >
                  Donate Blood
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {showDonateModal && (
        <div className="modal-overlay" onClick={() => setShowDonateModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">Confirm Donation</h2>
            <div className="modal-body">
              <div className="form-group">
                <label>Donor Name</label>
                <input type="text" value={user?.name || ''} disabled className="disabled-input" />
              </div>
              <div className="form-group">
                <label>Donor Email</label>
                <input type="email" value={user?.email || ''} disabled className="disabled-input" />
              </div>
              <div className="form-group">
                <label>Phone Number <span style={{ color: 'red' }}>*</span></label>
                <input 
                  type="tel" 
                  value={donorPhone}
                  onChange={(e) => setDonorPhone(e.target.value)}
                  placeholder="Enter your phone number"
                  className="form-input"
                  required
                />
                <small style={{ color: '#666', fontSize: '0.875rem', marginTop: '0.25rem', display: 'block' }}>
                  The requester will be notified with your contact information
                </small>
              </div>
              <p className="modal-message">
                Are you sure you want to donate blood for this request? The requester will be notified immediately.
              </p>
            </div>
            <div className="modal-actions">
              <button
                className="btn btn-secondary"
                onClick={() => {
                  setShowDonateModal(false);
                  setDonorPhone('');
                }}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={handleDonate}
                disabled={donating || !donorPhone.trim()}
              >
                {donating ? 'Confirming...' : 'Confirm Donation'}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default DonationRequestDetails;

