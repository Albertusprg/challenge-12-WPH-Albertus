import Button from '@/components/ui/Button/Button';
import Input from '@/components/ui/Input/InputBox';
import {
  ErrorResponse,
  UpdatePasswordPayload,
  UpdatePasswordResponse,
} from '@/interfaces/auth';
import api from '@/services/api';
import axios, { AxiosError } from 'axios';
import React, { useState } from 'react';

const ChangePassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<{
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
    general?: string;
  }>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Mencegah refresh halaman
    setErrors({}); // Reset error setiap kali submit
    setIsLoading(true); // Aktifkan loading

    // Ganti 'let' menjadi 'const' di sini
    const newErrors: {
      currentPassword?: string;
      newPassword?: string;
      confirmPassword?: string;
    } = {};

    // Validasi client-side dasar
    if (!currentPassword) {
      newErrors.currentPassword = 'Current Password tidak boleh kosong.';
    } else if (currentPassword.length < 6) {
      newErrors.currentPassword = 'Password minimal 6 karakter.';
    }
    if (!newPassword) {
      newErrors.newPassword = 'Password tidak boleh kosong.';
    } else if (newPassword.length < 6) {
      newErrors.newPassword = 'Password minimal 6 karakter.';
    }
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Konfirmasi password tidak boleh kosong.';
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword =
        'Password dan konfirmasi password tidak cocok.';
    }

    // Jika ada error validasi, tampilkan dan berhenti
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    const payload: UpdatePasswordPayload = {
      currentPassword,
      newPassword,
      confirmPassword,
    };

    try {
      const response = await api.patch<UpdatePasswordResponse>(
        '/users/password',
        payload
      );
      console.log('Update Password successfully:', response.data);
      alert('Update Password Success!');

      // Simpan token ke localStorage jika berhasil
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
            general: errorData.message || 'Current password salah.',
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
    <div>
      <form onSubmit={handleSubmit} className='flex flex-col gap-20 max-w-538'>
        <Input
          id='currentPassword'
          label='Current Password'
          type='password'
          placeholder='Enter current password'
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          error={errors.currentPassword}
        />
        <Input
          id='newPassword'
          label='New Password'
          type='password'
          placeholder='Enter new password'
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          error={errors.newPassword}
        />
        <Input
          id='confirmPassword'
          label='Confirm Password'
          type='password'
          placeholder='Enter confirm password'
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          error={errors.confirmPassword}
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
          {isLoading ? 'Loading...' : 'Update Password'}
        </Button>
      </form>
    </div>
  );
};

export default ChangePassword;
