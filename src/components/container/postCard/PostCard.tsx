'use client';

import useScreenSize from '@/hooks/useScreenSize';
import type { PostCardProps, User } from '@/interfaces/BlogProps.interface';
import { getPostComments, getUserById, likePost } from '@/lib/api-client';
import { MessageSquare, ThumbsUp } from 'lucide-react';
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

const PostCard: React.FC<PostCardProps> = ({ post, index }) => {
  const { isDesktop } = useScreenSize();
  const [userPost, setUserPost] = useState<User | null>(null);
  const [commentPost, setCommentPost] = useState<Comment[] | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user data
        if (post?.author?.id) {
          const userData = await getUserById(String(post.author.id));
          setUserPost(userData);
        }

        // Fetch comments
        if (post?.id) {
          const commentsData = await getPostComments(post.id);
          setCommentPost(commentsData);
        }
      } catch (error) {
        console.error('Failed to fetch post card data:', error);
      }
    };

    fetchData();
  }, [post]);

  const handleLikePost = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await likePost(String(post.id));
    } catch (error) {
      console.error('Failed to like post:', error);
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
            className='object-cover w-340 h-258 rounded-sm'
          />
        </Link>
      )}
      <div className='flex flex-col gap-12 pt-16 w-full'>
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
          <ThumbsUp
            size={20}
            onClick={handleLikePost}
            className='cursor-pointer'
          />
          <span>{post?.likes}</span> <MessageSquare size={20} />
          <span>{commentPost?.length || 0}</span>
        </div>
        <hr style={{ borderColor: '#d5d7da' }} className='w-full lg:hidden' />
      </div>
    </div>
  );
};

export default PostCard;
