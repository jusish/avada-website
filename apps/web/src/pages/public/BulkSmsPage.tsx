import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  RefreshCw,
  Lock,
  Calendar,
  Megaphone,
  Bell,
  Zap,
  CheckCircle2,
  ChevronDown,
} from 'lucide-react';
import { AccordionList, G, ProductHero, SectionTitle } from '@/components/product/shared';
import { Button } from '@/components/ui/button';
import {
  CircleKenya,
  CircleDRC,
  CircleTanzania,
  CircleRwanda,
  CircleUganda,
} from '@/components/home/CircleFlags';

/* ------------------------------------------------------------------ */
/* 6 Types of Messages                                                */
/* ------------------------------------------------------------------ */

const MESSAGE_TYPES = [
  {
    title: 'Transactional SMS',
    Icon: RefreshCw,
    desc: 'Payment confirmations, order status, delivery updates, account changes. Real-time, route-prioritized, with delivery reports.',
    highlight: false,
  },
  {
    title: 'OTPs & two-factor',
    Icon: Lock,
    desc: 'Account verification, password resets, transaction confirmations. Sub-second routing on most networks.',
    highlight: true,
  },
  {
    title: 'Reminders',
    Icon: Calendar,
    desc: 'Loan repayments, school fees, subscription renewals, appointment confirmations.',
    highlight: false,
  },
  {
    title: 'Marketing campaigns',
    Icon: Megaphone,
    desc: 'Promotions, product launches, customer re-engagement. Scheduled, segmented, and reportable.',
    highlight: false,
  },
  {
    title: 'Service notifications',
    Icon: Bell,
    desc: 'Outages, policy updates, KYC requests, and any operational message your customer base needs to receive.',
    highlight: false,
  },
  {
    title: 'Payments + SMS',
    Icon: Zap,
    desc: 'Trigger an SMS the moment a payment lands. No new integration required.',
    highlight: false,
  },
];

/* ------------------------------------------------------------------ */
/* 5 Photo Cards: Why Teams Use AvadaPay SMS                           */
/* ------------------------------------------------------------------ */

const WHY_CARDS = [
  {
    title: 'Multi-network coverage',
    body: 'Every major operator across Africa, with smart routing that picks the most reliable path.',
    img: '/media/bs_network.jpg',
  },
  {
    title: 'Volume pricing for scale',
    body: 'Tiered rates that improve as your volumes grow.',
    img: '/media/bs_volume.jpg',
  },
  {
    title: 'Delivery reports',
    body: 'Per-message status, retry logic, and dashboard views of campaign performance.',
    img: '/media/bs_reports.jpg',
  },
  {
    title: 'Tied to payments',
    body: 'Same API can trigger an SMS the moment a transaction completes.',
    img: '/media/nfc_payment.jpg',
  },
  {
    title: 'Easy to integrate',
    body: 'Push campaigns from your CRM or marketing platform through AvadaPay API.',
    img: '/media/bs_integrate.jpg',
  },
];

/* ------------------------------------------------------------------ */
/* Use Cases By Industry                                               */
/* ------------------------------------------------------------------ */

const SMS_INDUSTRIES = [
  {
    title: 'Banking & fintech',
    body: 'Deliver sub-second OTPs for logins and 3DS auth, instant debit/credit balance alerts, and suspicious activity notifications.',
  },
  {
    title: 'Lending & SACCOs',
    body: 'Automated repayment reminders 3 days before due date, loan approval notifications, and receipt confirmations when wallet repayments clear.',
  },
  {
    title: 'E-commerce',
    body: 'Dispatch tracking updates, driver-assigned SMS with delivery PINs, abandoned cart reminders, and flash sale notifications.',
  },
  {
    title: 'Education',
    body: 'Fee balance statements to parents, term date announcements, report card availability alerts, and urgent school notices.',
  },
  {
    title: 'Healthcare',
    body: 'Prescription refill reminders, clinic appointment confirmations, lab test result alerts, and wellness campaign broadcasts.',
  },
  {
    title: 'Retail',
    body: 'Loyalty point balance updates, VIP discount codes, store opening alerts, and digital receipt delivery at checkout.',
  },
  {
    title: 'Government & NGOs',
    body: 'Emergency public safety bulletins, subsidy disbursement confirmations, polling notifications, and citizen outreach campaigns.',
  },
];

