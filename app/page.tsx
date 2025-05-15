import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 bg-crimson-light text-crimson-dark">
      <h1 className="text-4xl font-bold mb-4">Welcome to Crimson Alloy</h1>
      <p className="mb-8">
        Your one-stop destination for all things related to the Crimson Alloy Technologies.
      </p>
      <Link href="/about" className="text-crimson underline">
        Learn more about us
      </Link>
    </main>
  );
}
