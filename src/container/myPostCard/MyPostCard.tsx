'use client';

import useScreenSize from '@/hooks/useScreenSize';
import type { PostCardProps, User } from '@/interfaces/BlogProps.interface';
import { deletePost, getUserById } from '@/lib/api-client';
import Image from 'next/image';
import Link from 'next/link';
import type React from 'react';
import { useEffect, useState } from 'react';

const formatDateToIndonesian = (isoDate: string): string => {
  const date = new Date(isoDate);
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

const MyPostCard: React.FC<PostCardProps> = ({ post, index }) => {
  const [isStatistic, setIsStatistic] = useState(false);
  const { isDesktop } = useScreenSize();
  const [userPost, setUserPost] = useState<User | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user data
        if (post?.author?.id) {
          const userData = await getUserById(String(post.author.id));
          setUserPost(userData);
        }
      } catch (error) {
        console.error('Failed to fetch post card data:', error);
      }
    };

    fetchData();
  }, [post]);

  const handleDeletePost = async (id: string) => {
    try {
      await deletePost(id);
      window.location.reload();
    } catch (error) {
      console.error('Failed to delete post:', error);
    }
  };

  return (
    <div key={index} className='flex gap-24 lg:border-b border-neutral-300'>
      {isDesktop && (
        <Link href={`/posts/${post.id}`} className='shrink-0 py-24'>
          <Image
            src={`${post.imageUrl}`}
            alt='Logo'
            width={340}
            height={258}
            className='object-cover max-w-340 max-h-258 rounded-sm'
          />
        </Link>
      )}
      <div className='flex flex-col gap-12 pt-16 max-w-full'>
        <div className='flex flex-col gap-8'>
          <Link href={`/posts/${post.id}`} className='text-md font-bold'>
            {post.title}
          </Link>
          <div className='flex gap-8'>
            {post.tags?.map((tag, idx) => (
              <div
                key={idx}
                className='flex px-8 py-2 items-center justify-center text-xs font-regular border border-neutral-300 rounded-md h-28 truncate'
              >
                {tag}
              </div>
            ))}
          </div>
          <div className='line-clamp-2 max-w-full text-xs font-regular overflow-hidden'>
            {post.content}
          </div>
        </div>
        <div className='flex items-center justify-start gap-8'>
          <Image
            src={
              userPost?.avatarUrl
                ? `https://blogger-wph-api-production.up.railway.app${userPost.avatarUrl}`
                : '/user.svg'
            }
            alt='Logo'
            width={30}
            height={30}
            className='rounded-full object-cover w-30 h-30'
          />
          <p className='text-xs font-regular'>{post.author?.name}</p>
          <Image src='/ellipse.svg' alt='dot' width={4} height={4} />
          <p className='text-xs font-regular text-neutral-600'>
            {post.createdAt ? formatDateToIndonesian(post.createdAt) : ''}
          </p>
        </div>
        <div className='flex items-center justify-start gap-8 mb-16'>
          <span
            onClick={() => {
              setIsStatistic(!isStatistic);
            }}
            className='text-sm font-semibold text-primary-300 underline'
          >
            Statistic
          </span>
          <Link
            href={`/posts/${post.id}/editpost`}
            className='text-sm font-semibold text-primary-300 underline'
          >
            Edit
          </Link>
          <span
            onClick={
              post?.id ? () => handleDeletePost(post.id as string) : undefined
            }
            className='text-sm font-semibold text-[#EE1D52] underline cursor-pointer'
          >
            Delete
          </span>
        </div>
        <hr style={{ borderColor: '#d5d7da' }} className='lg:hidden' />
      </div>
    </div>
  );
};

export default MyPostCard;