/* ------------------------------------------------------------------ */
/* Calculator Country Data                                             */
/* ------------------------------------------------------------------ */

interface CalculatorCountry {
  code: string;
  name: string;
  currency: string;
  Flag: React.FC<{ className?: string }>;
  baseRate: number; // per SMS
}

const COUNTRIES: CalculatorCountry[] = [
  { code: 'KE', name: 'Kenya', currency: 'KES', Flag: CircleKenya, baseRate: 0.5 },
  { code: 'CD', name: 'DR Congo', currency: 'CDF', Flag: CircleDRC, baseRate: 35.0 },
  { code: 'TZ', name: 'Tanzania', currency: 'TZS', Flag: CircleTanzania, baseRate: 18.0 },
  { code: 'RW', name: 'Rwanda', currency: 'RWF', Flag: CircleRwanda, baseRate: 9.5 },
  { code: 'UG', name: 'Uganda', currency: 'UGX', Flag: CircleUganda, baseRate: 36.0 },
];

const VOLUME_PRESETS = [50000, 100000, 250000, 500000, 1000000];

export const BulkSmsPage: React.FC = () => {
  const [selectedCountry, setSelectedCountry] = useState<CalculatorCountry>(COUNTRIES[0]);
  const [volume, setVolume] = useState<number>(250000);
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);

  // Volume discount tier calculation
  const getRate = (country: CalculatorCountry, vol: number) => {
    let multiplier = 1.0;
    if (vol >= 1000000) multiplier = 0.8;
    else if (vol >= 500000) multiplier = 0.88;
    else if (vol >= 250000) multiplier = 0.95;
    const rate = country.baseRate * multiplier;
    return country.currency === 'CDF' || country.currency === 'TZS' || country.currency === 'UGX'
      ? rate.toFixed(1)
      : rate.toFixed(2);
  };

  const currentRate = getRate(selectedCountry, volume);
  const totalCost = (parseFloat(currentRate) * volume).toLocaleString(undefined, {
    maximumFractionDigits: 0,
  });

  return (
    <div className="bg-white text-[#2A292D] font-sans overflow-x-hidden">
      {/* 1 — HERO SECTION */}
      <ProductHero
        title={
          <>
            SMS that reaches
            <br />
            <G>every African</G>
            <br />
            <G>customer</G>, every time.
          </>
        }
        description="Send OTPs, transaction alerts, reminders, and marketing campaigns across every major mobile network in Africa, through one platform, one API, one set of delivery reports with AvadaPay"
        actions={[{ label: 'Contact Us', to: '/contact?inquiry=sms', variant: 'solid' }]}
        media={
          <div className="w-full h-full bg-[#1E1D20] p-6 flex flex-col justify-between">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                SMS Gateway Dispatch Live
              </span>
              <span className="inline-flex items-center text-[10px] text-[#3BBA93] font-mono bg-[#3BBA93]/10 px-2.5 py-1 rounded">
                Latency &lt; 1.8s
              </span>
            </div>

            <div className="space-y-3 font-mono text-xs py-2">
              <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 space-y-1">
                <div className="flex justify-between text-[11px] text-[#3BBA93] font-bold">
                  <span>From: AVADAPAY</span>
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Delivered
                  </span>
                </div>
                <p className="text-gray-200">
                  Your verification OTP is 849201. Valid for 10 minutes.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 space-y-1">
                <div className="flex justify-between text-[11px] text-[#3BBA93] font-bold">
                  <span>From: AVADAPAY</span>
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Delivered
                  </span>
                </div>
                <p className="text-gray-200">
                  Payment of KES 2,500.00 to Merchant confirmed. Ref: #AP-99218
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-white/10 text-[11px] text-gray-400 flex items-center justify-between">
              <span>Telco Direct: Safaricom, MTN, Airtel, Vodacom</span>
              <span className="w-2.5 h-2.5 rounded-full bg-[#3BBA93] animate-pulse" />
            </div>
          </div>
        }
      />

      {/* 2 — EVERY MESSAGE YOUR BUSINESS NEEDS TO SEND */}
      <section className="pt-16 sm:pt-20 px-4">
        <SectionTitle>
          <G>Every message your</G> business
          <br />
          needs to send
        </SectionTitle>
        <p className="mt-3 text-center text-gray-500 text-base max-w-xl mx-auto">
          High-throughput routing engineered for mission-critical enterprise notifications.
        </p>

        <div className="mt-12 mx-auto max-w-[69rem] grid grid-cols-1 md:grid-cols-3 border border-[#3BBA93]/30 rounded-3xl overflow-hidden divide-y md:divide-y-0 md:divide-x divide-[#3BBA93]/30 shadow-[0_8px_20px_rgba(0,0,0,0.04)]">
          {MESSAGE_TYPES.slice(0, 3).map((item) => (
            <div
              key={item.title}
              className={`p-8 sm:p-10 flex flex-col justify-between ${
                item.highlight ? 'bg-[#E3F5EE]/40' : 'bg-white'
              }`}
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#3BBA93]/15 text-[#3BBA93] flex items-center justify-center mb-6">
                  <item.Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-extrabold text-[#3BBA93]">{item.title}</h3>
                <p className="mt-3 text-sm sm:text-base leading-relaxed font-semibold text-[#2A292D]/85">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Row 2 */}
        <div className="mx-auto max-w-[69rem] grid grid-cols-1 md:grid-cols-3 border-x border-b border-[#3BBA93]/30 rounded-b-3xl overflow-hidden divide-y md:divide-y-0 md:divide-x divide-[#3BBA93]/30 shadow-[0_8px_20px_rgba(0,0,0,0.04)]">
          {MESSAGE_TYPES.slice(3, 6).map((item) => (
            <div
              key={item.title}
              className={`p-8 sm:p-10 flex flex-col justify-between ${
                item.highlight ? 'bg-[#E3F5EE]/40' : 'bg-white'
              }`}
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#3BBA93]/15 text-[#3BBA93] flex items-center justify-center mb-6">
                  <item.Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-extrabold text-[#3BBA93]">{item.title}</h3>
                <p className="mt-3 text-sm sm:text-base leading-relaxed font-semibold text-[#2A292D]/85">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3 — WHY TEAMS USE AVADAPAY SMS */}
      <section className="pt-20 sm:pt-24 px-4">
        <SectionTitle>
          Why teams use <G>AvadaPay SMS</G>
        </SectionTitle>

        {/* Row 1: 3 Photo Cards */}
        <div className="mt-12 mx-auto max-w-[69rem] grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {WHY_CARDS.slice(0, 3).map((card) => (
            <article key={card.title} className="group">
              <div className="aspect-[1.3/1] rounded-2xl overflow-hidden bg-gray-100 shadow-sm relative">
                <img
                  src={card.img}
                  alt={card.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <h3 className="mt-5 text-xl font-extrabold text-[#2A292D]">{card.title}</h3>
              <p className="mt-2 text-base leading-relaxed font-medium text-[#2A292D]/85">
                {card.body}
              </p>
            </article>
          ))}
        </div>

        {/* Row 2: 2 Photo Cards Centered */}
        <div className="mt-10 mx-auto max-w-[46rem] grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {WHY_CARDS.slice(3, 5).map((card) => (
            <article key={card.title} className="group">
              <div className="aspect-[1.3/1] rounded-2xl overflow-hidden bg-gray-100 shadow-sm relative">
                <img
                  src={card.img}
                  alt={card.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <h3 className="mt-5 text-xl font-extrabold text-[#2A292D]">{card.title}</h3>
              <p className="mt-2 text-base leading-relaxed font-medium text-[#2A292D]/85">
                {card.body}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* 4 — USE CASES BY INDUSTRY */}
      <section className="pt-20 sm:pt-24 px-4">
        <SectionTitle>
          <G>Use cases by industry</G>
        </SectionTitle>

        <AccordionList className="mt-12" items={SMS_INDUSTRIES} />
      </section>

      {/* 5 — INTERACTIVE SMS CALCULATOR */}
      <section className="pt-20 sm:pt-24 pb-20 sm:pb-28 px-4">
        <div className="mx-auto max-w-[69rem] grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Text */}
          <div className="lg:col-span-5 space-y-6">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-[1.15] text-[#2A292D]">
              See your SMS cost in seconds
            </h2>
            <p className="text-base sm:text-lg text-[#2A292D]/85 font-semibold leading-relaxed">
              Pick your country, enter your monthly volume, and see your blended per-SMS rate.
            </p>
            <div className="pt-2">
              <Link to="/contact?inquiry=sms">
                <Button className="bg-[#3BBA93] hover:bg-[#32a481] text-white font-bold px-8 h-12 rounded-lg text-base shadow-sm">
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Interactive Card */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl border border-[#3BBA93]/30 overflow-hidden shadow-2xl bg-white">
              {/* Top Mint Header with Country Picker */}
              <div className="bg-[#5BC4A5] p-6 text-white relative">
                <p className="text-xs font-bold uppercase tracking-wider text-white/90">
                  See our fees and coverage to:
                </p>

                <div className="mt-3 relative">
                  <div className="bg-white rounded-2xl p-3 flex items-center justify-between text-[#2A292D] shadow-md">
                    <div className="flex items-center gap-3">
                      <selectedCountry.Flag className="w-8 h-8 rounded-full" />
                      <span className="font-extrabold text-base">{selectedCountry.name}</span>
                    </div>

                    <div className="relative">
                      <Button
                        size="sm"
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        className="bg-[#3BBA93] hover:bg-[#32a481] text-white font-bold text-xs rounded-full px-4 h-8 flex items-center gap-1"
                      >
                        <span>Change</span>
                        <ChevronDown className="w-3.5 h-3.5" />
                      </Button>

                      {dropdownOpen && (
                        <div className="absolute right-0 top-10 mt-1 w-48 bg-white border border-gray-100 rounded-xl shadow-xl py-1 z-30 animate-in fade-in-0">
                          {COUNTRIES.map((c) => (
                            <button
                              key={c.code}
                              type="button"
                              onClick={() => {
                                setSelectedCountry(c);
                                setDropdownOpen(false);
                              }}
                              className="w-full px-3 py-2 text-left text-xs font-bold flex items-center gap-2.5 hover:bg-[#E3F5EE] text-[#2A292D] transition-colors"
                            >
                              <c.Flag className="w-5 h-5 rounded-full" />
                              <span>{c.name}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* White Calculator Body */}
              <div className="p-6 sm:p-8 space-y-6">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-[#2A292D]">Monthly Volume</span>
                    <span className="text-xs font-bold text-[#3BBA93] bg-[#E3F5EE] px-3 py-1 rounded-full border border-[#3BBA93]/30">
                      {selectedCountry.currency} {currentRate} / SMS
                    </span>
                  </div>

                  <p className="text-3xl sm:text-4xl font-extrabold text-[#2A292D] mt-2">
                    {volume.toLocaleString()}
                  </p>

                  {/* Volume Preset Chips */}
                  <div className="mt-4 flex flex-wrap gap-2">
                    {VOLUME_PRESETS.map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setVolume(p)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          volume === p
                            ? 'bg-[#3BBA93] text-white shadow-sm'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {p.toLocaleString()}
                      </button>
                    ))}
                  </div>

                  {/* Range Slider */}
                  <div className="mt-5">
                    <input
                      type="range"
                      min={10000}
                      max={2000000}
                      step={10000}
                      value={volume}
                      onChange={(e) => setVolume(parseInt(e.target.value, 10))}
                      className="w-full accent-[#3BBA93] cursor-pointer"
                    />
                    <div className="flex justify-between text-[11px] font-semibold text-gray-400 mt-1">
                      <span>10k SMS</span>
                      <span>1M SMS</span>
                      <span>2M+ SMS</span>
                    </div>
                  </div>
                </div>

                {/* Estimated Total Bar */}
                <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Estimated Monthly Spend
                    </p>
                    <p className="text-xl font-extrabold text-[#2A292D] mt-0.5">
                      {selectedCountry.currency} {totalCost}
                    </p>
                  </div>
                  <span className="text-xs text-gray-500">Tier: Scaled Enterprise</span>
                </div>

                {/* Light Green Note Box */}
                <div className="rounded-xl bg-[#E3F5EE]/70 border border-[#3BBA93]/30 p-4 text-xs font-semibold leading-relaxed text-[#2FA07E]">
                  If you already collect or send payments through AvadaPay, you can trigger an SMS
                  from the same API call. Confirm payments, notify failures, and reduce support
                  tickets without building anything new.
                </div>

                {/* Buy SMS Button */}
                <Link to={`/contact?inquiry=sms&country=${selectedCountry.name}&volume=${volume}`}>
                  <Button className="w-full bg-[#3BBA93] hover:bg-[#32a481] text-white font-bold h-12 rounded-xl text-base shadow-md">
                    Buy SMS
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BulkSmsPage;
