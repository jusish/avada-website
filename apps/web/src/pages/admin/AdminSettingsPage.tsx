import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { GeneralContacts, SocialLink, FooterConfig, GlobalInquiryNotificationSettings } from '@avada/shared';
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
  Cpu,
  ArrowRight,
  Bell,
  Shield,
  X,
  MailPlus,
} from 'lucide-react';

export const AdminSettingsPage: React.FC = () => {
  const { token, canEdit, isSuperAdmin } = useAuth();
  const [savingContacts, setSavingContacts] = useState(false);
  const [savingSocials, setSavingSocials] = useState(false);
  const [savingFooter, setSavingFooter] = useState(false);
  const [savingInquirySettings, setSavingInquirySettings] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Inquiry Email Notification Settings
  const [inquirySettings, setInquirySettings] = useState<GlobalInquiryNotificationSettings>({
    globalAdminNotificationMode: 'ALL',
    globalAdminRecipients: ['winnie.odede@avadapay.com'],
  });
  const [newAdminEmail, setNewAdminEmail] = useState('');

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
          if (data.data.inquiry_notification_settings) {
            setInquirySettings(data.data.inquiry_notification_settings);
          }
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

  // Save Inquiry Notification Settings
  const handleSaveInquirySettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !canEdit('settings')) return;
    setSavingInquirySettings(true);
    try {
      const res = await fetch('/api/admin/settings/inquiry_notification_settings', {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ value: inquirySettings }),
      });
      const data = await res.json();
      if (data.success) {
        showSuccess('Global inquiry notification preferences saved.');
      } else {
        alert(data.error || 'Failed to update notification settings.');
      }
    } catch (err) {
      console.error('Failed to save inquiry notification settings:', err);
    } finally {
      setSavingInquirySettings(false);
    }
  };

  const handleAddAdminEmail = () => {
    const trimmed = newAdminEmail.trim().toLowerCase();
    if (!trimmed || !trimmed.includes('@')) return;
    if (inquirySettings.globalAdminRecipients.includes(trimmed)) return;
    setInquirySettings((prev) => ({
      ...prev,
      globalAdminRecipients: [...prev.globalAdminRecipients, trimmed],
    }));
    setNewAdminEmail('');
  };

  const handleRemoveAdminEmail = (emailToRemove: string) => {
    if (inquirySettings.globalAdminRecipients.length <= 1) {
      if (!window.confirm('Removing the last global admin recipient means no one at global level will receive email alerts. Proceed?')) {
        return;
      }
    }
    setInquirySettings((prev) => ({
      ...prev,
      globalAdminRecipients: prev.globalAdminRecipients.filter((e: string) => e !== emailToRemove),
    }));
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
                  placeholder="+971 585 899 472"
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

      {/* Card 2.5: Global Inquiry Notification Preferences (Apple Design Inset Group) */}
      <Card className="bg-white border-gray-200/90 shadow-sm rounded-2xl overflow-hidden">
        <CardHeader className="bg-gray-50/80 border-b border-gray-100 p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-200/80 text-[#3BBA93] flex items-center justify-center">
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <CardTitle className="text-sm font-bold text-[#2A292D]">
                    Global Admin Inquiry Notification Routing
                  </CardTitle>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    Controls whether Global Admin (Winnie) receives email notifications for all incoming inquiries, or only for regional markets that do not have an assigned Country Manager.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#2A292D] text-white tracking-wide">
                <Shield className="w-3 h-3 text-[#3BBA93]" />
                <span>Super Admin Only</span>
              </span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-5 sm:p-6 space-y-6">
          <form onSubmit={handleSaveInquirySettings} className="space-y-6">
            {/* Routing Mode Picker */}
            <div>
              <label className="block text-xs font-bold text-gray-800 tracking-tight mb-2">
                Global Admin Notification Routing Policy
              </label>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* Mode 1: ALL */}
                <div
                  onClick={() =>
                    setInquirySettings((prev) => ({ ...prev, globalAdminNotificationMode: 'ALL' }))
                  }
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                    inquirySettings.globalAdminNotificationMode === 'ALL'
                      ? 'bg-emerald-50/40 border-[#3BBA93] ring-2 ring-[#3BBA93]/10 shadow-xs'
                      : 'bg-gray-50/50 border-gray-200/90 hover:border-gray-300'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-[#2A292D]">
                        All Inquiries
                      </span>
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          inquirySettings.globalAdminNotificationMode === 'ALL'
                            ? 'border-[#3BBA93] bg-[#3BBA93]'
                            : 'border-gray-300'
                        }`}
                      >
                        {inquirySettings.globalAdminNotificationMode === 'ALL' && (
                          <div className="w-1.5 h-1.5 rounded-full bg-white" />
                        )}
                      </div>
                    </div>
                    <p className="text-[11px] text-gray-500 leading-relaxed">
                      Global Admin is notified by email whenever any inquiry is submitted across any country.
                    </p>
                  </div>
                  <span className="text-[10px] font-semibold text-emerald-700 mt-3 pt-2 border-t border-emerald-100/60 block">
                    Recommended for central oversight
                  </span>
                </div>

                {/* Mode 2: UNASSIGNED_ONLY */}
                <div
                  onClick={() =>
                    setInquirySettings((prev) => ({ ...prev, globalAdminNotificationMode: 'UNASSIGNED_ONLY' }))
                  }
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                    inquirySettings.globalAdminNotificationMode === 'UNASSIGNED_ONLY'
                      ? 'bg-emerald-50/40 border-[#3BBA93] ring-2 ring-[#3BBA93]/10 shadow-xs'
                      : 'bg-gray-50/50 border-gray-200/90 hover:border-gray-300'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-[#2A292D]">
                        Unassigned Markets Only
                      </span>
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          inquirySettings.globalAdminNotificationMode === 'UNASSIGNED_ONLY'
                            ? 'border-[#3BBA93] bg-[#3BBA93]'
                            : 'border-gray-300'
                        }`}
                      >
                        {inquirySettings.globalAdminNotificationMode === 'UNASSIGNED_ONLY' && (
                          <div className="w-1.5 h-1.5 rounded-full bg-white" />
                        )}
                      </div>
                    </div>
                    <p className="text-[11px] text-gray-500 leading-relaxed">
                      Global Admin only receives email alerts for countries without an assigned manager. Delegated managers receive their country's alerts directly.
                    </p>
                  </div>
                  <span className="text-[10px] font-semibold text-gray-600 mt-3 pt-2 border-t border-gray-200/60 block">
                    Decentralized delegation
                  </span>
                </div>

                {/* Mode 3: OFF */}
                <div
                  onClick={() =>
                    setInquirySettings((prev) => ({ ...prev, globalAdminNotificationMode: 'OFF' }))
                  }
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                    inquirySettings.globalAdminNotificationMode === 'OFF'
                      ? 'bg-emerald-50/40 border-[#3BBA93] ring-2 ring-[#3BBA93]/10 shadow-xs'
                      : 'bg-gray-50/50 border-gray-200/90 hover:border-gray-300'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-[#2A292D]">
                        CMS Inbox Only
                      </span>
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          inquirySettings.globalAdminNotificationMode === 'OFF'
                            ? 'border-[#3BBA93] bg-[#3BBA93]'
                            : 'border-gray-300'
                        }`}
                      >
                        {inquirySettings.globalAdminNotificationMode === 'OFF' && (
                          <div className="w-1.5 h-1.5 rounded-full bg-white" />
                        )}
                      </div>
                    </div>
                    <p className="text-[11px] text-gray-500 leading-relaxed">
                      Global Admin is never sent email notifications. All inquiries remain fully visible and actionable in the CMS Inquiries list.
                    </p>
                  </div>
                  <span className="text-[10px] font-semibold text-gray-400 mt-3 pt-2 border-t border-gray-200/60 block">
                    Quiet in-app mode
                  </span>
                </div>
              </div>
            </div>

            {/* Global Admin Email Recipients */}
            <div className="p-4 rounded-xl bg-gray-50/70 border border-gray-200/70 space-y-3">
              <label className="block text-xs font-bold text-gray-800">
                Global Administrator Notification Recipients
              </label>
              <p className="text-[11px] text-gray-500">
                These addresses receive copies of inquiries according to the policy above. Current primary administrator is Winnie Odede.
              </p>

              <div className="flex flex-wrap gap-2 pt-1">
                {inquirySettings.globalAdminRecipients.map((email: string) => (
                  <span
                    key={email}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white border border-gray-200 text-xs font-semibold text-gray-800 shadow-xs"
                  >
                    <Mail className="w-3.5 h-3.5 text-[#3BBA93]" />
                    <span>{email}</span>
                    {canEdit('settings') && isSuperAdmin && (
                      <button
                        type="button"
                        onClick={() => handleRemoveAdminEmail(email)}
                        className="text-gray-400 hover:text-red-500 transition-colors ml-1"
                        title="Remove recipient"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </span>
                ))}
              </div>

              {canEdit('settings') && isSuperAdmin && (
                <div className="flex gap-2 pt-2 max-w-md">
                  <input
                    type="email"
                    value={newAdminEmail}
                    onChange={(e) => setNewAdminEmail(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddAdminEmail();
                      }
                    }}
                    placeholder="Add administrator email (e.g. winnie.odede@avadapay.com)..."
                    className="flex-1 p-2 bg-white border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-[#3BBA93] text-[#2A292D]"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddAdminEmail}
                    className="rounded-xl text-xs font-bold border-gray-200 space-x-1"
                  >
                    <MailPlus className="w-3.5 h-3.5 text-[#3BBA93]" />
                    <span>Add</span>
                  </Button>
                </div>
              )}
            </div>

            {/* Bottom Actions & SMTP Relay Link */}
            <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-gray-100">
              <Link
                to="/admin/integrations?open=smtp"
                className="inline-flex items-center gap-2 text-xs font-bold text-gray-600 hover:text-[#3BBA93] transition-colors"
              >
                <Cpu className="w-3.5 h-3.5 text-[#3BBA93]" />
                <span>Configure Outbound Mail Relay (SMTP) Credentials in CMS</span>
                <ArrowRight className="w-3 h-3" />
              </Link>

              {canEdit('settings') && isSuperAdmin && (
                <Button
                  type="submit"
                  disabled={savingInquirySettings}
                  variant="gradient"
                  size="sm"
                  className="rounded-xl text-xs font-bold space-x-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{savingInquirySettings ? 'Saving...' : 'Save Notification Preferences'}</span>
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

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

      {/* Card 4: Third-Party Integrations Banner */}
      <Card className="bg-gradient-to-r from-gray-900 to-[#2A292D] text-white border-none shadow-sm rounded-xl overflow-hidden p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-[#3BBA93]/20 text-[#3BBA93] border border-[#3BBA93]/30 flex items-center justify-center flex-shrink-0">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <span>Third-Party Integrations Engine</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#3BBA93]/20 text-[#3BBA93] border border-[#3BBA93]/30 font-semibold">
                PeopleForce Active
              </span>
            </h3>
            <p className="text-xs text-gray-300 mt-1">
              Manage external API connections, run connection health tests, sync live vacancies, and inspect raw request/response logs.
            </p>
          </div>
        </div>

        <Link to="/admin/integrations">
          <Button
            type="button"
            variant="gradient"
            size="sm"
            className="rounded-xl text-xs font-bold space-x-1.5 whitespace-nowrap"
          >
            <span>Open Integrations Hub</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </Link>
      </Card>
    </div>
  );
};
