'use client';

import Button from '@/components/ui/Button/Button';
import Dialog from '@/components/ui/Dialog';
import { deletePost } from '@/lib/api-client';
import React, { useState } from 'react';

interface DeletePostDialogProps {
  isOpen: boolean;
  onClose: () => void;
  postId: string;
}

const DeletePostDialog: React.FC<DeletePostDialogProps> = ({
  isOpen,
  onClose,
  postId,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleDeletePost = async (postId: string) => {
    setIsLoading(true);
    try {
      await deletePost(postId);
      setIsLoading(false);
      window.location.reload();
    } catch (error) {
      console.error('Failed to delete post:', error);
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title='Delete'
      className='max-w-451 py-24 px-16 flex flex-col gap-16'
    >
      <p className='text-sm text-neutral-600'>Are you sure to delete?</p>
      <div className='flex mt-16 gap-16 justify-between'>
        <Button
          type='button'
          onClick={() => onClose()}
          disabled={isLoading}
          className='w-full h-40 py-6 text-neutral-950 bg-white rounded-full cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
        >
          Cancel
        </Button>
        <Button
          type='button'
          onClick={() => handleDeletePost(postId)}
          disabled={isLoading}
          className='w-full h-40 py-6 bg-[#EE1D52] text-white rounded-full hover:bg-red-700 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
        >
          Delete
        </Button>
      </div>
    </Dialog>
  );
};

export default DeletePostDialog;
