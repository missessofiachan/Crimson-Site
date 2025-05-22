'use client';

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useCart } from "@/lib/cart";

export default function Navbar() {
  const { data: session } = useSession();
  const { totalItems } = useCart();
  
  return (    
    <nav className="w-full flex justify-center bg-crimson-dark text-crimson-accent py-4 shadow-md mb-8 fixed top-0 left-0 right-0 z-10">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold hover:text-crimson-light">
          Crimson E-Commerce
        </Link>
        
        <ul className="flex gap-6 text-base font-medium items-center">
          <li><Link href="/" className="hover:text-crimson-light">Home</Link></li>
          <li><Link href="/store" className="hover:text-crimson-light">Store</Link></li>
          <li><Link href="/chat" className="hover:text-crimson-light">Chat</Link></li>
          <li><Link href="/contact" className="hover:text-crimson-light">Contact</Link></li>
          <li><Link href="/cat-fact" className="hover:text-crimson-light">Cat Fact</Link></li>
          <li><Link href="/DUGGA-DOO" className="hover:text-crimson-light">DUGGA DOO</Link></li>
          
          {/* Cart Link with counter */}
          <li>
            <Link href="/cart" className="hover:text-crimson-light relative flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-crimson text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
          </li>
          
          {session ? (
            <li><Link href="/dashboard" className="hover:text-crimson-light">Dashboard</Link></li>
          ) : (
            <li><Link href="/login" className="hover:text-crimson-light">Login</Link></li>
          )}
        </ul>
      </div>
    </nav>
  );
}
