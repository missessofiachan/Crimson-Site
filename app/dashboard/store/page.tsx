'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import styles from '../Dashboard.module.css';
import { useProtectedRoute, useIsAdmin } from '@/lib/auth';

interface StoreItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string | null;
  category: string;
  createdAt: string;
  updatedAt: string;
}

export default function StoreManagementPage() {
  // Use the protected route hook with admin role requirement
  const { loading: authLoading } = useProtectedRoute({ requiredRole: 'admin' });
  const isAdmin = useIsAdmin();
  const router = useRouter();

  const [items, setItems] = useState<StoreItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const [cleanupLoading, setCleanupLoading] = useState(false);

  // Fetch store items
  useEffect(() => {
    if (authLoading) return;

    const fetchItems = async () => {
      try {
        setLoading(true);
        let url = `/api/store/items?page=${currentPage}&limit=10`;

        if (searchTerm) {
          url += `&search=${encodeURIComponent(searchTerm)}`;
        }

        if (selectedCategory) {
          url += `&category=${encodeURIComponent(selectedCategory)}`;
        }

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error('Failed to fetch items');
        }

        const data = await response.json();
        setItems(data.items);
        setTotalPages(data.totalPages);

        // Extract categories if not already loaded
        if (categories.length === 0) {
          const uniqueCategories = Array.from(
            new Set(data.items.map((item: StoreItem) => item.category))
          );
          setCategories(uniqueCategories as string[]);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [currentPage]);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        const response = await fetch(`/api/store/items/${id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Failed to delete item');
        } // Remove deleted item from state
        setItems(items.filter((item) => item._id !== id));
      } catch (err: any) {
        setError(err.message);
      }
    }
  };

  const handleCleanupImages = async () => {
    if (
      window.confirm(
        'This will delete all orphaned image files that are no longer referenced by any product. Are you sure?'
      )
    ) {
      try {
        setCleanupLoading(true);
        const response = await fetch('/api/store/cleanup', {
          method: 'POST',
        });

        if (!response.ok) {
          throw new Error('Failed to cleanup images');
        }

        const data = await response.json();
        alert(
          `Cleanup completed!\nDeleted: ${data.summary.deletedCount} files\nErrors: ${data.summary.errorCount}`
        );
      } catch (err: any) {
        setError(err.message);
        alert('Failed to cleanup images: ' + err.message);
      } finally {
        setCleanupLoading(false);
      }
    }
  };

  if (authLoading || !isAdmin) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1 className={styles.pageTitle}>Store Items Management</h1>{' '}
      <div className="mb-4 flex justify-between items-center">
        <p className="text-gray-800">Manage your store items below</p>
        <div className="flex gap-2">
          <button
            onClick={handleCleanupImages}
            disabled={cleanupLoading}
            className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 disabled:opacity-50"
          >
            {cleanupLoading ? 'Cleaning...' : 'Cleanup Images'}
          </button>
          <Link
            href="/dashboard/store/add"
            className="bg-crimson-dark text-white px-4 py-2 rounded-md hover:bg-crimson"
          >
            + Add New Item
          </Link>
        </div>
      </div>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}{' '}
      {loading ? (
        <div className="text-gray-800">Loading items...</div>
      ) : (
        <>
          {' '}
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-2 px-4 border-b text-gray-800">Image</th>
                  <th className="py-2 px-4 border-b text-gray-800">Name</th>
                  <th className="py-2 px-4 border-b text-gray-800">Price</th>
                  <th className="py-2 px-4 border-b text-gray-800">Category</th>
                  <th className="py-2 px-4 border-b text-gray-800">Actions</th>
                </tr>
              </thead>{' '}
              <tbody>
                {items.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-4 px-4 text-center text-gray-800">
                      No items found. Add your first store item!
                    </td>
                  </tr>
                ) : (
                  items.map((item) => (
                    <tr key={item._id} className="hover:bg-gray-50">
                      <td className="py-2 px-4 border-b">
                        {item.imageUrl ? (
                          <div className="relative h-16 w-16">
                            <Image
                              src={item.imageUrl}
                              alt={item.name}
                              fill
                              style={{ objectFit: 'cover' }}
                              className="rounded"
                            />
                          </div>
                        ) : (
                          <div className="h-16 w-16 bg-gray-200 flex items-center justify-center rounded text-gray-500">
                            No image
                          </div>
                        )}
                      </td>
                      <td className="py-2 px-4 border-b text-gray-800">{item.name}</td>
                      <td className="py-2 px-4 border-b text-gray-800">${item.price.toFixed(2)}</td>
                      <td className="py-2 px-4 border-b text-gray-800">{item.category}</td>
                      <td className="py-2 px-4 border-b">
                        <div className="flex space-x-2">
                          <Link
                            href={`/dashboard/store/edit/${item._id}`}
                            className="text-blue-600 hover:underline"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDelete(item._id)}
                            className="text-red-600 hover:underline"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>{' '}
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-4">
              <button
                onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                disabled={currentPage === 0}
                className="px-3 py-1 bg-gray-200 text-gray-800 rounded-l-md disabled:bg-gray-100 disabled:text-gray-400"
              >
                Previous
              </button>
              <div className="px-4 py-1 bg-white border-t border-b text-gray-800">
                Page {currentPage + 1} of {totalPages}
              </div>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={currentPage === totalPages - 1}
                className="px-3 py-1 bg-gray-200 text-gray-800 rounded-r-md disabled:bg-gray-100 disabled:text-gray-400"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
