'use client';

import { useEffect, useRef, useState } from 'react';

let adCounter = 0;

export default function GptAd({
  adUnit = process.env.NEXT_PUBLIC_GPT_UNIT || '/23369396230/MCQ_ad',
  sizes = [[320, 100], [320, 50]],
  className = '',
  style = {},
  fallback = null,   // ← NEW: JSX to render if GPT doesn't fill
}) {
  const containerRef = useRef(null);
  const slotRef = useRef(null);
  const idRef = useRef(`div-gpt-ad-${Date.now()}-${++adCounter}`);
  const [isEmpty, setIsEmpty] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const setupAd = () => {
      if (cancelled || !containerRef.current) return;

      window.googletag = window.googletag || { cmd: [] };
      window.googletag.cmd = window.googletag.cmd || [];

      window.googletag.cmd.push(() => {
        if (cancelled || !containerRef.current) return;

        try {
          const pubads = window.googletag.pubads();

          const existing = pubads
            .getSlots()
            .find((slot) => slot.getSlotElementId() === idRef.current);

          if (existing) {
            slotRef.current = existing;
            window.googletag.display(idRef.current);
            return;
          }

          const slot = window.googletag
            .defineSlot(adUnit, sizes, idRef.current)
            ?.addService(pubads);

          if (!slot) {
            console.error('Google Ad Manager: defineSlot returned null');
            setIsEmpty(true);
            return;
          }

          slotRef.current = slot;

          // ✅ Listen for the render result
          pubads.addEventListener('slotRenderEnded', (e) => {
            if (e.slot.getSlotElementId() === idRef.current) {
              if (e.isEmpty) {
                console.warn(`⚠️ GPT slot ${idRef.current} returned empty`);
                setIsEmpty(true);
              } else {
                console.log(`✅ GPT slot ${idRef.current} filled`);
                setIsEmpty(false);
              }
            }
          });

          window.googletag.display(idRef.current);
        } catch (error) {
          console.error('Google Ad Manager error:', error);
          setIsEmpty(true);
        }
      });
    };

    window.googletag = window.googletag || { cmd: [] };
    window.googletag.cmd.push(setupAd);

    return () => {
      cancelled = true;
      if (slotRef.current && window.googletag) {
        window.googletag.cmd.push(() => {
          try {
            window.googletag.destroySlots([slotRef.current]);
          } catch (error) {
            console.warn('GPT cleanup warning:', error);
          }
        });
      }
      slotRef.current = null;
    };
  }, [adUnit, JSON.stringify(sizes)]);

  return (
    <div
      ref={containerRef}
      className={`ad-banner ${className}`}
      style={{
        width: '100%',
        maxWidth: '320px',
        minHeight: '50px',
        margin: '0 auto',
        overflow: 'hidden',
        ...style,
      }}
    >
      {/* GPT renders into this div */}
      <div
        id={idRef.current}
        style={{
          width: '100%',
          minHeight: '50px',
          margin: '0 auto',
        }}
      />

      {/* Fallback if GPT returned empty */}
      {isEmpty && fallback && (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 4 }}>
          {fallback}
        </div>
      )}
    </div>
  );
}