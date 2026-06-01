'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminLoginLink() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    setIsAdmin(!!adminToken);
  }, []);

  // This component is hidden - admin link is only accessible via direct URL
  // No visible link in the main navigation
  return null;
}
