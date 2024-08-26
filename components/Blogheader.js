import React, { useState, useEffect, useRef } from 'react';
import logo from '../Images/logo.png';
import Image from 'next/image';
import { FaHome, FaTag, FaFilm, FaPlane, FaTimes, FaSearch } from 'react-icons/fa';
import { GiCelebrationFire } from 'react-icons/gi';
import Link from 'next/link';
import { RiDiscountPercentFill } from 'react-icons/ri';
import { useRouter } from 'next/router';

const Blogheader = ({ searchTerm, setSearchTerm }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const menuRef = useRef(null);
  const router = useRouter();

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Trigger search or navigation as needed
    router.push(`/blog?search=${searchTerm}`);
  };

  
  const toggleMenu = () => {
    setIsMenuOpen(prev => !prev);
  };

  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setIsMenuOpen(false);
    }
  };

  const handleItemClick = () => {
    if (window.innerWidth <= 768) { // Close menu on item click only in mobile view
      setIsMenuOpen(false);
    }
  };

 

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

 

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
      <div className="container flex items-center justify-between px-4 py-3 mx-auto">
        <Link href="/" className="hidden text-xl font-bold text-gray-800 sm:block ">
          <Image src={logo} alt="Grabon Logo" className="w-24" />
        </Link>
        <button
          onClick={toggleMenu}
          className="p-2 text-gray-800 lg:hidden focus:outline-none"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
        </button>
       
        <Link href="/" className="ml-20 text-xl font-bold text-gray-800 lg:hidden">
          <Image src={logo} alt="Grabon Logo" className="w-24" />
        </Link>
        <div className="relative flex-grow ml-28 lg:hidden">
        {!isSearchOpen ? (
  <button onClick={toggleSearch} className="p-2 text-gray-500 focus:outline-none">
    <FaSearch className="text-xl" />
  </button>
) : (
  <div className="fixed top-0 left-0 right-0 z-50 w-full bg-white shadow-lg">
    <div className="relative flex items-center w-full h-20 px-4 lg:px-8">
    <form onSubmit={handleSubmit}>
    <input
  type="text"
  value={searchTerm}
            onChange={handleSearch}
  placeholder="Search..."
  className="w-full px-3 py-2 text-lg border-none outline-none"
/>

    </form>
      <button onClick={toggleSearch} className="absolute text-gray-500 transform -translate-y-1/2 top-1/2 right-4">
        <FaTimes className="text-xl" />
      </button>
    </div>
  </div>
)}

    </div>
       
        <ul
          ref={menuRef}
          className={`lg:flex lg:space-x-6 lg:relative lg:bg-transparent absolute w-full bg-white lg:top-auto lg:right-0 transition-transform transform ${
            isMenuOpen ? 'translate-x-0' : 'translate-x-full'
          } top-16 right-0 lg:translate-x-0 space-y-4 lg:space-y-0 px-4 py-4 lg:px-0 lg:py-0 lg:justify-end`}
        >
          {/* Search bar in mobile view */}
         
          <li className="flex items-center space-x-2 lg:space-x-3">
            <RiDiscountPercentFill size={20} className="text-green-500" />
            <Link href="/" onClick={handleItemClick} className="block font-bold hover:text-green-500">Deals & Offers</Link>
          </li>
          <li className="flex items-center space-x-2 lg:space-x-3">
            <FaTag className="text-green-500" />
            <Link href="/blog-online?category=Shopping" onClick={handleItemClick} className="block font-bold hover:text-green-500">Shopping</Link>
          </li>
          <li className="flex items-center space-x-2 lg:space-x-3">
            <FaFilm className="text-green-500" />
            <Link href="/blog-online?category=Entertainment" onClick={handleItemClick} className="block font-bold hover:text-green-500">Entertainment</Link>
          </li>
          <li className="flex items-center space-x-2 lg:space-x-3">
            <FaPlane className="text-green-500" />
            <Link href="/blog-online?category=Travel" onClick={handleItemClick} className="block font-bold hover:text-green-500">Travel</Link>
          </li>
          <li className="flex items-center space-x-2 lg:space-x-3">
            <GiCelebrationFire className="text-green-500" />
            <Link href="/blog-online?category=Festival" onClick={handleItemClick} className="block font-bold hover:text-green-500">Festival</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Blogheader;
