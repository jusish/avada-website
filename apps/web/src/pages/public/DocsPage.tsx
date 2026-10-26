import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SEO } from '@/components/seo/SEO';
import { Button } from '@/components/ui/button';
import {
  Terminal,
  ShieldCheck,
  Copy,
  Check,
  ArrowRight,
  KeyRound,
  Webhook,
  Zap,
} from 'lucide-react';

const SAMPLE_COLLECTION_REQUEST = `{
  "amount": 25000,
  "currency": "RWF",
  "phone": "+250788123456",
  "provider": "MTN_MOMO",
  "externalReference": "INV-2026-90412",
  "callbackUrl": "https://api.yourdomain.com/webhooks/avadapay",
  "description": "Order #90412 Payment"
}`;

const SAMPLE_COLLECTION_RESPONSE = `{
  "status": "success",
  "data": {
    "transactionId": "trx_momo_8f2910ac",
    "status": "PENDING_CUSTOMER_ACTION",
    "prompt": "USSD push sent to subscriber handset",
    "amount": 25000,
    "currency": "RWF",
    "createdAt": "2026-10-26T14:15:00Z"
  }
}`;

const SAMPLE_WEBHOOK = `{
  "event": "payment.successful",
  "transactionId": "trx_momo_8f2910ac",
  "externalReference": "INV-2026-90412",
  "amount": 25000,
  "currency": "RWF",
  "fee": 375,
  "netAmount": 24625,
  "providerReference": "MTN-MP-984210",
  "completedAt": "2026-10-26T14:15:22Z"
}`;

