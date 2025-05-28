'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import type { Order } from '@/types/order';
import styles from './OrderConfirmation.module.css';

function OrderConfirmationContent() {
  const searchParams = useSearchParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const orderId = searchParams.get('orderId');
    if (!orderId) {
      setError('No order ID provided');
      setLoading(false);
      return;
    }
    fetchOrderDetails(orderId);
  }, [searchParams]);

  const fetchOrderDetails = async (orderId: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`);
      if (!response.ok) throw new Error('Failed to fetch order details');
      const data = await response.json();
      setOrder(data.order);
    } catch {
      setError('Failed to load order details');
      toast.error('Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  const currency = new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
  });

  let content;

  if (loading) {
    content = (
      <div className={styles.message}>
        <p>Loading order details...</p>
      </div>
    );
  } else if (error || !order) {
    content = (
      <div className={styles.message}>
        <p>{error || 'Order not found'}</p>
        <Link href="/store" className={styles.continueButton}>
          Continue Shopping
        </Link>
      </div>
    );
  } else {
    content = (
      <>
        <div className={styles.successIcon}>
          {/* Success icon SVG */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-16 h-16"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h1 className={styles.title}>Order Confirmed!</h1>
        <div className={styles.message}>
          <p>Thank you for your purchase. Your order has been successfully processed.</p>
          <p className={styles.transactionId}>
            Transaction ID: <strong>{order._id}</strong>
          </p>
        </div>
        <div className={styles.orderSummary}>
          <h2 className={styles.summaryTitle}>Order Summary</h2>
          <div className={styles.itemsList}>
            {order.items.map((item) => (
              <div key={item._id} className={styles.orderItem}>
                <div className={styles.itemDetails}>
                  <span className={styles.itemName}>{item.name}</span>
                  <span className={styles.itemQuantity}>Qty: {item.quantity}</span>
                </div>
                <span className={styles.itemPrice}>
                  {currency.format(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>
          <div className={styles.totalSection}>
            <div className={styles.totalRow}>
              <span className={styles.totalLabel}>Total:</span>
              <span className={styles.totalAmount}>{currency.format(order.total)}</span>
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
      </>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>Order Confirmation</h1>
        {content}
      </div>
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense
      fallback={
        <div className={styles.container}>
          <div className={styles.content}>
            <h1 className={styles.title}>Loading Order Details...</h1>
          </div>
        </div>
      }
    >
      <OrderConfirmationContent />
    </Suspense>
  );
}
