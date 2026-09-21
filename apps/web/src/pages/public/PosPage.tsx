import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Store,
  Wifi,
  ArrowRight,
  ArrowUpRight,
  Smartphone,
  CreditCard,
  QrCode,
  Banknote,
} from 'lucide-react';

export const PosPage: React.FC = () => {
  const paymentMethods = [
    { name: 'Debit cards', icon: CreditCard },
    { name: 'Credit cards', icon: CreditCard },
    { name: 'QR Payments', icon: QrCode },
    { name: 'Mobile money', icon: Smartphone },
    { name: 'In person (cash) payments', icon: Banknote },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* 
        Hero Section (Pixel-Close to Adobe XD Screenshot media_1789990976889.png)
        Background: #2A292D
      */}
      <section className="bg-[#2A292D] text-white pt-16 pb-16 lg:pt-20 lg:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.12]">
                One POS platform.{' '}
                <span className="block sm:inline">Every way to get paid.</span>
              </h1>
              <p className="text-base sm:text-lg text-gray-300 max-w-xl leading-relaxed">
                Turn any Android phone into a payment terminal with SoftPOS, deploy enterprise-grade POS devices, or integrate payment acceptance into your existing systems, all on one dashboard with AvadaPay POS.
              </p>
              <div className="pt-2 flex flex-wrap gap-4">
                <Link to="/contact">
                  <Button
                    variant="outline"
                    className="border-white/30 text-white hover:bg-white/10 rounded-lg px-6 h-10 text-sm"
                  >
                    Contact Us
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button
                    className="bg-[#3BBA93] hover:bg-[#32a481] text-white font-semibold rounded-lg px-6 h-10 text-sm shadow-lg shadow-[#3BBA93]/20"
                  >
                    Request a POS Demo
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right Graphic Preview Box */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="w-full max-w-md h-72 sm:h-80 rounded-2xl bg-[#1E1D20] border border-white/10 p-6 shadow-2xl flex flex-col justify-between">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">AvadaPay POS Terminal Live</span>
                  <span className="inline-flex items-center text-[10px] text-[#3BBA93] font-mono bg-[#3BBA93]/10 px-2 py-0.5 rounded">
                    4G / Dual-SIM Active
                  </span>
                </div>
                <div className="text-center py-6">
                  <p className="text-xs text-gray-400 uppercase tracking-wider">Awaiting Card or Phone Tap</p>
                  <p className="text-3xl font-black text-white mt-2">KES 4,850.00</p>
                  <p className="text-xs text-[#3BBA93] mt-1 font-mono">Tap Card / Scan QR / M-Pesa</p>
                </div>
                <div className="pt-3 border-t border-white/10 text-[11px] text-gray-400 flex items-center justify-between">
                  <span>Battery: 92% • Fast Thermal Print Ready</span>
                  <span className="w-2 h-2 rounded-full bg-[#3BBA93]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 
        Horizontal Payment Methods Strip (from media_1789990976889.png)
        Dark Bar with Divided Options
      */}
      <div className="w-full bg-[#1E1D20] border-y border-white/10 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 divide-y sm:divide-y-0 sm:divide-x divide-white/10 text-center text-xs sm:text-sm font-semibold text-gray-300">
            {paymentMethods.map((pm) => (
              <div key={pm.name} className="py-2.5 sm:py-0 px-2 flex items-center justify-center space-x-2">
                <pm.icon className="w-4 h-4 text-[#3BBA93]" />
                <span>{pm.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 
        Section: "Three ways to take payments. One platform behind all of them" (from screenshot)
      */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
              Three ways to take payments.{' '}
              <span className="text-[#3BBA93] block sm:inline">
                One platform behind all of them
              </span>
            </h2>
            <p className="text-gray-500 mt-3 text-base">
              From lightweight mobile apps to full smart POS hardware and cloud enterprise integrations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1: Soft POS */}
            <div className="rounded-2xl border border-gray-100 bg-gray-50 p-6 flex flex-col justify-between hover:shadow-xl transition-all">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center">
                    <span>Soft POS</span>
                    <ArrowUpRight className="w-4 h-4 ml-1 text-[#3BBA93]" />
                  </h3>
                  <span className="text-[10px] font-bold text-[#3BBA93] bg-[#3BBA93]/10 px-2 py-0.5 rounded-full">
                    App-Only
                  </span>
                </div>
                <div className="h-44 rounded-xl bg-gradient-to-tr from-emerald-100 to-teal-50 flex items-center justify-center mb-6 overflow-hidden">
                  <Smartphone className="w-16 h-16 text-[#3BBA93]" />
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Turn any NFC-enabled Android phone into a payment terminal. No extra hardware. Live in 24–48 hours. Pay-as-you-transact.
                </p>
                <p className="text-[11px] text-gray-500 mt-3 italic">
                  Best for: SMEs, delivery teams, field agents, taxi operators, restaurants, growing retail.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-gray-200">
                <Link to="/contact">
                  <Button size="sm" variant="outline" className="w-full text-xs font-semibold">
                    Get Soft POS Access
                  </Button>
                </Link>
              </div>
            </div>

            {/* Card 2: Smart POS */}
            <div className="rounded-2xl border border-gray-100 bg-gray-50 p-6 flex flex-col justify-between hover:shadow-xl transition-all">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center">
                    <span>Smart POS</span>
                    <ArrowRight className="w-4 h-4 ml-1 text-[#3BBA93]" />
                  </h3>
                  <span className="text-[10px] font-bold text-[#3BBA93] bg-[#3BBA93]/10 px-2 py-0.5 rounded-full">
                    Dedicated Hardware
                  </span>
                </div>
                <div className="h-44 rounded-xl bg-gradient-to-tr from-blue-100 to-slate-100 flex items-center justify-center mb-6 overflow-hidden">
                  <Store className="w-16 h-16 text-blue-600" />
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Enterprise-grade Android POS with high-speed built-in thermal printer, 4G dual-SIM auto-switching, and 72-hour battery life.
                </p>
                <p className="text-[11px] text-gray-500 mt-3 italic">
                  Best for: Supermarkets, hotel chains, gas stations, hospitals, and high-frequency retailers.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-gray-200">
                <Link to="/contact">
                  <Button size="sm" className="w-full bg-[#3BBA93] hover:bg-[#32a481] text-white text-xs font-semibold">
                    Order POS Devices
                  </Button>
                </Link>
              </div>
            </div>

            {/* Card 3: Enterprise Payment APIs */}
            <div className="rounded-2xl border border-gray-100 bg-gray-50 p-6 flex flex-col justify-between hover:shadow-xl transition-all">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center">
                    <span>Enterprise Payment APIs</span>
                    <ArrowRight className="w-4 h-4 ml-1 text-[#3BBA93]" />
                  </h3>
                  <span className="text-[10px] font-bold text-[#3BBA93] bg-[#3BBA93]/10 px-2 py-0.5 rounded-full">
                    Custom Setup
                  </span>
                </div>
                <div className="h-44 rounded-xl bg-gradient-to-tr from-indigo-100 to-purple-50 flex items-center justify-center mb-6 overflow-hidden">
                  <Wifi className="w-16 h-16 text-indigo-600" />
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Integrate seamlessly into existing cash registers, Oracle/SAP ERPs, or custom in-house retail management software.
                </p>
                <p className="text-[11px] text-gray-500 mt-3 italic">
                  Best for: Multinationals, franchise networks, and fintech aggregator networks.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-gray-200">
                <Link to="/contact">
                  <Button size="sm" variant="outline" className="w-full text-xs font-semibold">
                    Consult Enterprise Team
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
