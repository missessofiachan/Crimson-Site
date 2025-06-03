import type { Metadata } from 'next';
import './globals.css';
import Navbar from './Navbar';
import { Providers } from './providers';
import GoogleAnalyticsScripts from '../components/GoogleAnalyticsScripts';
import CriticalResourceHints from '../components/CriticalResourceHints';

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
        <CriticalResourceHints />
      </head>
      <body className="antialiased">
        <Providers>
          <Navbar />
          <main className="pt-24">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
