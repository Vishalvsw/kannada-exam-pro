'use client';

import { useEffect, useState } from 'react';

export default function AdSenseBanner({
  adSlot,
  adFormat = 'auto',
  fullWidthResponsive = true,
  className = '',
  style = {},
}) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    try {
      if (window.adsbygoogle) {
        window.adsbygoogle.push({});
        console.log('✅ Ad pushed for slot:', adSlot);
      }
    } catch (error) {
      console.error('AdSense error:', error);
    }
  }, [adSlot, isClient]);

  if (!isClient) {
    return null;
  }

  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT || 'ca-pub-3976598981288611';

  return (
    <div 
      className={`ad-banner ${className}`} 
      style={{ 
        minHeight: '90px',
        width: '100%',
        maxWidth: '100%',
        overflow: 'hidden',
        ...style 
      }}
    >
      <ins
        className="adsbygoogle"
        style={{ 
          display: 'block',
          width: '100%',
          minHeight: '90px',
        }}
        data-ad-client={clientId}
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive={fullWidthResponsive ? 'true' : 'false'}
      />
    </div>
  );
}
