// components/BannerAd320x50.jsx
'use client';

import { useEffect, useRef, useState } from 'react';

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

    // Prevent duplicate injection — use a module-level unique id per mount
    if (container.dataset.loaded === 'true') return;
    container.dataset.loaded = 'true';

    container.innerHTML = '';

    // 1. Set atOptions BEFORE loading script
    window.atOptions = {
      key: adKey,
      format: 'iframe',
      height,
      width,
      params: {},
    };

    // 2. Load the Adsterra invoke script
    const adScript = document.createElement('script');
    adScript.type = 'text/javascript';
    adScript.src = `https://bauval.org/22/${adKey}`;
    adScript.async = true;

    adScript.onload = () => {
      setLoaded(true);
      // ✅ Give Adsterra a moment to inject iframe, then re-check
      setTimeout(() => {
        const iframe = container.querySelector('iframe');
        if (iframe) {
          console.log('✅ Adsterra iframe rendered:', iframe.src);
        } else {
          console.warn('⚠️ Adsterra script loaded but no iframe (no fill or domain issue)');
        }
      }, 2000);
    };

    adScript.onerror = () => {
      console.warn('[BannerAd] Failed to load ad script:', adKey);
    };

    container.appendChild(adScript);

    // ❌ IMPORTANT: do NOT delete window.atOptions in cleanup.
    // Adsterra's script needs it globally. If you must clean, do it later.
    return () => {
      // Only clear DOM, keep atOptions alive
      if (container) {
        // Don't wipe if ad already rendered
        if (!container.querySelector('iframe')) {
          container.innerHTML = '';
          container.dataset.loaded = 'false';
        }
      }
    };
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