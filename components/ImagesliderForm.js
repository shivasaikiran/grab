import React, { useState, useEffect, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XIcon } from '@heroicons/react/outline'; // Import the close icon
import { db } from '@/Firebase/Config';
import { addDoc, collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { toast } from 'react-toastify';

const ImagesliderForm = () => {
  const [image, setImage] = useState(null);
  const [link, setLink] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  const [images, setImages] = useState([]);

  // Fetch images from Firestore
  const fetchImages = async () => {
    try {
      const imagesCollectionRef = collection(db, 'imageslider');
      const imageSnapshot = await getDocs(imagesCollectionRef);
      const imageList = imageSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setImages(imageList);
      setLink('');
    } catch (error) {
      console.error('Error fetching images: ', error);
      toast.error('Failed to fetch images. Please try again.');
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

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

      if (isEdit) {
        // Update existing image
        const imageDocRef = doc(db, 'imageslider', editId);
        await updateDoc(imageDocRef, { 
          imageUrl: imageUrl || images.find(img => img.id === editId).imageUrl,
          link // Update link in Firestore
        });

        toast.success('Image updated successfully!');
      } else {
        // Add new image to Firestore
        const imagesCollectionRef = collection(db, 'imageslider');
        await addDoc(imagesCollectionRef, { imageUrl, link });

        toast.success('Image added successfully!');
      }

      // Reset form state
      setImage(null);
      setLink('');
      setIsOpen(false);
      setIsEdit(false);
      setEditId(null);

      // Refresh the images list
      fetchImages();
    } catch (error) {
      console.error('Error handling image submission: ', error);
      toast.error('Failed to process image. Please try again.');
    }
  };

  const handleEdit = (id) => {
    setIsEdit(true);
    setEditId(id);
    setIsOpen(true);
  };

  const handleDelete = async (id, imageUrl) => {
    try {
      // Delete image from Firebase Storage
      const storage = getStorage();
      const storageRef = ref(storage, imageUrl);
      await deleteObject(storageRef);

      // Delete image from Firestore
      const imageDocRef = doc(db, 'imageslider', id);
      await deleteDoc(imageDocRef);

      toast.success('Image deleted successfully!');

      // Refresh the images list
      fetchImages();
    } catch (error) {
      console.error('Error deleting image: ', error);
      toast.error('Failed to delete image. Please try again.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-100">
      <button
        className="px-4 py-2 mb-4 font-bold text-white bg-blue-500 rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline"
        onClick={() => setIsOpen(true)}
      >
        Add Image
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
                    {isEdit ? 'Edit Image' : 'Add Image'}
                  </Dialog.Title>
                  <form onSubmit={handleSubmit}>
                    <div className="mt-2">
                      <label className="block mb-2 text-sm font-bold text-gray-700">Image Upload</label>
                      <input
                        className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                        type="file"
                        onChange={(e) => setImage(e.target.files[0])}
                        required={!isEdit}
                      />
                    </div>
                    <div className="mt-2">
                      <label className="block mb-2 text-sm font-bold text-gray-700">Link</label>
                      <input
                        className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                        type="text"
                        value={link}
                        onChange={(e) => setLink(e.target.value)}
                        required={!isEdit}
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
            <th className="px-4 py-2 border-b">Image</th>
            <th className="px-4 py-2 border-b">Link</th>
            <th className="px-4 py-2 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {images.map((img) => (
            <tr key={img.id}>
              <td className="px-4 py-2 border-b">
                <img src={img.imageUrl} alt="Slider" className=" w-60" />
              </td>
              <td className="px-4 py-2 border-b">
                <a href={img.link} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                  {img.link}
                </a>
              </td>
              <td className="px-4 py-2 border-b">
                <button
                  className="px-4 py-2 mr-2 font-bold text-white bg-yellow-500 rounded hover:bg-yellow-700 focus:outline-none focus:shadow-outline"
                  onClick={() => handleEdit(img.id)}
                >
                  Edit
                </button>
                <button
                  className="px-4 py-2 font-bold text-white bg-red-500 rounded hover:bg-red-700 focus:outline-none focus:shadow-outline"
                  onClick={() => handleDelete(img.id, img.imageUrl)}
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

export default ImagesliderForm;
