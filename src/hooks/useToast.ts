import { useCallback } from 'react';

type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface UseToastReturn {
  showToast: (type: ToastType, message: string) => void;
}

export function useToast(): UseToastReturn {
  const showToast = useCallback((type: ToastType, message: string) => {
    console.log(`[${type.toUpperCase()}] ${message}`);
  }, []);

  return { showToast };
}

export default useToast; 