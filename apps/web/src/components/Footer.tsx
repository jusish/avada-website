import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Mail, Globe2, Shield } from 'lucide-react';
import { COUNTRIES } from './Navbar';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-border bg-[#0B132B] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <Link to="/" className="flex items-center space-x-2">
              <img
                src="/logo.svg"
                alt="AvadaPay"
                className="h-8 w-auto object-contain brightness-0 invert"
              />
            </Link>
            <p className="text-sm text-gray-300 leading-relaxed">
              AvadaPay is a trusted pan-African payment platform and SMS aggregator, powering seamless mobile money, card payments, and corporate payouts across 17+ markets.
            </p>
            <div className="flex items-center space-x-2 text-xs text-gray-400 pt-2">
              <ShieldCheck className="w-4 h-4 text-[#3BBA93]" />
              <span>PCI-DSS Compliant & Central Bank Licensed</span>
            </div>
          </div>

          {/* Solutions */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Solutions
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/payment-processing" className="text-gray-400 hover:text-[#3BBA93] transition-colors">
                  Payment Processing
                </Link>
              </li>
              <li>
                <Link to="/pos" className="text-gray-400 hover:text-[#3BBA93] transition-colors">
                  POS Terminals
                </Link>
              </li>
              <li>
                <Link to="/bulk-sms" className="text-gray-400 hover:text-[#3BBA93] transition-colors">
                  Bulk SMS & OTPs
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-[#3BBA93] transition-colors">
                  Developer APIs & SDKs
                </Link>
              </li>
            </ul>
          </div>

          {/* Regional Markets (Country Pages) */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Markets Present In
            </h4>
            <ul className="space-y-2.5 text-sm">
              {COUNTRIES.map((c) => (
                <li key={c.code}>
                  <Link
                    to={c.path}
                    className="flex items-center space-x-2 text-gray-400 hover:text-[#3BBA93] transition-colors"
                  >
                    <span>{c.flag}</span>
                    <span>{c.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect & CMS Portal Access */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Contact & System
            </h4>
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <Mail className="w-4 h-4 text-[#3BBA93]" />
              <span>support@avadapay.com</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <Globe2 className="w-4 h-4 text-[#3BBA93]" />
              <span>Operating in 17+ African Markets</span>
            </div>

            {/* CMS Portal Access Link (Moved from Header as requested) */}
            <div className="pt-4 border-t border-white/10">
              <Link
                to="/admin/login"
                className="inline-flex items-center space-x-2 text-xs font-semibold px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-gray-300 hover:text-[#3BBA93] hover:border-[#3BBA93]/40 transition-all"
              >
                <Shield className="w-3.5 h-3.5 text-[#3BBA93]" />
                <span>AvadaPay CMS Portal</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 space-y-4 sm:space-y-0">
          <p>© {new Date().getFullYear()} AvadaPay. All rights reserved.</p>
          <div className="flex space-x-6">
            <Link to="/contact" className="hover:text-white transition-colors">Contact</Link>
            <a href="#privacy" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#terms" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
