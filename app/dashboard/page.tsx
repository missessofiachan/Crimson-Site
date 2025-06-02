'use client';

import { useSession } from 'next-auth/react';
import styles from './Dashboard.module.css';

export default function DashboardPage() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen  flex flex-col items-center justify-start py-8">
      <h1 className="title text-crimson-dark">Dashboard</h1>
      <p className="text-crimson-dark font-semibold text-lg">Welcome back, {session?.user?.name}!</p>
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4 text-crimson-dark">Quick Navigation</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {session?.user?.role === 'admin' && (
            <>
              {' '}
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-2 text-gray-800">Store Management</h3>
                <p className="text-gray-600 mb-4">
                  Manage your store items, add new products, update prices and more.
                </p>
                <a href="/dashboard/store" className="text-crimson-dark hover:underline">
                  View Store Items →
                </a>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-2 text-gray-800">Add New Item</h3>
                <p className="text-gray-600 mb-4">
                  Add a new product to your store with images, description and pricing.
                </p>
                <a href="/dashboard/store/add" className="text-crimson-dark hover:underline">
                  Add Item →
                </a>
              </div>
            </>
          )}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2 text-gray-800">Your Profile</h3>
            <p className="text-gray-600 mb-4">View and update your profile information.</p>
            <a href="/dashboard/profile" className="text-crimson-dark hover:underline">
              Go to Profile →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
