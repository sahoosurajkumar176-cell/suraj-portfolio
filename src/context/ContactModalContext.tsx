import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

interface ContactModalContextType {
  isOpen: boolean;
  openContactModal: (serviceId?: string) => void;
  closeContactModal: () => void;
  initialServiceId?: string;
}

const ContactModalContext = createContext<ContactModalContextType | undefined>(undefined);

export function ContactModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [initialServiceId, setInitialServiceId] = useState<string | undefined>(undefined);

  const openContactModal = (serviceId?: string) => {
    setInitialServiceId(serviceId);
    setIsOpen(true);
  };

  const closeContactModal = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          closeContactModal();
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = originalOverflow;
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isOpen]);

  return (
    <ContactModalContext.Provider
      value={{
        isOpen,
        openContactModal,
        closeContactModal,
        initialServiceId,
      }}
    >
      {children}
    </ContactModalContext.Provider>
  );
}

export function useContactModal() {
  const context = useContext(ContactModalContext);
  if (!context) {
    throw new Error('useContactModal must be used within a ContactModalProvider');
  }
  return context;
}
