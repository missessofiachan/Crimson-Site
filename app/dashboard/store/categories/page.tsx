'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from '../../Dashboard.module.css';
import { useProtectedRoute, useIsAdmin } from '@/lib/auth';
import { toast } from 'react-hot-toast';

interface Category {
  _id: string;
  name: string;
  description?: string;
  createdAt: string;
}

export default function CategoriesPage() {
  // Use the protected route hook with admin role requirement
  const { loading: authLoading } = useProtectedRoute({ requiredRole: 'admin' });
  const isAdmin = useIsAdmin();
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // For adding new category
  const [newCategory, setNewCategory] = useState({ name: '', description: '' });
  const [isAddingCategory, setIsAddingCategory] = useState(false);

  // Fetch categories
  useEffect(() => {
    if (authLoading) return;

    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/store/categories');

        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }

        const data = await response.json();
        setCategories(data.categories);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [authLoading]);

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newCategory.name.trim()) {
      toast.error('Category name is required');
      return;
    }

    try {
      setIsAddingCategory(true);

      const response = await fetch('/api/store/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCategory),
      });

      if (!response.ok) {
        throw new Error('Failed to add category');
      }

      const data = await response.json();

      // Add the new category to the list
      setCategories((prev) => [...prev, data.category]);

      // Reset form
      setNewCategory({ name: '', description: '' });
      toast.success('Category added successfully');
    } catch (err: any) {
      setError(err.message);
      toast.error('Failed to add category');
    } finally {
      setIsAddingCategory(false);
    }
  };

  const handleDeleteCategory = async (id: string, name: string) => {
    if (
      window.confirm(
        `Are you sure you want to delete the category "${name}"? This may affect products using this category.`
      )
    ) {
      try {
        const response = await fetch(`/api/store/categories/${id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Failed to delete category');
        }

        // Remove deleted category from state
        setCategories(categories.filter((category) => category._id !== id));
        toast.success(`Category "${name}" deleted successfully`);
      } catch (err: any) {
        setError(err.message);
        toast.error('Failed to delete category');
      }
    }
  };

  return (
    <div>
      <h1 className={styles.pageTitle}>Category Management</h1>{' '}
      <div className="mb-6">
        <p className="mb-4 text-gray-800">Manage your product categories below</p>

        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Add New Category</h2>

          <form onSubmit={handleAddCategory}>
            {' '}
            <div className="mb-4">
              <label
                htmlFor="categoryName"
                className="block text-sm font-medium text-gray-800 mb-1"
              >
                Category Name *
              </label>
              <input
                type="text"
                id="categoryName"
                value={newCategory.name}
                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-md text-gray-800"
                required
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="categoryDescription"
                className="block text-sm font-medium text-gray-800 mb-1"
              >
                Description (Optional)
              </label>{' '}
              <textarea
                id="categoryDescription"
                value={newCategory.description}
                onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-md text-gray-800"
                rows={3}
              />
            </div>
            <button
              type="submit"
              disabled={isAddingCategory || !newCategory.name.trim()}
              className="bg-crimson-dark text-white px-4 py-2 rounded-md hover:bg-crimson disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAddingCategory ? 'Adding...' : 'Add Category'}
            </button>
          </form>
        </div>
      </div>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}{' '}
      {loading ? (
        <div className="text-center py-12 text-gray-800">Loading categories...</div>
      ) : (
        <>
          {' '}
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-2 px-4 border-b text-gray-800">Name</th>
                  <th className="py-2 px-4 border-b text-gray-800">Description</th>
                  <th className="py-2 px-4 border-b text-gray-800">Created At</th>
                  <th className="py-2 px-4 border-b text-gray-800">Actions</th>
                </tr>
              </thead>{' '}
              <tbody>
                {categories.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-4 px-4 text-center text-gray-800">
                      No categories found. Add your first category!
                    </td>
                  </tr>
                ) : (
                  categories.map((category) => (
                    <tr key={category._id} className="hover:bg-gray-50">
                      <td className="py-2 px-4 border-b text-gray-800">{category.name}</td>
                      <td className="py-2 px-4 border-b text-gray-800">
                        {category.description || '-'}
                      </td>
                      <td className="py-2 px-4 border-b text-gray-800">
                        {new Date(category.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-2 px-4 border-b">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleDeleteCategory(category._id, category.name)}
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
          </div>
        </>
      )}
    </div>
  );
}
