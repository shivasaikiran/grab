import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import UAParser from 'ua-parser-js';
import axios from 'axios';
import { db } from '@/Firebase/Config'; // Adjust the path as necessary
import { doc, setDoc } from 'firebase/firestore';

const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [userInfo, setUserInfo] = useState({ email: '', phone: '', gender: '' });
  const [locationName, setLocationName] = useState('');

  useEffect(() => {
    if (!Cookies.get('cookieConsent')) {
      setIsVisible(true);
    } else {
      trackUserBehavior();
    }
  }, []);

  const handleAcceptAllCookies = () => {
    Cookies.set('cookieConsent', 'true', { expires: 365, path: '/' });
    setIsVisible(false);
    trackUserBehavior();
    captureDeviceInfo();
    captureLocation();
    saveCookiesToFirestore();
  };

  const handleCookieSettings = () => {
    console.log('Cookie Settings Clicked');
  };

  const trackUserBehavior = () => {
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
      deviceType: result.device.type || 'desktop',
      deviceModel: result.device.model || 'unknown',
      os: result.os.name || 'unknown',
      browserName: result.browser.name || 'unknown',
      browserVersion: result.browser.version || 'unknown',
    };

    Cookies.set('deviceInfo', JSON.stringify(deviceInfo), { expires: 365, path: '/' });
  };

  const captureLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        const location = { latitude, longitude };
        Cookies.set('location', JSON.stringify(location), { expires: 365, path: '/' });

        try {
          const apiKey = 'YOUR_GOOGLE_API_KEY'; // Replace with your API key
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

  const saveCookiesToFirestore = async () => {
    try {
      console.log('Saving cookies to Firestore...');
      const userCookies = {
        email: Cookies.get('email'),
        phone: Cookies.get('phone'),
        gender: Cookies.get('gender'),
        deviceInfo: Cookies.get('deviceInfo'),
        location: Cookies.get('location'),
        locationName: Cookies.get('locationName'),
        products: Cookies.get('productsClicked'),
      };

      await setDoc(doc(db, 'Cookies', ), userCookies);
      console.log('Cookies data saved to Firestore');
    } catch (error) {
      console.error('Error saving cookies data to Firestore:', error);
    }
  };

  console.log('Cookie Data:', {
    email: Cookies.get('email'),
    phone: Cookies.get('phone'),
    gender: Cookies.get('gender'),
    deviceInfo: Cookies.get('deviceInfo'),
    location: Cookies.get('location'),
    locationName: Cookies.get('locationName'),
  });
  
  const handleFormSubmit = (e) => {
    e.preventDefault();
    const { email, phone, gender } = userInfo;

    Cookies.set('email', email, { expires: 365, path: '/' });
    Cookies.set('phone', phone, { expires: 365, path: '/' });
    Cookies.set('gender', gender, { expires: 365, path: '/' });
    
    Cookies.set('loggedIn', 'true', { expires: 365, path: '/' });

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
