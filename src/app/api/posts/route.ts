import { type NextRequest, NextResponse } from 'next/server';
import { BlogPost } from './endpoints';
import api from '@/services/api';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');
  const page = searchParams.get('page') || '1';
  const limit = searchParams.get('limit') || '5';
  const id = searchParams.get('id');

  try {
    let response;

    if (type === 'recommended') {
      response = await api.get(
        `${BlogPost.recomended}?page=${page}&limit=${limit}`
      );
    } else if (type === 'most-liked') {
      response = await api.get(BlogPost.mostLiked);
    } else if (type === 'my-posts') {
      response = await api.get(`${BlogPost.postsByUser}${id}`);
    } else {
      return NextResponse.json(
        { error: 'Invalid type parameter' },
        { status: 400 }
      );
    }

    return NextResponse.json(response.data);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message || 'Server error occurred';
    return NextResponse.json(
      { error: errorMessage },
      { status: error.response?.status || 500 }
    );
  }
}
