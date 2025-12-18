import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import './AllUsers.css';

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchUsers();
  }, [currentPage, statusFilter]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: 10
      };
      if (statusFilter) params.status = statusFilter;

      const response = await api.get('/users', { params });

      if (response.data.success) {
        setUsers(response.data.data.users);
        setTotalPages(response.data.data.pagination.totalPages);
      }
    } catch (error) {
      toast.error('Failed to fetch users');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (userId, newStatus) => {
    try {
      await api.patch(`/users/${userId}/status`, { status: newStatus });
      toast.success(`User ${newStatus === 'active' ? 'unblocked' : 'blocked'} successfully`);
      fetchUsers();
    } catch (error) {
      toast.error('Failed to update user status');
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await api.patch(`/users/${userId}/role`, { role: newRole });
      toast.success(`User role updated to ${newRole} successfully`);
      fetchUsers();
    } catch (error) {
      toast.error('Failed to update user role');
    }
  };

  return (
    <div className="all-users-page">
      <div className="page-header">
        <h2>All Users</h2>
        <div className="filter-section">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="filter-select"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="blocked">Blocked</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading...</div>
      ) : users.length === 0 ? (
        <div className="no-users">No users found.</div>
      ) : (
        <>
          <div className="users-table-container">
            <table className="users-table">
              <thead>
                <tr>
                  <th>Avatar</th>
                  <th>Email</th>
                  <th>Name</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td>
                      <img
                        src={user.avatar || 'https://via.placeholder.com/40'}
                        alt={user.name}
                        className="user-avatar"
                      />
                    </td>
                    <td>{user.email}</td>
                    <td>{user.name}</td>
                    <td>
                      <span className={`role-badge role-${user.role}`}>
                        {user.role}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge status-${user.status}`}>
                        {user.status}
                      </span>
                    </td>
                    <td>
                      <div className="action-menu">
                        <button className="action-menu-btn">⋮</button>
                        <div className="action-dropdown">
                          {user.status === 'active' ? (
                            <button
                              onClick={() => handleStatusChange(user._id, 'blocked')}
                              className="action-item"
                            >
                              Block
                            </button>
                          ) : (
                            <button
                              onClick={() => handleStatusChange(user._id, 'active')}
                              className="action-item"
                            >
                              Unblock
                            </button>
                          )}
                          {user.role !== 'volunteer' && (
                            <button
                              onClick={() => handleRoleChange(user._id, 'volunteer')}
                              className="action-item"
                            >
                              Make Volunteer
                            </button>
                          )}
                          {user.role !== 'admin' && (
                            <button
                              onClick={() => handleRoleChange(user._id, 'admin')}
                              className="action-item"
                            >
                              Make Admin
                            </button>
                          )}
                        </div>
                      </div>
                    </td>
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
  );
};

export default AllUsers;

