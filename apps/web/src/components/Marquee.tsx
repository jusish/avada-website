import React from 'react';

interface MarqueeProps {
  children: React.ReactNode;
  className?: string;
  animation?: string;
}

/**
 * Seamless horizontal marquee. Content is rendered twice and translated by -50%,
 * so the Tailwind `animate-marquee*` utilities loop without a visible jump.
 */
export const Marquee: React.FC<MarqueeProps> = ({
  children,
  className = '',
  animation = 'animate-marquee',
}) => (
  <div className="overflow-hidden">
    <div className={`flex w-max items-center motion-reduce:animate-none ${animation} ${className}`}>
      <div className="flex items-center shrink-0">{children}</div>
      <div className="flex items-center shrink-0" aria-hidden="true">
        {children}
      </div>
    </div>
  </div>
);
