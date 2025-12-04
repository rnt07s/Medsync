import React, { useContext, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { mode } from '../store/atom'; // Importing the mode atom for dark mode
import RegistrationContext from '../store/RegistrationContext';
import { notify } from '../components/notification';
import { useNavigate } from 'react-router-dom';
import { databaseUrls } from '../data/databaseUrls';
import { FaArrowLeft, FaUserCheck, FaSpinner, FaUser, FaMapMarkerAlt, FaEnvelope, FaPhone, FaBuilding, FaCalendarAlt, FaGlobe, FaUserCircle, FaCheckCircle } from 'react-icons/fa';

// Enhanced styling objects
const reviewContainerStyle = (isDark) => ({
  background: isDark 
    ? 'rgba(51, 65, 85, 0.6)' 
    : 'rgba(249, 250, 251, 0.9)',
  borderRadius: '20px',
  padding: '24px',
  marginBottom: '24px',
  border: isDark ? '1px solid rgba(71, 85, 105, 0.5)' : '1px solid rgba(229, 231, 235, 0.8)',
  boxShadow: isDark 
    ? '0 8px 24px rgba(0, 0, 0, 0.2)' 
    : '0 8px 24px rgba(0, 0, 0, 0.06)',
  animation: 'slideUp 0.4s ease forwards',
});

const sectionTitleStyle = (isDark) => ({
  fontSize: '1.1rem',
  fontWeight: '700',
  color: isDark ? '#93c5fd' : '#1e40af',
  marginBottom: '16px',
  paddingBottom: '12px',
  borderBottom: isDark ? '2px solid rgba(147, 197, 253, 0.3)' : '2px solid rgba(59, 130, 246, 0.2)',
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
});

const fieldRowStyle = (isDark) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '12px 0',
  borderBottom: isDark ? '1px solid rgba(71, 85, 105, 0.3)' : '1px solid #f3f4f6',
});

const labelStyle = (isDark) => ({
  fontWeight: '500',
  color: isDark ? '#94a3b8' : '#6b7280',
  fontSize: '0.9rem',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
});

const valueStyle = (isDark) => ({
  fontWeight: '600',
  color: isDark ? '#f1f5f9' : '#1f2937',
  textAlign: 'right',
  maxWidth: '60%',
  wordBreak: 'break-word',
});

const buttonBaseStyle = {
  padding: '14px 28px',
  fontSize: '1rem',
  fontWeight: '600',
  borderRadius: '12px',
  cursor: 'pointer',
  transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  border: 'none',
};

const prevButtonStyle = (isDark) => ({
  ...buttonBaseStyle,
  background: 'transparent',
  color: isDark ? '#94a3b8' : '#6b7280',
  border: isDark ? '2px solid #475569' : '2px solid #e5e7eb',
});

const submitButtonStyle = (isLoading) => ({
  ...buttonBaseStyle,
  background: isLoading 
    ? 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)' 
    : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
  color: 'white',
  boxShadow: isLoading ? 'none' : '0 6px 20px rgba(16, 185, 129, 0.35)',
  cursor: isLoading ? 'not-allowed' : 'pointer',
  minWidth: '160px',
});

const btnDivStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  marginTop: '8px',
  gap: '16px',
};

const getFieldIcon = (key) => {
  const iconMap = {
    name: <FaUser style={{ color: '#3b82f6' }} />,
    email: <FaEnvelope style={{ color: '#3b82f6' }} />,
    phone: <FaPhone style={{ color: '#3b82f6' }} />,
    type: <FaUserCircle style={{ color: '#3b82f6' }} />,
    street: <FaMapMarkerAlt style={{ color: '#10b981' }} />,
    city: <FaMapMarkerAlt style={{ color: '#10b981' }} />,
    state: <FaMapMarkerAlt style={{ color: '#10b981' }} />,
    postalCode: <FaMapMarkerAlt style={{ color: '#10b981' }} />,
    dob: <FaCalendarAlt style={{ color: '#8b5cf6' }} />,
    gender: <FaUserCircle style={{ color: '#8b5cf6' }} />,
    website: <FaGlobe style={{ color: '#f59e0b' }} />,
    department: <FaBuilding style={{ color: '#f59e0b' }} />,
    availableServices: <FaBuilding style={{ color: '#f59e0b' }} />,
  };
  return iconMap[key] || null;
};

const formatKey = (key) => {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .trim();
};

