import { type NextRequest, NextResponse } from 'next/server';
import api from '@/services/api';
import { UpdateProfilePayload } from '@/interfaces/auth';

export async function PATCH(request: NextRequest) {
  try {
    const formData = await request.formData();
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
    console.log(
      `[PATCH /api/users/profile] Forwarding Authorization header to external API.`
    );
    console.log(
      `[PATCH /api/users/profile] Form data received:`,
      Object.fromEntries(formData)
    );

    const response = await api.patch<UpdateProfilePayload>(
      `users/profile`,
      formData,
      {
        headers: {
          Authorization: authorizationHeader,
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    console.log(
      '[PATCH /api/users/profile] External API Response:',
      response.data
    );
    return NextResponse.json(response.data, { status: response.status });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error(`Error patch user profile in proxy:`, error);
    const errorMessage =
      error.response?.data?.message || 'Failed to update user profile';
    const statusCode = error.response?.status || 500;

    return NextResponse.json({ error: errorMessage }, { status: statusCode });
  }
}
