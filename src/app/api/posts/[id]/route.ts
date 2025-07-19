import { type NextRequest, NextResponse } from 'next/server';
import api from '@/services/api';
import { BlogPost } from '../endpoints';
import { PostCommentPayload } from '@/interfaces/BlogProps.interface';

export async function GET(
  request: NextRequest,

  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');

  try {
    let response;

    if (type === 'comments') {
      response = await api.get(`${BlogPost.postById}${id}/comments`);
    } else if (type === 'likesPost') {
      response = await api.get(`${BlogPost.postById}${id}/likes`);
    } else {
      response = await api.get(`${BlogPost.postById}${id}`);
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const authorizationHeader = request.headers.get('authorization');

    if (!authorizationHeader) {
      console.warn(
        `[DELETE /api/posts/${id}] Authorization header missing from frontend request. Cannot proceed.`
      );
      return NextResponse.json(
        { error: 'Authorization header missing' },
        { status: 401 }
      );
    }
    console.log(
      `[DELETE /api/posts/${id}] Forwarding Authorization header to external API.`
    );

    const response = await api.delete(`${BlogPost.postById}${id}`, {
      headers: {
        Authorization: authorizationHeader,
      },
    });
    console.log(response);
    return new NextResponse(null, { status: 204 });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error(`Error deleting post ID ${id} in proxy:`, error);
    const errorMessage =
      error.response?.data?.message || 'Failed to delete post';
    const statusCode = error.response?.status || 500;

    return NextResponse.json({ error: errorMessage }, { status: statusCode });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { searchParams } = new URL(request.url);
  const authorizationHeader = request.headers.get('authorization');

  if (!authorizationHeader) {
    console.warn(
      `[PATCH /api/users/profile] Authorization header missing from frontend request. Cannot proceed.`
    );
    return NextResponse.json(
      { error: 'Authorization header missing' },
      { status: 401 }
    );
  }

  const type = searchParams.get('type');
  try {
    let response;

    if (type === 'comments') {
      const payload: PostCommentPayload = await request.json();

      if (!payload.content) {
        return NextResponse.json(
          { error: 'Content is required' },
          { status: 400 }
        );
      }

      response = await api.post<PostCommentPayload>(
        `${BlogPost.comments}${id}`,
        payload,
        {
          headers: {
            Authorization: authorizationHeader,
          },
        }
      );
    } else if (type === 'like') {
      response = await api.post(
        `${BlogPost.postById}${id}/like`,
        {},
        {
          headers: {
            Authorization: authorizationHeader,
          },
        }
      );
    }

    return NextResponse.json(response?.data);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('Error in /api/posts/[id] proxy:', error);

    const errorMessage =
      error.response?.data?.message ||
      'Server error occurred during post comment';
    const statusCode = error.response?.status || 500;

    return NextResponse.json({ error: errorMessage }, { status: statusCode });
  }
}
