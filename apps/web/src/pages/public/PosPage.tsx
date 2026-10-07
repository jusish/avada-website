import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ArrowUpRight,
  Clock,
  Calendar,
  Layers,
  CheckCircle2,
  Lock,
  Code,
  Check,
} from 'lucide-react';
import { Marquee } from '@/components/Marquee';
import { AccordionList, G, ProductHero, SectionTitle } from '@/components/product/shared';
import { Button } from '@/components/ui/button';

/* ------------------------------------------------------------------ */
/* POS Payment Methods Sub-Strip                                       */
/* ------------------------------------------------------------------ */

const PAYMENT_METHODS = [
  'Debit cards',
  'Credit cards',
  'QR Payments',
  'Mobile money',
  'In person (cash) payments',
];

/* ------------------------------------------------------------------ */
/* Three Ways to Take Payments                                         */
/* ------------------------------------------------------------------ */

const POS_MODES = [
  {
    title: 'Soft POS',
    hrefIcon: ArrowUpRight,
    badge: 'Mobile App',
    img: '/media/pos_soft.jpg',
    description:
      'Turn any NFC-enabled Android phone into a payment terminal. No extra hardware. Live in 24–48 hours. Pay-as-you-transact.',
    bestFor:
      'Best for: SMEs, delivery teams, field agents, taxi operators, restaurants, growing retail.',
    actionLabel: 'Get Soft POS',
    to: '/contact?inquiry=soft_pos',
  },
  {
    title: 'Smart POS',
    hrefIcon: ArrowRight,
    badge: 'Hardware Terminal',
    img: '/media/pos_device.jpg',
    description:
      'Enterprise-grade Android POS with high-speed built-in thermal printer, 4G dual-SIM auto-switching, and 72-hour battery life.',
    bestFor:
      'Best for: Supermarkets, hotel chains, gas stations, hospitals, and high-frequency retailers.',
    actionLabel: 'Order POS Devices',
    to: '/contact?inquiry=smart_pos',
  },
  {
    title: 'Enterprise Payment APIs',
    hrefIcon: ArrowRight,
    badge: 'Direct Integration',
    img: '/media/pos_enterprise.jpg',
    description:
      'Integrate seamlessly into existing cash registers, Oracle/SAP ERPs, or custom in-house retail management software.',
    bestFor:
      'Best for: Multinationals, franchise networks, and fintech aggregator networks.',
    actionLabel: 'Consult Enterprise Team',
    to: '/contact?inquiry=enterprise_pos',
  },
];

/* ------------------------------------------------------------------ */
/* Industries Accordion Content                                        */
/* ------------------------------------------------------------------ */

const POS_INDUSTRIES = [
  {
    title: 'Retail',
    body: 'Supermarkets, fashion boutiques, electronics stores, and convenience shops take card and mobile money at checkout with automatic receipt printing and inventory reconciliation.',
  },
  {
    title: 'Hospitality',
    body: 'Restaurants, cafes, bars, and hotels accept payments table-side or at the counter, split bills seamlessly, and manage tips with fast next-day settlement.',
  },
  {
    title: 'Healthcare',
    body: 'Pharmacies, clinics, and diagnostic centers process patient co-pays, insurance settlements, and outpatient payments quickly and securely.',
  },
  {
    title: 'Education',
    body: 'Schools, universities, and training institutes collect tuition, fee installments, and exam registrations with instant parent/student digital receipts.',
  },
  {
    title: 'Transportation',
    body: 'Ride-hailing fleets, long-distance bus operators, toll gates, and delivery couriers use portable SoftPOS or 4G terminals for on-the-spot payments.',
  },
  {
    title: 'Government & NGOs',
    body: 'Public revenue authorities, county councils, aid distributions, and utility bill collections operate with audit-proof transaction tracking and role-based permissions.',
  },
];

/* ------------------------------------------------------------------ */
/* Dashboard Connected Pillars                                         */
/* ------------------------------------------------------------------ */

const PILLARS = [
  {
    title: 'Real-time monitoring',
    desc: 'Transaction view, sales reports, settlement reports, branch performance, and device status.',
  },
  {
    title: 'User & access management',
    desc: 'Role-based permissions for cashiers, branch managers, and head office.',
  },
  {
    title: 'Business intelligence',
    desc: 'Revenue trends, customer insights, and operational analytics.',
  },
];

/* ------------------------------------------------------------------ */
/* Timelines & Pricing Tables                                          */
/* ------------------------------------------------------------------ */

const TIMELINES = [
  {
    Icon: Clock,
    title: 'SoftPOS, 24–48 hours',
    desc: 'From approval to first transaction.',
    highlight: false,
  },
  {
    Icon: Calendar,
    title: 'Smart POS, 3–7 days',
    desc: 'Device provisioning and merchant activation.',
    highlight: true,
  },
  {
    Icon: Layers,
    title: 'Enterprise, project-based',
    desc: 'Timeline depends on systems and integration scope.',
    highlight: false,
  },
];

