import React from 'react';
import { CodeXml, FileSignature, MapPinned, Smartphone, CheckCircle2, User } from 'lucide-react';
import { Marquee } from '@/components/Marquee';
import { ROW_ONE, ROW_TWO } from '@/components/home/PartnerLogos';
import { AccordionList, G, ProductHero, SectionTitle } from '@/components/product/shared';

/* ------------------------------------------------------------------ */
/* Content                                                             */
/* ------------------------------------------------------------------ */

const METHODS = [
  {
    title: 'Mobile money collections',
    body: 'M-Pesa, Airtel Money, Orange Money, MTN MoMo, Vodacom, Moov, Tigo Pesa, Wave, Halopesa, T-Money, and more. STK Push, USSD, Paybill and Till Number support where applicable.',
    img: '/media/pp_mobile_money.jpg',
  },
  {
    title: 'Card processing',
    body: 'Visa, Mastercard, and supported local schemes. 3DS-ready checkout flows.',
    img: '/media/pp_card.jpg',
  },
  {
    title: 'Payment links',
    body: 'Generate single-use or reusable links for remote, recurring, or invoiced payments. No checkout build required.',
    img: '/media/pp_links.jpg',
  },
  {
    title: 'Real-time confirmation',
    body: 'Webhook callbacks the moment a payment lands. No polling.',
    img: '/media/nfc_payment.jpg',
  },
  {
    title: 'Multi-currency settlement',
    body: 'Receive in local currency or settle to crypto where regulation allows.',
    img: '/media/pp_multicurrency.jpg',
  },
  {
    title: 'Reporting & reconciliation',
    body: 'Search, filter, export. Match payments to orders, invoices, or customer IDs through your own reference field.',
    img: '/media/report_reader.jpg',
  },
];

const INDUSTRIES = [
  {
    title: 'E-commerce & marketplaces',
    body: 'Offer checkout with mobile money and cards in every market you sell into, and split settlements between sellers and your platform.',
  },
  {
    title: 'Lending & microfinance',
    body: 'Collect repayments straight from customer wallets with automatic reconciliation against loan accounts.',
  },
  {
    title: 'Schools & institutions',
    body: 'Let parents pay fees from any phone, with instant receipts and a clean ledger for every student.',
  },
  {
    title: 'Gaming & betting',
    body: 'Fast deposits and dependable payouts that keep up with peak-time volumes.',
  },
  {
    title: 'Subscription services',
    body: 'Recurring collections, reminders and retry logic, built for customers who pay by mobile money.',
  },
];

const WHY = [
  {
    Icon: Smartphone,
    title: 'Built mobile-money-first',
    body: 'Card-first PSPs treat mobile money as an afterthought. AvadaPay treats it as the spine.',
  },
  {
    Icon: FileSignature,
    title: 'One contract, multiple markets',
    body: 'Expand into a new African market without negotiating a new partner from scratch.',
  },
  {
    Icon: MapPinned,
    title: 'Real local presence',
    body: 'Offices and operations teams on the ground in Kenya, DRC, Tanzania and Rwanda.',
  },
  {
    Icon: CodeXml,
    title: 'Developer friendly',
    body: 'Clean documentation, sandbox access, predictable webhooks, and SDKs to match.',
  },
];

/* ------------------------------------------------------------------ */
/* "How it works" step visuals                                         */
/* ------------------------------------------------------------------ */

const StepCard: React.FC<React.PropsWithChildren<{ n: number; className?: string }>> = ({
  n,
  children,
  className = '',
}) => (
  <div className="relative">
    <span className="absolute -top-3 -left-3 z-10 w-10 h-10 rounded-full bg-[#3BBA93] text-white font-bold grid place-items-center shadow-md">
      {n}
    </span>
    <div
      className={`relative aspect-square overflow-hidden rounded-3xl shadow-[0_10px_24px_rgba(0,0,0,0.10)] ${className}`}
    >
      {children}
    </div>
  </div>
);

const OnboardVisual = () => (
  <StepCard n={1} className="bg-white p-6 flex flex-col gap-3">
    <div className="h-8 rounded-md bg-gray-100" />
    <div className="h-8 rounded-md bg-gray-100" />
    <div className="h-16 rounded-md bg-gray-100" />
    <div className="flex items-center gap-2 mt-1">
      <span className="w-4 h-4 rounded-sm bg-[#3BBA93] grid place-items-center">
        <CheckCircle2 className="w-3 h-3 text-white" />
      </span>
      <span className="h-3 w-2/5 rounded bg-gray-100" />
    </div>
    <div className="mt-auto h-12 rounded-xl bg-[#1FCB9B] text-white text-sm font-bold grid place-items-center">
      Submit
    </div>
  </StepCard>
);

