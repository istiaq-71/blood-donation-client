import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { districts, getUpazilasByDistrict } from '../../utils/districtsUpazilas';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import './CreateDonationRequest.css';

const CreateDonationRequest = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    recipientName: '',
    recipientDistrict: '',
    recipientUpazila: '',
    hospitalName: '',
    fullAddress: '',
    bloodGroup: '',
    donationDate: '',
    donationTime: '',
    requestMessage: ''
  });
  const [loading, setLoading] = useState(false);

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const availableUpazilas = formData.recipientDistrict
    ? getUpazilasByDistrict(formData.recipientDistrict)
    : [];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
      ...(name === 'recipientDistrict' && { recipientUpazila: '' })
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate date is not in the past
    const selectedDate = new Date(formData.donationDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
      toast.error('Donation date cannot be in the past');
      return;
    }
    
    setLoading(true);

    try {
      const response = await api.post('/donation-requests', formData);

      if (response.data.success) {
        toast.success('Donation request created successfully');
        navigate('/dashboard/my-donation-requests');
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || 'Failed to create donation request';
      toast.error(errorMessage);
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-request-page">
      <div className="create-request-card">
        <h2 className="page-title">Create Donation Request</h2>

        <form onSubmit={handleSubmit} className="request-form">
          <div className="form-row">
            <div className="form-group">
              <label>Requester Name</label>
              <input
                type="text"
                value={user?.name || ''}
                disabled
                className="disabled-input"
              />
            </div>

            <div className="form-group">
              <label>Requester Email</label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="disabled-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="recipientName">Recipient Name *</label>
            <input
              type="text"
              id="recipientName"
              name="recipientName"
              value={formData.recipientName}
              onChange={handleChange}
              required
              placeholder="Enter recipient name"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="recipientDistrict">Recipient District *</label>
              <select
                id="recipientDistrict"
                name="recipientDistrict"
                value={formData.recipientDistrict}
                onChange={handleChange}
                required
              >
                <option value="">Select district</option>
                {districts.map((district) => (
                  <option key={district} value={district}>
                    {district}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="recipientUpazila">Recipient Upazila *</label>
              <select
                id="recipientUpazila"
                name="recipientUpazila"
                value={formData.recipientUpazila}
                onChange={handleChange}
                required
                disabled={!formData.recipientDistrict}
              >
                <option value="">Select upazila</option>
                {availableUpazilas.map((upazila) => (
                  <option key={upazila} value={upazila}>
                    {upazila}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="hospitalName">Hospital Name *</label>
            <input
              type="text"
              id="hospitalName"
              name="hospitalName"
              value={formData.hospitalName}
              onChange={handleChange}
              required
              placeholder="e.g., Dhaka Medical College Hospital"
            />
          </div>

          <div className="form-group">
            <label htmlFor="fullAddress">Full Address *</label>
            <input
              type="text"
              id="fullAddress"
              name="fullAddress"
              value={formData.fullAddress}
              onChange={handleChange}
              required
              placeholder="e.g., Zahir Raihan Rd, Dhaka"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="bloodGroup">Blood Group *</label>
              <select
                id="bloodGroup"
                name="bloodGroup"
                value={formData.bloodGroup}
                onChange={handleChange}
                required
              >
                <option value="">Select blood group</option>
                {bloodGroups.map((bg) => (
                  <option key={bg} value={bg}>
                    {bg}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="donationDate">Donation Date *</label>
              <input
                type="date"
                id="donationDate"
                name="donationDate"
                value={formData.donationDate}
                onChange={handleChange}
                required
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div className="form-group">
              <label htmlFor="donationTime">Donation Time *</label>
              <input
                type="time"
                id="donationTime"
                name="donationTime"
                value={formData.donationTime}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="requestMessage">Request Message *</label>
            <textarea
              id="requestMessage"
              name="requestMessage"
              value={formData.requestMessage}
              onChange={handleChange}
              required
              rows="5"
              placeholder="Explain why you need blood in detail..."
            />
          </div>

          <button type="submit" className="btn btn-primary btn-submit" disabled={loading}>
            {loading ? 'Creating Request...' : 'Create Request'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateDonationRequest;

