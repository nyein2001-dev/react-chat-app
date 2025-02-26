import React from 'react';
import { useTheme } from '../../../context/ThemeContext';

interface BadgeProps {
  content: string | number;
  variant?: 'primary' | 'secondary' | 'error' | 'success';
  size?: 'sm' | 'md';
  className?: string;
}

export default function Badge({
  content,
  variant = 'primary',
  size = 'md',
  className = '',
}: BadgeProps) {
  const { theme } = useTheme();

  const variantStyles = {
    primary: `bg-${theme.colors.primary} text-white`,
    secondary: `bg-${theme.colors.secondary} text-white`,
    error: `bg-${theme.colors.error} text-white`,
    success: `bg-${theme.colors.success} text-white`,
  };

  const sizeStyles = {
    sm: 'text-xs px-1.5',
    md: 'text-sm px-2',
  };

  return (
    <span
      className={`
        inline-flex
        items-center
        justify-center
        rounded-full
        py-0.5
        font-medium
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
    >
      {content}
    </span>
  );
} 