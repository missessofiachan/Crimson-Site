'use client';

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useCart } from "@/lib/cart";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const { data: session } = useSession();
  const { totalItems } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  // Handle scroll effect for navbar appearance
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      setScrolled(isScrolled);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when a new page is navigated to
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);
  
  const navLinkClass = (path: string) => {
    const baseClass = "transition-colors duration-200 hover:text-crimson-light relative py-2 px-1";
    const activeClass = pathname === path 
      ? "after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-crimson-accent after:scale-x-100 after:origin-left after:transition-transform"
      : "after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-crimson-accent after:scale-x-0 after:origin-left after:transition-transform hover:after:scale-x-100";
    return `${baseClass} ${activeClass}`;
  };
  
  return (    
    <nav className={`w-full flex justify-center bg-crimson-dark text-crimson-accent py-4 shadow-lg fixed top-0 left-0 right-0 z-20 transition-all duration-300 ${
      scrolled ? "py-2 shadow-xl" : "py-4"
    }`}>
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold hover:text-crimson-light transition-colors duration-200 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z" />
          </svg>
          Crimson E-Commerce
        </Link>
        
        {/* Mobile menu button */}
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)} 
          className="lg:hidden text-crimson-accent focus:outline-none" 
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            {isMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            )}
          </svg>
        </button>
          {/* Desktop Navigation */}
        <ul className="hidden lg:flex gap-6 text-base font-medium items-center">
          <li><Link href="/" className={navLinkClass("/")}>Home</Link></li>
          <li><Link href="/store" className={navLinkClass("/store")}>Store</Link></li>
          <li><Link href="/about" className={navLinkClass("/about")}>About</Link></li>
          <li><Link href="/faq" className={navLinkClass("/faq")}>FAQ</Link></li>
          <li><Link href="/chat" className={navLinkClass("/chat")}>Chat</Link></li>
          <li><Link href="/contact" className={navLinkClass("/contact")}>Contact</Link></li>
          <li><Link href="/cat-fact" className={navLinkClass("/cat-fact")}>Cat Fact</Link></li>
      
          {/* Cart Link with counter */}
          <li>
            <Link href="/cart" className={`${navLinkClass("/cart")} relative flex items-center`}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-crimson text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                  {totalItems}                </span>
              )}
            </Link>
          </li>
          
          {session ? (
            <li className="group relative">
              <button 
                className="flex items-center gap-2 py-2 px-3 rounded-full bg-crimson focus:outline-none hover:bg-crimson-light transition-colors duration-200 text-white"
                aria-label="User menu"
              >
                <span className="font-medium text-sm truncate max-w-[100px]">
                  {session.user?.name || session.user?.email?.split('@')[0] || 'User'}
                </span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                </svg>
              </button>
              
              {/* Dropdown menu */}
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg overflow-hidden z-20 scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-200 origin-top-right">
                <Link href="/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Dashboard
                </Link>
                <Link href="/dashboard/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Profile
                </Link>
                <button 
                  onClick={() => signOut()}
                  className="block w-full text-left px-4 py-2 text-sm text-crimson-dark hover:bg-gray-100"
                >
                  Sign out
                </button>
              </div>
            </li>
          ) : (            <li>
              <Link 
                href="/login" 
                className={`py-2 px-4 rounded-md ${pathname === "/login" 
                  ? "bg-crimson-accent text-crimson-dark" 
                  : "bg-transparent border-2 border-crimson-accent hover:bg-crimson-accent hover:text-crimson-dark"} 
                  transition-colors duration-200 flex items-center gap-1`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
                </svg>
                Login
              </Link>
            </li>
          )}
        </ul>
          {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-crimson-dark border-t border-crimson-light shadow-lg animate-fadeIn">
            <ul className="flex flex-col text-base font-medium py-4 px-6 space-y-4">
              <li><Link href="/" className={navLinkClass("/")}>Home</Link></li>
              <li><Link href="/store" className={navLinkClass("/store")}>Store</Link></li>
              <li><Link href="/about" className={navLinkClass("/about")}>About</Link></li>
              <li><Link href="/faq" className={navLinkClass("/faq")}>FAQ</Link></li>
              <li><Link href="/chat" className={navLinkClass("/chat")}>Chat</Link></li>
              <li><Link href="/contact" className={navLinkClass("/contact")}>Contact</Link></li>
              <li><Link href="/cat-fact" className={navLinkClass("/cat-fact")}>Cat Fact</Link></li>
              
              <li>
                <Link href="/cart" className={`${navLinkClass("/cart")} flex items-center gap-2`}>
                  Cart
                  {totalItems > 0 && (
                    <span className="bg-crimson text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {totalItems}
                    </span>
                  )}
                </Link>
              </li>
              
              {session ? (
                <>
                  <li><Link href="/dashboard" className={navLinkClass("/dashboard")}>Dashboard</Link></li>
                  <li><Link href="/dashboard/profile" className={navLinkClass("/dashboard/profile")}>Profile</Link></li>
                  <li>
                    <button 
                      onClick={() => signOut()}
                      className="w-full text-left flex items-center gap-2 text-crimson-accent hover:text-crimson-light transition-colors duration-200"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h7.5" />
                      </svg>
                      Sign out
                    </button>
                  </li>
                </>
              ) : (                <li>
                  <Link 
                    href="/login" 
                    className={`${navLinkClass("/login")} flex items-center gap-2`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
                    </svg>
                    Login
                  </Link>
                </li>
              )}
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
}
