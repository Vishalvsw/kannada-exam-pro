'use client';

import { useEffect } from 'react';

export default function AdSenseScript() {
  useEffect(() => {
    // Only load in production and on client side
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
      // Add your AdSense script here
      const script = document.createElement('script');
      script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3976598981288611';
      script.async = true;
      script.crossOrigin = 'anonymous';
      document.head.appendChild(script);
    }
  }, []);

  return null;
}
