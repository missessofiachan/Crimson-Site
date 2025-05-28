import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Navbar from './Navbar';
import Footer from './Footer';
import { Providers } from './providers';
import ToastProvider from './toast-provider';
import GoogleAnalyticsScripts from '../components/GoogleAnalyticsScripts';
import GoogleAnalytics from '../components/GoogleAnalytics';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Crimson E-Commerce | Premium Products & Fast Delivery',
  description:
    'Discover premium products at Crimson E-Commerce. Shop our curated collection with fast delivery and excellent customer service.',
  keywords: 'e-commerce, shopping, premium products, online store, crimson',
  authors: [{ name: 'Crimson E-Commerce Team' }],
  robots: 'index, follow',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <GoogleAnalyticsScripts />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <GoogleAnalytics />
        <Providers>
          {' '}
          <Navbar />
          <main className="pt-24">
            {/* Adjusted padding to match enhanced navbar height */}
            {children}
          </main>
          <ToastProvider />
        </Providers>
      </body>
    </html>
  );
}
