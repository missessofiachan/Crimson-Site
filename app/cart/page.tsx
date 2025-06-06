'use client';

import React, { useState, useMemo, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';
import { useCart } from '@/lib/cart';
import { toast } from 'react-hot-toast';
import { trackBeginCheckout, trackPurchase } from '@/lib/gtag';
import styles from './Cart.module.css';

export default function CartPage() {
  const router = useRouter();
  const { items, updateQuantity, removeFromCart, totalItems, totalPrice, clearCart } = useCart();

  const [isCheckingOut, setIsCheckingOut] = useState(false);

  // Currency formatter
  const currency = useMemo(
    () =>
      new Intl.NumberFormat('en-AU', {
        style: 'currency',
        currency: 'AUD',
      }),
    []
  );

  // Handlers
  const handleQuantityChange = useCallback(
    (id: string, qty: number) => {
      if (qty < 1) return;
      updateQuantity(id, qty);
    },
    [updateQuantity]
  );

  const handleRemove = useCallback(
    (id: string, name: string) => {
      if (!confirm(`Remove “${name}” from cart?`)) return;
      removeFromCart(id);
      toast.success(`Removed “${name}”`);
    },
    [removeFromCart]
  );

  const handleCheckout = useCallback(async () => {
    setIsCheckingOut(true);

    // Track begin checkout event
    trackBeginCheckout(items, totalPrice);

    try {
      // Create order via API
      const orderData = {
        items: items.map((item) => ({
          _id: item._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          imageUrl: item.imageUrl,
        })),
        total: totalPrice,
        shippingAddress: {
          street: '123 Default Street',
          city: 'Sydney',
          state: 'NSW',
          postalCode: '2000',
          country: 'Australia',
        },
      };

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create order');
      }

      const result = await response.json();
      const orderId = result.orderId;

      // Generate a transaction ID for tracking
      const transactionId = `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // Track purchase event
      trackPurchase(transactionId, items, totalPrice);

      clearCart();
      toast.success('Order placed successfully!');
      router.push(`/order-confirmation?orderId=${orderId}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Checkout failed. Please try again.');
    } finally {
      setIsCheckingOut(false);
    }
  }, [clearCart, router, items, totalPrice]);

  // Empty-cart state
  if (totalItems === 0) {
    return (
      <div className={styles.emptyCart} role="status" aria-live="polite">
        <div className={styles.emptyCartIcon} aria-hidden="true">
          {/* your SVG icon */}
        </div>
        <h2>Your cart is empty</h2>
        <p>Looks like you haven’t added anything yet.</p>
        <Link href="/store" className={styles.continueShopping}>
          Continue Shopping
        </Link>
      </div>
    );
  }

  // Main cart view
  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>Your Shopping Cart</h1>

      <table className={styles.cartTable} aria-label="Shopping cart items">
        {/* Table header */}
        <thead className={styles.cartHeader}>
          <tr>
            <th scope="col" className={styles.productColumn}>
              Product
            </th>
            <th scope="col" className={styles.priceColumn}>
              Price
            </th>
            <th scope="col" className={styles.quantityColumn}>
              Qty
            </th>
            <th scope="col" className={styles.totalColumn}>
              Total
            </th>
            <th scope="col" className={styles.actionColumn}>
              Action
            </th>
          </tr>
        </thead>

        {/* Table body */}
        <tbody>
          {items.map((item) => (
            <tr key={item._id} className={styles.cartItem}>
              {/* Product cell */}
              <td className={styles.productColumn}>
                <div className={styles.productInfo}>
                  {item.imageUrl ? (
                    <Image
                      src={item.imageUrl}
                      alt={`${item.name} product image`}
                      width={80}
                      height={80}
                      style={{ objectFit: 'cover' }}
                      className={styles.productImage}
                      loading="lazy"
                      placeholder="blur"
                      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                    />
                  ) : (
                    <div className={styles.noImage}>No image</div>
                  )}
                  <span className={styles.productName}>{item.name}</span>
                </div>
              </td>

              {/* Price cell */}
              <td className={styles.priceColumn}>{currency.format(item.price)}</td>

              {/* Quantity cell */}
              <td className={styles.quantityColumn}>
                <div className={styles.quantityControl}>
                  <button
                    type="button"
                    onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                    aria-label={`Decrease quantity of ${item.name}`}
                    className={styles.quantityButton}
                  >
                    –
                  </button>
                  <span aria-live="polite">{item.quantity}</span>
                  <button
                    type="button"
                    onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                    aria-label={`Increase quantity of ${item.name}`}
                    className={styles.quantityButton}
                  >
                    +
                  </button>
                </div>
              </td>

              {/* Total cell */}
              <td className={styles.totalColumn}>{currency.format(item.price * item.quantity)}</td>

              {/* Action cell */}
              <td className={styles.actionColumn}>
                <button
                  type="button"
                  onClick={() => handleRemove(item._id, item.name)}
                  className={styles.removeButton}
                  aria-label={`Remove ${item.name} from cart`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className={styles.removeIcon}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                    />
                  </svg>
                </button>
              </td>
            </tr>
          ))}
        </tbody>

        {/* Table footer with summary */}
        <tfoot className={styles.cartSummary}>
          <tr>
            <td colSpan={5}>
              <div className={styles.summaryContent}>
                <div className={styles.summaryRow}>
                  <span>Subtotal:</span>
                  <span>{currency.format(totalPrice)}</span>
                </div>
                <div className={styles.summaryRow}>
                  <span>Shipping:</span>
                  <span>FREE</span>
                </div>
                <div className={clsx(styles.summaryRow, styles.summaryTotal)}>
                  <span>Total:</span>
                  <span>{currency.format(totalPrice)}</span>
                </div>

                <button
                  type="button"
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                  className={styles.checkoutButton}
                >
                  {isCheckingOut ? 'Processing…' : 'Proceed to Checkout'}
                </button>

                <Link href="/store" className={styles.continueShopping}>
                  Continue Shopping
                </Link>
              </div>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
