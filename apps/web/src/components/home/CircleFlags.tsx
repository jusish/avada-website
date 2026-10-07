import React, { useId } from 'react';

interface Props {
  className?: string;
}

const Circle: React.FC<React.PropsWithChildren<Props & { label: string }>> = ({
  className = 'w-12 h-12 sm:w-14 sm:h-14',
  label,
  children,
}) => {
  const id = useId();
  return (
    <svg
      viewBox="0 0 100 100"
      className={`shrink-0 rounded-full shadow-md ${className}`}
      role="img"
      aria-label={label}
    >
      <defs>
        <clipPath id={id}>
          <circle cx="50" cy="50" r="50" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${id})`}>{children}</g>
    </svg>
  );
};

const star = (cx: number, cy: number, r: number, fill: string) => {
  const pts = Array.from({ length: 10 }, (_, i) => {
    const rad = (i * 36 - 90) * (Math.PI / 180);
    const rr = i % 2 === 0 ? r : r * 0.4;
    return `${cx + rr * Math.cos(rad)},${cy + rr * Math.sin(rad)}`;
  }).join(' ');
  return <polygon points={pts} fill={fill} />;
};

export const CircleKenya: React.FC<Props> = (p) => (
  <Circle {...p} label="Kenya">
    <rect width="100" height="100" fill="#fff" />
    <rect width="100" height="30" fill="#000" />
    <rect y="34" width="100" height="32" fill="#BB0000" />
    <rect y="70" width="100" height="30" fill="#006600" />
    <rect y="30" width="100" height="4" fill="#fff" />
    <rect y="66" width="100" height="4" fill="#fff" />
    <line x1="25" y1="85" x2="75" y2="15" stroke="#fff" strokeWidth="3" />
    <line x1="25" y1="15" x2="75" y2="85" stroke="#fff" strokeWidth="3" />
    <ellipse cx="50" cy="50" rx="14" ry="26" fill="#BB0000" stroke="#000" strokeWidth="2" />
    <ellipse cx="50" cy="50" rx="3" ry="14" fill="#000" />
    <path d="M50 26 C38 38 38 62 50 74 C42 62 42 38 50 26Z M50 26 C62 38 62 62 50 74 C58 62 58 38 50 26Z" fill="#fff" />
  </Circle>
);

export const CircleUganda: React.FC<Props> = (p) => {
  const colors = ['#000', '#FCDC04', '#D90000', '#000', '#FCDC04', '#D90000'];
  return (
    <Circle {...p} label="Uganda">
      {colors.map((c, i) => (
        <rect key={i} y={(100 / 6) * i} width="100" height={100 / 6 + 0.5} fill={c} />
      ))}
      <circle cx="50" cy="50" r="19" fill="#fff" />
      <path d="M42 58 Q46 40 56 42 Q60 46 54 50 Q58 56 50 60Z" fill="#555" />
      <rect x="40" y="60" width="20" height="3" fill="#D90000" />
    </Circle>
  );
};

export const CircleTanzania: React.FC<Props> = (p) => (
  <Circle {...p} label="Tanzania">
    <rect width="100" height="100" fill="#1EB53A" />
    <polygon points="100,0 100,100 0,100" fill="#00A3DD" />
    <line x1="-5" y1="105" x2="105" y2="-5" stroke="#FCD116" strokeWidth="32" />
    <line x1="-5" y1="105" x2="105" y2="-5" stroke="#000" strokeWidth="22" />
  </Circle>
);

export const CircleMali: React.FC<Props> = (p) => (
  <Circle {...p} label="Mali">
    <rect width="34" height="100" fill="#14B53A" />
    <rect x="33" width="34" height="100" fill="#FCD116" />
    <rect x="66" width="34" height="100" fill="#CE1126" />
  </Circle>
);

export const CircleDRC: React.FC<Props> = (p) => (
  <Circle {...p} label="DR Congo">
    <rect width="100" height="100" fill="#4472C4" />
    <line x1="-10" y1="110" x2="110" y2="-10" stroke="#F7D618" strokeWidth="26" />
    <line x1="-10" y1="110" x2="110" y2="-10" stroke="#CE1021" strokeWidth="17" />
    {star(25, 25, 14, '#F7D618')}
  </Circle>
);

export const CircleBurkina: React.FC<Props> = (p) => (
  <Circle {...p} label="Burkina Faso">
    <rect width="100" height="50" fill="#EF2B2D" />
    <rect y="50" width="100" height="50" fill="#009E49" />
    {star(50, 50, 22, '#FCD116')}
  </Circle>
);

export const CircleRwanda: React.FC<Props> = (p) => (
  <Circle {...p} label="Rwanda">
    <rect width="100" height="50" fill="#00A1DE" />
    <rect y="50" width="100" height="25" fill="#FAD201" />
    <rect y="75" width="100" height="25" fill="#20603D" />
    <circle cx="75" cy="25" r="9" fill="#FAD201" />
  </Circle>
);

export const CIRCLE_FLAGS: React.FC<Props>[] = [
  CircleKenya,
  CircleUganda,
  CircleTanzania,
  CircleMali,
  CircleDRC,
  CircleBurkina,
  CircleRwanda,
];
