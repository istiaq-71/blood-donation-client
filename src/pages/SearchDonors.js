import React, { useState } from 'react';
import api from '../utils/api';
import { districts, getUpazilasByDistrict } from '../utils/districtsUpazilas';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './SearchDonors.css';

const SearchDonors = () => {
  const [searchData, setSearchData] = useState({
    bloodGroup: '',
    district: '',
    upazila: ''
  });
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const availableUpazilas = searchData.district ? getUpazilasByDistrict(searchData.district) : [];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSearchData({
      ...searchData,
      [name]: value,
      ...(name === 'district' && { upazila: '' })
    });
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    
    // Validate search form
    if (!searchData.bloodGroup || !searchData.district || !searchData.upazila) {
      toast.error('Please fill all search fields');
      return;
    }
    
    setLoading(true);
    setSearched(true);

    try {
      const response = await api.get('/users', {
        params: {
          bloodGroup: searchData.bloodGroup,
          district: searchData.district,
          upazila: searchData.upazila,
          status: 'active'
        }
      });

      if (response.data.success) {
        setDonors(response.data.data.users || []);
        if (response.data.data.users.length === 0) {
          toast.info('No donors found matching your criteria');
        }
      }
    } catch (error) {
      toast.error('Failed to search donors');
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="search-donors-page">
      <Navbar />
      <div className="search-container">
        <h1 className="page-title">Search Donors</h1>
        <p className="page-subtitle">Find blood donors in your area</p>

        <form onSubmit={handleSearch} className="search-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="bloodGroup">Blood Group</label>
              <select
                id="bloodGroup"
                name="bloodGroup"
                value={searchData.bloodGroup}
                onChange={handleChange}
                required
              >
                <option value="">Select blood group</option>
                {bloodGroups.map((bg) => (
                  <option key={bg} value={bg}>
                    {bg}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="district">District</label>
              <select
                id="district"
                name="district"
                value={searchData.district}
                onChange={handleChange}
                required
              >
                <option value="">Select district</option>
                {districts.map((district) => (
                  <option key={district} value={district}>
                    {district}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="upazila">Upazila</label>
              <select
                id="upazila"
                name="upazila"
                value={searchData.upazila}
                onChange={handleChange}
                required
                disabled={!searchData.district}
              >
                <option value="">Select upazila</option>
                {availableUpazilas.map((upazila) => (
                  <option key={upazila} value={upazila}>
                    {upazila}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-search" disabled={loading}>
            {loading ? 'Searching...' : 'Search Donors'}
          </button>
        </form>

        {searched && (
          <div className="donors-results">
            <h2 className="results-title">
              {donors.length > 0 ? `Found ${donors.length} Donor(s)` : 'No Donors Found'}
            </h2>
            <div className="donors-grid">
              {donors.map((donor) => (
                <div key={donor._id} className="donor-card">
                  <img
                    src={donor.avatar || 'https://via.placeholder.com/100'}
                    alt={donor.name}
                    className="donor-avatar"
                  />
                  <h3 className="donor-name">{donor.name}</h3>
                  <p className="donor-blood-group">Blood Group: {donor.bloodGroup}</p>
                  <p className="donor-location">
                    {donor.district}, {donor.upazila}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default SearchDonors;

