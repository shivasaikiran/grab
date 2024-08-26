import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { auth, db } from '@/Firebase/Config'; // Ensure that this path is correct
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import Image from 'next/image';
import { FaHome, FaPhone, FaPaperPlane, FaTags, FaHeart, FaQuestionCircle } from 'react-icons/fa';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        // Fetch user data from Firestore
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        }
      } else {
        router.push('/login'); // Redirect to login if not authenticated
      }
    });

    return () => unsubscribe();
  }, [router]);

  // Show loading message if user or userData is not available
  if (!user || !userData) {
    return <p>Loading...</p>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <div className="py-4 text-white bg-green-500">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold">Profile Overview</h1>
        </div>
      </div>
      <div className="container flex flex-col-reverse flex-grow p-8 mx-auto lg:flex-row">
        <aside className="order-2 p-6 bg-white rounded-lg shadow-lg lg:order-1 lg:w-1/4">
          <div className="flex flex-col items-center">
            <Image
              className="rounded-full"
              src={user.photoURL || '/default-profile.png'} // Use a default image if photoURL is not available
              alt="Profile Picture"
              width={96}
              height={96}
            />
            <h1 className="text-2xl font-bold text-gray-900">Hi,</h1>
            <h2 className="mt-4 text-xl font-semibold">{userData.displayName || 'User'}</h2>
            <p className="text-gray-700">{user.email}</p>
          </div>
          <nav className="mt-8 space-y-2">
            <a href="#" className="flex items-center block px-4 py-2 space-x-2 border rounded hover:bg-gray-200">
              <FaHome />
              <span>Overview</span>
            </a>
            <a href="#" className="flex items-center block px-4 py-2 space-x-2 border rounded hover:bg-gray-200">
              <FaPhone />
              <span>Mobile Number</span>
            </a>
            <a href="#" className="flex items-center block px-4 py-2 space-x-2 border rounded hover:bg-gray-200">
              <FaPaperPlane />
              <span>My Submissions</span>
            </a>
            <a href="#" className="flex items-center block px-4 py-2 space-x-2 border rounded hover:bg-gray-200">
              <FaTags />
              <span>Coupons/Offers Saved</span>
            </a>
            <a href="#" className="flex items-center block px-4 py-2 space-x-2 border rounded hover:bg-gray-200">
              <FaHeart />
              <span>Following</span>
            </a>
            <a href="#" className="flex items-center block px-4 py-2 space-x-2 border rounded hover:bg-gray-200">
              <FaQuestionCircle />
              <span>Help, Support & FAQs</span>
            </a>
          </nav>
        </aside>
        <main className="flex-grow order-1 p-6 ml-0 bg-white rounded-lg shadow-lg lg:order-2 lg:ml-8">
          <h2 className="mb-6 text-2xl font-bold">Overview</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="p-6 text-white bg-green-500 rounded-lg shadow">
              <h3 className="text-lg font-medium">Stores Followed</h3>
              <p className="mt-2 text-3xl font-bold">0</p>
            </div>
            <div className="p-6 rounded-lg shadow bg-gray-50">
              <h3 className="text-lg font-medium text-gray-900">Categories Followed</h3>
              <p className="mt-2 text-3xl font-bold text-gray-900">0</p>
            </div>
            <div className="p-6 rounded-lg shadow bg-gray-50">
              <h3 className="text-lg font-medium text-gray-900">Coupons/Offers Saved</h3>
              <p className="mt-2 text-3xl font-bold text-gray-900">0</p>
            </div>
            <div className="p-6 rounded-lg shadow bg-gray-50">
              <h3 className="text-lg font-medium text-gray-900">Gift Card Orders</h3>
              <p className="mt-2 text-3xl font-bold text-gray-900">0</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
