'use client';

import React, { useState, useMemo, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';
import { useCart } from '@/lib/cart';
import { toast } from 'react-hot-toast';
import styles from './Cart.module.css';

export default function CartPage() {
  const router = useRouter();
  const {
    items,
    updateQuantity,
    removeFromCart,
    totalItems,
    totalPrice,
    clearCart,
  } = useCart();

  const [isCheckingOut, setIsCheckingOut] = useState(false);

  // Currency formatter (memoized)
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
    try {
      // simulate API call
      await new Promise((r) => setTimeout(r, 2000));
      clearCart();
      toast.success('Order placed successfully!');
      router.push('/order-confirmation'); // create this page as desired
    } catch {
      toast.error('Checkout failed. Please try again.');
    } finally {
      setIsCheckingOut(false);
    }
  }, [clearCart, router]);

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

      <div
        className={styles.cartItems}
        aria-label="Shopping cart items"
      >
        {/* Header row */}
        <div className={styles.cartHeader} role="rowgroup">
          <div role="row">
            <span role="columnheader" className={styles.productColumn}>
              Product
            </span>
            <span role="columnheader" className={styles.priceColumn}>
              Price
            </span>
            <span role="columnheader" className={styles.quantityColumn}>
              Qty
            </span>
            <span role="columnheader" className={styles.totalColumn}>
              Total
            </span>
            <span role="columnheader" className={styles.actionColumn}>
              Action
            </span>
          </div>
        </div>

        {/* Item rows */}
        <div role="rowgroup">
          {items.map((item) => (
            <div key={item._id} className={styles.cartItem} role="row">
              {/* Product cell */}
              <div className={styles.productColumn} role="cell">
                <div className={styles.productInfo}>
                  {item.imageUrl ? (
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      width={80}
                      height={80}
                      style={{ objectFit: 'cover' }}
                    />
                  ) : (
                    <div className={styles.noImage}>No image</div>
                  )}
                  <span className={styles.productName}>{item.name}</span>
                </div>
              </div>

              {/* Price cell */}
              <div className={styles.priceColumn} role="cell">
                {currency.format(item.price)}
              </div>

              {/* Quantity cell */}
              <div className={styles.quantityColumn} role="cell">
                <div className={styles.quantityControl}>
                  <button
                    type="button"
                    onClick={() =>
                      handleQuantityChange(item._id, item.quantity - 1)
                    }
                    disabled={item.quantity <= 1}
                    aria-label={`Decrease quantity of ${item.name}`}
                  >
                    –
                  </button>
                  <span aria-live="polite">{item.quantity}</span>
                  <button
                    type="button"
                    onClick={() =>
                      handleQuantityChange(item._id, item.quantity + 1)
                    }
                    aria-label={`Increase quantity of ${item.name}`}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Total cell */}
              <div className={styles.totalColumn} role="cell">
                {currency.format(item.price * item.quantity)}
              </div>

              {/* Action cell */}
              <div className={styles.actionColumn} role="cell">
                <button
                  type="button"
                  onClick={() => handleRemove(item._id, item.name)}
                  className={styles.removeButton}
                  aria-label={`Remove ${item.name}`}
                >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                      </svg>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Summary + actions */}
        <div className={styles.cartSummary}>
          <div className={styles.summaryRow}>
            <span>Subtotal:</span>
            <span>{currency.format(totalPrice)}</span>
          </div>
          <div className={styles.summaryRow}>
            <span>Shipping:</span>
            <span>FREE</span>
          </div>
          <div
            className={clsx(styles.summaryRow, styles.summaryTotal)}
          >
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
      </div>
    </div>
  );
}
