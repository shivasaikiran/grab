import React, { useState } from 'react';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

const products = [
  {
    id: 1,
    name: 'Beoplay M5 ',
    image: 'https://cdn.rareblocks.xyz/collection/clarity-ecommerce/images/item-cards/4/product-1.png',
    price: '$99.00',
    isNew: true,
    percent: 15,
  },
  {
    id: 2,
    name: 'Apple Smart Watch ',
    image: 'https://cdn.rareblocks.xyz/collection/clarity-ecommerce/images/item-cards/4/product-2.png',
    price: '$299.00',
    isNew: true,
    percent: 17,
  },
  {
    id: 3,
    name: 'Beylob 90 Speaker',
    image: 'https://cdn.rareblocks.xyz/collection/clarity-ecommerce/images/item-cards/4/product-3.png',
    price: '$199.00',
    isNew: true,
    percent:23,
  },
  {
    id: 4,
    name: 'Beylob 90 Speaker',
    image: 'https://cdn.rareblocks.xyz/collection/clarity-ecommerce/images/item-cards/4/product-3.png',
    price: '$199.00',
    isNew: true,
    percent:45,
  },{
    id: 5,
    name: 'Beylob 90 Speaker',
    image: 'https://cdn.rareblocks.xyz/collection/clarity-ecommerce/images/item-cards/4/product-3.png',
    price: '$199.00',
    isNew: true,
    percent:55
  },
  {
    id: 1,
    name: 'Beoplay M5 ',
    image: 'https://cdn.rareblocks.xyz/collection/clarity-ecommerce/images/item-cards/4/product-1.png',
    price: '$99.00',
    isNew: true,
    percent: 15,
  },
  {
    id: 2,
    name: 'Apple Smart Watch ',
    image: 'https://cdn.rareblocks.xyz/collection/clarity-ecommerce/images/item-cards/4/product-2.png',
    price: '$299.00',
    isNew: true,
    percent: 17,
  },
  {
    id: 3,
    name: 'Beylob 90 Speaker',
    image: 'https://cdn.rareblocks.xyz/collection/clarity-ecommerce/images/item-cards/4/product-3.png',
    price: '$199.00',
    isNew: true,
    percent:23,
  },
  {
    id: 4,
    name: 'Beylob 90 Speaker',
    image: 'https://cdn.rareblocks.xyz/collection/clarity-ecommerce/images/item-cards/4/product-3.png',
    price: '$199.00',
    isNew: true,
    percent:45,
  },{
    id: 5,
    name: 'Beylob 90 Speaker',
    image: 'https://cdn.rareblocks.xyz/collection/clarity-ecommerce/images/item-cards/4/product-3.png',
    price: '$199.00',
    isNew: true,
    percent:55
  },
  {
    id: 1,
    name: 'Beoplay M5 ',
    image: 'https://cdn.rareblocks.xyz/collection/clarity-ecommerce/images/item-cards/4/product-1.png',
    price: '$99.00',
    isNew: true,
    percent: 15,
  },
  {
    id: 2,
    name: 'Apple Smart Watch ',
    image: 'https://cdn.rareblocks.xyz/collection/clarity-ecommerce/images/item-cards/4/product-2.png',
    price: '$299.00',
    isNew: true,
    percent: 17,
  },
  {
    id: 3,
    name: 'Beylob 90 Speaker',
    image: 'https://cdn.rareblocks.xyz/collection/clarity-ecommerce/images/item-cards/4/product-3.png',
    price: '$199.00',
    isNew: true,
    percent:23,
  },
  {
    id: 4,
    name: 'Beylob 90 Speaker',
    image: 'https://cdn.rareblocks.xyz/collection/clarity-ecommerce/images/item-cards/4/product-3.png',
    price: '$199.00',
    isNew: true,
    percent:45,
  },{
    id: 5,
    name: 'Beylob 90 Speaker',
    image: 'https://cdn.rareblocks.xyz/collection/clarity-ecommerce/images/item-cards/4/product-3.png',
    price: '$199.00',
    isNew: true,
    percent:55
  },
  {
    id: 1,
    name: 'Beoplay M5 ',
    image: 'https://cdn.rareblocks.xyz/collection/clarity-ecommerce/images/item-cards/4/product-1.png',
    price: '$99.00',
    isNew: true,
    percent: 15,
  },
  {
    id: 2,
    name: 'Apple Smart Watch ',
    image: 'https://cdn.rareblocks.xyz/collection/clarity-ecommerce/images/item-cards/4/product-2.png',
    price: '$299.00',
    isNew: true,
    percent: 17,
  },
  {
    id: 3,
    name: 'Beylob 90 Speaker',
    image: 'https://cdn.rareblocks.xyz/collection/clarity-ecommerce/images/item-cards/4/product-3.png',
    price: '$199.00',
    isNew: true,
    percent:23,
  },
  {
    id: 4,
    name: 'Beylob 90 Speaker',
    image: 'https://cdn.rareblocks.xyz/collection/clarity-ecommerce/images/item-cards/4/product-3.png',
    price: '$199.00',
    isNew: true,
    percent:45,
  },{
    id: 5,
    name: 'Beylob 90 Speaker',
    image: 'https://cdn.rareblocks.xyz/collection/clarity-ecommerce/images/item-cards/4/product-3.png',
    price: '$199.00',
    isNew: true,
    percent:55
  },
  // Add more products here
];

