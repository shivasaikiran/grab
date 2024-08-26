import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { db } from '@/Firebase/Config';
import { collection, getDocs } from 'firebase/firestore';

const ImageSlider = () => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'imageslider'));
        const fetchedImages = querySnapshot.docs.map(doc => ({
          imageUrl: doc.data().imageUrl,
          link: doc.data().link, // Fetch link as well
        }));
        setImages(fetchedImages);
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };

    fetchImages();
  }, []);

  const settings = {
    dots: false,
    arrows: true,
    infinite: true,
    speed: 1000,
    autoplay: true,
    autoplaySpeed: 2000,
    slidesToShow: 2,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
          speed: 1000,
          autoplay: true,
          autoplaySpeed: 3000,
        },
      },
    ],
  };

  const PrevArrow = ({ onClick }) => (
    <button
      onClick={onClick}
      className="absolute left-0 z-10 p-2 transform -translate-y-1/2 md:top-1/2 bg-white rounded-full shadow-md lg:top-1/2 top-[100px] hover:bg-gray-200 sm:p-1 sm:text-xs"
    >
      <FaChevronLeft className="w-3 h-3 text-gray-700 lg:w-6 lg:h-6" />
    </button>
  );

  const NextArrow = ({ onClick }) => (
    <button
      onClick={onClick}
      className="absolute right-0 p-2 transform -translate-y-1/2 bg-white md:top-1/2 rounded-full shadow-md top-[100px] lg:top-1/2 hover:bg-gray-200 sm:p-1 sm:text-xs"
    >
      <FaChevronRight className="w-3 h-3 text-gray-700 lg:w-6 lg:h-6" />
    </button>
  );

  return (
    <div className="relative w-full mt-16 lg:mt-20 md:mt-20">
      <Slider {...settings} prevArrow={<PrevArrow />} nextArrow={<NextArrow />}>
        {images.map((item, index) => (
          <div key={index} className="p-2">
             <a href={item.link} target="_blank" rel="noopener noreferrer">
              <img
                src={item.imageUrl}
                alt={`Image ${index + 1}`}
                className="rounded-lg shadow-md"
              />
            </a>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default ImageSlider;
