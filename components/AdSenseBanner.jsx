'use client';

import { useEffect, useRef } from 'react';

export default function AdSenseBanner({
  adSlot,
  adFormat = 'auto',
  fullWidthResponsive = true,
  className = '',
  style = {},
}) {
  const adRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      if (window.adsbygoogle) {
        window.adsbygoogle.push({});
      }
    } catch (error) {
      console.error('AdSense error:', error);
    }
  }, []);

  return (
    <div
      ref={adRef}
      className={`ad-banner ${className}`}
      style={{ minHeight: '90px', ...style }}
    >
      <ins
        className="adsbygoogle"
        style={{ display: 'block', ...style }}
        data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT || 'ca-pub-3976598981288611'}
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive={fullWidthResponsive ? 'true' : 'false'}
      />
    </div>
  );
}
