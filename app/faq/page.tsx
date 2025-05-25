// create basic faq
import { Metadata } from 'next';
import Link from 'next/link';
import styles from './FAQ.module.css';

export const metadata: Metadata = {
  title: 'FAQ | Crimson E-Commerce',
  description: 'Frequently Asked Questions about Crimson E-Commerce',
};

export default function FAQPage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Frequently Asked Questions</h1>
      <div className={styles.faqList}>
        <div className={styles.faqItem}>
          <h2 className={styles.question}>What is Crimson E-Commerce?</h2>
          <p className={styles.answer}>
            Crimson E-Commerce is an online store offering a wide range of premium products with fast delivery and excellent customer service.
          </p>
        </div>
        <div className={styles.faqItem}>
          <h2 className={styles.question}>How can I place an order?</h2>
          <p className={styles.answer}>
            You can place an order by browsing our products, adding them to your cart, and proceeding to checkout.
          </p>
        </div>
        <div className={styles.faqItem}>
          <h2 className={styles.question}>What payment methods do you accept?</h2>
          <p className={styles.answer}>
            We accept various payment methods including credit cards, PayPal, and bank transfers.
          </p>
        </div>
        <div className={styles.faqItem}>
          <h2 className={styles.question}>How can I track my order?</h2>
          <p className={styles.answer}>
            After placing your order, you will receive a confirmation email with tracking information.
          </p>
        </div>
      </div>
      <Link href="/contact" className={styles.contactLink}>
        Contact Us for More Questions
      </Link>
    </div>
  );
}
