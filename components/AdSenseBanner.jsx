'use client';

import { useEffect, useState, useRef } from 'react';

export default function AdSenseBanner({
  adSlot = process.env.NEXT_PUBLIC_ADSENSE_SLOT || '5293436655',
  adUnit = '/23369396230/MCQup', // New: Google Ad Manager ad unit
  adSizes = [[320, 100], [320, 50]], // New: Ad sizes
  divId = 'div-gpt-ad-1788864007233-0', // New: Div ID
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

    const loadAd = () => {
      try {
        // Check if GPT is loaded
        if (window.googletag && window.googletag.cmd) {
          window.googletag.cmd.push(() => {
            if (containerRef.current) {
              window.googletag.display(divId);
              adPushedRef.current = true;
            }
          });
        } else {
          // Retry after a delay
          setTimeout(loadAd, 500);
        }
      } catch (error) {
        console.error('Ad Manager error:', error);
      }
    };

    const timer = setTimeout(loadAd, 500);
    return () => clearTimeout(timer);
  }, [isClient, divId]);

  // Show placeholder while loading
  if (!isClient) {
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
      {/* Google Ad Manager Ad Unit */}
      <div 
        id={divId} 
        style={{ 
          minWidth: '320px', 
          minHeight: '50px',
          width: '100%',
          maxWidth: '320px',
          margin: '0 auto',
        }}
      >
        <script
          dangerouslySetInnerHTML={{
            __html: `
              googletag.cmd.push(function() {
                googletag.display('${divId}');
              });
            `
          }}
        />
      </div>
    </div>
  );
}