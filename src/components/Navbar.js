import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiMenu, FiX, FiUser, FiLogOut, FiLayout } from 'react-icons/fi';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
      setUserMenuOpen(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">🩸</span>
          <span className="logo-text">BloodDonation</span>
        </Link>

        <div className="navbar-menu">
          <Link to="/donation-requests" className="navbar-link">
            Donation Requests
          </Link>
          
          {user ? (
            <>
              <Link to="/funding" className="navbar-link">
                Funding
              </Link>
              <div className="navbar-user-menu">
                <button
                  className="navbar-user-button"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                >
                  <img
                    src={user.avatar || 'https://via.placeholder.com/40'}
                    alt={user.name}
                    className="navbar-avatar"
                  />
                  <span className="navbar-user-name">{user.name}</span>
                </button>
                {userMenuOpen && (
                  <div className="navbar-dropdown">
                    <Link
                      to="/dashboard"
                      className="navbar-dropdown-item"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <FiLayout /> Dashboard
                    </Link>
                    <button
                      className="navbar-dropdown-item"
                      onClick={() => {
                        handleLogout();
                        setUserMenuOpen(false);
                      }}
                    >
                      <FiLogOut /> Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar-link">
                Login
              </Link>
            </>
          )}
        </div>

        <button
          className="navbar-mobile-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="navbar-mobile-menu">
          <Link
            to="/donation-requests"
            className="navbar-mobile-link"
            onClick={() => setMobileMenuOpen(false)}
          >
            Donation Requests
          </Link>
          {user ? (
            <>
              <Link
                to="/funding"
                className="navbar-mobile-link"
                onClick={() => setMobileMenuOpen(false)}
              >
                Funding
              </Link>
              <Link
                to="/dashboard"
                className="navbar-mobile-link"
                onClick={() => setMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
              <button
                className="navbar-mobile-link"
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="navbar-mobile-link"
              onClick={() => setMobileMenuOpen(false)}
            >
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;

