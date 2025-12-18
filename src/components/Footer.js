import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <h3 className="footer-title">BloodDonation</h3>
            <p className="footer-description">
              Connecting donors with those in need. Together, we can save lives.
            </p>
          </div>

          <div className="footer-section">
            <h4 className="footer-heading">Quick Links</h4>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/donation-requests">Donation Requests</Link></li>
              <li><Link to="/search-donors">Search Donors</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="footer-heading">Account</h4>
            <ul className="footer-links">
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/register">Register</Link></li>
              <li><Link to="/dashboard">Dashboard</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="footer-heading">Contact</h4>
            <ul className="footer-links">
              <li>Email: support@blooddonation.com</li>
              <li>Phone: +880 1234 567890</li>
              <li>Address: Dhaka, Bangladesh</li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} BloodDonation. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

