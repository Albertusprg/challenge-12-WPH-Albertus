import { LoginPayload } from '@/interfaces/auth';
import api from '@/services/api';
import { type NextRequest, NextResponse } from 'next/server';
import { BlogPostAuth } from '../endpoint';

export async function POST(request: NextRequest) {
  try {
    const payload: LoginPayload = await request.json();

    if (!payload.email || !payload.password) {
      return NextResponse.json(
        { error: 'Email, and password are required' },
        { status: 400 }
      );
    }

    const externalApiResponse = await api.post<LoginPayload>(
      `${BlogPostAuth.login}`,
      payload
    );

    return NextResponse.json(externalApiResponse.data, {
      status: externalApiResponse.status,
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('Error in /api/auth/login proxy:', error);

    const errorMessage =
      error.response?.data?.message || 'Server error occurred during login';
    const statusCode = error.response?.status || 500;

    return NextResponse.json({ error: errorMessage }, { status: statusCode });
  }
}
