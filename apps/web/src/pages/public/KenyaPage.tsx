import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CheckCircle2,
  ChevronUp,
  CreditCard,
  CodeXml,
  Link as LinkIcon,
  Smartphone,
  Users2,
  Tag,
  ClipboardCheck,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CountryFlag } from '@/components/CountryFlag';

/* ------------------------------------------------------------------ */
/* Accordion component                                                 */
/* ------------------------------------------------------------------ */

interface AccordionItem {
  title: string;
  body: string;
}

const SECTORS: AccordionItem[] = [
  {
    title: 'Microfinance & digital lenders',
    body: 'Disburse approved loans in batches directly to M-Pesa and Airtel Money wallets. Collect repayments via STK Push or Paybill with instant webhook notifications and automatic ledger reconciliation against borrower IDs.',
  },
  {
    title: 'E-commerce & online platforms',
    body: 'Accept mobile money and card payments at checkout with zero redirect friction. Customers complete M-Pesa PIN prompts immediately and receive an automated SMS order confirmation.',
  },
  {
    title: 'Gaming & betting platforms',
    body: 'Handle peak weekend traffic with high-throughput wallet deposits and real-time automated winnings payouts. Full regulatory compliance with Central Bank of Kenya guidelines.',
  },
  {
    title: 'Schools & institutions',
    body: 'Assign unique student admission numbers to Paybill payments. Eliminate bank slip paperwork with real-time fee payment verification and automated SMS receipts sent to parents.',
  },
  {
    title: 'Service businesses',
    body: 'Generate instant payment links for invoices, professional fees, or recurring retainer charges. Track unpaid vs completed invoices on a unified dashboard.',
  },
  {
    title: 'Merchants & retail stores',
    body: 'Equip retail counters with smart POS devices and dynamic QR codes that reconcile M-Pesa Till payments, card taps, and Airtel Money instantly into a single account.',
  },
];

/* ------------------------------------------------------------------ */
/* Hero Visual Component                                               */
/* ------------------------------------------------------------------ */

