import React, { useState } from 'react';
import { useSpring, animated } from 'react-spring';
import styled from 'styled-components';
import CountUp from 'react-countup';
import VisibilitySensor from 'react-visibility-sensor';
import { useRecoilValue } from 'recoil'; // Import Recoil
import { mode } from '../store/atom'; // Import the mode atom
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaLightbulb, FaGlobe, FaShieldAlt, FaStar, FaHeart, FaHandshake } from 'react-icons/fa';



const AboutPage = () => {
  const fadeIn = useSpring({
    opacity: 1,
    from: { opacity: 0 },
    config: { duration: 1000 },
  });

  const slideIn = useSpring({
    transform: 'translateX(0%)',
    from: { transform: 'translateX(-100%)' },
    config: { duration: 1000 },
  });

  const [viewed, setViewed] = useState({
    users: false,
    opd: false,
    accidents: false,
    hospitals: false,
  });

  const dark = useRecoilValue(mode);

  return (
    <Container className={`${
      dark === 'dark'
        ? 'relative text-white py-16 sm:py-24 md:py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-gray-700 via-gray-900 to-black overflow-hidden'
        : 'relative text-black py-16 sm:py-24 md:py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-100 to-white overflow-hidden'
    }`} dark={dark}>
      <animated.div style={fadeIn}>
        {/* Vision and Mission Section */}
        <VisionMissionContainer>
          <Box dark={dark}>
            <VisionTitle dark={dark} className="font-semibold">
              Our Vision
            </VisionTitle>
            <VisionText dark={dark} className="font-sans">
              At Med-Sync, we envision a world where accessing outpatient care
              is as simple as a few clicks. By leveraging technology and
              innovation, we aim to provide a platform that bridges the gap
              between patients and healthcare providers, making high-quality
              care accessible to everyone, anywhere.
            </VisionText>
          </Box>
          <Box dark={dark}>
            <MissionTitle dark={dark} className="font-semibold">
              Our Mission
            </MissionTitle>
            <MissionText dark={dark} className="font-sans">
              Our mission is to revolutionize outpatient care by creating a
              comprehensive, easy-to-use platform that empowers patients and
              healthcare providers alike. We are committed to building
              technology that simplifies healthcare processes, improves access,
              and enhances patient experience.
            </MissionText>
          </Box>
        </VisionMissionContainer>

        {/* Core Values Section */}
        <motion.section 
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className={`text-2xl font-bold text-center mb-8 ${
            dark === 'dark' ? 'text-blue-400' : 'text-blue-600'
          }`}>
            Our Core Values
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                title: "Innovation",
                description: "Continuously evolving our technology to meet healthcare challenges",
                icon: FaLightbulb,
                color: "text-yellow-500"
              },
              {
                title: "Accessibility",
                description: "Making quality healthcare available to everyone, everywhere",
                icon: FaGlobe,
                color: "text-green-500"
              },
              {
                title: "Security",
                description: "Ensuring the highest standards of data protection and privacy",
                icon: FaShieldAlt,
                color: "text-blue-500"
              },
              {
                title: "Excellence",
                description: "Maintaining superior quality in all our services",
                icon: FaStar,
                color: "text-amber-500"
              },
              {
                title: "Empathy",
                description: "Understanding and addressing patient needs with care",
                icon: FaHeart,
                color: "text-red-500"
              },
              {
                title: "Collaboration",
                description: "Working together with healthcare providers for better outcomes",
                icon: FaHandshake,
                color: "text-purple-500"
              }
            ].map((value, index) => (
              <motion.div
                key={index}
                className={`p-5 rounded-lg transition-all duration-300 ${
                  dark === 'dark'
                    ? 'bg-[#111111] border border-[#222222] hover:bg-[#1a1a1a]'
                    : 'bg-white shadow-sm border border-gray-200 hover:shadow-md'
                }`}
                whileHover={{ y: -2 }}
              >
                <div className={`text-2xl mb-3 ${value.color}`}>
                  <value.icon />
                </div>
                <h3 className={`text-base font-semibold mb-1.5 ${
                  dark === 'dark' ? 'text-white' : 'text-gray-800'
                }`}>
                  {value.title}
                </h3>
                <p className={`text-sm leading-relaxed ${dark === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Impact Statistics Section */}
        <StatsSection dark={dark}>
          <StatItem dark={dark}>
            <VisibilitySensor
              partialVisibility
              onChange={(isVisible) => {
                if (isVisible) setViewed(prev => ({ ...prev, users: true }));
              }}
            >
              {({ isVisible }) => (
                <StatNumber dark={dark}>
                  {viewed.users || isVisible ? (
                    <CountUp start={0} end={1234} duration={3} suffix="+" />
                  ) : (
                    "1234+"
                  )}
                </StatNumber>
              )}
            </VisibilitySensor>
            Active Users
          </StatItem>

          <StatItem dark={dark}>
            <VisibilitySensor
              partialVisibility
              onChange={(isVisible) => {
                if (isVisible) setViewed(prev => ({ ...prev, opd: true }));
              }}
            >
              {({ isVisible }) => (
                <StatNumber dark={dark}>
                  {viewed.opd || isVisible ? (
                    <CountUp start={0} end={567} duration={3} suffix="+" />
                  ) : (
                    "567+"
                  )}
                </StatNumber>
              )}
            </VisibilitySensor>
            Successful Appointments
          </StatItem>

          <StatItem dark={dark}>
            <VisibilitySensor
              partialVisibility
              onChange={(isVisible) => {
                if (isVisible) setViewed(prev => ({ ...prev, hospitals: true }));
              }}
            >
              {({ isVisible }) => (
                <StatNumber dark={dark}>
                  {viewed.hospitals || isVisible ? (
                    <CountUp start={0} end={45} duration={3} suffix="+" />
                  ) : (
                    "45+"
                  )}
                </StatNumber>
              )}
            </VisibilitySensor>
            Partner Hospitals
          </StatItem>

          <StatItem dark={dark}>
            <VisibilitySensor
              partialVisibility
              onChange={(isVisible) => {
                if (isVisible) setViewed(prev => ({ ...prev, accidents: true }));
              }}
            >
              {({ isVisible }) => (
                <StatNumber dark={dark}>
                  {viewed.accidents || isVisible ? (
                    <CountUp start={0} end={99} duration={3} suffix="%" />
                  ) : (
                    "99%"
                  )}
                </StatNumber>
              )}
            </VisibilitySensor>
            Patient Satisfaction
          </StatItem>
        </StatsSection>

        {/* Call to Action Section */}
        <JoinUsSection dark={dark}>
          <JoinUsTitle dark={dark}>Ready to Transform Healthcare?</JoinUsTitle>
          <JoinUsText dark={dark}>
            Join us in our mission to make healthcare more accessible, efficient, and patient-centric. 
            Whether you're a healthcare provider or a patient, we're here to support your journey 
            towards better healthcare management.
          </JoinUsText>
          <motion.div 
            className="mt-6 flex justify-center gap-4"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link
              to="/register"
              className={`px-6 py-2.5 rounded-full font-semibold text-sm transition-all duration-300 ${
                dark === 'dark'
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              Get Started Today
            </Link>
          </motion.div>
        </JoinUsSection>
      </animated.div>
    </Container>
  );
};

// Styled Components
const Container = styled.div`
  padding: 1.5rem;
  max-width: 1100px;
  margin: 0 auto;
  margin-top: 70px;
  background-color: ${({ dark }) => (dark === 'dark' ? '#000000' : '#f8fafc')};
  color: ${({ dark }) => (dark === 'dark' ? '#e2e8f0' : '#333')};
  min-height: 100vh;
`;

// Two-box structure for Vision and Mission
const VisionMissionContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.25rem;
  margin-bottom: 2.5rem;
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Box = styled.div`
  padding: 1.25rem 1.5rem;
  background-color: ${({ dark }) => (dark === 'dark' ? '#111111' : '#ffffff')};
  border-radius: 10px;
  box-shadow: ${({ dark }) => (dark === 'dark' ? '0 2px 8px rgba(0, 0, 0, 0.5)' : '0 2px 8px rgba(0, 0, 0, 0.06)')};
  border: 1px solid ${({ dark }) => (dark === 'dark' ? '#222222' : '#e5e7eb')};
  display: flex;
  flex-direction: column;
`;

const VisionTitle = styled.h2`
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
  color: ${({ dark }) => (dark === 'dark' ? '#60a5fa' : '#2563eb')};
`;

const VisionText = styled.p`
  font-size: 0.9rem;
  color: ${({ dark }) => (dark === 'dark' ? '#cbd5e1' : '#4b5563')};
  line-height: 1.6;
  flex: 1;
`;

const MissionTitle = styled.h2`
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
  color: ${({ dark }) => (dark === 'dark' ? '#60a5fa' : '#2563eb')};
`;

const MissionText = styled.p`
  font-size: 0.9rem;
  color: ${({ dark }) => (dark === 'dark' ? '#cbd5e1' : '#4b5563')};
  line-height: 1.6;
  flex: 1;
`;

// Team Grid
const TeamGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  margin-bottom: 1.75rem;
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const TeamCard = styled.div`
  background-color: ${({ dark }) => (dark === 'dark' ? '#111111' : '#ffffff')};
  color: ${({ dark }) => (dark === 'dark' ? '#e2e8f0' : '#333')};
  border-radius: 10px;
  box-shadow: ${({ dark }) => (dark === 'dark' ? '0 2px 8px rgba(0, 0, 0, 0.5)' : '0 2px 8px rgba(0, 0, 0, 0.06)')};
  border: 1px solid ${({ dark }) => (dark === 'dark' ? '#222222' : '#e5e7eb')};
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  height: 420px;
  text-align: center;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  &:hover {
    transform: translateY(-4px);
    box-shadow: ${({ dark }) => (dark === 'dark' ? '0 4px 16px rgba(0, 0, 0, 0.4)' : '0 4px 16px rgba(0, 0, 0, 0.1)')};
  }
`;

const ProfileImage = styled.img`
  width: 140px;
  height: 140px;
  border-radius: 50%;
  margin: 0 auto;
  display: block;
  border: 3px solid ${({ dark }) => (dark === 'dark' ? '#334155' : '#e5e7eb')};
`;

const SocialIcons = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.75rem;
  margin-top: 0.75rem;

  a {
    color: ${({ dark }) => (dark === 'dark' ? '#94a3b8' : '#64748b')};
    transition: color 0.2s ease;
    &:hover {
      color: ${({ dark }) => (dark === 'dark' ? '#60a5fa' : '#2563eb')};
    }
  }
`;

const Name = styled.h4`
  font-size: 1.1rem;
  margin-bottom: 0.15rem;
  color: ${({ dark }) => (dark === 'dark' ? '#f1f5f9' : '#1e293b')};
  font-weight: 600;
`;

const Role = styled.h5`
  font-size: 0.9rem;
  margin-bottom: 0.25rem;
  color: ${({ dark }) => (dark === 'dark' ? '#60a5fa' : '#2563eb')};
  font-weight: 500;
`;

const Description = styled.p`
  font-size: 0.85rem;
  color: ${({ dark }) => (dark === 'dark' ? '#cbd5e1' : '#64748b')};
  line-height: 1.5;
`;

// Community Section
const GitTeamTitle = styled.h3`
  font-size: 1.75rem;
  color: ${({ dark }) => (dark === 'dark' ? '#60a5fa' : '#2563eb')};
  text-align: center;
  margin-top: 1.5rem;
  font-weight: 600;
`;

// Join Us Section
const JoinUsSection = styled.div`
  margin-top: 2rem;
  text-align: center;
  padding: 1.5rem;
  background-color: ${({ dark }) => (dark === 'dark' ? '#111111' : '#ffffff')};
  border-radius: 10px;
  border: 1px solid ${({ dark }) => (dark === 'dark' ? '#222222' : '#e5e7eb')};
  box-shadow: ${({ dark }) => (dark === 'dark' ? '0 2px 8px rgba(0, 0, 0, 0.5)' : '0 2px 8px rgba(0, 0, 0, 0.06)')};
`;

const JoinUsTitle = styled.h3`
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
  color: ${({ dark }) => (dark === 'dark' ? '#60a5fa' : '#2563eb')};
  font-weight: 600;
`;

const JoinUsText = styled.p`
  font-size: 0.9rem;
  color: ${({ dark }) => (dark === 'dark' ? '#cbd5e1' : '#64748b')};
  max-width: 550px;
  margin: 0 auto;
  line-height: 1.6;
`;

const Title = styled.h3`
  font-size: 1.75rem;
  color: ${({ dark }) => (dark === 'dark' ? '#60a5fa' : '#2563eb')};
  text-align: center;
  margin-bottom: 1.5rem;
  font-weight: 600;
`;

const StatsSection = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.25rem;
  padding: 1.5rem;
  background-color: ${({ dark }) => (dark === 'dark' ? '#111111' : '#ffffff')};
  border-radius: 10px;
  border: 1px solid ${({ dark }) => (dark === 'dark' ? '#222222' : '#e5e7eb')};
  box-shadow: ${({ dark }) => (dark === 'dark' ? '0 2px 8px rgba(0, 0, 0, 0.5)' : '0 2px 8px rgba(0, 0, 0, 0.06)')};
  margin-bottom: 1.5rem;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 0.85rem;
  color: ${({ dark }) => (dark === 'dark' ? '#cbd5e1' : '#4b5563')};
  font-weight: 500;
  text-align: center;
`;

const StatNumber = styled.div`
  font-size: 1.5rem;
  color: ${({ dark }) => (dark === 'dark' ? '#60a5fa' : '#2563eb')};
  margin-bottom: 0.25rem;
  font-weight: 700;
`;

export default AboutPage;
