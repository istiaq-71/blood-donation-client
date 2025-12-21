import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  FiHome,
  FiUser,
  FiDroplet,
  FiPlusCircle,
  FiUsers,
  FiFileText,
  FiDollarSign,
  FiLogOut,
  FiMenu,
  FiX
} from 'react-icons/fi';
import './DashboardLayout.css';

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const menuItems = [
    { path: '/dashboard', icon: FiHome, label: 'Dashboard', roles: ['admin', 'donor', 'volunteer'] },
    { path: '/dashboard/profile', icon: FiUser, label: 'Profile', roles: ['admin', 'donor', 'volunteer'] },
  ];

  if (user?.role === 'donor') {
    menuItems.push(
      { path: '/dashboard/my-donation-requests', icon: FiDroplet, label: 'My Requests', roles: ['donor'] },
      { path: '/dashboard/create-donation-request', icon: FiPlusCircle, label: 'Create Request', roles: ['donor'] }
    );
  }

  if (user?.role === 'admin') {
    menuItems.push(
      { path: '/dashboard/all-users', icon: FiUsers, label: 'All Users', roles: ['admin'] },
      { path: '/dashboard/all-blood-donation-request', icon: FiFileText, label: 'All Requests', roles: ['admin'] }
    );
  }

  if (user?.role === 'volunteer' || user?.role === 'admin') {
    menuItems.push(
      { path: '/dashboard/all-blood-donation-request', icon: FiFileText, label: 'All Requests', roles: ['admin', 'volunteer'] }
    );
  }

  menuItems.push(
    { path: '/dashboard/funding', icon: FiDollarSign, label: 'Funding', roles: ['admin', 'donor', 'volunteer'] }
  );

  const filteredMenuItems = menuItems.filter(item => item.roles.includes(user?.role));

  return (
    <div className="dashboard-layout">
      <aside className={`dashboard-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2 
            className="sidebar-logo"
            onClick={() => navigate('/')}
            style={{ cursor: 'pointer' }}
          >
            🩸 BloodDonation
          </h2>
          <button
            className="sidebar-close"
            onClick={() => setSidebarOpen(false)}
          >
            <FiX />
          </button>
        </div>

        <div className="sidebar-user">
          <img
            src={user?.avatar || 'https://via.placeholder.com/50'}
            alt={user?.name}
            className="sidebar-avatar"
          />
          <div className="sidebar-user-info">
            <p className="sidebar-user-name">{user?.name}</p>
            <p className="sidebar-user-role">{user?.role}</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          {filteredMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`sidebar-link ${isActive ? 'active' : ''}`}
                onClick={() => setSidebarOpen(false)}
              >
                <Icon />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <button className="sidebar-link logout" onClick={handleLogout}>
            <FiLogOut />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <div className="dashboard-main">
        <header className="dashboard-header">
          <button
            className="dashboard-menu-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <FiMenu />
          </button>
          <h1 className="dashboard-title">
            {filteredMenuItems.find(item => item.path === location.pathname)?.label || 'Dashboard'}
          </h1>
        </header>

        <main className="dashboard-content">
          <Outlet />
        </main>
      </div>

      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default DashboardLayout;

