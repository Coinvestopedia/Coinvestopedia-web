import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

type Theme = 'light' | 'dark';

interface AppContextType {
  toasts: Toast[];
  addToast: (message: string, type: ToastType, duration?: number) => void;
  removeToast: (id: string) => void;
  theme: Theme;
  toggleTheme: () => void;
  isProUser: boolean;
  setIsProUser: (val: boolean) => void;
  activeSubMenu: string | null;
  setActiveSubMenu: (name: string | null) => void;
  pageCategories: any[];
  setPageCategories: (categories: any[]) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  // Initialize theme from localStorage or default to dark
  const [theme] = useState<Theme>('dark');

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    // Theme toggle disabled, keeping it dark mode permanently
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const addToast = useCallback((message: string, type: ToastType, duration = 3000) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, [removeToast]);

  const [isProUser, setIsProUser] = useState<boolean>(true); // Mock true for now
  const [activeSubMenu, setActiveSubMenu] = useState<string | null>(null);
  const [pageCategories, setPageCategories] = useState<any[]>([]);

  return (
    <AppContext.Provider value={{ 
      toasts, addToast, removeToast, theme, toggleTheme, isProUser, setIsProUser,
      activeSubMenu, setActiveSubMenu, pageCategories, setPageCategories 
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};