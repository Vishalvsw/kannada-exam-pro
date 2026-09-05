'use client';

import { useEffect, useState } from 'react';

export default function AdSenseBanner({
  adSlot = process.env.NEXT_PUBLIC_ADSENSE_SLOT || '5293436655',
  adFormat = 'vertical',
  fullWidthResponsive = false,
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
        minHeight: '250px',
        width: '100%',
        maxWidth: '300px',
        overflow: 'hidden',
        margin: '0 auto',
        ...style 
      }}
    >
      <ins
        className="adsbygoogle"
        style={{ 
          display: 'block',
          width: '100%',
          minHeight: '250px',
        }}
        data-ad-client={clientId}
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive={fullWidthResponsive ? 'true' : 'false'}
      />
    </div>
  );
}
