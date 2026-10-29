import React from 'react';
import { Link } from 'react-router-dom';
import {
  Smartphone,
  FileText,
  MapPin,
  Globe2,
  ArrowRight,
  CreditCard,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CountryFlag } from '@/components/CountryFlag';
import { FadeIn, StaggerContainer, StaggerItem, HoverScale } from '@/components/motion/Motion';
import { OptimizedImage } from '@/components/ui/OptimizedImage';
import { SEO } from '@/components/seo/SEO';
import { useSiteConfig } from '@/context/SiteConfigContext';
import { resolveMapEmbedUrl } from '@/lib/maps';

/* ------------------------------------------------------------------ */
/* Hero Visual Component                                               */
/* ------------------------------------------------------------------ */

const RwandaHeroVisual: React.FC = () => (
  <div className="w-full h-full p-6 flex flex-col justify-between bg-gradient-to-br from-[#232226] via-[#2A292D] to-[#1E1D21] text-white">
    <div className="flex items-center justify-between border-b border-white/10 pb-4">
      <div className="flex items-center space-x-2.5">
        <CountryFlag country="rwanda" className="w-6 h-4" />
        <span className="text-sm font-bold tracking-wide">Rwanda</span>
      </div>
      <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#3BBA93] bg-[#3BBA93]/15 px-2.5 py-0.5 rounded-full">
        <span className="w-1.5 h-1.5 rounded-full bg-[#3BBA93] animate-pulse" />
        NBR & RURA Compliant
      </span>
    </div>

    {/* Live Stream Simulation */}
    <div className="space-y-3 my-auto py-2">
      <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-lg bg-[#FFCC00]/20 text-[#FFCC00] flex items-center justify-center font-black text-xs">
            MTN
          </div>
          <div>
            <p className="text-xs font-bold text-white">MTN MoMo Collection</p>
            <p className="text-[10px] text-gray-400">USSD Push · +250 788 ***</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs font-black text-white">RWF 85,000</p>
          <span className="text-[10px] text-[#3BBA93] font-bold">Confirmed</span>
        </div>
      </div>

      <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-lg bg-[#ED1C24]/20 text-[#ED1C24] flex items-center justify-center font-black text-xs">
            AIR
          </div>
          <div>
            <p className="text-xs font-bold text-white">Airtel Money Payout</p>
            <p className="text-[10px] text-gray-400">Agent Disburse · 18 staff</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs font-black text-white">RWF 420,000</p>
          <span className="text-[10px] text-[#3BBA93] font-bold">Processed</span>
        </div>
      </div>

      <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-lg bg-[#3BBA93]/20 text-[#3BBA93] flex items-center justify-center">
            <CreditCard className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-bold text-white">Smart POS Terminal</p>
            <p className="text-[10px] text-gray-400">Kigali Heights Hub · Tap</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs font-black text-white">RWF 19,500</p>
          <span className="text-[10px] text-[#3BBA93] font-bold">Settled</span>
        </div>
      </div>
    </div>

    <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-gray-400">
      <span>Kigali Central Node</span>
      <span className="text-[#3BBA93] font-mono font-bold">99.9% SLA</span>
    </div>
  </div>
);

/* ------------------------------------------------------------------ */
/* Page Component                                                      */
/* ------------------------------------------------------------------ */

export const RwandaPage: React.FC = () => {
  const { countries } = useSiteConfig();
  const rwData = countries.find((c) => c.slug === 'rwanda' || c.code.toLowerCase() === 'rw');
  const officeAddress = rwData?.officeAddress || 'BHC Building, KG 7 Ave Kacyiru, Gasabo, Kigali, Rwanda';
  const mapEmbedUrl = resolveMapEmbedUrl(rwData?.mapEmbedUrl, officeAddress);

  const timelineSteps = [
    {
      title: 'Customer pays',
      desc: 'Through MTN MoMo, Airtel Money, or card.',
      align: 'left',
    },
    {
      title: 'Team confirms',
      desc: 'Real-time updates on the dashboard.',
      align: 'right',
    },
    {
      title: 'Customer notified',
      desc: 'SMS confirmation, OTP, or service update.',
      align: 'left',
    },
    {
      title: 'Finance tracks',
      desc: 'Collections, payouts and settlements easy to follow.',
      align: 'right',
    },
    {
      title: 'Systems connected',
      desc: 'APIs, webhooks and dashboards plug into your stack.',
      align: 'left',
    },
  ];

  const pillarCards = [
    {
      n: 1,
      title: 'Mobile money',
      body: 'MTN Mobile Money and Airtel Money collections',
    },
    {
      n: 2,
      title: 'Card payments',
      body: 'Visa and Mastercard acceptance where applicable',
    },
    {
      n: 3,
      title: 'POS',
      body: 'SoftPOS and dedicated terminals connected to your AvadaPay',
    },
    {
      n: 4,
      title: 'Bulk SMS',
      body: 'Notifications, OTPs, reminders, confirmations, marketing campaigns.',
    },
    {
      n: 5,
      title: 'APIs',
      body: 'Payment, payout and SMS APIs to plug into your existing systems.',
    },
    {
      n: 6,
      title: 'Payouts',
      body: 'Disburse to customers, agents, vendors, staff, merchants and partners.',
    },
  ];

  const whyCards = [
    {
      icon: <Smartphone className="w-6 h-6 text-[#3BBA93]" />,
      title: 'Built for cashless commerce',
      body: 'Designed for the way Rwandan businesses are already operating.',
    },
    {
      icon: <FileText className="w-6 h-6 text-[#3BBA93]" />,
      title: 'Clean reporting and reconciliation',
      body: 'Finance teams get what they actually need, searchable, exportable, reconciled.',
    },
    {
      icon: <MapPin className="w-6 h-6 text-[#3BBA93]" />,
      title: 'Local presence',
      body: 'Our Kigali team handles onboarding and merchant support.',
    },
    {
      icon: <Globe2 className="w-6 h-6 text-[#3BBA93]" />,
      title: 'Regional reach',
      body: 'Same platform, same API for every other AvadaPay market when you expand.',
    },
  ];

  return (
    <div className="bg-white text-[#2A292D] font-sans overflow-x-hidden">
      <SEO
        title="Avadapay Rwanda | National Payments & Mobile Money Gateway"
        description="Accept MTN Mobile Money, Airtel Money, and card payments in Rwanda with Avadapay. Local presence at BHC Building, Kacyiru, Kigali with bank-grade reconciliation."
        canonical="/rwanda"
        keywords="Avadapay Rwanda, MTN MoMo Rwanda, Airtel Money Rwanda, payment gateway Kigali, POS Rwanda, bulk SMS Rwanda"
        structuredData={{
          "@type": "LocalBusiness",
          "name": "Avadapay Rwanda",
          "image": "https://avadapay.com/og-image.png",
          "url": "https://avadapay.com/rwanda",
          "telephone": "+250 788 000 000",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "BHC Building, KG 7 Ave Kacyiru, Gasabo",
            "addressLocality": "Kigali",
            "addressCountry": "RW"
          },
          "priceRange": "$$"
        }}
      />
      {/* 1 — HERO SECTION */}
      <section className="bg-[#2A292D] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 pb-16 sm:pb-24 grid lg:grid-cols-[1.3fr_1fr] gap-10 lg:gap-14 items-center">
          <div className="lg:pl-8">
            <h1 className="font-extrabold tracking-tight leading-[1.1] text-[clamp(2.25rem,5vw,4.1rem)]">
              A smarter way to <br className="hidden sm:inline" />
              handle business <br className="hidden sm:inline" />
              payments in Rwanda.
            </h1>
            <p className="mt-8 max-w-[34rem] text-base sm:text-lg font-semibold leading-[1.5] text-white">
              Accept MTN Mobile Money, Airtel Money and card payments. Send payouts. Confirm every
              transaction by SMS. Keep finance teams aligned, all from one dashboard with AvadaPay.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button asChild className="h-[3.1rem] px-7 rounded-md bg-[#3BBA93] hover:bg-[#32a481] text-white text-base font-bold shadow-none">
                <Link to="/contact?country=Rwanda">
                  Contact Us
                </Link>
              </Button>
            </div>
          </div>

          {/* Framed hero panel */}
          <div className="hidden lg:block aspect-[0.92/1] w-full max-w-[26rem] justify-self-end overflow-hidden rounded-3xl border border-[#3BBA93]/50 shadow-2xl">
            <RwandaHeroVisual />
          </div>
        </div>
      </section>

      {/* 2 — BUILT FOR RWANDA'S CASHLESS PUSH */}
      <section className="pt-10 sm:pt-14 pb-10 sm:pb-12 px-4 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-8">
          <h2 className="font-extrabold tracking-tight leading-[1.15] text-3xl sm:text-4xl md:text-[44px] text-[#2A292D]">
            Built for Rwanda's <span className="text-[#3BBA93]">cashless push</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg font-semibold leading-relaxed text-[#2A292D]/85">
            Rwanda is one of Africa's fastest-digitising economies. Customers expect to pay through
            MTN MoMo or Airtel Money. Businesses expect clean reporting, fast reconciliation, and
            regulatory clarity. AvadaPay was built for that environment. Collect through every
            supported channel, disburse to agents and customers in RWF, notify customers
            automatically, and connect your stack cleanly.
          </p>
        </div>

        {/* Kigali Convention Centre Banner with Apple-design depth, ambient overlay and live market badge */}
        <FadeIn className="relative w-full max-w-5xl mx-auto h-[200px] sm:h-[260px] md:h-[300px] overflow-hidden rounded-2xl sm:rounded-3xl border border-gray-200/80 shadow-[0_12px_36px_rgba(0,0,0,0.08)] group">
          <OptimizedImage
            src="/media/kigali-skyline.jpg"
            alt="Kigali Convention Centre glowing at night"
            priority={true}
            containerClassName="h-full w-full"
            className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.02]"
          />
          {/* Subtle ambient gradient overlay for cinematic contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none" />

          {/* Micro badges: frosted glass with Apple-style blur */}
          <div className="absolute bottom-3.5 left-3.5 sm:bottom-4 sm:left-5 z-10 flex items-center gap-2 px-3 py-1.5 sm:px-3.5 sm:py-1.5 rounded-full bg-black/45 backdrop-blur-md border border-white/20 text-white text-xs sm:text-sm font-medium shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#3BBA93] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#3BBA93]" />
            </span>
            <span>Kigali Convention & Financial Hub</span>
          </div>

          <div className="hidden sm:flex absolute bottom-4 right-5 z-10 items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/15 text-white/90 text-xs font-medium">
            <span>Direct MoMo & Airtel Rails</span>
          </div>
        </FadeIn>
      </section>

      {/* 3 — TIMELINE: FROM PAYMENT TO CONFIRMATION */}
      <section className="pt-8 sm:pt-10 pb-16 sm:pb-22 px-4 max-w-4xl mx-auto">
        <FadeIn className="text-center mb-14 sm:mb-18">
          <h2 className="font-extrabold tracking-tight leading-[1.15] text-3xl sm:text-4xl md:text-[44px] text-[#2A292D]">
            From payment to confirmation, <br />
            <span className="text-[#3BBA93]">without the guesswork</span>
          </h2>
        </FadeIn>

        {/* Vertical Timeline */}
        <FadeIn delay={0.1} className="relative py-4">
          {/* Central Vertical Line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-0.5 -translate-x-1/2 bg-gray-200" />

          <div className="space-y-12 sm:space-y-16">
            {timelineSteps.map((step, idx) => {
              const isLeft = step.align === 'left';
              return (
                <div key={idx} className="relative flex items-center justify-between">
                  {/* Left Column */}
                  <div className={`w-[45%] ${isLeft ? 'text-right pr-6 sm:pr-8' : ''}`}>
                    {isLeft && (
                      <div>
                        <h3 className="text-lg sm:text-xl font-extrabold text-[#3BBA93]">
                          {step.title}
                        </h3>
                        <p className="mt-1 text-sm sm:text-base font-semibold text-[#2A292D]/85 leading-snug">
                          {step.desc}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Concentric Node Circle */}
                  <div className="relative z-10 w-9 h-9 rounded-full bg-white border-2 border-[#3BBA93] flex items-center justify-center shrink-0 shadow-xs">
                    <span className="w-3.5 h-3.5 rounded-full bg-[#3BBA93]" />
                  </div>

                  {/* Right Column */}
                  <div className={`w-[45%] ${!isLeft ? 'text-left pl-6 sm:pr-8' : ''}`}>
                    {!isLeft && (
                      <div>
                        <h3 className="text-lg sm:text-xl font-extrabold text-[#3BBA93]">
                          {step.title}
                        </h3>
                        <p className="mt-1 text-sm sm:text-base font-semibold text-[#2A292D]/85 leading-snug">
                          {step.desc}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </FadeIn>
      </section>

      {/* 4 — TEAL BACKGROUND 6 NUMBERED PILLARS */}
      <section className="bg-[#3BBA93] py-20 sm:py-24 lg:py-28 px-4 sm:px-6 lg:px-8 text-white">
        <div className="max-w-6xl mx-auto">
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 lg:gap-8">
            {pillarCards.map((card) => (
              <StaggerItem key={card.n}>
                <HoverScale y={-6} className="h-full">
                  <div
                    className="bg-white rounded-3xl p-7 sm:p-8 text-[#2A292D] shadow-[0_10px_30px_rgba(0,0,0,0.08)] flex flex-col justify-start h-full min-h-[220px] hover:shadow-2xl transition-shadow duration-300"
                  >
                    <div>
                      <div className="w-10 h-10 rounded-xl bg-[#E3F5EE] text-[#3BBA93] flex items-center justify-center font-black text-base mb-6">
                        {card.n}
                      </div>
                      <h3 className="font-extrabold text-xl sm:text-2xl text-[#2A292D]">
                        {card.title}
                      </h3>
                      <p className="mt-3 text-sm sm:text-base font-semibold text-[#2A292D]/80 leading-relaxed">
                        {card.body}
                      </p>
                    </div>
                  </div>
                </HoverScale>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* 5 — CONNECT AVADAPAY TO YOUR SYSTEMS */}
      <section className="py-16 sm:py-20 px-4 max-w-4xl mx-auto text-center">
        <h2 className="font-extrabold tracking-tight leading-[1.15] text-3xl sm:text-4xl md:text-[44px] text-[#2A292D]">
          <span className="text-[#3BBA93]">Connect AvadaPay</span> to your systems
        </h2>
        <p className="mt-6 text-base sm:text-lg font-semibold leading-relaxed text-[#2A292D]/85 max-w-3xl mx-auto">
          AvadaPay can connect to your website, app, CRM, school management system, lending
          platform, ecommerce store, or internal business tools through Payment API, Bulk Payout
          API, SMS API, webhooks, real-time dashboards and transaction reports.
        </p>
      </section>

      {/* 6 — WHY AVADAPAY IN RWANDA */}
      <section className="py-14 sm:py-18 px-4 max-w-6xl mx-auto">
        <h2 className="text-center font-extrabold tracking-tight leading-[1.15] text-3xl sm:text-4xl md:text-[44px] text-[#2A292D] mb-12 sm:mb-14">
          Why AvadaPay in <span className="text-[#3BBA93]">Rwanda</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {whyCards.map((card, i) => (
            <div
              key={i}
              className="rounded-2xl border border-[#3BBA93]/35 bg-white p-7 shadow-[0_6px_18px_rgba(0,0,0,0.04)] flex flex-col justify-between hover:border-[#3BBA93] transition-colors"
            >
              <div>
                <div className="w-11 h-11 rounded-xl bg-[#E3F5EE] flex items-center justify-center mb-6">
                  {card.icon}
                </div>
                <h3 className="font-extrabold text-lg text-[#2A292D]">{card.title}</h3>
                <p className="mt-3 text-sm font-semibold text-[#2A292D]/80 leading-relaxed">
                  {card.body}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Kigali Office Section */}
        <div className="mt-16 sm:mt-20 max-w-5xl mx-auto">
          <div className="h-72 sm:h-96 w-full rounded-3xl overflow-hidden border border-gray-200 shadow-md bg-gray-100">
            <iframe
              title="AvadaPay Rwanda Office — Kigali"
              src={mapEmbedUrl}
              className="w-full h-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>

          <div className="mt-6">
            <h3 className="text-xl sm:text-2xl font-black text-[#2A292D]">Kigali</h3>
            <p className="mt-1.5 text-base font-semibold text-gray-600">
              {officeAddress}
            </p>
            <div className="mt-4">
              <Button asChild className="h-11 px-6 bg-[#3BBA93] hover:bg-[#32a481] text-white font-bold rounded-lg flex items-center space-x-2">
                <Link to="/contact?country=Rwanda&inquiry=meeting">
                  <span>Book a meeting</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
