import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Facebook = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor" aria-hidden="true">
    <path d="M14 8.5V6.9c0-.7.5-.9.9-.9H17V3h-2.6C11.6 3 11 5.100 11 6.600V8.500H9v3h2V21h3v-9.500h2.500l.5-3z" />
  </svg>
);
const LinkedIn = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor" aria-hidden="true">
    <path d="M6.940 20H3.560V9.500h3.380zM5.250 8.100a2 2 0 1 1 0-4 2 2 0 0 1 0 4zM20.500 20h-3.370v-5.100c0-1.200 0-2.800-1.700-2.800s-2 1.300-2 2.700V20H10.100V9.500h3.200V11h.05c.45-.85 1.550-1.750 3.200-1.750 3.400 0 4 2.250 4 5.150z" />
  </svg>
);
const XIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor" aria-hidden="true">
    <path d="M18.200 2.500h3.300l-7.200 8.300 8.500 11.200h-6.700l-5.200-6.800-6 6.800H1.600l7.700-8.800L1.200 2.500H8l4.700 6.200zm-1.200 17.500h1.800L7 4.400H5.100z" />
  </svg>
);

const socials = [
  { label: 'Facebook', href: '#', Icon: Facebook },
  { label: 'LinkedIn', href: '#', Icon: LinkedIn },
  { label: 'X', href: '#', Icon: XIcon },
];

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
  secondary: { label: 'Read the API docs', to: '/contact?inquiry=technical' },
};

/** Footer call-to-action per route. `null` hides the CTA band entirely. */
const FOOTER_CTAS: Record<string, FooterCta | null> = {
  '/': DEFAULT_CTA,
  '/payment-processing': {
    title: ['Tell us where you want to', 'accept payments'],
    body: 'Share your target markets, expected volumes, and the methods your customers use. We’ll come back with pricing and a setup plan.',
    primary: { label: 'Talk to Sales', to: '/contact?inquiry=payments' },
    secondary: { label: 'Read the API docs', to: '/contact?inquiry=technical' },
  },
  '/pos': {
    title: ['Get Started with AvadaPay POS'],
    body: 'Tell us about your business, the markets you operate in, and your payment volumes. We’ll recommend the right POS solution.',
    primary: { label: 'Contact Us', to: '/contact?inquiry=pos' },
    secondary: { label: 'Request a POS demo', to: '/contact?inquiry=pos' },
  },
  '/bulk-sms': {
    title: ['Get Started with', 'AvadaPay Bulk SMS'],
    body: 'Share your country, expected monthly volume, and primary use case. We’ll come back with routing, rates, and a setup plan.',
    primary: { label: 'Contact Us', to: '/contact?inquiry=sms' },
    secondary: { label: 'Read the SMS API docs', to: '/contact?inquiry=technical' },
  },
  '/contact': null,
  '/countries/kenya': {
    title: ['Receive payments. Send SMS.', 'Track everything.'],
    body: 'Tell us how your business operates in Kenya and what you need. Our Nairobi team will get back to you within one business day.',
    primary: { label: 'Contact Us', to: '/contact?country=Kenya' },
    secondary: { label: 'Read the SMS API docs', to: '/contact?country=Kenya&inquiry=technical' },
  },
  '/countries/rwanda': {
    title: ['Get Started with', 'AvadaPay Rwanda'],
    body: 'Share where your business operates, the volumes you process, and the channels your customers use. Our Kigali team will respond within one business day.',
    primary: { label: 'Contact Us', to: '/contact?country=Rwanda' },
    secondary: { label: 'Read the SMS API docs', to: '/contact?country=Rwanda&inquiry=technical' },
  },
  '/countries/tanzania': {
    title: ['Simplify payments across', 'Tanzania.'],
    body: 'Your customers already use mobile money. Connect to how they actually pay. Our Dar es Salaam team will get back to you within one business day.',
    primary: { label: 'Talk to Sales', to: '/contact?country=Tanzania' },
  },
};

export const Footer: React.FC = () => {
  const { pathname } = useLocation();
  const cta = pathname in FOOTER_CTAS ? FOOTER_CTAS[pathname] : DEFAULT_CTA;

  return (
    <footer className="bg-[#2A292D] text-white">
      {/* CTA */}
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

      {/* Link columns */}
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
              <a href="mailto:info@avadapay.com" className="hover:text-[#3BBA93] transition-colors">info@avadapay.com</a>
              <br />
              <a href="tel:+260968332766" className="hover:text-[#3BBA93] transition-colors">+260 968 332 766</a>
            </p>
            <p>
              25th floor, SORP Business Centre
              <br />
              Tameem House, Barsha Heights,
              <br />
              Dubai (UAE)
            </p>
          </div>
        </div>

        <div>
          <h3 className="text-[#3BBA93] text-lg font-extrabold">©avadapay{new Date().getFullYear()}</h3>
          <ul className="mt-4 space-y-3.5 text-sm font-medium">
            <li><a href="#privacy" className="hover:text-[#3BBA93] transition-colors">Privacy policy</a></li>
            <li><a href="#terms" className="hover:text-[#3BBA93] transition-colors">Terms of service</a></li>
            <li><a href="#cookies" className="hover:text-[#3BBA93] transition-colors">Cookie policy</a></li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="max-w-[62rem] mx-auto px-6 mt-10">
        <div className="border-t border-[#3BBA93]/50" />
        <div className="py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <p className="text-xs text-[#3BBA93] leading-relaxed max-w-md">
            AvadaPay is a pan-African payment gateway and SMS aggregator.
            <br />
            Accept mobile money and card payments, run POS, send bulk payouts.
          </p>
          <div className="flex items-center gap-4">
            <Link
              to="/admin/login"
              className="text-[11px] font-semibold text-white/40 hover:text-[#3BBA93] transition-colors mr-4"
            >
              CMS Portal
            </Link>
            {socials.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="inline-flex items-center justify-center w-6 h-6 rounded-[4px] bg-[#3BBA93] text-[#2A292D] transition-transform hover:scale-110"
              >
                <Icon />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};
