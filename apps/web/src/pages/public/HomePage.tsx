import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  ArrowRight,
  ChevronUp,
  ExternalLink,
  CheckCircle2,
  Zap,
  Smartphone,
  ShieldCheck,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { CIRCLE_FLAGS } from '@/components/home/CircleFlags';
import { ROW_ONE, ROW_TWO } from '@/components/home/PartnerLogos';
import { Marquee } from '@/components/Marquee';
import { FadeIn, StaggerContainer, StaggerItem, HoverScale, easeOutQuint } from '@/components/motion/Motion';
import { SEO } from '@/components/seo/SEO';
import { Button } from '@/components/ui/button';

const GREEN = '#3BBA93';

/* ---------- Typography & Icon Helpers ---------- */

const PaperPlane: React.FC<{ className?: string }> = ({ className = 'w-9 sm:w-12 h-auto' }) => (
  <svg viewBox="0 0 130 100" className={className} aria-hidden="true">
    <polygon points="0,45 128,0 72,98 58,60" fill={GREEN} />
    <polygon points="58,60 128,0 66,76" fill="#2C9B78" />
    <polygon points="58,60 72,98 66,76" fill="#9BDEC9" />
  </svg>
);

const CloudPlatformIcon: React.FC<{ className?: string }> = ({ className = 'w-9 sm:w-12 h-auto' }) => (
  <svg viewBox="0 0 68 46" className={className} aria-hidden="true">
    <path
      d="M18 42 C9.2 42 2 34.8 2 26 C2 18 8 11.2 15.8 10.2 C19.6 4 26.4 0 34 0 C44.5 0 53.4 7.2 55.6 17.2 C57 16.5 58.5 16 60 16 C64.4 16 68 19.6 68 24 C68 27.6 65.5 30.7 62 31.6 C61.9 37.5 57 42 51 42 Z"
      fill={GREEN}
    />
    <rect x="20" y="21.5" width="28" height="3.8" rx="1.9" fill="#248767" />
    <rect x="20" y="29.5" width="18" height="3.8" rx="1.9" fill="#248767" />
  </svg>
);

const ChatBubbleIcon: React.FC<{ className?: string }> = ({ className = 'w-9 sm:w-12 h-auto' }) => (
  <svg viewBox="0 0 60 48" className={className} aria-hidden="true">
    <rect x="0" y="0" width="60" height="40" rx="9" fill={GREEN} />
    <polygon points="8,38 8,48 18,38" fill={GREEN} />
    <circle cx="18" cy="20" r="3.2" fill="#248767" />
    <circle cx="30" cy="20" r="3.2" fill="#248767" />
    <circle cx="42" cy="20" r="3.2" fill="#248767" />
  </svg>
);

const UNDER_HERO_ITEMS = [
  { Icon: CloudPlatformIcon, text: 'One platform.' },
  { Icon: PaperPlane, text: 'Payments and' },
  { Icon: ChatBubbleIcon, text: 'SMS across Africa.' },
];

const INTRO_CAPABILITIES = [
  {
    id: 'zero-stitching',
    icon: Zap,
    title: 'Zero Stitching',
    subtitle: 'One contract & API instead of 5+ per country',
    tag: 'Single API Gateway',
    description:
      'Eliminate the complexity of negotiating separate telco agreements, maintaining fragmented SDKs, and managing disjointed escrow balances across multiple countries.',
    badge: '1 Contract • 17+ Hubs',
    points: [
      'Single commercial agreement covers all operating African corridors',
      'One unified REST API & signed webhook standard for every payment method',
      'Unified treasury and automated reconciliation against your internal order IDs',
    ],
    metric: { value: '1 Unified API', label: 'Replaces 17+ fragmented gateways' },
  },
  {
    id: 'omni-channel',
    icon: Smartphone,
    title: 'Omni-Channel Flow',
    subtitle: 'Collections, payouts, POS, and SMS synchronized',
    tag: 'Synchronized Ledger',
    description:
      'Accept customer mobile money and cards, disburse bulk payouts to agents, swipe Smart POS terminals in-store, and send transaction SMS through one central ledger.',
    badge: 'Real-time Orchestration',
    points: [
      'Direct mobile money rails across all regional carriers + global card schemes',
      'Instant automated bulk disbursements to mobile wallets and bank accounts',
      'Android Smart POS terminals connected live to your merchant analytics',
    ],
    metric: { value: '4-in-1', label: 'Payments, Payouts, POS & SMS' },
  },
  {
    id: 'local-settlement',
    icon: ShieldCheck,
    title: 'Local Settlement',
    subtitle: 'Direct multi-currency payouts in local fiat currency',
    tag: 'Local Clearing',
    description:
      'Settle locally in your preferred local fiat or international currencies next-day directly to your bank account with complete transparency and zero hidden cross-border FX markups.',
    badge: '99.9% Uptime SLA',
    points: [
      'Next-day automated bank clearing directly into your registered commercial account',
      'Real-time multi-currency exchange rates and transparent ledger balances',
      'Enterprise-grade financial audit trails and automated exportable reports',
    ],
    metric: { value: '99.9% SLA', label: 'Settlement reliability guaranteed' },
  },
];

