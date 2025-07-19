'use client';

import Dialog from '@/components/ui/Dialog';
import Tabs from '@/components/ui/Tabs/Tabs';
import { getLikedPosts, getPostComments } from '@/lib/api-client';
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
interface StatisticTabsProps {
  id: string;
}

const StatisticDialog: React.FC<StatisticDialogProps> = ({
  isOpen,
  id,
  onClose,
}) => {
  const [likedPost, setLikedPost] = useState<likedPostProps[]>([]);
  const [commentPost, setCommentPost] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    setIsLoading(true);
    const fetchData = async () => {
      try {
        const likedPosts = await getLikedPosts(id);
        setLikedPost(likedPosts);

        const commentsData = await getPostComments(id as string);
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
        trigger1='Like'
        trigger2='Comment'
        children1={<div>Tes1</div>}
        children2={<div>Tes2</div>}
      />
    </Dialog>
  );
};

export default StatisticDialog;
