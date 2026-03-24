'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      // Check if token is expired
      if (payload.exp * 1000 < Date.now()) {
        localStorage.removeItem('authToken');
        setUser(null);
      } else {
        setUser(payload);
      }
    } catch {
      localStorage.removeItem('authToken');
      setUser(null);
    }
    setLoading(false);
  }, []);

  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
    router.push('/');
  };

  const getUserId = () => user?.userId || null;
  const getName = () => user?.name || 'Student';
  const getEmail = () => user?.email || '';
  const getRole = () => user?.role || 'student';
  const isStudent = () => user?.role === 'student';
  const isMentor = () => user?.role === 'mentor';

  return {
    user,
    loading,
    logout,
    getUserId,
    getName,
    getEmail,
    getRole,
    isStudent,
    isMentor,
    isAuthenticated: !!user,
  };
}