'use client';

import Button from '@/components/ui/Button/Button';
import { Camera } from 'lucide-react';
import Image from 'next/image';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import Dialog from '@/components/ui/Dialog';
import Input from '@/components/ui/Input/InputBox';
import { useUser } from '@/context/UserContext';

interface EditProfileDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdateProfile: (formData: FormData) => Promise<string | null>;
}

const EditProfileDialog: React.FC<EditProfileDialogProps> = ({
  isOpen,
  onClose,
  onUpdateProfile,
}) => {
  const { user } = useUser();

  const [name, setName] = useState(user?.name || '');
  const [headline, setHeadline] = useState(user?.headline || '');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    user?.avatarUrl || null
  );

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && user) {
      setName(user.name || '');
      setHeadline(user.headline || '');
      setAvatarPreview(user.avatarUrl || null);
      setAvatarFile(null);
      setError(null);
    } else if (!isOpen) {
      setName(user?.name || '');
      setHeadline(user?.headline || '');
      setAvatarPreview(user?.avatarUrl || null);
      setAvatarFile(null);
      setError(null);
    }
  }, [isOpen, user]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 2 * 1024 * 1024) {
        setError('Avatar size cannot exceed 2MB.');
        if (fileInputRef.current) fileInputRef.current.value = '';
        return;
      }
      if (!['image/png', 'image/jpeg', 'image/jpg'].includes(file.type)) {
        setError('Only PNG or JPG formats are allowed for avatar.');
        if (fileInputRef.current) fileInputRef.current.value = '';
        return;
      }
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
      setError(null);
    }
  };

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);
      setError(null);

      if (!user) {
        setError('User data is not available.');
        setIsLoading(false);
        return;
      }

      if (!name.trim()) {
        setError('Name cannot be empty.');
        setIsLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append('name', name);
      formData.append('headline', headline);

      if (avatarFile) {
        formData.append('avatar', avatarFile);
      }

      try {
        await onUpdateProfile(formData);

        alert('Profile updated successfully!');
        onClose();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        console.error('Failed to update profile:', err);
        // Asumsi onUpdateProfile akan melempar error dengan pesan yang relevan
        setError(err.message || 'Failed to update profile.');
      } finally {
        setIsLoading(false);
      }
    },
    [user, name, headline, avatarFile, onUpdateProfile, onClose]
  );

  if (!user && !isOpen) return null;

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title='Statistic'
      className='max-w-613 p-24'
    >
      {/* Avatar Section */}
      <div className='relative' onClick={() => fileInputRef.current?.click()}>
        <div className='relative w-80 h-80 rounded-full overflow-hidden mb-4 cursor-pointer group'>
          <Image
            src={avatarPreview || user?.avatarUrl || '/user.svg'}
            alt={user?.name || 'User Avatar'}
            fill
            className='object-cover transition-opacity group-hover:opacity-75'
          />
        </div>
        <div>
          <div className='absolute bottom-0 right-0 flex items-center justify-center z-10 cursor-pointer'>
            <div className='bg-primary-300 w-24 h-24 rounded-full flex items-center justify-center'>
              <Camera size={14} className='text-white' />
            </div>
          </div>
          <input
            type='file'
            ref={fileInputRef}
            accept='image/png,image/jpeg,image/jpg'
            onChange={handleAvatarChange}
            className='hidden'
          />
        </div>
      </div>
    </Dialog>
  );
};

export default EditProfileDialog;
