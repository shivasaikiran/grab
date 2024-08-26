import React, { useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { db } from '@/Firebase/Config';
import { addDoc, collection, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { toast } from 'react-toastify';
import { XIcon } from '@heroicons/react/solid';

const TodaydealsForm = () => {
  const [title, setTitle] = useState('');
  const [discount, setDiscount] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState(null);
  const [discountprice, setDiscountprice] = useState('');
  const [link, setLink] = useState('');
  const [deals, setDeals] = useState([]);
  const [editId, setEditId] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  
  // Search and Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [minDiscount, setMinDiscount] = useState('');
  const [maxDiscount, setMaxDiscount] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [logo, setLogo] = useState(null);


  useEffect(() => {
    fetchDeals();
  }, [searchTerm, minDiscount, maxDiscount, minPrice, maxPrice]);

  const fetchDeals = async () => {
    const dealsCollectionRef = collection(db, 'todaydeals');
    const dealsSnapshot = await getDocs(dealsCollectionRef);
    const dealsList = dealsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // Apply search and range filter logic
    const filteredDeals = dealsList.filter(deal => {
      const matchesSearch = deal.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDiscount = (minDiscount === '' || deal.discount >= minDiscount) && (maxDiscount === '' || deal.discount <= maxDiscount);
      const matchesPrice = (minPrice === '' || deal.price >= minPrice) && (maxPrice === '' || deal.price <= maxPrice);
      return matchesSearch && matchesDiscount && matchesPrice;
    });

    setDeals(filteredDeals);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      let imageUrl = '';
      let logoUrl = '';
  
      if (image) {
        // Upload image to Firebase Storage
        const storage = getStorage();
        const storageRef = ref(storage, `images/${image.name}`);
        await uploadBytes(storageRef, image);
        // Get image URL
        imageUrl = await getDownloadURL(storageRef);
      }
  
      if (logo) {
        const storage = getStorage();
        // Upload logo to Firebase Storage
        const logoStorageRef = ref(storage, `logos/${logo.name}`);
        await uploadBytes(logoStorageRef, logo);
        // Get logo URL
        logoUrl = await getDownloadURL(logoStorageRef);
      }
  
      if (editId) {
        // Update existing deal
        const dealDocRef = doc(db, 'todaydeals', editId);
        await updateDoc(dealDocRef, { title, discount, price, imageUrl, discountprice, link, logoUrl });
        toast.success('Product updated successfully!');
      } else {
        // Add new deal
        const dealsCollectionRef = collection(db, 'todaydeals');
        await addDoc(dealsCollectionRef, { title, discount, price, imageUrl, discountprice, link, logoUrl });
        toast.success('Product added successfully!');
      }
  
      // Clear form
      setTitle('');
      setDiscount('');
      setPrice('');
      setImage(null);
      setDiscountprice('');
      setLink('');
      setLogo(null);
      setEditId(null);
      setIsOpen(false);
      fetchDeals();
    } catch (error) {
      console.error('Error adding/updating document: ', error);
      toast.error('Failed to add/update deal. Please try again.');
    }
  };
  

  const handleEdit = (deal) => {
    setTitle(deal.title);
    setDiscount(deal.discount);
    setPrice(deal.price);
    setDiscountprice(deal.discountprice);
    setLink(deal.link);
    setEditId(deal.id);
    setIsOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'todaydeals', id));
      toast.success('Product deleted successfully!');
      fetchDeals();
    } catch (error) {
      console.error('Error deleting document: ', error);
      toast.error('Failed to delete deal. Please try again.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full p-4 bg-green-100">
      <div className="w-full max-w-4xl p-8 bg-white rounded-lg shadow-lg">
        <button
          className="px-4 py-2 mb-4 font-bold text-white bg-green-500 rounded hover:bg-green-700 focus:outline-none focus:shadow-outline"
          onClick={() => setIsOpen(true)}
        >
          Add Product
        </button>

        <h2 className="mb-4 text-2xl font-bold text-center">Deals List</h2>

        {/* Search and Range Inputs */}
        <div className="flex flex-col mb-4 md:flex-row md:items-center md:justify-between">
          <input
            className="w-full px-3 py-2 mb-2 border rounded shadow appearance-none md:mb-0 md:mr-2 focus:outline-none focus:shadow-outline"
            type="text"
            placeholder="Search by title"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-4 md:mb-0 md:mr-2">
              {/* <label className="block text-sm font-medium text-gray-700">Discount Range</label> */}
              <div className="flex">
                <input
                  type="number"
                  placeholder="Min Discount"
                  value={minDiscount}
                  onChange={(e) => setMinDiscount(e.target.value)}
                  className="w-1/2 px-3 py-2 border border-gray-300 shadow-sm rounded-l-md focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                />
                <input
                  type="number"
                  placeholder="Max Discount"
                  value={maxDiscount}
                  onChange={(e) => setMaxDiscount(e.target.value)}
                  className="w-1/2 px-3 py-2 border border-gray-300 shadow-sm rounded-r-md focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                />
              </div>
            </div>
            <div className="mb-4 md:mb-0 md:ml-2">
              {/* <label className="block text-sm font-medium text-gray-700">Price Range</label> */}
              <div className="flex">
                <input
                  type="number"
                  placeholder="Min Price"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-1/2 px-3 py-2 border border-gray-300 shadow-sm rounded-l-md focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                />
                <input
                  type="number"
                  placeholder="Max Price"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-1/2 px-3 py-2 border border-gray-300 shadow-sm rounded-r-md focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border table-auto">
            <thead>
              <tr className='border-b'>
                <th className="px-4 py-2">Title</th>
                <th className="px-4 py-2">Discount</th>
                <th className="px-4 py-2">Price</th>
                <th className="px-4 py-2">Discount Price</th>
                <th className="px-4 py-2">Image</th>
                <th className="px-4 py-2">Logo</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {deals.map((deal) => (
                <tr key={deal.id}>
                  <td className="px-4 py-2 font-bold border-b">{deal.title}</td>
                  <td className="px-4 py-2 font-bold border-b">{deal.discount}%</td>
                  <td className="px-4 py-2 font-bold border-b">${deal.price}</td>
                  <td className="px-4 py-2 font-bold border-b">${deal.discountprice}</td>
                  <td className="px-4 py-2 border-b">
                    {deal.imageUrl && (
                      <img src={deal.imageUrl} alt={deal.title} className="object-cover w-20 h-20" />
                    )}
                  </td>
                  <td className="px-4 py-2 border-b">
  {deal.logoUrl && (
    <img src={deal.logoUrl} alt="Logo" className="w-20 h-10 " />
  )}
</td>

                  <td className="px-4 py-2 border-b">
                    <button
                      className="px-2 py-1 mr-4 text-white bg-blue-500 rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline"
                      onClick={() => handleEdit(deal)}
                    >
                      Edit
                    </button>
                    <button
                      className="px-2 py-1 text-white bg-red-500 rounded hover:bg-red-700 focus:outline-none focus:shadow-outline"
                      onClick={() => handleDelete(deal.id)}
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

      {/* Add/Edit Product Modal */}
      <Transition show={isOpen} as={React.Fragment}>
  <Dialog as="div" onClose={() => setIsOpen(false)}>
    <Transition.Child
      as={React.Fragment}
      enter="ease-out duration-300"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="ease-in duration-200"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75" />
    </Transition.Child>
    <div className="fixed inset-0 flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg p-8 bg-white rounded-lg shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-end mt-9">
          <button
            className="text-gray-400 hover:text-gray-600"
            onClick={() => setIsOpen(false)}
          >
            <XIcon className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            {editId ? 'Edit Product' : 'Add Product'}
          </h3>
          <div className="mt-10">
            {/* Form Fields */}
            <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Title</label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Discount (%)</label>
                    <input
                      type="number"
                      value={discount}
                      onChange={(e) => setDiscount(e.target.value)}
                      className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Price</label>
                    <input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Discount Price</label>
                    <input
                      type="number"
                      value={discountprice}
                      onChange={(e) => setDiscountprice(e.target.value)}
                      className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Image</label>
                    <input
                      type="file"
                      onChange={(e) => setImage(e.target.files[0])}
                      className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    />
                  </div>
                  <div className="mb-4">
  <label className="block text-sm font-medium text-gray-700">Logo</label>
  <input
    type="file"
    onChange={(e) => setLogo(e.target.files[0])}
    className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
  />
</div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Link</label>
                    <input
                      type="text"
                      value={link}
                      onChange={(e) => setLink(e.target.value)}
                      className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    />
                  </div>
            <div className="flex items-center justify-between">
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-green-500 border border-transparent rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                {editId ? 'Update Product' : 'Add Product'}
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-red-500 border border-transparent rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </Dialog>
</Transition>

    </div>
  );
};

export default TodaydealsForm;
