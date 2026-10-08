import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronDown, Menu, X } from 'lucide-react';
import { CountryFlag } from '@/components/CountryFlag';
import { useSiteConfig } from '@/context/SiteConfigContext';

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
  const { countries: dynamicCountries } = useSiteConfig();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [countryDropdownOpen, setCountryDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const activeCountries: CountryInfo[] =
    dynamicCountries && dynamicCountries.length > 0
      ? dynamicCountries.map((c) => ({
          code: c.code,
          name: c.name,
          path: `/countries/${c.slug}`,
        }))
      : COUNTRIES;

  const variant: 'overlay' | 'light' | 'dark' =
    location.pathname === '/' ? 'overlay' : location.pathname === '/contact' ? 'light' : 'dark';
  const onLight = variant === 'light';
  const currentCountry = activeCountries.find((c) => location.pathname === c.path);

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
    <header
      className={`top-0 z-50 w-full transition-colors ${
        variant === 'overlay'
          ? 'absolute left-0 right-0 bg-transparent'
          : variant === 'light'
            ? 'sticky bg-white'
            : 'sticky bg-[#2A292D]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
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
          <nav className="flex items-center bg-[#3BBA93] rounded-full px-5 py-2.5 space-x-2">
            {mainLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3.5 py-1 rounded-full text-[13px] font-bold transition-colors ${
                    isActive
                      ? 'text-white bg-black/10'
                      : 'text-white hover:bg-black/10'
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
              className={`flex items-center space-x-2 text-[13px] font-bold transition-colors px-2.5 py-1.5 rounded-lg ${
                onLight
                  ? 'text-[#2A292D] hover:bg-black/5'
                  : 'text-white/90 hover:text-white hover:bg-white/10'
              }`}
            >
              {currentCountry ? (
                <span className="flex items-center space-x-2">
                  <span>{currentCountry.name}</span>
                  <CountryFlag country={currentCountry.code} className="w-5 h-3.5" />
                </span>
              ) : (
                <span className="flex items-center space-x-1.5">
                  <span>Countries</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${countryDropdownOpen ? 'rotate-180' : ''}`} />
                </span>
              )}
            </button>

            {countryDropdownOpen && (
              <div className="absolute right-0 mt-2 w-44 rounded-xl bg-white shadow-2xl border border-gray-100 py-1.5 z-50 animate-in fade-in-0 zoom-in-95">
                {activeCountries.map((c) => (
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
              className="bg-[#3BBA93] hover:bg-[#32a481] text-white font-bold rounded-md px-7 h-11 text-base transition-transform active:scale-95"
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
            className={onLight ? 'text-[#2A292D] hover:bg-black/5' : 'text-white hover:bg-white/10'}
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
            {activeCountries.map((c) => (
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
