// src/context/ToastContext.tsx
'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import * as RadixToast from '@radix-ui/react-toast';
import CustomToast, { CustomToastProps } from '@/components/ui/Toast';

type ToastOptions = Omit<CustomToastProps, 'open' | 'onOpenChange'>;

interface ToastContextType {
  showToast: (options: ToastOptions) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toastConfig, setToastConfig] = useState<ToastOptions | null>(null);
  const [open, setOpen] = useState(false);

  const showToast = (options: ToastOptions) => {
    setToastConfig(options);
    setOpen(true);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      <RadixToast.Provider swipeDirection='right'>
        {children}
        {toastConfig && (
          <CustomToast
            open={open}
            onOpenChange={setOpen}
            title={toastConfig.title}
            description={toastConfig.description}
            status={toastConfig.status}
            duration={toastConfig.duration}
          />
        )}
        <RadixToast.Viewport className='fixed top-50 right-1/2 translate-x-1/2 flex flex-col p-16 gap-2 w-300 z-100' />
      </RadixToast.Provider>
    </ToastContext.Provider>
  );
};
