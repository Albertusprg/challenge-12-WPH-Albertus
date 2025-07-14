// src/app/register/page.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  RegisterPayload,
  RegisterResponse,
  ErrorResponse,
} from '@/interfaces/auth';
import { useRouter } from 'next/navigation';
import axios, { AxiosError } from 'axios'; // Import AxiosError
import Input from '@/components/ui/Input/InputBox';
import Button from '@/components/ui/Button/Button';
import { localApi } from '@/services/api-local';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    general?: string;
  }>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    const newErrors: {
      name?: string;
      email?: string;
      password?: string;
      confirmPassword?: string;
    } = {};

    if (!name) newErrors.name = 'Nama tidak boleh kosong.';
    if (!email) {
      newErrors.email = 'Email tidak boleh kosong.';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Format email tidak valid.';
    }
    if (!password) {
      newErrors.password = 'Password tidak boleh kosong.';
    } else if (password.length < 6) {
      newErrors.password = 'Password minimal 6 karakter.';
    }
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Konfirmasi password tidak boleh kosong.';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword =
        'Password dan konfirmasi password tidak cocok.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    const payload: RegisterPayload = { name, email, password };

    try {
      const response = await localApi.post<RegisterResponse>(
        '/api/auth/register',
        payload
      );
      console.log('Registration successful:', response.data);
      alert(
        `Registrasi berhasil! User ID: ${response.data.id}, Email: ${response.data.email}. Silakan login.`
      );
      router.push('/login');
    } catch (error: unknown) {
      // <-- Ganti 'any' jadi 'unknown'
      console.error('Registration error:', error);

      // --- Cek Tipe Error dengan Type Guard ---
      if (axios.isAxiosError(error)) {
        // <-- Gunakan type guard AxiosError
        const axiosError = error as AxiosError<ErrorResponse>; // Cast ke AxiosError<ErrorResponse>
        console.error('Axios Error response:', axiosError.response?.data);
        console.error('Axios Error status:', axiosError.response?.status);

        if (axiosError.response) {
          // Error dari backend (misal: 400 Bad Request, 409 Conflict - email sudah terdaftar)
          const errorData: ErrorResponse = axiosError.response.data; // Data error dari backend
          setErrors({
            general:
              errorData.message ||
              'Pendaftaran gagal. Email mungkin sudah terdaftar.',
          });
        } else if (axiosError.request) {
          // Request dibuat tapi tidak ada respon (misal: server mati, koneksi terputus)
          setErrors({
            general: 'Tidak ada respon dari server. Pastikan API berjalan.',
          });
        } else {
          // Error lain saat mengatur request
          setErrors({
            general:
              'Terjadi kesalahan saat mengatur permintaan. Silakan coba lagi.',
          });
        }
      } else if (error instanceof Error) {
        // Error JavaScript standar
        setErrors({
          general: error.message || 'Terjadi kesalahan yang tidak diketahui.',
        });
      } else {
        // Jenis error lain yang tidak terduga
        setErrors({ general: 'Terjadi kesalahan yang tidak diketahui.' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='flex justify-center items-center min-h-screen w-full'>
      <div className='bg-white p-24 rounded-lg shadow-md w-345 lg:w-360 border border-neutral-200'>
        <h2 className='text-xl font-bold mb-20'>Sign Up</h2>
        <form onSubmit={handleSubmit} className='flex flex-col gap-20'>
          <Input
            id='name'
            label='Name'
            type='text'
            placeholder='Enter your name'
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={errors.name}
          />
          <Input
            id='email'
            label='Email'
            type='email'
            placeholder='Enter your email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
          />
          <Input
            id='password'
            label='Password'
            type='password'
            placeholder='Enter your password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
          />
          <Input
            id='confirmPassword'
            label='Confirm Password'
            type='password'
            placeholder='Enter your confirm password'
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={errors.confirmPassword}
          />
          {errors.general && (
            <p className='text-red-500 text-center text-sm mb-4'>
              {errors.general}
            </p>
          )}
          <Button type='submit' className='w-full mt-4' disabled={isLoading}>
            {isLoading ? 'Signing Up...' : 'Register'}
          </Button>
          <div className='text-center'>
            <p className='text-sm text-gray-600'>
              Already have an account?{' '}
              <Link
                href='/login'
                className='font-bold text-blue-500 hover:text-blue-800'
              >
                Login
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
