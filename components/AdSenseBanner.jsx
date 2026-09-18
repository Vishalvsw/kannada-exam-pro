'use client';

import GptAd from './GptAd';

export default function AdSenseBanner({
  className = '',
  style = {},
}) {
  return (
    <GptAd
      className={className}
      style={style}
    />
  );
}
