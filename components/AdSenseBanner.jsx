'use client';

import { useEffect, useState } from 'react';

export default function AdSenseBanner({
  adSlot = process.env.NEXT_PUBLIC_ADSENSE_SLOT || '5293436655',
  adFormat = 'auto',
  fullWidthResponsive = true,
  className = '',
  style = {},
}) {
  const [isClient, setIsClient] = useState(false);
  const [adPushed, setAdPushed] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || adPushed) return;

    try {
      if (window.adsbygoogle) {
        // ✅ Wait for DOM to be ready
        setTimeout(() => {
          window.adsbygoogle.push({});
          setAdPushed(true);
          console.log('✅ Ad pushed for slot:', adSlot);
        }, 300);
      }
    } catch (error) {
      console.error('AdSense error:', error);
    }
  }, [adSlot, isClient, adPushed]);

  if (!isClient) {
    return null;
  }

  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT || 'ca-pub-3976598981288611';

  return (
    <div 
      className={`ad-banner ${className}`} 
      style={{ 
        minHeight: '100px',
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
          minHeight: '100px',
        }}
        data-ad-client={clientId}
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive={fullWidthResponsive ? 'true' : 'false'}
      />
    </div>
  );
}
