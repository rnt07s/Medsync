import React, { useState } from 'react';
import { Steps, message } from 'antd';
import StepOne from './StepOne';
import { Provider } from '../store/RegistrationContext';
import StepTwo from './StepTwo';
import '../styles/Login.css';
import ReviewDetails from './ReviewDetails';
import { useRecoilValue } from 'recoil'; // Import Recoil for dark mode state
import { mode } from '../store/atom'; // Import the dark mode atom

const { Step } = Steps;

const mainStyle = {
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '24px 0',
};

const containerStyle = (isDark) => ({
  background: isDark 
    ? 'linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(51, 65, 85, 0.9) 100%)' 
    : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(249, 250, 251, 0.9) 100%)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  borderRadius: '24px',
  padding: '32px 28px',
  boxShadow: isDark 
    ? '0 20px 60px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05)' 
    : '0 20px 60px rgba(0, 0, 0, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
  border: isDark 
    ? '1px solid rgba(71, 85, 105, 0.5)' 
    : '1px solid rgba(255, 255, 255, 0.6)',
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  maxWidth: '580px',
  width: '100%',
  position: 'relative',
  overflow: 'hidden',
});

const containerBeforeStyle = (isDark) => ({
  content: '""',
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  height: '5px',
  background: 'linear-gradient(90deg, #3b82f6, #8b5cf6, #06b6d4, #10b981)',
  backgroundSize: '300% 100%',
});

const progressBarStyle = (step, isDark) => ({
  height: '6px',
  background: isDark ? 'rgba(71, 85, 105, 0.5)' : '#e5e7eb',
  borderRadius: '3px',
  marginBottom: '28px',
  overflow: 'hidden',
  position: 'relative',
});

const progressFillStyle = (step) => ({
  height: '100%',
  width: `${((step + 1) / 3) * 100}%`,
  background: 'linear-gradient(90deg, #3b82f6, #8b5cf6, #06b6d4)',
  backgroundSize: '200% 100%',
  borderRadius: '3px',
  transition: 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
});

const titleStyle = (isDark) => ({
  fontSize: '1.75rem',
  fontWeight: '800',
  background: isDark 
    ? 'linear-gradient(135deg, #60a5fa 0%, #93c5fd 50%, #c4b5fd 100%)' 
    : 'linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #8b5cf6 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
  textAlign: 'center',
  marginBottom: '8px',
});

const subtitleStyle = (isDark) => ({
  fontSize: '0.95rem',
  color: isDark ? '#94a3b8' : '#6b7280',
  textAlign: 'center',
  marginBottom: '24px',
});

const basicDetailsInitial = {
  type: 'hospital',
  name: '',
  phone: '',
  email: '',
  password: '',
  confirmPassword: '',
};

const otherDetailsInitial = {
  address: {
    street: '',
    city: '',
    state: '',
    postalCode: '',
  },
  gender: '',
  dob: '',
  medicalHistory: [],
  website: '',
  department: [],
  availableServices: [],
};

const validateOtherDetails = (details, userType) => {
  let missingFields = [];

  // Check address fields
  if (!details.address.street) missingFields.push('Street');
  if (!details.address.city) missingFields.push('City');
  if (!details.address.state) missingFields.push('State');
  if (!details.address.postalCode) missingFields.push('Postal Code');

  // User type-specific checks
  if (userType === 'user') {
    if (!details.gender) missingFields.push('Gender');
    if (!details.dob) missingFields.push('Date of Birth');
  } else if (userType === 'hospital') {
    if (details.department.length === 0) missingFields.push('Department');
    if (details.availableServices.length === 0)
      missingFields.push('Available Services');
  }
  console.log(missingFields);

  // If any fields are missing, alert the user
  return missingFields.length > 0;
};

const stepToShow = (step) => {
  switch (step) {
    case 0:
      return <StepOne />;
    case 1:
      return <StepTwo />;
    case 2:
      return <ReviewDetails />;
    default:
      return null;
  }
};

function MultiStepRegistration() {
  const [basicDetails, setBasicDetails] = useState(basicDetailsInitial);
  const [otherDetails, setOtherDetails] = useState(otherDetailsInitial);
  const [currentStep, setCurrentStep] = useState(0);
  const [stepStatus, setStepStatus] = useState({
    0: 'process',
    1: 'wait',
    2: 'wait',
  });

  const dark = useRecoilValue(mode); // Access the dark mode state

  const nextStep = () => {
    setCurrentStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleNextStepValidation = (value) => {
    console.log(value, 'val');
    if (value > currentStep) {
      switch (currentStep) {
        case 0:
          console.log('In step 1', stepStatus, value, currentStep);

          if (Object.values(basicDetails).every((val) => val !== '')) {
            setStepStatus((prev) => ({
              ...prev,
              [currentStep]: 'finish',
              [value]: 'process',
            }));
            nextStep();
          } else {
            message.warning('Please fill all required  basic datails.', 2);
          }

          break;
        case 1:
          console.log('In step 2', stepStatus, value, currentStep);
          if (!validateOtherDetails(otherDetails, basicDetails.type)) {
            setStepStatus((prev) => ({
              ...prev,
              [currentStep]: 'finish',
              [value]: 'process',
            }));
            nextStep();
          } else {
            message.warning('Please fill all required  datails.', 2);
          }
          break;
        default:
          break;
      }
    } else {
      setCurrentStep(value);
    }
  };

  return (
    <Provider
      value={{
        basicDetails,
        setBasicDetails,
        otherDetails,
        setOtherDetails,
        nextStep,
        prevStep,
      }}
    >
      <div style={containerStyle(dark === 'dark')}>
        {/* Gradient top border */}
        <div style={containerBeforeStyle(dark === 'dark')} />
        
        {/* Title */}
        <h1 style={titleStyle(dark === 'dark')}>Create Account</h1>
        <p style={subtitleStyle(dark === 'dark')}>
          {currentStep === 0 && 'Enter your basic information to get started'}
          {currentStep === 1 && 'Tell us more about yourself'}
          {currentStep === 2 && 'Review your details and complete registration'}
        </p>
        
        {/* Progress bar */}
        <div style={progressBarStyle(currentStep, dark === 'dark')}>
          <div style={progressFillStyle(currentStep)} />
        </div>
        
        <Steps 
          current={currentStep} 
          onChange={handleNextStepValidation}
          style={{ marginBottom: '24px' }}
        >
          <Step
            title={
              <span
                className={
                  dark === 'dark'
          ? ' font-bold text-purple-400'
          : ' font-bold text-gray-900'
                }
                style={{ 
                  fontSize: '0.9rem',
                  transition: 'all 0.3s ease'
                }}
              >
                Basic Details
              </span>
            }
            status={stepStatus[0]}
          />
          <Step
            title={
              <span
                className={
                  dark === 'dark'
          ? ' font-bold text-purple-400'
          : ' font-bold text-gray-900'
                }
                style={{ 
                  fontSize: '0.9rem',
                  transition: 'all 0.3s ease'
                }}
              >
                Other Details
              </span>
            }
            status={stepStatus[1]}
          />
          <Step
            title={
              <span
                className={
                  dark === 'dark'
          ? ' font-bold text-purple-400'
          : ' font-bold text-gray-900'
                }
                style={{ 
                  fontSize: '0.9rem',
                  transition: 'all 0.3s ease'
                }}
              >
                Review & Register
              </span>
            }
            status={stepStatus[2]}
          />
        </Steps>

        <main style={mainStyle}>{stepToShow(currentStep)}</main>
      </div>
    </Provider>
  );
}

export default MultiStepRegistration;
