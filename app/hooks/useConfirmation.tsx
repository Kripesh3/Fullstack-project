'use client';

import { useState, useCallback } from 'react';

interface ConfirmationOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'warning' | 'danger' | 'success' | 'info';
}

interface ConfirmationState extends ConfirmationOptions {
  isOpen: boolean;
  loading: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function useConfirmation() {
  const [confirmationState, setConfirmationState] = useState<ConfirmationState>({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    type: 'warning',
    loading: false,
    onConfirm: () => {},
    onCancel: () => {},
  });

  const showConfirmation = useCallback((
    options: ConfirmationOptions
  ): Promise<boolean> => {
    return new Promise((resolve) => {
      setConfirmationState({
        ...options,
        isOpen: true,
        loading: false,
        confirmText: options.confirmText || 'Confirm',
        cancelText: options.cancelText || 'Cancel',
        type: options.type || 'warning',
        onConfirm: () => {
          setConfirmationState(prev => ({ ...prev, loading: true }));
          setTimeout(() => {
            setConfirmationState(prev => ({ ...prev, isOpen: false, loading: false }));
            resolve(true);
          }, 300); // Small delay for better UX
        },
        onCancel: () => {
          setConfirmationState(prev => ({ ...prev, isOpen: false }));
          resolve(false);
        },
      });
    });
  }, []);

  const hideConfirmation = useCallback(() => {
    setConfirmationState(prev => ({ ...prev, isOpen: false }));
  }, []);

  return {
    confirmationState,
    showConfirmation,
    hideConfirmation,
  };
}
