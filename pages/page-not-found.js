// pages/404.js
import Link from 'next/link';

const Custom404 = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <h1 className="text-6xl font-bold">404</h1>
      <p className="mt-4 text-xl">Page Not Found</p>
      <Link href="/"
         className="mt-4 text-green-500 underline">Go back to Home
      </Link>
    </div>
  );
};

export default Custom404;
