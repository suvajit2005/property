// Admin authentication guard and context
import { createContext, useContext, ReactNode } from 'react';
import { useAuth } from '@/lib/auth';
import { useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';

type AdminContextType = {
  isAdmin: boolean;
  isSuperAdmin: boolean;
};

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: ReactNode }) {
  const { profile } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (profile && profile.role !== 'admin') {
      navigate({ to: '/dashboard' });
    }
  }, [profile, navigate]);

  const isAdmin = profile?.role === 'admin';
  const isSuperAdmin = profile?.role === 'admin'; // In future, differentiate super admin

  if (!isAdmin) {
    return null;
  }

  return (
    <AdminContext.Provider value={{ isAdmin, isSuperAdmin }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within AdminProvider');
  }
  return context;
}
