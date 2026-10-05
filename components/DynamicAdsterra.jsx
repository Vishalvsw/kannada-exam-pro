'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import BannerAd320x50 from './BannerAd320x50';
import { shouldShowAds, AD_CONFIG } from '@/lib/adConfig';

export default function DynamicAdsterra({
  position = 'top',   // 'top' | 'bottom' | 'fixed-bottom'
}) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  if (!shouldShowAds('adsterra', pathname || '/')) return null;

  // Pick the correct zone based on position
  const slotConfig =
    position === 'top' ? AD_CONFIG.adsterra.top : AD_CONFIG.adsterra.bottom;

  if (!slotConfig?.key) return null;
  const { key, width, height } = slotConfig;

  // ─────────── Fixed bottom ───────────
  if (position === 'fixed-bottom') {
    return (
      <div
        className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg"
        style={{ minHeight: `${height + 20}px` }}
        aria-label="Advertisement"
      >
        <div className="flex justify-center items-center py-2">
          <BannerAd320x50 adKey={key} width={width} height={height} />
        </div>
      </div>
    );
  }

  // ─────────── Top ───────────
  if (position === 'top') {
    return (
      <div
        className="relative w-full z-10 bg-gray-50 border-b border-gray-200"
        style={{ minHeight: `${height + 20}px` }}
        aria-label="Advertisement"
      >
        <div className="flex justify-center items-center py-3">
          <BannerAd320x50 adKey={key} width={width} height={height} />
        </div>
      </div>
    );
  }

  // ─────────── Bottom ───────────
  return (
    <div
      className="relative w-full z-10 bg-gray-50 border-t border-gray-200"
      style={{ minHeight: `${height + 20}px` }}
      aria-label="Advertisement"
    >
      <div className="flex justify-center items-center py-3">
        <BannerAd320x50 adKey={key} width={width} height={height} />
      </div>
    </div>
  );
}