function ReviewDetails() {
  const { basicDetails, otherDetails, prevStep } =
    useContext(RegistrationContext);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const dark = useRecoilValue(mode); // Using Recoil state for dark mode
  const isDark = dark === 'dark';

  const handleRegister = async (e) => {
    e.preventDefault();

    const endpoint = databaseUrls.auth.register;
    console.log('Register endpoint ->', endpoint);
    const payload = { ...basicDetails, ...otherDetails };
    console.log('Register payload ->', payload);
    setIsLoading(true);
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log('Register response ->', response.status, data);

      if (response.ok) {
        notify('Registration successful', 'success');
        navigate('/login');
      } else {
        // Log full backend error and show message from server when available
        console.error('Backend registration error:', data);
        notify(data.message || (data.error && data.error.message) || 'An error occurred. Please try again.', 'warn');
      }
    } catch (error) {
      notify('Error connecting to the server', 'error');
      console.error('Network Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderField = (key, value) => {
    // Skip empty, password fields
    if (
      (typeof value === 'string' && value.trim() === '') ||
      (Array.isArray(value) && value.length === 0) ||
      key === 'password' ||
      key === 'confirmPassword'
    ) {
      return null;
    }

    // Handle nested objects (like address)
    if (typeof value === 'object' && !Array.isArray(value)) {
      return Object.entries(value).map(([nestedKey, nestedValue]) =>
        renderField(nestedKey, nestedValue)
      );
    }

    // Handle arrays
    if (Array.isArray(value)) {
      return (
        <div key={key} style={fieldRowStyle(isDark)}>
          <span style={labelStyle(isDark)}>
            {getFieldIcon(key)} {formatKey(key)}
          </span>
          <span style={valueStyle(isDark)}>{value.join(', ')}</span>
        </div>
      );
    }

    // Handle regular values
    return (
      <div key={key} style={fieldRowStyle(isDark)}>
        <span style={labelStyle(isDark)}>
          {getFieldIcon(key)} {formatKey(key)}
        </span>
        <span style={valueStyle(isDark)}>{value}</span>
      </div>
    );
  };

  return (
    <div style={{ width: '100%', animation: 'slideUp 0.4s ease forwards' }}>
      {/* Success indicator */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
        marginBottom: '24px',
        padding: '16px',
        background: isDark 
          ? 'rgba(16, 185, 129, 0.1)' 
          : 'rgba(16, 185, 129, 0.08)',
        borderRadius: '12px',
        border: isDark 
          ? '1px solid rgba(16, 185, 129, 0.3)' 
          : '1px solid rgba(16, 185, 129, 0.2)',
      }}>
        <FaCheckCircle style={{ color: '#10b981', fontSize: '1.5rem' }} />
        <span style={{ 
          color: isDark ? '#10b981' : '#059669', 
          fontWeight: '600',
          fontSize: '1rem'
        }}>
          Almost done! Review your details below
        </span>
      </div>

      {/* Basic Details Section */}
      <div style={reviewContainerStyle(isDark)}>
        <div style={sectionTitleStyle(isDark)}>
          <FaUser style={{ color: isDark ? '#60a5fa' : '#3b82f6' }} />
          Basic Information
        </div>
        {Object.entries(basicDetails).map(([key, value]) =>
          renderField(key, value)
        )}
      </div>

      {/* Other Details Section */}
      <div style={reviewContainerStyle(isDark)}>
        <div style={sectionTitleStyle(isDark)}>
          <FaMapMarkerAlt style={{ color: isDark ? '#60a5fa' : '#3b82f6' }} />
          Additional Information
        </div>
        {Object.entries(otherDetails).map(([key, value]) =>
          renderField(key, value)
        )}
      </div>

      {/* Action Buttons */}
      <div style={btnDivStyle}>
        <button
          type="button"
          style={prevButtonStyle(isDark)}
          onClick={prevStep}
          disabled={isLoading}
          onMouseEnter={(e) => {
            if (!isLoading) {
              e.target.style.background = isDark ? 'rgba(71, 85, 105, 0.5)' : '#f3f4f6';
              e.target.style.transform = 'translateX(-4px)';
            }
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
          style={submitButtonStyle(isLoading)}
          onClick={handleRegister}
          disabled={isLoading}
          onMouseEnter={(e) => {
            if (!isLoading) {
              e.target.style.background = 'linear-gradient(135deg, #059669 0%, #047857 100%)';
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 10px 30px rgba(16, 185, 129, 0.45)';
            }
          }}
          onMouseLeave={(e) => {
            if (!isLoading) {
              e.target.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 6px 20px rgba(16, 185, 129, 0.35)';
            }
          }}
        >
          {!isLoading ? (
            <>
              <FaUserCheck /> Complete Registration
            </>
          ) : (
            <>
              <FaSpinner style={{ animation: 'spin 1s linear infinite' }} />
              Registering...
            </>
          )}
        </button>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

export default ReviewDetails;
