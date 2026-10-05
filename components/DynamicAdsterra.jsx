'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import BannerAd320x50 from './BannerAd320x50';
import { shouldShowAds } from '@/lib/adConfig';

export default function DynamicAdsterra() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render during SSR — prevents hydration mismatch
  if (!mounted) return null;

  // Ask the config: should Adsterra show on this path?
  const show = shouldShowAds('adsterra', pathname || '/');

  if (!show) return null;

  return (
    <div className="flex justify-center items-center py-4 bg-gray-50 border-t border-gray-200">
      <BannerAd320x50 />
    </div>
  );
}