'use client';

import React, { createContext, useContext } from 'react';
import ConfirmationModal from '../components/ui/ConfirmationModal';
import { useConfirmation } from '../hooks/useConfirmation';

interface ConfirmationContextType {
  showConfirmation: (options: {
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    type?: 'warning' | 'danger' | 'success' | 'info';
  }) => Promise<boolean>;
}

const ConfirmationContext = createContext<ConfirmationContextType | undefined>(undefined);

export function ConfirmationProvider({ children }: { children: React.ReactNode }) {
  const { confirmationState, showConfirmation, hideConfirmation } = useConfirmation();

  return (
    <ConfirmationContext.Provider value={{ showConfirmation }}>
      {children}
      <ConfirmationModal
        isOpen={confirmationState.isOpen}
        onClose={confirmationState.onCancel}
        onConfirm={confirmationState.onConfirm}
        title={confirmationState.title}
        message={confirmationState.message}
        confirmText={confirmationState.confirmText}
        cancelText={confirmationState.cancelText}
        type={confirmationState.type}
        loading={confirmationState.loading}
      />
    </ConfirmationContext.Provider>
  );
}

export function useConfirmationDialog() {
  const context = useContext(ConfirmationContext);
  if (context === undefined) {
    throw new Error('useConfirmationDialog must be used within a ConfirmationProvider');
  }
  return context;
}
