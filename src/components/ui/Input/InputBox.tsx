// src/components/Input.tsx
import { cn } from '@/lib/utils';
import { Eye, EyeOff } from 'lucide-react';
import React, {
  InputHTMLAttributes,
  TextareaHTMLAttributes,
  useState,
} from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  error?: string;
  containerClassName?: string;
  multiline?: boolean;
  textareaProps?: TextareaHTMLAttributes<HTMLTextAreaElement>;
  revealPassword?: boolean;
}

const Input: React.FC<InputProps> = ({
  id,
  label,
  error,
  containerClassName,
  multiline = false,
  textareaProps,
  revealPassword,
  ...props
}) => {
  const baseClasses = `shadow appearance-none border rounded-xl w-full text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
    error ? 'border-red-500' : ''
  }`;

  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={`mb-4 ${containerClassName || ''}`}>
      <label
        htmlFor={id}
        className='block text-neutral-950 text-sm font-semibold mb-4'
      >
        {label}
      </label>
      <div className='relative'>
        {' '}
        {/* Wrapper untuk positioning ikon */}
        {multiline ? (
          <textarea
            id={id}
            className={cn(
              baseClasses,
              'min-h-[100px] p-4 resize-y',
              props.className
            )}
            {...textareaProps}
            {...(props as TextareaHTMLAttributes<HTMLTextAreaElement>)}
          />
        ) : (
          <input
            id={id}
            type={
              revealPassword ? (showPassword ? 'text' : 'password') : 'text'
            }
            className={cn(
              baseClasses,
              'h-48 py-10 px-16',
              revealPassword ? 'pr-15' : '',
              props.className
            )}
            {...props}
          />
        )}
        {/* Ikon Mata (hanya untuk field password) */}
        {revealPassword && (
          <button
            type='button'
            className='absolute inset-y-0 right-4 pr-3 flex items-center text-gray-500 hover:text-gray-700 cursor-pointer z-10'
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
      </div>
      {error && <p className='text-red-500 text-xs italic mt-1'>{error}</p>}
    </div>
  );
};

export default Input;