const IntegrateVisual = () => (
  <StepCard n={2} className="bg-[#2A292D]">
    <pre className="absolute left-[34%] top-[16%] font-mono text-[10px] leading-[1.65] text-[#3BBA93] whitespace-pre">
      {`"merchant_id": "e0fecd91fc",
"customer_id": "0900000001",
"order_id": "162809549497",
"amount": "100.00",
"currency": "CDF",
"method": "MOBILE_MONEY",
"callback": "acme.com/hook",
"nonce": 0,
"sig": "d76b0e22"`}
    </pre>
    {/* Page-curl: the "checkout" sheet folding over the code */}
    <div
      className="absolute inset-0 bg-white"
      style={{ clipPath: 'polygon(0 0, 24% 0, 100% 100%, 0 100%)' }}
    >
      <div className="absolute left-[12%] top-[44%] h-3 w-[34%] rounded bg-gray-100" />
      <div className="absolute left-[12%] top-[56%] h-3 w-[44%] rounded bg-gray-100" />
      <div className="absolute left-[8%] right-[6%] bottom-[8%] h-12 rounded-xl bg-[#1FCB9B] text-white text-sm font-bold grid place-items-center">
        Checkout
      </div>
    </div>
  </StepCard>
);

const Person: React.FC<{ className?: string; tone: string }> = ({ className = '', tone }) => (
  <span
    className={`absolute w-12 h-12 rounded-xl grid place-items-center text-white shadow-sm ${tone} ${className}`}
  >
    <User className="w-6 h-6" />
  </span>
);

const GoLiveVisual = () => (
  <StepCard n={3} className="bg-white">
    <div
      className="absolute inset-0 opacity-70"
      style={{
        backgroundImage: 'radial-gradient(#D6F1E8 2px, transparent 2px)',
        backgroundSize: '16px 16px',
      }}
    />
    <svg viewBox="0 0 280 280" className="absolute inset-0 w-full h-full" aria-hidden="true">
      <g fill="none" stroke="#3BBA93" strokeWidth="1.2" strokeDasharray="4 4">
        <path d="M70 52 H140 V90" />
        <path d="M140 118 V160 H210" />
        <path d="M60 220 V170 H90" />
      </g>
    </svg>
    <Person tone="bg-[#2A292D]" className="left-5 top-5" />
    <Person tone="bg-[#5BC4A5]" className="left-5 bottom-5" />
    <Person tone="bg-[#B58B63]" className="right-6 bottom-9" />
    <span className="absolute left-[44%] top-[32%] w-7 h-7 rounded-full bg-[#1FCB9B] border-2 border-white" />
    <span className="absolute right-[10%] top-[40%] rounded-lg bg-[#1FCB9B] text-white text-xs font-bold px-4 py-2">
      Your platform
    </span>
  </StepCard>
);

const SettleVisual = () => (
  <StepCard n={4} className="bg-white border border-[#3BBA93]/50 p-6 flex flex-col">
    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Settlement</p>
    <p className="mt-2 text-3xl font-extrabold text-[#2A292D]">KES 482,300</p>
    <p className="text-xs text-gray-500 mt-1">Next-day payout · Local currency</p>
    <div className="mt-5 space-y-2.5">
      {[72, 54, 38].map((w) => (
        <div key={w} className="h-2.5 rounded-full bg-[#E3F5EE]">
          <div className="h-full rounded-full bg-[#3BBA93]" style={{ width: `${w}%` }} />
        </div>
      ))}
    </div>
    <span className="mt-auto inline-flex w-fit items-center gap-1.5 rounded-full bg-[#E3F5EE] px-3 py-1.5 text-xs font-bold text-[#2FA07E]">
      <CheckCircle2 className="w-4 h-4" /> Settled
    </span>
  </StepCard>
);

