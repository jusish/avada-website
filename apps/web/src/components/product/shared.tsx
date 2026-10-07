import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

/* ------------------------------------------------------------------ */
/* Typography helpers                                                  */
/* ------------------------------------------------------------------ */

/** Green (brand) span used inside two-tone headings. */
export const G: React.FC<React.PropsWithChildren> = ({ children }) => (
  <span className="text-[#3BBA93]">{children}</span>
);

/** Centered two-tone section heading. Use <G> for green words and <br /> for line breaks. */
export const SectionTitle: React.FC<
  React.PropsWithChildren<{ className?: string; as?: 'h2' | 'h3' }>
> = ({ children, className = '', as: Tag = 'h2' }) => (
  <Tag
    className={`text-center font-extrabold tracking-tight leading-[1.15] text-[#2A292D] text-3xl sm:text-4xl md:text-[44px] ${className}`}
  >
    {children}
  </Tag>
);

/* ------------------------------------------------------------------ */
/* Hero                                                                */
/* ------------------------------------------------------------------ */

interface HeroAction {
  label: string;
  to: string;
  variant: 'outline' | 'solid';
}

interface ProductHeroProps {
  title: React.ReactNode;
  description: string;
  actions: HeroAction[];
  /** Optional media (image/video) rendered inside the framed panel on the right. */
  media?: React.ReactNode;
  children?: React.ReactNode;
}

export const ProductHero: React.FC<ProductHeroProps> = ({
  title,
  description,
  actions,
  media,
  children,
}) => (
  <section className="bg-[#2A292D] text-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 pb-16 sm:pb-24 grid lg:grid-cols-[1.3fr_1fr] gap-10 lg:gap-14 items-center">
      <div className="lg:pl-8">
        <h1 className="font-extrabold tracking-tight leading-[1.1] text-[clamp(2.25rem,5vw,4.1rem)]">
          {title}
        </h1>
        <p className="mt-8 max-w-[34rem] text-base sm:text-lg font-semibold leading-[1.5] text-white">
          {description}
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          {actions.map((a) => (
            <Link key={a.label} to={a.to}>
              <Button
                className={
                  a.variant === 'solid'
                    ? 'h-[3.1rem] px-6 rounded-md bg-[#3BBA93] hover:bg-[#32a481] text-white text-base font-bold shadow-none'
                    : 'h-[3.1rem] px-6 rounded-md bg-transparent border border-[#3BBA93] text-[#3BBA93] hover:bg-[#3BBA93]/10 text-base font-bold shadow-none'
                }
              >
                {a.label}
              </Button>
            </Link>
          ))}
        </div>
      </div>

      {/* Framed media panel (left empty by design until artwork is supplied) */}
      <div
        className="hidden lg:block aspect-[0.92/1] w-full max-w-[26rem] justify-self-end overflow-hidden rounded-3xl border border-[#3BBA93]/50"
        aria-hidden={media ? undefined : true}
      >
        {media}
      </div>
    </div>
    {children}
  </section>
);

/* ------------------------------------------------------------------ */
/* Accordion                                                           */
/* ------------------------------------------------------------------ */

export interface AccordionEntry {
  title: string;
  body: string;
}

export const AccordionList: React.FC<{
  items: AccordionEntry[];
  className?: string;
}> = ({ items, className = '' }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  return (
    <div className={`mx-auto max-w-[54rem] space-y-5 ${className}`}>
      {items.map((item, i) => {
        const open = openIndex === i;
        return (
          <div
            key={item.title}
            className="rounded-2xl border border-[#3BBA93]/45 bg-white shadow-[0_6px_14px_rgba(0,0,0,0.04)] transition-colors hover:border-[#3BBA93]"
          >
            <button
              type="button"
              aria-expanded={open}
              onClick={() => setOpenIndex(open ? null : i)}
              className="w-full h-[4.75rem] px-8 flex items-center justify-between text-left text-lg font-extrabold text-[#2A292D] rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3BBA93]"
            >
              <span>{item.title}</span>
              <ChevronUp
                className={`w-5 h-5 shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
              />
            </button>
            <div
              className={`grid transition-all duration-300 ease-in-out ${
                open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
              }`}
            >
              <div className="overflow-hidden">
                <p className="px-8 pb-6 text-base leading-relaxed font-medium text-[#2A292D]/80">
                  {item.body}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
