'use client';

import React from 'react';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import styles from '../../../Dashboard.module.css';

interface StoreItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string | null;
  category: string;
}

export default function EditStorePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const { data: session, status } = useSession();
  const router = useRouter();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Check if user is admin
  useEffect(() => {
    if (status === 'authenticated' && session?.user?.role !== 'admin') {
      router.push('/dashboard');
    }
  }, [session, status, router]);

  // Fetch item data
  useEffect(() => {
    const fetchItem = async () => {
      try {
        setFetchLoading(true);
        const response = await fetch(`/api/store/items/${id}`);

        if (!response.ok) {
          throw new Error('Failed to fetch item');
        }

        const item: StoreItem = await response.json();

        setName(item.name);
        setDescription(item.description);
        setPrice(item.price.toString());
        setCategory(item.category);
        setImageUrl(item.imageUrl);

        if (item.imageUrl) {
          setImagePreview(item.imageUrl);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setFetchLoading(false);
      }
    };

    if (id) {
      fetchItem();
    }
  }, [id]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFileToUpload(file);

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async () => {
    if (!fileToUpload) return imageUrl;

    setUploadProgress(10);
    const formData = new FormData();
    formData.append('file', fileToUpload);

    try {
      setUploadProgress(30);
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      setUploadProgress(80);

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      const data = await response.json();
      setUploadProgress(100);
      return data.fileUrl;
    } catch (error) {
      console.error('Upload error:', error);
      setError('Error uploading image. Please try again.');
      setUploadProgress(0);
      return imageUrl;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validate form
      if (!name || !description || !price) {
        throw new Error('Please fill in all required fields');
      }

      // Validate price is a number
      if (isNaN(parseFloat(price)) || parseFloat(price) <= 0) {
        throw new Error('Price must be a positive number');
      }

      // Upload image if changed
      let finalImageUrl = imageUrl;
      if (fileToUpload) {
        finalImageUrl = await uploadImage();
      }

      // Update store item
      const response = await fetch(`/api/store/items/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          description,
          price: parseFloat(price),
          imageUrl: finalImageUrl,
          category: category || 'uncategorized',
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update store item');
      }

      // Redirect on success
      router.push('/dashboard/store');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  if (fetchLoading) {
    return <div className="text-gray-800">Loading item data...</div>;
  }

  return (
    <div>
      <h1 className={styles.pageTitle}>Edit Store Item</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
            Item Name *
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
            Description *
          </label>
          <textarea
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="description"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="price">
            Price ($) *
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="price"
            type="number"
            step="0.01"
            min="0"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="category">
            Category
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="category"
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="e.g., Electronics, Clothing, etc."
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="image">
            Item Image
          </label>
          <input
            className="block w-full text-gray-700 border border-gray-200 rounded py-2 px-3"
            id="image"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />

          <div className="text-xs text-gray-500 mt-1">
            {imageUrl ? 'Upload new image to replace the current one' : 'No image currently set'}
          </div>
          {uploadProgress > 0 && uploadProgress < 100 && (
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
              <div
                className={`bg-crimson-dark h-2.5 rounded-full ${styles.uploadProgressBar}`}
                data-progress={uploadProgress}
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          )}

          {imagePreview && (
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-2">Image Preview:</p>
              <div className="relative h-40 w-40">
                <Image
                  src={imagePreview}
                  alt="Preview"
                  width={160}
                  height={160}
                  style={{ objectFit: 'cover' }}
                  className="rounded"
                />
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <button
            className="bg-crimson-dark hover:bg-crimson text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
            disabled={loading}
          >
            {loading ? 'Updating...' : 'Update Item'}
          </button>
          <button
            className="inline-block align-baseline font-bold text-sm text-gray-500 hover:text-gray-700"
            type="button"
            onClick={() => router.back()}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
