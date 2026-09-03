// components/OptimizedImage.jsx
import Image from 'next/image';

export default function OptimizedImage({ src, alt, width, height, className, priority = false }) {
  return (
    <Image
      src={src}
      alt={alt}
      width={width || 800}
      height={height || 600}
      className={className}
      priority={priority}
      loading={priority ? 'eager' : 'lazy'}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      quality={75}
    />
  );
}
