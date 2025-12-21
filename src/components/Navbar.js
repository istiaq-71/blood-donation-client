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
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div 
          className="navbar-logo"
          onClick={() => navigate('/')}
          style={{ cursor: 'pointer' }}
        >
          <span className="logo-icon">🩸</span>
          <span className="logo-text">BloodDonation</span>
        </div>

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
                    src={user.avatar || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjZTVlN2ViIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiIgZmlsbD0iIzljYTNhZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPlVzZXI8L3RleHQ+PC9zdmc+'}
                    alt={user.name}
                    className="navbar-avatar"
                    onError={(e) => {
                      e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjZTVlN2ViIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiIgZmlsbD0iIzljYTNhZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPlVzZXI8L3RleHQ+PC9zdmc+';
                    }}
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

