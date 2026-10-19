import React, { useState } from 'react';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  webpSrc?: string;
  priority?: boolean;
  className?: string;
  containerClassName?: string;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  webpSrc,
  priority = false,
  className = '',
  containerClassName = '',
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);

  // Derive WebP source if not explicitly provided and file ends in .jpg/.png
  const resolvedWebpSrc = webpSrc || (src.match(/\.(jpg|jpeg|png)$/i) ? src.replace(/\.(jpg|jpeg|png)$/i, '.webp') : undefined);

  return (
    <div className={`relative overflow-hidden ${containerClassName}`}>
      <picture>
        {resolvedWebpSrc && (
          <source srcSet={resolvedWebpSrc} type="image/webp" />
        )}
        <img
          src={src}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          {...(priority ? { fetchpriority: 'high' } as Record<string, string> : {})}
          onLoad={() => setIsLoaded(true)}
          className={`transition-all duration-500 ease-out ${
            isLoaded ? 'opacity-100 blur-0 scale-100' : 'opacity-0 blur-sm scale-[1.02]'
          } ${className}`}
          {...props}
        />
      </picture>
    </div>
  );
};
