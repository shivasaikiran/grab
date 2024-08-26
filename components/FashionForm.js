
import React, { useState, useEffect } from 'react';
import { db } from '@/Firebase/Config';
import { addDoc, collection, getDocs, doc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { toast } from 'react-toastify';
import { Dialog, Transition } from '@headlessui/react';
import { XIcon } from '@heroicons/react/solid';
import dynamic from 'next/dynamic';


// Dynamically import JoditEditor only on the client side
const JoditEditor = dynamic(() => import('jodit-react'), {
  ssr: false, // Disable server-side rendering for this component
});

// import dynamic from 'next/dynamic';

const FashionForm = () => {
  const [discount, setDiscount] = useState('');
  const [link, setLink] = useState('');
  const [description, setDescription] = useState('');
  const [name, setName] = useState('');
  const [discounttext,setDiscountText] = useState('');
  const [image, setImage] = useState(null);
  const [items, setItems] = useState([]);
  const [editId, setEditId] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  // Filtering states
  const [minPeopleUsed, setMinPeopleUsed] = useState('');
  const [maxPeopleUsed, setMaxPeopleUsed] = useState('');

  // Banner states
  
  const [bannerImage, setBannerImage] = useState(null);
  const [banners, setBanners] = useState([]);
  const [bannerEditId, setBannerEditId] = useState(null);
  const [bannerIsOpen, setBannerIsOpen] = useState(false);
  
  const [adImage, setAdImage] = useState(null);
  const [ads, setAds] = useState([]);
  const [adEditId, setAdEditId] = useState(null);
  const [adIsOpen, setAdIsOpen] = useState(false);

  const [blogContent, setBlogContent] = useState('');
  const [blogs, setBlogs] = useState([]);
  const [blogEditId, setBlogEditId] = useState(null);
  const [blogIsOpen, setBlogIsOpen] = useState(false);

  // const JoditEditor = dynamic(() => import('jodit-react'), { ssr: false });


  useEffect(() => {
    fetchItems();
    fetchBanners();
    fetchAds();
    fetchBlogs();
  }, [minPeopleUsed, maxPeopleUsed]);

  const fetchAds = async () => {
    try {
      const adsSnapshot = await getDocs(collection(db, 'categories', 'fashion', 'ads'));
      const adsList = adsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAds(adsList);
    } catch (error) {
      console.error('Error fetching ads: ', error);
      toast.error('Failed to fetch ads. Please try again.');
    }
  };
  const fetchBlogs = async () => {
    try {
      const blogsRef = collection(db, 'categories', 'fashion', 'blogs');
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
        const blogDocRef = doc(db, 'categories', 'fashion', 'blogs', blogEditId);
        await updateDoc(blogDocRef, { content: blogContent });
        toast.success('Blog updated successfully!');
      } else {
        const blogsCollectionRef = collection(db, 'categories', 'fashion', 'blogs');
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
      await deleteDoc(doc(db, 'categories', 'fashion', 'blogs', id));
      toast.success('Blog deleted successfully!');
      fetchBlogs();
    } catch (error) {
      console.error('Error deleting blog: ', error);
      toast.error('Failed to delete blog. Please try again.');
    }
  };


  const handleAdSubmit = async (e) => {
    e.preventDefault();

    try {
      let adImageUrl = '';
      if (adImage) {
        const storage = getStorage();
        const storageRef = ref(storage, `ads/${adImage.name}`);
        await uploadBytes(storageRef, adImage);
        adImageUrl = await getDownloadURL(storageRef);
      }

      if (adEditId) {
        const adDocRef = doc(db, 'categories', 'fashion', 'ads', adEditId);
        await updateDoc(adDocRef, { imageUrl: adImageUrl });
        toast.success('Ad updated successfully!');
      } else {
        const adsCollectionRef = collection(db, 'categories', 'fashion', 'ads');
        await addDoc(adsCollectionRef, { imageUrl: adImageUrl });
        toast.success('Ad added successfully!');
      }

      setAdImage(null);
      setAdEditId(null);
      setAdIsOpen(false);
      fetchAds();
    } catch (error) {
      console.error('Error adding/updating ad: ', error);
      toast.error('Failed to add/update ad. Please try again.');
    }
  };

  const handleAdEdit = (ad) => {
    setAdImage(ad.imageUrl); // Optional: Handle image preview or URL
    setAdEditId(ad.id);
    setAdIsOpen(true);
  };

  const handleAdDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'categories', 'fashion', 'ads', id));
      toast.success('Ad deleted successfully!');
      fetchAds();
    } catch (error) {
      console.error('Error deleting ad: ', error);
      toast.error('Failed to delete ad. Please try again.');
    }
  };


  const fetchItems = async () => {
    try {
      let itemsQuery = collection(db, 'categories', 'fashion', 'items');
      
      if (minPeopleUsed || maxPeopleUsed) {
        itemsQuery = query(
          itemsQuery, 
          where('numPeopleUsed', '>=', minPeopleUsed || 0), 
          where('numPeopleUsed', '<=', maxPeopleUsed || 100000)
        );
      }

      const itemsSnapshot = await getDocs(itemsQuery);
      const itemsList = itemsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setItems(itemsList);
    } catch (error) {
      console.error('Error fetching items: ', error);
      toast.error('Failed to fetch items. Please try again.');
    }
  };

  const fetchBanners = async () => {
    try {
      const bannersSnapshot = await getDocs(collection(db, 'fashionbanners'));
      const bannersList = bannersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setBanners(bannersList);
    } catch (error) {
      console.error('Error fetching banners: ', error);
      toast.error('Failed to fetch banners. Please try again.');
    }
  };

  const handleItemSubmit = async (e) => {
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
        const itemDocRef = doc(db, 'categories', 'fashion', 'items', editId);
        await updateDoc(itemDocRef, { discount, description, name, discounttext, imageUrl,link });
        toast.success('Item updated successfully!');
      } else {
        const itemsCollectionRef = collection(db, 'categories', 'fashion', 'items');
        await addDoc(itemsCollectionRef, { discount, description, name, numPeopleUsed, imageUrl,link });
        toast.success('Item added successfully!');
      }

      setDiscount('');
      setLink('');
      setDescription('');
      setName('');
      setDiscountText('');
      setImage(null);
      setEditId(null);
      setIsOpen(false);
      fetchItems();
    } catch (error) {
      console.error('Error adding/updating document: ', error);
      toast.error('Failed to add/update item. Please try again.');
    }
  };

  const handleBannerSubmit = async (e) => {
    e.preventDefault();

    try {
      let bannerImageUrl = '';
      if (bannerImage) {
        const storage = getStorage();
        const storageRef = ref(storage, `banners/${bannerImage.name}`);
        await uploadBytes(storageRef, bannerImage);
        bannerImageUrl = await getDownloadURL(storageRef);
      }

      if (bannerEditId) {
        const bannerDocRef = doc(db, 'fashionbanners', bannerEditId);
        await updateDoc(bannerDocRef, {imageUrl: bannerImageUrl });
        toast.success('Banner updated successfully!');
      } else {
        const bannersCollectionRef = collection(db, 'fashionbanners');
        await addDoc(bannersCollectionRef, {  imageUrl: bannerImageUrl });
        toast.success('Banner added successfully!');
      }

      setBannerImage(null);
      setBannerEditId(null);
      setBannerIsOpen(false);
      fetchBanners();
    } catch (error) {
      console.error('Error adding/updating banner: ', error);
      toast.error('Failed to add/update banner. Please try again.');
    }
  };

  const handleItemEdit = (item) => {
    setDiscount(item.discount);
    setLink(item.link);
    setDescription(item.description);
    setName(item.name);
    setDiscountText(item.discounttext);
    setImage(item.imageUrl); // Optional: Handle image preview or URL
    setEditId(item.id);
    setIsOpen(true);
  };

  const handleItemDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'categories', 'fashion', 'items', id));
      toast.success('Item deleted successfully!');
      fetchItems();
    } catch (error) {
      console.error('Error deleting document: ', error);
      toast.error('Failed to delete item. Please try again.');
    }
  };

  const handleBannerEdit = (banner) => {
 
    setBannerImage(banner.imageUrl); // Optional: Handle image preview or URL
    setBannerEditId(banner.id);
    setBannerIsOpen(true);
  };

  const handleBannerDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'fashionbanners', id));
      toast.success('Banner deleted successfully!');
      fetchBanners();
    } catch (error) {
      console.error('Error deleting document: ', error);
      toast.error('Failed to delete banner. Please try again.');
    }
  };

  const config = {
    readonly: false, // Make sure this is false to allow editing
    toolbar: true, 
  };
  

  return (
    <div className="flex flex-col items-center justify-center h-auto p-4 bg-green-100">
      <div className="w-full max-w-4xl p-8 bg-white rounded-lg shadow-lg">
        <button
          className="px-4 py-2 mb-4 mr-4 font-bold text-white bg-green-500 rounded hover:bg-green-700 focus:outline-none focus:shadow-outline"
          onClick={() => setIsOpen(true)}
        >
          Add Item
        </button>

        <button
          className="px-4 py-2 mb-4 mr-4 font-bold text-white bg-blue-500 rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline"
          onClick={() => setBannerIsOpen(true)}
        >
          Add Banner
        </button>
        <button
          className="px-4 py-2 mb-4 mr-4 font-bold text-white bg-blue-500 rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline"
          onClick={() => setAdIsOpen(true)}
        >
          Add ads
        </button>
        <button
          className="px-4 py-2 mb-4 font-bold text-white bg-purple-500 rounded hover:bg-purple-700 focus:outline-none focus:shadow-outline"
          onClick={() => setBlogIsOpen(true)}
        >
          Add Blog
        </button>

        <h2 className="mb-4 text-2xl font-bold text-center">Items List</h2>

        {/* Filters */}
        <div className="mb-6">
          <h3 className="text-lg font-bold">Filter Items</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Min People Used</label>
              <input
                type="number"
                value={minPeopleUsed}
                onChange={(e) => setMinPeopleUsed(e.target.value)}
                className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Max People Used</label>
              <input
                type="number"
                value={maxPeopleUsed}
                onChange={(e) => setMaxPeopleUsed(e.target.value)}
                className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
              />
            </div>
          </div>
        </div>

        <h2 className="mt-8 mb-4 text-2xl font-bold text-center">Banners List</h2>

        <div className="mb-10 overflow-x-auto">
          <table className="w-full border table-auto">
            <thead>
              <tr className='border-b'>
                
                <th className="px-4 py-2">Image</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {banners.map(banner => (
                <tr key={banner.id}>
                 
                  <td className="px-4 py-2">
                    {banner.imageUrl && <img src={banner.imageUrl} alt={banner.title} className="object-cover w-16 h-16" />}
                  </td>
                  <td className="px-4 py-2">
                    <button
                      className="px-2 py-1 text-white bg-yellow-500 rounded hover:bg-yellow-700"
                      onClick={() => handleBannerEdit(banner)}
                    >
                      Edit
                    </button>
                    <button
                      className="px-2 py-1 text-white bg-red-500 rounded hover:bg-red-700"
                      onClick={() => handleBannerDelete(banner.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border table-auto">
            <thead>
              <tr className='border-b'>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Discount</th>
                <th className="px-4 py-2">Description</th>
                <th className="px-4 py-2">Discount text</th>
                <th className="px-4 py-2">Image</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id}>
                  <td className="px-4 py-2">{item.name}</td>
                  <td className="px-4 py-2">{item.discount}</td>
                  <td className="px-4 py-2">{item.description}</td>
                  <td className="px-4 py-2">{item.discounttext}</td>
                  <td className="px-4 py-2">
                    {item.imageUrl && <img src={item.imageUrl} alt={item.name} className="object-cover w-16 h-16" />}
                  </td>
                  <td className="px-4 py-2">
                    <button
                      className="px-2 py-1 text-white bg-yellow-500 rounded hover:bg-yellow-700"
                      onClick={() => handleItemEdit(item)}
                    >
                      Edit
                    </button>
                    <button
                      className="px-2 py-1 text-white bg-red-500 rounded hover:bg-red-700"
                      onClick={() => handleItemDelete(item.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <h2 className="mt-8 mb-4 text-2xl font-bold text-center">Adds</h2>
        <div className="mb-10 overflow-x-auto">
          <table className="w-full border table-auto">
            <thead>
              <tr className='border-b'>
                
                <th className="px-4 py-2">Image</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
            {ads.map(ad => (
              <tr key={ad.id}>
                <td><img src={ad.imageUrl} alt="Ad" className="object-cover w-16 h-16" /></td>
                <td className="px-4 py-2">
                    <button
                      className="px-2 py-1 text-white bg-yellow-500 rounded hover:bg-yellow-700"
                      onClick={() => handleAdEdit(ad)}
                    >
                      Edit
                    </button>
                    <button
                      className="px-2 py-1 text-white bg-red-500 rounded hover:bg-red-700"
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


        <h2 className="mt-8 mb-4 text-2xl font-bold text-center">Blogs List</h2>
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
      <Transition appear show={isOpen} as={React.Fragment}>
        <Dialog as="div" open={isOpen} onClose={() => setIsOpen(false)} className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen p-4 text-center">
            <Dialog.Panel className="max-w-lg p-6 mx-auto bg-white rounded shadow-lg">
              <Dialog.Title as="h3" className="text-lg font-bold">Item Form</Dialog.Title>
              <button className="absolute top-2 right-2" onClick={() => setIsOpen(false)}>
                <XIcon className="w-6 h-6 text-gray-500" />
              </button>
              <form onSubmit={handleItemSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Discount</label>
                  <input
                    type="text"
                    value={discount}
                    onChange={(e) => setDiscount(e.target.value)}
                    className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Discount text</label>
                  <input
                    type="text"
                    value={discounttext}
                    onChange={(e) => setDiscountText(e.target.value)}
                    className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Image</label>
                  <input
                    type="file"
                    onChange={(e) => setImage(e.target.files[0])}
                    className="block w-full text-sm text-gray-500 border border-gray-300 rounded-md cursor-pointer focus:outline-none"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Link</label>
                  <input
                    type="text"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 font-bold text-white bg-green-500 rounded hover:bg-green-700 focus:outline-none focus:shadow-outline"
                >
                  {editId ? 'Update Item' : 'Add Item'}
                </button>
              </form>
            </Dialog.Panel>
          </div>
        </Dialog>
      </Transition>

      {/* Banner Form Modal */}
      <Transition appear show={bannerIsOpen} as={React.Fragment}>
        <Dialog as="div" open={bannerIsOpen} onClose={() => setBannerIsOpen(false)} className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen p-4 text-center">
            <Dialog.Panel className="max-w-lg p-6 mx-auto bg-white rounded shadow-lg">
              <Dialog.Title as="h3" className="text-lg font-bold">Banner Form</Dialog.Title>
              <button className="absolute top-2 right-2" onClick={() => setBannerIsOpen(false)}>
                <XIcon className="w-6 h-6 text-gray-500" />
              </button>
              <form onSubmit={handleBannerSubmit}>
                
              
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Image</label>
                  <input
                    type="file"
                    onChange={(e) => setBannerImage(e.target.files[0])}
                    className="block w-full text-sm text-gray-500 border border-gray-300 rounded-md cursor-pointer focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline"
                >
                  {bannerEditId ? 'Update Banner' : 'Add Banner'}
                </button>
              </form>
            </Dialog.Panel>
          </div>
        </Dialog>
      </Transition>

      <Transition appear show={adIsOpen} as={React.Fragment}>
        <Dialog as="div" open={adIsOpen} onClose={() => setAdIsOpen(false)} className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen p-4 text-center">
            <Dialog.Panel className="max-w-lg p-6 mx-auto bg-white rounded shadow-lg">
              <Dialog.Title as="h3" className="text-lg font-bold">Add Form</Dialog.Title>
              <button className="absolute top-2 right-2" onClick={() => setAdIsOpen(false)}>
                <XIcon className="w-6 h-6 text-gray-500" />
              </button>
              <form onSubmit={handleAdSubmit}>
                
              
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Image</label>
                  <input
                    type="file"
                    onChange={(e) => setAdImage(e.target.files[0])}
                    className="block w-full text-sm text-gray-500 border border-gray-300 rounded-md cursor-pointer focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline"
                >
                 {adEditId ? 'Update Ad' : 'Add Ad'}
                </button>
              </form>
            </Dialog.Panel>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default FashionForm;
