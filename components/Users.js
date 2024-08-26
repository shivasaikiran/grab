import React, { useState, useEffect } from 'react';
import { db } from '@/Firebase/Config';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { FaTrashAlt, FaEdit, FaUsers } from 'react-icons/fa';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'users'));
        const userList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setUsers(userList);
      } catch (err) {
        console.error('Error fetching users:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleDelete = async (userId) => {
    try {
      await deleteDoc(doc(db, 'users', userId));
      setUsers(users.filter(user => user.id !== userId));
    } catch (err) {
      console.error('Error deleting user:', err);
    }
  };

  const handleEdit = (userId) => {
    // Redirect to an edit page or open a form
    console.log('Edit user with id:', userId);
  };

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <div className="flex flex-col items-center p-6 mb-6 text-white rounded-lg shadow-lg bg-gradient-to-r from-green-100 via-green-300 to-green-500">
        <div className="flex items-center mb-2">
          <FaUsers className="text-4xl" />
          <h2 className="ml-2 text-4xl font-bold">{users.length}</h2>
        </div>
        <h2 className="text-2xl font-semibold">Users</h2>
      </div>
      {loading ? (
        <div className="text-center text-gray-500">Loading...</div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-4 py-3 text-left border-b">Name</th>
                <th className="px-4 py-3 text-left border-b">Email</th>
                <th className="px-4 py-3 text-left border-b">UID</th>
                <th className="px-4 py-3 text-left border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id} className="border-b hover:bg-gray-100">
                  <td className="px-4 py-3 border-t">{user.displayName}</td>
                  <td className="px-4 py-3 border-t">{user.email}</td>
                  <td className="px-4 py-3 border-t">{user.uid}</td>
                  <td className="flex px-4 py-3 space-x-2 border-t">
                    {/* <button
                      onClick={() => handleEdit(user.id)}
                      className="text-blue-600 transition duration-300 hover:text-blue-800"
                    >
                      <FaEdit />
                    </button> */}
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="text-red-600 transition duration-300 hover:text-red-800"
                    >
                      <FaTrashAlt />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Users;
