'use client';

import { useEffect } from 'react';

export default function AdSenseScript() {
  useEffect(() => {
    // Only run in the browser, not during build/prerendering
    if (typeof window !== 'undefined') {
      // Your AdSense script code here
      const script = document.createElement('script');
      script.src = '<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3976598981288611" crossorigin="anonymous"></script>';
      script.async = true;
      script.crossOrigin = 'anonymous';
      document.head.appendChild(script);
    }
  }, []);

  return null;
}
