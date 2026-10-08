import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useSiteConfig } from '@/context/SiteConfigContext';

const Facebook = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor" aria-hidden="true">
    <path d="M14 8.5V6.9c0-.7.5-.9.9-.9H17V3h-2.6C11.6 3 11 5.100 11 6.600V8.500H9v3h2V21h3v-9.500h2.500l.5-3z" />
  </svg>
);

const LinkedIn = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor" aria-hidden="true">
    <path d="M6.940 20H3.560V9.500h3.380zM5.250 8.100a2 2 0 1 1 0-4 2 2 0 0 1 0 4zM20.500 20h-3.370v-5.100c0-1.200 0-2.800-1.700-2.800s-2 1.300-2 2.700V20H10.100V9.500h3.200V11h.05c.45-.85 1.550-1.750 3.200-1.750 3.400 0 4 2.250 4 5.150z" />
  </svg>
);

const XIcon = () => (
  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="currentColor" aria-hidden="true">
    <path d="M18.200 2.500h3.300l-7.200 8.300 8.500 11.200h-6.700l-5.200-6.800-6 6.800H1.600l7.700-8.800L1.200 2.500H8l4.700 6.200zm-1.200 17.500h1.800L7 4.400H5.100z" />
  </svg>
);

const Instagram = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor" aria-hidden="true">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
);

const YouTube = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor" aria-hidden="true">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

const GitHub = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor" aria-hidden="true">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

const SOCIAL_ICONS: Record<string, React.FC> = {
  facebook: Facebook,
  linkedin: LinkedIn,
  x: XIcon,
  instagram: Instagram,
  youtube: YouTube,
  github: GitHub,
};

interface FooterCta {
  title: string[];
  body: string;
  primary: { label: string; to: string };
  secondary?: { label: string; to: string };
}

const DEFAULT_CTA: FooterCta = {
  title: ['Ready to simplify payments', 'and SMS across Africa?'],
  body: 'Tell us where your business operates and what you need to collect, send or automate. Our team will help you identify the right AvadaPay setup.',
  primary: { label: 'Talk to Sales', to: '/contact' },
  secondary: { label: 'Read the API docs', to: '/contact?inquiry=api' },
};

const FOOTER_CTAS: Record<string, FooterCta | null> = {
  '/': DEFAULT_CTA,
  '/payment-processing': {
    title: ['Tell us where you want to', 'accept payments'],
    body: 'Share your target markets, expected volumes, and the methods your customers use. We’ll come back with pricing and a setup plan.',
    primary: { label: 'Talk to Sales', to: '/contact?inquiry=payments' },
    secondary: { label: 'Read the API docs', to: '/contact?inquiry=api' },
  },
  '/pos': {
    title: ['Get Started with AvadaPay POS'],
    body: 'Tell us about your business, the markets you operate in, and your payment volumes. We’ll recommend the right POS solution.',
    primary: { label: 'Contact Us', to: '/contact?inquiry=pos' },
    secondary: { label: 'Request a POS demo', to: '/contact?inquiry=pos_demo' },
  },
  '/bulk-sms': {
    title: ['Get Started with', 'AvadaPay Bulk SMS'],
    body: 'Share your country, expected monthly volume, and primary use case. We’ll come back with routing, rates, and a setup plan.',
    primary: { label: 'Contact Us', to: '/contact?inquiry=sms' },
    secondary: { label: 'Read the SMS API docs', to: '/contact?inquiry=api' },
  },
  '/contact': null,
  '/terms': null,
  '/privacy': null,
  '/cookies': null,
};

