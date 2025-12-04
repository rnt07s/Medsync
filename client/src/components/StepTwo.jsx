import { useState, useContext } from 'react';
import { useRecoilValue } from 'recoil';
import RegistrationContext from '../store/RegistrationContext';
import { isEmpty } from 'lodash';
import { mode } from '../store/atom'; // Importing the atom for mode
import { FaMapMarkerAlt, FaBuilding, FaCalendarAlt, FaUserCircle, FaGlobe, FaHospitalAlt, FaArrowLeft, FaArrowRight } from 'react-icons/fa';

// Enhanced styling objects
const inputStyle = (isDark) => ({
  boxSizing: 'border-box',
  padding: '14px 18px',
  border: isDark ? '2px solid #475569' : '2px solid #e5e7eb',
  borderRadius: '14px',
  fontSize: '1rem',
  background: isDark 
    ? 'rgba(51, 65, 85, 0.8)' 
    : 'linear-gradient(135deg, #f9fafb 0%, #ffffff 100%)',
  color: isDark ? '#f1f5f9' : '#1f2937',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
  width: '100%',
});

const labelStyle = (isDark) => ({
  fontWeight: '600',
  fontSize: '0.9rem',
  color: isDark ? '#e2e8f0' : '#374151',
  marginBottom: '6px',
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
});

const sectionTitleStyle = (isDark) => ({
  fontSize: '1.1rem',
  fontWeight: '700',
  color: isDark ? '#93c5fd' : '#1e40af',
  marginTop: '16px',
  marginBottom: '12px',
  paddingBottom: '10px',
  borderBottom: isDark ? '2px solid rgba(147, 197, 253, 0.3)' : '2px solid rgba(59, 130, 246, 0.2)',
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
});

const errorStyle = {
  color: '#ef4444',
  fontSize: '0.85rem',
  marginTop: '4px',
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  animation: 'fadeIn 0.3s ease',
};

const buttonBaseStyle = {
  padding: '14px 28px',
  fontSize: '1rem',
  fontWeight: '600',
  borderRadius: '12px',
  cursor: 'pointer',
  transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
};

const prevButtonStyle = (isDark) => ({
  ...buttonBaseStyle,
  background: 'transparent',
  color: isDark ? '#94a3b8' : '#6b7280',
  border: isDark ? '2px solid #475569' : '2px solid #e5e7eb',
});

const nextButtonStyle = {
  ...buttonBaseStyle,
  background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
  color: 'white',
  border: 'none',
  boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)',
};

const btnDivStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  marginTop: '28px',
  gap: '16px',
};

