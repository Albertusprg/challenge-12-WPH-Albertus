// src/components/Input.tsx
import { cn } from '@/lib/utils';
import React, { InputHTMLAttributes, TextareaHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  error?: string;
  containerClassName?: string;
  multiline?: boolean;
  textareaProps?: TextareaHTMLAttributes<HTMLTextAreaElement>;
}

const Input: React.FC<InputProps> = ({
  id,
  label,
  error,
  containerClassName,
  multiline = false, // Default: false (single line input)
  textareaProps, //
  ...props
}) => {
  const baseClasses = `shadow appearance-none border rounded-xl w-full text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
    error ? 'border-red-500' : ''
  }`;

  return (
    <div className={`mb-4 ${containerClassName}`}>
      <label
        htmlFor={id}
        className='block text-neutral-950 text-sm font-semibold mb-4'
      >
        {label}
      </label>
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
          className={cn(baseClasses, 'h-48 py-10 px-16', props.className)}
          {...props}
        />
      )}
      {error && <p className='text-red-500 text-xs italic mt-1'>{error}</p>}
    </div>
  );
};

export default Input;
