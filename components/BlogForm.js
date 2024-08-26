
import React, { useState, useEffect, useRef } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { db } from '@/Firebase/Config';
import { addDoc, collection, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { toast } from 'react-toastify';
import { XIcon } from '@heroicons/react/solid';
import dynamic from 'next/dynamic';


// Dynamically import JoditEditor only on the client side
const JoditEditor = dynamic(() => import('jodit-react'), {
  ssr: false, // Disable server-side rendering for this component
});

const BlogForm = () => {
  const editor = useRef(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [date, setDate] = useState('');
  const [detailPageContent, setDetailPageContent] = useState('');
  const [category, setCategory] = useState('');
  const [blogs, setBlogs] = useState([]);
  const [ads, setAds] = useState([]);
  const [editId, setEditId] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isAdsOpen, setIsAdsOpen] = useState(false);
  const [adImage, setAdImage] = useState(null);
  const [adEditId, setAdEditId] = useState(null);

  useEffect(() => {
    fetchBlogs();
    fetchAds();
  }, []);

  const fetchBlogs = async () => {
    try {
      const blogsRef = collection(db, 'blogs');
      const blogsSnapshot = await getDocs(blogsRef);
      const blogsList = blogsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setBlogs(blogsList);
    } catch (error) {
      console.error('Error fetching blogs: ', error);
      toast.error('Failed to fetch blogs. Please try again.');
    }
  };

  const fetchAds = async () => {
    try {
      const adsRef = collection(db, 'blogads');
      const adsSnapshot = await getDocs(adsRef);
      const adsList = adsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAds(adsList);
    } catch (error) {
      console.error('Error fetching ads: ', error);
      toast.error('Failed to fetch advertisements. Please try again.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let imageUrl = '';
      if (image) {
        const storage = getStorage();
        const storageRef = ref(storage, `images/${image.name}`);
        await uploadBytes(storageRef, image);
        imageUrl = await getDownloadURL(storageRef);
      }

      if (editId) {
        const blogDocRef = doc(db, 'blogs', editId);
        await updateDoc(blogDocRef, {
          title,
          content,
          imageUrl,
          date: new Date(date),
          createdAt: new Date(),
          detailPageContent,
          category,
        });
        toast.success('Blog updated successfully!');
      } else {
        const blogRef = collection(db, 'blogs');
        await addDoc(blogRef, {
          title,
          content,
          imageUrl,
          date: new Date(date),
          createdAt: new Date(),
          detailPageContent,
          category,
        });
        toast.success('Blog added successfully!');
      }

      setTitle('');
      setContent('');
      setImage(null);
      setDate('');
      setDetailPageContent('');
      setCategory('');
      setEditId(null);
      setIsOpen(false);
      fetchBlogs();
    } catch (error) {
      console.error('Error adding/updating blog: ', error);
      toast.error('Failed to add/update blog. Please try again.');
    }
  };

  const handleEdit = (blog) => {
    setTitle(blog.title);
    setContent(blog.content);
    setImage(blog.imageUrl); // Optional: Handle image preview or URL
    setDate(blog.date.toDate().toISOString().split('T')[0]);
    setDetailPageContent(blog.detailPageContent);
    setCategory(blog.category);
    setEditId(blog.id);
    setIsOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'blogs', id));
      toast.success('Blog deleted successfully!');
      fetchBlogs();
    } catch (error) {
      console.error('Error deleting blog: ', error);
      toast.error('Failed to delete blog. Please try again.');
    }
  };

  const handleAdSubmit = async () => {
    try {
      let adImageUrl = '';
      if (adImage) {
        const storage = getStorage();
        const storageRef = ref(storage, `ads/${adImage.name}`);
        await uploadBytes(storageRef, adImage);
        adImageUrl = await getDownloadURL(storageRef);
      }

      if (adEditId) {
        const adDocRef = doc(db, 'blogads', adEditId);
        await updateDoc(adDocRef, { imageUrl: adImageUrl });
        toast.success('Advertisement updated successfully!');
      } else {
        const adsRef = collection(db, 'blogads');
        await addDoc(adsRef, { imageUrl: adImageUrl });
        toast.success('Advertisement added successfully!');
      }

      setAdImage(null);
      setAdEditId(null);
      setIsAdsOpen(false);
      fetchAds();
    } catch (error) {
      console.error('Error adding/updating advertisement: ', error);
      toast.error('Failed to add/update advertisement. Please try again.');
    }
  };

  const handleAdEdit = (ad) => {
    setAdImage(null); // Reset image state
    setAdEditId(ad.id);
    setAdImage(ad.imageUrl); // Optional: Handle image preview or URL
    setIsAdsOpen(true);
  };

  const handleAdDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'blogads', id));
      toast.success('Advertisement deleted successfully!');
      fetchAds();
    } catch (error) {
      console.error('Error deleting advertisement: ', error);
      toast.error('Failed to delete advertisement. Please try again.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-auto p-4 bg-green-100">
      <div className="w-full max-w-4xl p-8 bg-white rounded-lg shadow-lg">
        <button
          className="px-4 py-2 mb-4 mr-4 font-bold text-white bg-green-500 rounded hover:bg-green-700 focus:outline-none focus:shadow-outline"
          onClick={() => setIsOpen(true)}
        >
          Add Blog
        </button>

        <button
          className="px-4 py-2 mb-4 font-bold text-white bg-blue-500 rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline"
          onClick={() => setIsAdsOpen(true)}
        >
          Manage Advertisements
        </button>

        <h2 className="mb-4 text-2xl font-bold text-center">Blog List</h2>

        <div className="mb-6 overflow-x-auto">
          <table className="w-full border table-auto">
            <thead>
              <tr className="border-b">
                <th className="px-4 py-2">Title</th>
                <th className="px-4 py-2">Date</th>
                <th className="px-4 py-2">Image</th>
                <th className="px-4 py-2">Category</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {blogs.map((blog) => (
                <tr key={blog.id}>
                  <td className="px-4 py-2 font-bold border-b">{blog.title}</td>
                  <td className="px-4 py-2 border-b">{blog.date.toDate().toLocaleDateString()}</td>
                  <td className="px-4 py-2 border-b">
                    {blog.imageUrl && (
                      <img src={blog.imageUrl} alt={blog.title} className="w-auto h-10" />
                    )}
                  </td>
                  <td className="px-4 py-2 border-b">{blog.category}</td>
                  <td className="px-4 py-2 border-b">
                    <button
                      className="px-2 py-1 font-bold text-white bg-yellow-500 rounded hover:bg-yellow-700 focus:outline-none focus:shadow-outline"
                      onClick={() => handleEdit(blog)}
                    >
                      Edit
                    </button>
                    <button
                      className="px-2 py-1 ml-2 font-bold text-white bg-red-500 rounded hover:bg-red-700 focus:outline-none focus:shadow-outline"
                      onClick={() => handleDelete(blog.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 className="mb-4 text-2xl font-bold text-center">Advertisements</h2>

        <div className="overflow-x-auto">
          <table className="w-full border table-auto">
            <thead>
              <tr className="border-b">
                <th className="px-4 py-2">Image</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {ads.map((ad) => (
                <tr key={ad.id}>
                  <td className="px-4 py-2 border-b">
                    {ad.imageUrl && (
                      <img src={ad.imageUrl} alt={`Ad ${ad.id}`} className="w-32 h-20" />
                    )}
                  </td>
                  <td className="px-4 py-2 border-b">
                    <button
                      className="px-2 py-1 font-bold text-white bg-yellow-500 rounded hover:bg-yellow-700 focus:outline-none focus:shadow-outline"
                      onClick={() => handleAdEdit(ad)}
                    >
                      Edit
                    </button>
                    <button
                      className="px-2 py-1 ml-2 font-bold text-white bg-red-500 rounded hover:bg-red-700 focus:outline-none focus:shadow-outline"
                      onClick={() => handleAdDelete(ad.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Add Blog Modal */}
        <Transition.Root show={isOpen} as={React.Fragment}>
  <Dialog as="div" static open={isOpen} onClose={setIsOpen}>
    <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" aria-hidden="true" />
    <div className="fixed inset-0 flex items-center justify-center p-4">
      <Dialog.Panel className="relative w-full max-w-lg max-h-screen p-8 overflow-y-auto bg-white rounded-lg shadow-xl">
        <Dialog.Title className="text-lg font-semibold">Blog Form</Dialog.Title>
        <button
          type="button"
          className="absolute p-1 text-gray-500 top-2 right-2 hover:text-gray-700"
          onClick={() => setIsOpen(false)}
        >
          <XIcon className="w-6 h-6" />
        </button>
        <form onSubmit={handleSubmit}>
          <div className="mt-8 mb-4">
            <label htmlFor="title" className="block mb-2 text-sm font-bold">
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="content" className="block mb-2 text-sm font-bold">
              Content
            </label>
            <JoditEditor
              ref={editor}
              value={content}
              onChange={(newContent) => setContent(newContent)}
              className="border border-gray-300 rounded"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="image" className="block mb-2 text-sm font-bold">
              Image
            </label>
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
              className="w-full"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="date" className="block mb-2 text-sm font-bold">
              Date
            </label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="detailPageContent" className="block mb-2 text-sm font-bold">
              Detail Page Content
            </label>
            <JoditEditor
              ref={editor}
              value={detailPageContent}
              onChange={(newContent) => setDetailPageContent(newContent)}
              className="border border-gray-300 rounded"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="category" className="block mb-2 text-sm font-bold">
              Category
            </label>
            <input
              type="text"
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>

          <button
            type="submit"
            className="px-4 py-2 font-bold text-white bg-green-500 rounded hover:bg-green-700 focus:outline-none focus:shadow-outline"
          >
            {editId ? 'Update Blog' : 'Add Blog'}
          </button>
        </form>
      </Dialog.Panel>
    </div>
  </Dialog>
</Transition.Root>


        {/* Manage Advertisements Modal */}
        <Transition.Root show={isAdsOpen} as={React.Fragment}>
          <Dialog as="div" static open={isAdsOpen} onClose={setIsAdsOpen}>
            <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" aria-hidden="true" />
            <div className="fixed inset-0 flex items-center justify-center p-4">
              <Dialog.Panel className="max-w-lg p-8 mx-auto bg-white rounded-lg shadow-xl">
                <Dialog.Title className="text-lg font-semibold">Manage Advertisements</Dialog.Title>
                <button
                  type="button"
                  className="absolute p-1 text-gray-500 top-2 right-2 hover:text-gray-700"
                  onClick={() => setIsAdsOpen(false)}
                >
                  <XIcon className="w-6 h-6" />
                </button>

                <div className="mb-4">
                  <label htmlFor="adImage" className="block mb-2 text-sm font-bold">
                    Upload Advertisement Image
                  </label>
                  <input
                    type="file"
                    id="adImage"
                    accept="image/*"
                    onChange={(e) => setAdImage(e.target.files[0])}
                    className="w-full"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleAdSubmit}
                  className="px-4 py-2 font-bold text-white bg-green-500 rounded hover:bg-green-700 focus:outline-none focus:shadow-outline"
                >
                  {adEditId ? 'Update Ad' : 'Add Ad'}
                </button>

                {/* <h2 className="mt-8 mb-4 text-lg font-bold">Existing Advertisements</h2>
                <div className="grid grid-cols-1 gap-4">
                  {ads.map((ad) => (
                    <div key={ad.id} className="flex items-center justify-between p-4 border border-gray-300 rounded">
                      <img src={ad.imageUrl} alt={`Ad ${ad.id}`} className="w-32 h-20" />
                      <button
                        type="button"
                        onClick={() => handleAdEdit(ad)}
                        className="px-4 py-2 font-bold text-white bg-yellow-500 rounded hover:bg-yellow-700 focus:outline-none focus:shadow-outline"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAdDelete(ad.id)}
                        className="px-4 py-2 font-bold text-white bg-red-500 rounded hover:bg-red-700 focus:outline-none focus:shadow-outline"
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div> */}
              </Dialog.Panel>
            </div>
          </Dialog>
        </Transition.Root>
      </div>
    </div>
  );
};

export default BlogForm;
