import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Headphones, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useSiteConfig } from '@/context/SiteConfigContext';

const FALLBACK_INQUIRY_TYPES = [
  { value: 'sms', label: 'SMS Pricing & Routing' },
  { value: 'payments', label: 'Payment Processing (Collections & Payouts)' },
  { value: 'pos', label: 'POS Terminal Solutions' },
  { value: 'pos_demo', label: 'POS System Demo' },
  { value: 'api', label: 'Technical & API Integration' },
  { value: 'partner', label: 'Enterprise Partnership' },
  { value: 'general', label: 'General Inquiry' },
];

const FALLBACK_COUNTRIES = [
  { value: 'Rwanda', label: 'Rwanda' },
  { value: 'Kenya', label: 'Kenya' },
  { value: 'Tanzania', label: 'Tanzania' },
  { value: 'DRC', label: 'Democratic Republic of Congo (DRC)' },
  { value: 'Uganda', label: 'Uganda' },
  { value: 'Nigeria', label: 'Nigeria' },
  { value: 'South Africa', label: 'South Africa' },
  { value: 'Other', label: 'Other' },
];

export const ContactPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { countries: dynamicCountries, inquiryTypes: dynamicInquiryTypes } = useSiteConfig();

  const [submitted, setSubmitted] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [inquiryType, setInquiryType] = useState<string>('payments');
  const [country, setCountry] = useState<string>('Rwanda');
  const [fullName, setFullName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [orgName, setOrgName] = useState<string>('');
  const [roleTitle, setRoleTitle] = useState<string>('');
  const [message, setMessage] = useState<string>('');

  // Active countries from CMS or fallback
  const availableCountries =
    dynamicCountries && dynamicCountries.length > 0
      ? dynamicCountries.map((c) => ({ value: c.name, label: c.name }))
      : FALLBACK_COUNTRIES;

  // Active inquiry types from CMS or fallback
  const availableInquiryTypes =
    dynamicInquiryTypes && dynamicInquiryTypes.length > 0
      ? dynamicInquiryTypes.map((t) => ({ value: t.key, label: t.label }))
      : FALLBACK_INQUIRY_TYPES;

  useEffect(() => {
    const inquiryParam = searchParams.get('inquiry');
    if (inquiryParam) {
      if (inquiryParam.includes('pos')) setInquiryType('pos');
      else if (inquiryParam.includes('sms')) setInquiryType('sms');
      else if (inquiryParam.includes('payment')) setInquiryType('payments');
      else if (inquiryParam.includes('api') || inquiryParam.includes('tech')) setInquiryType('api');
    }
    const countryParam = searchParams.get('country');
    if (countryParam) {
      const match = availableCountries.find((c) =>
        c.label.toLowerCase().includes(countryParam.toLowerCase()) ||
        c.value.toLowerCase().includes(countryParam.toLowerCase())
      );
      if (match) setCountry(match.value);
    }
  }, [searchParams, availableCountries]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/public/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          email,
          phone,
          orgName,
          roleTitle,
          country,
          inquiryType,
          message,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to submit inquiry. Please check your entries.');
      }

      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTechInquiryClick = () => {
    setInquiryType('api');
    window.scrollTo({ top: 380, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white text-[#2A292D] font-sans pb-24">
      {/* 1 — TOP HEADER SECTION */}
      <section className="pt-16 sm:pt-20 px-4 text-center max-w-3xl mx-auto">
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#3BBA93] text-white flex items-center justify-center mx-auto shadow-lg shadow-[#3BBA93]/25 mb-6">
          <Headphones className="w-8 h-8 sm:w-10 sm:h-10" strokeWidth={2.2} />
        </div>

        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-[#2A292D] leading-[1.12]">
          Talk to AvadaPay
        </h1>

        <p className="mt-4 text-base sm:text-lg font-semibold text-[#2A292D]/85 leading-relaxed max-w-2xl mx-auto">
          Tell us where your business operates and what you need to collect, send,
          automate, or integrate. Our team will help you identify the right setup.
        </p>
      </section>

      {/* 2 — CONTACT FORM */}
      <section className="pt-12 sm:pt-16 px-4">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-center font-extrabold text-2xl sm:text-3xl text-[#2A292D] mb-8">
            Contact Form
          </h2>

          {submitted ? (
            <div className="rounded-3xl border-2 border-[#3BBA93] bg-[#E3F5EE]/40 p-8 sm:p-12 text-center space-y-4 shadow-xl">
              <CheckCircle2 className="w-14 h-14 text-[#3BBA93] mx-auto animate-bounce" />
              <h3 className="text-2xl font-extrabold text-[#2A292D]">Thank you!</h3>
              <p className="text-base font-semibold text-[#2A292D]/85 max-w-md mx-auto">
                Your message has been sent directly to the AvadaPay team. An enterprise specialist
                will review your request and follow up within one business day.
              </p>
              <div className="pt-4">
                <Button
                  onClick={() => {
                    setSubmitted(false);
                    setFullName('');
                    setEmail('');
                    setPhone('');
                    setOrgName('');
                    setRoleTitle('');
                    setMessage('');
                  }}
                  variant="outline"
                  className="border-[#3BBA93] text-[#3BBA93] hover:bg-[#3BBA93] hover:text-white font-bold rounded-xl"
                >
                  Send another inquiry
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm flex items-center space-x-2">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Full Name */}
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-sm font-bold text-[#2A292D]">
                  Full Name *
                </Label>
                <Input
                  id="fullName"
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your name"
                  className="h-12 rounded-xl border-2 border-[#3BBA93] bg-white text-base px-4 focus-visible:ring-1 focus-visible:ring-[#3BBA93] focus-visible:border-[#3BBA93]"
                />
              </div>

              {/* Work Email & Phone Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-bold text-[#2A292D]">
                    Business Email *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="h-12 rounded-xl border-2 border-[#3BBA93] bg-white text-base px-4 focus-visible:ring-1 focus-visible:ring-[#3BBA93] focus-visible:border-[#3BBA93]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-bold text-[#2A292D]">
                    Phone / WhatsApp
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+250 788 000 000"
                    className="h-12 rounded-xl border-2 border-[#3BBA93] bg-white text-base px-4 focus-visible:ring-1 focus-visible:ring-[#3BBA93] focus-visible:border-[#3BBA93]"
                  />
                </div>
              </div>

              {/* Organization name & Role */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="orgName" className="text-sm font-bold text-[#2A292D]">
                    Organization Name
                  </Label>
                  <Input
                    id="orgName"
                    type="text"
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    placeholder="Your company"
                    className="h-12 rounded-xl border-2 border-[#3BBA93] bg-white text-base px-4 focus-visible:ring-1 focus-visible:ring-[#3BBA93] focus-visible:border-[#3BBA93]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="roleTitle" className="text-sm font-bold text-[#2A292D]">
                    Role / Job Title
                  </Label>
                  <Input
                    id="roleTitle"
                    type="text"
                    value={roleTitle}
                    onChange={(e) => setRoleTitle(e.target.value)}
                    placeholder="e.g. Finance Director / CTO"
                    className="h-12 rounded-xl border-2 border-[#3BBA93] bg-white text-base px-4 focus-visible:ring-1 focus-visible:ring-[#3BBA93] focus-visible:border-[#3BBA93]"
                  />
                </div>
              </div>

              {/* Country */}
              <div className="space-y-2">
                <Label htmlFor="country" className="text-sm font-bold text-[#2A292D]">
                  Operational Country *
                </Label>
                <Select value={country} onValueChange={setCountry}>
                  <SelectTrigger
                    id="country"
                    className="h-12 rounded-xl border-2 border-[#3BBA93] bg-white text-base px-4 focus:ring-1 focus:ring-[#3BBA93]"
                  >
                    <SelectValue placeholder="Select Country" />
                  </SelectTrigger>
                  <SelectContent className="bg-white rounded-xl shadow-xl border border-gray-100 max-h-60 overflow-y-auto">
                    {availableCountries.map((c) => (
                      <SelectItem key={c.value} value={c.value} className="text-sm font-semibold">
                        {c.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Type of Inquiry */}
              <div className="space-y-2">
                <Label htmlFor="inquiryType" className="text-sm font-bold text-[#2A292D]">
                  Type of Inquiry *
                </Label>
                <Select value={inquiryType} onValueChange={setInquiryType}>
                  <SelectTrigger
                    id="inquiryType"
                    className="h-12 rounded-xl border-2 border-[#3BBA93] bg-white text-base px-4 focus:ring-1 focus:ring-[#3BBA93]"
                  >
                    <SelectValue placeholder="Select Inquiry Type" />
                  </SelectTrigger>
                  <SelectContent className="bg-white rounded-xl shadow-xl border border-gray-100 max-h-60 overflow-y-auto">
                    {availableInquiryTypes.map((t) => (
                      <SelectItem key={t.value} value={t.value} className="text-sm font-semibold">
                        {t.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Message */}
              <div className="space-y-2">
                <Label htmlFor="message" className="text-sm font-bold text-[#2A292D]">
                  Message *
                </Label>
                <textarea
                  id="message"
                  required
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us about your business, transaction volumes, and integration goals..."
                  className="w-full rounded-xl border-2 border-[#3BBA93] bg-white p-4 text-base focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#3BBA93] focus-visible:border-[#3BBA93]"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#3BBA93] hover:bg-[#32a481] text-white font-extrabold h-12 rounded-xl text-base shadow-md shadow-[#3BBA93]/20 flex items-center justify-center space-x-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Sending inquiry...</span>
                    </>
                  ) : (
                    <span>Submit Inquiry</span>
                  )}
                </Button>
              </div>
            </form>
          )}
        </div>
      </section>

      {/* 3 — CONTACTS & DEVELOPER INTEGRATIONS */}
      <section className="mt-16 sm:mt-24 px-4 max-w-4xl mx-auto">
        <div className="rounded-3xl bg-[#2A292D] text-white p-8 sm:p-12 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h3 className="text-2xl sm:text-3xl font-black text-white">
              Need Direct Technical Docs?
            </h3>
            <p className="mt-3 text-sm sm:text-base font-semibold text-white/80 max-w-lg leading-relaxed">
              Explore API specifications for Collections, Disbursements, STK Push callbacks, and SMS webhooks.
            </p>
          </div>
          <Button
            onClick={handleTechInquiryClick}
            className="bg-[#3BBA93] hover:bg-[#32a481] text-white font-black px-8 h-12 rounded-xl text-sm flex-shrink-0"
          >
            Technical Inquiry
          </Button>
        </div>
      </section>
    </div>
  );
};
