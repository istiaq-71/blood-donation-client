import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ContactUs from '../components/ContactUs';
import './Home.css';

const Home = () => {
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
          <div className="banner-buttons" data-aos="fade-up" data-aos-delay="300">
            <Link to="/register" className="btn btn-primary">
              Join as a Donor
            </Link>
            <Link to="/search-donors" className="btn btn-secondary">
              Search Donors
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

      {/* Contact Us Section */}
      <ContactUs />

      <Footer />
    </div>
  );
};

export default Home;

