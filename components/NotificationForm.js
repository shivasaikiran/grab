import React, { useState, useEffect, useRef } from 'react';
import { db } from '@/Firebase/Config';
import { addDoc, collection, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { toast } from 'react-toastify';


// Dynamically import JoditEditor

const NotificationForm = () => {
  const editor = useRef(null);
  const [title, setTitle] = useState('');
  const [selectedPath, setSelectedPath] = useState('');
  const [image, setImage] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [editId, setEditId] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const notificationRef = collection(db, 'notifications');
      const notificationSnapshot = await getDocs(notificationRef);
      const notificationList = notificationSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNotifications(notificationList);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      toast.error('Failed to fetch notifications. Please try again.');
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
        const notificationDocRef = doc(db, 'notifications', editId);
        await updateDoc(notificationDocRef, {
          title,
         selectedPath,
          imageUrl,
          createdAt: new Date(),
        });
        toast.success('Notification updated successfully!');
      } else {
        const notificationRef = collection(db, 'notifications');
        await addDoc(notificationRef, {
          title,
         selectedPath,
          imageUrl,
          createdAt: new Date(),
        });
        toast.success('Notification added successfully!');
      }

      setTitle('');
     setSelectedPath('')
      setImage(null);
      setEditId(null);
      setIsOpen(false);
      fetchNotifications();
    } catch (error) {
      console.error('Error adding/updating notification:', error);
      toast.error('Failed to add/update notification. Please try again.');
    }
  };

  const handleEdit = (notification) => {
    setTitle(notification.title);
   setSelectedPath(notification.path);
    setImage(notification.imageUrl); // Optional: Handle image preview or URL
    setEditId(notification.id);
    setIsOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'notifications', id));
      toast.success('Notification deleted successfully!');
      fetchNotifications();
    } catch (error) {
      console.error('Error deleting notification:', error);
      toast.error('Failed to delete notification. Please try again.');
    }
  };

  return (
    <div className="p-4 bg-gray-100">
      <div className="max-w-4xl p-8 mx-auto bg-white rounded-lg shadow-lg">
        <button
          className="px-4 py-2 mb-4 font-bold text-white bg-green-500 rounded hover:bg-green-700"
          onClick={() => setIsOpen(true)}
        >
          Add Notification
        </button>

        <h2 className="mb-4 text-2xl font-bold text-center">Notification List</h2>

        <div className="overflow-x-auto">
          <table className="w-full border table-auto">
            <thead>
              <tr className="border-b">
                <th className="px-4 py-2">Image</th>
                <th className="px-4 py-2">Title</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {notifications.map((notification) => (
                <tr key={notification.id}>
                  <td className="px-4 py-2 font-bold border-b"><img src={notification.imageUrl} alt={notification.title} className="w-auto h-10 " /></td>
                  <td className="px-4 py-2 border-b">{notification.title}</td>
                  <td className="px-4 py-2 border-b">
                    <button
                      className="px-2 py-1 font-bold text-white bg-yellow-500 rounded hover:bg-yellow-700"
                      onClick={() => handleEdit(notification)}
                    >
                      Edit
                    </button>
                    <button
                      className="px-2 py-1 ml-2 font-bold text-white bg-red-500 rounded hover:bg-red-700"
                      onClick={() => handleDelete(notification.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Add Notification Modal */}
        {isOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-full max-w-md p-8 bg-white rounded-lg">
              <h3 className="mb-4 text-lg font-bold">Add Notification</h3>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="title" className="block mb-2 font-bold">Title</label>
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
        <label className="block mb-2">Path</label>
        <select
          value={selectedPath}
          onChange={(e) => setSelectedPath(e.target.value)}
          className="w-full p-2 border rounded-md"
        >
          <option value="">All</option>
          <option value="/amazon-deals-online">Amazon deals</option>
          <option value="/flipkart-deals-online">Flipkart deals</option>
          <option value="meesho-deals-online">Meesho deals</option>
          <option value="myntra-deals-online">Myntra deals</option>
          <option value="/best-stores-online">Beststores</option>
          <option value="today-deals-online">Today deals</option>
          <option value="mobile-deals-online">Mobile deals</option>
          <option value="electronics-deals-online">Electronics deals</option>
          <option value="fashion-deals-online">Fashion deals</option>
          <option value="footwear-stores-online">Footwear deals</option>
          <option value="beauty-deals-online">Beauty deals</option>
          <option value="baby-kids-deals-online">Baby & Kids deals</option>
          <option value="health-fitness-deals-online">Health & Fitness deals</option>
          <option value="home-kitchen-deals-online">Home & Kitchen deals</option>
          <option value="mobile-offers-online">Mobile offers</option>
          <option value="electronics-offers-online">Electronics offers</option>
          <option value="fashion-offers-online">Fashion offers</option>
          <option value="footwear-offers-online">Footwear offers</option>
          <option value="beauty-offers-online">Beauty offers</option>
          <option value="baby-kids-offers-online">Baby & Kids offers</option>
          <option value="health-fitness-offers-online">Health & Fitness offers</option>
          <option value="home-kitchen-offers-online">Home & Kitchen offers</option>
          
          {/* Add more categories as needed */}
        </select>
      </div>
                <div className="mb-4">
                  <label htmlFor="image" className="block mb-2 font-bold">Image</label>
                  <input
                    type="file"
                    id="image"
                    accept="image/*"
                    onChange={(e) => setImage(e.target.files[0])}
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>
                <div className="flex justify-between">
                  <button
                    type="submit"
                    className="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    className="px-4 py-2 font-bold text-white bg-gray-500 rounded hover:bg-gray-700"
                    onClick={() => setIsOpen(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationForm;
