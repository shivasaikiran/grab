import React, { useEffect, useState } from 'react';
import { db } from '@/Firebase/Config';
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import Link from 'next/link';
import { FaArrowRight, FaFacebook, FaInstagram, FaRegCalendarAlt, FaSearch, FaWhatsapp } from 'react-icons/fa';
import BlogLayout from '@/components/BlogLayout';
import { useRouter } from 'next/router';
import add1 from '../../Images/add1.png';
import add2 from '../../Images/add2.png';
import add3 from '../../Images/add3.png';
import Image from 'next/image';

const Blog = () => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [latestPosts, setLatestPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [ads, setAds] = useState([]);

  const router = useRouter();
  const { category, id } = router.query;

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const adsCollection = collection(db, 'blogads'); // Reference to 'blogads' collection
        const adsSnapshot = await getDocs(adsCollection);
        const adsList = adsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setAds(adsList);
      } catch (error) {
        console.error('Error fetching ads:', error);
      }
    };

    fetchAds();
  }, []);

  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        const blogCollection = collection(db, 'blogs');
        let blogQuery;

        if (category) {
          blogQuery = query(blogCollection, where('category', '==', category));
        } else {
          blogQuery = blogCollection;
        }

        const blogSnapshot = await getDocs(blogQuery);
        const blogs = blogSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setBlogPosts(blogs);
      } catch (error) {
        console.error("Error fetching blog posts: ", error);
      }
    };

    const fetchLatestPosts = async () => {
      try {
        const blogCollection = collection(db, 'blogs');
        const latestQuery = query(blogCollection, orderBy('date', 'desc'), limit(5));
        const latestSnapshot = await getDocs(latestQuery);
        const latestBlogs = latestSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setLatestPosts(latestBlogs);
      } catch (error) {
        console.error("Error fetching latest posts: ", error);
      }
    };

    fetchBlogPosts();
    fetchLatestPosts();
  }, [category, id]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  // Filter blog posts based on the search term
  const filteredBlogPosts = blogPosts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filter latest posts based on the search term
  const filteredLatestPosts = latestPosts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const truncateContent = (content, wordLimit) => {
    const words = content.split(" ");
    return words.length > wordLimit ? words.slice(0, wordLimit).join(" ") + " ..." : content;
  };

  return (
    <div className="container p-4 mx-auto mt-20">
      <div className="flex flex-wrap">
        <div className="w-full px-4 md:w-9/12">
          <h1 className="mb-8 text-2xl font-bold">Latest Posts</h1>
          {filteredBlogPosts.length > 0 ? (
            filteredBlogPosts.map((post) => (
              <div key={post.id} className="mb-6 overflow-hidden border rounded-md shadow-md group hover:shadow-green-500 hover:border-green-500">
                <Link href={`/blog-online/${post.id}`}>
                <div className="flex">
  <img src={post.imageUrl} alt={post.title} className="w-40 h-40 p-6 lg:p-4 lg:w-64 lg:h-40" />
  <div className="w-2/3 p-4">
    <h3 className="hidden mb-2 text-xl font-semibold sm:block">{post.title}</h3>
    <h3 className="mb-2 text-xl font-semibold lg:hidden truncate-content"> {truncateContent(post.title,3
       
    )}</h3>
    <p className="hidden mb-4 text-gray-700 sm:block">
      <div dangerouslySetInnerHTML={{ __html: truncateContent(post.content, 12) }} />
    </p>
    <p className="mb-4 text-gray-700 lg:hidden">
      {truncateContent(post.content,5)}
    </p>
    <div className="flex items-center mb-2 text-sm text-gray-600">
      <FaRegCalendarAlt className="mr-2" />
      <span>{new Date(post.date.seconds * 1000).toLocaleDateString()}</span>
    </div>
    <Link href={`/blog-online/${post.id}`} className="text-blue-500 hover:underline">
      Read More &rarr;
    </Link>
  </div>
</div>
                </Link>
              </div>
            ))
          ) : (
            <p>No posts found for this category.</p>
          )}
        </div>

        <div className="hidden w-full p-2 md:w-3/12 sm:block">
          <h2 className="mb-4 text-2xl font-bold">Search</h2>
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Search blogs...."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full p-2 pl-10 border border-green-500 rounded"
            />
            <FaSearch className="absolute text-gray-500 transform -translate-y-1/2 top-1/2 left-3" />
          </div>
          <h1 className="mb-8 text-2xl font-bold">Latest Posts</h1>
          <div className="rounded-md shadow-md rotate-vertical">
            <ul className="p-6">
              {filteredLatestPosts.map((post) => (
                <li key={post.id} className="flex items-center mb-4 border-b border-green-400">
                  <Link href={`/blog/${post.id}`} className="flex items-center w-full mb-4">
                    <img src={post.imageUrl} alt={post.title} className="object-cover w-16 h-16 mr-4 rounded-full" />
                    <span className="text-blue-400 hover:underline">{post.title}</span>
                  </Link>
                </li>
              ))}
              
            </ul>
           <div className='mt-[420px]' >
           
          <div className="flex justify-center">
            <div className="flex flex-row space-x-2 p-2 border-red-500  lg:space-x-2 border bg-white w-[270px] justify-center rounded-md">
            <button className="flex items-center btn-join-now">
  Join Now
  <span className='ml-2 text-white'><FaArrowRight /></span>
</button>

              <FaInstagram size={40} className="icon-instagram hover:scale-125" />
              <FaWhatsapp size={40} className="icon-whatsapp hover:scale-125" />
              <FaFacebook size={40} className="text-blue-500 hover:scale-125" />
            </div>
          </div>
      
           </div>
          </div>

          <div className="flex flex-wrap gap-4 mt-10">
      {ads.map((ad) => (
        <div
          key={ad.id}
          className="w-[300px] h-[250px] bg-white border rounded-md shadow-md group hover:shadow-green-500 hover:border-green-500 mb-4 flex items-center justify-center p-2"
        >
          <img
            src={ad.imageUrl} // Replace with the actual field name for the image URL
            alt={`Advertisement ${ad.id}`}
            className="object-cover w-full h-full rounded-md"
            layout="fill" // Ensure the image fills the container
            objectFit="cover" // Ensure the image covers the container
          />
        </div>
      ))}
    </div>
        </div>
      </div>
    </div>
  );
};

Blog.getLayout = function getLayout(page) {
  return <BlogLayout>{page}</BlogLayout>;
};

export default Blog;
