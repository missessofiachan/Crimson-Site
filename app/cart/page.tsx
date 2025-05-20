'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/lib/cart';
import { toast } from 'react-hot-toast';
import styles from './Cart.module.css';

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, totalItems, totalPrice, clearCart } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    updateQuantity(itemId, newQuantity);
  };

  const handleRemoveItem = (itemId: string, itemName: string) => {
    removeFromCart(itemId);
    toast.success(`${itemName} removed from cart`);
  };

  const handleCheckout = async () => {
    // This would normally connect to a payment processor
    // For demo purposes, we'll just simulate a checkout process
    setIsCheckingOut(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Clear cart and show success
    clearCart();
    setIsCheckingOut(false);
    toast.success('Order placed successfully!');
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>Your Shopping Cart</h1>
      
      {totalItems === 0 ? (
        <div className={styles.emptyCart}>
          <div className={styles.emptyCartIcon}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
            </svg>
          </div>
          <h2>Your cart is empty</h2>
          <p>Looks like you haven't added anything to your cart yet.</p>
          <Link href="/store" className={styles.continueShopping}>
            Continue Shopping
          </Link>
        </div>
      ) : (
        <>
          <div className={styles.cartItems}>
            <div className={styles.cartHeader}>
              <span className={styles.productColumn}>Product</span>
              <span className={styles.priceColumn}>Price</span>
              <span className={styles.quantityColumn}>Quantity</span>
              <span className={styles.totalColumn}>Total</span>
              <span className={styles.actionColumn}></span>
            </div>
            
            {items.map(item => (
              <div key={item._id} className={styles.cartItem}>
                <div className={styles.productColumn}>
                  <div className={styles.productInfo}>
                    {item.imageUrl ? (
                      <div className={styles.productImage}>
                        <Image 
                          src={item.imageUrl} 
                          alt={item.name} 
                          width={80} 
                          height={80} 
                          style={{ objectFit: 'cover' }}
                        />
                      </div>
                    ) : (
                      <div className={styles.noImage}>No image</div>
                    )}
                    <span className={styles.productName}>{item.name}</span>
                  </div>
                </div>
                
                <div className={styles.priceColumn}>
                  ${item.price.toFixed(2)}
                </div>
                
                <div className={styles.quantityColumn}>
                  <div className={styles.quantityControl}>
                    <button 
                      onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      aria-label="Decrease quantity"
                    >-</button>
                    <span>{item.quantity}</span>
                    <button 
                      onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                      aria-label="Increase quantity"
                    >+</button>
                  </div>
                </div>
                
                <div className={styles.totalColumn}>
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
                
                <div className={styles.actionColumn}>
                  <button 
                    onClick={() => handleRemoveItem(item._id, item.name)}
                    className={styles.removeButton}
                    aria-label={`Remove ${item.name} from cart`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
            
            <div className={styles.cartSummary}>
              <div className={styles.summaryRow}>
                <span>Subtotal:</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              <div className={styles.summaryRow}>
                <span>Shipping:</span>
                <span>FREE</span>
              </div>
              <div className={`${styles.summaryRow} ${styles.summaryTotal}`}>
                <span>Total:</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              
              <button 
                className={styles.checkoutButton}
                onClick={handleCheckout}
                disabled={isCheckingOut}
              >
                {isCheckingOut ? 'Processing...' : 'Proceed to Checkout'}
              </button>
              
              <Link href="/store" className={styles.continueShopping}>
                Continue Shopping
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
