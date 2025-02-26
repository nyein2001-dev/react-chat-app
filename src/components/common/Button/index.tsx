import React from 'react';
import { useTheme } from '../../../context/ThemeContext';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outlined';
  size?: 'sm' | 'md' | 'lg';
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}: ButtonProps) {
  const { theme } = useTheme();

  const baseStyles = 'font-semibold rounded transition-colors';
  
  const variantStyles = {
    primary: `
      bg-primary-light dark:bg-primary-dark
      text-white
      hover:bg-opacity-90
    `,
    secondary: `
      bg-gray-200 dark:bg-gray-700
      text-gray-900 dark:text-gray-100
      hover:bg-gray-300 dark:hover:bg-gray-600
    `,
    outlined: `
      border-2
      border-primary-light dark:border-primary-dark
      text-primary-light dark:text-primary-dark
      hover:bg-primary-light hover:bg-opacity-10
      dark:hover:bg-primary-dark dark:hover:bg-opacity-10
    `,
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
} 