import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { db } from '@/Firebase/Config';
import { doc, getDoc, collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { FaArrowRight, FaFacebook, FaInstagram, FaSearch, FaWhatsapp } from 'react-icons/fa';
import Link from 'next/link';
import add1 from '../../Images/add1.png';
import add2 from '../../Images/add2.png';
import add3 from '../../Images/add3.png';
import Image from 'next/image';
import BlogLayout from '@/components/BlogLayout';

const BlogPost = () => {
  const router = useRouter();
  const { id } = router.query;
  const [post, setPost] = useState(null);
  const [latestPosts, setLatestPosts] = useState([]);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [ads, setAds] = useState([]);

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
    const fetchPost = async () => {
      if (id) {
        const docRef = doc(db, 'blogs', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const postData = docSnap.data();
          setPost(postData);
          fetchRelatedPosts(postData.category);
        }
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

    const fetchRelatedPosts = async (category) => {
      if (category) {
        try {
          const blogCollection = collection(db, 'blogs');
          const relatedQuery = query(
            blogCollection,
            where('category', '==', category),
          
            limit(5)
          );
          const relatedSnapshot = await getDocs(relatedQuery);
          const relatedBlogs = relatedSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setRelatedPosts(relatedBlogs);
        } catch (error) {
          console.error("Error fetching related posts: ", error);
        }
      }
    };

    fetchPost();
    fetchLatestPosts();
  }, [id]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  // Filter latest posts based on the search term
  const filteredLatestPosts = latestPosts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!post) return <div>Loading...</div>;

  const truncateTitle = (title) => {
    return title.split(' ').slice(0, 2).join(' ');
  };

  return (
    <div className="flex flex-col lg:flex-row mt-16 lg:mt-[82px]">
      {/* Left Column */}
      <div className="flex-1 px-4 lg:w-9/12">
        {/* Banner Section */}
        <div className="w-full h-[9rem] bg-green-500 text-white flex items-center justify-center rounded-lg">
          <h1 className="text-4xl font-bold">{post.title}</h1>
        </div>
        <div className="flex justify-center mt-4 lg:hidden">
  <div className="flex flex-row space-x-4 p-2 justify-between border-red-500 border bg-white w-full max-w-[400px] justify-center rounded-md">
    <button className="flex items-center text-white text-[12px] p-2 bg-red-500 font-bold rounded-3xl">
      Join Now
      <span className="ml-2 text-white"><FaArrowRight /></span>
    </button>
    <FaInstagram size={30} className="text-red-500 transition-transform duration-300 hover:scale-125" />
    <FaWhatsapp size={30} className="text-green-500 transition-transform duration-300 hover:scale-125" />
    <FaFacebook size={30} className="text-blue-500 transition-transform duration-300 hover:scale-125" />
  </div>
</div>

        {/* Post Detail Content */}
        <div className="p-4 mt-6 border rounded-md shadow-md lg:p-10">
          <div className="w-full text-justify">
            <div dangerouslySetInnerHTML={{ __html: post.detailPageContent }} />
          </div>
        </div>

        {/* Related Posts */}
        <h1 className="mt-8 mb-8 text-2xl font-bold">Related Posts</h1>
        <div className="flex flex-wrap">
          {relatedPosts.map((post) => (
            <div key={post.id} className="w-full p-4 sm:w-1/2 md:w-1/3 lg:w-1/4">
              <div className="transition duration-300 border rounded-md shadow-md group hover:shadow-green-500 hover:border-green-500">
                <Link href={`/blog/${post.id}`}>
                  <div>
                    <div className="relative h-40">
                      <img
                        src={post.imageUrl}
                        alt={post.title}
                        className="w-full p-4 border rounded-t-md h-36"
                      />
                    </div>
                    <div className="p-4 text-center">
                      <h3 className="text-lg font-semibold text-black truncate">{truncateTitle(post.title)}</h3>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Column */}
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
  );
};

BlogPost.getLayout = function getLayout(page) {
  return <BlogLayout>{page}</BlogLayout>;
};

export default BlogPost;
