// src/components/Input.tsx
import React, { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  error?: string; // Pesan error dalam bentuk string
  containerClassName?: string;
}

const Input: React.FC<InputProps> = ({
  id,
  label,
  error,
  containerClassName,
  ...props
}) => {
  return (
    <div className={`mb-4 ${containerClassName}`}>
      <label
        htmlFor={id}
        className='block text-neutral-950 text-sm font-semibold mb-4'
      >
        {label}
      </label>
      <input
        id={id}
        className={`shadow appearance-none border rounded-xl w-full h-48 py-10 px-16 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
          error ? 'border-red-500' : '' // Menambah border merah jika ada error
        }`}
        {...props}
      />
      {error && <p className='text-red-500 text-xs italic mt-1'>{error}</p>}
    </div>
  );
};

export default Input;
