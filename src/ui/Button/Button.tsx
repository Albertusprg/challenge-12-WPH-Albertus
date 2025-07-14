// src/components/Button.tsx
import React, { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ children, className, ...props }) => {
  return (
    <button
      className={`bg-primary-300 hover:bg-blue-700 text-white font-semibold text-sm h-48 py-10 text-center rounded-full focus:outline-none focus:shadow-outline ${className}`}
      type='button' // Default ke type="button" agar tidak submit form secara otomatis
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
