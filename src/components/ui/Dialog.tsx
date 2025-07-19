// src/ui/Dialog.tsx
import React, { useEffect, useRef, type ReactNode } from 'react';
import * as RadixDialog from '@radix-ui/react-dialog';
import Button from './Button/Button';
import { X } from 'lucide-react';

type DialogProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  actionButton?: ReactNode;
  trigger?: ReactNode;
  className?: string;
  closeOnOverlayClick?: boolean;
};

const Dialog: React.FC<DialogProps> = ({
  isOpen,
  onClose,
  title,
  children,
  actionButton,
  trigger,
  className,
  closeOnOverlayClick = true,
}) => {
  const dialogContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };
  return (
    <RadixDialog.Root open={isOpen} onOpenChange={onClose}>
      {/* Gunakan isOpen dan onClose */}
      {trigger && <RadixDialog.Trigger asChild>{trigger}</RadixDialog.Trigger>}
      {isOpen && ( // Hanya render Portal dan isinya jika dialog terbuka untuk performa
        <RadixDialog.Portal>
          <RadixDialog.Overlay
            className='fixed inset-0 bg-black/50 data-[state=open]:animate-overlayShow'
            onClick={handleOverlayClick} // Handle klik overlay
          />
          <RadixDialog.Content
            ref={dialogContentRef} // Atur ref ke konten dialog
            className={`fixed top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 bg-white p-4 rounded-lg shadow-xl w-[90vw] data-[state=open]:animate-contentShow max-h-[90vh] overflow-y-auto ${
              className || ''
            }`}
          >
            {/* Header Dialog */}
            <div className='flex items-center justify-between pb-4'>
              <RadixDialog.Title className='text-lg font-semibold text-neutral-900'>
                {title}
              </RadixDialog.Title>
              <RadixDialog.Close asChild>
                <button
                  aria-label='Close'
                  className='p-1 rounded-full hover:bg-neutral-100 transition-colors cursor-pointer'
                >
                  <X size={20} className='text-neutral-500' />
                </button>
              </RadixDialog.Close>
            </div>

            {/* Konten Dialog */}
            <div className='pt-4 pb-0'>
              {' '}
              {/* Ubah padding */}
              {children}
            </div>

            {/* Footer Dialog (untuk actionButton dan Cancel) */}
            {(actionButton || !closeOnOverlayClick) && ( // Tampilkan footer jika ada actionButton atau jika closeOnOverlayClick false (perlu tombol cancel)
              <div className='flex justify-end gap-3 mt-4 pt-4 border-t border-neutral-200'>
                <RadixDialog.Close asChild>
                  <Button
                    type='button'
                    className='px-4 py-2 rounded-full text-neutral-700 bg-neutral-200 hover:bg-neutral-300'
                  >
                    {/* Styling Button */}
                    Cancel
                  </Button>
                </RadixDialog.Close>
                {actionButton}
              </div>
            )}
          </RadixDialog.Content>
        </RadixDialog.Portal>
      )}
    </RadixDialog.Root>
  );
};

export default Dialog;
