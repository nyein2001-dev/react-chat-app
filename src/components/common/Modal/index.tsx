import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useTheme } from '../../../context/ThemeContext';
import { LAYOUT } from '../../../constants/layout';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  const { theme } = useTheme();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className={`
        fixed inset-0
        bg-black bg-opacity-50
        flex items-center justify-center
        p-4
        z-[${LAYOUT.Z_INDEX.MODAL}]
      `}
      onClick={onClose}
    >
      <div
        className={`
          bg-${theme.colors.background.paper}
          rounded-lg
          shadow-xl
          max-w-md w-full
          max-h-[90vh]
          overflow-auto
        `}
        onClick={e => e.stopPropagation()}
      >
        {title && (
          <div className={`
            px-6 py-4
            border-b border-${theme.colors.divider}
          `}>
            <h2 className={theme.typography.h3}>{title}</h2>
          </div>
        )}
        <div className="p-6">{children}</div>
      </div>
    </div>,
    document.body
  );
} 