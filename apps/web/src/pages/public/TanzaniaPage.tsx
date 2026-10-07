import React from 'react';
import { Link } from 'react-router-dom';
import {
  Layers,
  MessageSquare,
  BarChart3,
  MapPin,
  ArrowRight,
  Filter,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CountryFlag } from '@/components/CountryFlag';

/* ------------------------------------------------------------------ */
/* Hero Visual Component                                               */
/* ------------------------------------------------------------------ */

const TanzaniaHeroVisual: React.FC = () => (
  <div className="w-full h-full p-6 flex flex-col justify-between bg-gradient-to-br from-[#232226] via-[#2A292D] to-[#1E1D21] text-white">
    <div className="flex items-center justify-between border-b border-white/10 pb-4">
      <div className="flex items-center space-x-2.5">
        <CountryFlag country="tanzania" className="w-6 h-4" />
        <span className="text-sm font-bold tracking-wide">Tanzania Aggregator</span>
      </div>
      <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#3BBA93] bg-[#3BBA93]/15 px-2.5 py-0.5 rounded-full">
        <span className="w-1.5 h-1.5 rounded-full bg-[#3BBA93] animate-pulse" />
        BOT & TCRA Live
      </span>
    </div>

    {/* Live Stream Simulation */}
    <div className="space-y-3 my-auto py-2">
      <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-lg bg-[#E60000]/20 text-[#E60000] flex items-center justify-center font-black text-xs">
            VOD
          </div>
          <div>
            <p className="text-xs font-bold text-white">Vodacom M-Pesa</p>
            <p className="text-[10px] text-gray-400">C2B Push · +255 754 ***</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs font-black text-white">TZS 180,000</p>
          <span className="text-[10px] text-[#3BBA93] font-bold">Received</span>
        </div>
      </div>

      <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-lg bg-[#00377B]/20 text-[#00A1DE] flex items-center justify-center font-black text-xs">
            TIG
          </div>
          <div>
            <p className="text-xs font-bold text-white">Tigo Pesa Disburse</p>
            <p className="text-[10px] text-gray-400">Supplier Batch #TZ-108</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs font-black text-white">TZS 1,240,000</p>
          <span className="text-[10px] text-[#3BBA93] font-bold">Success</span>
        </div>
      </div>

      <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-lg bg-[#FF8200]/20 text-[#FF8200] flex items-center justify-center font-black text-xs">
            HAL
          </div>
          <div>
            <p className="text-xs font-bold text-white">HaloPesa Direct</p>
            <p className="text-[10px] text-gray-400">Mobile Checkout Flow</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs font-black text-white">TZS 45,000</p>
          <span className="text-[10px] text-[#3BBA93] font-bold">Reconciled</span>
        </div>
      </div>
    </div>

    <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-gray-400">
      <span>Dar es Salaam TIPSS Rail</span>
      <span className="text-[#3BBA93] font-mono font-bold">99.96% SLA</span>
    </div>
  </div>
);

/* ------------------------------------------------------------------ */
/* Page Component                                                      */
/* ------------------------------------------------------------------ */

export const TanzaniaPage: React.FC = () => {
  const threeCards = [
    {
      n: 1,
      title: 'More networks. Fewer drop-offs.',
      points: [
        'Accept payments across all four major networks',
        'USSD push, deep links, and API-initiated flows',
        'Real-time confirmation and reconciliation',
        'Integrate with your website, app, platform or internal system',
      ],
    },
    {
      n: 2,
      title: 'Pay agents, merchants, vendors and customers in batches',
      points: [
        'Bulk payouts across mobile money networks',
        'Process payouts in batches or via API',
        'Status tracking and retry logic',
        'Automated reconciliation reports',
      ],
    },
    {
      n: 3,
      title: 'Customers know what’s happening, every time',
      points: [
        'Transactional SMS and payment confirmations',
        'OTPs and verification messages',
        'Customer reminders for repayments, renewals and appointments',
        'Marketing campaigns with segmentation and scheduling',
        'Delivery reports and per-message status',
      ],
    },
  ];

  const whyCards = [
    {
      icon: <Layers className="w-6 h-6 text-[#3BBA93]" />,
      title: 'Four operators, one setup',
      body: 'Connect once. Accept everywhere.',
    },
    {
      icon: <MessageSquare className="w-6 h-6 text-[#3BBA93]" />,
      title: 'SMS tied to payments',
      body: 'Trigger an SMS the moment a payment lands.',
    },
    {
      icon: <BarChart3 className="w-6 h-6 text-[#3BBA93]" />,
      title: 'Real-time reporting',
      body: 'Searchable, exportable, reconciled.',
    },
    {
      icon: <MapPin className="w-6 h-6 text-[#3BBA93]" />,
      title: 'Local team',
      body: 'Operations and support in Dar es Salaam.',
    },
  ];

  return (
    <div className="bg-white text-[#2A292D] font-sans overflow-x-hidden">
      {/* 1 — HERO SECTION */}
      <section className="bg-[#2A292D] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 pb-16 sm:pb-24 grid lg:grid-cols-[1.3fr_1fr] gap-10 lg:gap-14 items-center">
          <div className="lg:pl-8">
            <h1 className="font-extrabold tracking-tight leading-[1.1] text-[clamp(2.25rem,5vw,4.1rem)]">
              Malipo rahisi kwa <br className="hidden sm:inline" />
              biashara Tanzania.
            </h1>
            <p className="mt-8 max-w-[34rem] text-base sm:text-lg font-semibold leading-[1.5] text-white">
              Connect to every major Tanzanian mobile money network through one integration.
              Collect payments faster, send payouts, and keep customers updated without managing
              four different providers.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/contact?country=Tanzania">
                <Button className="h-[3.1rem] px-7 rounded-md bg-[#3BBA93] hover:bg-[#32a481] text-white text-base font-bold shadow-none">
                  Contact Us
                </Button>
              </Link>
              <Link to="/contact?country=Tanzania&inquiry=pricing">
                <Button className="h-[3.1rem] px-7 rounded-md bg-transparent border border-[#3BBA93] text-[#3BBA93] hover:bg-[#3BBA93]/10 text-base font-bold shadow-none">
                  View Tanzania Pricing
                </Button>
              </Link>
            </div>
          </div>

          {/* Framed hero panel */}
          <div className="hidden lg:block aspect-[0.92/1] w-full max-w-[26rem] justify-self-end overflow-hidden rounded-3xl border border-[#3BBA93]/50 shadow-2xl">
            <TanzaniaHeroVisual />
          </div>
        </div>
      </section>

      {/* 2 — ONE PLATFORM FOR ALL YOUR PAYMENT NEEDS */}
      <section className="py-16 sm:py-20 px-4 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <h2 className="font-extrabold tracking-tight leading-[1.15] text-3xl sm:text-4xl md:text-[44px] text-[#2A292D]">
            <span className="text-[#3BBA93]">One Platform</span> for all your <br />
            payment needs
          </h2>
          <p className="mt-6 text-base sm:text-lg font-semibold leading-relaxed text-[#2A292D]/85">
            Most African mobile money markets are dominated by one operator. Tanzania has four: Tigo
            Pesa, Vodacom M-Pesa, Airtel Money and Halopesa. Your customers will pay through whichever
            one they already use, and your business needs to accept all of them without four
            separate integrations and four separate reconciliation processes. AvadaPay connects to
            all four through one API, with collections, payouts, and SMS on the same platform.
          </p>
        </div>

        {/* Coastal Tanzania Image Banner */}
        <div className="w-full max-w-5xl mx-auto overflow-hidden rounded-2xl border border-gray-100 shadow-md">
          <img
            src="/media/tanzania-coast.jpg"
            alt="Dar es Salaam coastal cityscape with blue ocean"
            className="w-full h-auto object-cover max-h-[500px]"
          />
        </div>
      </section>

      {/* 3 — 4 TELCOS ROW & 3 NUMBERED CARDS */}
      <section className="py-14 sm:py-18 px-4 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <h2 className="font-extrabold tracking-tight leading-[1.15] text-3xl sm:text-4xl md:text-[44px] text-[#2A292D]">
            <span className="text-[#3BBA93]">One Platform</span> for all your <br />
            payment needs
          </h2>
        </div>

        {/* Telecom Operator Logos Row */}
        <div className="max-w-4xl mx-auto mb-14 px-4">
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 md:gap-16 py-3">
            {/* 1: Airtel */}
            <div className="flex items-center gap-2.5 transition-transform hover:scale-105 duration-200">
              <svg className="w-8 h-8 sm:w-9 sm:h-9 shrink-0" viewBox="0 0 36 36" fill="none">
                <circle cx="18" cy="18" r="17" fill="#ED1C24" />
                <path
                  d="M12 22C11 18.5 13 14 17.5 12.5C21.5 11 25 13 25 16.5C25 20 22 21.8 19 21.8C16.8 21.8 15.5 20.8 15.5 19C15.5 17.2 17 16 18.5 16"
                  stroke="white"
                  strokeWidth="2.8"
                  strokeLinecap="round"
                />
              </svg>
              <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#ED1C24] lowercase font-sans">
                airtel
              </span>
            </div>

            {/* 2: Halopesa */}
            <div className="flex items-center gap-2 transition-transform hover:scale-105 duration-200">
              <svg className="w-8 h-8 sm:w-9 sm:h-9 shrink-0" viewBox="0 0 36 36" fill="none">
                <circle cx="10" cy="18" r="5" fill="#FF6000" />
                <path
                  d="M16 9C21 12 21 24 16 27"
                  stroke="#FF6000"
                  strokeWidth="3.8"
                  strokeLinecap="round"
                />
              </svg>
              <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#FF6000] lowercase font-sans">
                halopesa
              </span>
            </div>

            {/* 3: Vodacom */}
            <div className="flex items-center gap-2.5 transition-transform hover:scale-105 duration-200">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#E60000] flex items-center justify-center text-white font-black text-2xl leading-none select-none shadow-xs">
                ”
              </div>
              <span className="text-2xl sm:text-3xl font-bold tracking-tight text-[#E60000] lowercase font-sans">
                vodacom
              </span>
            </div>

            {/* 4: Tigo Money */}
            <div className="flex items-center gap-1.5 transition-transform hover:scale-105 duration-200">
              <span className="text-2xl sm:text-3xl font-black italic tracking-tight text-[#00377B] lowercase font-sans">
                tigo<span className="font-extrabold text-[#00A1DE]">money</span>
              </span>
              <svg className="w-6 h-6 sm:w-7 sm:h-7 shrink-0 -rotate-6" viewBox="0 0 24 24" fill="none">
                <path d="M3 19L9 5L12 5L6 19Z" fill="#00377B" />
                <path d="M9 19L15 5L18 5L12 19Z" fill="#008FD5" />
                <path d="M15 19L20 7L23 7L18 19Z" fill="#29C5F6" />
              </svg>
            </div>
          </div>
        </div>

        {/* 3 Numbered White Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-7 max-w-6xl mx-auto">
          {threeCards.map((card) => (
            <div
              key={card.n}
              className="bg-white rounded-3xl p-7 sm:p-8 border border-gray-100 shadow-[0_6px_20px_rgba(0,0,0,0.04)] flex flex-col justify-between hover:border-[#3BBA93]/40 transition-colors"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#E3F5EE] text-[#3BBA93] flex items-center justify-center font-black text-base mb-6">
                  {card.n}
                </div>
                <h3 className="font-extrabold text-xl sm:text-[22px] leading-snug text-[#2A292D]">
                  {card.title}
                </h3>
                <ul className="mt-6 space-y-3 text-sm sm:text-base font-semibold text-[#2A292D]/85">
                  {card.points.map((pt, pIdx) => (
                    <li key={pIdx} className="flex items-start space-x-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#3BBA93] mt-2 shrink-0" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4 — REAL-TIME VISIBILITY FOR EVERY PAYMENT FLOW */}
      <section className="py-16 sm:py-20 px-4 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-14">
          <h2 className="font-extrabold tracking-tight leading-[1.15] text-3xl sm:text-4xl md:text-[44px] text-[#2A292D]">
            <span className="text-[#3BBA93]">Real-time visibility</span> for every <br />
            payment flow
          </h2>
          <p className="mt-6 text-base sm:text-lg font-semibold leading-relaxed text-[#2A292D]/85">
            When your business handles payments across multiple networks, visibility matters as much
            as collection. AvadaPay gives your team a single dashboard for collections, payouts,
            settlement status and customer communication, across every operator.
          </p>
        </div>

        {/* Dashboard Preview Container */}
        <div className="max-w-5xl mx-auto bg-white rounded-3xl border border-[#3BBA93]/35 shadow-[0_10px_30px_rgba(0,0,0,0.06)] overflow-hidden">
          <div className="bg-[#2A292D] px-6 py-4 flex flex-wrap items-center justify-between gap-4 text-white">
            <div className="flex items-center space-x-3">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Live Transaction Monitor
              </span>
              <span className="bg-[#3BBA93]/20 text-[#3BBA93] text-xs font-bold px-2.5 py-0.5 rounded-full">
                Dar es Salaam Hub
              </span>
            </div>
            <div className="flex items-center space-x-2 text-xs text-gray-400 font-semibold">
              <Filter className="w-3.5 h-3.5" />
              <span>All 4 Telcos Filtered</span>
            </div>
          </div>

          <div className="p-6 sm:p-8">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-100 text-xs font-bold text-gray-400 uppercase">
                    <th className="pb-3">Reference</th>
                    <th className="pb-3">Network</th>
                    <th className="pb-3">Type</th>
                    <th className="pb-3">Amount</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 text-right">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 font-semibold text-[#2A292D]">
                  <tr className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-3.5 font-mono text-xs">TZ-VP-99412</td>
                    <td>
                      <span className="inline-flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#E60000]" /> Vodacom M-Pesa
                      </span>
                    </td>
                    <td>C2B Collection</td>
                    <td className="font-bold">TZS 250,000</td>
                    <td>
                      <span className="bg-[#E3F5EE] text-[#3BBA93] text-xs px-2.5 py-1 rounded-full font-bold">
                        Completed
                      </span>
                    </td>
                    <td className="text-right text-xs text-gray-500">Just now</td>
                  </tr>
                  <tr className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-3.5 font-mono text-xs">TZ-TP-99411</td>
                    <td>
                      <span className="inline-flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#00A1DE]" /> Tigo Pesa
                      </span>
                    </td>
                    <td>Batch Payout</td>
                    <td className="font-bold">TZS 1,840,000</td>
                    <td>
                      <span className="bg-[#E3F5EE] text-[#3BBA93] text-xs px-2.5 py-1 rounded-full font-bold">
                        Processed
                      </span>
                    </td>
                    <td className="text-right text-xs text-gray-500">2m ago</td>
                  </tr>
                  <tr className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-3.5 font-mono text-xs">TZ-AM-99410</td>
                    <td>
                      <span className="inline-flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#ED1C24]" /> Airtel Money
                      </span>
                    </td>
                    <td>API STK Flow</td>
                    <td className="font-bold">TZS 85,000</td>
                    <td>
                      <span className="bg-[#E3F5EE] text-[#3BBA93] text-xs px-2.5 py-1 rounded-full font-bold">
                        Completed
                      </span>
                    </td>
                    <td className="text-right text-xs text-gray-500">5m ago</td>
                  </tr>
                  <tr className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-3.5 font-mono text-xs">TZ-HP-99409</td>
                    <td>
                      <span className="inline-flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#FF8200]" /> HaloPesa
                      </span>
                    </td>
                    <td>Payment Link</td>
                    <td className="font-bold">TZS 32,500</td>
                    <td>
                      <span className="bg-[#E3F5EE] text-[#3BBA93] text-xs px-2.5 py-1 rounded-full font-bold">
                        Completed
                      </span>
                    </td>
                    <td className="text-right text-xs text-gray-500">11m ago</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* 5 — WHY TANZANIAN BUSINESSES CHOOSE AVADAPAY */}
      <section className="py-14 sm:py-18 px-4 max-w-6xl mx-auto">
        <h2 className="text-center font-extrabold tracking-tight leading-[1.15] text-3xl sm:text-4xl md:text-[44px] text-[#2A292D] mb-12 sm:mb-14">
          <span className="text-[#3BBA93]">Why Tanzanian businesses</span> <br />
          choose AvadaPay
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

        {/* Dar es Salaam Office Section */}
        <div className="mt-16 sm:mt-20 max-w-5xl mx-auto">
          <div className="h-72 sm:h-96 w-full rounded-3xl overflow-hidden border border-gray-200 shadow-md bg-gray-100">
            <iframe
              title="AvadaPay Tanzania Office — Dar es Salaam"
              src="https://www.google.com/maps?q=Dar+es+Salaam+Tanzania&output=embed"
              className="w-full h-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>

          <div className="mt-6">
            <h3 className="text-xl sm:text-2xl font-black text-[#2A292D]">Dar es Salaam</h3>
            <p className="mt-1.5 text-base font-semibold text-gray-600">
              Dar es Salaam, Tanzania, full address to confirm.
            </p>
            <div className="mt-4">
              <Link to="/contact?country=Tanzania&inquiry=meeting">
                <Button className="h-11 px-6 bg-[#3BBA93] hover:bg-[#32a481] text-white font-bold rounded-lg flex items-center space-x-2">
                  <span>Book a meeting</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
