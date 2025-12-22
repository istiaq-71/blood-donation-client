import React, { useState } from 'react';
import toast from 'react-hot-toast';
import api from '../utils/api';
import './ContactUs.css';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post('/contact-messages', formData);
      if (response.data.success) {
        toast.success(response.data.message || 'Thank you for your message! We will get back to you soon.');
        setFormData({ name: '', email: '', message: '' });
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to send message. Please try again.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="contact-section">
      <div className="container">
        <h2 className="section-title">Contact Us</h2>
        <div className="contact-content">
          <div className="contact-info">
            <h3>Get in Touch</h3>
            <p>Have questions or need assistance? We're here to help! Please use the form below to send us a message. All messages will be received in our admin panel.</p>
            <div className="contact-details">
              <div className="contact-item">
                <strong>Email:</strong>
                <span>
                  <a href="mailto:istiaqhossain71@gmail.com" style={{ color: 'var(--primary-color)', textDecoration: 'none' }}>
                    istiaqhossain71@gmail.com
                  </a>
                </span>
                <small style={{ display: 'block', color: 'var(--text-light)', marginTop: '0.25rem', fontSize: '0.85rem' }}>
                  (Please use the form below to ensure your message reaches us)
                </small>
              </div>
              <div className="contact-item">
                <strong>Phone:</strong>
                <span>
                  <a href="tel:+8801851880178" style={{ color: 'var(--primary-color)', textDecoration: 'none' }}>
                    +8801851880178
                  </a>
                </span>
              </div>
              <div className="contact-item">
                <strong>Address:</strong>
                <span>Magura, Khulna, Bangladesh</span>
              </div>
            </div>
          </div>
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                rows="5"
                value={formData.message}
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactUs;

