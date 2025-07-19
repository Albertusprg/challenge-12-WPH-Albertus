// src/types/auth.ts

// Payload untuk Login
export interface LoginPayload {
  email: string;
  password: string;
}

export interface UpdatePasswordPayload {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface UpdateProfilePayload {
  name: string;
  headline: string;
  avatar: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

// Respons dari API Login
export interface LoginResponse {
  token: string;
}

export interface UpdatePasswordResponse {
  success: boolean;
}
// Respons dari API Register
export interface RegisterResponse {
  id: number;
  email: string;
  // Tambahan jika ada field lain di respons register
}

// Respons untuk Error dari API
export interface ErrorResponse {
  message: string;
  // Bisa tambahkan 'errors?: { [key: string]: string[] }' jika backend mengirim error per field
}
