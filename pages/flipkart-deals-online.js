import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { db } from '@/Firebase/Config';
import { collection, getDocs } from 'firebase/firestore';
import Product1 from '@/components/product1';
import Product2 from '@/components/Product2';
import Product3 from '@/components/Product3';
import path from '../Images/path.png'
import { FaArrowLeft, FaArrowRight, FaFacebook, FaInstagram, FaWhatsapp } from 'react-icons/fa';
import Link from 'next/link';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Slider from 'react-slick';
import discount from '../Images/discount.png'

const flipkartoffers = () => {
  const [banners, setBanners] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [ads, setAds] = useState([]);
  // const [products, setProducts] = useState([]);
  const [deals, setDeals] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const querySnapshot = await getDocs(collection(db, 'flipkartoffers'));
      const productsArray = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setDeals(productsArray);
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const adsSnapshot = await getDocs(collection(db,'flipkartads'));
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
    const fetchBanners = async () => {
      try {
        const bannersSnapshot = await getDocs(collection(db, 'flipkartbanner'));
        const bannersList = bannersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setBanners(bannersList);
      } catch (error) {
        console.error('Error fetching banners: ', error);
      }
    };

    fetchBanners();
  }, []);
  useEffect(() => {
    fetchBlogs();
  }, []);


  const fetchBlogs = async () => {
    try {
      const blogsRef = collection(db, 'flipkartblog',);
      const blogsSnapshot = await getDocs(blogsRef);
      const blogsList = blogsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setBlogs(blogsList);
    } catch (error) {
      console.error('Error fetching blogs: ', error);
      toast.error('Failed to fetch blogs. Please try again.');
    }
  };
  const staticPaths = [
    '/amazon-deals-online',
    '/myntra-deals-online',
    '/meesho-deals-online'
  ];
  const chunkArray = (array, size) => {
    const result = [];
    for (let i = 0; i < array.length; i += size) {
      result.push(array.slice(i, i + size));
    }
    return result;
  };
 const NextArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={`${className} custom-arrow next-arrow`}
      style={{
        ...style,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        right: '-32px',
        background: 'white',
        borderRadius: '4px',
        padding: '5px',
        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.15)',
        height: '70px',
        width: '30px',
      }}
      onClick={onClick}
    >
      <FaArrowRight />
    </div>
  );
};

// Define the PrevArrow component
const PrevArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={`${className} custom-arrow prev-arrow`}
      style={{
        ...style,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        left: '-32px',
        background: 'white',
        borderRadius: '4px',
        padding: '5px',
        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.15)',
        height: '70px',
        width: '30px'
      }}
      onClick={onClick}
    >
      <FaArrowLeft />
    </div>
  );
};

