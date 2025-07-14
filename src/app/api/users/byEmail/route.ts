import { type NextRequest, NextResponse } from 'next/server';
import api from '@/services/api';
import { BlogPost } from '../../posts/endpoints';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');

  try {
    const response = await api.get(`${BlogPost.userByEmail}${email}`);

    if (!response.data) {
      // Tambahkan pengecekan jika data kosong dari API eksternal
      console.warn(
        'API Route /users/byEmail: External API returned no data for email:',
        email
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
