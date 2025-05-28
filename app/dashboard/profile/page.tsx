'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import type { Order } from '@/types/order';

export default function ProfilePage() {
  const { data: session } = useSession();
  const router = useRouter();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [status, setStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError] = useState('');

  // Sync name with session when it loads
  useEffect(() => {
    if (session?.user?.name) {
      setName(session.user.name);
    }
  }, [session?.user?.name]);

  useEffect(() => {
    if (!session?.user) return;
    const fetchOrders = async () => {
      setOrdersLoading(true);
      setOrdersError('');
      try {
        const res = await fetch('/api/orders');
        if (!res.ok) throw new Error('Failed to fetch orders');
        const data = await res.json();
        setOrders(data.orders || []);
      } catch (err: any) {
        setOrdersError(err.message || 'Could not load orders');
      } finally {
        setOrdersLoading(false);
      }
    };
    fetchOrders();
  }, [session?.user]);

  const toggleEdit = useCallback(() => {
    setError('');
    setStatus('idle');
    setIsEditing((e) => !e);
  }, []);

  const handleSave = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      // Simple client-side validation
      if (!name.trim()) {
        setError('Name cannot be empty');
        setStatus('error');
        return;
      }

      setStatus('saving');
      try {
        const res = await fetch('/api/profile', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name }),
        });
        if (!res.ok) throw new Error('Update failed');
        toast.success('Profile updated!');
        setStatus('success');
        setIsEditing(false);
        router.refresh();
      } catch (err: any) {
        setError(err.message || 'Something went wrong');
        setStatus('error');
      }
    },
    [name, router]
  );

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-semibold mb-6">Your Profile</h1>

      {status === 'error' && (
        <div
          role="alert"
          className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded"
        >
          {error}
        </div>
      )}
      {status === 'success' && (
        <div
          role="status"
          className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded"
        >
          Profile updated successfully!
        </div>
      )}

      <div className="bg-white shadow rounded-lg p-6 mb-8">
        {isEditing ? (
          <form onSubmit={handleSave} noValidate>
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                aria-invalid={error ? 'true' : 'false'}
                className="block w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <p className="text-gray-500">{session?.user?.email}</p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <p className="text-gray-800">
                {session?.user?.role === 'admin' ? 'Administrator' : 'User'}
              </p>
            </div>

            <div className="flex items-center space-x-4">
              <button
                type="submit"
                disabled={status === 'saving'}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                aria-busy={status === 'saving'}
              >
                {status === 'saving' ? 'Saving...' : 'Save Changes'}
              </button>
              <button type="button" onClick={toggleEdit} className="text-gray-500 hover:underline">
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div>
            <dl className="space-y-4 mb-6">
              <div>
                <dt className="text-sm font-medium text-gray-700">Name</dt>
                <dd className="mt-1 text-gray-900">{session?.user?.name}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-700">Email</dt>
                <dd className="mt-1 text-gray-900">{session?.user?.email}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-700">Role</dt>
                <dd className="mt-1 text-gray-900">
                  {session?.user?.role === 'admin' ? 'Administrator' : 'User'}
                </dd>
              </div>
            </dl>
            <button
              type="button"
              onClick={toggleEdit}
              className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
            >
              Edit Profile
            </button>
          </div>
        )}
      </div>

      {/* Order History Section */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4 text-gray-900">Order History</h2>
        {ordersLoading ? (
          <p className="text-gray-900">Loading orders...</p>
        ) : ordersError ? (
          <p className="text-red-600">{ordersError}</p>
        ) : orders.length === 0 ? (
          <p className="text-gray-900">You have not placed any orders yet.</p>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order._id} className="border rounded p-4 bg-white">
                <div className="flex flex-wrap justify-between items-center mb-2">
                  <div>
                    <span className="font-semibold text-gray-900">Order ID:</span>{' '}
                    <span className="font-mono text-gray-900">{order._id}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-900">Date:</span>
                    <span className="text-gray-900">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-900">Status:</span>{' '}
                    <span className="capitalize text-gray-900">{order.status}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-900">Total:</span>{' '}
                    <span className="text-gray-900">${order.total.toFixed(2)}</span>
                  </div>
                </div>
                <div className="mt-2">
                  <span className="font-semibold text-gray-900">Items:</span>
                  <ul className="list-disc list-inside ml-4">
                    {order.items.map((item) => (
                      <li key={item._id} className="text-gray-900">
                        {item.name} (x{item.quantity}) - ${item.price.toFixed(2)}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
