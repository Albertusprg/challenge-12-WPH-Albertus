'use client';

import PostCard from '@/components/container/postCard/PostCard';
import {
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  ThumbsUp,
} from 'lucide-react';
import { useEffect, useState, useCallback, useMemo } from 'react';
import type { BlogPostProps } from '@/interfaces/BlogProps.interface';
import { getMostLikedPosts, getRecommendedPosts } from '@/lib/api-client';
import Link from 'next/link';

export default function Home() {
  const postsPerPage = 5;
  const [recommendedPost, setRecommendedPost] = useState<
    BlogPostProps[] | null
  >(null);
  const [mostLikedPost, setMostLikedPost] = useState<BlogPostProps[] | null>(
    null
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const fetchRecommendedPost = useCallback(
    async (page: number) => {
      setIsLoading(true);
      try {
        const data = await getRecommendedPosts(page, postsPerPage);
        setRecommendedPost(data.data);
        setTotalPosts(data.total);
      } catch (error) {
        console.error('Failed to fetch recommended posts:', error);
        setRecommendedPost([]);
        setTotalPosts(0);
      } finally {
        setIsLoading(false);
      }
    },
    [postsPerPage]
  );

  const fetchMostLikedPost = async () => {
    try {
      const data = await getMostLikedPosts();
      setMostLikedPost(data.data);
    } catch (error) {
      console.error('Failed to fetch most liked posts:', error);
    }
  };

  useEffect(() => {
    fetchRecommendedPost(currentPage);
  }, [currentPage, fetchRecommendedPost]);

  useEffect(() => {
    fetchMostLikedPost();
  }, []);

  const totalPages = useMemo(() => {
    if (!totalPosts) return 1;
    return Math.ceil(totalPosts / postsPerPage);
  }, [totalPosts, postsPerPage]);

  const getPaginationNumbers = () => {
    const pageNumbers: (number | string)[] = [];
    const maxVisiblePages = 5;
    const delta = 1;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
      return pageNumbers;
    }

    const range = [];
    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    const pages = [1, ...range, totalPages];

    const uniquePages = [...new Set(pages)].sort((a, b) => a - b);

    let lastPage = 0;
    const finalPages = [];
    for (const page of uniquePages) {
      if (page > lastPage + 1) {
        finalPages.push('...');
      }
      finalPages.push(page);
      lastPage = page;
    }

    if (!finalPages.includes(currentPage)) {
      finalPages.splice(finalPages.indexOf('...'), 0, currentPage);
    }

    return finalPages;
  };

  const paginationNumbers = getPaginationNumbers();

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  return (
    <div
      className='text-neutral-900 flex flex-col lg:flex-row lg:justify-center mb-24'
      style={{
        marginInline: 'clamp(16px, 11.84vw - 30.55px, 140px)',
        paddingTop: 'clamp(88px, calc(2.69rem + 5.35vw), 128px)',
      }}
    >
      {/* Recommended Posts Section */}
      <div className='flex flex-col'>
        <h1 className='text-xl font-bold'>Recommend For You</h1>
        {isLoading ? (
          <p className='text-center py-16 text-neutral-500'>Loading posts...</p>
        ) : (
          recommendedPost?.map((post, index) => (
            <div className='max-w-full overflow-hidden' key={post.id || index}>
              <PostCard post={post} index={index} />
            </div>
          ))
        )}

        {/* Pagination Controls */}
        {recommendedPost && totalPages > 1 && (
          <div className='flex justify-center items-center px-24 mt-16 gap-8'>
            <button
              className='flex gap-6 text-xs font-regular items-center justify-center cursor-pointer'
              onClick={handlePreviousPage}
              disabled={currentPage === 1 || isLoading}
            >
              <ChevronLeft size={24} />
              Previous
            </button>

            {/* Render pagination buttons dynamically */}
            {paginationNumbers.map((pageNumber, idx) => (
              <div key={idx}>
                {pageNumber === '...' ? (
                  <span className='text-sm font-bold mx-2'>...</span>
                ) : (
                  <button
                    onClick={() => setCurrentPage(pageNumber as number)}
                    className={`w-36 h-36 rounded-full cursor-pointer text-sm transition-colors ${
                      currentPage === pageNumber
                        ? 'bg-blue-500 text-white'
                        : 'bg-transparent text-neutral-900 hover:bg-neutral-200'
                    }`}
                  >
                    {pageNumber}
                  </button>
                )}
              </div>
            ))}

            <button
              className='flex gap-6 text-xs font-regular items-center justify-center cursor-pointer'
              onClick={handleNextPage}
              disabled={currentPage === totalPages || isLoading}
            >
              Next
              <ChevronRight size={24} />
            </button>
          </div>
        )}
      </div>

      {/* Most Liked Posts Section */}
      <hr style={{ borderColor: '#d5d7da' }} className='lg:hidden' />
      <aside className='flex flex-col px-16 pt-24 lg:border-l border-neutral-300 max-w-297'>
        <h1 className='text-xl font-bold'>Most Liked Post</h1>
        {mostLikedPost?.slice(0, 3).map((post) => (
          <Link
            href={`/posts/${post.id}`}
            key={post.id}
            className='flex flex-col gap-12 mt-16'
          >
            <div className='flex flex-col gap-8'>
              <div className='text-md font-bold'>{post.title}</div>
              <div className='line-clamp-2 text-xs font-regular'>
                {post.content}
              </div>
            </div>
            <div className='flex items-center justify-start gap-8 mb-16'>
              <ThumbsUp size={20} />
              <span>{post.likes}</span>
              <MessageSquare size={20} />
              <span>{post.comment || 0}</span>
            </div>
            <hr style={{ borderColor: '#d5d7da' }} />
          </Link>
        ))}
      </aside>
    </div>
  );
}
