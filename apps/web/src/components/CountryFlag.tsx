import React from 'react';

/**
 * Kenya National Flag SVG Vector
 */
export const FlagKenya: React.FC<{ className?: string }> = ({ className = 'w-6 h-4' }) => (
  <svg
    viewBox="0 0 60 40"
    className={`inline-block shrink-0 rounded-[2px] shadow-xs border border-black/15 overflow-hidden ${className}`}
    aria-label="Kenya Flag"
  >
    {/* Black Top Stripe */}
    <rect width="60" height="13" fill="#000000" />
    {/* White Fimbriation */}
    <rect y="13" width="60" height="14" fill="#FFFFFF" />
    {/* Red Middle Stripe */}
    <rect y="15" width="60" height="10" fill="#BB0000" />
    {/* Green Bottom Stripe */}
    <rect y="27" width="60" height="13" fill="#006600" />
    {/* Crossed White Spears */}
    <line x1="16" y1="36" x2="44" y2="4" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" />
    <line x1="16" y1="4" x2="44" y2="36" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" />
    {/* Spear Tips */}
    <polygon points="44,4 42,7 46,6" fill="#D1D5DB" />
    <polygon points="16,4 18,7 14,6" fill="#D1D5DB" />
    <polygon points="44,36 42,33 46,34" fill="#D1D5DB" />
    <polygon points="16,36 18,33 14,34" fill="#D1D5DB" />
    {/* Traditional Maasai Shield */}
    <ellipse cx="30" cy="20" rx="6.5" ry="11.5" fill="#BB0000" stroke="#000000" strokeWidth="0.8" />
    {/* Shield White Patterns */}
    <path
      d="M30 8.5 C25 13 25 27 30 31.5 C24 26 24 14 30 8.5 Z"
      fill="#FFFFFF"
    />
    <path
      d="M30 8.5 C35 13 35 27 30 31.5 C36 26 36 14 30 8.5 Z"
      fill="#FFFFFF"
    />
    {/* Central Boss & Charge */}
    <ellipse cx="30" cy="20" rx="1.6" ry="6" fill="#000000" />
    <circle cx="30" cy="20" r="1.2" fill="#FFFFFF" />
  </svg>
);

/**
 * Rwanda National Flag SVG Vector
 */
export const FlagRwanda: React.FC<{ className?: string }> = ({ className = 'w-6 h-4' }) => (
  <svg
    viewBox="0 0 60 40"
    className={`inline-block shrink-0 rounded-[2px] shadow-xs border border-black/15 overflow-hidden ${className}`}
    aria-label="Rwanda Flag"
  >
    {/* Upper Sky Blue Half */}
    <rect width="60" height="20" fill="#00A1DE" />
    {/* Middle Yellow Quarter */}
    <rect y="20" width="60" height="10" fill="#FAD201" />
    {/* Bottom Green Quarter */}
    <rect y="30" width="60" height="10" fill="#20603D" />
    {/* 24-ray Golden Sun in upper fly */}
    <g transform="translate(47, 10)">
      {Array.from({ length: 24 }).map((_, i) => (
        <line
          key={i}
          x1="0"
          y1="0"
          x2={5.8 * Math.cos((i * 15 * Math.PI) / 180)}
          y2={5.8 * Math.sin((i * 15 * Math.PI) / 180)}
          stroke="#EAA812"
          strokeWidth="0.75"
        />
      ))}
      <circle cx="0" cy="0" r="2.8" fill="#EAA812" />
      <circle cx="0" cy="0" r="2" fill="#FAD201" />
    </g>
  </svg>
);

/**
 * Tanzania National Flag SVG Vector
 */
export const FlagTanzania: React.FC<{ className?: string }> = ({ className = 'w-6 h-4' }) => (
  <svg
    viewBox="0 0 60 40"
    className={`inline-block shrink-0 rounded-[2px] shadow-xs border border-black/15 overflow-hidden ${className}`}
    aria-label="Tanzania Flag"
  >
    {/* Upper Green Triangle */}
    <polygon points="0,0 60,0 0,40" fill="#1EB53A" />
    {/* Lower Blue Triangle */}
    <polygon points="60,0 60,40 0,40" fill="#00A3DD" />
    {/* Diagonal Yellow Border Band (Rotated -33.69 deg at center (30,20)) */}
    <rect
      x="-25"
      y="12"
      width="110"
      height="16"
      fill="#FCD116"
      transform="rotate(-33.69 30 20)"
    />
    {/* Diagonal Black Central Band */}
    <rect
      x="-25"
      y="15"
      width="110"
      height="10"
      fill="#000000"
      transform="rotate(-33.69 30 20)"
    />
  </svg>
);

export interface CountryFlagProps {
  country: 'kenya' | 'rwanda' | 'tanzania' | string;
  className?: string;
}

/**
 * Unified CountryFlag Component
 * Renders cross-platform vector SVG flags with perfect crispness on Windows, Mac, Linux, and Mobile.
 */
export const CountryFlag: React.FC<CountryFlagProps> = ({ country, className }) => {
  const c = country.toLowerCase().trim();
  if (c === 'kenya' || c === 'ke') {
    return <FlagKenya className={className} />;
  }
  if (c === 'rwanda' || c === 'rw') {
    return <FlagRwanda className={className} />;
  }
  if (c === 'tanzania' || c === 'tz') {
    return <FlagTanzania className={className} />;
  }
  return null;
};
