import React, { useState } from 'react';
import { FaEye, FaEyeSlash, FaUser, FaLock } from 'react-icons/fa';
import { TailSpin } from 'react-loader-spinner';
import { notify } from '../components/notification';
import { Link } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { mode } from '../store/atom';
import { databaseUrls } from '../data/databaseUrls';
import { useNavigate } from 'react-router-dom';

const AuthPage = () => {
  const [formData, setFormData] = useState({
    type: 'hospital',
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({
    frontend: {},
    backend: {},
  });

  const [showPassword, setShowPassword] = useState({
    password: false,
  });

  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dark = useRecoilValue(mode);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setErrors((prev) => ({
      ...prev,
      frontend: {
        ...prev.frontend,
        [e.target.name]: '',
      },
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password || formData.password.length < 8)
      newErrors.password = 'Password must be at least 8 characters';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors((prev) => ({
        ...prev,
        frontend: validationErrors,
      }));
      return;
    }
    setIsSubmitting(true);
  
    try {
      const response = await fetch(databaseUrls.auth.login, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        localStorage.setItem('token', data.token);
        notify('Login successful', 'success');
        window.location.href = '/profile';
      } else {
        if (data.errors) {
          const backendErrors = {};
          data.errors.forEach((error) => {
            backendErrors[error.field] = error.message;
          });
          setErrors((prev) => ({
            ...prev,
            backend: backendErrors,
          }));
        } else {
          notify(data.message || 'An error occurred. Please try again.', 'warn');
        }
      }
    } catch (error) {
      notify('Error connecting to the server', 'error');
      console.error('Network Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const togglePasswordVisibility = (field) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 relative overflow-hidden ${
      dark === 'dark' 
        ? 'bg-gradient-to-br from-gray-950 via-slate-900 to-gray-900' 
        : 'bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900'
    }`}>
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className={`absolute top-20 left-10 w-72 h-72 rounded-full blur-3xl ${
          dark === 'dark' ? 'bg-blue-900/30' : 'bg-blue-500/20'
        }`}></div>
        <div className={`absolute bottom-20 right-10 w-96 h-96 rounded-full blur-3xl ${
          dark === 'dark' ? 'bg-indigo-900/30' : 'bg-indigo-500/20'
        }`}></div>
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-3xl ${
          dark === 'dark' ? 'bg-slate-800/30' : 'bg-blue-400/10'
        }`}></div>
        
        {/* Hospital/Medical themed elements */}
        <svg className={`absolute top-10 right-20 w-20 h-20 ${dark === 'dark' ? 'text-white/[0.03]' : 'text-white/5'}`} viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-1 11h-4v4h-4v-4H6v-4h4V6h4v4h4v4z"/>
        </svg>
        <svg className={`absolute bottom-32 left-16 w-16 h-16 ${dark === 'dark' ? 'text-white/[0.03]' : 'text-white/5'}`} viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-1 11h-4v4h-4v-4H6v-4h4V6h4v4h4v4z"/>
        </svg>
        <svg className={`absolute top-1/3 left-8 w-12 h-12 ${dark === 'dark' ? 'text-white/[0.03]' : 'text-white/5'}`} viewBox="0 0 24 24" fill="currentColor">
          <path d="M10.5 13H8v-3h2.5V7.5h3V10H16v3h-2.5v2.5h-3V13zM12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3z"/>
        </svg>
        <svg className={`absolute bottom-16 right-32 w-14 h-14 ${dark === 'dark' ? 'text-white/[0.03]' : 'text-white/5'}`} viewBox="0 0 24 24" fill="currentColor">
          <path d="M10.5 13H8v-3h2.5V7.5h3V10H16v3h-2.5v2.5h-3V13zM12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3z"/>
        </svg>
        <svg className={`absolute top-24 left-1/3 w-10 h-10 ${dark === 'dark' ? 'text-white/[0.03]' : 'text-white/5'}`} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2c-5.52 0-10 4.48-10 10s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9v-2h2v2zm0-4H9V7h2v5zm4 4h-2v-2h2v2zm0-4h-2V7h2v5z"/>
        </svg>
        <svg className={`absolute bottom-40 right-1/4 w-8 h-8 ${dark === 'dark' ? 'text-white/[0.03]' : 'text-white/5'}`} viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 8h-1V3H6v5H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zM8 5h8v3H8V5zm8 14H8v-4h8v4zm4-4h-2v-2H6v2H4v-4c0-.55.45-1 1-1h14c.55 0 1 .45 1 1v4z"/>
        </svg>
        
        {/* Heartbeat line */}
        <svg className={`absolute bottom-1/4 left-0 w-full h-16 ${dark === 'dark' ? 'text-white/[0.03]' : 'text-white/5'}`} viewBox="0 0 1200 100" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M0 50 L300 50 L350 50 L370 20 L390 80 L410 30 L430 70 L450 50 L500 50 L1200 50" />
        </svg>
        
        {/* DNA Helix decoration */}
        <div className={`absolute top-1/4 right-8 w-6 h-40 flex flex-col items-center gap-2 ${dark === 'dark' ? 'text-white/[0.03]' : 'text-white/5'}`}>
          <div className="w-6 h-1 bg-current rounded-full"></div>
          <div className="w-4 h-1 bg-current rounded-full"></div>
          <div className="w-2 h-1 bg-current rounded-full"></div>
          <div className="w-4 h-1 bg-current rounded-full"></div>
          <div className="w-6 h-1 bg-current rounded-full"></div>
          <div className="w-4 h-1 bg-current rounded-full"></div>
          <div className="w-2 h-1 bg-current rounded-full"></div>
          <div className="w-4 h-1 bg-current rounded-full"></div>
          <div className="w-6 h-1 bg-current rounded-full"></div>
        </div>
      </div>

      {/* Login Card */}
      <div className="relative w-full max-w-md group">
        <div className={`backdrop-blur-md rounded-2xl border p-8 shadow-2xl transition-all duration-300 ${
          dark === 'dark'
            ? 'bg-slate-900/80 border-slate-700/50 hover:border-slate-600/50'
            : 'bg-blue-800/50 border-blue-400/30 hover:border-blue-300/50'
        }`}>
          {/* Title */}
          <h2 className="text-3xl font-bold text-white text-center mb-8">
            Login
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* User Type Toggle */}
            <div className="flex gap-3 mb-6">
              <button
                type="button"
                onClick={() => setFormData({...formData, type: 'user'})}
                className={`flex-1 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                  formData.type === 'user'
                    ? dark === 'dark'
                      ? 'bg-blue-600 text-white border-2 border-blue-500'
                      : 'bg-blue-500/40 text-white border-2 border-blue-300/50'
                    : dark === 'dark'
                      ? 'bg-transparent text-white/70 border-2 border-slate-600/50 hover:border-slate-500/50 hover:bg-slate-800/50'
                      : 'bg-transparent text-white/80 border-2 border-blue-300/30 hover:border-blue-300/50 hover:bg-blue-600/20'
                }`}
              >
                User
              </button>
              <button
                type="button"
                onClick={() => setFormData({...formData, type: 'hospital'})}
                className={`flex-1 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                  formData.type === 'hospital'
                    ? dark === 'dark'
                      ? 'bg-blue-600 text-white border-2 border-blue-500'
                      : 'bg-blue-500/40 text-white border-2 border-blue-300/50'
                    : dark === 'dark'
                      ? 'bg-transparent text-white/70 border-2 border-slate-600/50 hover:border-slate-500/50 hover:bg-slate-800/50'
                      : 'bg-transparent text-white/80 border-2 border-blue-300/30 hover:border-blue-300/50 hover:bg-blue-600/20'
                }`}
              >
                Hospital
              </button>
            </div>

            {/* Email Input */}
            <div className="relative">
              <span className={`absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none ${
                dark === 'dark' ? 'text-white/50' : 'text-white/60'
              }`}>
                <FaUser size={16} />
              </span>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
                className={`w-full rounded-xl py-3.5 pr-4 pl-12 text-white text-sm focus:outline-none focus:ring-2 transition-all duration-200 ${
                  dark === 'dark'
                    ? 'bg-slate-800/60 border border-slate-600/50 focus:border-blue-500 focus:ring-blue-500/20 hover:border-slate-500/50 placeholder:text-white/40'
                    : 'bg-blue-900/40 border border-blue-300/30 focus:border-blue-300 focus:ring-blue-300/20 hover:border-blue-300/50 placeholder:text-white/50'
                }`}
              />
              {(errors.frontend.email || errors.backend.email) && (
                <p className="text-red-300 text-xs mt-1">{errors.frontend.email || errors.backend.email}</p>
              )}
            </div>

            {/* Password Input */}
            <div className="relative">
              <span className={`absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none ${
                dark === 'dark' ? 'text-white/50' : 'text-white/60'
              }`}>
                <FaLock size={16} />
              </span>
              <input
                type={showPassword.password ? 'text' : 'password'}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                className={`w-full rounded-xl py-3.5 pl-12 pr-12 text-white text-sm focus:outline-none focus:ring-2 transition-all duration-200 ${
                  dark === 'dark'
                    ? 'bg-slate-800/60 border border-slate-600/50 focus:border-blue-500 focus:ring-blue-500/20 hover:border-slate-500/50 placeholder:text-white/40'
                    : 'bg-blue-900/40 border border-blue-300/30 focus:border-blue-300 focus:ring-blue-300/20 hover:border-blue-300/50 placeholder:text-white/50'
                }`}
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('password')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white/70"
              >
                {showPassword.password ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
              </button>
              {(errors.frontend.password || errors.backend.password) && (
                <p className="text-red-300 text-xs mt-1">{errors.frontend.password || errors.backend.password}</p>
              )}
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between text-xs text-white/60">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-3 h-3 rounded accent-white/50" />
                <span>Remember me</span>
              </label>
              <button
                type="button"
                onClick={() => navigate('/forgot-password')}
                className="hover:text-white transition-colors"
              >
                Forgot password?
              </button>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 text-sm font-semibold rounded-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 mt-2 ${
                dark === 'dark'
                  ? 'bg-blue-600 text-white hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-600/30'
                  : 'bg-white text-blue-900 hover:bg-white/90 hover:shadow-lg hover:shadow-white/20'
              }`}
            >
              {isSubmitting ? 'Signing in...' : 'Login'}
            </button>

            {/* Register Link */}
            <p className="text-center text-sm text-white/60 mt-4">
              Don't have an account?{' '}
              <Link to="/register" className="text-white font-medium hover:underline">
                Register
              </Link>
            </p>
          </form>
        </div>
      </div>

      {/* Loading Overlay */}
      {isSubmitting && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <TailSpin height="50" width="50" color="#ffffff" ariaLabel="loading" />
        </div>
      )}
    </div>
  );
};

export default AuthPage;
