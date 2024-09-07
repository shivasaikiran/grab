import React, { useEffect, useState } from 'react';
import { db } from '@/Firebase/Config';
import { collection, getDocs } from 'firebase/firestore';
import Image from 'next/image';
import add1 from '../../Images/add1.png';
import { FaArrowLeft, FaArrowRight, FaFacebook, FaFilter, FaInstagram, FaWhatsapp } from 'react-icons/fa';
import Link from 'next/link';
import { ImCross } from "react-icons/im";


const Popularstores = () => {
  const [stores, setStores] = useState([]);
  
  const [visibleStores, setVisibleStores] = useState(20);
  const [banner, setBanner] = useState({ title: '', description: '', backgroundImage: '' });
  const [blogs, setBlogs] = useState([]);
  const [ads, setAds] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showTrendingStores, setShowTrendingStores] = useState(true);
 
 

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const adsSnapshot = await getDocs(collection(db, 'beststoresads',));
        const adsList = adsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setAds(adsList);
      } catch (error) {
        console.error('Error fetching ads: ', error);
        // Handle error (e.g., show a toast notification)
      }
    };

    fetchAds();
  }, []);
  useEffect(() => {
  const fetchBlogs = async () => {
    try {
      const blogsRef = collection(db, 'beststoresblog',);
      const blogsSnapshot = await getDocs(blogsRef);
      const blogsList = blogsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setBlogs(blogsList);
    } catch (error) {
      console.error('Error fetching blogs: ', error);
      toast.error('Failed to fetch blogs. Please try again.');
    }
  };
  fetchBlogs();
  }, []);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const storesSnapshot = await getDocs(collection(db, 'beststores'));
        const storesData = storesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setStores(storesData);

        const bannersSnapshot = await getDocs(collection(db, 'beststore banners'));
        const bannersData = bannersSnapshot.docs.map(doc => doc.data());
        if (bannersData.length > 0) {
          setBanner(bannersData[0]);
        }
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };
    fetchStores();
  }, []);

  const handleShowMore = () => {
    setVisibleStores(prevVisibleStores => prevVisibleStores + 10);
  };

  const handleCategoryClick = (category) => {
    if (selectedCategory === category) {
      setSelectedCategory(''); // Deselect the same category
      setShowTrendingStores(true);
       // Show trending stores when no category is selected
    } else {
      setSelectedCategory(category); // Select new category
      setShowTrendingStores(false); // Hide trending stores when a category is selected
    }
  };
  const filteredStores = selectedCategory
    ? stores.filter(store => store.category === selectedCategory)
    : stores;

    const sectionTitle = selectedCategory
  ? `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1).replace(/([A-Z])/g, ' $1')} Stores`
  : 'Popular Stores';


  return (
    <div className='mt-[70px]'>
      <div className="relative flex px-2  items-center justify-center w-full h-auto lg:flex-row lg:h-[11rem]">
      <div className="  flex flex-row  mb-2  text-center mr-1   w-1/3  h-[90px] lg:h-[130px] lg:mx-2  mt-1  lg:mt-2">
        
        
        <div key={banner.id} className="relative w-full h-full overflow-hidden">
          <img 
            src={banner.bannerLogoUrl} 
            alt={`Banner ${banner.id}`}
            className="object-cover w-full h-full"
          />
        </div>
            </div>
      <div className="   relative mb-1 bg-green-500 lg:mb-0 lg:mr-2 w-full w-2/3 h-[90px] lg:h-[130px] flex flex-row  space-x-7  lg:space-y-2">
      <div key={banner.id} className="relative w-full h-full overflow-hidden">
          <img 
            src={banner.bannerImageUrl} 
            alt={`Banner ${banner.id}`}
            className="object-cover w-full h-full"
          />
        </div>
     {/* <span className="relative inline-block mb-1 mr-2 lg:mb-2 lg:top-0 top-7 ">
            <h1 className="font-bold text-white lg:text-center text-start lg:text-4xl">Best stores </h1>
            <span className="absolute hidden sm:block bottom-[-4px] left-24 lg:left-24 lg:w-[200px] w-[160px] h-[2px] bg-white"></span>
          </span>
          <div className="flex justify-center">
            <div className="flex flex-row space-x-2 p-1 relative lg:top-0 top-5 border-red-500 lg:h-12 h-10 lg:space-x-6 border bg-white lg:w-[300px] w-[250px] justify-center rounded-md">
            <button className="flex items-center btn-join-now">
  Join Now
  <span className='ml-2'><FaArrowRight/></span>
</button>


      <FaInstagram size={40} className="icon-instagram hover:scale-125 mobile-size" />
      <FaWhatsapp size={40} className="icon-whatsapp hover:scale-125 mobile-size" />
      <FaFacebook size={40} className="text-blue-500 hover:scale-125 mobile-size" />
    
            </div>
          </div> */}
        </div>
      
      
        

      </div>
      {/* <div className="flex justify-center w-full px-4 mt-4 mb-4 lg:hidden md:hidden">
  <div className="flex flex-row space-x-4 p-2 justify-between border-red-500 border bg-white w-full max-w-[400px]  rounded-md">
    <button className="flex items-center text-white text-[12px] p-2 bg-red-500 font-bold rounded-3xl btn-join-now">
      Join Now
      <span className="ml-2 text-white"><FaArrowRight /></span>
    </button>
    <FaInstagram size={30} className="text-red-500 transition-transform duration-300 hover:scale-125" />
    <FaWhatsapp size={30} className="text-green-500 transition-transform duration-300 hover:scale-125" />
    <FaFacebook size={30} className="text-blue-500 transition-transform duration-300 hover:scale-125" />
  </div>
</div> */}

      <div className="lg:hidden md:hidden w-40% px-4">
      <div className="mb-4 w-[350px] lg:hidden md:hidden">
          <h2 className="text-2xl font-bold text-black sm:text-3xl">
          <span className="relative inline-block">
              Best stores
              <span className="absolute bottom-[-4px] left-0 w-full h-[2px] bg-[#26ca43]"></span>
            </span>
          </h2>
        </div>
     
      
     
        
    
    


      </div>

      <div className="lg:hidden w-40% px-4">
     
       
  <div className="overflow-x-auto ">
  <div className="flex mt-2 mb-2 space-x-4 min-w-max">
    {['Mobile', 'Fashion', 'Footwear', 'Electronics', 'Beauty', 'Baby & Kids', 'Health & Fitness', 'Home & Kitchen'].map((category) => (
      <div
        key={category}
        className={`flex items-center p-3 rounded-md cursor-pointer border text-xs transition-all duration-300 ease-in-out ${
          selectedCategory === category
            ? 'border-green-500 text-green-500 bg-green-50'
            : 'border-gray-300 text-gray-700'
        }`}
        onClick={() => handleCategoryClick(category)}
      >
        {category}
        {selectedCategory === category && (
          <span className="ml-2 text-xs font-bold text-red-500">
           <ImCross/>
          </span>
        )}
      </div>
    ))}
  </div>
</div>
        

</div>

<style jsx>{`
  .w-40% {
    width: 40%;
  }
`}</style>



      <div className="flex flex-col px-4 md:flex-row">
        <div className="hidden w-full p-4 bg-green-100 rounded-md md:w-1/4 sm:block">
        <div className="mb-20">
      <h3 className="mb-4 text-lg font-bold text-green-500">Category wise Stores</h3>
      <div className="max-h-48">
        <div className="mb-4">
          <div className="flex items-center mb-2">
            <input
              type="checkbox"
              checked={selectedCategory === 'Mobile'}
              onClick={() => handleCategoryClick('Mobile')}
              className="cursor-pointer"
            />
            <p className="ml-2 cursor-pointer" onClick={() => handleCategoryClick('Mobile')}>Mobile</p>
          </div>
          <div className="flex items-center mb-2">
            <input
              type="checkbox"
              checked={selectedCategory === 'Fashion'}
              onClick={() => handleCategoryClick('Fashion')}
              className="cursor-pointer"
            />
            <p className="ml-2 cursor-pointer" onClick={() => handleCategoryClick('Fashion')}>Fashion</p>
          </div>
          <div className="flex items-center mb-2">
            <input
              type="checkbox"
              checked={selectedCategory === 'Footwear'}
              onClick={() => handleCategoryClick('Footwear')}
              className="cursor-pointer"
            />
            <p className="ml-2 cursor-pointer" onClick={() => handleCategoryClick('Footwear')}>Footwear</p>
          </div>
          <div className="flex items-center mb-2">
            <input
              type="checkbox"
              checked={selectedCategory === 'Electronics'}
              onClick={() => handleCategoryClick('Electronics')}
              className="cursor-pointer"
            />
            <p className="ml-2 cursor-pointer" onClick={() => handleCategoryClick('Electronics')}>Electronics</p>
          </div>
          <div className="flex items-center mb-2">
            <input
              type="checkbox"
              checked={selectedCategory === 'Beauty'}
              onClick={() => handleCategoryClick('Beauty')}
              className="cursor-pointer"
            />
            <p className="ml-2 cursor-pointer" onClick={() => handleCategoryClick('Beauty')}>Beauty</p>
          </div>
          <div className="flex items-center mb-2">
            <input
              type="checkbox"
              checked={selectedCategory === 'Baby & kids'}
              onClick={() => handleCategoryClick('Baby & kids')}
              className="cursor-pointer"
            />
            <p className="ml-2 cursor-pointer" onClick={() => handleCategoryClick('Baby & Kids')}>Baby & Kids</p>
          </div>
          <div className="flex items-center mb-2">
            <input
              type="checkbox"
              checked={selectedCategory === 'Health & Fitness'}
              onClick={() => handleCategoryClick('Health & Fitness')}
              className="cursor-pointer"
            />
            <p className="ml-2 cursor-pointer" onClick={() => handleCategoryClick('Health & Fitness')}>Health & Fitness</p>
          </div>
          <div className="flex items-center mb-2">
            <input
              type="checkbox"
              checked={selectedCategory === 'Home & kitchen'}
              onClick={() => handleCategoryClick('Home & kitchen')}
              className="cursor-pointer"
            />
            <p className="ml-2 cursor-pointer" onClick={() => handleCategoryClick('Home & Kitchen')}>Home & Kitchen</p>
          </div>
        </div>
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
        <div className="w-full md:w-3/4">
        {showTrendingStores && (
        <div className="w-full px-2">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-black sm:text-3xl">
              <span className="relative inline-block mr-2">
                Trending Stores
                <span className="absolute bottom-[-4px] left-0 lg:w-[220px] w-[180px] h-[2px] bg-[#26ca43]"></span>
              </span>
            </h2>
          </div>
          <div className="grid grid-cols-3 gap-4 mb-12 sm:grid-cols-5">
            {stores.slice(0, 5).map((store, index) => (
              <div key={index} className="p-1 lg:p-2">
                <div className="p-2 transition duration-300 transform bg-white border rounded-lg shadow-md lg:p-4 hover:-translate-y-1">
                  <Link href={`/best-stores-online/${store.name}`}>
                    <div className="relative text-center cursor-pointer">
                      <img src={store.imageUrl} className="w-20 h-10 mx-auto" alt="store logo" />
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
          </div>
        </div>
      )}
          <div className="w-full px-2">
            <div className="w-[350px] mb-8">
              
<div className="mb-8">
  <h2 className="text-2xl font-bold text-black sm:text-3xl">
    <span className="relative inline-block mr-2">
      {sectionTitle}
      <span className="absolute bottom-[-4px] left-0 w-full h-[2px] bg-[#26ca43]"></span>
    </span>
  </h2>
</div>
            </div>
            <div className="grid grid-cols-3 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {filteredStores.slice(0, visibleStores).map(store => (
                <div  className="p-1 lg:p-2">
                  <div className="p-2 transition duration-300 transform bg-white border rounded-lg shadow-md lg:p-4 hover:-translate-y-1">
                    <Link href={`/best-stores-online/${store.name}`}>
                      <div className="relative text-center cursor-pointer">
                        <img src={store.imageUrl} className="w-20 h-10 mx-auto" alt="store logo" />
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
            </div>
          </div>
          {visibleStores < stores.length && (
            <div className="flex justify-center mt-4">
              <button onClick={handleShowMore} className="px-4 py-2 text-white bg-green-500 rounded-lg">
                Show More
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

export default Popularstores;
