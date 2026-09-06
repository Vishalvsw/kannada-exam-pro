'use client';

import { useEffect, useState, useRef } from 'react';

export default function AdSenseBanner({
  adSlot = process.env.NEXT_PUBLIC_ADSENSE_SLOT || '5293436655',
  className = '',
  style = {},
}) {
  const [isClient, setIsClient] = useState(false);
  const containerRef = useRef(null);
  const adPushedRef = useRef(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;
    if (adPushedRef.current) return;

    const pushAd = () => {
      try {
        if (window.adsbygoogle && containerRef.current) {
          if (document.contains(containerRef.current)) {
            window.adsbygoogle.push({});
            adPushedRef.current = true;
          }
        } else {
          setTimeout(pushAd, 500);
        }
      } catch (error) {
        console.error('AdSense error:', error);
      }
    };

    const timer = setTimeout(pushAd, 500);
    return () => clearTimeout(timer);
  }, [isClient]);

  // Show placeholder while loading
  if (!isClient) {
    return (
      <div 
        className={`ad-placeholder ${className}`}
        style={{ 
          width: '300px',
          height: '250px',
          maxWidth: '100%',
          ...style 
        }}
      >
        <div className="animate-pulse bg-gray-100 rounded-lg h-full w-full flex items-center justify-center">
          <span className="text-gray-400 text-sm">Loading Ad...</span>
        </div>
      </div>
    );
  }

  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT || 'ca-pub-9119771130084938';

  return (
    <div 
      ref={containerRef}
      className={`ad-banner ${className}`} 
      style={{ 
        width: '300px',
        height: '250px',
        maxWidth: '100%',
        overflow: 'hidden',
        margin: '0 auto',
        ...style 
      }}
    >
      <ins
        className="adsbygoogle"
        style={{ 
          display: 'block',
          width: '300px',
          height: '250px',
        }}
        data-ad-client={clientId}
        data-ad-slot={adSlot}
        data-ad-format="rectangle"
        data-full-width-responsive="false"
      />
    </div>
  );
}