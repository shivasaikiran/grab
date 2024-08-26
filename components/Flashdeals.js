import React, { useState, useEffect } from 'react';
import { db } from '@/Firebase/Config';
import { collection, getDocs } from 'firebase/firestore';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import discount from '../Images/discount.png';
import Image from 'next/image';

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

const Flashdeals = () => {
  const [deals, setDeals] = useState([]);

  useEffect(() => {
    const fetchDeals = async () => {
      const dealsCollectionRef = collection(db, 'Flashsales');
      const dealsSnapshot = await getDocs(dealsCollectionRef);
      const dealsList = dealsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setDeals(dealsList);
    };

    fetchDeals();
  }, []);

  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          rows: 3,
          slidesPerRow: 1,
        }
      }
    ]
  };

  return (
    <section className="mt-4 bg-white" id='deals'>
      <div className="px-8">
        <div className="mb-8 w-[350px]">
          <h2 className="text-2xl font-bold text-black sm:text-3xl">
            <span className="relative inline-block mr-2">
              Flash Sales
              <span className="absolute bottom-[-4px] left-0 lg:w-[155px] w-[125px] h-[2px] bg-[#26ca43]"></span>
            </span>
          </h2>
        </div>
        <Slider {...settings} className="mt-2">
          {deals.map((deal) => (
             <a href={deal.link} target="_blank" rel="noopener noreferrer">
            <div key={deal.id} className="px-2 mb-4 lg:mb-8">
              <div className="relative flex flex-col  rounded-lg lg:h-56 h-[180px] shadow-md hover:shadow-green-500 hover:border-green-500 border">
                <div className="overflow-hidden h-[200px]">
                  <img
                    className="object-cover w-full transition-all duration-300 rounded-md"
                    src={deal.imageUrl}
                    alt={deal.name}
                    width={500}
                    height={200}
                  />
                </div>
                <div className="absolute top-0 left rounded-bl-">
                  <div className="px-2 py-1 text-xs font-bold text-white bg-red-500 rounded-md lg:text-base">
                    {deal.timer}
                  </div>
                </div>
                <div className="flex flex-col justify-between flex-grow px-4">
                  <div className="flex flex-row items-center justify-between py-2">
                    <img
                      className="lg:w-[120px] w-20 transition-all duration-300 lg:h-[32px] h-6 rounded-md"
                      src={deal.logo}
                      alt="Logo"
                    />
                  <a href={deal.link} target="_blank" rel="noopener noreferrer">
  <button className="px-2 py-1 text-[10px] lg:text-base font-bold text-white bg-green-500 rounded lg:px-4 lg:py-2 md:text-[10px]">
    GRAB DEAL
  </button>
</a>
                  </div>
                </div>
              </div>
            </div>
            </a>
          ))}
        
        </Slider>
      </div>
    </section>
  );
};

export default Flashdeals;
