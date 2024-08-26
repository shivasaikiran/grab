import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Slider from 'react-slick';
import {
  FaMobileScreenButton,
  FaArrowLeft,
  FaArrowRight
} from 'react-icons/fa6';
import { AiOutlineLaptop } from "react-icons/ai";
import { PiFootprintsFill } from 'react-icons/pi';
import { IoFitness } from "react-icons/io5";
import { AiFillProduct } from 'react-icons/ai';
import { RiDiscountPercentFill } from 'react-icons/ri';
import { GiClothes } from "react-icons/gi";
import { FaKitchenSet } from "react-icons/fa6";
import { FaBabyCarriage } from "react-icons/fa";
import { db } from '@/Firebase/Config';
import { collection, getDocs } from 'firebase/firestore';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const initialCategories = [
  {
    index: 0,
    image: <RiDiscountPercentFill className='icon' />,
    path: '/today-deals-online',
  },
  {
    index: 1,
    image: <FaMobileScreenButton className='icon' />,
    path: '/mobile-deals-online',
  },
  {
    index: 2,
    image: <AiOutlineLaptop className='icon' />,
    path: '/electronics-deals-online',
  },
  {
    index: 3,
    image: <GiClothes className='icon' />,
    path: '/fashion-deals-online'
  },
  {
    index: 4,
    image: <PiFootprintsFill className='icon' />,
    path: '/footwear-deals-online',
  },
  {
    index: 5,
    image: <AiFillProduct className='icon' />,
    path: '/beauty-deals-online',
  },
  {
    index: 6,
    image: <FaBabyCarriage className='icon' />,
    path: '/baby-kids-deals-online',
  },
  {
    index: 7,
    image: <IoFitness className='icon' />,
    path: '/health-fitness-deals-online',
  },
  {
    index: 8,
    image: <FaKitchenSet className='icon' />,
    path: '/home-kitchen-deals-online',
  },
];

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
        right: 0,
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
        left: 0,
        background: 'white',
        borderRadius: '4px',
        padding: '5px',
        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.15)',
        height: '70px',
        width: '30px',
        zIndex: '1'
      }}
      onClick={onClick}
    >
      <FaArrowLeft />
    </div>
  );
};

const Category = () => {
  const [categories, setCategories] = useState(initialCategories);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const storesSnapshot = await getDocs(collection(db, 'category'));
        const storesData = storesSnapshot.docs.map(doc => doc.data());

        const updatedCategories = initialCategories.map((category) => {
          const matchedStore = storesData.find(store => store.index === category.index);
          return {
            ...category,
            name: matchedStore ? matchedStore.name : '..Loading',
            offers: matchedStore ? matchedStore.offers : '..Loading',
          };
        });

        setCategories(updatedCategories);
      } catch (error) {
        console.error('Error fetching stores: ', error);
      }
    };

    fetchStores();
  }, []);

  const settings = {
    dots: false,
    infinite: true,
    speed: 300,
    slidesToShow: 8,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    swipeToSlide: true,
    touchMove: true,
    cssEase: 'ease-in-out',
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 8,
          slidesToScroll: 1,
          rtl: false
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 1,
          infinite: true,
          arrows: false,
          swipeToSlide: true,
          touchMove: true,
          rtl: false
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
          infinite: true,
          arrows: false,
          swipeToSlide: true,
          touchMove: true,
          rtl: false
        }
      }
    ]
  };

  return (
    <div className="bg-green-100 lg:bg-white" style={{ willChange: 'transform' }}>
    <Slider {...settings} className="py-2 pr-4 overflow-hidden lg:py-0 lg:pr-0 ">
      {categories.map((item, index) => (
        <div key={index} className="flex justify-center lg:mt-4 md:mt-0">
          <Link href={item.path} className="z-0 flex flex-col items-center w-28 lg:w-40">
          <div className="relative w-14 h-14 lg:w-20 lg:h-20 ">
  
  
          <div className="bg-green-500 p-3 lgf:p-5 md:p-3 text-[25px] lg:text-[35px] md:text-[25px] rounded-full flex items-center  text-white justify-center w-[60px] h-[60px] lg:w-[80px] lg:h-[80px] md:h-[60px] md:w-[60px]">
  <div className="animate-spin-slow">
    {item.image}
  </div>
</div>


    {/* <div className="flex items-center justify-center p-3 rounded-full flip-back md:p-5">
      <div className="text-lg text-center flip-text">
        <span className="text-lg font-bold text-white">{item.offers}</span>
        <span className="font-bold discount-shake"> offers</span>
      </div>
    </div> */}

</div>

            <p className="mt-3 text-[10px] font-bold text-center md:text-[10px] lg:text-[16px]">
              {item.name}
            </p>
          </Link>
        </div>
      ))}
    </Slider>
  </div>
  
  
  );
};

export default Category;
