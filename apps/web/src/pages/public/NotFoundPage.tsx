import React from 'react';
import { Link } from 'react-router-dom';
import { SEO } from '@/components/seo/SEO';
import { Button } from '@/components/ui/button';
import { Home, ArrowRight, HelpCircle, ShieldAlert, CreditCard, Radio, MessageSquare } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[75vh] flex flex-col justify-center items-center bg-[#F8FAFC] px-4 py-16 sm:py-24 text-center">
      <SEO
        title="404 — Page Not Found | AvadaPay"
        description="The page you requested could not be found on AvadaPay. Return to the homepage or explore our payment infrastructure."
        noindex={true}
      />

      <div className="max-w-xl mx-auto space-y-6">
        {/* Status Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#3BBA93]/15 text-[#3BBA93] text-xs font-bold uppercase tracking-wider">
          <ShieldAlert className="w-4 h-4" />
          <span>Error 404 · Page Not Found</span>
        </div>

        {/* Headline */}
        <h1 className="text-3xl sm:text-5xl font-black text-[#2A292D] tracking-tight leading-tight">
          This address doesn't exist on AvadaPay
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-gray-600 leading-relaxed font-medium">
          The link you followed may be mistyped, expired, or the page has moved.
          Use the options below to get back on track.
        </p>

        {/* Action Buttons */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
          <Button
            asChild
            className="h-12 px-6 rounded-xl bg-[#3BBA93] hover:bg-[#32a481] text-white font-bold text-sm shadow-md shadow-[#3BBA93]/20"
          >
            <Link to="/" className="inline-flex items-center gap-2">
              <Home className="w-4 h-4" />
              <span>Go to Homepage</span>
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            className="h-12 px-6 rounded-xl border-gray-300 bg-white hover:bg-gray-50 text-gray-800 font-bold text-sm shadow-sm"
          >
            <Link to="/contact" className="inline-flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-[#3BBA93]" />
              <span>Talk to Sales Team</span>
            </Link>
          </Button>
        </div>

        {/* Helpful Links Grid */}
        <div className="pt-8 mt-8 border-t border-gray-200">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
            Popular destinations
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
            <Link
              to="/payment-processing"
              className="p-3.5 rounded-xl bg-white border border-gray-200/80 hover:border-[#3BBA93] hover:shadow-sm transition-all group"
            >
              <div className="flex items-center justify-between">
                <CreditCard className="w-4 h-4 text-[#3BBA93]" />
                <ArrowRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#3BBA93] group-hover:translate-x-0.5 transition-all" />
              </div>
              <p className="font-bold text-xs text-gray-800 mt-2">Payment Processing</p>
              <p className="text-[11px] text-gray-500 mt-0.5">Mobile money & cards</p>
            </Link>

            <Link
              to="/pos"
              className="p-3.5 rounded-xl bg-white border border-gray-200/80 hover:border-[#3BBA93] hover:shadow-sm transition-all group"
            >
              <div className="flex items-center justify-between">
                <Radio className="w-4 h-4 text-[#3BBA93]" />
                <ArrowRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#3BBA93] group-hover:translate-x-0.5 transition-all" />
              </div>
              <p className="font-bold text-xs text-gray-800 mt-2">Smart POS</p>
              <p className="text-[11px] text-gray-500 mt-0.5">Android terminals & SoftPOS</p>
            </Link>

            <Link
              to="/bulk-sms"
              className="p-3.5 rounded-xl bg-white border border-gray-200/80 hover:border-[#3BBA93] hover:shadow-sm transition-all group"
            >
              <div className="flex items-center justify-between">
                <MessageSquare className="w-4 h-4 text-[#3BBA93]" />
                <ArrowRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#3BBA93] group-hover:translate-x-0.5 transition-all" />
              </div>
              <p className="font-bold text-xs text-gray-800 mt-2">Bulk SMS</p>
              <p className="text-[11px] text-gray-500 mt-0.5">Carrier-grade alerts & OTPs</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
