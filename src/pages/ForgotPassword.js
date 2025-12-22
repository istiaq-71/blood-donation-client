import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './Auth.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const { resetPassword } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await resetPassword(email);
      setEmailSent(true);
    } catch (error) {
      console.error('Password reset error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <Navbar />
      <div className="auth-container">
        <div className="auth-card">
          <h2 className="auth-title">Forgot Password</h2>
          {!emailSent ? (
            <>
              <p className="auth-subtitle">
                Enter your email address and we'll send you a link to reset your password.
              </p>

              <form onSubmit={handleSubmit} className="auth-form">
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="Enter your email"
                  />
                </div>

                <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </form>

              <p className="auth-footer">
                Remember your password? <Link to="/login">Login here</Link>
              </p>
            </>
          ) : (
            <div className="email-sent-message">
              <div className="success-icon">✓</div>
              <h3>Check Your Email</h3>
              <p>
                We've sent a password reset link to <strong>{email}</strong>
              </p>
              <p className="email-sent-note">
                Please check your inbox and click on the link to reset your password.
                If you don't see the email, check your spam folder.
              </p>
              <button
                onClick={() => navigate('/login')}
                className="btn btn-primary btn-full"
                style={{ marginTop: '1rem' }}
              >
                Back to Login
              </button>
              <p className="auth-footer" style={{ marginTop: '1rem' }}>
                Didn't receive the email? <Link to="/forgot-password">Try again</Link>
              </p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ForgotPassword;

