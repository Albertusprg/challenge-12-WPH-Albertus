import { RegisterPayload } from '@/interfaces/auth';
import api from '@/services/api';
import { type NextRequest, NextResponse } from 'next/server';
import { BlogPostAuth } from '../endpoint';

export async function POST(request: NextRequest) {
  try {
    const payload: RegisterPayload = await request.json();

    if (!payload.name || !payload.email || !payload.password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 } // Bad Request
      );
    }

    const externalApiResponse = await api.post<RegisterPayload>(
      `${BlogPostAuth.register}`,
      payload
    );

    return NextResponse.json(externalApiResponse.data, {
      status: externalApiResponse.status,
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('Error in /api/auth/register proxy:', error);

    const errorMessage =
      error.response?.data?.message ||
      'Server error occurred during registration';
    const statusCode = error.response?.status || 500;

    return NextResponse.json({ error: errorMessage }, { status: statusCode });
  }
}
