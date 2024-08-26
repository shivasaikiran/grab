// components/CouponCard.js
import Link from 'next/link';
import React from 'react';

const CouponCard = ({ coupon, categoryPath }) => {
  return (
    <>
     <Link href={categoryPath}>
  <div className="p-4 border border-[#26ca43] rounded-lg shadow-lg bg-white w-72 h-52 mx-auto mb-5 ">
      <div className="flex mb-4 ">
        <div className="flex items-center justify-start p-1 rounded">
          <img src={coupon.imageUrl} className='w-20 h-14'/>
        </div>
        {/* Replace with actual logo URL */}
      </div>
      <div className="flex items-center mb-2 text-sm">
  <span className='text-gray-600'>UP TO</span>
  <div className="ml-2 text-2xl font-bold text-red-500 discount-shake">{coupon.discount}% OFF</div>
</div>

      <div className="mb-1 overflow-hidden text-[14px] text-gray-500 " style={{ maxHeight: '2.5rem' }}>{coupon.description}</div>
      {/* <a className='text-[14px] font-semibold text-blue-500 hover:underline' href={coupon.link}>See all {coupon.category} Offers</a> */}
    </div></Link></>
  );
};

export default CouponCard;
