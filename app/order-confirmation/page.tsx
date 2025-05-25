'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import styles from './OrderConfirmation.module.css';

interface OrderItem {
  _id: string;
  name: string;
  price: number;
  quantity: number;
}

export default function OrderConfirmationPage() {
  const searchParams = useSearchParams();
  const [orderDetails, setOrderDetails] = useState<{
    transactionId: string;
    items: OrderItem[];
    total: number;
  } | null>(null);

  useEffect(() => {
    // Get order details from URL parameters
    const transactionId = searchParams.get('transactionId');
    const itemsParam = searchParams.get('items');
    const totalParam = searchParams.get('total');

    if (transactionId && itemsParam && totalParam) {
      try {
        const items = JSON.parse(decodeURIComponent(itemsParam));
        const total = parseFloat(totalParam);
        
        setOrderDetails({
          transactionId,
          items,
          total
        });
      } catch (error) {
        console.error('Error parsing order details:', error);
      }
    }
  }, [searchParams]);

  if (!orderDetails) {
    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <h1 className={styles.title}>Order Confirmation</h1>
          <div className={styles.message}>
            <p>Loading order details...</p>
          </div>
          <Link href="/store" className={styles.continueButton}>
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.successIcon}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        
        <h1 className={styles.title}>Order Confirmed!</h1>
        
        <div className={styles.message}>
          <p>Thank you for your purchase. Your order has been successfully processed.</p>
          <p className={styles.transactionId}>
            Transaction ID: <strong>{orderDetails.transactionId}</strong>
          </p>
        </div>

        <div className={styles.orderSummary}>
          <h2 className={styles.summaryTitle}>Order Summary</h2>
          <div className={styles.itemsList}>
            {orderDetails.items.map((item) => (
              <div key={item._id} className={styles.orderItem}>
                <div className={styles.itemDetails}>
                  <span className={styles.itemName}>{item.name}</span>
                  <span className={styles.itemQuantity}>Qty: {item.quantity}</span>
                </div>
                <span className={styles.itemPrice}>
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
          
          <div className={styles.totalSection}>
            <div className={styles.totalRow}>
              <span className={styles.totalLabel}>Total:</span>
              <span className={styles.totalAmount}>${orderDetails.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className={styles.nextSteps}>
          <h3 className={styles.nextStepsTitle}>What's Next?</h3>
          <ul className={styles.stepsList}>
            <li>You will receive an email confirmation shortly</li>
            <li>Your order will be processed within 1-2 business days</li>
            <li>You'll receive shipping information once your order ships</li>
          </ul>
        </div>

        <div className={styles.actions}>
          <Link href="/store" className={styles.continueButton}>
            Continue Shopping
          </Link>
          <Link href="/dashboard/profile" className={styles.profileButton}>
            View Order History
          </Link>
        </div>
      </div>
    </div>
  );
}
