'use client';

import {
  getPostById,
  getPostComments,
  getUserById,
  getRecommendedPosts,
  postComments,
  likePost,
} from '@/lib/api-client';
import PostCard from '@/components/container/postCard/PostCard';
import type {
  BlogPostProps,
  Comment,
  PostCommentPayload,
  User,
} from '@/interfaces/BlogProps.interface';
import { MessageSquare, ThumbsUp, X } from 'lucide-react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import Input from '@/components/ui/Input/InputBox';
import { useUser } from '@/context/UserContext';
import Button from '@/components/ui/Button/Button';
import axios, { AxiosError } from 'axios';
import { ErrorResponse } from '@/interfaces/auth';
import { useToast } from '@/context/ToastContext';

const formatDateToIndonesian = (isoDate: string): string => {
  const date = new Date(isoDate);
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

export default function DetailPost() {
  const params = useParams();
  const [post, setPost] = useState<BlogPostProps | null>(null);
  const [anotherPost, setAnotherPost] = useState<BlogPostProps | null>(null);
  const [commentText, setCommentText] = useState('');
  const [commentPost, setCommentPost] = useState<Comment[] | null>(null);
  const [PaginatedCommentPost, setPaginatedCommentPost] = useState<
    Comment[] | null
  >(null);
  const [seeAllComments, setSeeAllComments] = useState(false);
  const [userPost, setUserPost] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [reloadPage, setReloadPage] = useState(false);
  const { user } = useUser();
  const { showToast } = useToast();
  const [alreadyLiked, setAlreadyLiked] = useState<boolean>(false);
  const [errors, setErrors] = useState<{
    content?: string;
  }>({});
  const [likesCount, setLikesCount] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      if (!params?.id) return;

      setIsLoading(true);
      try {
        // Fetch post data
        const postData = await getPostById(params.id as string);
        setPost(postData);
        setLikesCount(postData.likes || 0);

        // Fetch comments
        const commentsData = await getPostComments(params.id as string);
        setCommentPost(commentsData);
        setPaginatedCommentPost(commentsData.slice(0, 3));

        // Fetch another post
        const recommendedData = await getRecommendedPosts();
        setAnotherPost(recommendedData.data[0]);

        // Fetch user data if post has author
        if (postData?.author?.id) {
          const userData = await getUserById(String(postData.author.id));
          setUserPost(userData);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setIsLoading(false);
        setReloadPage(false);
      }
    };

    fetchData();
  }, [params?.id, reloadPage]);

  const handleSendComment = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    const newErrors: { content?: string } = {};
    const content = commentText.trim();

    // Validasi client-side dasar
    if (!content) {
      newErrors.content = 'Comment content tidak boleh kosong.';
    }
    // Jika ada error validasi, tampilkan dan berhenti
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      console.error(errors);
      setIsLoading(false);
      return;
    }

    const payload: PostCommentPayload = { content };

    try {
      const response = await postComments(params.id as string, payload);

      console.log('Post comment successful:', response.data);
      alert('Comment berhasil diupload!');

      setCommentText('');
      setReloadPage(true);
    } catch (error: unknown) {
      console.error('Error creating post:', error);

      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ErrorResponse>; // Pastikan ErrorResponse diimpor atau didefinisikan
        console.error('Axios Error response:', axiosError.response?.data);
        console.error('Axios Error status:', axiosError.response?.status);

        if (axiosError.response?.status === 401) {
          console.error('Autentikasi gagal. Silakan login kembali.');
          localStorage.removeItem('authToken');
        } else if (axiosError.response) {
          console.error(
            axiosError.response.data?.message ||
              'Terjadi kesalahan saat membuat postingan.'
          );
        } else if (axiosError.request) {
          console.error('Tidak ada respon dari server. Pastikan API berjalan.');
        } else {
          console.error(
            'Terjadi kesalahan saat mengatur permintaan. Silakan coba lagi.'
          );
        }
      } else if (error instanceof Error) {
        console.error(
          error.message || 'Terjadi kesalahan yang tidak diketahui.'
        );
      } else {
        console.error('Terjadi kesalahan yang tidak diketahui.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLikePost = useCallback(
    async (post: BlogPostProps) => {
      if (!post?.id || user?.id === undefined || user?.id === null) {
        showToast({
          title: 'Gagal',
          description: 'Anda harus login untuk menyukai postingan.',
          status: 'error',
        });
        return;
      }
      const newAlreadyLiked = !alreadyLiked;

      try {
        if (alreadyLiked) {
          setLikesCount((prev) => prev - 1);
          setAlreadyLiked(false);
        } else {
          setLikesCount((prev) => prev + 1);
          setAlreadyLiked(true);
        }

        await likePost(String(post.id));

        showToast({
          title: 'Berhasil',
          description: newAlreadyLiked
            ? 'Anda berhasil menyukai post!'
            : 'Anda berhasil membatalkan suka post!',
          status: 'success',
        });
      } catch (error) {
        console.error('Failed to like/unlike post:', error);
        setLikesCount((prev) => (alreadyLiked ? prev + 1 : prev - 1));
        setAlreadyLiked((prev) => !prev);
        showToast({
          title: 'Error',
          description:
            'Gagal menyukai/membatalkan suka post. Silakan coba lagi.',
          status: 'error',
        });
      }
    },
    [user?.id, alreadyLiked, showToast]
  );

  const handleSeeAllComments = () => {
    setSeeAllComments(!seeAllComments);
  };

  if (isLoading) {
    return <div className='p-16 text-center'>Loading...</div>;
  }

  if (!post) {
    return <div className='p-16 text-center'>Post not found</div>;
  }

  return (
    <div
      className='flex flex-col gap-12 text-neutral-900 mx-auto max-w-800 px-16'
      style={{
        paddingTop: 'clamp(88px, calc(2.69rem + 5.35vw), 128px)',
      }}
    >
      <h1 className='text-2xl font-bold'>{post.title}</h1>

      <div className='flex gap-8'>
        {post.tags?.map((tag, index) => (
          <div
            key={index}
            className='flex px-8 py-2 items-center justify-center text-xs font-regular border border-neutral-300 rounded-md h-28 truncate'
          >
            {tag}
          </div>
        ))}
      </div>

      <div className='flex items-center justify-start gap-8 border-b border-neutral-300 pb-12'>
        <Image
          src={
            userPost?.avatarUrl
              ? `https://blogger-wph-api-production.up.railway.app${userPost.avatarUrl}`
              : '/user.svg'
          }
          alt='Author'
          width={30}
          height={30}
          className='rounded-full object-cover w-30 h-30 md:w-40 md:h-40'
        />
        <p className='text-xs md:text-sm font-regular'>{post.author?.name}</p>
        <Image src='/ellipse.svg' alt='dot' width={4} height={4} />
        <p className='text-xs md:text-sm font-regular text-neutral-600'>
          {post.createdAt ? formatDateToIndonesian(post.createdAt) : ''}
        </p>
      </div>

      <div className='flex items-center justify-start gap-8 border-b border-neutral-300 pb-12'>
        <ThumbsUp
          size={20}
          onClick={() => {
            handleLikePost(post);
          }}
          className={`cursor-pointer ${alreadyLiked ? 'text-primary-300' : ''}`}
        />
        <span className='text-xs md:text-sm'>{likesCount}</span>
        <MessageSquare size={20} />
        <span className='text-xs md:text-sm'>{commentPost?.length || 0}</span>
      </div>

      <Image
        src={post.imageUrl || '/default.jpg'}
        alt='Post Image'
        width={100}
        height={100}
        className='rounded-sm object-cover w-full'
      />

      <div
        className='mt-4 text-sm'
        dangerouslySetInnerHTML={{ __html: post.content || '' }}
      ></div>

      <hr />

      {/* Comment Section */}
      <div className='flex flex-col gap-6'>
        <h1 className='text-xl font-bold'>
          Comments ({commentPost?.length || 0})
        </h1>

        <div className='flex items-center gap-4'>
          <Image
            src={user?.avatarUrl || '/user.svg'}
            alt='Guest'
            width={40}
            height={40}
            className='w-40 h-40 rounded-full'
          />
          <div>
            <p className='text-xs font-semibold'>{user?.name || 'Guest'}</p>
          </div>
        </div>
        <Input
          id='comment'
          label='Give your comments'
          multiline={true}
          placeholder='Enter your comment'
          className='w-full min-h-[100px] p-4 border border-neutral-300 rounded-xl'
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
        />
        <div className='flex flex-col gap-12'>
          <div className='justify-end flex'>
            <Button
              onClick={handleSendComment}
              className='bg-primary-300 text-white px-6 text-sm rounded-full w-204 h-48'
            >
              Send
            </Button>
          </div>
        </div>

        {PaginatedCommentPost?.map((comment) => (
          <div
            key={comment.id}
            className='flex flex-col gap-8 border-t border-neutral-300 pt-6'
          >
            <div className='flex gap-4 items-start'>
              <Image
                src={
                  comment.author.avatarUrl
                    ? `https://blogger-wph-api-production.up.railway.app${comment.author.avatarUrl}`
                    : '/user.svg'
                }
                alt={comment.author.name}
                width={40}
                height={40}
                className='rounded-full object-cover w-40 h-40'
              />
              <div className='flex flex-col'>
                <p className='font-semibold text-sm'>{comment.author.name}</p>
                <p className='text-xs text-neutral-500'>
                  {formatDateToIndonesian(comment.createdAt)}
                </p>
              </div>
            </div>
            <p className='text-sm mt-2'>{comment.content}</p>
          </div>
        ))}

        <p
          className='text-sm text-primary-500 mt-4 underline cursor-pointer'
          onClick={handleSeeAllComments}
        >
          See All Comments
        </p>
        <hr style={{ borderColor: '#d5d7da' }} className='my-4' />
        <h1 className='text-xl font-bold my-4'>Another Post</h1>
        {anotherPost && <PostCard post={anotherPost} index={1} />}
      </div>

      {seeAllComments && (
        <div className='fixed inset-0 z-[999] flex items-center justify-center bg-neutral-950/60 px-24 py-80'>
          <div
            className='relative flex flex-col gap-16 bg-white text-neutral-950 rounded-lg shadow-2xl overflow-hidden px-16 py-24'
            style={{
              width: 'clamp(350px, 90vw, 800px)',
              height: 'clamp(500px, 90vh, 700px)',
            }}
          >
            <div className='flex justify-between items-center px-6 py-4 border-b border-neutral-200'>
              <h1 className='text-xl font-bold'>
                Comments ({commentPost?.length || 0})
              </h1>
              <button
                onClick={handleSeeAllComments}
                className='text-neutral-500 hover:text-neutral-900'
              >
                <X size={24} />
              </button>
            </div>
            <div className='flex-1 overflow-y-auto px-6 pb-6'>
              <div className='flex flex-col gap-4 mb-6'>
                <h2 className='text-sm font-semibold text-neutral-950'>
                  Give your comments
                </h2>
                <textarea
                  name='comment'
                  placeholder='Enter your comment'
                  className='w-full min-h-[100px] p-4 border border-neutral-300 rounded-md resize-none text-sm'
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                />
                <button
                  onClick={handleSendComment}
                  className='bg-primary-300 text-white px-6 rounded-full h-40 w-full text-sm font-semibold'
                >
                  Send
                </button>
              </div>
              <div className='flex flex-col gap-8'>
                {commentPost?.map((comment) => (
                  <div
                    key={comment.id}
                    className='flex flex-col gap-4 border-t border-neutral-300 pt-6'
                  >
                    <div className='flex gap-4 items-start'>
                      <Image
                        src={
                          comment.author.avatarUrl
                            ? `https://blogger-wph-api-production.up.railway.app${comment.author.avatarUrl}`
                            : '/user.svg'
                        }
                        alt={comment.author.name}
                        width={40}
                        height={40}
                        className='rounded-full object-cover w-40 h-40'
                      />
                      <div className='flex flex-col'>
                        <p className='font-semibold text-sm'>
                          {comment.author.name}
                        </p>
                        <p className='text-xs text-neutral-500'>
                          {formatDateToIndonesian(comment.createdAt)}
                        </p>
                      </div>
                    </div>
                    <p className='text-sm'>{comment.content}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
