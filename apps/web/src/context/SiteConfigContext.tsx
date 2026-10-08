import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Country, InquiryType, GeneralContacts, SocialLink, FooterConfig, PublicSiteConfig } from '@avada/shared';

interface SiteConfigContextType {
  countries: Country[];
  inquiryTypes: InquiryType[];
  contacts: GeneralContacts;
  socials: SocialLink[];
  footer: FooterConfig;
  loading: boolean;
  refreshConfig: () => Promise<void>;
}

const DEFAULT_CONTACTS: GeneralContacts = {
  supportEmail: 'info@avadapay.com',
  supportPhone: '+260 968 332 766',
  salesEmail: 'sales@avadapay.com',
  officeAddress: '25th floor, SORP Business Centre, Tameem House, Barsha Heights, Dubai (UAE)',
};

const DEFAULT_SOCIALS: SocialLink[] = [
  { key: 'facebook', name: 'Facebook', url: 'https://facebook.com/avadapay', enabled: true, target: '_blank' },
  { key: 'linkedin', name: 'LinkedIn', url: 'https://linkedin.com/company/avadapay', enabled: true, target: '_blank' },
  { key: 'x', name: 'X', url: 'https://x.com/avadapay', enabled: true, target: '_blank' },
];

const DEFAULT_FOOTER: FooterConfig = {
  disclaimerText: 'AvadaPay is a pan-African payment gateway and SMS aggregator. Accept mobile money and card payments, run POS, and send automated payouts with enterprise compliance.',
  copyrightText: `© AvadaPay ${new Date().getFullYear()}. All rights reserved.`,
};

const SiteConfigContext = createContext<SiteConfigContextType>({
  countries: [],
  inquiryTypes: [],
  contacts: DEFAULT_CONTACTS,
  socials: DEFAULT_SOCIALS,
  footer: DEFAULT_FOOTER,
  loading: true,
  refreshConfig: async () => {},
});

export const SiteConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [inquiryTypes, setInquiryTypes] = useState<InquiryType[]>([]);
  const [contacts, setContacts] = useState<GeneralContacts>(DEFAULT_CONTACTS);
  const [socials, setSocials] = useState<SocialLink[]>(DEFAULT_SOCIALS);
  const [footer, setFooter] = useState<FooterConfig>(DEFAULT_FOOTER);
  const [loading, setLoading] = useState(true);

  const fetchConfig = useCallback(async () => {
    try {
      const res = await fetch('/api/public/site-config');
      const json = await res.json();
      if (json.success && json.data) {
        const data = json.data as PublicSiteConfig;
        if (Array.isArray(data.countries) && data.countries.length > 0) {
          setCountries(data.countries);
        }
        if (Array.isArray(data.inquiryTypes) && data.inquiryTypes.length > 0) {
          setInquiryTypes(data.inquiryTypes);
        }
        if (data.contacts) setContacts(data.contacts);
        if (Array.isArray(data.socials)) setSocials(data.socials);
        if (data.footer) setFooter(data.footer);
      }
    } catch (err) {
      console.warn('Failed to fetch public site config, using defaults:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConfig();
  }, [fetchConfig]);

  return (
    <SiteConfigContext.Provider
      value={{
        countries,
        inquiryTypes,
        contacts,
        socials,
        footer,
        loading,
        refreshConfig: fetchConfig,
      }}
    >
      {children}
    </SiteConfigContext.Provider>
  );
};

export const useSiteConfig = () => useContext(SiteConfigContext);
