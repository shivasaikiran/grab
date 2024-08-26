import React, { useState, useEffect } from 'react';
import { db } from '@/Firebase/Config';
import { collection, getDocs } from 'firebase/firestore';



const Privacypolicy = () => {
    const [blogs, setBlogs] = useState([]);
    useEffect(() => {
        fetchBlogs();
      }, []);
    
    
      const fetchBlogs = async () => {
        try {
          const blogsRef = collection(db, 'privacypolicy');
          const blogsSnapshot = await getDocs(blogsRef);
          const blogsList = blogsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setBlogs(blogsList);
        } catch (error) {
          console.error('Error fetching blogs: ', error);
          toast.error('Failed to fetch blogs. Please try again.');
        }
      };
  return (
    <div class="  bg-white flex px-6 mt-[100px]">
  
  


      <div className="p-6 mb-4 bg-white border rounded-md shadow-md">
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
  )
}

export default Privacypolicy
