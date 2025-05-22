'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import styles from '../Dashboard.module.css';

export default function ProfilePage() {
  const { data: session } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(session?.user?.name || '');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // For demonstration - profile update not implemented
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    
    setSuccess('Profile updated successfully! (This is a demo message, actual update not implemented)');
    setIsEditing(false);
  };

  return (
    <div>
      <h1 className={styles.pageTitle}>Your Profile</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}
        <div className="bg-white p-6 rounded-lg shadow text-gray-800">
        {isEditing ? (
          <form onSubmit={handleUpdateProfile}>
            <div className="mb-4">
              <label className="block text-gray-800 text-sm font-bold mb-2" htmlFor="name">
                Name
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
              <div className="mb-4">
              <label className="block text-gray-800 text-sm font-bold mb-2" htmlFor="email">
                Email
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-500 bg-gray-100 leading-tight"
                id="email"
                type="email"
                value={session?.user?.email || ''}
                disabled
              />
              <p className="text-xs text-gray-600 mt-1">Email cannot be changed</p>
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-800 text-sm font-bold mb-2">
                Role
              </label>
              <div className="py-2 px-3 text-gray-800">
                {session?.user?.role === 'admin' ? 'Administrator' : 'Regular User'}
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <button
                className="bg-crimson-dark hover:bg-crimson text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit"
              >
                Save Changes
              </button>
              <button
                className="inline-block align-baseline font-bold text-sm text-gray-500 hover:text-gray-700"
                type="button"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <>            <div className="mb-4">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Account Information</h2>
              
              <div className="mb-4">
                <label className="block text-gray-800 text-sm font-bold mb-2">
                  Name
                </label>
                <div className="py-2 px-3 text-gray-800">
                  {session?.user?.name}
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-800 text-sm font-bold mb-2">
                  Email
                </label>
                <div className="py-2 px-3 text-gray-800">
                  {session?.user?.email}
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-800 text-sm font-bold mb-2">
                  Role
                </label>
                <div className="py-2 px-3 text-gray-800">
                  {session?.user?.role === 'admin' ? 'Administrator' : 'Regular User'}
                </div>
              </div>
              
              <button
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-4"
                onClick={() => setIsEditing(true)}
              >
                Edit Profile
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