const Popularoffers= () => {
  const [showMore, setShowMore] = useState(false);
  
  const toggleShowMore = () => {
    setShowMore(!showMore);
  };

  return (
    <section className="py-2 lg:hidden">
         <div className="mb-6 px-6  w-[320px]">
  <h2 className="text-2xl font-bold text-gray-500 ">
    <span className="relative inline-block mr-2 ">
      Popular
      <span className="absolute bottom-[-4px]  left-0 w-full h-[2px] bg-[#26ca43]"></span>
    </span>
  Offers
  </h2>
</div>
      <div className="px-6">
        <div className="grid grid-cols-2 gap-4 mt-10 sm:grid-cols-2 lg:grid-cols-6 lg:mt-6">
          {products.slice(0, showMore ? products.length : 6).map((product) => (
            <div key={product.id} className="px-2 mb-8">
              <div className="relative flex flex-col justify-between h-[200px] border bg-white rounded-sm shadow-md group hover:shadow-green-300 hover:border-green-500">
                <div className="overflow-hidden aspect-w-1">
                  <img
                    className="object-cover w-full h-full transition-all duration-300 group-hover:scale-125"
                    src={product.image}
                    alt={product.name}
                  />
                </div>
                <div className="absolute">
                  <p className="px-3 py-1.5 text-xs font-bold tracking-wide text-white uppercase bg-red-600">
                    {product.percent}%
                  </p>
                </div>
                <div className="flex flex-col items-center p-2 space-y-1">
                  <div className="text-center">
                    <h3 className="text-xs font-bold text-gray-900 line-clamp-2">
                      <a href="#" title={product.name}>
                        {product.name}
                        <span className="absolute inset-0" aria-hidden="true"></span>
                      </a>
                    </h3>
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-bold text-gray-900">{product.price}</p>
                  </div>
                  <button className="py-3 text-xs font-bold text-white bg-green-500 border-0 rounded-md w-[70px] relative inline-flex items-center justify-center p-4 px-6 overflow-hidden transition duration-300 ease-out shadow-md group">
                    <span className="absolute inset-0 flex items-center justify-center w-full h-full text-white duration-300 -translate-x-full bg-green-500 group-hover:translate-x-0 ease">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                      </svg>
                    </span>
                    <span className="absolute flex items-center justify-center w-full h-full font-bold text-white transition-all duration-300 transform group-hover:translate-x-full ease">Buy Now</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {!showMore && (
          <div className="flex justify-center ">
            <button
              className="px-4 py-2 text-sm font-bold text-white bg-green-500 rounded-md shadow-md hover:bg-gray-300"
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

export default Popularoffers;
