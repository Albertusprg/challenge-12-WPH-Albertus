import { UserType } from '@/context/UserContext';
import { PostCommentPayload } from '@/interfaces/BlogProps.interface';
import { localApi } from '@/services/api-local';

export async function getRecommendedPosts(page = 1, limit = 5) {
  const response = await localApi.get(
    `/api/posts?type=recommended&page=${page}&limit=${limit}`
  );
  return response.data;
}

export async function getMostLikedPosts() {
  const response = await localApi.get('/api/posts?type=most-liked');
  return response.data;
}

export async function getUserById(id: string) {
  const response = await localApi.get(`/api/users/${id}`);
  return response.data;
}

export async function getPostById(id: string) {
  const response = await localApi.get(`/api/posts/${id}`);
  return response.data;
}

export async function getPostComments(id: string) {
  const response = await localApi.get(`/api/posts/${id}?type=comments`);
  return response.data;
}

export async function postComments(id: string, payload: PostCommentPayload) {
  const response = await localApi.post(
    `/api/posts/${id}?type=comments`,
    payload
  );
  return response.data;
}

export async function searchPosts(query: string) {
  const response = await localApi.get(`/api/posts/search`, {
    params: { query },
  });
  return response.data;
}

export async function getUserByEmail(email: string) {
  const response = await localApi.get(
    `/api/users/byEmail?email=${encodeURIComponent(email)}`
  );
  const user = response.data as UserType;

  if (user.avatarUrl && user.avatarUrl.startsWith('/uploads/')) {
    user.avatarUrl = `${
      process.env.NEXT_PUBLIC_BASE_API_URL
    }${user.avatarUrl.slice(1)}`;
  }
  return user;
}

export async function getMyPosts(id: number) {
  const response = await localApi.get(`/api/posts?type=my-posts&id=${id}`);
  return response.data;
}

export async function deletePost(id: string) {
  const response = await localApi.delete(`/api/posts/${id}`);
  return response.data;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function updatePost(id: string, payload: any) {
  const response = await localApi.patch(`/api/posts/${id}`, payload);
  return response.data;
}

export async function updateProfile(formData: FormData): Promise<UserType> {
  const response = await localApi.patch(`/api/users/profile`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  const updatedUser = response.data as UserType;

  if (updatedUser.avatarUrl && updatedUser.avatarUrl.startsWith('/uploads/')) {
    updatedUser.avatarUrl = `${
      process.env.NEXT_PUBLIC_BASE_API_URL
    }${updatedUser.avatarUrl.slice(1)}`;
  }

  return updatedUser;
}

export async function getLikedPosts(id: string) {
  const response = await localApi.get(`api/posts/${id}?type=likesPost`);
  return response.data;
}

export async function likePost(id: string) {
  const response = await localApi.post(`/api/posts/${id}?type=like`);
  return response.data;
}