export const DocsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'collect' | 'webhook'>('collect');
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSnippet(id);
    setTimeout(() => setCopiedSnippet(null), 2000);
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen text-[#2A292D]">
      <SEO
        title="API Documentation & Developer Sandbox | AvadaPay"
        description="Explore AvadaPay developer APIs for collections, mobile money STK push, payouts, and transactional SMS across 17+ African markets."
        canonical="/docs"
      />

      {/* Hero */}
      <section className="bg-[#2A292D] text-white pt-28 pb-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#3BBA93]/20 text-[#3BBA93] text-xs font-bold uppercase tracking-wider mb-4">
            <Terminal className="w-4 h-4" />
            <span>Developer Platform &amp; API Specifications</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight max-w-3xl">
            One Unified API for African Payments &amp; Telecom Rails
          </h1>

          <p className="mt-4 text-base sm:text-lg text-white/80 max-w-2xl leading-relaxed">
            Integrate mobile money collections, merchant point-of-sale, automated bulk payouts,
            and carrier-grade SMS with standardized REST endpoints and predictable webhook callbacks.
          </p>

          <div className="mt-8 flex flex-wrap gap-4 items-center">
            <Button
              asChild
              className="h-12 px-7 rounded-xl bg-[#3BBA93] hover:bg-[#32a481] text-white font-bold text-sm shadow-lg shadow-[#3BBA93]/25"
            >
              <Link to="/contact?inquiry=api" className="inline-flex items-center gap-2">
                <KeyRound className="w-4 h-4" />
                <span>Request Sandbox Access</span>
              </Link>
            </Button>

            <Button
              asChild
              className="h-12 px-7 rounded-xl border border-white/20 bg-white/10 hover:bg-white/20 text-white hover:text-white hover:border-white/50 font-bold text-sm backdrop-blur-sm transition-all"
            >
              <Link to="/contact?inquiry=payments" className="inline-flex items-center gap-2">
                <span>Talk to Solutions Engineer</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Architecture Highlights */}
      <section className="py-12 px-4 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-gray-200/80 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#3BBA93]/15 text-[#3BBA93] flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-base text-gray-900">Standardized STK Push</h3>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-medium">
              Trigger prompt collections across M-Pesa, MTN MoMo, Airtel Money, and TMoney with a single payload schema.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-gray-200/80 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#3BBA93]/15 text-[#3BBA93] flex items-center justify-center">
              <Webhook className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-base text-gray-900">Signed Webhook Delivery</h3>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-medium">
              Every callback is signed with HMAC-SHA256 headers for tamper-proof verification with automated retries.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-gray-200/80 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#3BBA93]/15 text-[#3BBA93] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-base text-gray-900">Isolated Sandbox</h3>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-medium">
              Test end-to-end payment lifecycles and simulated telco responses with mocked numbers before production rollout.
            </p>
          </div>
        </div>
      </section>

      {/* Interactive API Spec Viewer */}
      <section className="py-8 px-4 max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl border border-gray-200/80 shadow-md overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-gray-200 bg-gray-50/75 px-4 pt-3 gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('collect')}
              className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-t-lg transition-colors border-b-2 ${
                activeTab === 'collect'
                  ? 'border-[#3BBA93] text-[#3BBA93] bg-white'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              POST /v1/payments/collect (Mobile Money)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('webhook')}
              className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-t-lg transition-colors border-b-2 ${
                activeTab === 'webhook'
                  ? 'border-[#3BBA93] text-[#3BBA93] bg-white'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Webhook Notification (Signed Payload)
            </button>
          </div>

          <div className="p-6">
            {activeTab === 'collect' ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Request Payload
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(SAMPLE_COLLECTION_REQUEST, 'req')}
                      className="text-xs text-[#3BBA93] hover:text-[#32a481] inline-flex items-center gap-1 font-semibold"
                    >
                      {copiedSnippet === 'req' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedSnippet === 'req' ? 'Copied' : 'Copy JSON'}</span>
                    </button>
                  </div>
                  <pre className="p-4 rounded-xl bg-[#0F172A] text-gray-100 font-mono text-xs overflow-x-auto leading-relaxed">
                    {SAMPLE_COLLECTION_REQUEST}
                  </pre>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Instant API Response (200 OK)
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(SAMPLE_COLLECTION_RESPONSE, 'res')}
                      className="text-xs text-[#3BBA93] hover:text-[#32a481] inline-flex items-center gap-1 font-semibold"
                    >
                      {copiedSnippet === 'res' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedSnippet === 'res' ? 'Copied' : 'Copy JSON'}</span>
                    </button>
                  </div>
                  <pre className="p-4 rounded-xl bg-[#0F172A] text-[#3BBA93] font-mono text-xs overflow-x-auto leading-relaxed">
                    {SAMPLE_COLLECTION_RESPONSE}
                  </pre>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Callback Sent to your <code className="bg-gray-100 text-[#3BBA93] px-1 py-0.5 rounded">callbackUrl</code>
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(SAMPLE_WEBHOOK, 'hook')}
                    className="text-xs text-[#3BBA93] hover:text-[#32a481] inline-flex items-center gap-1 font-semibold"
                  >
                    {copiedSnippet === 'hook' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedSnippet === 'hook' ? 'Copied' : 'Copy JSON'}</span>
                  </button>
                </div>
                <pre className="p-4 rounded-xl bg-[#0F172A] text-gray-100 font-mono text-xs overflow-x-auto leading-relaxed max-w-2xl">
                  {SAMPLE_WEBHOOK}
                </pre>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Sandbox CTA */}
      <section className="py-12 px-4 max-w-4xl mx-auto text-center pb-20">
        <div className="p-8 sm:p-10 rounded-3xl bg-[#3BBA93]/10 border-2 border-[#3BBA93] space-y-4">
          <h2 className="text-2xl sm:text-3xl font-black text-[#2A292D]">
            Ready to test with your application?
          </h2>
          <p className="text-sm sm:text-base text-gray-700 max-w-lg mx-auto font-medium">
            Contact our developer support team to get your Sandbox API key, webhook secret,
            and complete Swagger / OpenAPI specification file.
          </p>
          <div className="pt-2">
            <Button
              asChild
              className="h-12 px-8 rounded-xl bg-[#3BBA93] hover:bg-[#32a481] text-white font-bold text-sm shadow-md"
            >
              <Link to="/contact?inquiry=api">Request Sandbox API Key</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};
