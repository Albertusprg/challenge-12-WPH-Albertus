'use client';

import type React from 'react';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import PostCard from '@/components/container/postCard/PostCard';
import { searchPosts } from '@/lib/api-client';
import type { BlogPostProps } from '@/interfaces/BlogProps.interface';
import Image from 'next/image';
import Link from 'next/link';
import { Search, X } from 'lucide-react';
import useScreenSize from '@/hooks/useScreenSize';

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get('query');
  const [searchResults, setSearchResults] = useState<BlogPostProps[] | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [querySearch, setQuerySearch] = useState('');
  const { isDesktop } = useScreenSize();

  const fetchSearchResults = useCallback(async (searchQuery: string) => {
    setIsLoading(true);
    setSearchResults(null);
    try {
      const data = await searchPosts(searchQuery);
      setSearchResults(data.data);
    } catch (error) {
      console.error('Failed to fetch search results:', error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuerySearch(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (querySearch.trim()) {
      router.push(
        `/posts/search?query=${encodeURIComponent(querySearch.trim())}`
      );
    }
  };
  useEffect(() => {
    if (query) {
      fetchSearchResults(query);
    } else {
      setSearchResults([]);
    }
  }, [query, fetchSearchResults]);

  return (
    <div
      className={`flex flex-col pt-24 lg:pt-48 gap-24 ${
        searchResults?.length === 0 ? 'items-center' : 'items-start'
      }`}
      style={{
        paddingInline: 'clamp(16px, calc(-1.44rem + 9.93vw), 120px)',
        paddingTop: 'clamp(88px, calc(2.69rem + 5.35vw), 128px)',
      }}
    >
      {!isDesktop && (
        <form
          onSubmit={handleSubmit}
          className='flex items-center gap-2 w-full'
        >
          <div className='flex px-16 py-12 rounded-xl w-full h-48 border border-neutral-300 focus:ring-2 focus:ring-primary-500 transition-all gap-8'>
            <button
              type='submit'
              className='p-2 hover:bg-neutral-400 rounded transition-colors cursor-pointer flex items-center justify-center'
              disabled={!querySearch.trim()}
            >
              <Search size={24} color='#717680' />
            </button>
            <input
              type='text'
              placeholder='Search'
              value={querySearch}
              className='w-full text-sm font-regular placeholder-neutral-500'
              onChange={handleInputChange}
              autoComplete='off'
            />
            {querySearch && (
              <button
                type='button'
                onClick={() => setQuerySearch('')}
                className='relative top-1/2 right-2 transform -translate-y-1/2 text-neutral-400 cursor-pointer'
              >
                <X size={24} />
              </button>
            )}
          </div>
        </form>
      )}

      <h1 className='text-3xl font-bold text-neutral-900 mb-8'>
        {query ? `Result for"${query}"` : ''}
      </h1>

      {isLoading && <p>Searching...</p>}

      {!isLoading && searchResults && searchResults.length > 0 && (
        <div className='flex flex-col max-w-807 gap-8'>
          {searchResults.map((post, index) => (
            <div key={post.id}>
              <PostCard post={post} index={index} />
            </div>
          ))}
        </div>
      )}

      {!isLoading && searchResults && searchResults.length === 0 && query && (
        <div className='flex flex-col justify-center items-center gap-24'>
          <Image
            src={'/icon/no-result.png'}
            alt='no-result'
            width={100}
            height={100}
            className='h-135'
          />
          <div className='text-center'>
            <p className='text-sm font-semibold text-neutral-950'>
              No results found.
            </p>
            <p className='text-sm text-neutral-950'>
              Try using different keywords
            </p>
          </div>
          <Link
            href='/'
            className='flex items-center text-center justify-center text-sm font-regular w-200 h-44 bg-primary-300 rounded-full text-white mb-50'
          >
            Back To Home
          </Link>
        </div>
      )}
    </div>
  );
}
