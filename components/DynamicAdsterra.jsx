'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import BannerAd320x50 from './BannerAd320x50';
import { shouldShowAds } from '@/lib/adConfig';

export default function DynamicAdsterra({
  position = 'fixed-bottom',   // 'top' | 'bottom' | 'fixed-bottom'
  minHeight,
}) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render before hydration — prevents SSR/CSR mismatch
  if (!mounted) return null;

  // Ask the config: should Adsterra show on this path?
  if (!shouldShowAds('adsterra', pathname || '/')) return null;

  // ============================================================
  // ✅ FIXED BOTTOM — Sticks to bottom of viewport, always visible
  // ============================================================
  if (position === 'fixed-bottom') {
    return (
      <div
        className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg"
        style={{ minHeight: minHeight || '60px' }}
        aria-label="Advertisement"
      >
        <div className="flex justify-center items-center py-2">
          <BannerAd320x50 />
        </div>
      </div>
    );
  }

  // ============================================================
  // ✅ TOP — Sticks to top of content (below nav)
  // ============================================================
  if (position === 'top') {
    return (
      <div
        className="relative w-full z-10 bg-gray-50 border-b border-gray-200"
        style={{ minHeight: minHeight || '70px' }}
        aria-label="Advertisement"
      >
        <div className="flex justify-center items-center py-4">
          <BannerAd320x50 />
        </div>
      </div>
    );
  }

  // ============================================================
  // ✅ BOTTOM — Sticks to bottom of content (in flow, above footer)
  // ============================================================
  return (
    <div
      className="relative w-full z-10 bg-gray-50 border-t border-gray-200"
      style={{ minHeight: minHeight || '70px' }}
      aria-label="Advertisement"
    >
      <div className="flex justify-center items-center py-4">
        <BannerAd320x50 />
      </div>
    </div>
  );
}