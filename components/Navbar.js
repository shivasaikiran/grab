import Image from 'next/image';
import { FaSearch, FaBell, FaBars, FaChevronDown, FaTags } from 'react-icons/fa';
import { FaRegUserCircle } from 'react-icons/fa';
import logo from '../Images/logo.png';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { auth } from '@/Firebase/Config'; // Assuming db is needed elsewhere in your code
import { signOut } from 'firebase/auth';
import {  animateScroll as scroll } from 'react-scroll';
import { useRouter } from 'next/router';



const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isOfferDropdownOpen, setIsOfferDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);
  const router = useRouter(); 
  
  const ref = useRef(null);
  const userDropdownRef = useRef(null);
  const categoryDropdownRef = useRef(null);
  const offerDropdownRef = useRef(null);
  const usermobDropdownRef = useRef(null);
  const categorymobDropdownRef = useRef(null);
  const offermobDropdownRef = useRef(null);
  const [query, setQuery] = useState('');
  const [isnotOpen, setIsNotOpen] = useState(false);

  const toggleDropdown = () => {
    setIsNotOpen(!isnotOpen);
  }

  const handleSearch = (e) => {
    e.preventDefault();
  
    const targetElement = document.getElementById(query);
    // Initialize router
  
    if (targetElement) {
      // Scroll to the element using react-scroll
      scroll.scrollTo(targetElement.offsetTop, {
        duration: 800, // Duration of the scroll animation
        smooth: 'smooth' // Smooth scrolling behavior
      });
    } else {
      // Redirect to a "Page Not Found" page
      router.push('/page-not-found'); // Assuming '/404' is your 404 page route
    }
  };


  const toggleUserDropdown = () => {
    setIsUserDropdownOpen(!isUserDropdownOpen);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/login');
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    const handleClickOutside = (event) => {
      const isMobileView = window.innerWidth < 768; // Adjust based on your breakpoints

      if (isMobileView) {
        if (usermobDropdownRef.current && !usermobDropdownRef.current.contains(event.target)) {
          setIsUserDropdownOpen(false);
        }
        if (categorymobDropdownRef.current && !categorymobDropdownRef.current.contains(event.target)) {
          setIsCategoryDropdownOpen(false);
        }
        if (offermobDropdownRef.current && !offermobDropdownRef.current.contains(event.target)) {
          setIsOfferDropdownOpen(false);
        }
        
        
      } else {
        if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
          setIsUserDropdownOpen(false);
        }
        if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target)) {
          setIsCategoryDropdownOpen(false);
        }
        if (offerDropdownRef.current && !offerDropdownRef.current.contains(event.target)) {
          setIsOfferDropdownOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      unsubscribe();
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

   
    
  const toggleCategoryDropdown = () => {
    setIsCategoryDropdownOpen(!isCategoryDropdownOpen);
  };
  const toggleOfferDropdown = () => {
    setIsOfferDropdownOpen(!isOfferDropdownOpen);
  };

  const handleDropdownItemClick = () => {
    setIsCategoryDropdownOpen(false);
    setIsOfferDropdownOpen(false);
    setIsOpen(true)
  };

  
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md lg:p-6 md:p-2">
      <div className="flex items-center justify-between h-16 px-2 mx-auto lg:container lg:h-8">
        <div className="flex items-center ">
          <button onClick={() => setIsOpen(!isOpen)} className="mr-4 text-xl text-green-600 md:hidden">
            <FaBars size={24} />
          </button>
          <Link href="/">
            <div className="flex items-center md:flex lg:mt-0 mt-[5px]">
              <Image src={logo} alt="logo" className="w-[77px] h-10 md:w-[130px] md:h-[44px]" />
            </div>
             



          </Link>
        </div>
        <div className="relative hidden ml-12 space-x-4 md:space-x-8 xl:space-x-8 md:flex">
        <div className="relative inline-block" ref={offerDropdownRef}>
  <a onClick={toggleOfferDropdown} className="font-bold text-gray-700 text-[16px] hover:text-green-500 cursor-pointer flex items-center space-x-2">
    {/* Optional icon */}
    <span>Deals</span>
  </a>
  {isOfferDropdownOpen && (
    <div className="absolute z-50 mt-1 transform -translate-x-1/2 left-1/2">
      {/* Arrow/Cone on top */}
      <div className="w-0 h-0 mx-auto border-b-8 border-x-8 border-x-transparent border-b-green-500"></div>
      {/* Dropdown content */}
      <div className="py-2 bg-green-100 rounded-lg shadow-lg w-[24vh] sm:w-[25vh] md:w-[25vh] lg:w-[25vh]">
        <div className="grid grid-cols-1 gap-2 px-6 py-3 text-center">
          <a href="/flipkart-deals-online" onClick={handleDropdownItemClick} className="flex items-center transition-colors duration-200 ease-in-out rounded hover:bg-green-100 whitespace-nowrap">
            <h3 className="font-bold text-black hover:text-green-500">FlipKart deals</h3>
          </a>
          <a href="/amazon-deals-online" onClick={handleDropdownItemClick} className="flex items-center transition-colors duration-200 ease-in-out rounded hover:bg-green-100 whitespace-nowrap">
            <h3 className="font-bold text-black hover:text-green-500">Amazon deals</h3>
          </a>
          <a href="/myntra-deals-online" onClick={handleDropdownItemClick} className="flex items-center transition-colors duration-200 ease-in-out rounded hover:bg-green-100 whitespace-nowrap">
            <h3 className="font-bold text-black hover:text-green-500">Myntra deals</h3>
          </a>
          <a href="/meesho-deals-online" onClick={handleDropdownItemClick} className="flex items-center transition-colors duration-200 ease-in-out rounded hover:bg-green-100 whitespace-nowrap">
            <h3 className="font-bold text-black hover:text-green-500">Meesho deals</h3>
          </a>
        </div>
      </div>
    </div>
  )}
</div>


          <div className="relative" ref={categoryDropdownRef}>
          <a
      onClick={toggleCategoryDropdown}
      className="flex items-center font-bold text-gray-700 text-[16px] hover:text-green-500 cursor-pointer"
    >
      Offers
     {/* Add the chevron down icon */}
    </a>
            {isCategoryDropdownOpen && (
              <div className="absolute z-50 mt-1 transform -translate-x-1/2 rounded-lg shadow-lg left-1/2">
                  <div className="w-0 h-0 mx-auto border-b-8 border-x-8 border-x-transparent border-b-green-500"></div>
                <div className="grid grid-cols-1 gap-2 px-8 py-4 w-[35vh] bg-green-100 text-center rounded-lg shadow-lg">
                  <a href='/mobile-offers-online' onClick={handleDropdownItemClick}><h3 className="font-bold text-black hover:text-green-500">Mobile</h3></a>
                  <a href='/electronics-offers-online' onClick={handleDropdownItemClick}><h3 className="font-bold text-black hover:text-green-500">Electronics</h3></a>
                  <a href='/fashion-offers-online' onClick={handleDropdownItemClick}><h3 className="font-bold text-black hover:text-green-500">Fashion</h3></a>
                  <a href='/footwear-offers-online' onClick={handleDropdownItemClick}><h3 className="font-bold text-black hover:text-green-500">Footwear</h3></a>
                  <a href='/beauty-offers-online' onClick={handleDropdownItemClick}><h3 className="font-bold text-black hover:text-green-500">Beauty</h3></a>
                  <a href='/baby-kids-offers-online' onClick={handleDropdownItemClick}><h3 className="font-bold text-black hover:text-green-500">Baby & Kids</h3></a>
                  <a href='/health-fitness-offers-online' onClick={handleDropdownItemClick}><h3 className="font-bold text-black hover:text-green-500">Health & Fitness</h3></a>
                  <a href='/home-kitchen-offers-online' onClick={handleDropdownItemClick}><h3 className="font-bold text-black hover:text-green-500">Home & Kitchen</h3></a>
                </div>
              </div>
            )}
          </div>
          <a href="/best-stores-online" className="font-bold text-gray-700 text-[16px] hover:text-green-500">Best Stores</a>
          <Link href="/blog-online" className="font-bold text-gray-700 text-[16px] hover:text-green-500">Blog</Link>
        </div>
        <div className="items-center hidden ml-auto space-x-4 md:flex">
        <div className="relative flex items-center mr-8">
      <input
        type="text"
        className="w-48 px-4 py-2 text-sm bg-gray-200 rounded-full lg:w-64 xl:w-80"
        placeholder="Search..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
       
      />
      <FaSearch
        className="absolute text-gray-500 cursor-pointer top-2 right-3"
        onClick={handleSearch}
      />
    </div>
        
    <div className="relative">
      <FaBell 
        className="ml-4 text-xl text-green-500 cursor-pointer" 
        onClick={toggleDropdown} 
      />
      {isnotOpen && (
        <div className="absolute right-0 w-64 mt-2 bg-white border border-gray-300 rounded shadow-lg">
          <ul className="py-2">
            <li className="px-4 py-2 hover:bg-gray-100">Notification 1</li>
            <li className="px-4 py-2 hover:bg-gray-100">Notification 2</li>
            <li className="px-4 py-2 hover:bg-gray-100">Notification 3</li>
          </ul>
        </div>
      )}
    </div>
          <Link href="/profile">
            <FaRegUserCircle className="relative ml-4 text-xl text-green-500 cursor-pointer" onClick={toggleUserDropdown} />
          </Link>
          {user ? (
            <div className="relative" ref={userDropdownRef}>
              {isUserDropdownOpen && (
                <div className="absolute right-0 z-50 w-48 bg-white rounded-lg shadow-lg top-full">
                  <p className="block px-4 py-2 text-gray-700">{user.displayName}</p>
                  {user.email === 'grabdealsdailyindia@gmail.com' && (
                    <Link href="/admin-dashboard-online" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 focus:bg-gray-100">Admin</Link>
                  )}
                  <button onClick={handleLogout} className="block px-4 py-2 text-gray-700 hover:bg-gray-100 focus:bg-gray-100">
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <span className="font-bold text-green-500 hover:underline">
              <Link href="/login" className="hover:underline">Login/Signup</Link>
            </span>
          )}
        </div>
        <div className={`md:hidden ${isOpen ? 'block' : 'hidden'} absolute top-16 z-50 left-0 right-0 bg-white border-b border-gray-200 shadow-md`}>
          <div className="flex flex-col p-4 space-y-2">
          <div className='relative border-b-2 border-green-100' ref={offermobDropdownRef}>
    <a href="#" onClick={toggleOfferDropdown} className="font-bold text-gray-700 text-[16px] hover:text-green-600 flex items-center space-x-2">
      {/* Icon for the Deals */}
      <span>Deals</span>
    </a>
    {isOfferDropdownOpen && (
      <div className="absolute left-0 z-50 py-2 mt-2 transition-transform duration-300 ease-in-out transform scale-95 bg-green-100 rounded-lg shadow-lg animate-fade-in">
        {/* Cone/Caret */}
        <div className="absolute w-0 h-0 transform -translate-x-1/2 border-b-4 -top-2 left-1/2 border-x-4 border-x-transparent border-b-green-500"></div>
        <div className="grid grid-cols-1 gap-2 px-4 py-3 text-center">
          <a href='/flipkart-deals-online' className="block px-4 py-2 transition-colors duration-200 ease-in-out rounded hover:bg-green-100">
            <h3 className="font-bold text-black hover:text-green-600">FlipKart Deals</h3>
          </a>
          <a href='/amazon-deals-online' className="block px-4 py-2 transition-colors duration-200 ease-in-out rounded hover:bg-green-100">
            <h3 className="font-bold text-black hover:text-green-600">Amazon Deals</h3>
          </a>
          <a href='/myntra-deals-online' className="block px-4 py-2 transition-colors duration-200 ease-in-out rounded hover:bg-green-100">
            <h3 className="font-bold text-black hover:text-green-600">Myntra Deals</h3>
          </a>
          <a href='/meesho-deals-online' className="block px-4 py-2 transition-colors duration-200 ease-in-out rounded hover:bg-green-100">
            <h3 className="font-bold text-black hover:text-green-600">Meesho Deals</h3>
          </a>
        </div>
      </div>
    )}
  </div>
  <div className='relative border-b-2 border-green-100' ref={categorymobDropdownRef}>
    <a href="#" onClick={toggleCategoryDropdown} className="font-bold text-gray-700 text-[16px] hover:text-green-600 flex items-center space-x-2">
       {/* Optional icon for visual appeal */}
      <span>Offers</span>
    </a>
    {isCategoryDropdownOpen && (
      <div className="absolute left-0 z-50 py-2 mt-2 transition-transform duration-300 ease-in-out transform scale-95 bg-green-100 rounded-lg shadow-lg animate-fade-in">
        {/* Cone/Caret */}
        <div className="absolute w-0 h-0 transform -translate-x-1/2 border-b-4 -top-2 left-1/2 border-x-4 border-x-transparent border-b-green-500"></div>
        <div className="grid grid-cols-1 gap-2 px-4 py-3 text-center">
          <a href='/mobile-offers-online' className="block px-4 py-2 transition-colors duration-200 ease-in-out rounded hover:bg-green-100">
            <h3 className="font-bold text-black hover:text-green-600">Mobile</h3>
          </a>
          <a href='/electronics-offers-online' className="block px-4 py-2 transition-colors duration-200 ease-in-out rounded hover:bg-green-100">
            <h3 className="font-bold text-black hover:text-green-600">Electronics</h3>
          </a>
          <a href='/fashion-offers-online' className="block px-4 py-2 transition-colors duration-200 ease-in-out rounded hover:bg-green-100">
            <h3 className="font-bold text-black hover:text-green-600">Fashion</h3>
          </a>
          <a href='/footwear-offers-online' className="block px-4 py-2 transition-colors duration-200 ease-in-out rounded hover:bg-green-100">
            <h3 className="font-bold text-black hover:text-green-600">Footwear</h3>
          </a>
          <a href='/beauty-offers-online' className="block px-4 py-2 transition-colors duration-200 ease-in-out rounded hover:bg-green-100">
            <h3 className="font-bold text-black hover:text-green-600">Beauty</h3>
          </a>
          <a href='/baby-kids-offers-online' className="block px-4 py-2 transition-colors duration-200 ease-in-out rounded hover:bg-green-100">
            <h3 className="font-bold text-black hover:text-green-600">Baby & Kids</h3>
          </a>
          <a href='/health-fitness-offers-online' className="block px-4 py-2 transition-colors duration-200 ease-in-out rounded hover:bg-green-100">
            <h3 className="font-bold text-black hover:text-green-600">Health & Fitness</h3>
          </a>
          <a href='/home-kitchen-offers-online' className="block px-4 py-2 transition-colors duration-200 ease-in-out rounded hover:bg-green-100">
            <h3 className="font-bold text-black hover:text-green-600">Home & Kitchen</h3>
          </a>
        </div>
      </div>
    )}
  </div>
            <a href="/best-stores-online" className="font-bold text-gray-700 border-b-2 border-green-100 text-[16px] hover:text-green-600">Best Stores</a>
            <a href="/blog-online" className="font-bold text-gray-700 border-b-2 border-green-100 text-[16px] hover:text-green-600">Blog</a>
          </div>
        </div>
        <div className="flex items-center md:hidden">
          
  <div className="relative w-[160px] sm:w-[140px] md:w-[180px] lg:w-[200px] xl:w-[220px]">
            <input type="text" className="w-full px-4 py-2 text-sm bg-gray-200 rounded-full" placeholder="Search..."
             value={query}
             onChange={(e) => setQuery(e.target.value)}
            />
            <FaSearch className="absolute text-gray-500 top-2 right-3"  onClick={handleSearch} />
          </div>
         
          <div className="relative">
      <FaBell 
        className="ml-4 text-xl text-green-500 cursor-pointer" 
        onClick={toggleDropdown} 
      />
      {/* {isOpen && (
        <div className="absolute right-0 w-64 mt-2 bg-white border border-gray-300 rounded shadow-lg">
          <ul className="py-2">
            <li className="px-4 py-2 hover:bg-gray-100">Notification 1</li>
            <li className="px-4 py-2 hover:bg-gray-100">Notification 2</li>
            <li className="px-4 py-2 hover:bg-gray-100">Notification 3</li>
          </ul>
        </div>
      )} */}
    </div>
          <div className="relative" ref={usermobDropdownRef}>
            <Link href="/profile">
              <FaRegUserCircle className="ml-4 text-xl text-green-500 cursor-pointer" onClick={toggleUserDropdown} />
            </Link>
            {isUserDropdownOpen && (
              <div className="absolute right-0 z-50 w-48 bg-white rounded-lg shadow-lg top-full">
                {user ? (
                  <>
                    <p className="block px-4 py-2 text-gray-700">{user.displayName}</p>
                    {user.email === 'grabdealsdailyindia@gmail.com' && (
                      <Link href="/admin-dashboard-online" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 focus:bg-gray-100">Admin</Link>
                    )}
                    <button onClick={handleLogout} className="block px-4 py-2 text-gray-700 hover:bg-gray-100 focus:bg-gray-100">
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/login" className="block px-4 py-2 text-gray-700 transition duration-300 hover:bg-gray-100">Login</Link>
                    <Link href="/login" className="block px-4 py-2 text-gray-700 transition duration-300 hover:bg-gray-100">Signup</Link>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
