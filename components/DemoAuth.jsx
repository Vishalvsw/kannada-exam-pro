'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const DemoAuthContext = createContext();

export function useDemoAuth() {
  return useContext(DemoAuthContext);
}

export function DemoAuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const demoUsers = [
    {
      id: '1',
      name: 'Raju Kumar',
      email: 'raju.kumar@example.com',
      image: 'https://ui-avatars.com/api/?name=Raju+Kumar&background=3B82F6&color=fff&size=100',
      instagramId: '@rajukumar_official',
      role: 'user',
      score: 85,
      totalQuizzesTaken: 12,
    },
    {
      id: '2',
      name: 'Priya Sharma',
      email: 'priya.sharma@example.com',
      image: 'https://ui-avatars.com/api/?name=Priya+Sharma&background=10B981&color=fff&size=100',
      instagramId: '@priya_sharma',
      role: 'user',
      score: 92,
      totalQuizzesTaken: 15,
    },
    {
      id: '3',
      name: 'Admin User',
      email: 'admin@example.com',
      image: 'https://ui-avatars.com/api/?name=Admin&background=8B5CF6&color=fff&size=100',
      instagramId: '',
      role: 'admin',
      score: 0,
      totalQuizzesTaken: 0,
    },
  ];

  const demoLogin = (userEmail) => {
    setLoading(true);
    setTimeout(() => {
      const foundUser = demoUsers.find(u => u.email === userEmail);
      if (foundUser) {
        setUser(foundUser);
        localStorage.setItem('demoUser', JSON.stringify(foundUser));
      }
      setLoading(false);
    }, 1000);
  };

  const demoSignup = (name, email, instagramId) => {
    setLoading(true);
    setTimeout(() => {
      const newUser = {
        id: Date.now().toString(),
        name: name,
        email: email,
        image: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=3B82F6&color=fff&size=100`,
        instagramId: instagramId ? `@${instagramId}` : '',
        role: 'user',
        score: 0,
        totalQuizzesTaken: 0,
      };
      setUser(newUser);
      localStorage.setItem('demoUser', JSON.stringify(newUser));
      setLoading(false);
    }, 1000);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('demoUser');
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('demoUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <DemoAuthContext.Provider value={{ user, loading, demoLogin, demoSignup, logout, demoUsers }}>
      {children}
    </DemoAuthContext.Provider>
  );
}
