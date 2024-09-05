import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { db } from '@/Firebase/Config';
import { collection, query, where, getDocs } from 'firebase/firestore';
import Image from 'next/image';
import { FaArrowRight, FaFacebook, FaInstagram, FaWhatsapp } from 'react-icons/fa';
import add1 from '../../Images/add1.png';

const StoreDetail = () => {
  const router = useRouter();
  const { storeName } = router.query;
  const [store, setStore] = useState(null);
  const [ads, setAds] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [mobileItems, setMobileItems] = useState([]);
  const [showAllCoupons, setShowAllCoupons] = useState(false);
  const [similarStores, setSimilarStores] = useState([]);

  // Fetch similar stores from Firestore
  useEffect(() => {
    const fetchSimilarStores = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "similarStores"));
        const stores = [];
        querySnapshot.forEach((doc) => {
          stores.push({ id: doc.id, ...doc.data() });
        });
        setSimilarStores(stores);
      } catch (error) {
        console.error("Error fetching similar stores: ", error);
      }
    };

    fetchSimilarStores();
  }, []);


  useEffect(() => {
    if (!storeName) return;

    const fetchStore = async () => {
      try {
        const storesRef = collection(db, 'beststores');
        const q = query(storesRef, where('name', '==', storeName));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          setStore(querySnapshot.docs[0].data());
        } else {
          console.log('Store not found');
        }
      } catch (error) {
        console.error('Error fetching store: ', error);
      }
    };

    fetchStore();
  }, [storeName]);

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const adsSnapshot = await getDocs(collection(db, 'beststoresads'));
        const adsList = adsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setAds(adsList);
      } catch (error) {
        console.error('Error fetching ads: ', error);
      }
    };

    fetchAds();
  }, []);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const blogsRef = collection(db, 'beststoresblog');
        const blogsSnapshot = await getDocs(blogsRef);
        const blogsList = blogsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setBlogs(blogsList);
      } catch (error) {
        console.error('Error fetching blogs: ', error);
      }
    };

    fetchBlogs();
  }, []);

  const toggleShowAllCoupons = () => {
    setShowAllCoupons(!showAllCoupons);
  };
  useEffect(() => {
    const fetchMobileItems = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'beststoreitem',));
        const items = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setMobileItems(items);
      } catch (error) {
        console.error('Error fetching mobile items: ', error);
      }
    };

    fetchMobileItems();
  }, []);
  if (!store) return <div>Loading...</div>;

  return (
    <div className='mt-16 lg:mt-[70px]'>
      {/* Banner Section */}
      <div className="relative flex flex-col items-center justify-center w-full h-auto lg:flex-row lg:h-[11rem]">
        <div className="p-1 hidden relative mb-4 bg-green-500 lg:mb-0 lg:mr-2 w-full lg:w-[30%] h-auto lg:h-[130px] lg:flex flex-col space-y-2">
        <span className="relative inline-block mb-2 mr-2">
  <h1 className="text-4xl font-bold text-center text-white ">
    {store.name}
  </h1>
  {/* Underline span adjusted to text width */}
 
</span>

          <div className="flex justify-center">
            <div className="flex flex-row space-x-2 p-2 border-red-500 mt- lg:space-x-6 border bg-white w-[300px] justify-center rounded-md">
              <button className="flex items-center btn-join-now">
                Join Now
                <span className='ml-2'><FaArrowRight /></span>
              </button>
              <FaInstagram size={40} className="icon-instagram hover:scale-125" />
              <FaWhatsapp size={40} className="icon-whatsapp hover:scale-125" />
              <FaFacebook size={40} className="text-blue-500 hover:scale-125" />
            </div>
          </div>
        </div>
        <div className="flex flex-col w-full mt-2   text-center  lg:w-2/3  h-[90px] lg:h-[130px] lg:ml-2 lg:mt-0">
        
        <div key={store.id} className="relative w-full h-full overflow-hidden">
          <img 
            src={store.bannerimgUrl} 
            alt={`Banner ${store
              .id}`}
            className="object-cover w-full h-full"
          />
        </div>
        
    
            </div>
            <div className="flex justify-center w-full px-4 mt-4 mb-4 lg:hidden md:hidden">
  <div className="flex flex-row space-x-4 p-2 justify-between border-red-500 border bg-white w-full max-w-[400px]  rounded-md">
    <button className="flex items-center text-white text-[12px] p-2 bg-red-500 font-bold rounded-3xl btn-join-now">
      Join Now
      <span className="ml-2 text-white"><FaArrowRight /></span>
    </button>
    <FaInstagram size={30} className="text-red-500 transition-transform duration-300 hover:scale-125" />
    <FaWhatsapp size={30} className="text-green-500 transition-transform duration-300 hover:scale-125" />
    <FaFacebook size={30} className="text-blue-500 transition-transform duration-300 hover:scale-125" />
  </div>
</div>
<div className="lg:hidden md:hidden w-40% px-6">
      <div className="mb-4 w-[350px] lg:hidden md:hidden">
          <h2 className="text-2xl font-bold text-black sm:text-3xl">
          <span className="relative inline-block">
              {store.name}
              <span className="absolute bottom-[-4px] left-0 w-full h-[2px] bg-[#26ca43]"></span>
            </span>
          </h2>
        </div>
     
      
     
        
    
    


      </div>

      </div>

      {/* Banners Section */}
      <div className="flex flex-col px-6 md:flex-row">
        {/* Left Section */}
        <div className="hidden w-full p-4 bg-green-100 rounded-md md:w-1/4 sm:block">
          <h3 className="text-lg font-bold text-green-500">Similar Stores</h3>
          <div className="max-h-48">
          <div className="mb-4">
            {similarStores.length === 0 ? (
              <p>No stores available</p>
            ) : (
              similarStores.map((store) => (
                <p key={store.id} className="ml-2">{store.name}</p>
              ))
            )}
          </div>
        </div>
          <div className="flex flex-wrap gap-4">
      {ads.map(ad => (
        <div
          key={ad.id}
          className="w-[300px] h-[250px] bg-white border rounded-md shadow-md group hover:shadow-green-500 hover:border-green-500 mb-4 flex items-center justify-center p-2"
        >
          <img
            src={ad.imageUrl} // Use the URL from your Firebase storage
            alt={`Ad image ${ad.id}`} // Provide a unique alt text for each image
            className="object-cover w-full h-full rounded-md"
            width={300} // Add width to avoid layout shift
            height={250} // Add height to avoid layout shift
          />
        </div>
      ))}
    </div>
    
        </div>

        {/* Right Section */}
        <div className="w-full lg:p-4 md:w-3/4">
        <div className="mb-6 w-[350px] hidden sm:block">
          <h2 className="text-2xl font-bold text-black sm:text-3xl">
          <span className="relative inline-block">
              {store.name}
              <span className="absolute bottom-[-4px] left-0 w-full h-[2px] bg-[#26ca43]"></span>
            </span>
          </h2>
        </div>
          {mobileItems.map((item) => (
            <div key={item.id} className="p-4 mb-4 bg-white border rounded-md shadow">
              <div className="flex items-center">
                <div className="flex flex-col items-center mr-4">
                  {item.imageUrl && (
                    <div className="border-[1px] w-[100px] h-[78px] rounded-md mb-2 py-5 px-2">
                      <img src={item.imageUrl} alt={item.itemname} className="w-[75px] h-[36px] rounded-md" />
                    </div>
                  )}
                  <div className="text-gray-500">{item.itemname}</div>
                </div>
                <div className="flex flex-col justify-between flex-grow">
                  <div className='ml-2'>
                    <div className="text-xl font-bold lg:text-3xl">
                      <span className='mr-2 text-red-500 discount-shake'>{item.itemdiscount}% OFF</span>
                      <span>{item.itemdiscounttext}</span>
                    </div>
                    <p className="text-gray-600">{item.itemdescription}</p>
                  </div> 
                  <div className="flex items-center justify-end">
                    <button className="px-4 py-2 font-bold text-white bg-red-500 rounded-md">
                      Grab Deal
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Show More Button */}
          {showAllCoupons && (
            <>
              {mobileItems.slice(0, showAllCoupons ? mobileItems.length : 10).map((item) => (
                <div key={item.id} className="p-4 mb-4 bg-white border rounded-md shadow">
                  <div className="flex items-center">
                    <div className="flex flex-col items-center mr-4">
                      {item.imageUrl && (
                        <div className="border-[1px] w-[100px] h-[78px] rounded-md mb-2 py-5 px-2">
                          <img src={item.imageUrl} alt={item.itemname} className="w-[75px] h-[36px] rounded-md" />
                        </div>
                      )}
                      <div className="text-gray-500">{item.itemname}</div>
                    </div>
                    <div className="flex flex-col justify-between flex-grow">
                      <div className='ml-2'>
                        <div className="text-xl font-bold lg:text-3xl">
                          <span className='mr-2 text-red-500 discount-shake'>{item.itemdiscount}% OFF</span>
                          <span>{item.itemdiscounttext}</span>
                        </div>
                        <p className="text-gray-600">{item.itemdescription}</p>
                      </div>
                      <div className="flex items-center justify-end">
                        <button className="px-4 py-2 font-bold text-white bg-red-500 rounded-md">
                          Grab Deal
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}
         {mobileItems.length > 20 && (
                <div className="flex justify-center mt-4">
                  <button
                    className="px-4 py-2 text-sm font-semibold text-gray-900 bg-green-500 rounded-md shadow-md hover:bg-gray-300"
                    onClick={toggleShowAllCoupons}
                  >
                    {showAllCoupons ? 'Show Less' : 'Show More'}
                  </button>
                </div>
                )}

                
        </div>
      </div>
      <div class="  bg-white flex px-6">
  
  


  <div className="p-6 mt-4 mb-4 bg-white border rounded-md shadow-md">
  {/* <h2 className="mb-4 text-2xl font-bold text-center text-orange-500">Latest Blog Posts</h2> */}
  {blogs.length === 0 ? (
    <p className="text-center text-gray-500">No blog posts available.</p>
  ) : (
    <div className="space-y-4">
      {blogs.map(blog => (
        <div key={blog.id} className="pb-4 mb-4 border-b">
          {/* <h3 className="mb-2 text-xl font-semibold">Blog Title</h3> */}
          <div className="text-gray-700" dangerouslySetInnerHTML={{ __html: blog.content }} />
        </div>
      ))}
    </div>
  )}
</div>
    </div>
    </div>
  );
};

export default StoreDetail;