// Slider settings with arrows enabled
const settings = {
  arrows: true,
  infinite: true,
  speed: 500,
  slidesToShow: 6,
  slidesToScroll: 3,
  nextArrow: <NextArrow />,
  prevArrow: <PrevArrow />,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 6,
        slidesToScroll: 3,
        infinite: true,
        dots: true,
      }
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2,
      }
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      }
    }
  ]
}
const [showMore, setShowMore] = useState(false);
  
  const toggleShowMore = () => {
    setShowMore(!showMore);
  };
  const shouldShowMoreButton = deals.length > 20;


  const dealChunks = chunkArray(deals, 6);
  return (
    <div className='mt-[70px]'>
      {/* Banner Section */}
      <div className="relative   flex flex-col items-center justify-center w-full h-auto lg:flex-row lg:h-[11rem]">
        
      <div className="flex flex-col w-full lg:hidden mb-2  text-center bg-green-500 lg:w-2/3  h-[90px] lg:h-[130px] lg:ml-2 lg:mt-0">
  {banners.map((banner) => (
    <div key={banner.id} className="relative w-full h-full overflow-hidden">
      <img 
        src={banner.bannerImageUrl} 
        alt={`Banner ${banner.id}`}
        className="object-cover w-full h-full"
      />
    </div>
  ))}
</div>
        <div className="p-1 hidden   relative mb-1 bg-green-500 lg:mb-0 lg:mr-2 w-full lg:w-[30%] h-[90px] lg:h-[130px] lg:flex lg:flex-col flex-row  lg:space-y-2">
          <span className="relative inline-block mb-1 mr-2 lg:mb-2 lg:top-0 top-7 ">
            <h1 className="font-bold text-white lg:text-center text-start lg:text-4xl"> Flipkart Deals  </h1>
            <span className="absolute hidden sm:block bottom-[-4px] left-24 lg:left-20 lg:w-[230px] w-[160px] h-[2px] bg-white"></span>
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
        src={banner.bannerImageUrl} 
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
            Flipkart
              <span className="absolute bottom-[-4px] left-0 lg:w-[155px] w-[90px] h-[2px] bg-[#26ca43]"></span>
            </span>
          </h2>
        </div>
     
      
     
        <div className="overflow-x-auto">
          <div className="flex mt-2 mb-2 space-x-4 min-w-max">
            {[
               { label: 'Amazon', href: '/amazon-deals-online' },
              { label: 'Flipkart', href: '/flipkart-deals-online' },
              { label: 'Meesho', href: '/meesho-deals-online' },
              { label: 'Myntra', href: '/myntra-deals-online' },
              
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

      {/* Banners Section */}
      {/* <Product2 /> */}
      <div className="px-1 lg:hidden">
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-6">
        {deals.slice(0, showMore ? deals.length : 20).map((product) => (
          <div key={product.id} className="px-2 mb-3">
            <div className="relative flex flex-col justify-between lg:h-64 h-[200px] border bg-white rounded-sm shadow-md group hover:shadow-green-300 hover:border-green-500">
              <div className="overflow-hidden aspect-w-1 h-[200px]">
                <img
                  className="object-cover w-full h-full transition-all duration-300 group-hover:scale-125"
                  src={product.imageUrl}
                  alt={product.title}
                />
              </div>
              <div className="absolute">
                <Image src={discount} className='w-8' alt="Discount"/>
                <p className="sm:px-0.5 bottom-10 relative sm:py-2 px-[2px] py-[7px] text-[14px] sm:text-sm font-bold tracking-wide text-white uppercase">
                  {product.discount}%
                </p>
              </div>
              <div className="flex flex-col items-center p-2 space-y-1">
                <div className="text-center">
                  <h3 className="text-xs font-bold text-gray-900 sm:text-sm md:text-base line-clamp-2">
                    <a href="#" title={product.title}>
                      {product.title}
                      <span className="absolute inset-0" aria-hidden="true"></span>
                    </a>
                  </h3>
                </div>
                <div className="text-center">
                  <div className="flex items-center">
                    <img src={product.logoUrl} className="h-4 mr-4 lg:mr-6 lg:h-6 lg:w-16 w-14" alt="Product Logo"/>
                    <div className='flex space-x-1 lg:space-x-2'>
                      <p className="text-xs font-bold text-gray-500 line-through sm:text-sm md:text-base">
                        ₹{product.price}
                      </p>
                      <p className="text-xs font-bold text-gray-900 sm:text-sm md:text-base">
                        ₹{product.discountprice}
                      </p>
                    </div>
                  </div>
                </div>
                <a href={product.link}>
                  <button className="flex-1 py-3 text-xs font-bold text-white bg-green-500 border-0 rounded-md w-[70px] relative inline-flex items-center justify-center p-4 px-6 overflow-hidden transition duration-300 ease-out shadow-md group">
                    <span className="absolute inset-0 flex items-center justify-center w-full h-full text-white duration-300 -translate-x-full bg-green-500 group-hover:translate-x-0 ease">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                      </svg>
                    </span>
                    <span className="absolute flex items-center justify-center w-full h-full font-bold text-white transition-all duration-300 transform group-hover:translate-x-full ease">Buy Now</span>
                  </button>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
      {shouldShowMoreButton && !showMore && (
        <div className="flex justify-center mt-4">
          <button
            className="px-4 py-2 text-sm font-semibold text-white bg-green-500 rounded-md shadow-md hover:bg-gray-300"
            onClick={toggleShowMore}
          >
            Show More
          </button>
        </div>
      )}
    </div>
      <div className='hidden px-8 sm:block'>
      {dealChunks.map((chunk, index) => (
        <Slider {...settings} className="mt-2" key={index}>
          {chunk.map((product) => (
            <div key={product.id} className="px-2 mb-3">
              <div className="relative flex flex-col justify-between lg:h-64 h-[200px] border bg-white rounded-sm shadow-md group hover:shadow-green-300 hover:border-green-500">
                <div className="overflow-hidden aspect-w-1 h-[200px]">
                  <img
                    className="object-cover w-full h-full transition-all duration-300 group-hover:scale-125"
                    src={product.imageUrl}
                    alt={product.title}
                  />
                </div>
                <div className="absolute">
                  <Image src={discount} className="w-8" alt="Discount"/>
                  <p className="sm:px-0.5 bottom-10 relative sm:py-2 px-[2px] py-[7px] text-[14px] sm:text-sm font-bold tracking-wide text-white uppercase">
                    {product.discount}% 
                  </p>
                </div>
                <div className="flex flex-col items-center p-2 space-y-1">
                  <div className="text-center">
                    <h3 className="text-xs font-bold text-gray-900 sm:text-sm md:text-base line-clamp-2">
                      <a href="#" title={product.title}>
                        {product.title} 
                        <span className="absolute inset-0" aria-hidden="true"></span>
                      </a>
                    </h3>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center">
                      <img src={product.logoUrl} className="h-4 mr-4 lg:mr-6 lg:h-6 lg:w-16 w-14" alt="Product Logo"/>
                      <div className="flex space-x-1 lg:space-x-2">
                        <p className="text-xs font-bold text-gray-500 line-through sm:text-sm md:text-base">
                          ₹{product.price}
                        </p>
                        <p className="text-xs font-bold text-gray-900 sm:text-sm md:text-base">
                          ₹{product.discountprice}
                        </p>
                      </div>
                    </div>
                  </div>
                  <a href={product.link}>
                    <button className="flex-1 py-3 text-xs font-bold text-white bg-green-500 border-0 rounded-md w-[70px] relative inline-flex items-center justify-center p-4 px-6 overflow-hidden transition duration-300 ease-out shadow-md group">
                      <span className="absolute inset-0 flex items-center justify-center w-full h-full text-white duration-300 -translate-x-full bg-green-500 group-hover:translate-x-0 ease">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                        </svg>
                      </span>
                      <span className="absolute flex items-center justify-center w-full h-full font-bold text-white transition-all duration-300 transform group-hover:translate-x-full ease">Buy Now</span>
                    </button>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      ))}
    </div>

  
      {/* <Product1 />
      <Product3 />
      <Product1 />
      <Product3/>
      <Product1/> */}
      <div className="justify-center hidden px-2 mt-8 mb-10 lg:grid lg:grid-cols-3 lg:px-8 sm:grid-cols-3 ">
      {ads.slice(0, 3).map((ad, index) => (
        <Link href={staticPaths[index]} key={ad.id}>
          <div className="flex justify-center">
            <div className="flex items-center justify-center p-2 border rounded-md shadow-md border-gray-300 hover:border-green-500 hover:shadow-green-500 h-[60px] w-[100px] lg:h-[180px] lg:w-[420px]">
              <img src={ad.imageUrl} alt={ads} className="w-full h-full rounded-md" />
            </div>
          </div>
        </Link>
      ))}
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
};

export default flipkartoffers;
