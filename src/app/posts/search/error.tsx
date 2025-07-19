'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div
      className='flex flex-col items-center justify-center gap-8 text-center'
      style={{
        paddingInline: 'clamp(16px, 11.84vw - 30.55px, 140px)',
        paddingTop: 'clamp(88px, calc(2.69rem + 5.35vw), 128px)',
        minHeight: '60vh',
      }}
    >
      <div className='flex flex-col gap-4'>
        <h1 className='text-2xl font-bold text-neutral-900'>
          Something went wrong!
        </h1>
        <p className='text-neutral-600 max-w-md'>
          We encountered an error while loading this post. Please try again or
          go back to the homepage.
        </p>
      </div>

      <div className='flex gap-4'>
        <button
          onClick={reset}
          className='px-6 py-3 bg-primary-300 text-white rounded-full hover:bg-primary-400 transition-colors'
        >
          Try again
        </button>
        <Link
          href='/'
          className='px-6 py-3 border border-neutral-300 text-neutral-700 rounded-full hover:bg-neutral-50 transition-colors'
        >
          Go to Homepage
        </Link>
      </div>
    </div>
  );
}
