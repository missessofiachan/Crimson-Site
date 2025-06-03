// create basic faq
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'FAQ | Crimson E-Commerce',
  description: 'Frequently Asked Questions about Crimson E-Commerce',
};

export default function FAQPage() {
  return (
    <div className="container min-h-screen flex flex-col items-center justify-center  text-crimson-dark">
      <h1 className="title">Frequently Asked Questions</h1>
      <div className="w-full max-w-2xl space-y-6 mb-8">
        <div className="bg-white/90 rounded-lg shadow p-6">
          <h2 className="font-semibold text-lg mb-2 text-crimson-dark">
            What is Crimson E-Commerce?
          </h2>
          <p className="text-base text-gray-700">
            Crimson E-Commerce is an online store offering a wide range of premium products with
            fast delivery and excellent customer service.
          </p>
        </div>
        <div className="bg-white/90 rounded-lg shadow p-6">
          <h2 className="font-semibold text-lg mb-2 text-crimson-dark">
            How can I place an order?
          </h2>
          <p className="text-base text-gray-700">
            You can place an order by browsing our products, adding them to your cart, and
            proceeding to checkout.
          </p>
        </div>
        <div className="bg-white/90 rounded-lg shadow p-6">
          <h2 className="font-semibold text-lg mb-2 text-crimson-dark">
            What payment methods do you accept?
          </h2>
          <p className="text-base text-gray-700">
            We accept various payment methods including credit cards, PayPal, and bank transfers.
          </p>
        </div>
        <div className="bg-white/90 rounded-lg shadow p-6">
          <h2 className="font-semibold text-lg mb-2 text-crimson-dark">
            How can I track my order?
          </h2>
          <p className="text-base text-gray-700">
            After placing your order, you will receive a confirmation email with tracking
            information.
          </p>
        </div>
      </div>
      <Link href="/contact" className="button mt-2">
        Contact Us for More Questions
      </Link>
    </div>
  );
}
