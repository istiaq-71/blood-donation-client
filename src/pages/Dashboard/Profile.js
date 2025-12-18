import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { uploadImageToImageBB } from '../../utils/imageUpload';
import { districts, getUpazilasByDistrict } from '../../utils/districtsUpazilas';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import './Profile.css';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    avatar: user?.avatar || '',
    bloodGroup: user?.bloodGroup || '',
    district: user?.district || '',
    upazila: user?.upazila || ''
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || '');
  const [loading, setLoading] = useState(false);

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const availableUpazilas = formData.district ? getUpazilasByDistrict(formData.district) : [];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
      ...(name === 'district' && { upazila: '' })
    });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      let avatarUrl = formData.avatar;

      if (avatarFile) {
        toast.loading('Uploading image...');
        const uploadResult = await uploadImageToImageBB(avatarFile);
        avatarUrl = uploadResult.url;
        toast.dismiss();
      }

      const response = await api.put('/users/profile', {
        ...formData,
        avatar: avatarUrl
      });

      if (response.data.success) {
        updateUser(response.data.data.user);
        setIsEditing(false);
        toast.success('Profile updated successfully');
      }
    } catch (error) {
      toast.error('Failed to update profile');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-card">
        <div className="profile-header">
          <h2 className="profile-title">Profile</h2>
          {!isEditing ? (
            <button
              className="btn btn-primary"
              onClick={() => setIsEditing(true)}
            >
              Edit
            </button>
          ) : (
            <div className="profile-actions">
              <button
                className="btn btn-secondary"
                onClick={() => {
                  setIsEditing(false);
                  setFormData({
                    name: user?.name || '',
                    avatar: user?.avatar || '',
                    bloodGroup: user?.bloodGroup || '',
                    district: user?.district || '',
                    upazila: user?.upazila || ''
                  });
                  setAvatarPreview(user?.avatar || '');
                  setAvatarFile(null);
                }}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={handleSave}
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save'}
              </button>
            </div>
          )}
        </div>

        <div className="profile-content">
          <div className="profile-avatar-section">
            <img
              src={avatarPreview || 'https://via.placeholder.com/150'}
              alt={user?.name}
              className="profile-avatar"
            />
            {isEditing && (
              <label className="avatar-upload-label">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="avatar-upload-input"
                />
                Change Avatar
              </label>
            )}
          </div>

          <form className="profile-form">
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="disabled-input"
              />
            </div>

            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={!isEditing}
                required
              />
            </div>

            <div className="form-group">
              <label>Blood Group</label>
              <select
                name="bloodGroup"
                value={formData.bloodGroup}
                onChange={handleChange}
                disabled={!isEditing}
                required
              >
                {bloodGroups.map((bg) => (
                  <option key={bg} value={bg}>
                    {bg}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>District</label>
              <select
                name="district"
                value={formData.district}
                onChange={handleChange}
                disabled={!isEditing}
                required
              >
                {districts.map((district) => (
                  <option key={district} value={district}>
                    {district}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Upazila</label>
              <select
                name="upazila"
                value={formData.upazila}
                onChange={handleChange}
                disabled={!isEditing || !formData.district}
                required
              >
                <option value="">Select upazila</option>
                {availableUpazilas.map((upazila) => (
                  <option key={upazila} value={upazila}>
                    {upazila}
                  </option>
                ))}
              </select>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;