const PRICING_OPTIONS = [
  {
    title: 'SoftPOS',
    summary: 'From approval to first transaction.',
    detail: 'Pay-per-transaction pricing. No hardware lease, zero upfront capital expenditure.',
    highlight: false,
  },
  {
    title: 'Device POS',
    summary: 'Device provisioning and merchant activation.',
    detail: 'Flexible device purchase or rental models with competitive interchange and transaction rates.',
    highlight: false,
  },
  {
    title: 'Enterprise',
    summary: 'Timeline depends on systems and integration scope.',
    detail: 'Custom interchange, high-volume tier discounts, and dedicated account SLAs.',
    highlight: true,
  },
];

const SECURITY_ITEMS = [
  'PCI-compliant infrastructure',
  'Device authentication',
  'Role-based access controls',
  'Fraud monitoring',
  'Encrypted communications',
];

export const PosPage: React.FC = () => {
  return (
    <div className="bg-white text-[#2A292D] font-sans overflow-x-hidden">
      {/* 1 — HERO SECTION */}
      <ProductHero
        title={
          <>
            <G>One POS platform.</G>
            <br />
            Every way to get paid.
          </>
        }
        description="Turn any Android phone into a payment terminal with SoftPOS, deploy enterprise-grade POS devices, or integrate payment acceptance into your existing systems, all on one dashboard with AvadaPay POS."
        actions={[
          { label: 'Contact Us', to: '/contact?inquiry=pos', variant: 'outline' },
          { label: 'Request a POS Demo', to: '/contact?inquiry=pos_demo', variant: 'solid' },
        ]}
        media={
          <div className="w-full h-full bg-[#1E1D20] p-6 flex flex-col justify-between">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                AvadaPay POS Terminal Live
              </span>
              <span className="inline-flex items-center text-[10px] text-[#3BBA93] font-mono bg-[#3BBA93]/10 px-2.5 py-1 rounded">
                4G Dual-SIM Active
              </span>
            </div>
            <div className="text-center py-6">
              <p className="text-xs text-gray-400 uppercase tracking-wider">
                Awaiting Card or Phone Tap
              </p>
              <p className="text-3xl font-extrabold text-white mt-2">KES 4,850.00</p>
              <p className="text-xs text-[#3BBA93] mt-1 font-mono font-medium">
                Tap Card / Scan QR / M-Pesa
              </p>
            </div>
            <div className="pt-3 border-t border-white/10 text-[11px] text-gray-400 flex items-center justify-between">
              <span>Battery: 92% • High-Speed Thermal Print Ready</span>
              <span className="w-2.5 h-2.5 rounded-full bg-[#3BBA93] animate-pulse" />
            </div>
          </div>
        }
      >
        {/* Horizontal Payment Methods Sub-Strip */}
        <div className="border-t border-white/10 bg-[#1A191C]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 divide-y sm:divide-y-0 sm:divide-x divide-white/10 text-center text-xs sm:text-sm font-bold text-gray-300">
              {PAYMENT_METHODS.map((name) => (
                <div
                  key={name}
                  className="py-3.5 sm:py-4 px-3 flex items-center justify-center space-x-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#3BBA93]" />
                  <span>{name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </ProductHero>

      {/* 2 — THREE WAYS TO TAKE PAYMENTS */}
      <section className="pt-16 sm:pt-20 px-4">
        <SectionTitle>
          Three ways to take
          <br />
          payments. <G>One platform</G>
          <br />
          <G>behind all of them</G>
        </SectionTitle>

        <div className="mt-12 mx-auto max-w-[69rem] grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {POS_MODES.map((mode) => (
            <article
              key={mode.title}
              className="group rounded-3xl border border-[#3BBA93]/35 bg-white p-6 shadow-[0_10px_24px_rgba(0,0,0,0.06)] flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:border-[#3BBA93] hover:shadow-[0_14px_30px_rgba(59,186,147,0.18)]"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-extrabold text-[#2A292D] flex items-center gap-1.5">
                    <span>{mode.title}</span>
                    <mode.hrefIcon className="w-4 h-4 text-[#3BBA93] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </h3>
                  <span className="text-[11px] font-bold text-[#3BBA93] bg-[#E3F5EE] px-2.5 py-1 rounded-full">
                    {mode.badge}
                  </span>
                </div>

                <div className="aspect-[1.3/1] rounded-2xl overflow-hidden bg-gray-100 mb-6 relative">
                  <img
                    src={mode.img}
                    alt={mode.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                <p className="text-sm leading-relaxed font-semibold text-[#2A292D]/90">
                  {mode.description}
                </p>

                <p className="mt-4 text-xs font-medium text-gray-500 italic">
                  {mode.bestFor}
                </p>
              </div>

              <div className="mt-8 pt-5 border-t border-gray-100">
                <Link to={mode.to}>
                  <Button
                    variant="outline"
                    className="w-full border-[#3BBA93]/50 text-[#3BBA93] hover:bg-[#3BBA93] hover:text-white font-bold text-xs h-10 rounded-xl transition-colors"
                  >
                    {mode.actionLabel}
                  </Button>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 3 — HOW AFRICAN BUSINESSES USE AVADAPAY POS */}
      <section className="pt-20 sm:pt-24 px-4">
        <SectionTitle>
          How African businesses use
          <br />
          <G>AvadaPay POS</G>
        </SectionTitle>

        <AccordionList className="mt-12" items={POS_INDUSTRIES} />
      </section>

      {/* 4 — DASHBOARD ECOSYSTEM SECTION */}
      <section className="pt-20 sm:pt-24 px-4">
        <SectionTitle>
          Run every device, every branch,
          <br />
          <G>every transaction from one</G>
          <br />
          <G>dashboard</G>
        </SectionTitle>

        {/* Visual Schematic Diagram */}
        <div className="mt-12 mx-auto max-w-[69rem] rounded-3xl bg-[#1E1D20] p-6 sm:p-10 border border-white/10 shadow-2xl relative overflow-hidden">
          {/* Subtle Grid Background */}
          <div
            className="absolute inset-0 opacity-15"
            style={{
              backgroundImage: 'radial-gradient(#3BBA93 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />

          <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Left Ecosystem Column */}
            <div className="md:col-span-4 space-y-4">
              <div className="bg-[#2A292D] border border-white/10 rounded-2xl p-4 shadow-md">
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>Gross Sales</span>
                  <span className="text-[#3BBA93] font-bold">+18.4%</span>
                </div>
                <p className="text-2xl font-black text-white mt-1">2.3M CDF</p>
                <div className="h-1.5 w-full bg-white/10 rounded-full mt-3 overflow-hidden">
                  <div className="h-full bg-[#3BBA93] rounded-full w-3/4" />
                </div>
              </div>

              <div className="bg-[#2A292D] border border-white/10 rounded-2xl p-4 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <span className="w-8 h-8 rounded-full bg-[#3BBA93]/20 flex items-center justify-center text-[#3BBA93]">
                    <CheckCircle2 className="w-4 h-4" />
                  </span>
                  <div>
                    <p className="font-bold text-white">Your platform</p>
                    <p className="text-[11px] text-gray-400">POS checkout trigger</p>
                  </div>
                </div>
                <span className="font-mono text-[#3BBA93] bg-[#3BBA93]/10 px-2 py-1 rounded text-[10px]">
                  Pay 100.00 CDF
                </span>
              </div>
            </div>

            {/* Central Hub */}
            <div className="md:col-span-4 flex flex-col items-center justify-center text-center py-4">
              <div className="relative">
                <div className="w-28 h-28 rounded-full bg-[#3BBA93]/15 border-2 border-[#3BBA93] flex flex-col items-center justify-center shadow-lg shadow-[#3BBA93]/20 animate-pulse">
                  <span className="text-sm font-black text-white tracking-wider">AvadaPay</span>
                  <span className="text-[10px] text-[#3BBA93] font-mono mt-0.5">Core Engine</span>
                </div>
                {/* Connecting Lines */}
                <div className="hidden md:block absolute -left-12 top-1/2 -translate-y-1/2 w-12 border-t-2 border-dashed border-[#3BBA93]/50" />
                <div className="hidden md:block absolute -right-12 top-1/2 -translate-y-1/2 w-12 border-t-2 border-dashed border-[#3BBA93]/50" />
              </div>
              <p className="text-xs text-gray-400 mt-4 max-w-[200px]">
                Centralized settlements, real-time webhooks, multi-terminal controls
              </p>
            </div>

            {/* Right Ecosystem Column */}
            <div className="md:col-span-4 space-y-4">
              <div className="bg-[#2A292D] border border-white/10 rounded-2xl p-4 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <Code className="w-3.5 h-3.5 text-[#3BBA93]" /> API response
                  </span>
                  <span className="text-[10px] text-[#3BBA93] font-mono bg-[#3BBA93]/10 px-2 py-0.5 rounded">
                    200 OK
                  </span>
                </div>
                <pre className="text-[10px] font-mono text-gray-300 bg-black/40 p-2.5 rounded-lg overflow-x-auto">
{`{
  "merchant_id": "a0fecd91fc",
  "status": "APPROVED",
  "settlement": "CDF"
}`}
                </pre>
              </div>

              <div className="bg-[#2A292D] border border-white/10 rounded-2xl p-3 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-[#3BBA93]" />
                  <span className="text-white font-medium">PCI-DSS End-to-End Encrypted</span>
                </div>
                <Check className="w-4 h-4 text-[#3BBA93]" />
              </div>
            </div>
          </div>
        </div>

        {/* 3 Connected Pillars */}
        <div className="mt-12 mx-auto max-w-[69rem]">
          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Dotted horizontal connector on desktop */}
            <div className="hidden md:block absolute top-1/2 left-[18%] right-[18%] -translate-y-1/2 border-t-2 border-dashed border-[#3BBA93]/40 z-0 pointer-events-none" />

            {PILLARS.map((p) => (
              <article
                key={p.title}
                className="relative z-10 rounded-3xl border border-[#3BBA93]/45 bg-white p-7 shadow-[0_8px_20px_rgba(0,0,0,0.06)] hover:border-[#3BBA93] transition-colors"
              >
                <div className="w-2.5 h-2.5 rounded-full bg-[#3BBA93] mb-4" />
                <h3 className="text-xl font-extrabold text-[#2A292D]">{p.title}</h3>
                <p className="mt-3 text-sm leading-relaxed font-medium text-[#2A292D]/80">
                  {p.desc}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 5 — SECURITY TICKER MARQUEE */}
      <section className="mt-20 sm:mt-24 bg-[#D6F1E8] border-y border-[#3BBA93]/25 py-4.5 overflow-hidden">
        <Marquee animation="animate-marquee">
          <div className="flex items-center space-x-12 sm:space-x-16 px-6">
            {SECURITY_ITEMS.map((item) => (
              <span
                key={item}
                className="whitespace-nowrap text-sm sm:text-base md:text-lg font-extrabold text-[#2FA07E]"
              >
                {item}
              </span>
            ))}
          </div>
        </Marquee>
      </section>

      {/* 6 — PHOTO BANNER */}
      <section className="pt-16 sm:pt-20 px-4">
        <div className="mx-auto max-w-[69rem] aspect-[2.3/1] rounded-3xl overflow-hidden shadow-lg border border-gray-200">
          <img
            src="/media/report_reader.jpg"
            alt="AvadaPay Merchant Reviewing Reports"
            loading="lazy"
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* 7 — HOW FAST CAN YOU GO LIVE */}
      <section className="pt-20 sm:pt-24 px-4">
        <div className="mx-auto max-w-[69rem]">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#3BBA93] mb-8">
            How fast can you go live with AvadaPay POS?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 border border-[#3BBA93]/30 rounded-2xl overflow-hidden divide-y md:divide-y-0 md:divide-x divide-[#3BBA93]/30">
            {TIMELINES.map((t) => (
              <div
                key={t.title}
                className={`p-8 flex flex-col justify-between ${
                  t.highlight ? 'bg-[#E3F5EE]/40' : 'bg-white'
                }`}
              >
                <div>
                  <div className="w-12 h-12 rounded-full bg-[#3BBA93] text-white flex items-center justify-center mb-6 shadow-sm">
                    <t.Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-extrabold text-[#3BBA93]">{t.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed font-semibold text-[#2A292D]/85">
                    {t.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8 — PRICING OPTIONS THAT MATCH YOUR BUSINESS */}
      <section className="pt-16 sm:pt-20 pb-20 sm:pb-28 px-4">
        <div className="mx-auto max-w-[69rem]">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#3BBA93] mb-8">
            Pricing options that match your business
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 border border-[#3BBA93]/30 rounded-2xl overflow-hidden divide-y md:divide-y-0 md:divide-x divide-[#3BBA93]/30">
            {PRICING_OPTIONS.map((p) => (
              <div
                key={p.title}
                className={`p-8 flex flex-col justify-between ${
                  p.highlight ? 'bg-[#E3F5EE]/40' : 'bg-white'
                }`}
              >
                <div>
                  <h3 className="text-lg font-extrabold text-[#3BBA93]">{p.title}</h3>
                  <p className="mt-1 text-xs font-semibold text-gray-500">{p.summary}</p>
                  <p className="mt-4 text-sm leading-relaxed font-semibold text-[#2A292D]/85">
                    {p.detail}
                  </p>
                </div>
                <div className="mt-8 pt-4 border-t border-gray-200/60">
                  <Link to="/contact?inquiry=pos_pricing">
                    <Button
                      variant="outline"
                      className="w-full text-xs font-bold border-[#3BBA93] text-[#3BBA93] hover:bg-[#3BBA93] hover:text-white"
                    >
                      Inquire Rates
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default PosPage;
