import React, { useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { db } from '@/Firebase/Config';
import { addDoc, collection, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { XIcon } from '@heroicons/react/solid';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

const Todaydealbanner = () => {
 
  const [bannerImage, setBannerImage] = useState(null);
  const [banners, setBanners] = useState([]);
  const [editId, setEditId] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const bannersSnapshot = await getDocs(collection(db, 'todaydealbanners'));
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

      if (bannerImage) {
        // Upload image to Firebase Storage
        const storage = getStorage();
        const storageRef = ref(storage, `banners/${bannerImage.name}`);
        await uploadBytes(storageRef, bannerImage);

        // Get image URL
        imageUrl = await getDownloadURL(storageRef);
      }

      if (editId) {
        // Update existing banner
        const bannerDocRef = doc(db, 'todaydealbanners', editId);
        await updateDoc(bannerDocRef, {
          
          imageUrl: imageUrl || banners.find(banner => banner.id === editId).imageUrl,
        });
        toast.success('Banner updated successfully.');
      } else {
        // Add new banner
        await addDoc(collection(db, 'todaydealbanners'), {
         
          imageUrl,
        });
        toast.success('Banner added successfully.');
      }

      // Reset form state
     
      setBannerImage(null);
      setEditId(null);
      setIsOpen(false);

      // Refresh the banners list
      fetchBanners();
    } catch (error) {
      console.error('Error saving banner: ', error);
      toast.error('Failed to save banner. Please try again.');
    }
  };

  const handleEdit = (banner) => {
  
    setBannerImage(null); // Optionally, you can preload the current image if needed
    setEditId(banner.id);
    setIsOpen(true);
  };

  const handleDelete = async (id, imageUrl) => {
    try {
      // Delete image from Firebase Storage if URL exists
      if (imageUrl) {
        const storage = getStorage();
        const storageRef = ref(storage, imageUrl);
        await deleteObject(storageRef);
      }

      // Delete banner from Firestore
      await deleteDoc(doc(db, 'todaydealbanners', id));
      toast.success('Banner deleted successfully.');
      fetchBanners();
    } catch (error) {
      console.error('Error deleting banner: ', error);
      toast.error('Failed to delete banner. Please try again.');
    }
  };

  return (
    <div>
      <button
        className="px-4 py-2 mb-4 mr-4 font-bold text-white bg-green-500 rounded hover:bg-green-700 focus:outline-none focus:shadow-outline"
        onClick={() => setIsOpen(true)}
      >
        Add Banner
      </button>

      <Transition appear show={isOpen} as={React.Fragment}>
        <Dialog as="div" open={isOpen} onClose={() => setIsOpen(false)}>
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Transition.Child
              as={React.Fragment}
              enter="transform transition ease-in-out duration-300"
              enterFrom="scale-95"
              enterTo="scale-100"
              leave="transform transition ease-in-out duration-300"
              leaveFrom="scale-100"
              leaveTo="scale-95"
            >
              <Dialog.Panel className="max-w-sm p-6 mx-auto bg-white rounded shadow-lg">
                <Dialog.Title className="text-lg font-medium text-gray-900">Banner Form</Dialog.Title>
                <button
                  type="button"
                  className="absolute top-2 right-2"
                  onClick={() => setIsOpen(false)}
                >
                  <XIcon className="w-6 h-6 text-gray-500" />
                </button>
                <form onSubmit={handleSubmit}>
                
                  <div className="mt-4">
                    <label htmlFor="bannerImage" className="block text-sm font-medium text-gray-700">Upload Image</label>
                    <input
                      id="bannerImage"
                      type="file"
                      onChange={(e) => setBannerImage(e.target.files[0])}
                      className="block w-full mt-1 border border-gray-300 rounded-md shadow-sm"
                    />
                  </div>
                  <div className="flex gap-4 mt-4">
                    <button type="submit" className="w-full px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline">
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => { setBannerTitle(''); setBannerDescription(''); setBannerImage(null); setEditId(null); setIsOpen(false); }}
                      className="w-full px-4 py-2 font-bold text-white bg-gray-500 rounded hover:bg-gray-700 focus:outline-none focus:shadow-outline"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>

      <div className="overflow-x-auto">
        <h2 className="mb-4 text-2xl font-bold text-center">Banners Table</h2>
        <table className="w-full border table-auto">
          <thead>
            <tr className='border-b'>
              
              <th className="px-4 py-2">Image</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {banners.map((banner) => (
              <tr key={banner.id} className="border-b">
                
                <td className="px-4 py-2">
                  {banner.imageUrl && <img src={banner.imageUrl} alt="Banner" className="object-cover w-24 h-16" />}
                </td>
                <td className="px-4 py-2">
                  <button
                    className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-700"
                    onClick={() => handleEdit(banner)}
                  >
                    Edit
                  </button>
                  <button
                    className="px-4 py-2 ml-2 text-white bg-red-500 rounded hover:bg-red-700"
                    onClick={() => handleDelete(banner.id, banner.imageUrl)}
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
  );
};

export default Todaydealbanner;
