
import React, { useState, useEffect } from 'react';
import { db } from '@/Firebase/Config';
import { addDoc, collection, getDocs, doc, updateDoc, deleteDoc,  } from 'firebase/firestore';

import { toast } from 'react-toastify';
import { Dialog, Transition } from '@headlessui/react';
import { XIcon } from '@heroicons/react/solid';
import dynamic from 'next/dynamic';


// Dynamically import JoditEditor only on the client side
const JoditEditor = dynamic(() => import('jodit-react'), {
  ssr: false, // Disable server-side rendering for this component
});

// import dynamic from 'next/dynamic';

const TermsandconditionsForm = () => {
  
  // Banner states
  
 
  
  

  const [blogContent, setBlogContent] = useState('');
  const [blogs, setBlogs] = useState([]);
  const [blogEditId, setBlogEditId] = useState(null);
  const [blogIsOpen, setBlogIsOpen] = useState(false);

  // const JoditEditor = dynamic(() => import('jodit-react'), { ssr: false });


  useEffect(() => {
    
    fetchBlogs();
  }, );

  
  const fetchBlogs = async () => {
    try {
      const blogsRef = collection(db, 'termsandconditions', );
      const blogsSnapshot = await getDocs(blogsRef);
      const blogsList = blogsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setBlogs(blogsList);
    } catch (error) {
      console.error('Error fetching blogs: ', error);
      toast.error('Failed to fetch blogs. Please try again.');
    }
  };

  const handleBlogSubmit = async (e) => {
    e.preventDefault();
    try {
      if (blogEditId) {
        const blogDocRef = doc(db, 'termsandconditions', blogEditId);
        await updateDoc(blogDocRef, { content: blogContent });
        toast.success('Blog updated successfully!');
      } else {
        const blogsCollectionRef = collection(db, 'termsandconditions');
        await addDoc(blogsCollectionRef, { content: blogContent });
        toast.success('Blog added successfully!');
      }
      setBlogContent('');
      setBlogEditId(null);
      setBlogIsOpen(false);
      fetchBlogs();
    } catch (error) {
      console.error('Error adding/updating blog: ', error);
      toast.error('Failed to add/update blog. Please try again.');
    }
  };

  const handleBlogEdit = (blog) => {
    setBlogContent(blog.content);
    setBlogEditId(blog.id);
    setBlogIsOpen(true);
  };

  const handleBlogDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'termsandconditions', id));
      toast.success('Blog deleted successfully!');
      fetchBlogs();
    } catch (error) {
      console.error('Error deleting blog: ', error);
      toast.error('Failed to delete blog. Please try again.');
    }
  };


  
  return (
    <div className="flex flex-col items-center justify-center h-auto p-4 bg-green-100">
      <div className="w-full max-w-4xl p-8 bg-white rounded-lg shadow-lg">
        
        <button
          className="px-4 py-2 mb-4 font-bold text-white bg-purple-500 rounded hover:bg-purple-700 focus:outline-none focus:shadow-outline"
          onClick={() => setBlogIsOpen(true)}
        >
          Add privacy policy
        </button>

        

        {/* Filters */}
       

       

        


        <h2 className="mt-8 mb-4 text-2xl font-bold text-center">Privacy Policy</h2>
        <div className="mb-10 overflow-x-auto">
          <table className="w-full border table-auto">
            <thead>
              <tr className='border-b'>
                <th className="px-4 py-2">Content</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {blogs.map(blog => (
                <tr key={blog.id}>
                  <td className="px-4 py-2">
                    <div dangerouslySetInnerHTML={{ __html: blog.content }} />
                  </td>
                  <td className="px-4 py-2">
                    <button
                      className="px-2 py-1 text-white bg-yellow-500 rounded hover:bg-yellow-700"
                      onClick={() => handleBlogEdit(blog)}
                    >
                      Edit
                    </button>
                    <button
                      className="px-2 py-1 text-white bg-red-500 rounded hover:bg-red-700"
                      onClick={() => handleBlogDelete(blog.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
    
        
      </div>


      <Transition appear show={blogIsOpen} as={React.Fragment}>
        <Dialog as="div" open={blogIsOpen} onClose={() => setBlogIsOpen(false)} className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen p-4 text-center">
            <Dialog.Panel className="w-auto p-6 mx-auto bg-white rounded shadow-lg">
              <Dialog.Title as="h3" className="text-lg font-bold text-gray-900">
                {blogEditId ? 'Edit Blog' : 'Add Blog'}
              </Dialog.Title>
              <button
                className="absolute text-gray-500 top-2 right-2 hover:text-gray-700"
                onClick={() => setBlogIsOpen(false)}
              >
                <XIcon className="w-6 h-6" />
              </button>
              <form onSubmit={handleBlogSubmit}>
                <div className="mb-4">
                <JoditEditor
        value={blogContent}
        
       // Tab index for focusing
        onChange={newContent => setBlogContent(newContent)}
      />
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-700"
                  >
                    {blogEditId ? 'Update Blog' : 'Add Blog'}
                  </button>
                </div>
              </form>
            </Dialog.Panel>
          </div>
        </Dialog>
      </Transition>


      

      {/* Item Form Modal */}
      
    </div>
  );
};

export default TermsandconditionsForm;
