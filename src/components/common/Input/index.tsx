import React, { forwardRef } from 'react';
import { useTheme } from '../../../context/ThemeContext';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
  icon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, fullWidth = false, icon, className = '', ...props }, ref) => {
    const { theme } = useTheme();

    const baseStyles = `
      rounded-md
      border
      px-3
      py-2
      outline-none
      transition-colors
      focus:border-${theme.colors.primary}
      focus:ring-1
      focus:ring-${theme.colors.primary}
      ${fullWidth ? 'w-full' : ''}
      ${error ? `border-${theme.colors.error}` : `border-${theme.colors.divider}`}
    `;

    return (
      <div className={`${fullWidth ? 'w-full' : ''}`}>
        {label && (
          <label className={`block mb-1 text-${theme.colors.text.secondary}`}>
            {label}
          </label>
        )}
        <div className="relative rounded-md shadow-sm">
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={`
              ${baseStyles}
              ${icon ? 'pl-10' : ''}
              ${className}
            `}
            {...props}
          />
        </div>
        {error && (
          <p className={`mt-1 text-sm text-${theme.colors.error}`}>
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input; 