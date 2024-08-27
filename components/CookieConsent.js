import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import UAParser from 'ua-parser-js';
import axios from 'axios';

const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [userInfo, setUserInfo] = useState({ email: '', phone: '', gender: '' });
  const [locationName, setLocationName] = useState('');

  useEffect(() => {
    // Check if cookie consent has not been given
    if (!Cookies.get('cookieConsent')) {
      setIsVisible(true);
    } else {
      // User accepted cookies, start tracking data
      trackUserBehavior();
    }
  }, []);

  const handleAcceptAllCookies = () => {
    // Set cookie for consent
    Cookies.set('cookieConsent', 'true', { expires: 365, path: '/' });
    setIsVisible(false);
    trackUserBehavior();
    captureDeviceInfo();
    captureLocation();
  };

  const handleCookieSettings = () => {
    // Redirect or show cookie settings modal
    console.log('Cookie Settings Clicked');
  };

  const trackUserBehavior = () => {
    // Example: Track page visits, clicks, etc.
    trackPageVisits();
    trackScrollDepth();
    trackProductClicks();
  };

  const trackPageVisits = () => {
    const currentPage = window.location.pathname;
    let pagesVisited = Cookies.get('pagesVisited') ? JSON.parse(Cookies.get('pagesVisited')) : [];
    pagesVisited.push({ page: currentPage, timestamp: new Date().toISOString() });
    Cookies.set('pagesVisited', JSON.stringify(pagesVisited), { expires: 365, path: '/' });
  };

  const trackScrollDepth = () => {
    window.addEventListener('scroll', () => {
      const scrollDepth = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
      Cookies.set('scrollDepth', `${scrollDepth}%`, { expires: 365, path: '/' });
    });
  };

  const trackProductClicks = () => {
    document.querySelectorAll('.product').forEach(product => {
      product.addEventListener('click', (e) => {
        const productId = e.target.dataset.productId;
        let productsClicked = Cookies.get('productsClicked') ? JSON.parse(Cookies.get('productsClicked')) : [];
        productsClicked.push({ productId, timestamp: new Date().toISOString() });
        Cookies.set('productsClicked', JSON.stringify(productsClicked), { expires: 365, path: '/' });
      });
    });
  };

  const captureDeviceInfo = () => {
    const parser = new UAParser();
    const result = parser.getResult();
    
    const deviceInfo = {
      deviceType: result.device.type || 'desktop', // device type (mobile, tablet, or desktop)
      deviceModel: result.device.model || 'unknown', // specific device model
      os: result.os.name || 'unknown', // operating system
      browserName: result.browser.name || 'unknown', // browser name
      browserVersion: result.browser.version || 'unknown', // browser version
    };

    // Store device info in cookies
    Cookies.set('deviceInfo', JSON.stringify(deviceInfo), { expires: 365, path: '/' });

    console.log('Device Info:', deviceInfo); // For debugging purposes
  };

  const captureLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        const location = { latitude, longitude };
        Cookies.set('location', JSON.stringify(location), { expires: 365, path: '/' });

        // Reverse geocode to get the location name
        try {
          const apiKey = 'YOU'; // Replace with your API key
          const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`);
          const locationName = response.data.results[0]?.formatted_address || 'Unknown Location';
          setLocationName(locationName);
          Cookies.set('locationName', locationName, { expires: 365, path: '/' });
        } catch (error) {
          console.error('Error fetching location name:', error);
        }
      });
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const { email, phone, gender } = userInfo;

    // Store user info in cookies
    Cookies.set('email', email, { expires: 365, path: '/' });
    Cookies.set('phone', phone, { expires: 365, path: '/' });
    Cookies.set('gender', gender, { expires: 365, path: '/' });
    
    // Simulate Login Status
    Cookies.set('loggedIn', 'true', { expires: 365, path: '/' });

    // Start tracking location after form submission
    captureLocation();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserInfo(prev => ({ ...prev, [name]: value }));
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
  flexDirection: 'column',
};

const textStyle = {
  margin: '10px 0',
  fontSize: '14px',
  textAlign: 'center',
};

const formStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  width: '100%',
  maxWidth: '300px',
  margin: '0 auto',
};

const inputStyle = {
  padding: '10px',
  borderRadius: '5px',
  border: '1px solid #ccc',
  width: '100%',
  boxSizing: 'border-box',
};

const buttonContainerStyle = {
  display: 'flex',
  gap: '10px',
  flexDirection: 'row',
  justifyContent: 'center',
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
