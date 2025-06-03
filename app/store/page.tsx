'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import styles from './Store.module.css';
import { useCart } from '@/lib/cart';
import { toast } from 'react-hot-toast';
import { trackSearch, trackViewItem } from '@/lib/gtag';

interface StoreItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string | null;
  category: string;
}

export default function StorePage() {
  const [items, setItems] = useState<StoreItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const { addToCart } = useCart();
  // Function to handle adding item to cart
  const handleAddToCart = (item: StoreItem) => {
    addToCart({
      _id: item._id,
      name: item.name,
      price: item.price,
      imageUrl: item.imageUrl,
    });

    // Show toast notification
    toast.success(`${item.name} added to cart!`);
  };

  // Function to handle product view tracking
  const handleProductView = (item: StoreItem) => {
    trackViewItem(item);
  };

  // Fetch store items
  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);

        // Build URL with filters
        let url = `/api/store/items?page=${currentPage}&limit=9`;

        // Add category filter if selected
        if (selectedCategory !== 'all') {
          url += `&category=${selectedCategory}`;
        }

        // Add search query if provided
        if (searchTerm) {
          url += `&search=${encodeURIComponent(searchTerm)}`;
        }

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error('Failed to fetch items');
        }

        const data = await response.json();
        setItems(data.items);
        setTotalPages(data.totalPages);

        // Extract unique categories if they haven't been loaded yet
        if (categories.length === 0) {
          const uniqueCategories = Array.from(
            new Set(data.items.map((item: StoreItem) => item.category))
          );
          setCategories(uniqueCategories as string[]);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch items');
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [currentPage, selectedCategory, searchTerm]);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
    setCurrentPage(0); // Reset to first page when changing category
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(0); // Reset to first page when searching
  };
  // Function to handle search submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Track search event
    if (searchTerm.trim()) {
      trackSearch(searchTerm.trim());
    }
    // The effect will trigger with the current searchTerm
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>Our Store</h1>
      <p className={styles.pageSubtitle}>Browse our collection of products</p>

      {/* Search and Filter Container */}
      <div className={styles.searchFilterContainer}>
        {/* Search Form */}
        <form onSubmit={handleSearchSubmit} className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Search products..."
            className={styles.searchInput}
            value={searchTerm}
            onChange={handleSearchChange}
            aria-label="Search products"
          />
          <button type="submit" className={styles.searchButton} aria-label="Search">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
        </form>

        {/* Category Filter */}
        <div className={styles.filterContainer}>
          <label htmlFor="category-select" className={styles.filterLabel}>
            Filter by category:
          </label>
          <select
            id="category-select"
            className={styles.filterSelect}
            value={selectedCategory}
            onChange={handleCategoryChange}
            aria-label="Filter by category"
          >
            <option value="all">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-12">Loading items...</div>
      ) : items.length === 0 ? (
        <div className="text-center py-12">
          <p>No items found</p>
          <p className="text-gray-500 mt-2">
            {searchTerm
              ? `No items found matching "${searchTerm}"${selectedCategory !== 'all' ? ` in the "${selectedCategory}" category` : ''}`
              : selectedCategory !== 'all'
                ? `No items found in the "${selectedCategory}" category`
                : 'No items available at the moment'}
          </p>
        </div>
      ) : (
        <>
          {' '}
          <div className={styles.grid}>
            {items.map((item) => (
              <div key={item._id} className={styles.card} onClick={() => handleProductView(item)}>
                <div className={styles.imageContainer}>
                  {' '}
                  {item.imageUrl ? (
                    <Image
                      src={item.imageUrl}
                      alt={`${item.name} product image`}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      style={{ objectFit: 'contain' }}
                      loading="lazy"
                      placeholder="blur"
                      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                    />
                  ) : (
                    <div className={styles.noImage}>No image available</div>
                  )}
                </div>
                <div className={styles.cardContent}>
                  <h2 className={styles.itemName}>{item.name}</h2>
                  <p className={styles.itemPrice}>${item.price.toFixed(2)}</p>
                  <p className={styles.itemDescription}>{item.description}</p>
                  <span className={styles.itemCategory}>{item.category}</span>

                  <button
                    className={styles.addToCartBtn}
                    onClick={() => handleAddToCart(item)}
                    aria-label={`Add ${item.name} to cart`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                      />
                    </svg>
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
          {/* Pagination */}
          {totalPages > 1 && (
            <div className={styles.paginationContainer}>
              <div className={styles.pagination}>
                <button
                  className={styles.paginationButton}
                  onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                  disabled={currentPage === 0}
                >
                  Previous
                </button>
                <div className={styles.paginationInfo}>
                  Page {currentPage + 1} of {totalPages}
                </div>
                <button
                  className={styles.paginationButton}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))}
                  disabled={currentPage === totalPages - 1}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
