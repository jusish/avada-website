import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronDown, Menu, X } from 'lucide-react';
import { CountryFlag } from '@/components/CountryFlag';

export interface CountryInfo {
  code: string;
  name: string;
  flag?: string;
  path: string;
}

export const COUNTRIES: CountryInfo[] = [
  { code: 'kenya', name: 'Kenya', path: '/countries/kenya' },
  { code: 'rwanda', name: 'Rwanda', path: '/countries/rwanda' },
  { code: 'tanzania', name: 'Tanzania', path: '/countries/tanzania' },
];

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [countryDropdownOpen, setCountryDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const currentCountry = COUNTRIES.find((c) => location.pathname === c.path);

  const mainLinks = [
    { name: 'Payment Processing', path: '/payment-processing' },
    { name: 'POS', path: '/pos' },
    { name: 'Bulk SMS', path: '/bulk-sms' },
  ];

  const handleCountrySelect = (path: string) => {
    setCountryDropdownOpen(false);
    navigate(path);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-[#2A292D] border-b border-white/5 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Official AvadaPay Logo */}
        <Link to="/" className="flex items-center space-x-2 flex-shrink-0">
          <img
            src="/logo.svg"
            alt="AvadaPay"
            className="h-6 sm:h-7 w-auto object-contain"
          />
        </Link>

        {/* Center: Pill Navigation Capsule + Countries Selector */}
        <div className="hidden lg:flex items-center space-x-5">
          {/* Main Services Pill Capsule */}
          <nav className="flex items-center bg-[#3BBA93] rounded-full px-3.5 py-1.5 shadow-md space-x-1">
            {mainLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3.5 py-1 rounded-full text-[13px] font-medium transition-colors ${
                    isActive
                      ? 'text-[#3BBA93] bg-white font-semibold shadow-xs'
                      : 'text-white hover:text-white/90 hover:bg-black/10'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Countries Dropdown (Each Country is a Dedicated Page) */}
          <div className="relative">
            <button
              onClick={() => setCountryDropdownOpen(!countryDropdownOpen)}
              onBlur={() => setTimeout(() => setCountryDropdownOpen(false), 200)}
              className="flex items-center space-x-2 text-[13px] font-medium text-white/90 hover:text-white transition-colors px-2.5 py-1.5 rounded-lg hover:bg-white/10"
            >
              {currentCountry && <CountryFlag country={currentCountry.code} className="w-4 h-2.5" />}
              <span>{currentCountry ? currentCountry.name : 'Countries'}</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${countryDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {countryDropdownOpen && (
              <div className="absolute right-0 mt-2 w-44 rounded-xl bg-white shadow-2xl border border-gray-100 py-1.5 z-50 animate-in fade-in-0 zoom-in-95">
                <div className="px-3 py-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  Select Country
                </div>
                {COUNTRIES.map((c) => (
                  <button
                    key={c.code}
                    onMouseDown={() => handleCountrySelect(c.path)}
                    className={`w-full flex items-center space-x-2.5 px-3 py-2 text-xs text-left hover:bg-gray-50 transition-colors ${
                      location.pathname === c.path ? 'bg-gray-50 text-[#3BBA93] font-semibold' : 'text-gray-700'
                    }`}
                  >
                    <CountryFlag country={c.code} className="w-4 h-3" />
                    <span>{c.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Primary "Contact Us" Button */}
        <div className="hidden lg:flex items-center">
          <Link to="/contact">
            <Button
              size="sm"
              className="bg-[#3BBA93] hover:bg-[#32a481] text-white font-semibold rounded-lg px-5 h-9 text-xs shadow-md shadow-[#3BBA93]/20 transition-transform active:scale-95"
            >
              Contact Us
            </Button>
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="lg:hidden flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-white hover:bg-white/10"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#2A292D] border-b border-white/10 px-6 pt-3 pb-8 space-y-4">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3">
              Services
            </p>
            {mainLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-white hover:bg-white/10"
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="pt-2 border-t border-white/10 space-y-1">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3">
              Markets & Countries
            </p>
            {COUNTRIES.map((c) => (
              <Link
                key={c.code}
                to={c.path}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center space-x-2.5 px-3 py-2 rounded-lg text-sm font-medium text-white hover:bg-white/10"
              >
                <CountryFlag country={c.code} className="w-5 h-3.5" />
                <span>{c.name}</span>
              </Link>
            ))}
          </div>

          <div className="pt-4 border-t border-white/10">
            <Link to="/contact" onClick={() => setMobileMenuOpen(false)}>
              <Button className="w-full bg-[#3BBA93] hover:bg-[#32a481] text-white font-semibold h-10 text-sm">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
