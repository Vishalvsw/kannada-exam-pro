// components/BannerAd320x50.jsx
'use client';

import { useEffect, useRef, useState } from 'react';

// Module-level flag — prevents duplicate script loads across component instances
const loadedKeys = new Set();

export default function BannerAd320x50({
  adKey = 'a2ad75aded5a9dd54c993b9731bd9df9',
  width = 320,
  height = 50,
  className = '',
  style = {},
}) {
  const containerRef = useRef(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Already rendered an iframe → don't re-inject
    if (container.querySelector('iframe')) {
      setLoaded(true);
      return;
    }

    // Global guard — only inject once per adKey for the entire page
    if (loadedKeys.has(adKey)) {
      return;
    }
    loadedKeys.add(adKey);

    // 1. Set atOptions BEFORE loading script (sync, no queue)
    window.atOptions = {
      key: adKey,
      format: 'iframe',
      height,
      width,
      params: {},
    };

    // 2. Create the ad script
    const adScript = document.createElement('script');
    adScript.type = 'text/javascript';
    adScript.src = `https://bauval.org/22/${adKey}`;
    adScript.async = true;

    adScript.onload = () => {
      setLoaded(true);
      // Adsterra usually injects an iframe; give it a moment
      setTimeout(() => {
        const iframe = container.querySelector('iframe');
        if (iframe) {
          console.log('✅ Adsterra iframe rendered:', iframe.src);
        } else {
          console.warn('⚠️ Adsterra script loaded but no iframe — likely no fill for this key');
        }
      }, 2500);
    };

    adScript.onerror = () => {
      console.warn('[BannerAd] Script failed to load:', adKey);
      loadedKeys.delete(adKey);   // allow retry
    };

    container.appendChild(adScript);

    // ✅ NO cleanup — let Adsterra own the container once it starts rendering
    // React Strict Mode will remount, but the loadedKeys guard prevents re-injection
  }, [adKey, width, height]);

  return (
    <div
      className={`flex justify-center items-center my-4 ${className}`}
      style={{
        minHeight: `${height}px`,
        minWidth: `${width}px`,
        ...style,
      }}
      aria-label="Advertisement"
    >
      {!loaded && (
        <span className="text-xs text-gray-400 animate-pulse">
          Loading ad…
        </span>
      )}
      <div
        ref={containerRef}
        style={{
          width: `${width}px`,
          height: `${height}px`,
        }}
      />
    </div>
  );
}