import React, { useEffect, useState } from 'react';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { db } from '@/Firebase/Config'; // Adjust the import path as needed
import { collection, getDocs } from 'firebase/firestore';
import Image from 'next/image';
import discount from '../Images/discount.png'



const Product2 = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const querySnapshot = await getDocs(collection(db, 'todaydeals'));
      const productsArray = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProducts(productsArray);
    };

    fetchProducts();
  }, []);
  const [showMore, setShowMore] = useState(false);
  
  const toggleShowMore = () => {
    setShowMore(!showMore);
  };

  return (
    <section className="mt-2 lg:hidden">
         {/* <div className=" px-6 mb-6  w-[320px]">
  <h2 className="text-2xl font-bold text-gray-500 s m:text-3xl">
    <span className="relative inline-block mr-2 ">
      Today's
      <span className="absolute bottom-[-4px]  left-0 w-full h-[2px] bg-[#26ca43]"></span>
    </span>
    Deal's
  </h2>
</div> */}
      <div className="px-1">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-6 ">
          {products.slice(0, showMore ? products.length : 20).map((product) => (
            <div key={product.id} className="px-2 mb-3">
            <div className="relative flex flex-col justify-between lg:h-64 h-[200px] border bg-white rounded-sm shadow-md group hover:shadow-green-300 hover:border-green-500">
              <div className="overflow-hidden aspect-w-1 h-[200px]">
              <img
                  className="object-cover w-full h-full transition-all duration-300 group-hover:scale-125"
                  src={product.imageUrl}
                  alt={product.title}
                // Add a default height
                />
              </div>
              <div className="absolute ">
                 <Image src={discount} className='w-8'/>
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
                  <div className="flex items-center ">
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
        {!showMore && (
          <div className="flex justify-center ">
            <button
              className="px-4 py-2 text-sm font-semibold text-white bg-green-500 rounded-md shadow-md hover:bg-gray-300"
              onClick={toggleShowMore}
            >
              Show More
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Product2;
