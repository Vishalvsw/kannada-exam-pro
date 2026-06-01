'use client';

import { useEffect } from 'react';

export default function AdSpace({ type = 'banner', className = '' }) {
  // Google AdSense will be integrated here
  // Replace with your actual AdSense code when you have it
  
  const adStyles = {
    banner: 'h-24 md:h-16',
    sidebar: 'h-60 w-full',
    inArticle: 'h-32 my-4',
    popup: 'h-40',
  };

  const adColors = {
    banner: 'from-blue-50 to-indigo-50',
    sidebar: 'from-purple-50 to-pink-50',
    inArticle: 'from-green-50 to-teal-50',
    popup: 'from-yellow-50 to-orange-50',
  };

  return (
    <div className={`ad-space ${adStyles[type]} ${className}`}>
      <div className={`bg-gradient-to-r ${adColors[type]} rounded-xl border border-gray-200 overflow-hidden`}>
        <div className="flex items-center justify-center h-full p-3">
          <div className="text-center">
            <div className="text-xs text-gray-400 mb-1">Advertisement</div>
            <div className="text-sm text-gray-500">
              {type === 'banner' && '📢 Your Ad Here'}
              {type === 'sidebar' && '📢 Sponsor Message'}
              {type === 'inArticle' && '📢 Recommended for you'}
              {type === 'popup' && '📢 Special Offer'}
            </div>
            {/* Google AdSense code will go here */}
            <div className="text-xs text-gray-400 mt-1">Support Kannada Exam Pro</div>
          </div>
        </div>
      </div>
    </div>
  );
}
