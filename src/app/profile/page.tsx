'use client';
import MyPostCard from '@/components/container/myPostCard/MyPostCard';
import Button from '@/components/ui/Button/Button';
import { useUser } from '@/context/UserContext';
import { BlogPostProps } from '@/interfaces/BlogProps.interface';
import { getMyPosts } from '@/lib/api-client';
import { PencilLine } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';

const Profile = () => {
  const { user } = useUser();
  const [tabClick, setTabClick] = useState('Your Post');
  const [isLoading, setIsLoading] = useState(false);
  const [totalPosts, setTotalPosts] = useState(0);
  const [myPost, setMyPost] = useState<BlogPostProps[] | null>(null);

  const fetchMyPost = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getMyPosts(user?.id ? user.id : 0);
      setMyPost(data.data);
      setTotalPosts(data.total);
    } catch (error) {
      console.error('Failed to fetch recommended posts:', error);
      setMyPost([]);
      setTotalPosts(0);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchMyPost();
  }, [fetchMyPost]);
  return (
    <div
      className='text-neutral-900 flex flex-col lg:justify-center mb-24'
      style={{
        paddingInline: 'clamp(16px, 11.84vw - 30.55px, 140px)',
        paddingTop: 'clamp(88px, calc(2.69rem + 5.35vw), 128px)',
      }}
    >
      <div className='flex justify-between px-16 py-13 border border-neutral-300 rounded-md'>
        <div className='flex items-center gap-12'>
          {' '}
          <Image
            src={user?.avatarUrl ? user.avatarUrl : '/user.svg'}
            alt='user-avatar'
            width={50}
            height={50}
            className='rounded-full'
          />
          <div>
            <p className={`text-sm font-bold text-neutral-900'}`}>
              {user?.name}
            </p>
            <p className='text-sm text-neutral-900'>
              {user?.headline || 'No headline'}
            </p>
          </div>
        </div>
        <div className='flex items-center justify-center text-xs font-semibold text-primary-300 underline'>
          Edit Profile
        </div>
      </div>
      <div className='flex flex-col gap-16 py-16'>
        <div className='flex justify-center w-full '>
          <div
            className={`text-xs font-semibold border-b ${
              tabClick === 'Your Post'
                ? 'border-primary-300 border-b-4 text-primary-300'
                : 'border-neutral-300'
            } cursor-pointer text-center items-center flex justify-center h-40 w-177`}
            onClick={() => setTabClick('Your Post')}
          >
            Your Post
          </div>
          <div
            className={`text-xs font-semibold border-b ${
              tabClick === 'Change Password'
                ? 'border-primary-300 border-b-4 text-primary-300'
                : 'border-neutral-300'
            } cursor-pointer text-center items-center flex justify-center h-40 w-177`}
            onClick={() => setTabClick('Change Password')}
          >
            Change Password
          </div>
        </div>
        <div>
          <Link href='/posts/writepost'>
            <Button className='flex gap-8 h-44 w-full items-center justify-center'>
              <PencilLine size={20} />
              Write Post
            </Button>
          </Link>
        </div>
        <hr className='border border-neutral-300' />
        <div>
          <h1>{totalPosts} Post</h1>
        </div>
        <div>
          <div className='flex flex-col max-w-807'>
            <h1 className='text-xl font-bold'>Recommend For You</h1>
            {isLoading ? (
              <p className='text-center py-16 text-neutral-500'>
                Loading posts...
              </p>
            ) : (
              myPost?.map((post, index) => (
                <div
                  className='max-w-full overflow-hidden'
                  key={post.id || index}
                >
                  <MyPostCard post={post} index={index} />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
