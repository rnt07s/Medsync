import React, { useContext, useState } from 'react';
import { FaEye, FaEyeSlash, FaUser, FaHospital } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import RegistrationContext from '../store/RegistrationContext';
import { useRecoilValue } from 'recoil'; // Recoil hook for dark mode
import { mode } from '../store/atom'; // Assuming dark mode is stored in Recoil

// Enhanced styling objects
const typeOptionStyle = (isSelected, isDark) => ({
  flex: 1,
  padding: '20px',
  border: isSelected 
    ? '2px solid #3b82f6' 
    : isDark 
      ? '2px solid #475569' 
      : '2px solid #e5e7eb',
  borderRadius: '16px',
  cursor: 'pointer',
  textAlign: 'center',
  transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
  background: isSelected
    ? isDark 
      ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(139, 92, 246, 0.15) 100%)'
      : 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)'
    : isDark 
      ? 'rgba(51, 65, 85, 0.6)' 
      : 'rgba(255, 255, 255, 0.8)',
  boxShadow: isSelected 
    ? '0 0 0 4px rgba(59, 130, 246, 0.1), 0 8px 20px rgba(59, 130, 246, 0.15)' 
    : '0 2px 8px rgba(0, 0, 0, 0.04)',
  transform: isSelected ? 'translateY(-4px)' : 'translateY(0)',
});

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

const errorStyle = {
  color: '#ef4444',
  fontSize: '0.85rem',
  marginTop: '4px',
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  animation: 'fadeIn 0.3s ease',
};

