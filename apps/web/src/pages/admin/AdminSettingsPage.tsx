import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { GeneralContacts, SocialLink, FooterConfig } from '@avada/shared';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Settings,
  Mail,
  Phone,
  Building,
  Share2,
  Plus,
  Trash2,
  Save,
  CheckCircle2,
  Globe,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';

export const AdminSettingsPage: React.FC = () => {
  const { token, canEdit } = useAuth();
  const [savingContacts, setSavingContacts] = useState(false);
  const [savingSocials, setSavingSocials] = useState(false);
  const [savingFooter, setSavingFooter] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // General Contacts State
  const [contacts, setContacts] = useState<GeneralContacts>({
    supportEmail: '',
    supportPhone: '',
    salesEmail: '',
    officeAddress: '',
  });

  // Footer Disclaimer & Copyright
  const [footer, setFooter] = useState<FooterConfig>({
    disclaimerText: '',
    copyrightText: '',
  });

  // Social Links
  const [socials, setSocials] = useState<SocialLink[]>([]);

  // Fetch Settings
  useEffect(() => {
    if (!token) return;
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/admin/settings', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success && data.data) {
          if (data.data.general_contacts) setContacts(data.data.general_contacts);
          if (data.data.footer_config) setFooter(data.data.footer_config);
          if (Array.isArray(data.data.social_links)) setSocials(data.data.social_links);
        }
      } catch (err) {
        console.error('Failed to load settings:', err);
      }
    };

    fetchSettings();
  }, [token]);

  const showSuccess = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  // Save General Contacts
  const handleSaveContacts = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !canEdit('settings')) return;
    setSavingContacts(true);
    try {
      const res = await fetch('/api/admin/settings/general_contacts', {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ value: contacts }),
      });
      const data = await res.json();
      if (data.success) {
        showSuccess('Contact details successfully updated.');
      }
    } catch (err) {
      console.error('Failed to save contacts:', err);
    } finally {
      setSavingContacts(false);
    }
  };

  // Save Footer Texts
  const handleSaveFooter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !canEdit('settings')) return;
    setSavingFooter(true);
    try {
      const res = await fetch('/api/admin/settings/footer_config', {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ value: footer }),
      });
      const data = await res.json();
      if (data.success) {
        showSuccess('Footer brand copy and copyright updated.');
      }
    } catch (err) {
      console.error('Failed to save footer:', err);
    } finally {
      setSavingFooter(false);
    }
  };

  // Save Socials
  const handleSaveSocials = async () => {
    if (!token || !canEdit('settings')) return;
    setSavingSocials(true);
    try {
      const res = await fetch('/api/admin/settings/social_links', {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ value: socials }),
      });
      const data = await res.json();
      if (data.success) {
        showSuccess('Social channels and link targets updated.');
      }
    } catch (err) {
      console.error('Failed to save socials:', err);
    } finally {
      setSavingSocials(false);
    }
  };

  // Add a new social link row
  const handleAddSocial = () => {
    const newLink: SocialLink = {
      key: `social_${Date.now()}`,
      name: 'Custom Channel',
      url: 'https://',
      enabled: true,
      target: '_blank',
    };
    setSocials([...socials, newLink]);
  };

  // Remove social link
  const handleRemoveSocial = (index: number) => {
    setSocials(socials.filter((_, idx) => idx !== index));
  };

  // Update social field
  const handleSocialChange = (index: number, field: keyof SocialLink, value: SocialLink[keyof SocialLink]) => {
    setSocials((prev) =>
      prev.map((item, idx) => (idx === index ? { ...item, [field]: value } : item))
    );
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#2A292D] flex items-center gap-2">
            <Settings className="w-6 h-6 text-[#3BBA93]" />
            <span>Site Settings & Footer Controls</span>
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Centrally control global contact points, footer information, and social media links across AvadaPay.
          </p>
        </div>

        {successMessage && (
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-[#3BBA93]" />
            <span>{successMessage}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card 1: Official Corporate Contacts */}
        <Card className="bg-white border-gray-200/80 shadow-sm rounded-xl overflow-hidden">
          <CardHeader className="bg-gray-50/70 border-b border-gray-100 p-5">
            <CardTitle className="text-sm font-bold text-[#2A292D] flex items-center gap-2">
              <Building className="w-4 h-4 text-[#3BBA93]" />
              <span>Corporate Contacts & Global Inquiries</span>
            </CardTitle>
            <p className="text-[11px] text-gray-500">
              Displayed in the footer, contact page, and official transactional headers.
            </p>
          </CardHeader>
          <CardContent className="p-5">
            <form onSubmit={handleSaveContacts} className="space-y-4 text-xs">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[#3BBA93]" />
                  <span>Support Email Address</span>
                </label>
                <input
                  type="email"
                  required
                  value={contacts.supportEmail}
                  onChange={(e) => setContacts({ ...contacts, supportEmail: e.target.value })}
                  placeholder="info@avadapay.com"
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#3BBA93] focus:bg-white text-[#2A292D]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-[#3BBA93]" />
                  <span>Corporate Phone Line</span>
                </label>
                <input
                  type="text"
                  required
                  value={contacts.supportPhone}
                  onChange={(e) => setContacts({ ...contacts, supportPhone: e.target.value })}
                  placeholder="+260 968 332 766"
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#3BBA93] focus:bg-white text-[#2A292D]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-blue-500" />
                  <span>Sales & Enterprise Email</span>
                </label>
                <input
                  type="email"
                  value={contacts.salesEmail || ''}
                  onChange={(e) => setContacts({ ...contacts, salesEmail: e.target.value })}
                  placeholder="sales@avadapay.com"
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#3BBA93] focus:bg-white text-[#2A292D]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-purple-500" />
                  <span>Global Headquarters Address</span>
                </label>
                <textarea
                  rows={2}
                  value={contacts.officeAddress}
                  onChange={(e) => setContacts({ ...contacts, officeAddress: e.target.value })}
                  placeholder="Physical office address..."
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#3BBA93] focus:bg-white text-[#2A292D]"
                />
              </div>

              <div className="pt-2 flex justify-end">
                {canEdit('settings') && (
                  <Button
                    type="submit"
                    disabled={savingContacts}
                    variant="gradient"
                    size="sm"
                    className="rounded-xl text-xs font-bold space-x-1.5"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{savingContacts ? 'Saving...' : 'Save Corporate Contacts'}</span>
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Card 2: Footer Copy & Legal Disclaimers */}
        <Card className="bg-white border-gray-200/80 shadow-sm rounded-xl overflow-hidden">
          <CardHeader className="bg-gray-50/70 border-b border-gray-100 p-5">
            <CardTitle className="text-sm font-bold text-[#2A292D] flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#3BBA93]" />
              <span>Footer Brand Copy & Copyright</span>
            </CardTitle>
            <p className="text-[11px] text-gray-500">
              Customize bottom brand narrative and legal copyright statements.
            </p>
          </CardHeader>
          <CardContent className="p-5">
            <form onSubmit={handleSaveFooter} className="space-y-4 text-xs">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Brand Narrative / Disclaimer Text
                </label>
                <textarea
                  rows={4}
                  value={footer.disclaimerText}
                  onChange={(e) => setFooter({ ...footer, disclaimerText: e.target.value })}
                  placeholder="AvadaPay is a pan-African payment gateway and SMS aggregator..."
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#3BBA93] focus:bg-white text-[#2A292D] leading-relaxed"
                />
                <span className="text-[10px] text-gray-400 mt-1 block">
                  Rendered at the bottom of every page on the public website.
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Copyright Notice Text
                </label>
                <input
                  type="text"
                  value={footer.copyrightText}
                  onChange={(e) => setFooter({ ...footer, copyrightText: e.target.value })}
                  placeholder="© AvadaPay 2026. All rights reserved."
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#3BBA93] focus:bg-white text-[#2A292D]"
                />
              </div>

              <div className="pt-2 flex justify-end">
                {canEdit('settings') && (
                  <Button
                    type="submit"
                    disabled={savingFooter}
                    variant="gradient"
                    size="sm"
                    className="rounded-xl text-xs font-bold space-x-1.5"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{savingFooter ? 'Saving...' : 'Save Footer Copy'}</span>
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Card 3: Social Media Channels & Window Target Controls */}
      <Card className="bg-white border-gray-200/80 shadow-sm rounded-xl overflow-hidden">
        <CardHeader className="bg-gray-50/70 border-b border-gray-100 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <CardTitle className="text-sm font-bold text-[#2A292D] flex items-center gap-2">
              <Share2 className="w-4 h-4 text-[#3BBA93]" />
              <span>Social Media Channels & Target Window Management</span>
            </CardTitle>
            <p className="text-[11px] text-gray-500 mt-0.5">
              Configure each platform with direct link URLs, active visibility, and choice of opening in a new tab or current tab.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {canEdit('settings') && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAddSocial}
                  className="rounded-lg text-xs font-semibold border-gray-200 space-x-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Channel</span>
                </Button>
                <Button
                  variant="gradient"
                  size="sm"
                  onClick={handleSaveSocials}
                  disabled={savingSocials}
                  className="rounded-lg text-xs font-semibold space-x-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{savingSocials ? 'Saving...' : 'Save Social Links'}</span>
                </Button>
              </>
            )}
          </div>
        </CardHeader>

        <CardContent className="p-5">
          <div className="space-y-3">
            {socials.length === 0 ? (
              <p className="text-xs text-gray-400 py-6 text-center">No social media links defined.</p>
            ) : (
              socials.map((soc, idx) => (
                <div
                  key={soc.key || idx}
                  className="p-3 rounded-lg bg-gray-50/80 border border-gray-200/80 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
                >
                  {/* Channel Name */}
                  <div className="w-full md:w-44">
                    <label className="text-[11px] text-gray-500 font-medium block mb-1">
                      Network Name
                    </label>
                    <input
                      type="text"
                      value={soc.name}
                      onChange={(e) => handleSocialChange(idx, 'name', e.target.value)}
                      placeholder="e.g. LinkedIn"
                      className="w-full p-2 bg-white border border-gray-200 rounded-lg font-semibold text-gray-800 text-xs"
                    />
                  </div>

                  {/* URL */}
                  <div className="flex-1">
                    <label className="text-[11px] text-gray-500 font-medium block mb-1">
                      Target URL
                    </label>
                    <input
                      type="url"
                      value={soc.url || ''}
                      onChange={(e) => handleSocialChange(idx, 'url', e.target.value)}
                      placeholder="https://..."
                      className="w-full p-2 bg-white border border-gray-200 rounded-lg text-gray-700 text-xs font-mono"
                    />
                  </div>

                  {/* Window Target Dropdown */}
                  <div className="w-full md:w-44">
                    <label className="text-[11px] text-gray-500 font-medium block mb-1">
                      Window Target
                    </label>
                    <Select
                      value={soc.target || '_blank'}
                      onValueChange={(val) =>
                        handleSocialChange(idx, 'target', val as '_blank' | '_self')
                      }
                    >
                      <SelectTrigger className="w-full h-8 bg-white border-gray-200 rounded-lg text-xs font-medium">
                        <SelectValue placeholder="Window Target" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="_blank">New Tab (_blank)</SelectItem>
                        <SelectItem value="_self">Current Tab (_self)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Enabled Toggle */}
                  <div className="flex items-center gap-2 pt-2 md:pt-4">
                    <button
                      type="button"
                      onClick={() => handleSocialChange(idx, 'enabled', !soc.enabled)}
                      className="flex items-center gap-1.5 text-xs font-bold text-gray-700 cursor-pointer"
                    >
                      {soc.enabled ? (
                        <>
                          <ToggleRight className="w-6 h-6 text-[#3BBA93]" />
                          <span className="text-emerald-700 font-semibold text-[11px]">Enabled</span>
                        </>
                      ) : (
                        <>
                          <ToggleLeft className="w-6 h-6 text-gray-300" />
                          <span className="text-gray-400 font-semibold text-[11px]">Off</span>
                        </>
                      )}
                    </button>

                    {canEdit('settings') && (
                      <button
                        type="button"
                        onClick={() => handleRemoveSocial(idx)}
                        className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors ml-2"
                        title="Remove link"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
