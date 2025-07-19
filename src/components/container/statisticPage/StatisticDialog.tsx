'use client';

import Dialog from '@/components/ui/Dialog';
import Tabs from '@/components/ui/Tabs/Tabs';
import { Comment } from '@/interfaces/BlogProps.interface';
import { getLikedPosts, getPostComments } from '@/lib/api-client';
import { MessageSquare, ThumbsUp } from 'lucide-react';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';

type likedPostProps = {
  id: string;
  name: string;
  headline: string;
  avatarUrl: string;
};

interface StatisticDialogProps {
  id: string;
  isOpen: boolean;
  onClose: () => void;
}

const formatDateToIndonesian = (isoDate: string): string => {
  const date = new Date(isoDate);
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

const StatisticDialog: React.FC<StatisticDialogProps> = ({
  isOpen,
  id,
  onClose,
}) => {
  const [totalLikes, setTotalLikes] = useState(0);
  const [likedPost, setLikedPost] = useState<likedPostProps[]>([]);
  const [totalComments, setTotalComments] = useState(0);
  const [commentPost, setCommentPost] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('tab1');
  useEffect(() => {
    setIsLoading(true);
    const fetchData = async () => {
      try {
        const likedPosts = await getLikedPosts(id);
        setLikedPost(likedPosts.data);
        setTotalLikes(likedPosts.data.length);

        const commentsData = await getPostComments(id as string);
        setTotalComments(commentsData.length);
        setCommentPost(commentsData);
      } catch (error) {
        console.log('Data Fetch error', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id]);

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title='Statistic'
      className='max-w-613 p-24'
    >
      <Tabs
        label='statistic-tabs'
        trigger1={
          <div
            onClick={() => setActiveTab('tab1')}
            className={`${
              activeTab === 'tab1' ? 'text-primary-300' : 'text-neutral-950'
            }`}
          >
            <ThumbsUp size={20} className='inline-block mr-4' />
            Like
          </div>
        }
        trigger2={
          <div
            onClick={() => setActiveTab('tab2')}
            className={`${
              activeTab === 'tab2' ? 'text-primary-300' : 'text-neutral-950'
            }`}
          >
            <MessageSquare size={20} className='inline-block mr-4' />
            Comment
          </div>
        }
        children1={
          <div className='flex flex-col justify-start items-start w-full'>
            {isLoading ? (
              ''
            ) : (
              <div className='flex justify-start items-center mt-12 mb-12'>
                <p className='font-bold text-sm md:text-lg'>
                  Like ({totalLikes})
                </p>
              </div>
            )}
            {isLoading
              ? 'Loading...'
              : likedPost.map((post) => (
                  <div key={post.id} className='w-full'>
                    <div className='flex gap-12 items-start border-b border-neutral-300 py-12'>
                      <Image
                        src={
                          post.avatarUrl
                            ? `https://blogger-wph-api-production.up.railway.app${post.avatarUrl}`
                            : '/user.svg'
                        }
                        alt={post.name}
                        width={48}
                        height={48}
                        className='rounded-full object-cover w-40 h-40 md:w-48 md:h-48'
                      />
                      <div className='flex flex-col justify-between'>
                        <p className='font-semibold text-xs text-neutral-900 md:text-sm'>
                          {post.name}
                        </p>
                        <p className='text-xs text-neutral-600 md:text-sm'>
                          {post.headline}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
          </div>
        }
        children2={
          <div className='flex flex-col justify-start items-start w-full'>
            {isLoading ? (
              ''
            ) : (
              <div className='flex justify-start items-center mt-12 mb-12 w-full'>
                <p className='font-bold text-sm md:text-lg'>
                  Comments ({totalComments})
                </p>
              </div>
            )}
            {isLoading
              ? 'Loading...'
              : commentPost.map((comment) => (
                  <div
                    key={comment.id}
                    className='flex flex-col border-b border-neutral-300 gap-8 py-12 w-full'
                  >
                    <div className='flex gap-12 items-start'>
                      <Image
                        src={
                          comment.author.avatarUrl
                            ? `https://blogger-wph-api-production.up.railway.app${comment.author.avatarUrl}`
                            : '/user.svg'
                        }
                        alt={comment.author.name}
                        width={40}
                        height={40}
                        className='rounded-full object-cover w-40 h-40 md:w-48 md:h-48'
                      />
                      <div className='flex flex-col'>
                        <p className='font-semibold text-xs text-neutral-900 md:text-sm'>
                          {comment.author.name}
                        </p>
                        <p className='text-xs text-neutral-600 md:text-sm'>
                          {formatDateToIndonesian(comment.createdAt)}
                        </p>
                      </div>
                    </div>
                    <p className='text-xs text-neutral-900 md:text-sm'>
                      {comment.content}
                    </p>
                  </div>
                ))}
          </div>
        }
        activeTab={activeTab}
      />
    </Dialog>
  );
};

export default StatisticDialog;
