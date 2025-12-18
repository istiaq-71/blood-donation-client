import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import './Funding.css';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const PaymentForm = ({ amount, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);
    try {
      // Create payment intent
      const response = await api.post('/funding/create-payment-intent', { amount });
      
      if (response.data.success) {
        const { clientSecret } = response.data.data;
        
        // Confirm payment
        const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: elements.getElement(CardElement),
          }
        });

        if (error) {
          toast.error(error.message);
        } else if (paymentIntent.status === 'succeeded') {
          // Save funding record
          await api.post('/funding/confirm', {
            paymentIntentId: paymentIntent.id,
            amount
          });
          toast.success('Payment successful! Thank you for your donation.');
          onSuccess();
        }
      }
    } catch (error) {
      toast.error('Payment failed. Please try again.');
      console.error('Payment error:', error);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="payment-form">
      <div className="form-group">
        <label>Card Details</label>
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                  color: '#aab7c4',
                },
              },
            },
          }}
        />
      </div>
      <button
        type="submit"
        className="btn btn-primary btn-pay"
        disabled={!stripe || processing}
      >
        {processing ? 'Processing...' : `Pay $${amount}`}
      </button>
    </form>
  );
};

const Funding = () => {
  const [fundings, setFundings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [donationAmount, setDonationAmount] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchFundings();
  }, [currentPage]);

  const fetchFundings = async () => {
    setLoading(true);
    try {
      const response = await api.get('/funding', {
        params: {
          page: currentPage,
          limit: 10
        }
      });

      if (response.data.success) {
        setFundings(response.data.data.fundings);
        setTotalPages(response.data.data.pagination.totalPages);
      }
    } catch (error) {
      toast.error('Failed to fetch funding records');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDonate = () => {
    const amount = parseFloat(donationAmount);
    if (!amount || isNaN(amount)) {
      toast.error('Please enter a valid amount');
      return;
    }
    if (amount < 1) {
      toast.error('Minimum donation amount is $1');
      return;
    }
    if (amount > 10000) {
      toast.error('Maximum donation amount is $10,000');
      return;
    }
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = () => {
    setShowPaymentModal(false);
    setDonationAmount('');
    fetchFundings();
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="funding-page">
      <div className="page-header">
        <h2>Funding</h2>
        <button
          className="btn btn-primary"
          onClick={() => {
            const amount = parseFloat(donationAmount);
            if (amount && amount >= 1) {
              handleDonate();
            } else {
              const input = prompt('Enter donation amount (minimum $1):');
              if (input) {
                setDonationAmount(input);
                handleDonate();
              }
            }
          }}
        >
          Give Fund
        </button>
      </div>

      <div className="donation-input-section">
        <div className="input-group">
          <label>Donation Amount ($)</label>
          <input
            type="number"
            min="1"
            step="0.01"
            value={donationAmount}
            onChange={(e) => setDonationAmount(e.target.value)}
            placeholder="Enter amount"
            className="amount-input"
          />
          <button
            className="btn btn-primary"
            onClick={handleDonate}
            disabled={!donationAmount || parseFloat(donationAmount) < 1}
          >
            Donate
          </button>
        </div>
      </div>

      <div className="fundings-section">
        <h3 className="section-title">Funding History</h3>
        {loading ? (
          <div className="loading">Loading...</div>
        ) : fundings.length === 0 ? (
          <div className="no-fundings">No funding records found.</div>
        ) : (
          <>
            <div className="fundings-table-container">
              <table className="fundings-table">
                <thead>
                  <tr>
                    <th>Donor Name</th>
                    <th>Amount</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {fundings.map((funding) => (
                    <tr key={funding._id}>
                      <td>{funding.userName}</td>
                      <td className="amount-cell">${funding.amount.toFixed(2)}</td>
                      <td>{formatDate(funding.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="pagination">
                <button
                  className="pagination-btn"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                <span className="pagination-info">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  className="pagination-btn"
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {showPaymentModal && donationAmount && (
        <div className="modal-overlay" onClick={() => setShowPaymentModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">Complete Payment</h2>
            <p className="modal-amount">Amount: ${parseFloat(donationAmount).toFixed(2)}</p>
            <Elements stripe={stripePromise}>
              <PaymentForm
                amount={parseFloat(donationAmount)}
                onSuccess={handlePaymentSuccess}
              />
            </Elements>
            <button
              className="btn btn-secondary btn-close-modal"
              onClick={() => setShowPaymentModal(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Funding;

