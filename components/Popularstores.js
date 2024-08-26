import React, { useState, useEffect, useRef } from 'react';
import { db } from '@/Firebase/Config';
import { collection, getDocs } from 'firebase/firestore';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa6';
import Slider from 'react-slick';
import amazon from '../Images/amazon.png';
import Image from 'next/image';
import Link from 'next/link';

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

const PopularStores = () => {
  const [stores, setStores] = useState([]);
  const [featuredstore, setFeaturedstore] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const sliderRef = useRef(null);

  // Function to fetch featured store data from Firestore
  const fetchFeaturedStore = async () => {
    try {
      const featuredSnapshot = await getDocs(collection(db, 'featuredstore'));
      const featuredList = featuredSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setFeaturedstore(featuredList);
    } catch (error) {
      console.error('Error fetching featured store: ', error);
      toast.error('Failed to fetch featured store. Please try again.');
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchFeaturedStore();
  }, []);

  // Auto-scroll slider
  useEffect(() => {
    if (featuredstore.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % featuredstore.length);
      }, 3000); // Change slide every 3 seconds

      return () => clearInterval(interval);
    }
  }, [featuredstore]);

  

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'beststores'));
        const storesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setStores(storesData);
      } catch (error) {
        console.error('Error fetching stores: ', error);
      }
    };
    const fetchfeaturedstore = async () => {
      try {
        const featuredSnapshot = await getDocs(collection(db, 'featuredstore'));
        const featuredList = featuredSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setFeaturedstore(featuredList);
      } catch (error) {
        console.error('Error fetching featured store: ', error);
        toast.error('Failed to fetch features store. Please try again.');
      }
    };
 fetchfeaturedstore();
    fetchStores();
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    slidesToShow: 1,
    slidesToScroll: 1,
    rows: 4,
    slidesPerRow: 4,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          rows: 4,
          slidesPerRow: 4,
        }
      },
      {
        breakpoint: 600,
        settings: {
          dots: false,
          slidesToShow: 1,
          slidesToScroll: 1,
          rows: 2,
          slidesPerRow: 2,
        }
      },
      {
        breakpoint: 480,
        settings: {
          dots: false,
          slidesToShow: 1,
          slidesToScroll: 1,
          rows: 3,
          slidesPerRow: 3,
        }
      }
    ]
  };

  return (
    <div id='popularstores'>
      <div className="mb-6 px-8 w-[320px]">
        <h2 className="text-2xl font-bold text-black sm:text-3xl">
          <span className="relative inline-block mr-2">
            Best
            <span className="absolute bottom-[-4px] left-0 lg:w-[160px] w-[130px] h-[2px] bg-[#26ca43]"></span>
          </span>
          Stores
        </h2>
      </div>
      <div className="bg-green-100 lg:py-6">
        <div className="px-8 mx-auto lg:container">
          <div className="flex flex-wrap mb-2 ">
          <div className="w-full h-52 lg:p-2 p-4 bg-white rounded-md shadow-md lg:w-1/4 md:w-1/4 md:h-[280px] lg:h-[380px]">
  <h2 className="text-base font-bold text-center text-red-500 lg:text-xl lg:mt-6 sm:text-xl lg:mb-10 md:mb-8">
    Featured Store Of The Month
  </h2>
  <div className="relative w-full h-32 mt-4 overflow-hidden border rounded-md shadow-md lg:mt-8 lg:h-60 md:h-40 md:mt-0">
      <div
        className="absolute flex w-full h-full transition-transform duration-1000"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        ref={sliderRef}
      >
        {featuredstore.map((store, index) => (
          <div key={index} className="flex-shrink-0 w-full h-full px-20 py-2 lg:px-4 md:px-2">
            <img
              src={store.imageUrl} // Ensure this is the correct path
              alt={`Featured Store ${index + 1}`}
              className="object-cover w-32 rounded-md lg:p-0 lg:w-full lg:h-full md:w-full md:h-full"
            />
          </div>
        ))}
      </div>
    </div>

</div>

            <div className="w-full py-2 lg:w-3/4 md:w-3/4">
              <div className="lg:ml-10 md:ml-10">
                <Slider {...settings}>
                {stores.map((store, index) => (
                  <div key={index} className="p-1 lg:p-2">
                    <div className="p-2 transition duration-300 transform bg-white border rounded-lg shadow-md lg:p-4 hover:-translate-y-1">
                      <Link href={`/best-stores-online/${store.name}`}>
                        <div className="relative text-center cursor-pointer">
                          <img src={store.imageUrl} className="w-20 h-10 mx-auto" alt="store logo"/>
                          <div className="absolute inset-0 flex items-center justify-center transition-opacity duration-300 bg-transparent opacity-0 hover:opacity-100">
                            <div className="hidden py-2 bg-green-100 rounded-lg shadow-lg sm:block">
                              {store.discount} Coupons | {store.title} Offers Available
                            </div>
                          </div>
                        </div>
                      </Link>
                    </div>
                  </div>
                ))}
                </Slider>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PopularStores;
