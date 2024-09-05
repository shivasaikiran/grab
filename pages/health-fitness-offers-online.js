import React, { useState, useEffect } from 'react';
import { db } from '@/Firebase/Config';
import { collection, getDocs } from 'firebase/firestore';
import Link from 'next/link';
import { FaArrowRight, FaFacebook, FaInstagram, FaWhatsapp } from 'react-icons/fa';
import add1 from '../Images/add1.png'

import path from '../Images/path.png'

function Healthandfitness() {
  const [selectedTab, setSelectedTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAllCoupons, setShowAllCoupons] = useState(false); // State to toggle showing all coupons
  const [mobileItems, setMobileItems] = useState([]); // State to store fetched data
  const [banners, setBanners] = useState([]);
  const [ads, setAds] = useState([]);
  const [blogs, setBlogs] = useState([]);
  

  const tabs = [
    {
      id: 'all',
      label: 'All',
    },
    // {
    //   id: 'coupons',
    //   label: 'Coupons (8)',
    // }offers
    // {
    //   id: 'offers',
    //   label: 'Deals (208)',
    // },
  ];


 

  // Fetch banners from Firestore on component mount
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'healthandfitnessbanners'));
        const bannerList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setBanners(bannerList);
      } catch (error) {
        console.error('Error fetching banners: ', error);
      }
    };

    fetchBanners();
  }, []);

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const adsSnapshot = await getDocs(collection(db, 'categories', 'healthandfitness', 'ads'));
        const adsList = adsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setAds(adsList);
      } catch (error) {
        console.error('Error fetching ads: ', error);
        // Handle error (e.g., show a toast notification)
      }
    };

    fetchAds();
  }, []);

  useEffect(() => {
    fetchBlogs();
  }, []);


  const fetchBlogs = async () => {
    try {
      const blogsRef = collection(db, 'categories', 'healthandfitness', 'blogs');
      const blogsSnapshot = await getDocs(blogsRef);
      const blogsList = blogsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setBlogs(blogsList);
    } catch (error) {
      console.error('Error fetching blogs: ', error);
      toast.error('Failed to fetch blogs. Please try again.');
    }
  };
  
  const handleTabClick = (tabId) => {
    setSelectedTab(tabId);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const toggleShowAllCoupons = () => {
    setShowAllCoupons(!showAllCoupons);
  };

  // Fetch data from Firestore
  useEffect(() => {
    const fetchMobileItems = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'categories', 'beautyproducts', 'items'));
        const items = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setMobileItems(items);
      } catch (error) {
        console.error('Error fetching mobile items: ', error);
      }
    };

    fetchMobileItems();
  }, []);

  return (
    <div className="mt-[70px]">
      {/* Banner Section */}
      <div className="relative flex flex-col items-center justify-center w-full h-auto lg:flex-row lg:h-[11rem]">
      <div className="flex flex-col w-full lg:hidden mb-2  text-center bg-green-500 lg:w-2/3  h-[90px] lg:h-[130px] lg:ml-2 lg:mt-0">
  {banners.map((banner) => (
    <div key={banner.id} className="relative w-full h-full overflow-hidden">
      <img 
        src={banner.imageUrl} 
        alt={`Banner ${banner.id}`}
        className="object-cover w-full h-full"
      />
    </div>
  ))}
</div>
        <div className="p-1 hidden  relative mb-1 bg-green-500 lg:mb-0 lg:mr-2 w-full lg:w-[30%] h-[90px] lg:h-[130px] lg:flex lg:flex-col flex-row space-x-4 lg:space-y-2">
          <span className="relative inline-block mb-1 mr-2 lg:mb-2 lg:top-0 top-7 ">
            <h1 className="font-bold text-white text-start text-[13px] lg:text-center lg:text-4xl">Health & fitness </h1>
            <span className="absolute hidden sm:block bottom-[-4px] left-24 lg:left-16 lg:w-[270px] w-[160px] h-[2px] bg-white"></span>
          </span>
          <div className="flex justify-center">
            <div className="flex flex-row space-x-2 p-1 relative lg:top-0 top-5 border-red-500 lg:h-12 h-10 lg:space-x-6 border bg-white lg:w-[300px] w-[250px] justify-center rounded-md">
            <button className="flex items-center btn-join-now">
  Join Now
  <span className='ml-2'><FaArrowRight/></span>
</button>


      <FaInstagram size={40} className="icon-instagram hover:scale-125 mobile-size" />
      <FaWhatsapp size={40} className="icon-whatsapp hover:scale-125 mobile-size" />
      <FaFacebook size={40} className="text-blue-500 hover:scale-125 mobile-size" />
    
            </div>
          </div>
        </div>
        <div className="flex flex-col w-full hidden sm:block  text-center bg-green-500 lg:w-2/3  h-[90px] lg:h-[130px] lg:ml-2 lg:mt-0">
  {banners.map((banner) => (
    <div key={banner.id} className="relative w-full h-full overflow-hidden">
      <img 
        src={banner.imageUrl} 
        alt={`Banner ${banner.id}`}
        className="object-cover w-full h-full"
      />
    </div>
  ))}
</div>

<div className="flex justify-center w-full px-4 mt-4 mb-4 lg:hidden md:hidden">
  <div className="flex flex-row space-x-4 p-2 justify-between border-red-500 border bg-white w-full max-w-[400px]  rounded-md">
    <button className="flex items-center text-white text-[12px] p-2 bg-red-500 font-bold rounded-3xl btn-join-now">
      Join Now
      <span className="ml-2 text-white"><FaArrowRight /></span>
    </button>
    <FaInstagram size={30} className="text-red-500 transition-transform duration-300 hover:scale-125" />
    <FaWhatsapp size={30} className="text-green-500 transition-transform duration-300 hover:scale-125" />
    <FaFacebook size={30} className="text-blue-500 transition-transform duration-300 hover:scale-125" />
  </div>
</div>

      </div>

      <div className="lg:hidden md:hidden w-40% px-4">
      <div className="mb-4 w-[350px] lg:hidden md:hidden">
          <h2 className="text-2xl font-bold text-black sm:text-3xl">
            <span className="relative inline-block mr-2">
            Health & Fitness
              <span className="absolute bottom-[-4px] left-0 lg:w-[155px] w-[185px] h-[2px] bg-[#26ca43]"></span>
            </span>
          </h2>
        </div>
     
      
     
        <div className="overflow-x-auto">
          <div className="flex mt-2 mb-2 space-x-4 min-w-max">
            {[
              
              { label: 'Mobile', href: '/mobile-offers-online' },
              { label: 'Fashion', href: '/fashion-offers-online' },
              { label: 'Footwear', href: '/footwear-offers-online' },
              { label: 'Electronics', href: '/electronics-offers-online' },
              { label: 'Beauty', href: '/beauty-offers-online' },
              { label: 'Baby & Kids', href: '/baby-kids-offers-online' },
              { label: 'Health & Fitness', href: '/health-fitness-offers-online' },
              { label: 'Home & Kitchen', href: '/home-kitchen-offers-online' },
              { label: 'More', href: '/' }
            ].map((category) => (
              <Link href={category.href} key={category.label}>
                <div className="flex items-center p-3 mb-3 text-xs transition-all duration-300 ease-in-out border border-gray-300 rounded-md cursor-pointer hover:border-green-500 hover:text-green-500 hover:bg-green-50">
                  {category.label}
                </div>
              </Link>
            ))}
          </div>
        </div>
    
    


      </div>



      {/* Main Content Section */}
      <div className="flex flex-col px-6 md:flex-row">
        {/* Left Section */}
        <div className="hidden w-full p-4 bg-green-100 rounded-md md:w-1/4 sm:block">
          
        <div className="mb-4">
            <h3 className="text-lg font-bold text-green-500"> Categories</h3>
            <div>
          <Link href='/mobile-deals-online'> <p className="ml-2">Mobile </p></Link>
            </div>
            <div>
              
            <Link href='/fashion-deals-online'> <p className="ml-2">Fashion </p></Link>
            </div>
            <div>
              
            <Link href='/footwear-deals-online'> <p className="ml-2">Footwear </p></Link>
            </div>
            <div>
             
            <Link href='/electronics-deals-online'> <p className="ml-2">Electronics </p></Link>
            </div>
            <div>
              
            <Link href='/beauty-deals-online'> <p className="ml-2">Beauty </p></Link>
            </div>
            <div>
              
            <Link href='/baby-kids-deals-online'> <p className="ml-2">Baby & Kids </p></Link>
            </div>
            <div>
             
            <Link href='/health-fitness-deals-online'> <p className="ml-2">Health & Fitness </p></Link>
            </div>
            <div>
             
            <Link href='/home-kitchen-deals-online'> <p className="ml-2">Home & Kitchen</p></Link>
            </div>
          </div>
         
          <div className="flex flex-wrap gap-4">
      {ads.map(ad => (
        <div
          key={ad.id}
          className="w-[300px] h-[250px] bg-white border rounded-md shadow-md group hover:shadow-green-500 hover:border-green-500 mb-4 flex items-center justify-center p-2"
        >
          <img
            src={ad.imageUrl} // Use the URL from your Firebase storage
            alt={`Ad image ${ad.id}`} // Provide a unique alt text for each image
            className="object-cover w-full h-full rounded-md"
            width={300} // Add width to avoid layout shift
            height={250} // Add height to avoid layout shift
          />
        </div>
      ))}
    </div>
          
          
       
        </div>

        {/* Right Section */}
        <div className="w-full px-1 py-2 lg:px-4 lg:py-4 md:w-3/4">
          {/* Tabs and Filter Section */}
          

          {/* Content Section */}
          <div>
            
              <>
             
                {mobileItems.map((item) => (
              <div key={item.id} className="p-4 mb-4 bg-white border rounded-md shadow">
              <div className="flex items-center justify-between mb-2">
                
              </div>
              <a href={item.link} target="_blank" rel="noopener noreferrer">
              <div className="flex items-center">
                <div className="flex flex-col items-center mr-4">
                  {item.imageUrl && (
                    <div className="border-[1px] w-[100px] h-[78px] rounded-md mb-2 py-5 px-2">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className=" w-[75px] h-[36px] rounded-md"
                      />
                    </div>
                  )}
                  <div className="text-gray-500">{item.name}</div>
                </div>
                <div className="flex flex-col justify-between flex-grow">
                  <div className='ml-2'>
                    <div className="text-xl font-bold lg:text-3xl"><span className='mr-2 text-red-500 discount-shake'>{item.discount}% OFF</span><span>{item.discounttext}</span></div>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                  <div className="flex items-center justify-end ">
                    <button className="px-4 py-2 font-bold text-white bg-red-500 rounded-md">
                      Grab Deal
                    </button>
                  </div>
                </div>
              </div>
              </a>
            </div>
            
              
                ))}

                {/* Show More Button */}
                {showAllCoupons && (
                  <>
                   {mobileItems.slice(0, showAllCoupons ? mobileItems.length : 20).map((item) => (
                         <div key={item.id} className="p-4 mb-4 bg-white border rounded-md shadow">
                         <div className="flex items-center justify-between mb-2">
                           
                         </div>
                         <a href={item.link} target="_blank" rel="noopener noreferrer">
              <div className="flex items-center">
                <div className="flex flex-col items-center mr-4">
                  {item.imageUrl && (
                    <div className="border-[1px] w-[100px] h-[78px] rounded-md mb-2 py-5 px-2">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className=" w-[75px] h-[36px] rounded-md"
                      />
                    </div>
                  )}
                  <div className="text-gray-500">{item.name}</div>
                </div>
                <div className="flex flex-col justify-between flex-grow">
                  <div className='ml-2'>
                    <div className="text-xl font-bold lg:text-3xl"><span className='mr-2 text-red-500 discount-shake'>{item.discount}% OFF</span><span>{item.discounttext}</span></div>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                  <div className="flex items-center justify-end ">
                    <button className="px-4 py-2 font-bold text-white bg-red-500 rounded-md">
                      Grab Deal
                    </button>
                  </div>
                </div>
              </div>
              </a>
                       </div>
                    ))}
                  </>
                )}
                
                {mobileItems.length > 20 && (
                <div className="flex justify-center mt-4">
                  <button
                    className="px-4 py-2 text-sm font-semibold text-gray-900 bg-green-500 rounded-md shadow-md hover:bg-gray-300"
                    onClick={toggleShowAllCoupons}
                  >
                    {showAllCoupons ? 'Show Less' : 'Show More'}
                  </button>
                </div>
                )}
              </>
          
          </div>
        </div>
      </div>

      <div className="justify-center hidden grid-cols-3 gap-2 px-6 mt-8 mb-10 lg:grid lg:gap-4 lg:grid-cols-7">
       
      <Link href='/electronics-offers-online'><div className="flex justify-center">
          <div className="flex items-center justify-center p-2  border rounded-md shadow-md border-gray-300 hover:border-green-500 hover:shadow-green-500 h-[60px] w-[100px] lg:h-[70px] lg:w-[420px]">
          <p className='text-xs font-bold lg:text-base hover:text-green-500'>Electronics</p>
          </div>
        </div></Link>
        <Link href='/fashion-offers-online'><div className="flex justify-center">
          <div className="flex items-center justify-center p-2  border rounded-md shadow-md border-gray-300 hover:border-green-500 hover:shadow-green-500 h-[60px] w-[100px] lg:h-[70px] lg:w-[420px]">
          <p className='text-xs font-bold lg:text-base hover:text-green-500'>Fashion</p>
          </div>
        </div></Link>
        <Link href='/footwear-offers-online'><div className="flex justify-center">
          <div className="flex items-center justify-center p-2  border rounded-md shadow-md border-gray-300 hover:border-green-500 hover:shadow-green-500 h-[60px] w-[100px] lg:h-[70px] lg:w-[420px]">
          <p className='text-xs font-bold lg:text-base hover:text-green-500'>Footwear</p>
          </div>
        </div></Link>
        <Link href='/beauty-offers-online'><div className="flex justify-center">
          <div className="flex items-center justify-center p-2  border rounded-md shadow-md border-gray-300 hover:border-green-500 hover:shadow-green-500 h-[60px] w-[100px] lg:h-[70px] lg:w-[420px]">
          <p className='text-xs font-bold lg:text-base hover:text-green-500'>Beauty</p>
          </div>
        </div></Link>
        <Link href='/baby-kids-offers-online'><div className="flex justify-center">
          <div className="flex items-center justify-center lg:p-2  border rounded-md shadow-md border-gray-300 hover:border-green-500 hover:shadow-green-500 h-[60px] w-[100px] lg:h-[70px] lg:w-[420px]">
          <p className='text-xs font-bold lg:text-base hover:text-green-500'>Baby & Kids</p>
          </div>
        </div></Link>
        <Link href='/mobile-offers-online'><div className="flex justify-center">
          <div className="flex items-center justify-center p-2  border rounded-md shadow-md border-gray-300 hover:border-green-500 hover:shadow-green-500 h-[60px] w-[100px] lg:h-[70px] lg:w-[420px]">
          <p className='text-xs font-bold lg:text-base hover:text-green-500'>Mobile</p>
          </div>
        </div></Link>
        <Link href='/home-kitchen-offers-online'><div className="flex justify-center">
          <div className="flex items-center justify-center lg:p-2  border rounded-md shadow-md border-gray-300 hover:border-green-500 hover:shadow-green-500 h-[60px] w-[100px] lg:h-[70px] lg:w-[420px]">
          <p className='text-xs font-bold lg:text-base hover:text-green-500'>Home & Kitchen</p>
          </div>
        </div></Link> 

       
        
        
      </div>
      <div class="  bg-white flex px-6">
  
  


      <div className="p-6 mb-4 bg-white border rounded-md shadow-md">
      {/* <h2 className="mb-4 text-2xl font-bold text-center text-orange-500">Latest Blog Posts</h2> */}
      {blogs.length === 0 ? (
        <p className="text-center text-gray-500">No blog posts available.</p>
      ) : (
        <div className="space-y-4">
          {blogs.map(blog => (
            <div key={blog.id} className="pb-4 mb-4 border-b">
              {/* <h3 className="mb-2 text-xl font-semibold">Blog Title</h3> */}
              <div className="text-gray-700" dangerouslySetInnerHTML={{ __html: blog.content }} />
            </div>
          ))}
        </div>
      )}
    </div>
        </div>
    </div>
  );
}

export default Healthandfitness;
