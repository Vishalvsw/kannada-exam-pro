'use client';

import { useEffect, useState } from 'react';

export default function AdSpace({ type = 'banner', className = '', adSlot = '' }) {
  const [isClient, setIsClient] = useState(false);
  const publisherId = process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID;
  const isProduction = process.env.NODE_ENV === 'production';

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Banner Ad Style (Default - Placeholder until AdSense approved)
  const adStyles = {
    banner: 'h-24 md:h-16',
    sidebar: 'h-60 w-full',
    inArticle: 'h-32 my-4',
  };

  const adColors = {
    banner: 'from-blue-50 to-indigo-50',
    sidebar: 'from-purple-50 to-pink-50',
    inArticle: 'from-green-50 to-teal-50',
  };

  const adMessages = {
    banner: '📢 Your Ad Here',
    sidebar: '📢 Sponsor Message',
    inArticle: '📢 Recommended for you',
  };

  const heightClass = adStyles[type] || adStyles.banner;
  const bgColor = adColors[type] || adColors.banner;
  const message = adMessages[type] || adMessages.banner;

  // Show real AdSense ads after approval
  if (isProduction && publisherId && adSlot && isClient) {
    useEffect(() => {
      try {
        // Load AdSense script if not already loaded
        if (!document.querySelector('script[src*="adsbygoogle.js"]')) {
          const script = document.createElement('script');
          script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-${publisherId}`;
          script.async = true;
          script.crossOrigin = 'anonymous';
          document.head.appendChild(script);
        }

        // Push ad
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (error) {
        console.error('AdSense error:', error);
      }
    }, []);

    // Get ad format based on type
    const getAdFormat = () => {
      switch(type) {
        case 'inArticle': return 'rectangle';
        case 'sidebar': return 'vertical';
        default: return 'horizontal';
      }
    };

    return (
      <div className={`ad-space ${heightClass} ${className}`}>
        <ins
          className="adsbygoogle"
          style={{ display: 'block', width: '100%', height: '100%' }}
          data-ad-client={`ca-${publisherId}`}
          data-ad-slot={adSlot}
          data-ad-format={getAdFormat()}
          data-full-width-responsive="true"
        />
      </div>
    );
  }

  // Show placeholder ads (before AdSense approval or in development)
  return (
    <div className={`ad-space ${heightClass} ${className}`}>
      <div className={`bg-gradient-to-r ${bgColor} rounded-xl border border-gray-200 overflow-hidden h-full`}>
        <div className="flex items-center justify-center h-full p-3">
          <div className="text-center">
            <p className="text-[10px] text-gray-400 mb-1">Advertisement</p>
            <p className="text-sm text-gray-500 font-medium">{message}</p>
            <p className="text-[10px] text-gray-400 mt-1">Support Kannada Exam Pro</p>
          </div>
        </div>
      </div>
    </div>
  );
}