const TwoToneHeading: React.FC<{ green: string; dark: string; className?: string }> = ({
  green,
  dark,
  className = '',
}) => (
  <h2
    className={`text-center font-extrabold tracking-tight leading-[1.18] text-2xl sm:text-3xl md:text-4xl text-[#2A292D] ${className}`}
  >
    <span className="text-[#3BBA93]">{green}</span>
    <br />
    <span className="text-[#2A292D]">{dark}</span>
  </h2>
);

/* ---------- Data ---------- */

const WAYS = [
  {
    n: 1,
    title: 'Payment Processing',
    body: 'Accept mobile money and card payments from customers across 17+ African markets through a single API.',
    link: '/payment-processing',
  },
  {
    n: 2,
    title: 'POS Solutions',
    body: 'Accept payments in-store, on the move, or in the field, through SoftPOS on any Android phone or a dedicated POS terminal.',
    link: '/pos',
  },
  {
    n: 3,
    title: 'Bulk SMS',
    body: 'Send OTPs, transaction alerts, reminders, and marketing campaigns across every major African network from one dashboard.',
    link: '/bulk-sms',
  },
  {
    n: 4,
    title: 'Bulk Payouts',
    body: 'Pay agents, suppliers, employees, merchants and customers in batches, with status tracking and reconciliation built in.',
    link: '/payment-processing',
  },
];

const WHY = [
  { title: ['One API,', '17+ markets'], to: '/payment-processing', action: 'See coverage & rails' },
  { title: ['99.9% uptime', 'reliability'], to: '/payment-processing', action: 'See reliability & SLA' },
  { title: ['Mobile money', 'first design'], to: '/payment-processing', action: 'See mobile money rails' },
  { title: ['Payouts you', 'can rely on'], to: '/payment-processing', action: 'See payout options' },
];

const INDUSTRIES = [
  {
    title: 'One API, 17+ markets',
    body: 'A single integration gives you mobile money, card and bank rails across every market we operate in, with one contract, one dashboard and one reconciliation file.',
  },
  {
    title: 'Retail & supermarkets',
    body: 'Accept cards and mobile money at the till with SoftPOS or dedicated terminals, and settle to your account next day.',
  },
  {
    title: 'Microfinance, SACCOs & lenders',
    body: 'Disburse loans and collect repayments directly through mobile wallets, with SMS reminders tied to every transaction.',
  },
  {
    title: 'Hospitality, travel & ticketing',
    body: 'Take online and in-person payments from local and international guests, and confirm bookings instantly by SMS.',
  },
  {
    title: 'Schools & institutions',
    body: 'Collect fees through M-Pesa, MoMo and Airtel Money with automatic receipts and parent notifications.',
  },
  {
    title: 'Gaming & betting',
    body: 'Fast deposits and instant payouts to mobile wallets, built to handle peak-time volumes.',
  },
];

interface OfficeItem {
  country: string;
  address: string;
  to: string;
  disabled?: boolean;
}

