export default function Footer() {
  return (
    <footer className="w-full flex justify-center bg-crimson-dark text-crimson-accent py-4 mt-8 border-t border-crimson">
      <div className="flex gap-6 text-sm">
        <a href="/" className="hover:underline text-crimson-accent">Home</a>
        {/* <a href="/gallery" className="hover:underline text-crimson-accent">Gallery</a> */}
      </div>
    </footer>
  );
}
