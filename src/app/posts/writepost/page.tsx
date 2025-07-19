'use client';

import type React from 'react';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowLeft,
  Bold,
  Italic,
  Strikethrough,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  LinkIcon,
  ImageIcon,
  Upload,
  Undo,
  Redo,
} from 'lucide-react';

// TipTap Imports
import { useEditor, EditorContent, type Editor } from '@tiptap/react';
import Placeholder from '@tiptap/extension-placeholder';
import StarterKit from '@tiptap/starter-kit';
import LinkExtension from '@tiptap/extension-link';
import ImageExtension from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import { useUser } from '@/context/UserContext';
import axios, { AxiosError } from 'axios';
import { ErrorResponse } from '@/interfaces/auth';
import { BlogPostProps } from '@/interfaces/BlogProps.interface';
import api from '@/services/api';

export default function WritePostPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: 'Enter your content' }),
      LinkExtension.configure({
        openOnClick: false,
      }),
      ImageExtension,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          'prose prose-sm focus:outline-none min-h-[200px] px-4 py-3 text-sm text-neutral-700',
      },
    },
  });

  // Toolbar Component
  const MenuBar = ({ editor }: { editor: Editor | null }) => {
    if (!editor) return null;

    const ToolbarButton = ({
      onClick,
      isActive = false,
      disabled = false,
      children,
    }: {
      onClick: () => void;
      isActive?: boolean;
      disabled?: boolean;
      children: React.ReactNode;
    }) => (
      <button
        type='button'
        onClick={onClick}
        disabled={disabled}
        className={`p-2 rounded transition-colors ${
          isActive
            ? 'bg-primary-300 text-white'
            : 'text-neutral-600 hover:bg-neutral-100'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {children}
      </button>
    );

    return (
      <div className='flex flex-wrap gap-1 p-3 border-b border-neutral-200 bg-neutral-50'>
        {/* Heading Dropdown */}
        <select
          onChange={(e) => {
            const level = Number.parseInt(e.target.value);
            if (level === 0) {
              editor.chain().focus().setParagraph().run();
            } else {
              editor
                .chain()
                .focus()
                .toggleHeading({ level: level as 1 | 2 | 3 })
                .run();
            }
          }}
          className='px-3 py-1 border border-neutral-300 rounded text-sm bg-white'
        >
          <option value='0'>Paragraph</option>
          <option value='1'>Heading 1</option>
          <option value='2'>Heading 2</option>
          <option value='3'>Heading 3</option>
        </select>

        <div className='w-px h-6 bg-neutral-300 mx-1'></div>

        {/* Text Formatting */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive('bold')}
        >
          <Bold size={16} />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive('italic')}
        >
          <Italic size={16} />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          isActive={editor.isActive('strike')}
        >
          <Strikethrough size={16} />
        </ToolbarButton>

        <div className='w-px h-6 bg-neutral-300 mx-1'></div>

        {/* Lists */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive('bulletList')}
        >
          <List size={16} />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive('orderedList')}
        >
          <ListOrdered size={16} />
        </ToolbarButton>

        <div className='w-px h-6 bg-neutral-300 mx-1'></div>

        {/* Text Alignment */}
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          isActive={editor.isActive({ textAlign: 'left' })}
        >
          <AlignLeft size={16} />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          isActive={editor.isActive({ textAlign: 'center' })}
        >
          <AlignCenter size={16} />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          isActive={editor.isActive({ textAlign: 'right' })}
        >
          <AlignRight size={16} />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign('justify').run()}
          isActive={editor.isActive({ textAlign: 'justify' })}
        >
          <AlignJustify size={16} />
        </ToolbarButton>

        <div className='w-px h-6 bg-neutral-300 mx-1'></div>

        {/* Link */}
        <ToolbarButton
          onClick={() => {
            const url = window.prompt('URL:');
            if (url) {
              editor
                .chain()
                .focus()
                .extendMarkRange('link')
                .setLink({ href: url })
                .run();
            }
          }}
          isActive={editor.isActive('link')}
        >
          <LinkIcon size={16} />
        </ToolbarButton>

        {/* Image */}
        <ToolbarButton
          onClick={() => {
            const url = window.prompt('Image URL:');
            if (url) {
              editor.chain().focus().setImage({ src: url }).run();
            }
          }}
        >
          <ImageIcon size={16} />
        </ToolbarButton>

        <div className='w-px h-6 bg-neutral-300 mx-1'></div>

        {/* Undo/Redo */}
        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
        >
          <Undo size={16} />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
        >
          <Redo size={16} />
        </ToolbarButton>
      </div>
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        setGeneralError('Ukuran gambar maksimal 5MB.');
        return;
      }
      if (!['image/png', 'image/jpeg', 'image/jpg'].includes(file.type)) {
        setGeneralError('Hanya format PNG atau JPG yang diperbolehkan.');
        return;
      }
      setCoverImage(file);
      setFilePreview(URL.createObjectURL(file));
      setGeneralError(null);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.size > 5 * 1024 * 1024) {
        setGeneralError('Ukuran gambar maksimal 5MB.');
        return;
      }
      if (!['image/png', 'image/jpeg', 'image/jpg'].includes(file.type)) {
        setGeneralError('Hanya format PNG atau JPG yang diperbolehkan.');
        return;
      }
      setCoverImage(file);
      setFilePreview(URL.createObjectURL(file));
      setGeneralError(null);
    }
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const newTag = tagInput.trim();
      if (newTag && !tags.includes(newTag)) {
        setTags([...tags, newTag]);
        setTagInput('');
      }
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError(null);
    setIsLoading(true);

    if (!title.trim() || !content.trim() || tags.length === 0 || !coverImage) {
      setGeneralError(
        'Semua field (Title, Content, Cover Image, Tags) harus diisi.'
      );
      setIsLoading(false);
      return;
    }

    // Simulate API call
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    tags.forEach((tag) => formData.append('tags[]', tag));
    formData.append('image', coverImage);

    try {
      const response = await api.post<BlogPostProps>('/posts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Post created successfully:', response.data);
      alert('Postingan berhasil dibuat!');
      router.push('/');
    } catch (error: unknown) {
      console.error('Error creating post:', error);

      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ErrorResponse>; // Pastikan ErrorResponse diimpor atau didefinisikan
        console.error('Axios Error response:', axiosError.response?.data);
        console.error('Axios Error status:', axiosError.response?.status);

        if (axiosError.response?.status === 401) {
          setGeneralError('Autentikasi gagal. Silakan login kembali.');
          localStorage.removeItem('authToken');
          router.push('/login');
        } else if (axiosError.response) {
          setGeneralError(
            axiosError.response.data?.message ||
              'Terjadi kesalahan saat membuat postingan.'
          );
        } else if (axiosError.request) {
          setGeneralError(
            'Tidak ada respon dari server. Pastikan API berjalan.'
          );
        } else {
          setGeneralError(
            'Terjadi kesalahan saat mengatur permintaan. Silakan coba lagi.'
          );
        }
      } else if (error instanceof Error) {
        setGeneralError(
          error.message || 'Terjadi kesalahan yang tidak diketahui.'
        );
      } else {
        setGeneralError('Terjadi kesalahan yang tidak diketahui.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const { user } = useUser();

  return (
    <div className='min-h-screen bg-neutral-50 mx-auto'>
      {/* Header */}
      <div
        className='flex items-center justify-between p-4 mt-100 border-b border-neutral-200'
        style={{
          paddingInline: 'clamp(16px, calc(-1.44rem + 9.93vw), 120px)',
        }}
      >
        <Link href='/' className='flex items-center gap-3 text-neutral-900'>
          <ArrowLeft size={24} />
          <span className='text-lg font-semibold'>Write Post</span>
        </Link>
        <div className='flex items-center gap-3'>
          <Image
            src={user?.avatarUrl || '/user.svg'}
            alt={user?.name ? user.name : 'User icon'}
            width={40}
            height={40}
            className='rounded-full'
          />
          <span className='text-sm font-medium text-neutral-700'>
            {user?.name}
          </span>
        </div>
      </div>
      <div className='p-16 flex flex-col justify-center items-center mx-auto bg-white min-h-screen'>
        <form
          onSubmit={handleSubmit}
          className='space-y-6'
          style={{
            width: 'clamp(361px, calc(13.82rem + 35.63vw), 734px)',
          }}
        >
          {/* Title */}
          <div>
            <label className='block text-lg font-semibold text-neutral-900 mb-3'>
              Title
            </label>
            <input
              type='text'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder='Enter your title'
              className='w-full px-4 py-3 border border-neutral-300 rounded-xl text-neutral-900 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-transparent'
            />
          </div>

          {/* Content */}
          <div>
            <label className='block text-lg font-semibold text-neutral-900 mb-3'>
              Content
            </label>
            <div className='border border-neutral-300 rounded-xl overflow-hidden'>
              {editor && <MenuBar editor={editor} />}
              <EditorContent
                editor={editor}
                className='min-h-[300px]'
                placeholder='Enter your content'
              />
            </div>
          </div>

          {/* Cover Image */}
          <div>
            <label className='block text-lg font-semibold text-neutral-900 mb-3'>
              Cover Image
            </label>
            <div
              className='border-2 border-dashed border-neutral-300 rounded-xl p-8 text-center cursor-pointer hover:border-primary-300 transition-colors'
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              {filePreview ? (
                <div className='relative w-full h-48 overflow-hidden rounded-lg mx-auto mb-2'>
                  <Image
                    src={filePreview || '/placeholder.svg'}
                    alt='Cover Preview'
                    fill
                    className='object-cover'
                  />
                </div>
              ) : (
                <div className='flex flex-col items-center'>
                  <div className='w-12 h-12 bg-neutral-100 rounded-lg flex items-center justify-center mb-4'>
                    <Upload size={24} className='text-neutral-500' />
                  </div>
                  <p className='text-primary-300 font-medium mb-1'>
                    Click to upload
                  </p>
                  <p className='text-neutral-500 text-sm'>or drag and drop</p>
                  <p className='text-neutral-400 text-sm mt-2'>
                    PNG or JPG (max. 5mb)
                  </p>
                </div>
              )}
              <input
                type='file'
                ref={fileInputRef}
                accept='.png,.jpg,.jpeg'
                onChange={handleFileChange}
                className='hidden'
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className='block text-lg font-semibold text-neutral-900 mb-3'>
              Tags
            </label>
            <div className='space-y-3'>
              <input
                type='text'
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagInputKeyDown}
                placeholder='Enter your tags'
                className='w-full px-4 py-3 border border-neutral-300 rounded-xl text-neutral-900 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-transparent'
              />
              {tags.length > 0 && (
                <div className='flex flex-wrap gap-2'>
                  {tags.map((tag, index) => (
                    <span
                      key={index}
                      className='inline-flex items-center gap-1 px-3 py-1 bg-primary-100 text-primary-300 rounded-full text-sm'
                    >
                      {tag}
                      <button
                        type='button'
                        onClick={() => removeTag(tag)}
                        className='text-primary-300 hover:text-primary-400'
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {generalError && (
            <p className='text-red-500 text-center text-sm'>{generalError}</p>
          )}

          {/* Submit Button */}
          <div className='flex justify-end'>
            <button
              type='submit'
              disabled={isLoading}
              className='w-full md:w-265 py-4 bg-primary-300 text-white font-semibold rounded-full hover:bg-primary-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {isLoading ? 'Processing...' : 'Finish'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
