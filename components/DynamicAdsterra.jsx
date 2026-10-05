'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import BannerAd320x50 from './BannerAd320x50';
import { shouldShowAds } from '@/lib/adConfig';

export default function DynamicAdsterra({
  position = 'fixed-bottom',   // 'top' | 'bottom' | 'fixed-bottom'
}) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  if (!shouldShowAds('adsterra', pathname || '/')) return null;

  // ✅ Fixed at bottom of screen — always visible
  if (position === 'fixed-bottom') {
    return (
      <div
        className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg"
        style={{ minHeight: '60px' }}
      >
        <div className="flex justify-center items-center py-2">
          <BannerAd320x50 />
        </div>
      </div>
    );
  }

  // Top or bottom of content
  return (
    <div
      className={`relative w-full z-10 bg-gray-50 ${
        position === 'top' ? 'border-b' : 'border-t'
      } border-gray-200`}
      style={{ minHeight: '70px' }}
    >
      <div className="flex justify-center items-center py-4">
        <BannerAd320x50 />
      </div>
    </div>
  );
}