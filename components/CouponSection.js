import React, { useState, useEffect } from 'react';
import { db } from '@/Firebase/Config';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import Slider from 'react-slick';
import CouponCard from './CouponCard';
import { FaMobileAlt, FaLaptop, FaTshirt, FaBaby, FaHome, FaFemale, FaRunning, FaShoePrints, FaArrowRight, FaArrowLeft } from 'react-icons/fa';
import CategoryTab from './categoryTap';

const CouponSection = () => {
  const [activeCategory, setActiveCategory] = useState('Mobile');
  const [coupons, setCoupons] = useState([]);
  const [visibleCount, setVisibleCount] = useState(4); // Number of coupons to display initially

  const NextArrow = (props) => {
    const { className, style, onClick } = props;
    return (
      <div
      className={`${className} custom-arrow arrow hide-on-mobile`} // Add a class for mobile
      style={{
        ...style,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        right: '-38px',
        background: 'white',
        borderRadius: '4px',
        padding: '5px',
        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.15)',
        height: '70px',
        width: '30px',
        zIndex: 1,
      }}
      onClick={onClick}
    >
      <FaArrowRight />
    </div>
  
    );
  };

  const PrevArrow = (props) => {
    const { className, style, onClick } = props;
    return (
      <div
        className={`${className} custom-arrow prev-arrow hide-on-mobile1`}
        style={{
          ...style,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          left: '-38px',
          background: 'white',
          borderRadius: '4px',
          padding: '5px',
          boxShadow: '0 2px 5px rgba(0, 0, 0, 0.15)',
          height: '70px',
          width: '30px',
          zIndex: 1,
        }}
        onClick={onClick}
      >
        <FaArrowLeft />
      </div>
    );
  };

  useEffect(() => {
    const q = query(collection(db, 'coupons'), where('category', '==', activeCategory));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const couponsData = [];
      querySnapshot.forEach((doc) => {
        couponsData.push({ id: doc.id, ...doc.data() });
      });
      setCoupons(couponsData);
    });
    return () => unsubscribe();
  }, [activeCategory]);

  const handleShowMore = () => {
    setVisibleCount(prevCount => prevCount + 4);
  };

  const sliderSettings = {
   
    infinite: true,
    speed: 500,
    arrows:true,
    slidesToShow: 4,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 4,
          arrows:true,
          slidesToScroll: 1,
          arrows: true,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          rows: 1,
          slidesToScroll: 1,
          infinite: true,
          arrows:false,
          dots:false,
          nextArrow: <NextArrow />,
          prevArrow: <PrevArrow />,
          arrows:true
        },
      },
    ],
  };

  const tabSettings = {
    dots: false,
    infinite: true,
    speed: 300, // Reduced speed for smoother transitions
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: false,
    swipeToSlide: true,
    touchMove: true,
    cssEase: 'ease-in-out', // Smooth transition
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 4,
          rtl: false // Ensure left-to-right scrolling
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          rtl: false // Ensure left-to-right scrolling
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
          rtl: false // Ensure left-to-right scrolling
        },
      },
    ],
  };

  const getCategoryPath = (category) => {
    switch (category) {
      case 'Mobile': return '/mobile-offers-online';
      case 'Electronics': return '/electronics-offers-online';
      case 'Fashion': return '/fashion-offers-online';
      case 'Footwear': return '/footwear-offers-online';
      case 'Beauty': return '/beauty-offers-online';
      case 'Baby & Kids': return '/baby-kids-offers-online';
      case 'Health & Fitness': return '/health-fitness-offers-online';
      case 'Home & Kitchen': return '/home-kitchen-offers-online';
      default: return '/';
    }
  };

  const displayedCoupons = coupons.slice(0, visibleCount);

  return (
    <div className='bg-green-100'id='coupons'>
      <div className="w-full px-8 mb-8">
        <h2 className="text-[22px] font-bold text-black sm:text-3xl">
          <span className="relative inline-block mr-2">
            Popular
            <span className="absolute bottom-[-4px] left-0 lg:w-[210px] w-[160px] h-[2px] bg-[#26ca43]"></span>
          </span>
           Offers
        </h2>
      </div>
      <div className="w-full mx-auto">
        <div className="mx-auto lg:container">
          <div className='hidden md:block'>
            <div className="flex flex-wrap justify-center mb-4 overflow-x-auto lg:space-x-4 md:space-x-1">
              <CategoryTab category="Mobile" activeCategory={activeCategory} setActiveCategory={setActiveCategory} icon={<FaMobileAlt />} />
              <CategoryTab category="Electronics" activeCategory={activeCategory} setActiveCategory={setActiveCategory} icon={<FaLaptop />} />
              <CategoryTab category="Fashion" activeCategory={activeCategory} setActiveCategory={setActiveCategory} icon={<FaTshirt />} />
              <CategoryTab category="Footwear" activeCategory={activeCategory} setActiveCategory={setActiveCategory} icon={<FaShoePrints />} />
              <CategoryTab category="Beauty" activeCategory={activeCategory} setActiveCategory={setActiveCategory} icon={<FaFemale />} />
              <CategoryTab category="Baby & Kids" activeCategory={activeCategory} setActiveCategory={setActiveCategory} icon={<FaBaby />} />
              <CategoryTab category="Health & Fitness" activeCategory={activeCategory} setActiveCategory={setActiveCategory} icon={<FaRunning />} />
              <CategoryTab category="Home & Kitchen" activeCategory={activeCategory} setActiveCategory={setActiveCategory} icon={<FaHome />} />
            </div>
          </div>
          <div className='py-2 pl-7 md:hidden bg-slate-100'>
  <Slider {...tabSettings} className="flex items-center justify-center overflow-x-auto tabs-slider">
    <div className="flex flex-col items-center cursor-pointer" onClick={() => setActiveCategory('Mobile')}>
      <div className={`flex items-center justify-center w-12 h-12 rounded-full mb-2 ${activeCategory === 'Mobile' ? 'bg-green-100' : 'bg-white'}`}>
        <FaMobileAlt className='text-xl text-green-500' />
      </div>
      <span className={`${activeCategory === 'Mobile' ? 'text-green-700 font-bold' : 'text-gray-700'} text-[9px] ml-2 font-bold`}>Mobile</span>
    </div>

    <div className="flex flex-col items-center cursor-pointer" onClick={() => setActiveCategory('Electronics')}>
      <div className={`flex items-center justify-center w-12 h-12 rounded-full mb-2 ${activeCategory === 'Electronics' ? 'bg-green-100' : 'bg-white'}`}>
        <FaLaptop className='text-xl text-green-500' />
      </div>
      <span className={`${activeCategory === 'Electronics' ? 'text-green-700 font-bold' : 'text-gray-700'} text-[9px]  font-bold`}>
        Electronics
      </span>
    </div>

    <div className="flex flex-col items-center cursor-pointer" onClick={() => setActiveCategory('Fashion')}>
      <div className={`flex items-center justify-center w-12 h-12 rounded-full mb-2 ${activeCategory === 'Fashion' ? 'bg-green-100' : 'bg-white'}`}>
        <FaTshirt className='text-xl text-green-500' />
      </div>
      <span className={`${activeCategory === 'Fashion' ? 'text-green-700 font-bold' : 'text-gray-700'} text-[9px] ml-2 font-bold`}>Fashion</span>
    </div>

    <div className="flex flex-col items-center cursor-pointer" onClick={() => setActiveCategory('Footwear')}>
      <div className={`flex items-center justify-center w-12 h-12 rounded-full mb-2 ${activeCategory === 'Footwear' ? 'bg-green-100' : 'bg-white'}`}>
        <FaShoePrints className='text-xl text-green-500' />
      </div>
      <span className={`${activeCategory === 'Footwear' ? 'text-green-700 font-bold' : 'text-gray-700'} text-[9px] ml-1 font-bold`}>Footwear</span>
    </div>

    <div className="flex flex-col items-center cursor-pointer" onClick={() => setActiveCategory('Beauty')}>
      <div className={`flex items-center justify-center w-12 h-12 rounded-full mb-2 ${activeCategory === 'Beauty' ? 'bg-green-100' : 'bg-white'}`}>
        <FaFemale className='text-xl text-green-500' />
      </div>
      <span className={`${activeCategory === 'Beauty' ? 'text-green-700 font-bold' : 'text-gray-700'} text-[9px] ml-2 font-bold`}>Beauty</span>
    </div>

    <div className="flex flex-col items-center cursor-pointer" onClick={() => setActiveCategory('Baby & Kids')}>
      <div className={`flex items-center justify-center w-12 h-12 rounded-full mb-2 ${activeCategory === 'Baby & Kids' ? 'bg-green-100' : 'bg-white'}`}>
        <FaBaby className='text-xl text-green-500' />
      </div>
      <span className={`${activeCategory === 'Baby & Kids' ? 'text-green-700 font-bold' : 'text-gray-700'} text-[9px]   font-bold`}>Baby & Kids</span>
    </div>

    <div className="flex flex-col items-center cursor-pointer" onClick={() => setActiveCategory('Health & Fitness')}>
      <div className={`flex items-center justify-center w-12 h-12 rounded-full mb-2 ${activeCategory === 'Health & Fitness' ? 'bg-green-100' : 'bg-white'}`}>
        <FaRunning className='text-xl text-green-500' />
      </div>
      <span className={`${activeCategory === 'Health & Fitness' ? 'text-green-700 font-bold' : 'text-gray-700'} text-[9px] font-bold ml-[-5px]`}>Health & Fitness</span>
    </div>

    <div className="flex flex-col items-center cursor-pointer" onClick={() => setActiveCategory('Home & Kitchen')}>
      <div className={`flex items-center justify-center w-12 h-12 rounded-full mb-2 ${activeCategory === 'Home & Kitchen' ? 'bg-green-100' : 'bg-white'}`}>
        <FaHome className='text-xl text-green-500' />
      </div>
      <span className={`${activeCategory === 'Home & Kitchen' ? 'text-green-700 ' : 'text-gray-700'} text-[9px] font-bold ml-[-5px]`}>Home & Kitchen</span>
    </div>
  </Slider>
</div>


          <Slider {...sliderSettings} className="mx-auto mt-8 ">
            {displayedCoupons.map((coupon) => (
              <CouponCard key={coupon.id} coupon={coupon} categoryPath={getCategoryPath(activeCategory)} />
            ))}
          </Slider>

          {visibleCount < coupons.length && (
            <div className="flex justify-center mt-4 lg:hidden">
              <button
                className="px-4 py-2 text-white bg-green-600 rounded-lg"
                onClick={handleShowMore}
              >
                Show More
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CouponSection;
