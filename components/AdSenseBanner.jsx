// components/AdSenseBanner.jsx - Updated
'use client';

import { useEffect, useState, useRef } from 'react';

export default function AdSenseBanner({
  adSlot = process.env.NEXT_PUBLIC_ADSENSE_SLOT || '5293436655',
  adUnit = process.env.NEXT_PUBLIC_AD_UNIT || '/23369396230/MCQup',
  adSizes = [[320, 100], [320, 50]],
  divId = process.env.NEXT_PUBLIC_AD_DIV_ID || 'div-gpt-ad-1788864007233-0',
  className = '',
  style = {},
  useGPT = true,
}) {
  const [isClient, setIsClient] = useState(false);
  const [adLoaded, setAdLoaded] = useState(false);
  const containerRef = useRef(null);
  const adPushedRef = useRef(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || adPushedRef.current || !containerRef.current) return;

    const loadAd = () => {
      try {
        if (useGPT) {
          // Google Ad Manager (GPT)
          if (window.googletag && window.googletag.cmd) {
            // Check if container still exists in DOM
            if (document.contains(containerRef.current)) {
              window.googletag.cmd.push(() => {
                if (document.contains(containerRef.current)) {
                  window.googletag.display(divId);
                  adPushedRef.current = true;
                  setAdLoaded(true);
                }
              });
            }
          } else {
            setTimeout(loadAd, 500);
          }
        } else {
          // Google AdSense (Fallback)
          if (window.adsbygoogle && containerRef.current) {
            if (document.contains(containerRef.current)) {
              window.adsbygoogle.push({});
              adPushedRef.current = true;
              setAdLoaded(true);
            }
          } else {
            setTimeout(loadAd, 500);
          }
        }
      } catch (error) {
        console.error('Ad error:', error);
      }
    };

    const timer = setTimeout(loadAd, 500);
    return () => clearTimeout(timer);
  }, [isClient, divId, useGPT]);

  // Show placeholder while loading
  if (!isClient || !adLoaded) {
    return (
      <div 
        className={`ad-placeholder ${className}`}
        style={{ 
          width: '320px',
          height: '100px',
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

  if (useGPT) {
    // Google Ad Manager (GPT) Render
    return (
      <div 
        ref={containerRef}
        className={`ad-banner ${className}`} 
        style={{ 
          width: '100%',
          maxWidth: '320px',
          minHeight: '50px',
          overflow: 'hidden',
          margin: '0 auto',
          ...style 
        }}
      >
        <div 
          id={divId} 
          style={{ 
            minWidth: '320px', 
            minHeight: '50px',
            width: '100%',
            maxWidth: '320px',
            margin: '0 auto',
          }}
        />
      </div>
    );
  }

  // Google AdSense Render (Fallback)
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