import Link from "next/link";

export default function Navbar() {
  return (    <nav className="w-full flex justify-center bg-crimson-dark text-crimson-accent py-4 shadow-md mb-8">
      <ul className="flex gap-6 text-base font-medium">
        <li><Link href="/" className="hover:text-crimson-light">Home</Link></li>
        <li><Link href="/chat" className="hover:text-crimson-light">Chat to Crimson ai</Link></li>
        <li><Link href="/cat-fact" className="hover:text-crimson-light">Cat Fact</Link></li>
        <li><Link href="/contact" className="hover:text-crimson-light">Contact Us</Link></li>
        {/* <li><Link href="/gallery" className="hover:text-crimson-light">Gallery</Link></li> */}
        {/* <li><Link href="/data-example" className="hover:text-crimson-light">Data Example</Link></li> */}
        {/* <li><Link href="/Todo" className="hover:text-crimson-light">Todo</Link></li> */}
      </ul>
    </nav>
  );
}
