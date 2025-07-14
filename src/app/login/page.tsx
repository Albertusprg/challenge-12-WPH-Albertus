// src/app/login/page.tsx
'use client'; // Ini menandakan komponen ini akan dirender di client-side

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // Untuk redirect setelah login
import axios, { AxiosError } from 'axios'; // <-- Import AxiosError dari axios
import { ErrorResponse, LoginPayload, LoginResponse } from '@/interfaces/auth';
import Input from '@/components/ui/Input/InputBox';
import Button from '@/components/ui/Button/Button';
import { useUser } from '@/context/UserContext';
import { localApi } from '@/services/api-local';
import { getUserByEmail } from '@/lib/api-client';

export default function LoginPage() {
  const router = useRouter(); // Inisialisasi router
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    general?: string;
  }>({});
  const [isLoading, setIsLoading] = useState(false); // State untuk loading button
  const { assignUser } = useUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Mencegah refresh halaman
    setErrors({}); // Reset error setiap kali submit
    setIsLoading(true); // Aktifkan loading

    // Ganti 'let' menjadi 'const' di sini
    const newErrors: { email?: string; password?: string } = {};

    // Validasi client-side dasar
    if (!email) {
      newErrors.email = 'Email tidak boleh kosong.';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      // Regex untuk format email sederhana
      newErrors.email = 'Format email tidak valid.';
    }
    if (!password) {
      newErrors.password = 'Password tidak boleh kosong.';
    } else if (password.length < 6) {
      newErrors.password = 'Password minimal 6 karakter.';
    }

    // Jika ada error validasi, tampilkan dan berhenti
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    const payload: LoginPayload = { email, password };

    try {
      const response = await localApi.post<LoginResponse>(
        '/api/auth/login',
        payload
      );
      console.log('Login successful:', response.data);

      // Simpan token ke localStorage jika berhasil
      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token);
        const responseUser = await getUserByEmail(payload.email);
        assignUser(responseUser);
        alert('Login berhasil! Anda akan diarahkan ke halaman utama.');
        router.push('/'); // Redirect ke halaman utama
      } else {
        // Jika sukses tapi tidak ada token (jarang terjadi)
        setErrors({ general: 'Login berhasil tapi token tidak ditemukan.' });
      }
    } catch (error: unknown) {
      // <-- Ganti 'any' menjadi 'unknown'
      console.error('Login error:', error);

      // --- Cek Tipe Error dengan Type Guard ---
      if (axios.isAxiosError(error)) {
        // <-- Gunakan type guard AxiosError
        const axiosError = error as AxiosError<ErrorResponse>; // Cast ke AxiosError<ErrorResponse>
        console.error('Axios Error response:', axiosError.response?.data);
        console.error('Axios Error status:', axiosError.response?.status);

        if (axiosError.response) {
          // Error dari backend (misal: 401 Unauthorized, 400 Bad Request)
          const errorData: ErrorResponse = axiosError.response.data;
          setErrors({
            general: errorData.message || 'Email atau password salah.',
          });
        } else if (axiosError.request) {
          // Request dibuat tapi tidak ada respon (misal: server offline)
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
      setIsLoading(false); // Nonaktifkan loading setelah selesai
    }
  };

  return (
    <div className='flex justify-center items-center min-h-screen w-full'>
      <div className='bg-white p-24 rounded-lg shadow-md w-345 lg:w-360 border border-neutral-200'>
        <h2 className='text-xl font-bold mb-20 text-start'>Sign In</h2>
        <form onSubmit={handleSubmit} className='flex flex-col gap-20'>
          <Input
            id='email'
            label='Email'
            type='email'
            placeholder='Enter you email'
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
          {errors.general && ( // Tampilkan general error jika ada
            <p className='text-red-500 text-center text-sm mb-4'>
              {errors.general}
            </p>
          )}
          <Button
            type='submit'
            className='w-full cursor-pointer'
            disabled={isLoading}
          >
            {isLoading ? 'Logging In...' : 'Sign In'}
          </Button>
          <div className='text-center mt-4'>
            <p className='text-sm text-neutral-950'>
              Dont have an account?{' '}
              <Link
                href='/register'
                className='font-bold text-blue-500 hover:text-blue-800'
              >
                Register
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