function StepOne() {
  const { basicDetails, setBasicDetails, nextStep } =
    useContext(RegistrationContext);
  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false,
  });
  const [errors, setErrors] = useState({
    frontend: {},
    backend: {},
  });

  const dark = useRecoilValue(mode); // Using Recoil to get dark mode status
  const isDark = dark === 'dark';

  const togglePasswordVisibility = (field) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const validateEmail = (email) => {
    const emailExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailExp.test(email);
  };

  const handleChange = (e) => {
    setBasicDetails({
      ...basicDetails,
      [e.target.name]: e.target.value,
    });
    setErrors((prev) => ({
      ...prev,
      frontend: {
        ...prev.frontend,
        [e.target.name]: '', // Clear frontend error for the field being edited
      },
    }));
  };

  const handleTypeSelect = (type) => {
    setBasicDetails({
      ...basicDetails,
      type: type,
    });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!basicDetails.name) newErrors.name = 'Name is required';
    if (!basicDetails.phone || !/^\d{10}$/.test(basicDetails.phone))
      newErrors.phone = 'Phone number must be exactly 10 digits';
    if (!basicDetails.email) newErrors.email = 'Email is required';
    if (basicDetails.email && !validateEmail(basicDetails.email))
      newErrors.email = 'Please enter a valid email address';
    if (!basicDetails.password) {
      newErrors.password = 'Password is required';
    } else if (basicDetails.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long';
    } else if (!/[A-Z]/.test(basicDetails.password)) {
      newErrors.password =
        'Password must contain at least one uppercase letter';
    } else if (!/[a-z]/.test(basicDetails.password)) {
      newErrors.password =
        'Password must contain at least one lowercase letter';
    } else if (!/[0-9]/.test(basicDetails.password)) {
      newErrors.password = 'Password must contain at least one number';
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(basicDetails.password)) {
      newErrors.password =
        'Password must contain at least one special character';
    }
    if (!basicDetails.confirmPassword) {
      newErrors.confirmPassword = 'Confirm password is required';
    }
    if (basicDetails.password !== basicDetails.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    return newErrors;
  };

  const handleContinue = (e) => {
    e.preventDefault();

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
    <>
      <form
        className="auth-form"
        style={{ 
          background: 'transparent',
          animation: 'slideUp 0.4s ease forwards'
        }}
      >
        {/* User Type Selection */}
        <div style={{ marginBottom: '24px' }}>
          <label style={labelStyle(isDark)}>
            I am a:
          </label>
          <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
            <div 
              style={typeOptionStyle(basicDetails.type === 'user', isDark)}
              onClick={() => handleTypeSelect('user')}
              onMouseEnter={(e) => {
                if (basicDetails.type !== 'user') {
                  e.currentTarget.style.borderColor = isDark ? '#60a5fa' : '#93c5fd';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }
              }}
              onMouseLeave={(e) => {
                if (basicDetails.type !== 'user') {
                  e.currentTarget.style.borderColor = isDark ? '#475569' : '#e5e7eb';
                  e.currentTarget.style.transform = 'translateY(0)';
                }
              }}
            >
              <FaUser style={{ 
                fontSize: '2rem', 
                marginBottom: '8px',
                color: basicDetails.type === 'user' ? '#3b82f6' : isDark ? '#94a3b8' : '#6b7280',
                transition: 'all 0.3s ease'
              }} />
              <div style={{ 
                fontWeight: '600', 
                color: basicDetails.type === 'user' 
                  ? '#1e40af' 
                  : isDark ? '#e2e8f0' : '#374151'
              }}>
                User
              </div>
            </div>
            <div 
              style={typeOptionStyle(basicDetails.type === 'hospital', isDark)}
              onClick={() => handleTypeSelect('hospital')}
              onMouseEnter={(e) => {
                if (basicDetails.type !== 'hospital') {
                  e.currentTarget.style.borderColor = isDark ? '#60a5fa' : '#93c5fd';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }
              }}
              onMouseLeave={(e) => {
                if (basicDetails.type !== 'hospital') {
                  e.currentTarget.style.borderColor = isDark ? '#475569' : '#e5e7eb';
                  e.currentTarget.style.transform = 'translateY(0)';
                }
              }}
            >
              <FaHospital style={{ 
                fontSize: '2rem', 
                marginBottom: '8px',
                color: basicDetails.type === 'hospital' ? '#3b82f6' : isDark ? '#94a3b8' : '#6b7280',
                transition: 'all 0.3s ease'
              }} />
              <div style={{ 
                fontWeight: '600', 
                color: basicDetails.type === 'hospital' 
                  ? '#1e40af' 
                  : isDark ? '#e2e8f0' : '#374151'
              }}>
                Hospital
              </div>
            </div>
          </div>
        </div>

        <div className="form-section">
          <label style={labelStyle(isDark)}>
            Name <span style={{ color: '#ef4444' }}>*</span>
          </label>
          <input
            id="name"
            type="text"
            name="name"
            value={basicDetails.name}
            onChange={handleChange}
            placeholder="Enter your full name"
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
          {errors.frontend.name && (
            <span style={errorStyle}>⚠️ {errors.frontend.name}</span>
          )}
        </div>

        <div className="form-section">
          <label style={labelStyle(isDark)}>
            Phone <span style={{ color: '#ef4444' }}>*</span>
          </label>
          <input
            id="phone"
            type="text"
            name="phone"
            placeholder="Enter 10-digit phone number"
            value={basicDetails.phone}
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
          {errors.frontend.phone && (
            <span style={errorStyle}>⚠️ {errors.frontend.phone}</span>
          )}
        </div>

        <div className="form-section">
          <label style={labelStyle(isDark)}>
            Email <span style={{ color: '#ef4444' }}>*</span>
          </label>
          <input
            id="email"
            type="email"
            name="email"
            placeholder="example@gmail.com"
            value={basicDetails.email}
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
          {errors.frontend.email && (
            <span style={errorStyle}>⚠️ {errors.frontend.email}</span>
          )}
        </div>

        <div className="form-section">
          <label style={labelStyle(isDark)}>
            Password <span style={{ color: '#ef4444' }}>*</span>
          </label>
          <div className="password-wrapper">
            <input
              type={showPassword.password ? 'text' : 'password'}
              name="password"
              placeholder="Create a strong password"
              value={basicDetails.password}
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
            <button
              type="button"
              onClick={() => togglePasswordVisibility('password')}
              className="password-toggle"
            >
              {showPassword.password ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          {errors.frontend.password && (
            <span style={errorStyle}>⚠️ {errors.frontend.password}</span>
          )}
        </div>

        <div className="form-section">
          <label style={labelStyle(isDark)}>
            Confirm Password <span style={{ color: '#ef4444' }}>*</span>
          </label>
          <div className="password-wrapper">
            <input
              type={showPassword.confirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              placeholder="Confirm your password"
              value={basicDetails.confirmPassword}
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
            <button
              type="button"
              onClick={() => togglePasswordVisibility('confirmPassword')}
              className="password-toggle"
            >
              {showPassword.confirmPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          {errors.frontend.confirmPassword && (
            <span style={errorStyle}>⚠️ {errors.frontend.confirmPassword}</span>
          )}
        </div>

        <div className="register-button" style={{ marginTop: '24px' }}>
          <button
            type="submit"
            className="auth-button"
            onClick={handleContinue}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            Continue →
          </button>
        </div>

        <Link
          to="/login"
          className="toggle-auth-button"
          style={{
            textAlign: 'center',
            marginTop: '16px',
            display: 'block',
            color: isDark ? '#93c5fd' : '#3b82f6',
            fontWeight: '600',
            transition: 'all 0.3s ease',
          }}
        >
          Already have an account? Login
        </Link>
      </form>
    </>
  );
}

export default StepOne;
