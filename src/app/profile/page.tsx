'use client';
import ChangePassword from '@/components/container/changePassword/ChangePassword';
import EditProfileDialog from '@/components/container/editProfile/EditProfileDialog';
import MyPostCard from '@/components/container/myPostCard/MyPostCard';
import Button from '@/components/ui/Button/Button';
import { useUser } from '@/context/UserContext';
import { BlogPostProps } from '@/interfaces/BlogProps.interface';
import { getMyPosts, updateProfile } from '@/lib/api-client';
import { PencilLine } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';

const Profile = () => {
  const { user, assignUser } = useUser();
  const [tabClick, setTabClick] = useState('Your Post');
  const [isLoading, setIsLoading] = useState(false);
  const [totalPosts, setTotalPosts] = useState(0);
  const [myPost, setMyPost] = useState<BlogPostProps[] | null>(null);
  const [isEditProfileDialogOpen, setIsEditProfileDialogOpen] = useState(false);

  const handleUpdateProfile = async (formData: FormData) => {
    try {
      const updatedUser = await updateProfile(formData);

      assignUser(updatedUser);

      alert('Profile updated successfully!');
      setIsEditProfileDialogOpen(false);
      return updatedUser.avatarUrl || null;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error('Error updating profile:', error);
      throw new Error(
        error.response?.data?.message || 'Failed to update profile.'
      );
    }
  };

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
      className='w-full flex justify-center items-center'
      style={{
        paddingTop: 'clamp(88px, calc(2.69rem + 5.35vw), 128px)',
      }}
    >
      <div className='text-neutral-900 flex flex-col lg:justify-center mb-24 w-full p-16 max-w-800'>
        <div className='flex justify-between px-16 py-13 border border-neutral-300 rounded-md w-full'>
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
          <button
            onClick={() => setIsEditProfileDialogOpen(true)}
            className='flex items-center justify-center text-xs font-semibold text-primary-300 underline hover:text-primary-400 transition-colors cursor-pointer'
          >
            Edit Profile
          </button>
        </div>
        <div className='flex flex-col gap-16 py-16'>
          <div className='flex justify-start w-full '>
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
          {tabClick === 'Your Post' && totalPosts > 0 ? (
            <div className='flex flex-col gap-16'>
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
                <h1 className='text-lg font-bold text-neutral-900'>
                  {totalPosts} Post
                </h1>
                <div>
                  <div className='flex flex-col max-w-807'>
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
          ) : (
            tabClick === 'Your Post' &&
            totalPosts === 0 && (
              <div className='flex flex-col justify-center items-center gap-24 pt-50 py-16'>
                <Image
                  src='/icon/no-result.png'
                  alt='No Posts'
                  width={118}
                  height={135}
                />
                <div className='flex flex-col items-center gap-4'>
                  <p className='text-sm font-semibold text-neutral-950 text-center'>
                    Your writing journey starts here
                  </p>
                  <p className='text-sm text-neutral-950 text-center'>
                    No posts yet, but every great writer starts with the first
                    one.
                  </p>
                </div>
                <Link href='/posts/writepost'>
                  <Button className='flex gap-2 h-44 px-6 w-240 items-center justify-center bg-primary-300 text-white rounded-full hover:bg-primary-400 transition-colors'>
                    <PencilLine size={20} /> Write Post
                  </Button>
                </Link>
              </div>
            )
          )}
          {tabClick === 'Change Password' && <ChangePassword />}
        </div>
      </div>
      <EditProfileDialog
        isOpen={isEditProfileDialogOpen}
        onClose={() => setIsEditProfileDialogOpen(false)}
        onUpdateProfile={handleUpdateProfile}
      />
    </div>
  );
};
export default Profile;