const STEPS = [
  {
    Visual: OnboardVisual,
    title: 'Onboard',
    body: 'Submit your KYC documents and choose the markets you want to go live in.',
  },
  {
    Visual: IntegrateVisual,
    title: 'Integrate',
    body: 'Connect via the AvadaPay API or use a hosted checkout. Sandbox first, production once tested.',
  },
  {
    Visual: GoLiveVisual,
    title: 'Go Live',
    body: 'Start accepting payments. Track everything from the AvadaPay dashboard or your own system through webhooks',
  },
  {
    Visual: SettleVisual,
    title: 'Settle',
    body: 'Receive funds in local currency on your chosen settlement schedule',
  },
];

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export const PaymentProcessingPage: React.FC = () => (
  <div className="bg-white text-[#2A292D] font-sans overflow-x-hidden">
    <ProductHero
      title={
        <>
          Accept payments across Africa through <span className="text-[#3BBA93]">one integration.</span>
        </>
      }
      description="Mobile money, cards, payment links, and bank rails, across 17+ African markets, with one API, one dashboard, and one settlement flow."
      actions={[{ label: 'Contact Us', to: '/contact?inquiry=payments', variant: 'outline' }]}
    />

    {/* One connection */}
    <section className="bg-[#3BBA93] text-white py-14 sm:py-16 px-4 text-center">
      <h2 className="font-extrabold tracking-tight leading-[1.15] text-3xl sm:text-4xl md:text-[46px]">
        One connection.
        <br />
        Every way Africa pays
      </h2>
      <p className="mt-8 mx-auto max-w-[56rem] text-base sm:text-lg font-medium leading-relaxed">
        Customers in Nairobi pay through M-Pesa. Customers in Kinshasa pay through Vodacom, Orange
        or Airtel. Customers in Lagos pay through PayAttitude, Opay or Palmpay. AvadaPay handles
        the operator-by-operator complexity so your team handles one integration and one set of
        reports.
      </p>
    </section>

    {/* How it works */}
    <section className="pt-16 sm:pt-20 px-4">
      <SectionTitle>
        How does <G>AvadaPay</G>
        <br />
        <G>payment processing</G> work?
      </SectionTitle>

      <div className="mt-12 mx-auto max-w-[67rem] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
        {METHODS.map((m) => (
          <article key={m.title}>
            <div className="aspect-[1.22/1] overflow-hidden rounded-2xl bg-gray-100">
              <img
                src={m.img}
                alt={m.title}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>
            <h3 className="mt-6 px-1 text-xl font-extrabold">{m.title}</h3>
            <p className="mt-2 px-1 text-lg leading-[1.45] font-medium text-[#2A292D]/90">{m.body}</p>
          </article>
        ))}
      </div>
    </section>

    {/* Industries */}
    <section className="pt-20 sm:pt-24 px-4">
      <SectionTitle>
        Built for the businesses
        <br />
        already using <G>AvadaPay</G>
      </SectionTitle>
      <AccordionList className="mt-12" items={INDUSTRIES} />
    </section>

    {/* Steps */}
    <section className="pt-20 sm:pt-24 px-4">
      <div className="mx-auto max-w-[67rem] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
        {STEPS.map(({ Visual, title, body }) => (
          <article key={title}>
            <Visual />
            <h3 className="mt-6 px-2 text-xl font-extrabold">{title}</h3>
            <p className="mt-2 px-2 text-lg leading-[1.45] font-medium text-[#2A292D]/90">{body}</p>
          </article>
        ))}
      </div>
    </section>

    {/* Networks */}
    <section className="pt-20 sm:pt-24">
      <SectionTitle>
        <G>The networks and</G>
        <br />
        <G>schemes</G> we connect
      </SectionTitle>
      <div className="mt-10 border-y border-[#3BBA93]/15">
        <div className="py-6">
          <Marquee animation="animate-marquee-slow">
            {[...ROW_ONE, ...ROW_ONE].map((logo, i) => (
              <div key={i} className="px-[4.2rem] h-14 flex items-center">
                {logo}
              </div>
            ))}
          </Marquee>
        </div>
        <div className="py-6 border-t border-[#3BBA93]/15">
          <Marquee animation="animate-marquee-reverse">
            {[...ROW_TWO, ...ROW_TWO].map((logo, i) => (
              <div key={i} className="px-[4.2rem] h-14 flex items-center">
                {logo}
              </div>
            ))}
          </Marquee>
        </div>
      </div>
    </section>

    {/* Why AvadaPay */}
    <section className="pt-20 sm:pt-24 pb-20 sm:pb-24 px-4">
      <SectionTitle>
        Why AvadaPay for
        <br />
        <G>payments</G>
      </SectionTitle>
      <div className="mt-12 mx-auto max-w-[69rem] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {WHY.map(({ Icon, title, body }) => (
          <article
            key={title}
            className="rounded-2xl border border-[#3BBA93]/45 bg-white p-7 shadow-[0_10px_20px_rgba(0,0,0,0.08)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#3BBA93] hover:shadow-[0_14px_26px_rgba(59,186,147,0.22)]"
          >
            <Icon className="w-10 h-10 text-[#3BBA93]" strokeWidth={1.6} />
            <h3 className="mt-5 text-xl font-extrabold leading-snug">{title}</h3>
            <p className="mt-2 text-lg leading-[1.45] font-medium text-[#2A292D]/90">{body}</p>
          </article>
        ))}
      </div>
    </section>
  </div>
);

export default PaymentProcessingPage;
