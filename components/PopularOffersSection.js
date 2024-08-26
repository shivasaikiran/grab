import React from 'react';
import Slider from 'react-slick';

import offerimg from '../Images/offers.png';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa6';
import Image from 'next/image';

// Sample offers data
const offers = [
  {
    id: 1,
    title: 'BEST BUYS',
    description: '.COM Domain @ Rs 499 Only',
    image: offerimg,
  },
  {
    id: 2,
    title: 'BEST BUYS',
    description: '.COM Domain @ Rs 499 Only',
    image: offerimg,
  },
  {
    id: 3,
    title: 'BEST BUYS',
    description: '.COM Domain @ Rs 499 Only',
    image: offerimg,
  },
  {
    id: 4,
    title: 'BEST BUYS',
    description: '.COM Domain @ Rs 499 Only',
    image: offerimg,
  },
  {
    id: 5,
    title: 'BEST BUYS',
    description: '.COM Domain @ Rs 499 Only',
    image: offerimg,
  },
  {
    id: 6,
    title: 'BEST BUYS',
    description: '.COM Domain @ Rs 499 Only',
    image: offerimg,
  },
  {
    id: 7,
    title: 'BEST BUYS',
    description: '.COM Domain @ Rs 499 Only',
    image: offerimg,
  },
];

// Custom Next Arrow component
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

// PopularOffersSection component
const PopularOffersSection = () => {
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
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
          
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 1,
        }
      }
    ]
  };

  return (
    <section className="py-12 bg-white sm:py-16 lg:py-20">
      <div className="px-8">
        <div className="mb-6 bg-gray-100 w-[320px]">
          <h2 className="text-2xl font-bold text-gray-500 sm:text-3xl">
            <span className="relative inline-block mr-2">
              Popular
              <span className="absolute bottom-[-4px] left-0 w-full h-[2px] bg-[#26ca43]"></span>
            </span>
            Offers
          </h2>
        </div>
        <Slider {...settings} className="mt-10 lg:mt-16">
          {offers.map((offer) => (
            <div key={offer.id} className="px-2 mb-3">
              <div className="relative flex flex-col justify-between lg:h-52 h-[200px]  rounded-lg group shadow-md border hover:shadow-green-300 hover:shadow-md hover:border-green-500">
                <div className="overflow-hidden aspect-w-1 aspect-h-1">
                  <Image
                    className="object-cover w-full h-full "
                    src={offer.image}
                    alt={offer.title}
                  />
                </div>
                {/* <div className="absolute ">
                  <p className="sm:px-3 sm:py-1.5 px-[14px] py-[7px] text-[10px] sm:text-xs font-bold tracking-wide text-white uppercase bg-red-600">
                    50%
                  </p>
                </div> */}
                <div className="flex flex-col items-center p-2 space-y-2">
                  <div className="text-center">
                    <h3 className="text-xs font-bold text-gray-900 sm:text-sm md:text-base line-clamp-2">
                      <a href="#" title={offer.title}>
                        {offer.title}
                        <span className="absolute inset-0" aria-hidden="true"></span>
                      </a>
                    </h3>
                    <p className="text-xs text-gray-700">{offer.description}</p>
                  </div>
                  {/* <div className="">
                    <button className="flex-1 py-2 text-xs font-bold text-white bg-green-500 border-0 rounded-md hover:bg-red-700 w-[70px]">
                      Buy Now
                    </button>
                  </div> */}
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
};

export default PopularOffersSection;
