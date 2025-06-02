import Link from 'next/link';

export const metadata = {
  title: 'Crimson Store | Home',
  description: 'Your one-stop destination for all things related to the Crimson Store. Discover products, deals, and more!'
};

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 bg-zinc-900 text-crimson-dark">
      <h1 className="text-4xl font-bold mb-4">Welcome to Crimson Store</h1>
      <p className="mb-8">Your one-stop destination for all things related to the Crimson Store</p>
      <Link href="/about" className="text-crimson underline">
        Learn more about us
      </Link>
      <Link href="/store" className="mt-6 px-6 py-3 bg-crimson text-white rounded-lg text-lg font-semibold shadow hover:bg-crimson-dark transition-colors duration-200">
        Shop Now
      </Link>
    </main>
  );
}
