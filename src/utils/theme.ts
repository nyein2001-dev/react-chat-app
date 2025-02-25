import { Theme } from '../models/theme/types';

export const lightTheme: Theme = {
    mode: 'light',
    colors: {
        primary: '#2563eb',
        secondary: '#4f46e5',
        background: {
            main: '#f3f4f6',
            paper: '#ffffff',
        },
        text: {
            primary: '#111827',
            secondary: '#4b5563',
            disabled: '#9ca3af',
        },
        divider: '#e5e7eb',
        error: '#ef4444',
        success: '#22c55e',
        warning: '#f59e0b',
        info: '#3b82f6',
    },
    spacing: {
        xs: '0.25rem',
        sm: '0.5rem',
        md: '1rem',
        lg: '1.5rem',
        xl: '2rem',
    },
    typography: {
        h1: 'text-4xl font-bold',
        h2: 'text-3xl font-bold',
        h3: 'text-2xl font-bold',
        h4: 'text-xl font-semibold',
        body1: 'text-base',
        body2: 'text-sm',
        caption: 'text-xs',
    },
    borderRadius: {
        xs: '0.125rem',
        sm: '0.25rem',
        md: '0.375rem',
        lg: '0.5rem',
        xl: '0.75rem',
    },
};

export const darkTheme: Theme = {
    ...lightTheme,
    mode: 'dark',
    colors: {
        primary: '#3b82f6',
        secondary: '#6366f1',
        background: {
            main: '#111827',
            paper: '#1f2937',
        },
        text: {
            primary: '#f9fafb',
            secondary: '#e5e7eb',
            disabled: '#6b7280',
        },
        divider: '#374151',
        error: '#f87171',
        success: '#4ade80',
        warning: '#fbbf24',
        info: '#60a5fa',
    },
}; 