export const Footer: React.FC = () => {
  const { pathname } = useLocation();
  const { contacts, socials, footer } = useSiteConfig();

  const cta = pathname in FOOTER_CTAS ? FOOTER_CTAS[pathname] : DEFAULT_CTA;

  // Render social links that are enabled and have a valid URL
  const visibleSocials = (socials || []).filter(
    (s) => s.enabled && typeof s.url === 'string' && s.url.trim().length > 0 && s.url !== '#'
  );

  return (
    <footer className="bg-[#2A292D] text-white">
      {/* Call to Action Banner */}
      {cta && (
        <div className="max-w-4xl mx-auto px-6 pt-16 sm:pt-20 text-center">
          <h2 className="text-[#3BBA93] font-extrabold tracking-tight leading-[1.15] text-3xl sm:text-4xl md:text-[44px]">
            {cta.title.map((line, i) => (
              <React.Fragment key={line}>
                {i > 0 && <br />}
                {line}
              </React.Fragment>
            ))}
          </h2>
          <p className="mt-6 mx-auto max-w-[44rem] text-base sm:text-[17px] font-medium leading-snug text-white">
            {cta.body}
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link to={cta.primary.to}>
              <Button className="h-11 px-6 rounded-md bg-[#3BBA93] hover:bg-[#32a481] text-white font-bold text-[15px]">
                {cta.primary.label}
              </Button>
            </Link>
            {cta.secondary && (
              <Link to={cta.secondary.to}>
                <Button
                  variant="outline"
                  className="h-11 px-6 rounded-md bg-transparent border-[#3BBA93]/70 text-[#3BBA93] hover:bg-[#3BBA93]/10 hover:text-[#3BBA93] font-bold text-[15px]"
                >
                  {cta.secondary.label}
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Link Columns */}
      <div
        className={`max-w-[56rem] mx-auto px-6 grid grid-cols-1 sm:grid-cols-[1fr_1.3fr_1fr] gap-10 sm:gap-8 ${
          cta ? 'mt-14 sm:mt-16' : 'pt-16 sm:pt-20'
        }`}
      >
        <div>
          <h3 className="text-[#3BBA93] text-lg font-extrabold">Useful links</h3>
          <ul className="mt-4 space-y-3.5 text-sm font-medium">
            <li><Link to="/payment-processing" className="hover:text-[#3BBA93] transition-colors">Payment Processing</Link></li>
            <li><Link to="/pos" className="hover:text-[#3BBA93] transition-colors">POS</Link></li>
            <li><Link to="/bulk-sms" className="hover:text-[#3BBA93] transition-colors">Bulk SMS</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-[#3BBA93] text-lg font-extrabold">Contact Us</h3>
          <div className="mt-4 text-sm font-medium leading-snug space-y-5">
            <p>
              <a href={`mailto:${contacts.supportEmail}`} className="hover:text-[#3BBA93] transition-colors">
                {contacts.supportEmail}
              </a>
              <br />
              <a href={`tel:${contacts.supportPhone.replace(/\s+/g, '')}`} className="hover:text-[#3BBA93] transition-colors">
                {contacts.supportPhone}
              </a>
            </p>
            <p className="whitespace-pre-line text-white/80">
              {contacts.officeAddress}
            </p>
          </div>
        </div>

        <div>
          <h3 className="text-[#3BBA93] text-lg font-extrabold">Legal & Compliance</h3>
          <ul className="mt-4 space-y-3.5 text-sm font-medium">
            <li>
              <Link to="/privacy" className="hover:text-[#3BBA93] transition-colors">
                Privacy policy
              </Link>
            </li>
            <li>
              <Link to="/terms" className="hover:text-[#3BBA93] transition-colors">
                Terms of service
              </Link>
            </li>
            <li>
              <Link to="/cookies" className="hover:text-[#3BBA93] transition-colors">
                Cookie policy
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-[62rem] mx-auto px-6 mt-10">
        <div className="border-t border-[#3BBA93]/50" />
        <div className="py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <p className="text-xs text-[#3BBA93] leading-relaxed max-w-md">
            {footer.disclaimerText}
          </p>
          <div className="flex items-center gap-4">
            <Link
              to="/admin/login"
              className="text-[11px] font-semibold text-white/40 hover:text-[#3BBA93] transition-colors mr-2"
            >
              CMS Portal
            </Link>

            {/* Configurable Social Icons */}
            {visibleSocials.map((social) => {
              const Icon = SOCIAL_ICONS[social.key] || Facebook;
              const target = social.target || '_blank';
              const rel = target === '_blank' ? 'noopener noreferrer' : undefined;

              return (
                <a
                  key={social.key}
                  href={social.url!}
                  target={target}
                  rel={rel}
                  aria-label={social.name}
                  title={`${social.name} (Opens in ${target === '_blank' ? 'new tab' : 'current window'})`}
                  className="inline-flex items-center justify-center w-7 h-7 rounded-[5px] bg-[#3BBA93] text-[#2A292D] transition-transform hover:scale-110 shadow-sm"
                >
                  <Icon />
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
};
