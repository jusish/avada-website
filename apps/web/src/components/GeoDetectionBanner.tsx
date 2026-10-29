import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { MapPin, ArrowRight, X } from 'lucide-react';

interface GeoDetectionBannerProps {
  countryName: string;
}

export const GeoDetectionBanner: React.FC<GeoDetectionBannerProps> = ({ countryName }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (searchParams.get('detected') === '1') {
      setVisible(true);
    }
  }, [searchParams]);

  if (!visible) return null;

  const handleSwitchToGlobal = () => {
    localStorage.setItem('avada_country_preference', 'global');
    setVisible(false);
    navigate('/?ref=global');
  };

  const handleDismiss = () => {
    setVisible(false);
  };

  return (
    <div className="bg-[#1E1D21] border-b border-white/10 text-white px-4 py-2.5 transition-all animate-in fade-in-0 slide-in-from-top-2">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-white/90 font-medium">
          <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#3BBA93]/20 text-[#3BBA93] shrink-0">
            <MapPin className="w-3 h-3" />
          </span>
          <span>
            We routed you to <strong className="text-white font-bold">{countryName}</strong> based on your detected location.
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleSwitchToGlobal}
            className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-[#3BBA93] font-bold transition-colors"
          >
            <span>Switch to Global Site</span>
            <ArrowRight className="w-3 h-3" />
          </button>
          <button
            type="button"
            onClick={handleDismiss}
            aria-label="Dismiss banner"
            className="p-1 text-gray-400 hover:text-white rounded-md transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
