'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Logo() {
  const [logoError, setLogoError] = useState(false);
  const [logoVersion, setLogoVersion] = useState(Date.now());

  // Auto-refresh logo
  useState(() => {
    const interval = setInterval(() => setLogoVersion(Date.now()), 3000);
    return () => clearInterval(interval);
  }, []);

  const logoSrc = `/images/logo.png?v=${logoVersion}`;

  return (
    <Link href="/" className="flex items-center gap-2 group">
      {!logoError ? (
        <div className="w-10 h-10 overflow-hidden rounded-xl shadow-md group-hover:scale-105 transition-transform bg-gray-100">
          <img src={logoSrc} alt="Logo" className="w-full h-full object-cover" onError={() => setLogoError(true)} />
        </div>
      ) : (
        <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl flex items-center justify-center shadow-md">
          <span className="text-white text-xl">🎯</span>
        </div>
      )}
      <div>
        <span className="ml-2 text-xs text-gray-500 hidden sm:inline">KAS | PSI | PDO | FDA | SDA</span>
      </div>
    </Link>
  );
}
