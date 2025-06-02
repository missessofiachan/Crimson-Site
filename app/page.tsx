import Link from 'next/link';

export const metadata = {
  title: 'Crimson Store | Home',
  description:
    'Your one-stop destination for all things related to the Crimson Store. Discover products, deals, and more!',
};

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4  text-crimson-dark">
      <h1 className="text-4xl font-bold mb-4">Welcome to Crimson Store</h1>
      <p className="mb-8">Your one-stop destination for all things related to the Crimson Store</p>
      <Link href="/about" className="text-crimson underline">
        Learn more about us
      </Link>
      <Link
        href="/store"
        className="mt-6 px-6 py-3 bg-crimson text-white rounded-lg text-lg font-semibold shadow transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-crimson-dark focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-crimson-dark transform-gpu hover:-translate-y-0.5 hover:scale-105"
      >
        Shop Now
      </Link>
    </main>
  );
}
