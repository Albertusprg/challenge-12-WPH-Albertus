// src/components/ui/Toast/Toast.tsx
'use client';

import * as RadixToast from '@radix-ui/react-toast';
import React from 'react';
import { X } from 'lucide-react';

export interface CustomToastProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  duration?: number;
  status?: 'success' | 'error' | 'info';
}

const CustomToast: React.FC<CustomToastProps> = ({
  open,
  onOpenChange,
  title,
  description,
  duration = 3000,
  status = 'info',
}) => {
  const backgroundColor =
    status === 'success'
      ? 'bg-green-500'
      : status === 'error'
      ? 'bg-red-500'
      : 'bg-gray-800';
  const hoverColor =
    status === 'success'
      ? 'hover:bg-green-600'
      : status === 'error'
      ? 'hover:bg-red-600'
      : 'hover:bg-gray-700';

  return (
    <RadixToast.Root
      className={`flex items-center justify-between gap-4 p-4 rounded-md shadow-lg text-white data-[state=open]:animate-slideIn data-[state=closed]:animate-hide data-[swipe=end]:animate-swipeOut w-full ${backgroundColor}`}
      open={open}
      onOpenChange={onOpenChange}
      duration={duration}
    >
      <div className='flex flex-col'>
        <RadixToast.Title className='text-md font-semibold'>
          {title}
        </RadixToast.Title>
        <RadixToast.Description className='text-sm mt-1'>
          {description}
        </RadixToast.Description>
      </div>
      <RadixToast.Action
        className='shrink-0'
        asChild
        altText='close notification'
      >
        <button
          className={`ml-auto px-2 py-1 rounded-full text-white ${hoverColor} focus:outline-none focus:ring-2 focus:ring-white`}
        >
          <X size={16} />
        </button>
      </RadixToast.Action>
    </RadixToast.Root>
  );
};

export default CustomToast;
