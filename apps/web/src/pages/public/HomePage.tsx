import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronUp } from 'lucide-react';
import { CIRCLE_FLAGS } from '@/components/home/CircleFlags';
import { ROW_ONE, ROW_TWO } from '@/components/home/PartnerLogos';
import { Marquee } from '@/components/Marquee';
import heroBg from '@/assets/hero-bg.jpg';

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
  { title: ['One API,', '17+ markets'], to: '/payment-processing' },
  { title: ['99.9% uptime'], to: '/payment-processing' },
  { title: ['Mobile-', 'money-first'], to: '/payment-processing' },
  { title: ['Payouts you', 'can rely on'], to: '/payment-processing' },
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

const OFFICES = [
  { country: 'Kenya', address: '8th Floor Westpark Towers, Westlands, Nairobi', to: '/countries/kenya' },
  { country: 'Tanzania', address: 'Dar es Salaam, Tanzania', to: '/countries/tanzania' },
  { country: 'Rwanda', address: 'Kigali, Rwanda', to: '/countries/rwanda' },
  { country: 'DRC', address: 'SILIKIN VILLAGE, Local A012, Bâtiment Phase 3', to: '/contact' },
];

export const HomePage: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="flex flex-col bg-white text-[#2A292D] font-sans overflow-x-hidden">
      {/* 1 — HERO SECTION */}
      <section className="relative isolate flex flex-col min-h-[75vh] md:min-h-[82vh] text-white overflow-hidden">
        {/* Softly blurred background image with balanced ambient dark overlay */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src={heroBg}
            alt="AvadaPay Hero Background"
            className="w-full h-full object-cover object-center scale-105 filter blur-[3.5px]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/75" />
        </div>

        <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-4 pt-28 sm:pt-36 pb-12 max-w-5xl mx-auto">
          <h1 className="font-extrabold tracking-tight leading-[1.12] text-3xl sm:text-5xl lg:text-[56px] max-w-4xl text-white">
            Payments and customer<br className="hidden sm:inline" /> communication,{' '}
            <span className="text-[#3BBA93]">built for<br className="hidden sm:inline" /> African markets.</span>
          </h1>

          <div className="mt-8 sm:mt-12 flex flex-wrap items-center justify-center gap-6 sm:gap-12 text-sm sm:text-base font-semibold text-white/95">
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
          </div>
        </div>

        {/* Sub-Banner Strip */}
        <div className="relative z-10 bg-black/40 backdrop-blur-sm border-t border-white/10 py-4 sm:py-5">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <p className="text-xs sm:text-sm text-gray-200 font-normal leading-relaxed">
              AvadaPay is a pan-African payment gateway and SMS aggregator. Accept mobile money and
              card payments, run POS, send bulk payouts, and reach customers by SMS, through one
              connected platform live in 17+ markets.
            </p>
          </div>
        </div>
      </section>

      {/* 2 — INTRO SECTION & 3-ITEM MARQUEE */}
      <section className="bg-white pt-12 sm:pt-16 pb-14 sm:pb-20">
        <Marquee animation="animate-marquee-slow">
          <div className="flex items-center">
            {UNDER_HERO_ITEMS.map((item, idx) => (
              <div key={idx} className="flex items-center gap-3.5 sm:gap-4.5 pr-12 sm:pr-20 shrink-0">
                <item.Icon className="w-8 sm:w-11 h-auto shrink-0" />
                <span className="whitespace-nowrap font-extrabold tracking-tight text-[#2A292D] text-2xl sm:text-4xl md:text-[42px] leading-none">
                  {item.text}
                </span>
              </div>
            ))}
          </div>
        </Marquee>

        <div className="max-w-3xl mx-auto px-6 mt-10 sm:mt-14 text-center text-sm sm:text-base md:text-[17px] leading-relaxed text-gray-600 space-y-5">
          <p>
            African businesses don’t operate in a single payment world. Customers pay through
            M-Pesa in Nairobi, Orange Money in Kinshasa, Tigo Pesa in Dar es Salaam, and cards
            almost everywhere. AvadaPay connects you to all of it through one integration.
          </p>
          <p>
            Collect payments, send payouts to agents and customers, accept in-person payments
            through POS, and communicate every transaction through SMS, without stitching
            together five different providers per country.
          </p>
        </div>
      </section>

      {/* 3 — FOUR WAYS SECTION */}
      <section className="bg-[#3BBA93] py-16 sm:py-20 px-4 text-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-center font-extrabold tracking-tight leading-[1.18] text-2xl sm:text-3xl md:text-4xl text-white max-w-2xl mx-auto">
            Four ways AvadaPay powers your business
          </h2>
          <p className="text-white/85 text-center mt-3 text-sm sm:text-base font-normal">
            Everything required to orchestrate money and communication across Africa.
          </p>

          <div className="mt-10 sm:mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {WAYS.map((w) => (
              <article
                key={w.n}
                className="bg-white rounded-2xl p-6 sm:p-7 shadow-md flex flex-col justify-between text-[#2A292D]"
              >
                <div>
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-[#3BBA93]/15 text-[#3BBA93] text-base font-bold">
                    {w.n}
                  </span>
                  <h3 className="mt-4 text-lg sm:text-xl font-extrabold text-gray-900">{w.title}</h3>
                  <p className="mt-2 text-xs sm:text-sm leading-relaxed text-gray-600 font-normal">
                    {w.body}
                  </p>
                </div>
                <Link to={w.link} className="mt-5 inline-flex items-center text-xs font-bold text-[#3BBA93] hover:underline">
                  <span>Learn more</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 4 — WHY TEAMS BUILD */}
      <section className="bg-white pt-16 sm:pt-20 px-4">
        <div className="max-w-5xl mx-auto">
          <TwoToneHeading green="Why teams build" dark="on AvadaPay" />
          <p className="mt-4 mx-auto max-w-2xl text-center text-sm sm:text-base text-gray-600 leading-relaxed font-normal">
            Go live across Africa in days, not months, with one API, mobile money plus card rails,
            next-day local-currency payouts, and SMS tied to every transaction.
          </p>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {WHY.map((w, i) => (
              <Link
                key={i}
                to={w.to}
                className="group flex flex-col justify-between rounded-2xl border border-[#3BBA93]/30 bg-white p-6 sm:p-7 shadow-xs hover:border-[#3BBA93] hover:shadow-md transition-all duration-200"
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
                  <span className="text-xs font-bold text-[#3BBA93] group-hover:underline">Explore solution</span>
                  <span className="w-10 h-10 rounded-full bg-[#3BBA93] text-white flex items-center justify-center transition-transform duration-200 group-hover:translate-x-1 shadow-sm">
                    <ArrowRight className="w-5 h-5" strokeWidth={2.5} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 5 — INDUSTRIES ACCORDION */}
      <section className="bg-white pt-16 sm:pt-20 px-4">
        <div className="max-w-3xl mx-auto">
          <TwoToneHeading green="Built for the businesses that" dark="move African economies" />

          <div className="mt-8 space-y-3.5">
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
          </div>
        </div>
      </section>

      {/* 6 — FLAGS + OFFICES */}
      <section className="bg-white pt-14 sm:pt-16 pb-16 sm:pb-20">
        <div className="relative">
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
        </div>

        {/* Dubai Map */}
        <div className="mt-12 max-w-4xl mx-auto px-4">
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
        </div>

        {/* Country Offices */}
        <div className="mt-8 max-w-4xl mx-auto px-4 space-y-3">
          {OFFICES.map((o) => (
            <div
              key={o.country}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-[#3BBA93]/30 bg-white px-6 py-4 shadow-xs hover:border-[#3BBA93] transition-colors"
            >
              <p className="text-xs sm:text-sm text-gray-800 leading-snug">
                <span className="font-bold text-gray-900 mr-3">{o.country}</span>
                <span className="text-gray-600">{o.address}</span>
              </p>
              <Link
                to={o.to}
                className="inline-flex shrink-0 items-center justify-center gap-1.5 h-9 px-4 rounded-md bg-[#3BBA93] text-white font-semibold text-xs transition-colors hover:bg-[#32a481] active:scale-[0.98] shadow-xs"
              >
                <span>{o.country} services</span>
                <ArrowRight className="w-3.5 h-3.5" strokeWidth={2.5} />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* 7 — NETWORKS & PARTNERS */}
      <section className="bg-white pb-16 sm:pb-20 px-0">
        <TwoToneHeading
          green="The networks and"
          dark="partners we plug into"
        />
        <div className="mt-8 space-y-4">
          <Marquee animation="animate-marquee-slow">
            {[...ROW_ONE, ...ROW_ONE].map((logo, i) => (
              <div key={i} className="px-8 sm:px-12 h-12 flex items-center">
                {logo}
              </div>
            ))}
          </Marquee>
          <Marquee animation="animate-marquee-reverse">
            {[...ROW_TWO, ...ROW_TWO].map((logo, i) => (
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
