import React, { useState, useEffect, Fragment } from 'react';
import { db } from '@/Firebase/Config';
import { addDoc, collection, getDocs, doc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { toast } from 'react-toastify';
import { Dialog, Transition } from '@headlessui/react';
import { XIcon } from '@heroicons/react/solid';

const PopularOffersForm = () => {
  const [title, setTitle] = useState('');
  
  const [discount, setDiscount] = useState('');
  const [price, setPrice] = useState('');
  const [discountprice, setDiscountprice] = useState('');
  const [link, setLink] = useState('');
  const [image, setImage] = useState(null);
  const [logo, setLogo] = useState(null);
  const [offers, setOffers] = useState([]);
  const [filteredOffers, setFilteredOffers] = useState([]);
  const [editId, setEditId] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [filterTitle, setFilterTitle] = useState('');
  const [minDiscount, setMinDiscount] = useState('');
  const [maxDiscount, setMaxDiscount] = useState('');

  useEffect(() => {
    fetchOffers();
  }, [filterTitle, minDiscount, maxDiscount]);

  const fetchOffers = async () => {
    try {
      const offersCollectionRef = collection(db, 'popularOffers');

      // Apply filters if specified
      let q = offersCollectionRef;
      if (filterTitle) {
        q = query(q, where('title', '>=', filterTitle));
      }
      if (minDiscount) {
        q = query(q, where('discount', '>=', parseFloat(minDiscount)));
      }
      if (maxDiscount) {
        q = query(q, where('discount', '<=', parseFloat(maxDiscount)));
      }

      const offersSnapshot = await getDocs(q);
      const offersList = offersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setOffers(offersList);
      setFilteredOffers(offersList); // Initialize filtered offers
    } catch (error) {
      console.error('Error fetching offers: ', error);
      toast.error('Failed to fetch offers. Please try again.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let imageUrl = '';
      let logoUrl = '';

      if (image) {
        // Upload main image to Firebase Storage
        const storage = getStorage();
        const imageRef = ref(storage, `images/${image.name}`);
        await uploadBytes(imageRef, image);
        imageUrl = await getDownloadURL(imageRef);
      }

      if (logo) {
        // Upload logo to Firebase Storage
        const storage = getStorage();
        const logoRef = ref(storage, `logos/${logo.name}`);
        await uploadBytes(logoRef, logo);
        logoUrl = await getDownloadURL(logoRef);
      }

      if (editId) {
        // Update existing offer
        const offerDocRef = doc(db, 'popularOffers', editId);
        await updateDoc(offerDocRef, { title, discount, price, discountprice, imageUrl, logoUrl, link });
        toast.success('Popular offer updated successfully!');
      } else {
        // Add new offer
        const offersCollectionRef = collection(db, 'popularOffers');
        await addDoc(offersCollectionRef, { title, discount, price, discountprice, imageUrl, logoUrl, link });
        toast.success('Popular offer added successfully!');
      }

      // Clear form and fetch updated offers
      setTitle('');
      setDiscount('');
      setPrice('');
      setDiscountprice('');
      setLink('');
      setImage(null);
      setLogo(null);
      setEditId(null);
      setIsOpen(false);
      fetchOffers();
    } catch (error) {
      console.error('Error adding/updating document: ', error);
      toast.error('Failed to add/update popular offer. Please try again.');
    }
  };

  const handleEdit = (offer) => {
    setTitle(offer.title);
    setDiscount(offer.discount);
    setPrice(offer.price);
    setDiscountprice(offer.discountprice);
    setLink(offer.link);
    setImage(null); // Handle image preview or URL if needed
    setLogo(null); // Handle logo preview or URL if needed
    setEditId(offer.id);
    setIsOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'popularOffers', id));
      toast.success('Popular offer deleted successfully!');
      fetchOffers();
    } catch (error) {
      console.error('Error deleting document: ', error);
      toast.error('Failed to delete popular offer. Please try again.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-auto p-4 bg-green-100">
      <div className="w-full max-w-4xl p-8 bg-white rounded-lg shadow-lg">
        <button
          className="px-4 py-2 mb-4 font-bold text-white bg-green-500 rounded hover:bg-green-700 focus:outline-none focus:shadow-outline"
          onClick={() => setIsOpen(true)}
        >
          Add Popular Offer
        </button>

        <h2 className="mb-4 text-2xl font-bold text-center">Popular Offers List</h2>

        {/* Filters */}
        <div className="mb-4">
          <label className="block mb-2 text-sm font-bold text-gray-700">Filter by Title</label>
          <input
            className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
            type="text"
            value={filterTitle}
            onChange={(e) => setFilterTitle(e.target.value)}
          />
        </div>
        <div className="flex mb-4 space-x-4">
          <div className="w-1/2">
            <label className="block mb-2 text-sm font-bold text-gray-700">Min Discount</label>
            <input
              className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
              type="number"
              value={minDiscount}
              onChange={(e) => setMinDiscount(e.target.value)}
            />
          </div>
          <div className="w-1/2">
            <label className="block mb-2 text-sm font-bold text-gray-700">Max Discount</label>
            <input
              className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
              type="number"
              value={maxDiscount}
              onChange={(e) => setMaxDiscount(e.target.value)}
            />
          </div>
        </div>

        <table className="w-full bg-white border border-gray-200 rounded-lg shadow-md">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">Title</th>
              <th className="px-4 py-2 text-left">Discount</th>
              <th className="px-4 py-2 text-left">Price</th>
              <th className="px-4 py-2 text-left">Discount Price</th>
              <th className="px-4 py-2 text-left">Image</th>
              <th className="px-4 py-2 text-left">Logo</th>
              {/* <th className="px-4 py-2 text-left">Link</th> */}
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOffers.map((offer) => (
              <tr key={offer.id}>
                <td className="px-4 py-2 border-b">{offer.title}</td>
                <td className="px-4 py-2 border-b">{offer.discount}</td>
                <td className="px-4 py-2 border-b">{offer.price}</td>
                <td className="px-4 py-2 border-b">{offer.discountprice}</td>
                <td className="px-4 py-2 border-b">
                  {offer.imageUrl && (
                    <img src={offer.imageUrl} alt={offer.title} className="w-20 h-10" />
                  )}
                </td>
                <td className="px-4 py-2 border-b">
                  {offer.logoUrl && (
                    <img src={offer.logoUrl} alt={offer.title} className="w-20 h-10" />
                  )}
                </td>
                {/* <td className="px-4 py-2 border-b">{offer.link}</td> */}
                <td className="px-4 py-2 border-b">
                  <button
                    className="px-2 py-1 text-white bg-blue-500 rounded hover:bg-blue-700"
                    onClick={() => handleEdit(offer)}
                  >
                    Edit
                  </button>
                  <button
                    className="px-2 py-1 ml-2 text-white bg-red-500 rounded hover:bg-red-700"
                    onClick={() => handleDelete(offer.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Offer Modal */}
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="fixed inset-0 z-10 overflow-y-auto" onClose={() => setIsOpen(false)}>
          <div className="min-h-screen px-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="transform scale-95 opacity-0"
              enterTo="transform scale-100 opacity-100"
              leave="ease-in duration-200"
              leaveFrom="transform scale-100 opacity-100"
              leaveTo="transform scale-95 opacity-0"
            >
              <div className="inline-block w-full max-w-lg p-6 my-8 mt-24 overflow-hidden text-left align-middle transition-all transform bg-white rounded shadow-xl">
                <button
                  type="button"
                  className="absolute text-gray-500 top-2 right-2 hover:text-gray-700"
                  onClick={() => setIsOpen(false)}
                >
                  <XIcon className="w-6 h-6" />
                </button>
                <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                  {editId ? 'Edit Popular Offer' : 'Add Popular Offer'}
                </Dialog.Title>
                <div className="mt-2">
                  <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                      <label className="block mb-2 text-sm font-bold text-gray-700">Title</label>
                      <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block mb-2 text-sm font-bold text-gray-700">Discount</label>
                      <input
                        type="number"
                        value={discount}
                        onChange={(e) => setDiscount(e.target.value)}
                        className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block mb-2 text-sm font-bold text-gray-700">Price</label>
                      <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block mb-2 text-sm font-bold text-gray-700">Discount Price</label>
                      <input
                        type="number"
                        value={discountprice}
                        onChange={(e) => setDiscountprice(e.target.value)}
                        className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block mb-2 text-sm font-bold text-gray-700">Link</label>
                      <input
                        type="text"
                        value={link}
                        onChange={(e) => setLink(e.target.value)}
                        className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block mb-2 text-sm font-bold text-gray-700">Image</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setImage(e.target.files[0])}
                        className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block mb-2 text-sm font-bold text-gray-700">Logo</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setLogo(e.target.files[0])}
                        className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <button
                        type="submit"
                        className="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-700 focus:outline-none focus:shadow-outline"
                      >
                        {editId ? 'Update' : 'Add'}
                      </button>
                      <button
                        type="button"
                        className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-700 focus:outline-none focus:shadow-outline"
                        onClick={() => setIsOpen(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default PopularOffersForm;
