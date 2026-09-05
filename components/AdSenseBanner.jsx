'use client';

import { useEffect, useState } from 'react';

export default function AdSenseBanner({
  adSlot = process.env.NEXT_PUBLIC_ADSENSE_SLOT || '5293436655',
  adFormat = 'auto',
  fullWidthResponsive = true,
  className = '',
  style = {},
  adLayout = '',
  adLayoutKey = '',
  height = 'auto',
  width = '100%',
  minHeight = '90px',
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
        }, 300);
      }
    } catch (error) {
      console.error('AdSense error:', error);
    }
  }, [adSlot, isClient, adPushed]);

  if (!isClient) {
    return (
      <div 
        className={`ad-placeholder ${className}`}
        style={{ 
          minHeight: minHeight,
          width: width,
          height: height,
          ...style 
        }}
      >
        <div className="animate-pulse bg-gray-100 rounded-lg h-full w-full flex items-center justify-center">
          <span className="text-gray-400 text-sm">Loading Ad...</span>
        </div>
      </div>
    );
  }

  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT || 'ca-pub-3976598981288611';

  // Responsive styles based on ad format
  const getAdStyles = () => {
    const baseStyles = {
      display: 'block',
      width: '100%',
      height: height,
      minHeight: minHeight,
    };

    switch (adFormat) {
      case 'horizontal':
        return {
          ...baseStyles,
          maxWidth: '728px',
          minHeight: '90px',
        };
      case 'vertical':
        return {
          ...baseStyles,
          maxWidth: '300px',
          minHeight: '250px',
        };
      case 'rectangle':
        return {
          ...baseStyles,
          maxWidth: '336px',
          minHeight: '280px',
        };
      case 'auto':
      default:
        return {
          ...baseStyles,
          maxWidth: '100%',
          minHeight: minHeight,
        };
    }
  };

  const adStyles = getAdStyles();

  return (
    <div 
      className={`ad-banner ${className}`} 
      style={{ 
        width: width,
        height: height,
        overflow: 'hidden',
        margin: '0 auto',
        ...style 
      }}
    >
      <ins
        className="adsbygoogle"
        style={adStyles}
        data-ad-client={clientId}
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-ad-layout={adLayout}
        data-ad-layout-key={adLayoutKey}
        data-full-width-responsive={fullWidthResponsive ? 'true' : 'false'}
      />
    </div>
  );
}