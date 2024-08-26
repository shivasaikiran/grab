import React, { useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { AiOutlineClose } from 'react-icons/ai';
import { db } from '@/Firebase/Config';
import { addDoc, collection, getDocs, updateDoc, deleteDoc, doc, query, where } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { toast } from 'react-toastify';

const FlashsaleForm = () => {
  const [discount, setDiscount] = useState('');
  const [link, setLink] = useState('');
  const [timer, setTimer] = useState('');
  const [logo, setLogo] = useState(null);
  const [image, setImage] = useState(null);
  const [deals, setDeals] = useState([]);
  const [editId, setEditId] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [minDiscount, setMinDiscount] = useState(''); // Min discount filter
  const [maxDiscount, setMaxDiscount] = useState(''); // Max discount filter

  useEffect(() => {
    fetchDeals();
  }, [minDiscount, maxDiscount]); // Fetch deals when filter values change

  const fetchDeals = async () => {
    const dealsCollectionRef = collection(db, 'Flashsales');
    let dealsQuery = query(dealsCollectionRef);

    // Apply discount filter if set
    if (minDiscount || maxDiscount) {
      if (minDiscount) {
        dealsQuery = query(dealsQuery, where('discount', '>=', parseFloat(minDiscount) || 0));
      }
      if (maxDiscount) {
        dealsQuery = query(dealsQuery, where('discount', '<=', parseFloat(maxDiscount) || Number.MAX_VALUE));
      }
    }

    try {
      const dealsSnapshot = await getDocs(dealsQuery);
      const dealsList = dealsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setDeals(dealsList);
    } catch (error) {
      console.error('Error fetching deals: ', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let logoUrl = '';
      let imageUrl = '';
      const storage = getStorage();

      if (logo) {
        const logoRef = ref(storage, `logos/${logo.name}`);
        await uploadBytes(logoRef, logo);
        logoUrl = await getDownloadURL(logoRef);
      }

      if (image) {
        const imageRef = ref(storage, `images/${image.name}`);
        await uploadBytes(imageRef, image);
        imageUrl = await getDownloadURL(imageRef);
      }

      if (editId) {
        // Update existing deal
        const dealDocRef = doc(db, 'Flashsales', editId);
        await updateDoc(dealDocRef, { timer, discount, logo: logoUrl, imageUrl,link });
        toast.success('Deal updated successfully!');
      } else {
        // Add new deal
        const dealsCollectionRef = collection(db, 'Flashsales');
        await addDoc(dealsCollectionRef, { timer, discount, logo: logoUrl, imageUrl,link });
        toast.success('Deal added successfully!');
      }

      // Clear form
      setTimer('');
      setDiscount('');
      setLink('');
      setLogo(null);
      setImage(null);
      setEditId(null);
      setIsOpen(false);
      fetchDeals();
    } catch (error) {
      console.error('Error adding/updating document: ', error);
      toast.error('Failed to add/update deal. Please try again.');
    }
  };

  const handleEdit = (deal) => {
    setTimer(deal.timer);
    setDiscount(deal.discount);
    setLink(deal.link)
    setLogo(deal.logo ? { name: 'logo', url: deal.logo } : null); // Optional: Handle image preview or URL
    setImage(deal.imageUrl ? { name: 'image', url: deal.imageUrl } : null); // Optional: Handle image preview or URL
    setEditId(deal.id);
    setIsOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'Flashsales', id));
      toast.success('Deal deleted successfully!');
      fetchDeals();
    } catch (error) {
      console.error('Error deleting document: ', error);
      toast.error('Failed to delete deal. Please try again.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-auto p-4 bg-green-100">
      <div className="w-full max-w-4xl p-8 bg-white rounded-lg shadow-lg">
        <button
          className="px-4 py-2 mb-4 font-bold text-white bg-green-500 rounded hover:bg-green-700 focus:outline-none focus:shadow-outline"
          onClick={() => setIsOpen(true)}
        >
          {editId ? 'Edit Flash Sale' : 'Add Flash Sale'}
        </button>

        <h2 className="mb-4 text-2xl font-bold text-center">Flash Sale List</h2>

        {/* Filter Section */}
        <div className="mb-4">
          <h3 className="text-xl font-bold">Filter Deals</h3>
          <div className="flex gap-4 mb-4">
            <div>
              <label className="block mb-2 text-sm font-bold text-gray-700">Min Discount</label>
              <input
                className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                type="number"
                value={minDiscount}
                onChange={(e) => setMinDiscount(e.target.value)}
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-bold text-gray-700">Max Discount</label>
              <input
                className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                type="number"
                value={maxDiscount}
                onChange={(e) => setMaxDiscount(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border table-auto">
            <thead>
              <tr className='border-b'>
                <th className="px-4 py-2">Timer</th>
                <th className="px-4 py-2">Discount</th>
                <th className="px-4 py-2">Logo</th>
                <th className="px-4 py-2">Image</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {deals.map((deal) => (
                <tr key={deal.id}>
                  <td className="px-4 py-2 font-bold border-b">{deal.timer}</td>
                  <td className="px-4 py-2 font-bold border-b">{deal.discount}</td>
                  <td className="px-4 py-2 border-b">
                    {deal.logo && (
                      <img src={deal.logo} alt="Logo" className="object-cover w-auto h-10" />
                    )}
                  </td>
                  <td className="px-4 py-2 border-b">
                    {deal.imageUrl && (
                      <img src={deal.imageUrl} alt="Deal" className="object-cover w-20 h-20" />
                    )}
                  </td>
                  <td className="px-4 py-2 border-b">
                    <button
                      className="px-2 py-1 font-bold text-white bg-yellow-500 rounded hover:bg-yellow-700 focus:outline-none focus:shadow-outline"
                      onClick={() => handleEdit(deal)}
                    >
                      Edit
                    </button>
                    <button
                      className="px-2 py-1 ml-2 font-bold text-white bg-red-500 rounded hover:bg-red-700 focus:outline-none focus:shadow-outline"
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

      {/* Modal for Add/Edit */}
      <Transition appear show={isOpen} as={React.Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => setIsOpen(false)}>
          <Transition.Child
            as={React.Fragment}
            enter="transition-opacity ease-in duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-in duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
          </Transition.Child>

          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Transition.Child
              as={React.Fragment}
              enter="transition-transform ease-in duration-300"
              enterFrom="translate-y-4 opacity-0"
              enterTo="translate-y-0 opacity-100"
              leave="transition-transform ease-in duration-300"
              leaveFrom="translate-y-0 opacity-100"
              leaveTo="translate-y-4 opacity-0"
            >
              <Dialog.Panel className="w-full max-w-md p-6 mx-auto bg-white rounded shadow">
                <div className="flex justify-between mt-10 mb-4">
                  <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                    {editId ? 'Edit Flash Sale' : 'Add Flash Sale'}
                  </Dialog.Title>
                  <button
                    type="button"
                    className="text-gray-500 hover:text-gray-700"
                    onClick={() => setIsOpen(false)}
                  >
                    <AiOutlineClose size={24} />
                  </button>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label className="block mb-2 text-sm font-bold text-gray-700">Timer</label>
                    <input
                      className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                      type="text"
                      value={timer}
                      onChange={(e) => setTimer(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block mb-2 text-sm font-bold text-gray-700">Discount</label>
                    <input
                      className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                      type="number"
                      value={discount}
                      onChange={(e) => setDiscount(e.target.value)}
                      required
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
                    <label className="block mb-2 text-sm font-bold text-gray-700">Link</label>
                    <input
                      className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                      type="text"
                      value={link}
                      onChange={(e) => setLink(e.target.value)}
                      required
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-4 py-2 font-bold text-white bg-green-500 rounded hover:bg-green-700 focus:outline-none focus:shadow-outline"
                    >
                      {editId ? 'Update Deal' : 'Add Deal'}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default FlashsaleForm;
