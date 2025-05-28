'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRightIcon } from '@heroicons/react/20/solid';

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbProps {
  items?: BreadcrumbItem[];
  className?: string;
}

export default function Breadcrumb({ items, className = '' }: BreadcrumbProps) {
  const pathname = usePathname();

  // Generate breadcrumbs from pathname if no items provided
  const breadcrumbItems = items || generateBreadcrumbs(pathname);

  if (breadcrumbItems.length <= 1) {
    return null; // Don't show breadcrumbs for home page only
  }

  return (
    <nav className={`flex ${className}`} aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        {breadcrumbItems.map((item, index) => (
          <li key={item.href} className="inline-flex items-center">
            {index > 0 && (
              <ChevronRightIcon className="w-4 h-4 text-gray-400 mx-1" aria-hidden="true" />
            )}
            {index === breadcrumbItems.length - 1 ? (
              <span className="text-sm font-medium text-gray-500" aria-current="page">
                {item.label}
              </span>
            ) : (
              <Link
                href={item.href}
                className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600"
              >
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

function generateBreadcrumbs(pathname: string): BreadcrumbItem[] {
  const pathSegments = pathname.split('/').filter(Boolean);
  const breadcrumbs: BreadcrumbItem[] = [{ label: 'Home', href: '/' }];

  let currentPath = '';

  pathSegments.forEach((segment) => {
    currentPath += `/${segment}`;

    // Convert segment to readable label
    const label = formatSegmentLabel(segment);

    breadcrumbs.push({
      label,
      href: currentPath,
    });
  });

  return breadcrumbs;
}

function formatSegmentLabel(segment: string): string {
  // Handle common route patterns
  const labelMap: Record<string, string> = {
    dashboard: 'Dashboard',
    store: 'Store',
    cart: 'Shopping Cart',
    login: 'Login',
    register: 'Register',
    about: 'About',
    contact: 'Contact',
    faq: 'FAQ',
    profile: 'Profile',
    add: 'Add Product',
    edit: 'Edit',
    categories: 'Categories',
    'order-confirmation': 'Order Confirmation',
    'admin-setup': 'Admin Setup',
    chat: 'Chat',
    'cat-fact': 'Cat Facts',
  };

  if (labelMap[segment]) {
    return labelMap[segment];
  }

  // Convert kebab-case to Title Case
  return segment
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
