import React, { useState, useEffect, Fragment } from 'react';
import { db } from '@/Firebase/Config';
import { addDoc, collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { toast } from 'react-toastify';
import { Dialog, Transition } from '@headlessui/react';
import { XIcon } from '@heroicons/react/solid';

const CouponsForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [discount, setDiscount] = useState('');
  const [image, setImage] = useState(null);
  const [category, setCategory] = useState('mostused');
  const [link, setLink] = useState('');
  const [coupons, setCoupons] = useState([]);
  const [editId, setEditId] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    const couponsCollectionRef = collection(db, 'coupons');
    const couponsSnapshot = await getDocs(couponsCollectionRef);
    const couponsList = couponsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setCoupons(couponsList);
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

      if (editId) {
        // Update existing coupon
        const couponDocRef = doc(db, 'coupons', editId);
        await updateDoc(couponDocRef, { title, description, discount, imageUrl, category, link });
        toast.success('Coupon updated successfully!');
      } else {
        // Add new coupon
        const couponsCollectionRef = collection(db, 'coupons');
        await addDoc(couponsCollectionRef, { title, description, discount, imageUrl, category, link });
        toast.success('Coupon added successfully!');
      }

      // Clear form and fetch updated coupons
      setTitle('');
      setDescription('');
      setDiscount('');
      setImage(null);
      setCategory('mostused');
      setLink('');
      setEditId(null);
      setIsOpen(false);
      fetchCoupons();
    } catch (error) {
      console.error('Error adding/updating document: ', error);
      toast.error('Failed to add/update coupon. Please try again.');
    }
  };

  const handleEdit = (coupon) => {
    setTitle(coupon.title);
    setDescription(coupon.description);
    setDiscount(coupon.discount);
    setImage(coupon.imageUrl); // Optional: Handle image preview or URL
    setCategory(coupon.category);
    setLink(coupon.link);
    setEditId(coupon.id);
    setIsOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'coupons', id));
      toast.success('Coupon deleted successfully!');
      fetchCoupons();
    } catch (error) {
      console.error('Error deleting document: ', error);
      toast.error('Failed to delete coupon. Please try again.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-auto p-4 bg-green-100">
      <div className="w-full max-w-4xl p-8 bg-white rounded-lg shadow-lg">
        <button
          className="px-4 py-2 mb-4 font-bold text-white bg-green-500 rounded hover:bg-green-700 focus:outline-none focus:shadow-outline"
          onClick={() => setIsOpen(true)}
        >
          Add Coupon
        </button>

        <h2 className="mb-4 text-2xl font-bold text-center">Coupons List</h2>
        <div className="overflow-x-auto">
          <table className="w-full border table-auto">
            <thead>
              <tr className='border-b'>
                <th className="px-4 py-2">Title</th>
                <th className="px-4 py-2">Description</th>
                <th className="px-4 py-2">Discount</th>
                <th className="px-4 py-2">Category</th>
                {/* <th className="px-4 py-2">Link</th> */}
                <th className="px-4 py-2">Image</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map((coupon) => (
                <tr key={coupon.id}>
                  <td className="px-4 py-2 font-bold border-b">{coupon.title}</td>
                  <td className="px-4 py-2 font-bold border-b">{coupon.description}</td>
                  <td className="px-4 py-2 font-bold border-b">{coupon.discount}</td>
                  <td className="px-4 py-2 border-b">{coupon.category}</td>
                  {/* <td className="px-4 py-2 border-b">{coupon.link}</td> */}
                  <td className="px-4 py-2 border-b">
                    {coupon.imageUrl && (
                      <img src={coupon.imageUrl} alt={coupon.title} className="w-20 h-10" />
                    )}
                  </td>
                  <td className="flex px-4 py-2 border-">
                    <button
                      className="px-2 py-1 font-bold text-white bg-yellow-500 rounded hover:bg-yellow-700 focus:outline-none focus:shadow-outline"
                      onClick={() => handleEdit(coupon)}
                    >
                      Edit
                    </button>
                    <button
                      className="px-2 py-1 ml-2 font-bold text-white bg-red-500 rounded hover:bg-red-700 focus:outline-none focus:shadow-outline"
                      onClick={() => handleDelete(coupon.id)}
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
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => setIsOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex items-center justify-center min-h-full p-4 mt-20 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="relative w-full max-w-md p-6 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                  <button
                    type="button"
                    className="absolute top-3 right-3"
                    onClick={() => setIsOpen(false)}
                  >
                    <XIcon className="w-6 h-6 text-gray-500 hover:text-gray-800" />
                  </button>
                  <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                    {editId ? 'Edit Coupon' : 'Add Coupon'}
                  </Dialog.Title>
                  <form onSubmit={handleSubmit}>
                    <div className="mt-2">
                      <label className="block mb-2 text-sm font-bold text-gray-700">Title</label>
                      <textarea
                        className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                      />
                    </div>
                    <div className="mt-2">
                      <label className="block mb-2 text-sm font-bold text-gray-700">Description</label>
                      <textarea
                        className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                      />
                    </div>
                    <div className="mt-2">
                      <label className="block mb-2 text-sm font-bold text-gray-700">Discount</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                        value={discount}
                        onChange={(e) => setDiscount(e.target.value)}
                        required
                      />
                    </div>
                    <div className="mt-2">
                      <label className="block mb-2 text-sm font-bold text-gray-700">Category</label>
                      <select
                        className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        required
                      >
                       <option value="">All</option>
            
            <option value="Electronics">Electronics</option>
            <option value="Footware">Footware</option>
            <option value="Fashion">Fashion</option>
            <option value="Beauty">Beauty</option>
            <option value="Mobile">Mobile</option>
            <option value="Baby&kids">Baby & kids</option>
            <option value="Health&fitness">Health & fitness</option>
            <option value="Home&kitchen">Home & kitchen</option>
                      </select>
                    </div>
                    <div className="mt-2">
                      <label className="block mb-2 text-sm font-bold text-gray-700">Link</label>
                      <input
                        type="url"
                        className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                        value={link}
                        onChange={(e) => setLink(e.target.value)}
                        required
                      />
                    </div>
                    <div className="mt-2">
                      <label className="block mb-2 text-sm font-bold text-gray-700">Image</label>
                      <input
                        type="file"
                        className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                        onChange={(e) => setImage(e.target.files[0])}
                      />
                    </div>
                    <div className="mt-4">
                      <button
                        type="submit"
                        className="px-4 py-2 font-bold text-white bg-green-500 rounded hover:bg-green-700 focus:outline-none focus:shadow-outline"
                      >
                        {editId ? 'Update Coupon' : 'Add Coupon'}
                      </button>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default CouponsForm;
