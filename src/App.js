import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import RoleRoute from './components/RoleRoute';

// Public Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import SearchDonors from './pages/SearchDonors';
import DonationRequests from './pages/DonationRequests';
import DonationRequestDetails from './pages/DonationRequestDetails';

// Dashboard Pages
import DashboardLayout from './components/Dashboard/DashboardLayout';
import DashboardHome from './pages/Dashboard/DashboardHome';
import Profile from './pages/Dashboard/Profile';
import MyDonationRequests from './pages/Dashboard/MyDonationRequests';
import CreateDonationRequest from './pages/Dashboard/CreateDonationRequest';
import EditDonationRequest from './pages/Dashboard/EditDonationRequest';
import AllUsers from './pages/Dashboard/AllUsers';
import AllBloodDonationRequests from './pages/Dashboard/AllBloodDonationRequests';
import Funding from './pages/Dashboard/Funding';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-right" />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/search-donors" element={<SearchDonors />} />
          <Route path="/donation-requests" element={<DonationRequests />} />
          
          {/* Protected Routes */}
          <Route
            path="/donation-requests/:id"
            element={
              <ProtectedRoute>
                <DonationRequestDetails />
              </ProtectedRoute>
            }
          />

          {/* Dashboard Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardHome />} />
            <Route path="profile" element={<Profile />} />
            <Route path="my-donation-requests" element={<MyDonationRequests />} />
            <Route path="my-donation-requests/edit/:id" element={<EditDonationRequest />} />
            <Route path="create-donation-request" element={<CreateDonationRequest />} />
            
            {/* Admin & Volunteer Routes */}
            <Route
              path="all-users"
              element={
                <RoleRoute allowedRoles={['admin']}>
                  <AllUsers />
                </RoleRoute>
              }
            />
            <Route
              path="all-blood-donation-request"
              element={
                <RoleRoute allowedRoles={['admin', 'volunteer']}>
                  <AllBloodDonationRequests />
                </RoleRoute>
              }
            />
            
            {/* Funding Route */}
            <Route path="funding" element={<Funding />} />
          </Route>

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