function StepTwo() {
  const { basicDetails, otherDetails, setOtherDetails, nextStep, prevStep } =
    useContext(RegistrationContext);
  const { street, city, state, postalCode } = otherDetails.address;
  const [errors, setErrors] = useState({
    frontend: {},
    backend: {},
  });

  const dark = useRecoilValue(mode); // Using Recoil state for dark mode
  const isDark = dark === 'dark';

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name in otherDetails.address) {
      // Update the address field
      setOtherDetails((prevDetails) => ({
        ...prevDetails,
        address: {
          ...prevDetails.address,
          [name]: value,
        },
      }));
    } else {
      setOtherDetails({
        ...otherDetails,
        [name]: value,
      });
    }

    setErrors((prev) => ({
      ...prev,
      frontend: {
        ...prev.frontend,
        [name]: '', // Clear frontend error for the field being edited
      },
    }));
  };

  const handleCommaSeparatedValues = (e) => {
    const { name, value } = e.target;

    setOtherDetails((prevDetails) => ({
      ...prevDetails,
      [name]: [...prevDetails.medicalHistory, ...value.trim().split(',')],
    }));
    setErrors((prev) => ({
      ...prev,
      frontend: {
        ...prev.frontend,
        [name]: '', // Clear frontend error for the field being edited
      },
    }));
  };

  const validateForm = () => {
    const { street, city, state, postalCode } = otherDetails.address;

    const newErrors = {};

    if (!street) newErrors.street = 'Street is required';
    if (!city) newErrors.city = 'City is required';
    if (!state) newErrors.state = 'State is required';
    if (!postalCode) newErrors.postalCode = 'Pin Code is required';

    // Checking error for other user details
    if (basicDetails.type === 'user') {
      if (!otherDetails.gender) newErrors.gender = 'Gender is required';
      if (!otherDetails.dob) newErrors.dob = 'DOB is required';
    }

    if (basicDetails.type === 'hospital') {
      if (isEmpty(otherDetails.department)) {
        newErrors.department = 'Departments is required';
      }
      if (isEmpty(otherDetails.availableServices))
        newErrors.availableServices = 'At least one service is required';
    }
    return newErrors;
  };

  const handleContinue = () => {
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors((prev) => ({
        ...prev,
        frontend: validationErrors,
      }));
      return;
    }
    nextStep();
  };

  return (
    <form
      className="auth-form"
      style={{ 
        background: 'transparent',
        animation: 'slideUp 0.4s ease forwards'
      }}
    >
      {/* Address Section */}
      <div style={sectionTitleStyle(isDark)}>
        <FaMapMarkerAlt style={{ color: isDark ? '#60a5fa' : '#3b82f6' }} />
        Address Information
      </div>
      
      <div className="form-section">
        <label style={labelStyle(isDark)}>
          Street <span style={{ color: '#ef4444' }}>*</span>
        </label>
        <input
          id="street"
          type="text"
          name="street"
          placeholder="Enter street details"
          value={street}
          onChange={handleChange}
          required
          style={inputStyle(isDark)}
          onFocus={(e) => {
            e.target.style.borderColor = '#3b82f6';
            e.target.style.boxShadow = '0 0 0 4px rgba(59, 130, 246, 0.12), 0 4px 16px rgba(59, 130, 246, 0.15)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = isDark ? '#475569' : '#e5e7eb';
            e.target.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.04)';
          }}
        />
        {errors.frontend.street && (
          <span style={errorStyle}>⚠️ {errors.frontend.street}</span>
        )}
      </div>
      
      <div className="form-section">
        <label style={labelStyle(isDark)}>
          City <span style={{ color: '#ef4444' }}>*</span>
        </label>
        <input
          id="city"
          type="text"
          name="city"
          placeholder="Enter your city"
          value={city}
          onChange={handleChange}
          required
          style={inputStyle(isDark)}
          onFocus={(e) => {
            e.target.style.borderColor = '#3b82f6';
            e.target.style.boxShadow = '0 0 0 4px rgba(59, 130, 246, 0.12), 0 4px 16px rgba(59, 130, 246, 0.15)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = isDark ? '#475569' : '#e5e7eb';
            e.target.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.04)';
          }}
        />
        {errors.frontend.city && (
          <span style={errorStyle}>⚠️ {errors.frontend.city}</span>
        )}
      </div>

      <div className="form-section">
        <label style={labelStyle(isDark)}>
          State <span style={{ color: '#ef4444' }}>*</span>
        </label>
        <input
          id="state"
          type="text"
          name="state"
          placeholder="Enter your state"
          value={state}
          onChange={handleChange}
          required
          style={inputStyle(isDark)}
          onFocus={(e) => {
            e.target.style.borderColor = '#3b82f6';
            e.target.style.boxShadow = '0 0 0 4px rgba(59, 130, 246, 0.12), 0 4px 16px rgba(59, 130, 246, 0.15)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = isDark ? '#475569' : '#e5e7eb';
            e.target.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.04)';
          }}
        />
        {errors.frontend.state && (
          <span style={errorStyle}>⚠️ {errors.frontend.state}</span>
        )}
      </div>
      
      <div className="form-section">
        <label style={labelStyle(isDark)}>
          Pin Code <span style={{ color: '#ef4444' }}>*</span>
        </label>
        <input
          id="postalCode"
          type="text"
          name="postalCode"
          placeholder="Enter Pin code"
          value={postalCode}
          onChange={handleChange}
          required
          style={inputStyle(isDark)}
          onFocus={(e) => {
            e.target.style.borderColor = '#3b82f6';
            e.target.style.boxShadow = '0 0 0 4px rgba(59, 130, 246, 0.12), 0 4px 16px rgba(59, 130, 246, 0.15)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = isDark ? '#475569' : '#e5e7eb';
            e.target.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.04)';
          }}
        />
        {errors.frontend.postalCode && (
          <span style={errorStyle}>⚠️ {errors.frontend.postalCode}</span>
        )}
      </div>
      
      {/* Other Info Section */}
      <div style={sectionTitleStyle(isDark)}>
        {basicDetails.type === 'hospital' ? (
          <FaHospitalAlt style={{ color: isDark ? '#60a5fa' : '#3b82f6' }} />
        ) : (
          <FaUserCircle style={{ color: isDark ? '#60a5fa' : '#3b82f6' }} />
        )}
        {basicDetails.type === 'hospital' ? 'Hospital Information' : 'Personal Information'}
      </div>
      
      {basicDetails.type === 'hospital' && (
        <>
          <div className="form-section">
            <label style={labelStyle(isDark)}>
              <FaGlobe style={{ color: isDark ? '#60a5fa' : '#3b82f6', marginRight: '4px' }} />
              Website
            </label>
            <input
              id="website"
              type="text"
              name="website"
              placeholder="www.hospital.com"
              value={otherDetails.website}
              onChange={handleChange}
              style={inputStyle(isDark)}
              onFocus={(e) => {
                e.target.style.borderColor = '#3b82f6';
                e.target.style.boxShadow = '0 0 0 4px rgba(59, 130, 246, 0.12), 0 4px 16px rgba(59, 130, 246, 0.15)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = isDark ? '#475569' : '#e5e7eb';
                e.target.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.04)';
              }}
            />
          </div>
          
          <div className="form-section">
            <label style={labelStyle(isDark)}>
              <FaBuilding style={{ color: isDark ? '#60a5fa' : '#3b82f6', marginRight: '4px' }} />
              Department <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <select
              id="department"
              name="department"
              value={otherDetails.department}
              onChange={handleChange}
              required
              style={inputStyle(isDark)}
              onFocus={(e) => {
                e.target.style.borderColor = '#3b82f6';
                e.target.style.boxShadow = '0 0 0 4px rgba(59, 130, 246, 0.12), 0 4px 16px rgba(59, 130, 246, 0.15)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = isDark ? '#475569' : '#e5e7eb';
                e.target.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.04)';
              }}
            >
              <option value="" disabled>Select Department</option>
              <option value="cardiology">Cardiology</option>
              <option value="neurology">Neurology</option>
              <option value="orthopedics">Orthopedics</option>
              <option value="pediatrics">Pediatrics</option>
              <option value="gynecology">Gynecology</option>
              <option value="dermatology">Dermatology</option>
            </select>
            {errors.frontend.department && (
              <span style={errorStyle}>⚠️ {errors.frontend.department}</span>
            )}
          </div>
          
          <div className="form-section">
            <label style={labelStyle(isDark)}>
              Available Services <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <input
              id="availableServices"
              type="text"
              name="availableServices"
              placeholder="OPD, Cancer Treatment, etc. (comma-separated)"
              value={otherDetails.availableServices}
              onChange={handleCommaSeparatedValues}
              style={inputStyle(isDark)}
              onFocus={(e) => {
                e.target.style.borderColor = '#3b82f6';
                e.target.style.boxShadow = '0 0 0 4px rgba(59, 130, 246, 0.12), 0 4px 16px rgba(59, 130, 246, 0.15)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = isDark ? '#475569' : '#e5e7eb';
                e.target.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.04)';
              }}
            />
            {errors.frontend.availableServices && (
              <span style={errorStyle}>⚠️ {errors.frontend.availableServices}</span>
            )}
          </div>
        </>
      )}
      
      {basicDetails.type === 'user' && (
        <>
          <div className="form-section">
            <label style={labelStyle(isDark)}>
              <FaCalendarAlt style={{ color: isDark ? '#60a5fa' : '#3b82f6', marginRight: '4px' }} />
              Date of Birth <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <input
              id="dob"
              type="date"
              name="dob"
              placeholder="DD/MM/YYYY"
              required
              value={otherDetails.dob}
              onChange={handleChange}
              style={inputStyle(isDark)}
              onFocus={(e) => {
                e.target.style.borderColor = '#3b82f6';
                e.target.style.boxShadow = '0 0 0 4px rgba(59, 130, 246, 0.12), 0 4px 16px rgba(59, 130, 246, 0.15)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = isDark ? '#475569' : '#e5e7eb';
                e.target.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.04)';
              }}
            />
            {errors.frontend.dob && (
              <span style={errorStyle}>⚠️ {errors.frontend.dob}</span>
            )}
          </div>
          
          <div className="form-section">
            <label style={labelStyle(isDark)}>
              Gender <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <select
              id="gender"
              name="gender"
              value={otherDetails.gender}
              onChange={handleChange}
              required
              style={inputStyle(isDark)}
              onFocus={(e) => {
                e.target.style.borderColor = '#3b82f6';
                e.target.style.boxShadow = '0 0 0 4px rgba(59, 130, 246, 0.12), 0 4px 16px rgba(59, 130, 246, 0.15)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = isDark ? '#475569' : '#e5e7eb';
                e.target.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.04)';
              }}
            >
              <option value="" disabled>Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            {errors.frontend.gender && (
              <span style={errorStyle}>⚠️ {errors.frontend.gender}</span>
            )}
          </div>
        </>
      )}
      
      <div style={btnDivStyle}>
        <button
          type="button"
          onClick={prevStep}
          style={prevButtonStyle(isDark)}
          onMouseEnter={(e) => {
            e.target.style.background = isDark ? 'rgba(71, 85, 105, 0.5)' : '#f3f4f6';
            e.target.style.transform = 'translateX(-4px)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'transparent';
            e.target.style.transform = 'translateX(0)';
          }}
        >
          <FaArrowLeft /> Back
        </button>
        <button
          type="button"
          onClick={handleContinue}
          style={nextButtonStyle}
          onMouseEnter={(e) => {
            e.target.style.background = 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)';
            e.target.style.transform = 'translateX(4px)';
            e.target.style.boxShadow = '0 6px 20px rgba(59, 130, 246, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)';
            e.target.style.transform = 'translateX(0)';
            e.target.style.boxShadow = '0 4px 15px rgba(59, 130, 246, 0.3)';
          }}
        >
          Continue <FaArrowRight />
        </button>
      </div>
    </form>
  );
}

export default StepTwo;
