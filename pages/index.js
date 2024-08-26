import { useState, useEffect } from 'react';
import { auth } from '@/Firebase/Config';
import ImageSlider from "@/components/ImageSlider";
import Product from "@/components/Product";
import CouponSection from "@/components/CouponSection";
import Flashdeals from "@/components/Flashdeals";
import PopularStores from "@/components/Popularstores";
import Popularoffers from "@/components/Popularoffers";
import SubscriptionAlert from "@/components/SubscriptionAlert";
import Productmob from "@/components/Productmob";
import Popularoffers1 from "@/components/Popularoffers1";
import Category from '@/components/Catagory';
import Popup from "@/components/Popup";

export default function Home() {
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (!currentUser) {
        setShowPopup(true); // Show the popup if the user is not logged in
      } else {
        setShowPopup(false); // Hide the popup if the user is logged in
      }
    });

    return () => unsubscribe();
  }, []);

  const handleClosePopup = () => {
    setShowPopup(false);
    document.body.style.overflow = 'auto'; // Re-enable scrolling when the popup is closed
    document.body.style.position = ''; 
    document.body.style.width = ''; 
  };

  return (
    <div className="relative">
      {showPopup && <Popup onClose={handleClosePopup} />}
      <ImageSlider />
      <Category />
      <Product />
      <PopularStores />
      <Flashdeals />
      <CouponSection />
      <Popularoffers1 />
      <SubscriptionAlert />
    </div>
  );
}
