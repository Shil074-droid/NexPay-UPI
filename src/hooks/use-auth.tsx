'use client';

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import type { User, UserRole } from '@/lib/types';
import { findUserByEmail, addUser } from '@/lib/mock-data';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<boolean>;
  logout: () => void;
  signup: (name: string, email: string, pass: string, role: UserRole) => Promise<boolean>;
  refetchUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = sessionStorage.getItem('nexpay-user');
    if (storedUser) {
      const parsedUser: User = JSON.parse(storedUser);
      findUserByEmail(parsedUser.email).then(freshUser => {
        if(freshUser) {
          const { password, ...userToSet } = freshUser;
          setUser(userToSet);
        }
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, pass: string) => {
    setLoading(true);
    const foundUser = await findUserByEmail(email);
    if (foundUser && foundUser.password === pass) {
      const { password, ...userToSet } = foundUser;
      setUser(userToSet);
      sessionStorage.setItem('nexpay-user', JSON.stringify(userToSet));
      setLoading(false);
      return true;
    }
    setLoading(false);
    return false;
  };
  
  const signup = async (name: string, email: string, pass: string, role: UserRole) => {
    setLoading(true);
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      setLoading(false);
      return false; // User already exists
    }
    const newUser = await addUser({ name, email, password: pass, role });
    const { password, ...userToSet } = newUser;
    setUser(userToSet);
    sessionStorage.setItem('nexpay-user', JSON.stringify(userToSet));
    setLoading(false);
    return true;
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem('nexpay-user');
  };

  const refetchUser = async () => {
    if (user) {
      const freshUser = await findUserByEmail(user.email);
       if (freshUser) {
          const { password, ...userToSet } = freshUser;
          setUser(userToSet);
          sessionStorage.setItem('nexpay-user', JSON.stringify(userToSet));
       }
    }
  }


  return (
    <AuthContext.Provider value={{ user, loading, login, logout, signup, refetchUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
