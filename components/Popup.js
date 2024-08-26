import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Popup = ({ onClose }) => {
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setCursorPosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Disable scrolling when the popup is open
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.body.style.overflow = 'auto'; // Re-enable scrolling when the popup is closed
      document.body.style.position = ''; 
      document.body.style.width = '';
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-75">
      {/* Sprinkles */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-gradient-to-r from-green-500 to-green-600 animate-float"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDuration: `${2 + Math.random() * 3}s`,
              animationDelay: `${Math.random()}s`,
            }}
          ></div>
        ))}
      </div>

      <motion.div
        className="relative flex flex-col p-8 bg-white rounded-lg shadow-lg md:flex-row md:w-[800px] lg:w-[1000px]"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
      >
        {/* Left Section for Desktop View */}
        <div className="hidden p-8 text-white rounded-lg md:block md:w-1/2 mr-7 bg-gradient-to-b from-blue-500 to-green-500">
          <h2 className="mb-4 text-3xl font-bold animate-slide-in-left">Sign up & Unlock 1000+ Affiliate Campaigns</h2>
          <p className="mb-8 animate-slide-in-left">
            Hi, sign up to Cuelinks now to unlock 1000+ top and exclusive affiliate campaigns. Start monetizing your website & generating affiliate income.
          </p>
          <div className="flex justify-center">
            <motion.img
              src="/path/to/your/image.jpg"
              alt="Sign up banner"
              className="w-3/4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="relative z-10 flex flex-col w-full md:w-1/2">
          <button
            onClick={onClose} // Close the popup on click
            className="absolute text-gray-600 top-2 right-2 hover:text-gray-800"
          >
            <FaTimes size={24} />
          </button>

          <h2 className="mb-4 text-2xl font-bold text-center text-green-500 underline md:mt-4 animate-fade-in ">Grab Deals Daily</h2>
          <p className="mb-2 text-center text-gray-600 animate-fade-in">
            Already Signed up? <Link href="/login"><span className="text-blue-500">Go to Login</span></Link>
          </p>

          <Link href="/login">
            <motion.button
              className="w-full px-4 py-2 mb-2 text-white bg-blue-600 rounded hover:bg-blue-700"
              whileHover={{ scale: 1.05 }}
            >
              Continue with Facebook
            </motion.button>
          </Link>

          <Link href="/login">
            <motion.button
              className="w-full px-4 py-2 mb-2 text-white bg-red-500 rounded hover:bg-red-600"
              whileHover={{ scale: 1.05 }}
            >
              Continue with Google
            </motion.button>
          </Link>

          <div className="flex items-center justify-center mt-4">
            <div className="h-[1px] w-1/3 bg-gray-400"></div>
            <p className="px-2 text-gray-700">OR</p>
            <div className="h-[1px] w-1/3 bg-gray-400"></div>
          </div>

          <Link href="/login">
            <motion.button
              className="w-full px-4 py-2 mt-4 text-white bg-gray-500 rounded hover:bg-gray-600"
              whileHover={{ scale: 1.05 }}
            >
              Continue with Email/Password
            </motion.button>
          </Link>

          <div className="flex justify-between mt-4 text-sm text-gray-500">
            <Link href="/Privacy-policy">Privacy Policy</Link>
            <Link href="/Terms-conditions">Terms & Conditions</Link>
          </div>
        </div>
      </motion.div>

      {/* Dots Cursor */}
      <div
        className="absolute w-2 h-2 rounded-full bg-gradient-to-r from-green-200 to-green-500"
        style={{
          left: `${cursorPosition.x}px`,
          top: `${cursorPosition.y}px`,
          transform: 'translate(-50%, -50%)',
        }}
      ></div>
    </div>
  );
};

export default Popup;
