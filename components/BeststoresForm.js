
import React, { useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { db } from '@/Firebase/Config';
import { addDoc, collection, getDocs, deleteDoc, doc, updateDoc, query, where } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { toast } from 'react-toastify';
import { XIcon } from '@heroicons/react/solid';
import dynamic from 'next/dynamic';


// Dynamically import JoditEditor only on the client side
const JoditEditor = dynamic(() => import('jodit-react'), {
  ssr: false, // Disable server-side rendering for this component
});
const BeststoresForm = () => {

  const [itemdiscount, setItemDiscount] = useState('');
  const [itemlink, setItemLink] = useState('');
  const [itemdescription, setItemDescription] = useState('');
  const [itemname, setItemName] = useState('');
  const [itemdiscounttext,setItemDiscountText] = useState('');
  const [itemimage, setItemImage] = useState(null);
  const [items, setItems] = useState([]);
  const [itemeditId, setItemEditId] = useState(null);
  const [itemisOpen, setItemIsOpen] = useState(false);

  const [category, setCategory] = useState('');

  const [title, setTitle] = useState('');
  const [name, setName] = useState('');
  const [bannerimg, setBannerimg] = useState(null);
  const [discount, setDiscount] = useState('');
  const [image, setImage] = useState(null);
 
  const [link, setLink] = useState(null);
  const [stores, setStores] = useState([]);
  const [editId, setEditId] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const [featuredstore, setFeaturedstore] = useState([]);
  const [featuredimg, setFeaturedimg] = useState(null);
  const [featuredEditId, setFeaturedEditId] = useState(null);
  const [featuredIsOpen, setFeaturedIsOpen] = useState(false);
  const [featuredtitle, setFeaturedTitle] = useState('');
  const [offers, setOffers] = useState('');
  const [coupons, setCoupons] = useState('');
  const [featureddescription, setFeaturedDescription] = useState('');
  
  
  // States for banner form
 
  const [bannerImage, setBannerImage] = useState(null);
  const [banners, setBanners] = useState([]);
  const [bannerEditId, setBannerEditId] = useState(null);
  const [isBannerOpen, setIsBannerOpen] = useState(false);

  // Filtering states
  const [minOffers, setMinOffers] = useState('');
  const [maxOffers, setMaxOffers] = useState('');
  const [minCoupons, setMinCoupons] = useState('');
  const [maxCoupons, setMaxCoupons] = useState('');

  const [adImage, setAdImage] = useState(null);
  const [ads, setAds] = useState([]);
  const [adEditId, setAdEditId] = useState(null);
  const [adIsOpen, setAdIsOpen] = useState(false);
   
  const [blogContent, setBlogContent] = useState('');
  const [blogs, setBlogs] = useState([]);
  const [blogEditId, setBlogEditId] = useState(null);
  const [blogIsOpen, setBlogIsOpen] = useState(false);


  useEffect(() => {
    fetchStores();
    fetchBanners();
    fetchAds();
    fetchBlogs();
    fetchfeaturedstore();
    fetchItems();
  }, [minOffers, maxOffers, minCoupons, maxCoupons]);

  const fetchItems = async () => {
    try {
      let itemsQuery = collection(db, 'beststoreitem');
  
      const itemsSnapshot = await getDocs(itemsQuery);
      const itemsList = itemsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      console.log("Fetched Items:", itemsList); // Check if items are fetched correctly
      setItems(itemsList); // Update state with fetched items
    } catch (error) {
      console.error('Error fetching items: ', error);
      toast.error('Failed to fetch items. Please try again.');
    }
  };
  
  const handleItemSubmit = async (e) => {
    e.preventDefault();

    try {
      let imageUrl = '';
      if (itemimage) {
        const storage = getStorage();
        const storageRef = ref(storage, `images/${itemimage.name}`);
        await uploadBytes(storageRef, itemimage);
        imageUrl = await getDownloadURL(storageRef);
      }

      if (editId) {
        const itemDocRef = doc(db, 'beststoreitem', editId);
        await updateDoc(itemDocRef, { itemdiscount, itemdescription, itemname, itemdiscounttext, imageUrl,itemlink });
        toast.success('Item updated successfully!');
      } else {
        const itemsCollectionRef = collection(db, 'beststoreitem');
        await addDoc(itemsCollectionRef, { itemdiscount, itemdescription, itemname,itemdiscounttext, imageUrl,itemlink });
        toast.success('Item added successfully!');
      }

      setItemDiscount('');
      setItemLink('');
      setItemDescription('');
      setItemName('');
      setItemDiscountText('');
      setItemImage(null);
      setItemEditId(null);
      setItemIsOpen(false);
      fetchItems();
    } catch (error) {
      console.error('Error adding/updating document: ', error);
      toast.error('Failed to add/update item. Please try again.');
    }
  };
  const handleItemEdit = (item) => {
    setItemDiscount(item.itemdiscount);
    setItemLink(item.itemlink);
    setItemDescription(item.itemdescription);
    setItemName(item.itemname);
    setItemDiscountText(item.itemdiscounttext);
    setItemImage(item.imageUrl);
    setItemEditId(item.id);
    setItemIsOpen(true);
  };

  const handleItemDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'beststoreitem', id));
      toast.success('Item deleted successfully!');
      fetchItems();
    } catch (error) {
      console.error('Error deleting document: ', error);
      toast.error('Failed to delete item. Please try again.');
    }
  };

  const fetchfeaturedstore = async () => {
    try {
      const featuredSnapshot = await getDocs(collection(db, 'featuredstore'));
      const featuredList = featuredSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setFeaturedstore(featuredList);
    } catch (error) {
      console.error('Error fetching featured store: ', error);
      toast.error('Failed to fetch features store. Please try again.');
    }
  };
  const handlefeaturedstoreSubmit = async (e) => {
    e.preventDefault();
  
    try {
      let featuredImageUrl = '';
      if (featuredimg) {
        const storage = getStorage();
        const storageRef = ref(storage, `images/${featuredimg.name}`);
        await uploadBytes(storageRef, featuredimg);
        featuredImageUrl = await getDownloadURL(storageRef);
      }
  
      // Prepare the data to be updated
      const data = {
        imageUrl: featuredImageUrl || '', // Ensure imageUrl is not undefined
        title: featuredtitle || '', // Ensure title is not undefined
        offers: offers || '', // Ensure offers is not undefined
        coupons: coupons || '', // Ensure coupons is not undefined
        description: featureddescription || '' // Ensure description is not undefined
      };
  
      if (featuredEditId) {
        // Update existing document
        const featuredDocRef = doc(db, 'featuredstore', featuredEditId);
        await updateDoc(featuredDocRef, data);
        toast.success('Featured store updated successfully!');
      } else {
        // Add new document
        const featuredCollectionRef = collection(db, 'featuredstore');
        await addDoc(featuredCollectionRef, data);
        toast.success('Featured store added successfully!');
      }
  
      // Reset form fields
      setFeaturedimg(null);
      setFeaturedTitle('');
      setOffers('');
      setCoupons('');
      setFeaturedDescription('');
      setFeaturedEditId(null);
      setFeaturedIsOpen(false);
      fetchfeaturedstore();
    } catch (error) {
      console.error('Error adding/updating featured store: ', error);
      toast.error('Failed to add/update featured store. Please try again.');
    }
  };
  

  const handlefeaturedstoreEdit = (store) => {
    setFeaturedimg(store.imageUrl); // Optional: Handle image preview or URL
    setFeaturedTitle(store.title);
    setOffers(store.offers);
    setCoupons(store.coupons);
    setFeaturedDescription(store.description);
    setFeaturedEditId(store.id);
    setFeaturedIsOpen(true);
  };
  const handlefeaturedstoreDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'featuredstore', id));
      toast.success('Featured store deleted successfully!');
      fetchfeaturedstore();
    } catch (error) {
      console.error('Error deleting featured store: ', error);
      toast.error('Failed to delete featured store. Please try again.');
    }
  };
    

  const fetchAds = async () => {
    try {
      const adsSnapshot = await getDocs(collection(db, 'beststoresads'));
      const adsList = adsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAds(adsList);
    } catch (error) {
      console.error('Error fetching ads: ', error);
      toast.error('Failed to fetch ads. Please try again.');
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
        const adDocRef = doc(db, 'beststoresads', adEditId);
        await updateDoc(adDocRef, { imageUrl: adImageUrl });
        toast.success('Ad updated successfully!');
      } else {
        const adsCollectionRef = collection(db, 'beststoresads');
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
      await deleteDoc(doc(db, 'beststoresads', id));
      toast.success('Ad deleted successfully!');
      fetchAds();
    } catch (error) {
      console.error('Error deleting ad: ', error);
      toast.error('Failed to delete ad. Please try again.');
    }
  };



  const fetchBlogs = async () => {
    try {
      const blogsRef = collection(db,'beststoresblog');
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
        const blogDocRef = doc(db, 'beststoresblog', blogEditId);
        await updateDoc(blogDocRef, { content: blogContent });
        toast.success('Blog updated successfully!');
      } else {
        const blogsCollectionRef = collection(db, 'beststoresblog');
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
      await deleteDoc(doc(db, 'beststoresblog', id));
      toast.success('Blog deleted successfully!');
      fetchBlogs();
    } catch (error) {
      console.error('Error deleting blog: ', error);
      toast.error('Failed to delete blog. Please try again.');
    }
  };

 

  const fetchStores = async () => {
    try {
      let storesQuery = collection(db, 'beststores');
      
      // Apply filters if specified
      if (minOffers || maxOffers) {
        storesQuery = query(storesQuery, where('title', '>=', minOffers || 0), where('title', '<=', maxOffers || 100000));
      }
      if (minCoupons || maxCoupons) {
        storesQuery = query(storesQuery, where('discount', '>=', minCoupons || 0), where('discount', '<=', maxCoupons || 100000));
      }

      const storesSnapshot = await getDocs(storesQuery);
      const storesList = storesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setStores(storesList);
    } catch (error) {
      console.error('Error fetching stores: ', error);
      toast.error('Failed to fetch stores. Please try again.');
    }
  };

  const fetchBanners = async () => {
    try {
      const bannersCollectionRef = collection(db, 'beststore banners');
      const bannersSnapshot = await getDocs(bannersCollectionRef);
      const bannersList = bannersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setBanners(bannersList);
    } catch (error) {
      console.error('Error fetching banners: ', error);
      toast.error('Failed to fetch banners. Please try again.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let imageUrl = '';
      if (image) {
        // Upload image to Firebase Storage
        const storage = getStorage();
        const storageRef = ref(storage, `images/${image.name}`);
        await uploadBytes(storageRef, image);
        // Get image URL
        imageUrl = await getDownloadURL(storageRef);
      }
      let bannerimgUrl = '';
      if (bannerimg) {
        // Upload image to Firebase Storage
        const storage = getStorage();
        const storageRef = ref(storage, `images/${bannerimg.name}`);
        await uploadBytes(storageRef, bannerimg);
        // Get image URL
        bannerimgUrl = await getDownloadURL(storageRef);
      }

      if (editId) {
        // Update existing store
        const storeDocRef = doc(db, 'beststores', editId);
        await updateDoc(storeDocRef, { title, discount, imageUrl,link,name,bannerimgUrl,category});
        toast.success('Store updated successfully!');
      } else {
        // Add new store
        const storesCollectionRef = collection(db, 'beststores');
        await addDoc(storesCollectionRef, { title, discount, imageUrl,link,name,bannerimgUrl,category });
        toast.success('Store added successfully!');
      }

      // Clear form
      setTitle('');
      setName('');
      setBannerimg(null);
      setDiscount('');
      setCategory('');
      setImage(null);
      setLink('');
      setEditId(null);
      setIsOpen(false);
      fetchStores();
    } catch (error) {
      console.error('Error adding/updating document: ', error);
      toast.error('Failed to add/update store. Please try again.');
    }
  };

  const handleEdit = (store) => {
    setTitle(store.title);
    setName(store.name);
    setBannerimg(store.bannerimgUrl);
    setDiscount(store.discount);
    setCategory(store.category);
    setLink(store.link);
    setImage(store.imageUrl); // Optional: Handle image preview or URL
    setEditId(store.id);
    setIsOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'beststores', id));
      toast.success('Store deleted successfully!');
      fetchStores();
    } catch (error) {
      console.error('Error deleting document: ', error);
      toast.error('Failed to delete store. Please try again.');
    }
  };

  const handleBannerSubmit = async (e) => {
    e.preventDefault();

    try {
      let bannerImageUrl = '';
      if (bannerImage) {
        // Upload banner image to Firebase Storage
        const storage = getStorage();
        const storageRef = ref(storage, `banners/${bannerImage.name}`);
        await uploadBytes(storageRef, bannerImage);
        // Get banner image URL
        bannerImageUrl = await getDownloadURL(storageRef);
      }

      if (bannerEditId) {
        // Update existing banner
        const bannerDocRef = doc(db, 'beststore banners', bannerEditId);
        await updateDoc(bannerDocRef, {  bannerImageUrl });
        toast.success('Banner updated successfully!');
      } else {
        // Add new banner
        const bannersCollectionRef = collection(db, 'beststore banners');
        await addDoc(bannersCollectionRef, {  bannerImageUrl });
        toast.success('Banner added successfully!');
      }

      // Clear form
      
      setBannerImage(null);
      setBannerEditId(null);
      setIsBannerOpen(false);
      fetchBanners();
    } catch (error) {
      console.error('Error adding/updating banner: ', error);
      toast.error('Failed to add/update banner. Please try again.');
    }
  };

  const handleBannerEdit = (banner) => {
 
    setBannerImage(banner.bannerImageUrl); // Optional: Handle image preview or URL
    setBannerEditId(banner.id);
    setIsBannerOpen(true);
  };

  const handleBannerDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'beststore banners', id));
      toast.success('Banner deleted successfully!');
      fetchBanners();
    } catch (error) {
      console.error('Error deleting banner: ', error);
      toast.error('Failed to delete banner. Please try again.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-auto p-4 bg-green-100">
      <div className="w-full max-w-4xl p-8 bg-white rounded-lg shadow-lg">
        <button
          className="px-4 py-2 mb-4 ml-4 mr-4 font-bold text-white bg-green-500 rounded hover:bg-green-700 focus:outline-none focus:shadow-outline"
          onClick={() => setIsOpen(true)}
        >
          Add Store
        </button>
        <button
          className="px-4 py-2 mb-4 mr-4 font-bold text-white bg-green-500 rounded hover:bg-green-700 focus:outline-none focus:shadow-outline"
          onClick={() => setItemIsOpen(true)}
        >
          Add coupons
        </button>
        <button
          className="px-4 py-2 mb-4 mr-4 font-bold text-white bg-blue-500 rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline"
          onClick={() => setFeaturedIsOpen(true)}
        >
          Add featured store
        </button>
        <button
          className="px-4 py-2 mb-4 mr-4 font-bold text-white bg-purple-500 rounded hover:bg-purple-700 focus:outline-none focus:shadow-outline"
          onClick={() => setBlogIsOpen(true)}
        >
          Add Blog
        </button>

        <button
          className="px-4 py-2 mb-4 mr-4 font-bold text-white bg-blue-500 rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline"
          onClick={() => setIsBannerOpen(true)}
        >
          Add Banner
        </button>
        <button
          className="px-4 py-2 mb-4 mr-4 font-bold text-white bg-blue-500 rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline"
          onClick={() => setAdIsOpen(true)}
        >
          Add ads
        </button>

        <h2 className="mt-8 mb-4 text-2xl font-bold text-center">Banners List</h2>

<div className="overflow-x-auto">
  <table className="w-full border table-auto">
    <thead>
      <tr className='border-b'>
       
        <th className="px-4 py-2">Image</th>
        <th className="px-4 py-2">Actions</th>
      </tr>
    </thead>
    <tbody>
      {banners.map((banner) => (
        <tr key={banner.id}>
          
          <td className="px-4 py-2 border-b">
            {banner.bannerImageUrl && (
              <img src={banner.bannerImageUrl} alt={banner.title} className="w-auto h-10 " />
            )}
          </td>
          <td className="px-4 py-2 border-b">
            <button
              onClick={() => handleBannerEdit(banner)}
              className="px-4 py-2 mr-2 font-bold text-white bg-yellow-500 rounded hover:bg-yellow-700 focus:outline-none focus:shadow-outline"
            >
              Edit
            </button>
            <button
              onClick={() => handleBannerDelete(banner.id)}
              className="px-4 py-2 font-bold text-white bg-red-500 rounded hover:bg-red-700 focus:outline-none focus:shadow-outline"
            >
              Delete
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

        <h2 className="mb-4 text-2xl font-bold text-center">Best Stores List</h2>

        {/* Filters */}
        <div className="mb-6">
          <h3 className="text-lg font-bold">Filter Stores</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Min Offers</label>
              <input
                type="number"
                value={minOffers}
                onChange={(e) => setMinOffers(e.target.value)}
                className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Max Offers</label>
              <input
                type="number"
                value={maxOffers}
                onChange={(e) => setMaxOffers(e.target.value)}
                className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Min Coupons</label>
              <input
                type="number"
                value={minCoupons}
                onChange={(e) => setMinCoupons(e.target.value)}
                className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Max Coupons</label>
              <input
                type="number"
                value={maxCoupons}
                onChange={(e) => setMaxCoupons(e.target.value)}
                className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border table-auto">
            <thead>
              <tr className='border-b'>
                <th className="px-4 py-2">No of offers</th>
                <th className="px-4 py-2">No of coupons</th>
                <th className="px-4 py-2">Image</th>
                <th className="px-4 py-2"> Name</th>
                <th className="px-4 py-2">Banner Image</th>
                <th className="px-4 py-2">Category</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {stores.map((store) => (
                <tr key={store.id}>
                  <td className="px-4 py-2 font-bold border-b">{store.title}</td>
                  <td className="px-4 py-2 font-bold border-b">{store.discount}</td>
                  <td className="px-4 py-2 border-b">
                    {store.imageUrl && (
                      <img src={store.imageUrl} alt={store.name} className="w-auto h-10 " />
                    )}
                  </td>
                  <td className="px-4 py-2 font-bold border-b">{store.name}</td>
                  <td className="px-4 py-2 border-b">
                    {store.bannerimgUrl && (
                      <img src={store.bannerimgUrl} alt={store.name} className="w-auto h-10 " />
                    )}
                  </td>
                  <td className="px-4 py-2 font-bold border-b">{store.category}</td>
                  <td className="px-4 py-2 border-b">
                    <button
                      onClick={() => handleEdit(store)}
                      className="px-4 py-2 mr-2 font-bold text-white bg-yellow-500 rounded hover:bg-yellow-700 focus:outline-none focus:shadow-outline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(store.id)}
                      className="px-4 py-2 font-bold text-white bg-red-500 rounded hover:bg-red-700 focus:outline-none focus:shadow-outline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <h2 className="mt-8 mb-4 text-2xl font-bold text-center">coupons</h2>
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
              <td className="px-4 py-2">{item.itemname}</td>
              <td className="px-4 py-2">{item.itemdiscount}</td>
              <td className="px-4 py-2">{item.itemdescription}</td>
              <td className="px-4 py-2">{item.itemdiscounttext}</td>
              <td className="px-4 py-2">
                {item.imageUrl && <img src={item.imageUrl} alt={item.itemname} className="object-cover w-16 h-16" />}
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

        <h2 className="mt-8 mb-4 text-2xl font-bold text-center">Featured store</h2>
        <div className="mb-10 overflow-x-auto">
  <table className="w-full border table-auto">
    <thead>
      <tr className='border-b'>
        <th className="px-4 py-2">Image</th>
        <th className="px-4 py-2">Title</th>
        <th className="px-4 py-2">Offers</th>
        <th className="px-4 py-2">Coupons</th>
        <th className="px-4 py-2">bannerImage</th>
        <th className="px-4 py-2">Actions</th>
      </tr>
    </thead>
    <tbody>
      {featuredstore.map((store) => (
        <tr key={store.id}>
          <td>
            <img
              src={store.imageUrl}
              alt="Store"
              className="object-cover w-16 h-16"
            />
          </td>
          <td className="px-4 py-2">{store.title}</td>
          <td className="px-4 py-2">{store.offers}</td>
          <td className="px-4 py-2">{store.coupons}</td>
          <td >
          <img
              src={store.bannerimgUrl}
              alt="Store"
              className="object-cover w-16 h-16"
            />
          </td>
          <td className="px-4 py-2">
            <button
              className="px-2 py-1 text-white bg-yellow-500 rounded hover:bg-yellow-700"
              onClick={() => handlefeaturedstoreEdit(store)}
            >
              Edit
            </button>
            <button
              className="px-2 py-1 text-white bg-red-500 rounded hover:bg-red-700"
              onClick={() => handlefeaturedstoreDelete(store.id)}
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


      <Transition appear show={itemisOpen} as={React.Fragment}>
        <Dialog as="div" open={itemisOpen} onClose={() => setItemIsOpen(false)} className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen p-4 text-center">
            <Dialog.Panel className="max-w-lg p-6 mx-auto bg-white rounded shadow-lg">
              <Dialog.Title as="h3" className="text-lg font-bold">Item Form</Dialog.Title>
              <button className="absolute top-2 right-2" onClick={() => setItemIsOpen(false)}>
                <XIcon className="w-6 h-6 text-gray-500" />
              </button>
              <form onSubmit={handleItemSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    value={itemname}
                    onChange={(e) => setItemName(e.target.value)}
                    className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Discount</label>
                  <input
                    type="text"
                    value={itemdiscount}
                    onChange={(e) => setItemDiscount(e.target.value)}
                    className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <input
                    type="text"
                    value={itemdescription}
                    onChange={(e) => setItemDescription(e.target.value)}
                    className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Discount text</label>
                  <input
                    type="text"
                    value={itemdiscounttext}
                    onChange={(e) => setItemDiscountText(e.target.value)}
                    className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Image</label>
                  <input
                    type="file"
                    onChange={(e) => setItemImage(e.target.files[0])}
                    className="block w-full text-sm text-gray-500 border border-gray-300 rounded-md cursor-pointer focus:outline-none"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Link</label>
                  <input
                    type="text"
                    value={itemlink}
                    onChange={(e) => setItemLink(e.target.value)}
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
      <Transition show={featuredIsOpen} as={React.Fragment}>
  <Dialog as="div" open={featuredIsOpen} onClose={() => setFeaturedIsOpen(false)}>
    <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
    <div className="fixed inset-0 flex items-center justify-center p-4">
      <Dialog.Panel className="max-w-lg p-6 mx-auto bg-white rounded shadow-lg">
        <Dialog.Title className="text-lg font-bold">Add / Edit Store</Dialog.Title>
        <button
          type="button"
          onClick={() => setFeaturedIsOpen(false)}
          className="absolute text-gray-500 top-4 right-4 hover:text-gray-700"
        >
          <XIcon className="w-6 h-6" />
        </button>
        <form onSubmit={handlefeaturedstoreSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              value={featuredtitle}
              onChange={(e) => setFeaturedTitle(e.target.value)}
              className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Offers</label>
            <input
              type="text"
              value={offers}
              onChange={(e) => setOffers(e.target.value)}
              className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Coupons</label>
            <input
              type="number"
              value={coupons}
              onChange={(e) => setCoupons(e.target.value)}
              className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
              required
            />
          </div>
         
          {/* <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Banner Description</label>
            <input
              type="text"
              value={featureddescription}
              onChange={(e) => setDescription(e.target.value)}
              className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
              required
            />
          </div> */}
         
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Image</label>
            <input
              type="file"
              onChange={(e) => setFeaturedimg(e.target.files[0])}
              className="block w-full text-sm text-gray-500 border border-gray-300 rounded-md cursor-pointer focus:outline-none focus:ring-green-500 focus:border-green-500"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 font-bold text-white bg-green-500 rounded hover:bg-green-700 focus:outline-none focus:shadow-outline"
            >
              {editId ? 'Update featured store' : 'Add Store'}
            </button>
          </div>
        </form>
      </Dialog.Panel>
    </div>
  </Dialog>
</Transition>
     {/* Modal for adding or editing store */}
<Transition show={isOpen} as={React.Fragment}>
  <Dialog as="div" open={isOpen} onClose={() => setIsOpen(false)}>
    <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
    <div className="fixed inset-0 flex items-center justify-center p-4 mt-20">
      <Dialog.Panel className="max-w-lg p-6 mx-auto bg-white rounded shadow-lg">
        <Dialog.Title className="text-lg font-bold">Add / Edit Store</Dialog.Title>
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="absolute text-gray-500 top-4 right-4 hover:text-gray-700"
        >
          <XIcon className="w-6 h-6" />
        </button>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Offers</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Coupons</label>
            <input
              type="number"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
              className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Banner Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Banner Image</label>
            <input
              type="file"
              onChange={(e) => setBannerimg(e.target.files[0])}
              className="block w-full text-sm text-gray-500 border border-gray-300 rounded-md cursor-pointer focus:outline-none focus:ring-green-500 focus:border-green-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Categories</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
              required
            >
              <option value="">Select Category</option>
              <option value="Mobile">Mobile</option>
              <option value="Electronics">Electronics</option>
              <option value="Footwear">Footwear</option>
              <option value="Fashion">Fashion</option>
              <option value="Beauty">Beauty</option>
              <option value="Baby & kids">Baby & kids</option>
              <option value="Health & Fitness">Health & Fitness</option>
              <option value="Home & kitchen">Home & kitchen</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Image</label>
            <input
              type="file"
              onChange={(e) => setImage(e.target.files[0])}
              className="block w-full text-sm text-gray-500 border border-gray-300 rounded-md cursor-pointer focus:outline-none focus:ring-green-500 focus:border-green-500"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 font-bold text-white bg-green-500 rounded hover:bg-green-700 focus:outline-none focus:shadow-outline"
            >
              {editId ? 'Update Store' : 'Add Store'}
            </button>
          </div>
        </form>
      </Dialog.Panel>
    </div>
  </Dialog>
</Transition>


      {/* Modal for adding or editing banner */}
      <Transition show={isBannerOpen} as={React.Fragment}>
        <Dialog as="div" open={isBannerOpen} onClose={() => setIsBannerOpen(false)}>
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="max-w-lg p-6 mx-auto bg-white rounded shadow-lg">
              <Dialog.Title className="text-lg font-bold">Add / Edit Banner</Dialog.Title>
              <button
                type="button"
                onClick={() => setIsBannerOpen(false)}
                className="absolute text-gray-500 top-4 right-4 hover:text-gray-700"
              >
                <XIcon className="w-6 h-6" />
              </button>
              <form onSubmit={handleBannerSubmit}>
              
               
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Image</label>
                  <input
                    type="file"
                    onChange={(e) => setBannerImage(e.target.files[0])}
                    className="block w-full text-sm text-gray-500 border border-gray-300 rounded-md cursor-pointer focus:outline-none focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline"
                  >
                  Add Banner
                  </button>
                </div>
              </form>
            </Dialog.Panel>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default BeststoresForm;
