import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Headphones, CheckCircle2 } from 'lucide-react';
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

const INQUIRY_TYPES = [
  { value: 'sms', label: 'SMS Pricing' },
  { value: 'payments', label: 'Payment Processing (Collections & Payouts)' },
  { value: 'pos', label: 'POS Terminal Solutions' },
  { value: 'pos_demo', label: 'POS System Demo' },
  { value: 'api', label: 'Technical & API Integration' },
  { value: 'partner', label: 'Enterprise Partnership' },
  { value: 'general', label: 'General Inquiry' },
];

const COUNTRIES = [
  { value: 'DRC', label: 'Democratic Republic of Congo (DRC)' },
  { value: 'Kenya', label: 'Kenya' },
  { value: 'Tanzania', label: 'Tanzania' },
  { value: 'Rwanda', label: 'Rwanda' },
  { value: 'Uganda', label: 'Uganda' },
  { value: 'Nigeria', label: 'Nigeria' },
  { value: 'Ghana', label: 'Ghana' },
  { value: 'South Africa', label: 'South Africa' },
  { value: 'Zambia', label: 'Zambia' },
  { value: 'Other', label: 'Other' },
];

export const ContactPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [inquiryType, setInquiryType] = useState<string>('sms');
  const [country, setCountry] = useState<string>('DRC');
  const [fullName, setFullName] = useState<string>('');
  const [orgName, setOrgName] = useState<string>('');
  const [roleTitle, setRoleTitle] = useState<string>('');
  const [message, setMessage] = useState<string>('');

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
      const match = COUNTRIES.find((c) =>
        c.label.toLowerCase().includes(countryParam.toLowerCase()) ||
        c.value.toLowerCase().includes(countryParam.toLowerCase())
      );
      if (match) setCountry(match.value);
    }
  }, [searchParams]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
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
                Your message has been sent to the AvadaPay team. A product specialist will follow
                up within 24 business hours.
              </p>
              <div className="pt-4">
                <Button
                  onClick={() => setSubmitted(false)}
                  variant="outline"
                  className="border-[#3BBA93] text-[#3BBA93] hover:bg-[#3BBA93] hover:text-white font-bold rounded-xl"
                >
                  Send another inquiry
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Full Name */}
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-sm font-bold text-[#2A292D]">
                  Full Name
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

              {/* Organization name */}
              <div className="space-y-2">
                <Label htmlFor="orgName" className="text-sm font-bold text-[#2A292D]">
                  Organization name
                </Label>
                <Input
                  id="orgName"
                  type="text"
                  required
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  placeholder="Your company"
                  className="h-12 rounded-xl border-2 border-[#3BBA93] bg-white text-base px-4 focus-visible:ring-1 focus-visible:ring-[#3BBA93] focus-visible:border-[#3BBA93]"
                />
              </div>

              {/* Role/Title */}
              <div className="space-y-2">
                <Label htmlFor="roleTitle" className="text-sm font-bold text-[#2A292D]">
                  Role/Title
                </Label>
                <Input
                  id="roleTitle"
                  type="text"
                  required
                  value={roleTitle}
                  onChange={(e) => setRoleTitle(e.target.value)}
                  placeholder="Enter your role or job title"
                  className="h-12 rounded-xl border-2 border-[#3BBA93] bg-white text-base px-4 focus-visible:ring-1 focus-visible:ring-[#3BBA93] focus-visible:border-[#3BBA93]"
                />
              </div>

              {/* Country */}
              <div className="space-y-2">
                <Label htmlFor="country" className="text-sm font-bold text-[#2A292D]">
                  Country
                </Label>
                <Select value={country} onValueChange={setCountry}>
                  <SelectTrigger
                    id="country"
                    className="h-12 rounded-xl border-2 border-[#3BBA93] bg-white text-base px-4 focus:ring-1 focus:ring-[#3BBA93]"
                  >
                    <SelectValue placeholder="Select Country" />
                  </SelectTrigger>
                  <SelectContent className="bg-white rounded-xl shadow-xl border border-gray-100">
                    {COUNTRIES.map((c) => (
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
                  Type of Inquiry
                </Label>
                <Select value={inquiryType} onValueChange={setInquiryType}>
                  <SelectTrigger
                    id="inquiryType"
                    className="h-12 rounded-xl border-2 border-[#3BBA93] bg-white text-base px-4 focus:ring-1 focus:ring-[#3BBA93]"
                  >
                    <SelectValue placeholder="Select Inquiry Type" />
                  </SelectTrigger>
                  <SelectContent className="bg-white rounded-xl shadow-xl border border-gray-100">
                    {INQUIRY_TYPES.map((t) => (
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
                  Message
                </Label>
                <textarea
                  id="message"
                  required
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="How can we help you"
                  className="w-full rounded-xl border-2 border-[#3BBA93] bg-white p-4 text-base focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#3BBA93] focus-visible:border-[#3BBA93]"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <Button
                  type="submit"
                  className="w-full bg-[#3BBA93] hover:bg-[#32a481] text-white font-extrabold h-12 rounded-xl text-base shadow-md shadow-[#3BBA93]/20"
                >
                  Submit
                </Button>
              </div>
            </form>
          )}
        </div>
      </section>

      {/* 3 — NEED API OR INTEGRATION SUPPORT? */}
      <section className="pt-24 sm:pt-28 px-4 text-center max-w-3xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-black text-[#2A292D] tracking-tight">
          <span className="text-[#3BBA93]">Need API</span> or Integration
          <br />
          Support?
        </h2>

        <p className="mt-4 text-base sm:text-lg font-semibold text-[#2A292D]/85 leading-relaxed max-w-2xl mx-auto">
          Tell us where your business operates and what you need to collect, send,
          automate, or integrate. Our team will help you identify the right setup.
        </p>

        <div className="mt-8">
          <Button
            onClick={handleTechInquiryClick}
            className="bg-[#3BBA93] hover:bg-[#32a481] text-white font-extrabold px-8 h-12 rounded-xl text-base shadow-md shadow-[#3BBA93]/20"
          >
            Technical Inquiry
          </Button>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
