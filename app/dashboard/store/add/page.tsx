'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import addStyles from './AddStore.module.css';
import { ProgressBar } from './ProgressBar';

interface Category {
  _id: string;
  name: string;
  description?: string;
}

export default function AddStorePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  // Check if user is authenticated and admin
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/dashboard/store/add');
    } else if (status === 'authenticated' && session?.user && session.user.role !== 'admin') {
      router.push('/dashboard');
    }
  }, [status, session, router]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFileToUpload(file);

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const uploadImage = async () => {
    if (!fileToUpload) return null;

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
    } catch {
      setError('Error uploading image. Please try again.');
      setUploadProgress(0);
      return null;
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

      // Upload image if selected
      let finalImageUrl = imageUrl;
      if (fileToUpload) {
        finalImageUrl = await uploadImage();
      }

      // Create store item
      const response = await fetch('/api/store/items', {
        method: 'POST',
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
        throw new Error(data.error || 'Failed to create store item');
      }

      // Redirect on success
      router.push('/dashboard/store');
      router.refresh();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories when component mounts
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        const response = await fetch('/api/store/categories');

        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }

        const data = await response.json();
        setCategories(data.categories);
      } catch {
        setError('Failed to fetch categories');
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="min-h-screen  flex flex-col items-center justify-start py-8">
      <h1 className="title text-crimson-dark">Add New Store Item</h1>
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4 w-full max-w-2xl">
        <strong>Note:</strong> Image uploads are limited to 4.5MB due to hosting restrictions.
        Please choose a file smaller than 4.5MB.
      </div>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 w-full max-w-2xl">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className={addStyles.formContainer + ' w-full max-w-2xl'}>
        <div className={addStyles.formGroup}>
          <label className={addStyles.label} htmlFor="name">
            Item Name *
          </label>
          <input
            className={addStyles.input}
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className={addStyles.formGroup}>
          <label className={addStyles.label} htmlFor="description">
            Description *
          </label>
          <textarea
            className={addStyles.textarea}
            id="description"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <div className={addStyles.formGroup}>
          <label className={addStyles.label} htmlFor="price">
            Price ($) *
          </label>
          <input
            className={addStyles.input}
            id="price"
            type="number"
            step="0.01"
            min="0"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>

        <div className={addStyles.formGroup}>
          <label className={addStyles.label} htmlFor="category">
            Category
          </label>
          <select
            className={addStyles.select}
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Select a category</option>
            <option value="uncategorized">Uncategorized</option>
            {loadingCategories ? (
              <option disabled>Loading categories...</option>
            ) : (
              categories.map((cat) => (
                <option key={cat._id} value={cat.name}>
                  {cat.name}
                </option>
              ))
            )}
          </select>
        </div>

        <div className={addStyles.formGroupLarge}>
          <label className={addStyles.label} htmlFor="image">
            Item Image
          </label>{' '}
          <input
            className={addStyles.fileInput}
            id="image"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
          {uploadProgress > 0 && uploadProgress < 100 && <ProgressBar progress={uploadProgress} />}
          {imagePreview && (
            <div className={addStyles.previewSection}>
              <p className={addStyles.previewText}>Image Preview:</p>
              <div className={addStyles.imageContainer}>
                <Image src={imagePreview} alt="Preview" fill className={addStyles.imagePreview} />
              </div>
            </div>
          )}
        </div>

        <div className={addStyles.buttonContainer}>
          <button className={addStyles.submitButton} type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create Item'}
          </button>
          <button className={addStyles.cancelButton} type="button" onClick={() => router.back()}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
