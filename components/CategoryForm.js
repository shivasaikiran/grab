import React, { useState, useEffect, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XIcon } from '@heroicons/react/outline'; // Import the close icon
import { db } from '@/Firebase/Config';
import { addDoc, collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';

const CategoryForm = () => {
  const [name, setName] = useState('');
  const [offers, setOffers] = useState('');
  const [index, setIndex] = useState(0);
  const [names, setNames] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);

  // Fetch names from Firestore
  const fetchNames = async () => {
    try {
      const namesCollectionRef = collection(db, 'category');
      const namesSnapshot = await getDocs(namesCollectionRef);
      const namesList = namesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setNames(namesList);
    } catch (error) {
      console.error('Error fetching names: ', error);
      toast.error('Failed to fetch names. Please try again.');
    }
  };

  useEffect(() => {
    fetchNames();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isEdit) {
        // Update existing name
        const nameDocRef = doc(db, 'category', editId);
        await updateDoc(nameDocRef, { name, index,offers });
        toast.success('Name updated successfully!');
      } else {
        // Add new name to Firestore
        const namesCollectionRef = collection(db, 'category');
        await addDoc(namesCollectionRef, { name, index,offers });
        toast.success('Name added successfully!');
      }

      // Reset form state
      setName('');
      setOffers('');
      setIndex(0);
      setIsOpen(false);
      setIsEdit(false);
      setEditId(null);

      // Refresh the names list
      fetchNames();
    } catch (error) {
      console.error('Error handling name submission: ', error);
      toast.error('Failed to process name. Please try again.');
    }
  };

  const handleEdit = (id, currentName, currentIndex,currentOffers) => {
    setIsEdit(true);
    setEditId(id);
    setName(currentName);
    setIndex(currentIndex);
    setOffers(currentOffers);
    setIsOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      // Delete name from Firestore
      const nameDocRef = doc(db, 'category', id);
      await deleteDoc(nameDocRef);
      toast.success('Name deleted successfully!');

      // Refresh the names list
      fetchNames();
    } catch (error) {
      console.error('Error deleting name: ', error);
      toast.error('Failed to delete name. Please try again.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-100">
      <button
        className="px-4 py-2 mb-4 font-bold text-white bg-blue-500 rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline"
        onClick={() => setIsOpen(true)}
      >
        Add Name
      </button>

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
            <div className="flex items-center justify-center min-h-full p-4 text-center">
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
                    className="absolute text-gray-500 top-4 right-4 hover:text-gray-700"
                    onClick={() => setIsOpen(false)}
                  >
                    <XIcon className="w-6 h-6" />
                  </button>
                  <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                    {isEdit ? 'Edit Name' : 'Add Name'}
                  </Dialog.Title>
                  <form onSubmit={handleSubmit}>
                    <div className="mt-2">
                      <label className="block mb-2 text-sm font-bold text-gray-700">Name</label>
                      <input
                        className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="mt-2">
                      <label className="block mb-2 text-sm font-bold text-gray-700">Offers</label>
                      <input
                        className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                        type="number"
                        value={offers}
                        onChange={(e) => setOffers(e.target.value)}
                        required
                      />
                    </div>
                    <div className="mt-2">
                      <label className="block mb-2 text-sm font-bold text-gray-700">Index</label>
                      <input
                        className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                        type="number"
                        value={index}
                        onChange={(e) => setIndex(Number(e.target.value))}
                        required
                      />
                    </div>
                    <div className="mt-4">
                      <button
                        className="w-full px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline"
                        type="submit"
                      >
                        Submit
                      </button>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            <th className="px-4 py-2 border-b">Name</th>
            <th className="px-4 py-2 border-b">Index</th>
            <th className="px-4 py-2 border-b">Offers</th>
            <th className="px-4 py-2 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {names.map((item) => (
            <tr key={item.id}>
              <td className="px-4 py-2 border-b">{item.name}</td>
              <td className="px-4 py-2 border-b">{item.index}</td>
              <td className="px-4 py-2 border-b">{item.offers}</td>
              <td className="px-4 py-2 border-b">
                <button
                  className="px-4 py-2 mr-2 font-bold text-white bg-yellow-500 rounded hover:bg-yellow-700 focus:outline-none focus:shadow-outline"
                  onClick={() => handleEdit(item.id, item.name, item.index)}
                >
                  Edit
                </button>
                <button
                  className="px-4 py-2 font-bold text-white bg-red-500 rounded hover:bg-red-700 focus:outline-none focus:shadow-outline"
                  onClick={() => handleDelete(item.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CategoryForm;
