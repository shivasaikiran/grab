import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if cookie consent has not been given
    if (!Cookies.get('cookieConsent')) {
      setIsVisible(true);
    }
  }, []);

  const handleAcceptAllCookies = () => {
    // Set cookie for consent
    Cookies.set('cookieConsent', 'true', { expires: 365, path: '/' });
    setIsVisible(false);
  };

  const handleCookieSettings = () => {
    // Redirect or show cookie settings modal
    console.log('Cookie Settings Clicked');
  };

  if (!isVisible) return null;

  return (
    <div style={bannerStyle}>
      <p style={textStyle}>
        By clicking "Accept All Cookies", you agree to the storing of cookies on your device
        to enhance site navigation, analyze site usage, and assist in our marketing efforts.
      </p>
      <div style={buttonContainerStyle}>
        <button onClick={handleCookieSettings} style={settingsButtonStyle}>Cookie Settings</button>
        <button onClick={handleAcceptAllCookies} style={acceptButtonStyle}>Accept All Cookies</button>
      </div>
    </div>
  );
};

// Styles
const bannerStyle = {
  position: 'fixed',
  bottom: 0,
  left: 0,
  width: '100%',
  backgroundColor: '#f9f9f9',
  color: '#333',
  padding: '20px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  boxShadow: '0px -2px 5px rgba(0,0,0,0.1)',
  zIndex: 1000,
  flexDirection: 'column', // Stack elements in column for mobile
};

const textStyle = {
  margin: '10px 0', // Adds spacing between text and buttons on mobile
  fontSize: '14px',
  textAlign: 'center', // Centers the text
};

const buttonContainerStyle = {
  display: 'flex',
  gap: '10px',
  flexDirection: 'row', // Display buttons side by side
  justifyContent: 'center', // Center the buttons in mobile
  width: '100%',
};

const settingsButtonStyle = {
  backgroundColor: 'transparent',
  color: '#007bff',
  border: 'none',
  cursor: 'pointer',
  textDecoration: 'underline',
  padding: '10px 20px',
};

const acceptButtonStyle = {
  backgroundColor: '#2d2f40',
  color: '#fff',
  border: 'none',
  padding: '10px 20px',
  borderRadius: '5px',
  cursor: 'pointer',
};

export default CookieConsent;
