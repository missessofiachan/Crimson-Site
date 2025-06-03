import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Navbar from './Navbar';
import { Providers } from './providers';
import ToastProvider from './toast-provider';
import GoogleAnalyticsScripts from '../components/GoogleAnalyticsScripts';
import GoogleAnalytics from '../components/GoogleAnalytics';
import CriticalResourceHints from '../components/CriticalResourceHints';
import ServiceWorkerRegistration from '../components/ServiceWorkerRegistration';
import WebVitalsMonitor from '../components/WebVitalsMonitor';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',
  preload: true,
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
  preload: true,
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
        <CriticalResourceHints />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <GoogleAnalytics />
        <ServiceWorkerRegistration />
        <WebVitalsMonitor />
        <Providers>
          <Navbar />
          <main className="pt-24">{children}</main>
          <ToastProvider />
        </Providers>
      </body>
    </html>
  );
}
