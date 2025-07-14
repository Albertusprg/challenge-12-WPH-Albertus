import type React from 'react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import UseScreenSize from '../../../hooks/useScreenSize';
import Link from 'next/link';
import { X, Search } from 'lucide-react';

const SearchBar = () => {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const { isDesktop } = UseScreenSize();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/posts/search?query=${encodeURIComponent(query.trim())}`);
      if (!isDesktop) setIsOpen(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  return (
    <>
      {/* Mobile Icon Trigger */}
      {!isDesktop && !isOpen && (
        <Link
          href={'/posts/search'}
          className='p-1 hover:bg-neutral-800 cursor-pointer'
        >
          <Search size={24} />
        </Link>
      )}

      {/* Desktop Search Bar */}
      {isDesktop && (
        <form onSubmit={handleSubmit} className='flex items-center gap-2'>
          <div className='flex px-16 py-12 gap-8 items-center justify-center rounded-xl w-373 h-48 border border-neutral-300 focus:ring-2 focus:ring-primary-500 transition-all'>
            <button
              type='submit'
              className='p-2 hover:bg-neutral-400 rounded transition-colors cursor-pointer'
              disabled={!query.trim()}
            >
              <Search size={24} />
            </button>
            <input
              type='text'
              placeholder='Search'
              value={query}
              className='w-full text-sm font-regular placeholder-neutral-500'
              onChange={handleInputChange}
              autoComplete='off'
            />
            {query && (
              <button
                type='button'
                onClick={() => setQuery('')}
                className='relative top-1/2 right-2 transform -translate-y-1/2 text-neutral-400 cursor-pointer'
              >
                <X size={24} />
              </button>
            )}
          </div>
        </form>
      )}
    </>
  );
};

export default SearchBar;
