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

const svgStar = (cx: number, cy: number, r: number, fill: string) => {
  const pts = Array.from({ length: 10 }, (_, i) => {
    const rad = (i * 36 - 90) * (Math.PI / 180);
    const rr = i % 2 === 0 ? r : r * 0.4;
    return `${cx + rr * Math.cos(rad)},${cy + rr * Math.sin(rad)}`;
  }).join(' ');
  return <polygon points={pts} fill={fill} />;
};

const svgSixStar = (cx: number, cy: number, r: number) => {
  const pts = Array.from({ length: 12 }, (_, i) => {
    const rad = (i * 30 - 90) * (Math.PI / 180);
    const rr = i % 2 === 0 ? r : r * 0.55;
    return `${(cx + rr * Math.cos(rad)).toFixed(2)},${(cy + rr * Math.sin(rad)).toFixed(2)}`;
  }).join(' ');
  return <polygon points={pts} fill="#CE1126" stroke="#1EB53A" strokeWidth="0.35" />;
};

/**
 * Democratic Republic of Congo Flag SVG Vector
 */
export const FlagDRC: React.FC<{ className?: string }> = ({ className = 'w-6 h-4' }) => (
  <svg
    viewBox="0 0 60 40"
    className={`inline-block shrink-0 rounded-[2px] shadow-xs border border-black/15 overflow-hidden ${className}`}
    aria-label="DRC Flag"
  >
    <rect width="60" height="40" fill="#007FFF" />
    <line x1="-5" y1="45" x2="65" y2="-5" stroke="#F7D618" strokeWidth="11" />
    <line x1="-5" y1="45" x2="65" y2="-5" stroke="#CE1021" strokeWidth="7" />
    {svgStar(12, 12, 6, '#F7D618')}
  </svg>
);

/**
 * Benin National Flag SVG Vector
 */
export const FlagBenin: React.FC<{ className?: string }> = ({ className = 'w-6 h-4' }) => (
  <svg
    viewBox="0 0 60 40"
    className={`inline-block shrink-0 rounded-[2px] shadow-xs border border-black/15 overflow-hidden ${className}`}
    aria-label="Benin Flag"
  >
    {/* Left vertical green stripe (2/5) */}
    <rect width="24" height="40" fill="#008751" />
    {/* Upper yellow horizontal stripe (3/5) */}
    <rect x="24" width="36" height="20" fill="#FCD116" />
    {/* Lower red horizontal stripe (3/5) */}
    <rect x="24" y="20" width="36" height="20" fill="#E8112D" />
  </svg>
);

/**
 * Togo National Flag SVG Vector
 */
export const FlagTogo: React.FC<{ className?: string }> = ({ className = 'w-6 h-4' }) => (
  <svg
    viewBox="0 0 60 40"
    className={`inline-block shrink-0 rounded-[2px] shadow-xs border border-black/15 overflow-hidden ${className}`}
    aria-label="Togo Flag"
  >
    {/* 5 alternating horizontal stripes */}
    <rect width="60" height="8" fill="#006A4E" />
    <rect y="8" width="60" height="8" fill="#FFCE00" />
    <rect y="16" width="60" height="8" fill="#006A4E" />
    <rect y="24" width="60" height="8" fill="#FFCE00" />
    <rect y="32" width="60" height="8" fill="#006A4E" />
    {/* Red canton square (3 stripes high) */}
    <rect width="24" height="24" fill="#D21034" />
    {/* Five-pointed white star */}
    {svgStar(12, 12, 5.5, '#FFFFFF')}
  </svg>
);

/**
 * United Arab Emirates (UAE) Flag SVG Vector
 */
export const FlagUAE: React.FC<{ className?: string }> = ({ className = 'w-6 h-4' }) => (
  <svg
    viewBox="0 0 60 40"
    className={`inline-block shrink-0 rounded-[2px] shadow-xs border border-black/15 overflow-hidden ${className}`}
    aria-label="UAE Flag"
  >
    {/* Left red vertical stripe */}
    <rect width="15" height="40" fill="#FF0000" />
    {/* Upper green horizontal stripe */}
    <rect x="15" width="45" height="13.33" fill="#00732F" />
    {/* Middle white horizontal stripe */}
    <rect x="15" y="13.33" width="45" height="13.33" fill="#FFFFFF" />
    {/* Lower black horizontal stripe */}
    <rect x="15" y="26.66" width="45" height="13.34" fill="#000000" />
  </svg>
);

/**
 * Burundi National Flag SVG Vector
 */
export const FlagBurundi: React.FC<{ className?: string }> = ({ className = 'w-6 h-4' }) => (
  <svg
    viewBox="0 0 60 40"
    className={`inline-block shrink-0 rounded-[2px] shadow-xs border border-black/15 overflow-hidden ${className}`}
    aria-label="Burundi Flag"
  >
    {/* Base Green Quadrants */}
    <rect width="60" height="40" fill="#1EB53A" />
    {/* Red Top and Bottom Triangles */}
    <polygon points="0,0 60,0 30,20" fill="#CE1126" />
    <polygon points="0,40 60,40 30,20" fill="#CE1126" />
    {/* White Saltire Bands */}
    <line x1="0" y1="0" x2="60" y2="40" stroke="#FFFFFF" strokeWidth="5.5" />
    <line x1="0" y1="40" x2="60" y2="0" stroke="#FFFFFF" strokeWidth="5.5" />
    {/* Central White Disk */}
    <circle cx="30" cy="20" r="8.5" fill="#FFFFFF" />
    {/* Three 6-pointed red stars outlined in green */}
    {svgSixStar(30, 16.2, 1.8)}
    {svgSixStar(26.6, 22.2, 1.8)}
    {svgSixStar(33.4, 22.2, 1.8)}
  </svg>
);

export interface CountryFlagProps {
  country: 'kenya' | 'rwanda' | 'tanzania' | 'drc' | 'benin' | 'burundi' | 'togo' | 'uae' | string;
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
  if (c === 'drc' || c === 'cd' || c === 'congo' || c.includes('dr c') || c.includes('d.r')) {
    return <FlagDRC className={className} />;
  }
  if (c === 'benin' || c === 'bj') {
    return <FlagBenin className={className} />;
  }
  if (c === 'burundi' || c === 'bi' || c === 'bu') {
    return <FlagBurundi className={className} />;
  }
  if (c === 'togo' || c === 'tg') {
    return <FlagTogo className={className} />;
  }
  if (c === 'uae' || c === 'ae' || c === 'dubai' || c.includes('emirates')) {
    return <FlagUAE className={className} />;
  }
  return null;
};
