import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleScrollToContact = (e) => {
    e.preventDefault();
    if (location.pathname === '/') {
      const contactSection = document.querySelector('.contact-section');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else {
      navigate('/');
      setTimeout(() => {
        const contactSection = document.querySelector('.contact-section');
        if (contactSection) {
          contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 300);
    }
  };

  const handleRegisterClick = (e) => {
    e.preventDefault();
    if (location.pathname === '/') {
      const contactSection = document.querySelector('.contact-section');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else {
      navigate('/');
      setTimeout(() => {
        const contactSection = document.querySelector('.contact-section');
        if (contactSection) {
          contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 300);
    }
  };

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
              <li>
                <a href="/#contact" onClick={handleScrollToContact} style={{ cursor: 'pointer', textDecoration: 'none', color: 'inherit' }}>
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="footer-heading">Account</h4>
            <ul className="footer-links">
              <li><Link to="/login">Login</Link></li>
              <li>
                <a 
                  href="/register" 
                  onClick={handleRegisterClick}
                  style={{ cursor: 'pointer', textDecoration: 'none', color: 'inherit' }}
                >
                  Register
                </a>
              </li>
              <li><Link to="/dashboard">Dashboard</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="footer-heading">Contact</h4>
            <ul className="footer-links">
              <li>
                <a href="mailto:istiaqhossain71@gmail.com" style={{ color: 'inherit', textDecoration: 'none' }}>
                  Email: istiaqhossain71@gmail.com
                </a>
              </li>
              <li>
                <a href="tel:+8801851880178" style={{ color: 'inherit', textDecoration: 'none' }}>
                  Phone: +8801851880178
                </a>
              </li>
              <li>Address: Magura, Khulna, Bangladesh</li>
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
