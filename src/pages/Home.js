import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ContactUs from '../components/ContactUs';
import './Home.css';

const Home = () => {
  const [imageError, setImageError] = useState(false);
  const [imageSrc, setImageSrc] = useState('https://i.imgur.com/5Ml6Krl.jpg');

  const handleImageError = () => {
    if (!imageError) {
      // Try alternative formats
      setImageSrc('https://imgur.com/a/5Ml6Krl.jpg');
      setImageError(true);
    } else {
      // Use placeholder
      setImageSrc('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImciIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiM2NjdmZmYiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiM0YzYzZGIiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0idXJsKCNnKSIvPjx0ZXh0IHg9IjUwJSIgeT0iNDAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LXdlaWdodD0iYm9sZCI+TUQgSVNUSUFRIEhPU1NBSU48L3RleHQ+PHRleHQgeD0iNTAlIiB5PSI2MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIG9wYWNpdHk9IjAuOSI+Rk9VTkRFUiAmIENFTzwvdGV4dD48L3N2Zz4=');
    }
  };

  return (
    <div className="home">
      <Navbar />
      
      {/* Banner Section */}
      <section className="banner">
        <div className="banner-content">
          <h1 className="banner-title">Save Lives, Donate Blood</h1>
          <p className="banner-subtitle">
            Your single donation can save up to three lives. Join our community of heroes today.
          </p>
          <div className="banner-buttons">
            <Link to="/register" className="btn btn-primary">
              Join as a Donor
            </Link>
            <Link to="/search-donors" className="btn btn-secondary">
              Search Donors
            </Link>
            <Link to="/funding" className="btn btn-secondary">
              Funding
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Section */}
      <section className="featured-section">
        <div className="container">
          <h2 className="section-title">Why Donate Blood?</h2>
          <div className="features-grid">
            <div className="feature-card" data-aos="fade-up">
              <div className="feature-icon">❤️</div>
              <h3 className="feature-title">Save Lives</h3>
              <p className="feature-description">
                Your blood donation can save up to three lives. Every donation makes a difference.
              </p>
            </div>
            <div className="feature-card" data-aos="fade-up" data-aos-delay="100">
              <div className="feature-icon">🔄</div>
              <h3 className="feature-title">Regular Updates</h3>
              <p className="feature-description">
                Stay updated with urgent blood donation requests in your area.
              </p>
            </div>
            <div className="feature-card" data-aos="fade-up" data-aos-delay="200">
              <div className="feature-icon">🤝</div>
              <h3 className="feature-title">Community Support</h3>
              <p className="feature-description">
                Join a community of compassionate donors helping those in need.
              </p>
            </div>
            <div className="feature-card" data-aos="fade-up" data-aos-delay="300">
              <div className="feature-icon">⚡</div>
              <h3 className="feature-title">Quick Process</h3>
              <p className="feature-description">
                Simple registration and easy donation request process.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-card" data-aos="zoom-in">
              <div className="stat-number">1000+</div>
              <div className="stat-label">Active Donors</div>
            </div>
            <div className="stat-card" data-aos="zoom-in" data-aos-delay="100">
              <div className="stat-number">500+</div>
              <div className="stat-label">Lives Saved</div>
            </div>
            <div className="stat-card" data-aos="zoom-in" data-aos-delay="200">
              <div className="stat-number">200+</div>
              <div className="stat-label">Donation Requests</div>
            </div>
          </div>
        </div>
      </section>

      {/* CEO Section */}
      <section className="ceo-section">
        <div className="container">
          <div className="ceo-content" data-aos="fade-up">
            <div className="ceo-image-wrapper">
              <img 
                src={imageSrc}
                alt="Md Istiaq Hossain"
                className="ceo-image"
                onError={handleImageError}
                loading="lazy"
              />
              <div className="ceo-image-overlay"></div>
            </div>
            <div className="ceo-info">
              <div className="ceo-badge">👑 Founder & CEO</div>
              <h2 className="ceo-name">Md Istiaq Hossain</h2>
              <p className="ceo-title">Founder And CEO of the Project</p>
              <div className="ceo-divider"></div>
              <p className="ceo-message">
                "Every drop of blood you donate is a lifeline for someone in need. Together, we can build a community where compassion flows as freely as the blood that saves lives. Your generosity today can give someone a tomorrow. Join us in this noble mission to make a real difference, one donation at a time."
              </p>
              <div className="ceo-contact">
                <a href="tel:+8801851880178" className="ceo-phone">
                  <span className="phone-icon">📞</span>
                  <span>01851880178</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Us Section */}
      <ContactUs />

      <Footer />
    </div>
  );
};

export default Home;

