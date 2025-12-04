import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// import playstore from "../assets/favicon2.png";
import {
  FaGithub,
  FaRegCopyright,
  FaDiscord,
  FaLinkedinIn,
  FaArrowUp,
  FaInstagram,
} from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6'; // Corrected import for Twitter icon
import GoogleTranslate from './GoogleTranslate';
import { X, MessageCircle } from 'lucide-react';
// import { FaArrowUp } from 'react-icons/fa';
  
import { useRecoilValue, useRecoilState } from 'recoil'; 
import { mode } from '../store/atom';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const isDarkMode = useRecoilValue(mode); // Use the Recoil state for dark mode
 const navigate = useNavigate(); 
 
 const [dark, setDark] = useRecoilState(mode);

  const handleScroll = () => {
    if (window.scrollY > 200) {
      setShowScrollTop(true);
    } else {
      setShowScrollTop(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleSubscribe = async () => {
    try {
      const response = await fetch('http://localhost:8080/otherroutes/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      if (response.ok) {
        setMessage('Subscription successful! Confirmation mail sent');
        setMessageType('success');
        setEmail('');
      } else {
        setMessage('Subscription failed. Try again.');
        setMessageType('error');
      }
      setTimeout(() => {
        setMessage('');
        setEmail('');
      }, 5000); // Clear the message and input after 5 seconds
    } catch (error) {
      console.error('Subscription error:', error);
      setMessage('An error occurred. Please try again later.');
      setMessageType('error');

      setTimeout(() => setMessage(''), 5000);
    }
  };

  // Define company links with distinct paths
  const aboutLinks = [
    { name: 'Our Hospital', path: '/hospitals' },
    { name: 'Doctors', path: '/doctors' },
    // { name: 'Pricing', path: '/pricing' },
  ];

  // Define quick links
  const servicesLinks = [
    { name: 'OPD Consultations', path: '/opd-registration' },
    { name: 'Lab Tests', path: '/labtest' },
    { name: 'Health Checkup', path: '/health-checkup' },
  ];

  // Define social media links
  const socialMedia = [
    {
      Icon: FaGithub,
      link: 'https://github.com/rnt07s',
      color: '#333',
    },
    // { Icon: FaXTwitter, link: 'https://twitter.com', color: '#1DA1F2' },
    { Icon: FaLinkedinIn, link: 'https://www.linkedin.com/in/rauneet-singh-5676ab250/', color: '#0077B5' },
  ];

  // Define legal links with their paths if available
  const contactUsLinks = [
    { name: 'Business', path: '/business' },
    { name: 'Support Us', path: '/support-us' },
    // { name: 'Customer Care', path: '/customer-care' },
    // { name: 'Newsletter', path: '/newsletter-dashboard' },
  ];

  // const handleRating = (value) => {
  //     setRating(value);
  // };

  // const submitRating = () => {
  //     alert(`Thank you for rating us ${rating} out of 5! Comment: ${comment}`);
  //     setIsModalOpen(false);
  //     setRating(0);
  //     setComment('');
  // };

  return (
    <footer className={`${
      dark === 'dark'
        ? 'bg-gradient-to-r from-gray-700 via-gray-900 to-black text-gray-100'
        : 'bg-gradient-to-r from-[#b6dbfc] via-[#8faed9] to-[#b6dbfc] text-white shadow-lg shadow-black'
    } py-6`}
>
    
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-between items-start gap-6">
          {/* MedSync Section */}
          <div className="space-y-2">
            <Link
              to="/"
              className="flex items-center gap-2 group transition-all duration-300 ease-in-out transform hover:scale-105"
            >
              <img
                src="../favicon.png"
                className="h-8 w-8"
                alt="MedSync Logo"
              />
              <span className="text-xl font-bold bg-gradient-to-r from-[#1f2937] to-[#b6dbfc] bg-clip-text text-transparent">
                MedSync
              </span>
            </Link>
            <p className="text-xs max-w-[200px]">
              Simplifying hospital management with efficient OPDs and lab tests.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex gap-8">
            <div>
              <h4 className="font-semibold mb-2 text-sm">Quick Links</h4>
              <ul className="space-y-1 text-xs">
                <li><Link to="/hospitals" className="hover:underline">Hospitals</Link></li>
                <li><Link to="/doctors" className="hover:underline">Doctors</Link></li>
                <li><Link to="/opd-registration" className="hover:underline">OPD</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2 text-sm">Contact</h4>
              <ul className="space-y-1 text-xs">
                <li><Link to="/business" className="hover:underline">Business</Link></li>
                <li><Link to="/support-us" className="hover:underline">Support Us</Link></li>
              </ul>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex gap-3">
            {socialMedia.map(({ Icon, link, color }, index) => (
              <a
                key={index}
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-white transition-all duration-300 hover:scale-110"
                style={{ color: color }}
              >
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-4 pt-4 border-t border-[#b6dbfc]/30 text-center">
          <p className="flex items-center justify-center text-xs">
            <FaRegCopyright className="mx-1" /> {currentYear} MedSync. All Rights Reserved.
          </p>
        </div>

        {/* Scroll to top button */}
        <button
          onClick={scrollToTop}
          className={`fixed bottom-4 right-6 bg-blue-600 text-white p-3 rounded-full z-[1000] transition-all duration-300 ${!showScrollTop && 'opacity-0 invisible translate-y-4'}`}
        >
          <FaArrowUp size={20} />
        </button>
      </div>
    </footer >
  );
};

export default Footer; 