const KenyaHeroVisual: React.FC = () => (
  <div className="w-full h-full p-6 flex flex-col justify-between bg-gradient-to-br from-[#232226] via-[#2A292D] to-[#1E1D21] text-white">
    <div className="flex items-center justify-between border-b border-white/10 pb-4">
      <div className="flex items-center space-x-2.5">
        <CountryFlag country="kenya" className="w-6 h-4" />
        <span className="text-sm font-bold tracking-wide">Kenya Gateway</span>
      </div>
      <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#3BBA93] bg-[#3BBA93]/15 px-2.5 py-0.5 rounded-full">
        <span className="w-1.5 h-1.5 rounded-full bg-[#3BBA93] animate-pulse" />
        CBK Compliant
      </span>
    </div>

    {/* Live Stream Simulation */}
    <div className="space-y-3 my-auto py-2">
      <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-lg bg-[#3BBA93]/20 text-[#3BBA93] flex items-center justify-center font-black text-xs">
            MP
          </div>
          <div>
            <p className="text-xs font-bold text-white">M-Pesa STK Push</p>
            <p className="text-[10px] text-gray-400">Order #KE-8492 · +254 712 ***</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs font-black text-white">KES 14,500</p>
          <span className="text-[10px] text-[#3BBA93] font-bold">Success</span>
        </div>
      </div>

      <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-lg bg-[#ED1C24]/20 text-[#ED1C24] flex items-center justify-center font-black text-xs">
            AM
          </div>
          <div>
            <p className="text-xs font-bold text-white">Airtel Money Payout</p>
            <p className="text-[10px] text-gray-400">Batch Disbursement · 42 recipients</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs font-black text-white">KES 88,200</p>
          <span className="text-[10px] text-[#3BBA93] font-bold">Processed</span>
        </div>
      </div>

      <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-lg bg-[#3BBA93]/20 text-[#3BBA93] flex items-center justify-center">
            <CreditCard className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-bold text-white">Card Checkout</p>
            <p className="text-[10px] text-gray-400">Visa 3DS · Verified</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs font-black text-white">KES 6,350</p>
          <span className="text-[10px] text-[#3BBA93] font-bold">Settled</span>
        </div>
      </div>
    </div>

    <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-gray-400">
      <span>Nairobi Switch Status</span>
      <span className="text-[#3BBA93] font-mono font-bold">99.99% Uptime</span>
    </div>
  </div>
);

/* ------------------------------------------------------------------ */
/* Page Component                                                      */
/* ------------------------------------------------------------------ */

export const KenyaPage: React.FC = () => {
  const [openSector, setOpenSector] = useState<number | null>(null);

  const paymentPills = [
    {
      title: 'M-Pesa and Airtel',
      subtitle: 'Money collections',
      icon: (
        <div className="w-9 h-9 rounded-full bg-[#3BBA93] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
          <Smartphone className="w-4 h-4" />
        </div>
      ),
    },
    {
      title: 'STK Push, Paybill and',
      subtitle: 'Till Number support',
      icon: (
        <div className="w-9 h-9 rounded-full bg-[#3BBA93] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
          <span className="font-extrabold text-sm">$</span>
        </div>
      ),
    },
    {
      title: 'Card payment acceptance',
      subtitle: '(Visa, Mastercard)',
      icon: (
        <div className="w-9 h-9 rounded-full bg-[#3BBA93] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
          <CreditCard className="w-4 h-4" />
        </div>
      ),
    },
    {
      title: 'Payment links for remote,',
      subtitle: 'invoiced, or recurring payments',
      icon: (
        <div className="w-9 h-9 rounded-full bg-[#3BBA93] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
          <LinkIcon className="w-4 h-4" />
        </div>
      ),
    },
    {
      title: 'Website, app, and',
      subtitle: 'ecommerce integration',
      icon: (
        <div className="w-9 h-9 rounded-full bg-[#3BBA93] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
          <CodeXml className="w-4 h-4" />
        </div>
      ),
    },
    {
      title: 'Real-time payment',
      subtitle: 'confirmation',
      icon: (
        <div className="w-9 h-9 rounded-full bg-[#3BBA93] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
          <CheckCircle2 className="w-4 h-4" />
        </div>
      ),
    },
  ];

  return (
    <div className="bg-white text-[#2A292D] font-sans overflow-x-hidden">
      {/* 1 — HERO SECTION */}
      <section className="bg-[#2A292D] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 pb-16 sm:pb-24 grid lg:grid-cols-[1.3fr_1fr] gap-10 lg:gap-14 items-center">
          <div className="lg:pl-8">
            <h1 className="font-extrabold tracking-tight leading-[1.1] text-[clamp(2.25rem,5vw,4.1rem)]">
              Payments bila stress <br className="hidden sm:inline" />
              for Kenyan <br className="hidden sm:inline" />
              businesses.
            </h1>
            <p className="mt-8 max-w-[34rem] text-base sm:text-lg font-semibold leading-[1.5] text-white">
              Accept M-Pesa, Airtel Money and card payments. Send payouts to agents and customers.
              Reach your customers by SMS. All from one platform, with a local office in Nairobi.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/contact?country=Kenya">
                <Button className="h-[3.1rem] px-7 rounded-md bg-[#3BBA93] hover:bg-[#32a481] text-white text-base font-bold shadow-none">
                  Contact Us
                </Button>
              </Link>
              <Link to="/contact?country=Kenya&inquiry=pricing">
                <Button className="h-[3.1rem] px-7 rounded-md bg-transparent border border-[#3BBA93] text-[#3BBA93] hover:bg-[#3BBA93]/10 text-base font-bold shadow-none">
                  View Kenya Pricing
                </Button>
              </Link>
            </div>
          </div>

          {/* Framed hero panel */}
          <div className="hidden lg:block aspect-[0.92/1] w-full max-w-[26rem] justify-self-end overflow-hidden rounded-3xl border border-[#3BBA93]/50 shadow-2xl">
            <KenyaHeroVisual />
          </div>
        </div>
      </section>

      {/* 2 — BUILT FOR HOW KENYA ACTUALLY PAYS */}
      <section className="py-16 sm:py-20 px-4 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <h2 className="font-extrabold tracking-tight leading-[1.15] text-3xl sm:text-4xl md:text-[44px] text-[#2A292D]">
            Built for how <span className="text-[#3BBA93]">Kenya actually pays</span>
          </h2>
          <p className="mt-6 text-base sm:text-lg font-semibold leading-relaxed text-[#2A292D]/85">
            Collect payment in your customers preferred payment methods then send an instant
            confirmation and an SMS receipt. Whether you run an online platform, a school, a
            microfinance institution, a retail business, or a service company, AvadaPay handles the
            collection, the disbursement, the customer notification, and the reconciliation.
          </p>
        </div>

        {/* Nairobi Skyline Banner */}
        <div className="w-full max-w-5xl mx-auto overflow-hidden rounded-2xl border border-gray-100 shadow-md">
          <img
            src="/media/nairobi-skyline.jpg"
            alt="Nairobi City Skyline"
            className="w-full h-auto object-cover max-h-[460px]"
          />
        </div>
      </section>

      {/* 3 — COLLECT PAYMENTS PILLS SECTION */}
      <section className="py-14 sm:py-18 px-4 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-14">
          <h2 className="font-extrabold tracking-tight leading-[1.15] text-3xl sm:text-4xl md:text-[44px] text-[#2A292D]">
            <span className="text-[#3BBA93]">Collect payments</span> every way <br />
            your customers want to pay
          </h2>
        </div>

        {/* 6 Pills (2 rows of 3 on desktop) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 max-w-5xl mx-auto">
          {paymentPills.map((pill, idx) => (
            <div
              key={idx}
              className="flex items-center space-x-3.5 bg-white rounded-2xl sm:rounded-full border border-gray-100 px-5 py-3.5 shadow-[0_4px_16px_rgba(0,0,0,0.06)] hover:border-[#3BBA93]/40 transition-colors"
            >
              {pill.icon}
              <div className="text-sm font-bold text-[#2A292D] leading-snug">
                <div>{pill.title}</div>
                <div className="text-gray-500 font-semibold">{pill.subtitle}</div>
              </div>
            </div>
          ))}
        </div>

        {/* 2 Feature Cards Side-by-Side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 max-w-5xl mx-auto mt-16 sm:mt-20">
          {/* Card 1: Pay agents */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_6px_20px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col">
            <div className="overflow-hidden bg-gray-100">
              <img
                src="/media/kenya-pay-agents.jpg"
                alt="Pay agents and suppliers"
                className="w-full h-[280px] sm:h-[320px] object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-8 sm:p-10 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-extrabold text-2xl sm:text-[26px] leading-tight text-[#2A292D]">
                  <span className="text-[#3BBA93]">Pay agents, suppliers, employees</span> <br />
                  and customers in batches
                </h3>
                <ul className="mt-6 space-y-3 text-sm sm:text-base font-semibold text-[#2A292D]/85">
                  <li className="flex items-start space-x-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#3BBA93] mt-2 shrink-0" />
                    <span>M-Pesa and Airtel Money disbursements</span>
                  </li>
                  <li className="flex items-start space-x-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#3BBA93] mt-2 shrink-0" />
                    <span>Bulk payout processing through API or dashboard upload</span>
                  </li>
                  <li className="flex items-start space-x-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#3BBA93] mt-2 shrink-0" />
                    <span>Real-time payout status and retry logic</span>
                  </li>
                  <li className="flex items-start space-x-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#3BBA93] mt-2 shrink-0" />
                    <span>Automatic reconciliation to your own reference fields</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Card 2: Bulk SMS */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_6px_20px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col">
            <div className="overflow-hidden bg-gray-100">
              <img
                src="/media/kenya-sms-comm.jpg"
                alt="Communicate with customers via Bulk SMS"
                className="w-full h-[280px] sm:h-[320px] object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-8 sm:p-10 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-extrabold text-2xl sm:text-[26px] leading-tight text-[#2A292D]">
                  <span className="text-[#3BBA93]">Communicate</span> with your <br />
                  customers with bulk sms
                </h3>
                <ul className="mt-6 space-y-3 text-sm sm:text-base font-semibold text-[#2A292D]/85">
                  <li className="flex items-start space-x-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#3BBA93] mt-2 shrink-0" />
                    <span>Transactional alerts and instant payment confirmations</span>
                  </li>
                  <li className="flex items-start space-x-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#3BBA93] mt-2 shrink-0" />
                    <span>Direct telco routing across Safaricom, Airtel and Telkom</span>
                  </li>
                  <li className="flex items-start space-x-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#3BBA93] mt-2 shrink-0" />
                    <span>Registered Sender ID compliant with CAK guidelines</span>
                  </li>
                  <li className="flex items-start space-x-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#3BBA93] mt-2 shrink-0" />
                    <span>Live delivery receipts with per-message status logging</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4 — BUILT FOR KENYAN BUSINESSES ACCORDION */}
      <section className="py-16 sm:py-20 px-4 max-w-5xl mx-auto">
        <h2 className="text-center font-extrabold tracking-tight leading-[1.15] text-3xl sm:text-4xl md:text-[44px] text-[#3BBA93] mb-12 sm:mb-14">
          Built for Kenyan businesses
        </h2>

        <div className="space-y-4 max-w-4xl mx-auto">
          {SECTORS.map((item, index) => {
            const isOpen = openSector === index;
            return (
              <div
                key={item.title}
                className="rounded-2xl border border-[#3BBA93]/40 bg-white shadow-[0_4px_12px_rgba(0,0,0,0.03)] hover:border-[#3BBA93] transition-colors overflow-hidden"
              >
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setOpenSector(isOpen ? null : index)}
                  className="w-full h-[4.75rem] px-8 flex items-center justify-between text-left text-lg font-extrabold text-[#2A292D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3BBA93]"
                >
                  <span>{item.title}</span>
                  <ChevronUp
                    className={`w-5 h-5 shrink-0 text-gray-500 transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                <div
                  className={`grid transition-all duration-300 ease-in-out ${
                    isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="px-8 pb-6 text-base leading-relaxed font-semibold text-[#2A292D]/85">
                      {item.body}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5 — 4 BENEFIT CARDS */}
      <section className="py-16 sm:py-20 px-4 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="rounded-2xl border border-[#3BBA93]/35 bg-white p-7 shadow-[0_6px_18px_rgba(0,0,0,0.04)] flex flex-col justify-between hover:border-[#3BBA93] transition-colors">
            <div>
              <div className="w-11 h-11 rounded-xl bg-[#E3F5EE] text-[#3BBA93] flex items-center justify-center mb-6">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-lg text-[#2A292D]">Instant confirmation</h3>
              <p className="mt-3 text-sm font-semibold text-[#2A292D]/80 leading-relaxed">
                Know the moment a customer pays, so you can ship, deliver, or unlock access right away.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-[#3BBA93]/35 bg-white p-7 shadow-[0_6px_18px_rgba(0,0,0,0.04)] flex flex-col justify-between hover:border-[#3BBA93] transition-colors">
            <div>
              <div className="w-11 h-11 rounded-xl bg-[#E3F5EE] text-[#3BBA93] flex items-center justify-center mb-6">
                <Users2 className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-lg text-[#2A292D]">Local team, local office</h3>
              <p className="mt-3 text-sm font-semibold text-[#2A292D]/80 leading-relaxed">
                Quick, reliable support from a team based in Nairobi.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-[#3BBA93]/35 bg-white p-7 shadow-[0_6px_18px_rgba(0,0,0,0.04)] flex flex-col justify-between hover:border-[#3BBA93] transition-colors">
            <div>
              <div className="w-11 h-11 rounded-xl bg-[#E3F5EE] text-[#3BBA93] flex items-center justify-center mb-6">
                <Tag className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-lg text-[#2A292D]">
                Pricing that matches your volume
              </h3>
              <p className="mt-3 text-sm font-semibold text-[#2A292D]/80 leading-relaxed">
                Competitive rates with tiers that improve as your business grows.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-[#3BBA93]/35 bg-white p-7 shadow-[0_6px_18px_rgba(0,0,0,0.04)] flex flex-col justify-between hover:border-[#3BBA93] transition-colors">
            <div>
              <div className="w-11 h-11 rounded-xl bg-[#E3F5EE] text-[#3BBA93] flex items-center justify-center mb-6">
                <ClipboardCheck className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-lg text-[#2A292D]">Fast onboarding</h3>
              <p className="mt-3 text-sm font-semibold text-[#2A292D]/80 leading-relaxed">
                KYC to first transaction in days, not months.
              </p>
            </div>
          </div>
        </div>

        {/* Nairobi Office Section */}
        <div className="mt-16 sm:mt-20 max-w-5xl mx-auto">
          <div className="h-72 sm:h-96 w-full rounded-3xl overflow-hidden border border-gray-200 shadow-md bg-gray-100">
            <iframe
              title="AvadaPay Kenya Office — Westpark Towers, Nairobi"
              src="https://www.google.com/maps?q=Westpark+Towers+Westlands+Nairobi+Kenya&output=embed"
              className="w-full h-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
          <div className="mt-6">
            <h3 className="text-xl sm:text-2xl font-black text-[#2A292D]">Nairobi</h3>
            <p className="mt-1.5 text-base font-semibold text-gray-600">
              8th Floor, Westpark Towers, Westlands, Nairobi.
            </p>
            <div className="mt-4">
              <Link to="/contact?country=Kenya&inquiry=meeting">
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