const OFFICES: OfficeItem[] = [
  { country: 'Kenya', address: '8th Floor Westpark Towers, Westlands, Nairobi', to: '/kenya' },
  { country: 'Tanzania', address: 'Dar es Salaam, Tanzania', to: '/tanzania' },
  { country: 'Rwanda', address: 'BHC Building, KG 7 Ave Kacyiru, Gasabo, Kigali, Rwanda', to: '/rwanda' },
  { country: 'DRC', address: 'SILIKIN VILLAGE, Local A012, Bâtiment Phase 3', to: 'https://avadapay.cd' },
  { country: 'Benin', address: 'Cotonou, Littoral, Benin', to: '/benin', disabled: true },
  { country: 'Burundi', address: 'Bujumbura, Burundi', to: '/burundi', disabled: true },
];

export const HomePage: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [activeCapability, setActiveCapability] = useState(0);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // 1. If explicit query parameter tells us to stay on global, persist and don't redirect
    if (searchParams.get('ref') === 'global' || searchParams.get('stay') === 'true') {
      localStorage.setItem('avada_country_preference', 'global');
      return;
    }

    // 2. Check stored preference
    const storedPref = localStorage.getItem('avada_country_preference');
    if (storedPref === 'global') {
      return;
    }
    if (storedPref && ['kenya', 'tanzania', 'rwanda', 'drc'].includes(storedPref.toLowerCase())) {
      navigate(`/${storedPref.toLowerCase()}`);
      return;
    }

    // 3. Skip bots / SEO crawlers
    if (typeof navigator !== 'undefined' && /bot|googlebot|crawler|spider|robot|crawling/i.test(navigator.userAgent)) {
      return;
    }

    // 4. Auto-detect visitor location
    const detect = async () => {
      try {
        const res = await fetch('/api/public/detect-country');
        const json = await res.json();
        if (json.success && json.data && json.data.slug) {
          if (json.data.slug === 'drc') {
            window.location.href = json.data.externalUrl || 'https://avadapay.cd';
            return;
          }
          navigate(`/${json.data.slug}?detected=1`);
        }
      } catch {
        // Silently stay on global if detection fails
      }
    };

    detect();
  }, [navigate, searchParams]);

  return (
    <div className="flex flex-col bg-white text-[#2A292D] font-sans overflow-x-hidden">
      <SEO
        title="Avadapay | Global Financial Infrastructure & Technology"
        description="Next-generation financial infrastructure, seamless payments, and global payout systems built for modern African enterprises and global businesses."
        canonical="/"
        keywords="Avadapay, payment gateway Africa, POS terminals Rwanda Kenya Tanzania, bulk SMS Africa, payment processing East Africa, mobile money integration"
      />
      {/* 1 — HERO SECTION */}
      <section className="relative isolate flex flex-col min-h-[75vh] md:min-h-[82vh] text-white overflow-hidden">
        {/* Softly blurred background image with balanced ambient dark overlay */}
        <div className="absolute inset-0 z-0 overflow-hidden bg-[#0B132B]">
          <picture>
            <source srcSet="/hero-bg.webp" type="image/webp" />
            <img
              src="/hero-bg.jpg"
              alt="AvadaPay Hero Background"
              loading="eager"
              decoding="async"
              {...({ fetchpriority: 'high' } as Record<string, string>)}
              className="w-full h-full object-cover object-center scale-105 filter blur-[3.5px] transition-opacity duration-300"
            />
          </picture>
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/75" />
        </div>

        <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-4 pt-28 sm:pt-36 pb-12 max-w-5xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: easeOutQuint }}
            className="font-extrabold tracking-tight leading-[1.12] text-3xl sm:text-5xl lg:text-[56px] max-w-4xl text-white"
          >
            Payments and customer<br className="hidden sm:inline" /> communication,{' '}
            <span className="text-[#3BBA93]">built for<br className="hidden sm:inline" /> African markets.</span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.2, ease: easeOutQuint }}
            className="mt-8 sm:mt-10 flex flex-wrap items-center justify-center gap-6 sm:gap-12 text-sm sm:text-base font-semibold text-white/95"
          >
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-[#3BBA93]" />
              <span>99.9% uptime</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-[#3BBA93]" />
              <span>17+ African markets</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-[#3BBA93]" />
              <span>Mobile money + card + POS</span>
            </div>
          </motion.div>

          {/* Hero CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.3, ease: easeOutQuint }}
            className="mt-8 sm:mt-10 flex flex-wrap items-center justify-center gap-4"
          >
            <Button
              asChild
              className="h-12 px-7 rounded-xl bg-[#3BBA93] hover:bg-[#32a481] text-white font-extrabold text-sm sm:text-base shadow-lg shadow-[#3BBA93]/30"
            >
              <Link to="/contact">
                Talk to Sales
              </Link>
            </Button>
            <Button
              asChild
              className="h-12 px-7 rounded-xl border border-white/30 bg-white/10 hover:bg-white/20 text-white hover:text-white hover:border-white/60 font-bold text-sm sm:text-base backdrop-blur-sm transition-all"
            >
              <Link to="/docs">
                Explore API Docs
              </Link>
            </Button>
          </motion.div>
        </div>

        {/* Sub-Banner Strip */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35, ease: easeOutQuint }}
          className="relative z-10 bg-black/40 backdrop-blur-sm border-t border-white/10 py-4 sm:py-5"
        >
          <div className="max-w-4xl mx-auto px-6 text-center">
            <p className="text-xs sm:text-sm text-gray-200 font-normal leading-relaxed">
              AvadaPay is a pan-African payment gateway and SMS aggregator. Accept mobile money and
              card payments, run POS, send bulk payouts, and reach customers by SMS, through one
              connected platform live in 17+ markets.
            </p>
          </div>
        </motion.div>
      </section>

      {/* 2 — INTRO SECTION & LIVE MARQUEE TICKER */}
      <section className="bg-white pt-10 sm:pt-14 pb-14 sm:pb-20 overflow-hidden">
        {/* Ticker Strip in Refined Container */}
        <div className="relative border-y border-gray-100 bg-[#FAFAFC] py-4 sm:py-5">
          <div className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-28 bg-gradient-to-r from-white to-transparent z-10" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-28 bg-gradient-to-l from-white to-transparent z-10" />

          <Marquee animation="animate-marquee-slow">
            <div className="flex items-center">
              {UNDER_HERO_ITEMS.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 sm:gap-4 pr-12 sm:pr-20 shrink-0">
                  <div className="w-8 sm:w-9 h-8 sm:h-9 rounded-xl bg-[#3BBA93]/10 flex items-center justify-center shrink-0">
                    <item.Icon className="w-5 sm:w-6 h-auto" />
                  </div>
                  <span className="whitespace-nowrap font-extrabold tracking-tight text-[#2A292D] text-lg sm:text-2xl md:text-[26px] leading-none">
                    {item.text}
                  </span>
                  <span className="text-[#3BBA93] text-sm ml-4 sm:ml-8 opacity-40 font-bold">•</span>
                </div>
              ))}
            </div>
          </Marquee>
        </div>

        {/* 2-Column Feature Showcase: Narrative on Left, Interactive Capability Navigator on Right */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 sm:mt-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Left Column: Narrative and CTAs (6 cols) */}
            <FadeIn delay={0.1} className="lg:col-span-6 space-y-6">
              <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-black tracking-tight text-[#2A292D] leading-[1.12]">
                African commerce is fragmented.{' '}
                <span className="text-[#3BBA93] block mt-1">We make it unified.</span>
              </h2>

              <p className="text-base sm:text-lg text-gray-700 leading-relaxed font-normal">
                African businesses don&apos;t operate in a single payment world. Customers pay through
                regional mobile money wallets, national bank rails, and international cards across diverse markets.
                AvadaPay connects you to all of them through one seamless integration.
              </p>

              <p className="text-sm sm:text-base text-gray-600 leading-relaxed font-normal">
                Collect payments, send payouts to agents and customers, accept in-person payments
                through POS, and communicate every transaction through SMS, without stitching
                together multiple disconnected providers per country.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Button asChild className="h-11 px-6 rounded-xl bg-[#2A292D] hover:bg-black text-white font-bold text-sm shadow-md transition-all">
                  <Link to="/contact">
                    <span>Talk to Sales</span>
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
                <Link
                  to="/docs"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#3BBA93] hover:text-[#2d9676] transition-colors"
                >
                  <span>Explore developer documentation</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </FadeIn>

            {/* Right Column: Interactive Capability Switcher (6 cols) */}
            <FadeIn delay={0.2} className="lg:col-span-6">
              <div className="space-y-4">
                {/* 3-Tab Navigator Bar */}
                <div className="flex p-1.5 bg-gray-100 rounded-2xl space-x-1 border border-gray-200/80">
                  {INTRO_CAPABILITIES.map((cap, idx) => {
                    const Icon = cap.icon;
                    const isActive = activeCapability === idx;
                    return (
                      <button
                        key={cap.id}
                        type="button"
                        onClick={() => setActiveCapability(idx)}
                        className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                          isActive
                            ? 'bg-white text-[#2A292D] shadow-sm ring-1 ring-black/5'
                            : 'text-gray-500 hover:text-gray-900'
                        }`}
                      >
                        <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#3BBA93]' : 'text-gray-400'}`} />
                        <span className="hidden sm:inline">{cap.title}</span>
                        <span className="sm:hidden">{cap.title.split(' ')[0]}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Selected Capability Details Card */}
                {(() => {
                  const current = INTRO_CAPABILITIES[activeCapability] || INTRO_CAPABILITIES[0];
                  const Icon = current.icon;
                  return (
                    <motion.div
                      key={current.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25 }}
                      className="rounded-3xl border border-gray-200/90 bg-gradient-to-b from-gray-50/70 via-white to-white p-6 sm:p-7 shadow-xs space-y-4"
                    >
                      <div className="flex items-center justify-between">
                        <div className="w-10 h-10 rounded-xl bg-[#3BBA93]/15 text-[#3BBA93] flex items-center justify-center font-bold">
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-bold text-[#3BBA93] bg-[#E3F5EE] px-2.5 py-0.5 rounded-full border border-[#3BBA93]/30">
                          {current.tag}
                        </span>
                      </div>

                      <div>
                        <h3 className="text-lg sm:text-xl font-extrabold text-[#2A292D]">
                          {current.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-500 font-semibold mt-0.5">
                          {current.subtitle}
                        </p>
                      </div>

                      <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-normal">
                        {current.description}
                      </p>

                      <div className="pt-2 border-t border-gray-150 space-y-2">
                        {current.points.map((p, i) => (
                          <div key={i} className="flex items-start space-x-2.5 text-xs text-gray-700 font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#3BBA93] shrink-0 mt-0.5" />
                            <span>{p}</span>
                          </div>
                        ))}
                      </div>

                      <div className="pt-3 border-t border-gray-150 flex items-center justify-between text-xs">
                        <span className="font-bold text-[#3BBA93] flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#3BBA93] animate-pulse" />
                          {current.badge}
                        </span>
                        <span className="text-gray-500 font-medium">{current.metric.label}</span>
                      </div>
                    </motion.div>
                  );
                })()}
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* 3 — FOUR WAYS SECTION */}
      <section className="bg-[#3BBA93] py-16 sm:py-20 px-4 text-white">
        <div className="max-w-5xl mx-auto">
          <FadeIn>
            <h2 className="text-center font-extrabold tracking-tight leading-[1.18] text-2xl sm:text-3xl md:text-4xl text-white max-w-2xl mx-auto">
              Four ways AvadaPay powers your business
            </h2>
            <p className="text-white/85 text-center mt-3 text-sm sm:text-base font-normal">
              Everything required to orchestrate money and communication across Africa.
            </p>
          </FadeIn>

          <StaggerContainer className="mt-10 sm:mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {WAYS.map((w) => (
              <StaggerItem key={w.n}>
                <HoverScale y={-5} className="h-full">
                  <article className="bg-white rounded-2xl p-6 sm:p-7 shadow-md flex flex-col justify-between text-[#2A292D] h-full hover:shadow-xl transition-shadow duration-300">
                    <div>
                      <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-[#3BBA93]/15 text-[#3BBA93] text-base font-bold">
                        {w.n}
                      </span>
                      <h3 className="mt-4 text-lg sm:text-xl font-extrabold text-gray-900">
                        <Link to={w.link} className="hover:text-[#3BBA93] transition-colors">
                          {w.title}
                        </Link>
                      </h3>
                      <p className="mt-2 text-xs sm:text-sm leading-relaxed text-gray-600 font-normal">
                        {w.body}
                      </p>
                    </div>
                    <Link
                      to={w.link}
                      className="mt-5 inline-flex items-center text-xs font-bold text-[#3BBA93] hover:underline"
                      aria-label={`Explore ${w.title}`}
                    >
                      <span>Explore {w.title}</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </Link>
                  </article>
                </HoverScale>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* 4 — WHY TEAMS BUILD */}
      <section className="bg-white pt-16 sm:pt-20 px-4">
        <div className="max-w-5xl mx-auto">
          <FadeIn>
            <TwoToneHeading green="Why teams build" dark="on AvadaPay" />
            <p className="mt-4 mx-auto max-w-2xl text-center text-sm sm:text-base text-gray-600 leading-relaxed font-normal">
              Go live across Africa in days, not months, with one API, mobile money plus card rails,
              next-day local-currency payouts, and SMS tied to every transaction.
            </p>
          </FadeIn>

          <StaggerContainer className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {WHY.map((w, i) => (
              <StaggerItem key={i}>
                <HoverScale y={-4} className="h-full">
                  <Link
                    to={w.to}
                    className="group flex flex-col justify-between rounded-2xl border border-[#3BBA93]/30 bg-white p-6 sm:p-7 shadow-xs hover:border-[#3BBA93] hover:shadow-lg transition-all duration-300 h-full"
                  >
                    <h3 className="text-xl sm:text-2xl font-extrabold leading-snug text-gray-900">
                      {w.title.map((line, li) => (
                        <React.Fragment key={li}>
                          {li > 0 && <br />}
                          {line}
                        </React.Fragment>
                      ))}
                    </h3>
                    <div className="mt-6 flex items-center justify-between">
                      <span className="text-xs font-bold text-[#3BBA93] group-hover:underline">{w.action}</span>
                      <span className="w-10 h-10 rounded-full bg-[#3BBA93] text-white flex items-center justify-center transition-transform duration-200 group-hover:translate-x-1 shadow-sm">
                        <ArrowRight className="w-5 h-5" strokeWidth={2.5} />
                      </span>
                    </div>
                  </Link>
                </HoverScale>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* 5 — INDUSTRIES ACCORDION */}
      <section className="bg-white pt-16 sm:pt-20 px-4">
        <div className="max-w-3xl mx-auto">
          <FadeIn>
            <TwoToneHeading green="Built for the businesses that" dark="move African economies" />
          </FadeIn>

          <FadeIn delay={0.1} className="mt-8 space-y-3.5">
            {INDUSTRIES.map((item, i) => {
              const open = openIndex === i;
              return (
                <div
                  key={item.title}
                  className="rounded-xl border border-[#3BBA93]/35 bg-white transition-colors hover:border-[#3BBA93] overflow-hidden"
                >
                  <button
                    type="button"
                    aria-expanded={open}
                    onClick={() => setOpenIndex(open ? null : i)}
                    className="w-full h-14 sm:h-16 px-6 flex items-center justify-between text-left text-sm sm:text-base font-bold text-gray-900 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3BBA93]"
                  >
                    <span>{item.title}</span>
                    <ChevronUp
                      className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${open ? 'rotate-180 text-[#3BBA93]' : ''}`}
                    />
                  </button>
                  <div
                    className={`grid transition-all duration-200 ease-in-out ${
                      open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="px-6 pb-5 text-xs sm:text-sm leading-relaxed text-gray-600 font-normal">
                        {item.body}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </FadeIn>
        </div>
      </section>

      {/* 6 — FLAGS + OFFICES */}
      <section className="bg-white pt-14 sm:pt-16 pb-16 sm:pb-20">
        <FadeIn delay={0.05} className="relative">
          {/* Subtle Carousel Tab Lead */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 z-10 h-16 w-16 sm:w-20 rounded-r-2xl bg-[#E3F5EE] flex items-center justify-center pl-1 sm:pl-2 shadow-xs">
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#3BBA93] text-white shadow-xs">
              <ArrowRight className="w-5 h-5" strokeWidth={2.5} />
            </span>
          </div>
          <Marquee animation="animate-marquee">
            <div className="flex items-center gap-6 sm:gap-10 pl-24 pr-8 py-3">
              {[...CIRCLE_FLAGS, ...CIRCLE_FLAGS].map((Flag, i) => (
                <Flag key={i} />
              ))}
            </div>
          </Marquee>
        </FadeIn>

        {/* Dubai Map */}
        <FadeIn delay={0.1} className="mt-12 max-w-4xl mx-auto px-4">
          <div className="overflow-hidden rounded-2xl bg-gray-100 h-60 sm:h-72 border border-gray-200 shadow-xs">
            <iframe
              title="AvadaPay headquarters — SORP Business Centre, Dubai"
              src="https://www.google.com/maps?q=SORP+Business+Centre+Tameem+House+Barsha+Heights+Dubai&output=embed"
              className="w-full h-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
          <div className="mt-4 px-2">
            <p className="font-extrabold text-base sm:text-lg text-gray-900">Dubai, UAE (Headquarters)</p>
            <p className="mt-1 text-xs sm:text-sm text-gray-600 leading-relaxed max-w-lg">
              25th floor, SORP Business Centre Tameem House, Barsha Heights, Dubai, United Arab
              Emirates (UAE)
            </p>
          </div>
        </FadeIn>

        {/* Country Offices */}
        <StaggerContainer className="mt-8 max-w-4xl mx-auto px-4 space-y-3">
          {OFFICES.map((o) => (
            <StaggerItem key={o.country}>
              <HoverScale y={-2}>
                <div
                  className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border bg-white px-6 py-4 shadow-xs transition-colors ${
                    o.disabled ? 'border-gray-200 opacity-75' : 'border-[#3BBA93]/30 hover:border-[#3BBA93]'
                  }`}
                >
                  <p className="text-xs sm:text-sm text-gray-800 leading-snug">
                    <span className="font-bold text-gray-900 mr-3">{o.country}</span>
                    <span className="text-gray-600">{o.address}</span>
                  </p>
                  {o.disabled ? (
                    <span className="inline-flex shrink-0 items-center justify-center h-9 px-4 rounded-md bg-gray-100 text-gray-500 font-semibold text-xs border border-gray-200 cursor-not-allowed select-none">
                      Coming Soon
                    </span>
                  ) : o.to.startsWith('http') ? (
                    <a
                      href={o.to}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex shrink-0 items-center justify-center gap-1.5 h-9 px-4 rounded-md bg-[#3BBA93] text-white font-semibold text-xs transition-colors hover:bg-[#32a481] active:scale-[0.98] shadow-xs"
                    >
                      <span>{o.country} services</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  ) : (
                    <Link
                      to={o.to}
                      className="inline-flex shrink-0 items-center justify-center gap-1.5 h-9 px-4 rounded-md bg-[#3BBA93] text-white font-semibold text-xs transition-colors hover:bg-[#32a481] active:scale-[0.98] shadow-xs"
                    >
                      <span>{o.country} services</span>
                      <ArrowRight className="w-3.5 h-3.5" strokeWidth={2.5} />
                    </Link>
                  )}
                </div>
              </HoverScale>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      {/* 7 — NETWORKS & PARTNERS */}
      <section className="bg-white pb-16 sm:pb-20 px-0">
        <FadeIn>
          <TwoToneHeading
            green="The networks and"
            dark="partners we plug into"
          />
        </FadeIn>
        <div className="mt-8 space-y-4">
          <Marquee animation="animate-marquee-slow">
            {ROW_ONE.map((logo, i) => (
              <div key={i} className="px-8 sm:px-12 h-12 flex items-center">
                {logo}
              </div>
            ))}
          </Marquee>
          <Marquee animation="animate-marquee-reverse">
            {ROW_TWO.map((logo, i) => (
              <div key={i} className="px-8 sm:px-12 h-12 flex items-center">
                {logo}
              </div>
            ))}
          </Marquee>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
