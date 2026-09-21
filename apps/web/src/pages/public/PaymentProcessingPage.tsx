import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  ArrowRight,
  Code2,
  CheckCircle2,
  Lock,
} from 'lucide-react';

export const PaymentProcessingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* 
        Hero Section (Pixel-Close to Adobe XD Screenshot media_1789990970439.png)
        Background: #2A292D
      */}
      <section className="bg-[#2A292D] text-white pt-16 pb-20 lg:pt-20 lg:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.12]">
                Accept payments across Africa through{' '}
                <span className="text-[#3BBA93]">one integration.</span>
              </h1>
              <p className="text-base sm:text-lg text-gray-300 max-w-xl leading-relaxed">
                Mobile money, cards, payment links, and bank rails, across 17+ African markets, with one API, one dashboard, and one settlement flow.
              </p>
              <div className="pt-2">
                <Link to="/contact">
                  <Button
                    variant="outline"
                    className="border-white/30 text-white hover:bg-white/10 rounded-lg px-6 h-10 text-sm"
                  >
                    Contact Us
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right Graphic Preview */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="w-full max-w-md h-72 sm:h-80 rounded-2xl bg-[#1E1D20] border border-white/10 p-6 shadow-2xl flex flex-col justify-between">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Payment Terminal Feed</span>
                  <span className="w-2.5 h-2.5 rounded-full bg-[#3BBA93] animate-pulse" />
                </div>
                <div className="space-y-3 font-mono text-xs">
                  <div className="p-3 rounded-lg bg-white/5 flex items-center justify-between">
                    <span className="text-gray-300">M-Pesa Kenya (KES)</span>
                    <span className="text-[#3BBA93] font-semibold">+ 2,500.00</span>
                  </div>
                  <div className="p-3 rounded-lg bg-white/5 flex items-center justify-between">
                    <span className="text-gray-300">MTN MoMo Rwanda (RWF)</span>
                    <span className="text-[#3BBA93] font-semibold">+ 45,000.00</span>
                  </div>
                  <div className="p-3 rounded-lg bg-white/5 flex items-center justify-between">
                    <span className="text-gray-300">Tigo Pesa Tanzania (TZS)</span>
                    <span className="text-[#3BBA93] font-semibold">+ 120,000.00</span>
                  </div>
                </div>
                <div className="pt-3 border-t border-white/10 text-[11px] text-gray-400 flex items-center justify-between">
                  <span>Settlement: Instant Direct-to-Wallet</span>
                  <Lock className="w-3.5 h-3.5 text-[#3BBA93]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 
        Solid Green Section (from media_1789990970439.png)
        Background: #3BBA93
      */}
      <section className="py-20 bg-[#3BBA93] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-5">
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            One connection. Every way Africa pays
          </h2>
          <p className="text-white/90 text-base sm:text-lg leading-relaxed max-w-3xl mx-auto">
            Customers in Nairobi pay through M-Pesa. Customers in Kinshasa pay through Vodacom, Orange or Airtel. Customers in Lagos pay through PayAttitude, Opay or Palmpay. AvadaPay handles the operator-by-operator complexity so your team handles one integration and one set of reports.
          </p>
        </div>
      </section>

      {/* 
        Section: "How does AvadaPay payment processing work?" (from screenshot)
      */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
              How does <span className="text-[#3BBA93]">AvadaPay payment processing</span> work?
            </h2>
            <p className="text-gray-500 mt-3 text-base">
              A frictionless 3-step lifecycle moving value across telcos and bank accounts effortlessly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="rounded-2xl border border-gray-100 bg-gray-50/50 p-8 flex flex-col justify-between hover:shadow-lg transition-shadow">
              <div>
                <span className="text-4xl font-black text-[#3BBA93]/30">01</span>
                <h3 className="text-xl font-bold text-gray-900 mt-4">Unified Checkout Trigger</h3>
                <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                  Your customer chooses their preferred payment method: M-Pesa STK push, MTN MoMo, Airtel Money, or credit card.
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-gray-200/80 flex items-center text-xs font-semibold text-[#3BBA93]">
                <span>Automated USSD Prompt</span>
              </div>
            </div>

            {/* Step 2 */}
            <div className="rounded-2xl border border-gray-100 bg-gray-50/50 p-8 flex flex-col justify-between hover:shadow-lg transition-shadow">
              <div>
                <span className="text-4xl font-black text-[#3BBA93]/30">02</span>
                <h3 className="text-xl font-bold text-gray-900 mt-4">Sub-Second Telco Routing</h3>
                <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                  Transaction routes through AvadaPay's direct host-to-host telco rails with automated carrier failover for 99.9% success rates.
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-gray-200/80 flex items-center text-xs font-semibold text-[#3BBA93]">
                <span>Instant Webhook Callbacks</span>
              </div>
            </div>

            {/* Step 3 */}
            <div className="rounded-2xl border border-gray-100 bg-gray-50/50 p-8 flex flex-col justify-between hover:shadow-lg transition-shadow">
              <div>
                <span className="text-4xl font-black text-[#3BBA93]/30">03</span>
                <h3 className="text-xl font-bold text-gray-900 mt-4">Consolidated Settlement</h3>
                <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                  All revenues arrive in your consolidated multi-currency ledger, ready for same-day withdrawal or programmatic bulk payouts.
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-gray-200/80 flex items-center text-xs font-semibold text-[#3BBA93]">
                <span>Real-Time Reconciliation</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Developer API Preview */}
      <section className="py-20 bg-[#2A292D] text-white border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center space-x-2 text-xs font-semibold text-[#3BBA93] uppercase tracking-wider mb-3">
                <Code2 className="w-4 h-4" />
                <span>One Integration</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                Single API Payload for All African Markets
              </h2>
              <p className="text-gray-300 mt-4 leading-relaxed">
                Whether charging a Kenyan phone number via Safaricom, a Rwandan wallet on MTN, or a Tanzanian account on Vodacom, the API payload remains unified and straightforward.
              </p>

              <div className="mt-6 space-y-3">
                <div className="flex items-center space-x-3 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-[#3BBA93]" />
                  <span>Sub-second mobile money STK push initiation</span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-[#3BBA93]" />
                  <span>Direct bank payouts to 140+ institutions</span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-[#3BBA93]" />
                  <span>Sandbox environment with full telco simulations</span>
                </div>
              </div>

              <div className="mt-8">
                <Link to="/contact">
                  <Button className="bg-[#3BBA93] hover:bg-[#32a481] text-white space-x-2">
                    <span>Get API Credentials</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Code snippet block */}
            <div className="bg-[#1E1D20] rounded-xl p-6 text-gray-200 font-mono text-xs shadow-2xl border border-white/10 overflow-x-auto">
              <div className="flex items-center space-x-2 pb-4 border-b border-white/10 mb-4">
                <span className="w-3 h-3 rounded-full bg-red-500 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
                <span className="text-gray-400 text-[11px] ml-2 font-sans">POST /v1/payments/charge</span>
              </div>
              <pre className="leading-relaxed">
{`curl -X POST https://api.avadapay.com/v1/payments/charge \\
  -H "Authorization: Bearer sec_live_..." \\
  -H "Content-Type: application/json" \\
  -d '{
    "amount": 2500,
    "currency": "KES",
    "provider": "mpesa",
    "phone": "+254712345678",
    "reference": "ORDER-9921",
    "callback_url": "https://yourapp.com/webhooks"
  }'`}
              </pre>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
