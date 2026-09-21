import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Lock,
  Calendar,
  Megaphone,
  Bell,
  RefreshCw,
  Send,
} from 'lucide-react';

export const BulkSmsPage: React.FC = () => {
  const messageTypes = [
    {
      title: 'Transactional SMS',
      icon: RefreshCw,
      desc: 'Payment confirmations, order status, delivery updates, account changes. Real-time, route-prioritized, with delivery reports.',
      highlight: false,
    },
    {
      title: 'OTPs & two-factor',
      icon: Lock,
      desc: 'Account verification, password resets, transaction confirmations. Sub-second routing on most networks.',
      highlight: true,
    },
    {
      title: 'Reminders',
      icon: Calendar,
      desc: 'Loan repayments, school fees, subscription renewals, appointment confirmations.',
      highlight: false,
    },
    {
      title: 'Marketing campaigns',
      icon: Megaphone,
      desc: 'Promotions, product launches, customer re-engagement, seasonal offers. High-throughput delivery with smart queuing.',
      highlight: false,
    },
    {
      title: 'Service notifications',
      icon: Bell,
      desc: 'Outages, policy updates, KYC requests, and any urgent broadcast your users must see immediately.',
      highlight: false,
    },
    {
      title: 'Payments + SMS',
      icon: Send,
      desc: 'Trigger an SMS the moment a payment succeeds or fails. One vendor, one unified customer journey.',
      highlight: false,
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* 
        Hero Section (Pixel-Close to Adobe XD Screenshot media_1789990984313.png)
        Background: #2A292D
      */}
      <section className="bg-[#2A292D] text-white pt-16 pb-20 lg:pt-20 lg:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.12]">
                SMS that reaches{' '}
                <span className="text-[#3BBA93]">every African customer</span>,{' '}
                <span className="block sm:inline">every time.</span>
              </h1>
              <p className="text-base sm:text-lg text-gray-300 max-w-xl leading-relaxed">
                Send OTPs, transaction alerts, reminders, and marketing campaigns across every major mobile network in Africa, through one platform, one API, one set of delivery reports with AvadaPay
              </p>
              <div className="pt-2">
                <Link to="/contact">
                  <Button
                    className="bg-[#3BBA93] hover:bg-[#32a481] text-white font-semibold rounded-lg px-6 h-10 text-sm shadow-md shadow-[#3BBA93]/20"
                  >
                    Contact Us
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right Graphic Preview Box */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="w-full max-w-md h-72 sm:h-80 rounded-2xl bg-[#1E1D20] border border-white/10 p-6 shadow-2xl flex flex-col justify-between">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">SMS Gateway Dispatch</span>
                  <span className="inline-flex items-center text-[10px] text-[#3BBA93] font-mono bg-[#3BBA93]/10 px-2 py-0.5 rounded">
                    Latency &lt; 2.1s
                  </span>
                </div>
                <div className="space-y-3 font-mono text-xs">
                  <div className="p-3 rounded-lg bg-white/5 border border-white/5 space-y-1">
                    <div className="flex justify-between text-[11px] text-[#3BBA93]">
                      <span>From: AVADAPAY</span>
                      <span>Delivered</span>
                    </div>
                    <p className="text-gray-200">Your verification OTP is 849201. Do not share this code.</p>
                  </div>
                  <div className="p-3 rounded-lg bg-white/5 border border-white/5 space-y-1">
                    <div className="flex justify-between text-[11px] text-[#3BBA93]">
                      <span>From: AVADAPAY</span>
                      <span>Delivered</span>
                    </div>
                    <p className="text-gray-200">Payment of KES 2,500 to Merchant confirmed.</p>
                  </div>
                </div>
                <div className="pt-3 border-t border-white/10 text-[11px] text-gray-400 flex items-center justify-between">
                  <span>Telco Coverage: Safaricom, MTN, Airtel, Vodacom</span>
                  <span className="w-2 h-2 rounded-full bg-[#3BBA93]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 
        Section: "Every message your business needs to send" (from media_1789990984313.png)
      */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
              <span className="text-[#3BBA93]">Every message your</span> business needs to send
            </h2>
            <p className="text-gray-500 mt-3 text-base">
              High-throughput routing engineered for mission-critical enterprise notifications.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
            {messageTypes.map((item) => (
              <div
                key={item.title}
                className={`p-8 border-b md:border-b-0 md:border-r border-gray-100 flex flex-col justify-between ${
                  item.highlight ? 'bg-[#3BBA93]/10' : 'bg-white'
                } hover:bg-[#3BBA93]/5 transition-colors`}
              >
                <div>
                  <div className="w-10 h-10 rounded-lg bg-[#3BBA93]/10 text-[#3BBA93] flex items-center justify-center mb-6">
                    <item.icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-gray-900">{item.title}</h3>
                  <p className="text-xs sm:text-sm text-gray-600 mt-2.5 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
                <div className="mt-8 pt-4 border-t border-gray-200/60 flex items-center text-xs font-semibold text-[#3BBA93]">
                  <span>High-Deliverability Route</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
