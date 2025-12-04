import React, { useEffect, useContext, useState } from 'react';
import axios from 'axios';
import '../styles/HospitalList.css';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { UserContext } from '../store/userContext';
import hospitalsData from '../data/hospitalsData'; // Import local hospital data
import { databaseUrls } from '../data/databaseUrls';

import { useRecoilState } from 'recoil'; 
import { mode } from '../store/atom';


const mindate = new Date().toISOString().split('T')[0];

const HospitalsList = () => {
  
  const [dark] = useRecoilState(mode);
  const { user } = useContext(UserContext);
  const [hospitals, setHospitals] = useState([]);
  const [filteredHospitals, setFilteredHospitals] = useState([]);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [bookingData, setBookingData] = useState({
    date: '',
    reason: '',
  });
  const [searchQuery, setSearchQuery] = useState(''); // Search query state
  const [showFilterMenu, setShowFilterMenu] = useState(false); // Filter menu visibility state
  const [filters, setFilters] = useState({
    departments: '',
    availableServices: '',
    ratings: '',
  });
  const navigate = useNavigate();

  // Fetch hospitals on component mount
  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const response = await axios.get(
          databaseUrls.hospitals.all,
        );

        // Combine local data and fetched data
        const combinedHospitals = [...hospitalsData, ...response.data];
        setHospitals(combinedHospitals);
        setFilteredHospitals(combinedHospitals);
      } catch (error) {
        console.error('Error fetching hospitals', error);
        // Set local data as fallback in case of error
        setHospitals(hospitalsData);
        setFilteredHospitals(hospitalsData);
      }
    };

    fetchHospitals();
  }, []);

  // Handle appointment booking
  const handleBooking = async (hospitalId) => {
    try {
      // Require login before booking
      if (!user) {
        // redirect to login page
        navigate('/login', { state: { from: `/hospitals` } });
        return;
      }

      // Basic client-side validation
      if (!bookingData.date) {
        alert('Please select a date for the appointment');
        return;
      }
      if (!bookingData.reason || bookingData.reason.trim().length < 5) {
        alert('Please provide a reason (at least 5 characters)');
        return;
      }

      const userId = user ? user._id : '';
      const response = await axios.post(
        databaseUrls.hospitals.bookHospital.replace('_id', hospitalId),
        {
          userId,
          ...bookingData,
        },
      );
      alert(response.data.message || 'Appointment booked');
      setSelectedHospital(null);
      navigate(`/profile`);
    } catch (error) {
      // Show server-provided message when available
      if (error?.response?.data) {
        const data = error.response.data;
        const message = data.message || (data.errors && data.errors.map(e=>e.message).join(', ')) || JSON.stringify(data);
        alert(`Booking failed: ${message}`);
      } else {
        alert('Error booking appointment');
      }
      console.error('Booking error:', error);
    }
  };

  const handleChange = (e) => {
    setBookingData({
      ...bookingData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    // Filter hospitals by name or address (street, city, or state)
    const filtered = hospitals.filter((hospital) => {
      const nameMatch = hospital.name?.toLowerCase().includes(query) || false;
      const address = hospital.address || {}; // Default to an empty object if address is null or undefined
      const streetMatch = address.street?.toLowerCase().includes(query) || false;
      const cityMatch = address.city?.toLowerCase().includes(query) || false;
      const stateMatch = address.state?.toLowerCase().includes(query) || false;

      return nameMatch || streetMatch || cityMatch || stateMatch;
    });

    setFilteredHospitals(filtered);
  };

  const handleFilterToggle = () => {
    setShowFilterMenu(!showFilterMenu); // Toggle filter menu visibility
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const applyFilters = () => {
    const filtered = hospitals.filter((hospital) => {
      const departmentMatch = filters.departments
        ? hospital.departments?.includes(filters.departments)
        : true;
      const serviceMatch = filters.availableServices
        ? hospital.availableServices?.includes(filters.availableServices)
        : true;
      const ratingMatch = filters.ratings
        ? hospital.ratings >= parseFloat(filters.ratings)
        : true;

      return departmentMatch && serviceMatch && ratingMatch;
    });

    setFilteredHospitals(filtered);
  };

  const clearFilters = () => {
    setFilters({
      departments: '',
      availableServices: '',
      ratings: '',
    });
    setFilteredHospitals(hospitals); // Reset to the full list
  };

  return (
    <>
      <Navbar />
      <div className={`min-h-screen ${
          dark === 'dark'
            ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white'
            : 'bg-gradient-to-br from-blue-50 via-white to-blue-50 text-gray-800'
        } py-8 px-4 sm:px-6 lg:px-8`} 
      >
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-8">
            <h1 className={`text-3xl font-bold mb-2 ${dark === 'dark' ? 'text-white' : 'text-gray-800'}`}>
              Find Hospitals
            </h1>
            <p className={`text-sm ${dark === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Search and book appointments at top hospitals near you
            </p>
          </div>

          {/* Search & Filter Section */}
          <div className={`${dark === 'dark' ? 'bg-gray-800/50' : 'bg-white'} rounded-xl shadow-lg p-4 mb-6`}>
            <div className="flex flex-col md:flex-row gap-3">
              {/* Search Input */}
              <div className="flex-1 relative">
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  className={`w-full pl-10 pr-4 py-2.5 rounded-lg border text-sm ${
                    dark === 'dark' 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-500'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
                  placeholder="Search by hospital name, city, or address..."
                  value={searchQuery}
                  onChange={handleSearch}
                />
              </div>
              
              {/* Filter Button */}
              <button
                className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  showFilterMenu 
                    ? 'bg-blue-600 text-white' 
                    : dark === 'dark'
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                onClick={handleFilterToggle}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                {showFilterMenu ? 'Hide Filters' : 'Filters'}
              </button>
            </div>

            {/* Filter Options */}
            {showFilterMenu && (
              <div className={`mt-4 pt-4 border-t ${dark === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className={`block text-xs font-medium mb-1 ${dark === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                      Department
                    </label>
                    <input
                      type="text"
                      name="departments"
                      value={filters.departments}
                      onChange={handleFilterChange}
                      className={`w-full px-3 py-2 rounded-lg border text-sm ${
                        dark === 'dark' 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-gray-50 border-gray-200'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      placeholder="e.g., Cardiology"
                    />
                  </div>
                  <div>
                    <label className={`block text-xs font-medium mb-1 ${dark === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                      Services
                    </label>
                    <input
                      type="text"
                      name="availableServices"
                      value={filters.availableServices}
                      onChange={handleFilterChange}
                      className={`w-full px-3 py-2 rounded-lg border text-sm ${
                        dark === 'dark' 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-gray-50 border-gray-200'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      placeholder="e.g., Emergency"
                    />
                  </div>
                  <div>
                    <label className={`block text-xs font-medium mb-1 ${dark === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                      Min Rating
                    </label>
                    <input
                      type="number"
                      name="ratings"
                      value={filters.ratings}
                      onChange={handleFilterChange}
                      className={`w-full px-3 py-2 rounded-lg border text-sm ${
                        dark === 'dark' 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-gray-50 border-gray-200'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      placeholder="e.g., 4.0"
                      min="1"
                      max="5"
                      step="0.1"
                    />
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <button
                    className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                    onClick={applyFilters}
                  >
                    Apply Filters
                  </button>
                  <button
                    className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                      dark === 'dark'
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                    onClick={clearFilters}
                  >
                    Clear
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Results Count */}
          <p className={`text-sm mb-4 ${dark === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Showing {filteredHospitals.length} hospital{filteredHospitals.length !== 1 ? 's' : ''}
          </p>

          {/* Hospital Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredHospitals.map((hospital) => (
              <div
                key={hospital._id}
                className={`rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                  dark === 'dark' 
                    ? 'bg-gray-800 shadow-lg shadow-gray-900/50' 
                    : 'bg-white shadow-md'
                }`}
              >
                {/* Card Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-4 py-3">
                  <h5 className="text-white font-semibold text-base truncate">{hospital.name}</h5>
                  <div className="flex items-center gap-1 mt-1">
                    <svg className="w-3.5 h-3.5 text-yellow-300" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-white text-xs font-medium">{hospital.ratings || 'N/A'}</span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-4 space-y-2.5">
                  <div className="flex items-start gap-2">
                    <svg className={`w-4 h-4 mt-0.5 flex-shrink-0 ${dark === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className={`text-xs ${dark === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                      {hospital.address?.street || 'N/A'}, {hospital.address?.city || 'N/A'}, {hospital.address?.state || 'N/A'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <svg className={`w-4 h-4 flex-shrink-0 ${dark === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span className={`text-xs ${dark === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                      {hospital.phone || 'N/A'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <svg className={`w-4 h-4 flex-shrink-0 ${dark === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                    <a href={hospital.website} className="text-xs text-blue-500 hover:underline truncate">
                      {hospital.website || 'N/A'}
                    </a>
                  </div>

                  <div className={`pt-2 border-t ${dark === 'dark' ? 'border-gray-700' : 'border-gray-100'}`}>
                    <p className={`text-xs ${dark === 'dark' ? 'text-gray-400' : 'text-gray-500'} mb-1`}>Departments</p>
                    <div className="flex flex-wrap gap-1">
                      {hospital.departments?.slice(0, 3).map((dept, idx) => (
                        <span key={idx} className={`text-xs px-2 py-0.5 rounded-full ${
                          dark === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-blue-50 text-blue-600'
                        }`}>
                          {dept}
                        </span>
                      )) || <span className="text-xs text-gray-400">N/A</span>}
                      {hospital.departments?.length > 3 && (
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          dark === 'dark' ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-500'
                        }`}>
                          +{hospital.departments.length - 3}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className={`${dark === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      Services: {hospital.availableServices?.length || 0}
                    </span>
                    <span className={`${dark === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      Appointments: {hospital.appointments?.length || 0}
                    </span>
                  </div>
                </div>

                {/* Card Actions */}
                <div className={`flex gap-2 p-4 pt-0`}>
                  <button
                    className="flex-1 bg-blue-600 text-white text-xs py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    onClick={() => setSelectedHospital(hospital)}
                  >
                    Book Appointment
                  </button>
                  <button
                    className={`flex-1 text-xs py-2 px-3 rounded-lg font-medium transition-colors ${
                      dark === 'dark'
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    onClick={() => navigate(`/hospitalDetails?id=${hospital._id}`)}
                  >
                    View Details
                  </button>
                </div>

                {/* Booking Form */}
                {selectedHospital && selectedHospital._id === hospital._id && (
                  <div className={`p-4 border-t ${dark === 'dark' ? 'bg-gray-900/50 border-gray-700' : 'bg-gray-50 border-gray-100'}`}>
                    <h4 className="text-sm font-semibold mb-3">Book Appointment</h4>
                    <input
                      type="date"
                      className={`w-full mb-2 px-3 py-2 rounded-lg border text-sm ${
                        dark === 'dark' 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-200'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      name="date"
                      value={bookingData.date}
                      onChange={handleChange}
                      min={mindate}
                      required
                    />
                    <input
                      type="text"
                      className={`w-full mb-3 px-3 py-2 rounded-lg border text-sm ${
                        dark === 'dark' 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                          : 'bg-white border-gray-200 placeholder-gray-500'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      name="reason"
                      placeholder="Reason for appointment"
                      value={bookingData.reason}
                      onChange={handleChange}
                      required
                    />
                    <div className="flex gap-2">
                      <button
                        className="flex-1 bg-green-600 text-white text-xs py-2 rounded-lg hover:bg-green-700 transition-colors font-medium"
                        onClick={() => handleBooking(hospital._id)}
                      >
                        Confirm
                      </button>
                      <button
                        className={`flex-1 text-xs py-2 rounded-lg font-medium transition-colors ${
                          dark === 'dark'
                            ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                        onClick={() => setSelectedHospital(null)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredHospitals.length === 0 && (
            <div className="text-center py-12">
              <svg className={`w-16 h-16 mx-auto mb-4 ${dark === 'dark' ? 'text-gray-600' : 'text-gray-300'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <h3 className={`text-lg font-medium mb-1 ${dark === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                No hospitals found
              </h3>
              <p className={`text-sm ${dark === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                Try adjusting your search or filters
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default HospitalsList;
