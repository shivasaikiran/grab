import { useState, useEffect } from 'react';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { db } from '@/Firebase/Config';
import { toast, ToastContainer } from 'react-toastify'; // Import Toastify
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify CSS

const SubscriptionAlert = () => {
  const [email, setEmail] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [images, setImages] = useState([]);

  // Fetch images from Firestore
  const fetchImages = async () => {
    try {
      const imagesCollectionRef = collection(db, 'homeads');
      const imageSnapshot = await getDocs(imagesCollectionRef);
      const imageList = imageSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setImages(imageList);
    } catch (error) {
      console.error('Error fetching images: ', error);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  useEffect(() => {
    if (images.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
      }, 3000); // Change slide every 3 seconds

      return () => clearInterval(interval);
    }
  }, [images]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const subscriptionsCollectionRef = collection(db, 'subscriptions');
      await addDoc(subscriptionsCollectionRef, { email });
      toast.success(`Subscribed with: ${email}`); // Show success toast
      setEmail(''); // Clear input after submission
    } catch (error) {
      console.error('Error adding email to Firestore: ', error);
      toast.error('Failed to subscribe. Please try again.'); // Show error toast
    }
  };
  return (
    <div className="py-16 bg-green-100">
      <div className="flex flex-col items-center justify-between px-6 mx-auto lg:container lg:flex-row md:flex-row lg:px-2">
        <div className="p-6 border rounded-md shadow-2xl lg:w-3/5 md:w-2/4 shadow-green-500">
          <h2 className="mb-8 text-sm font-bold text-center lg:text-3xl md:text-3xl">Get The Latest & Best Deal/Offer Alerts</h2>
          <form onSubmit={handleSubmit} className="flex flex-col items-center justify-center sm:flex-row md:flex-row lg:flex-row">
            <input
              type="email"
              placeholder="Enter Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="lg:w-[376px] md:w-[376px] w-80 p-2 mb-4 border rounded-md sm:w-auto sm:mb-0 sm:mr-4"
              required
            />
            <button
              type="submit"
              className="px-6 py-2 text-white bg-green-500 rounded-md"
            >
              SUBSCRIBE
            </button>
          </form>
        </div>
        <div className="relative w-full h-40 mt-8 overflow-hidden bg-gray-200 border rounded-md shadow-md lg:ml-3 md:ml-2 lg:w-2/5 md:w-2/4 lg:mt-0 md:mt-0">
          <div
            className="absolute flex w-full h-full transition-transform duration-1000"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {images.map((image, index) => (
              <div key={index} className="flex-shrink-0 w-full h-full">
                <img
                  src={image.imageUrl}
                  alt={`Slide ${index + 1}`}
                  className="object-cover w-full h-full rounded-md"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionAlert;
