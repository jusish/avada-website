import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Country, User, CountryNotificationSettings } from '@avada/shared';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CountryFlag } from '@/components/CountryFlag';
import { resolveMapEmbedUrl, getMapExternalLink } from '@/lib/maps';
import {
  ArrowLeft,
  Building,
  CheckCircle2,
  CreditCard,
  Edit3,
  ExternalLink,
  Globe2,
  MapPin,
  Radio,
  Save,
  ShieldAlert,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  UserCheck,
  Users,
  X,
  Bell,
  Send,
  Eye,
} from 'lucide-react';

interface Props {
  isNew?: boolean;
}

export const AdminCountryDetailsPage: React.FC<Props> = ({ isNew = false }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { token, canEdit, isSuperAdmin, canManageCountry } = useAuth();

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'location' | 'notifications' | 'rails' | 'team'>('overview');
  const [isEditing, setIsEditing] = useState(isNew);
  const [users, setUsers] = useState<User[]>([]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form State
  const [form, setForm] = useState({
    name: '',
    slug: '',
    code: '',
    currencyCode: 'USD',
    headline: '',
    tagline: '',
    description: '',
    active: true,
    telcoPartners: [] as string[],
    paymentRails: [] as string[],
    officeAddress: '',
    officePhone: '',
    officeEmail: '',
    mapEmbedUrl: '',
    managerId: '',
    notificationSettings: {
      notifyOfficeEmail: true,
      notifyManagerEmail: true,
      extraRecipients: [] as string[],
    } as CountryNotificationSettings,
  });

  const [newTelcoInput, setNewTelcoInput] = useState('');
  const [newRailInput, setNewRailInput] = useState('');
  const [extraEmailInput, setExtraEmailInput] = useState('');

  // Initial Country data loaded
  const [countryData, setCountryData] = useState<Country | null>(null);

  const fetchUsers = async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setUsers(data.data);
      }
    } catch (err) {
      console.error('Failed to load users:', err);
    }
  };

  const fetchCountry = async () => {
    if (!token || isNew || !id) return;
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/countries/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success && data.data) {
        const c = data.data as Country;
        setCountryData(c);
        setForm({
          name: c.name,
          slug: c.slug,
          code: c.code.toUpperCase(),
          currencyCode: c.currencyCode.toUpperCase(),
          headline: c.headline || '',
          tagline: c.tagline || '',
          description: c.description || '',
          active: c.active,
          telcoPartners: Array.isArray(c.telcoPartners) ? c.telcoPartners : [],
          paymentRails: Array.isArray(c.paymentRails) ? c.paymentRails : [],
          officeAddress: c.officeAddress || '',
          officePhone: c.officePhone || '',
          officeEmail: c.officeEmail || '',
          mapEmbedUrl: c.mapEmbedUrl || '',
          managerId: c.managerId || '',
          notificationSettings: {
            notifyOfficeEmail: c.notificationSettings?.notifyOfficeEmail ?? true,
            notifyManagerEmail: c.notificationSettings?.notifyManagerEmail ?? true,
            extraRecipients: c.notificationSettings?.extraRecipients || [],
          },
        });
      } else {
        setErrorMessage(data.error || 'Failed to load country details');
      }
    } catch (err) {
      console.error('Failed to load country details:', err);
      setErrorMessage('Network error while loading country details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    if (!isNew) {
      fetchCountry();
    }
  }, [id, token, isNew]);

  const showSuccess = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  // Add/remove partner tags
  const handleAddTelco = () => {
    if (!newTelcoInput.trim()) return;
    if (!form.telcoPartners.includes(newTelcoInput.trim())) {
      setForm((prev) => ({
        ...prev,
        telcoPartners: [...prev.telcoPartners, newTelcoInput.trim()],
      }));
    }
    setNewTelcoInput('');
  };

  const handleRemoveTelco = (tag: string) => {
    setForm((prev) => ({
      ...prev,
      telcoPartners: prev.telcoPartners.filter((t) => t !== tag),
    }));
  };

  const handleAddRail = () => {
    if (!newRailInput.trim()) return;
    if (!form.paymentRails.includes(newRailInput.trim())) {
      setForm((prev) => ({
        ...prev,
        paymentRails: [...prev.paymentRails, newRailInput.trim()],
      }));
    }
    setNewRailInput('');
  };

  const handleRemoveRail = (tag: string) => {
    setForm((prev) => ({
      ...prev,
      paymentRails: prev.paymentRails.filter((r) => r !== tag),
    }));
  };

  const handleAddExtraEmail = () => {
    const val = extraEmailInput.trim().toLowerCase();
    if (!val || !val.includes('@')) return;
    const current = form.notificationSettings.extraRecipients || [];
    if (!current.includes(val)) {
      setForm((prev) => ({
        ...prev,
        notificationSettings: {
          ...prev.notificationSettings,
          extraRecipients: [...current, val],
        },
      }));
    }
    setExtraEmailInput('');
  };

  const handleRemoveExtraEmail = (email: string) => {
    setForm((prev) => ({
      ...prev,
      notificationSettings: {
        ...prev.notificationSettings,
        extraRecipients: (prev.notificationSettings.extraRecipients || []).filter((e) => e !== email),
      },
    }));
  };

  // Save changes
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !canEdit('countries')) return;
    setSaving(true);
    setErrorMessage(null);

    try {
      const resolvedMap = resolveMapEmbedUrl(
        form.mapEmbedUrl,
        form.officeAddress || (form.name ? `${form.name} Office` : '')
      );

      const payload = {
        name: form.name,
        slug: form.slug.toLowerCase().trim(),
        code: form.code.toUpperCase().trim(),
        currencyCode: form.currencyCode.toUpperCase().trim(),
        headline: form.headline,
        tagline: form.tagline,
        description: form.description,
        active: form.active,
        telcoPartners: form.telcoPartners,
        paymentRails: form.paymentRails,
        officeAddress: form.officeAddress.trim() || null,
        officePhone: form.officePhone.trim() || null,
        officeEmail: form.officeEmail.trim() || null,
        mapEmbedUrl: resolvedMap || null,
        managerId: form.managerId ? form.managerId : null,
        notificationSettings: form.notificationSettings,
      };

      const url = isNew ? '/api/admin/countries' : `/api/admin/countries/${id}`;
      const method = isNew ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (json.success && json.data) {
        showSuccess(isNew ? 'Regional market hub created!' : 'Country details & preferences updated successfully.');
        if (isNew) {
          navigate(`/admin/content/countries/${json.data.id}`);
        } else {
          setCountryData(json.data);
          setIsEditing(false);
        }
      } else {
        setErrorMessage(json.error || 'Failed to save country details.');
      }
    } catch (err: any) {
      console.error('Save country error:', err);
      setErrorMessage(err?.message || 'Network error while saving.');
    } finally {
      setSaving(false);
    }
  };

  // Live Recipient Simulation
  const simulatedRecipients: string[] = [];
  if (form.notificationSettings.notifyOfficeEmail && form.officeEmail.trim()) {
    simulatedRecipients.push(form.officeEmail.trim());
  }
  const assignedManager = users.find((u) => u.id === form.managerId);
  if (form.notificationSettings.notifyManagerEmail && assignedManager?.email) {
    simulatedRecipients.push(assignedManager.email);
  }
  (form.notificationSettings.extraRecipients || []).forEach((e) => {
    if (!simulatedRecipients.includes(e)) simulatedRecipients.push(e);
  });

  if (loading) {
    return (
      <div className="py-24 text-center">
        <div className="w-8 h-8 border-2 border-[#3BBA93] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs text-gray-500 font-medium">Loading regional market details...</p>
      </div>
    );
  }

  const selectedManager = users.find((u) => u.id === (isEditing ? form.managerId : countryData?.managerId));

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Top Breadcrumb & Status Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/content/countries"
            className="p-2 rounded-xl bg-white border border-gray-200 text-gray-600 hover:text-[#2A292D] hover:bg-gray-50 transition-colors shadow-xs"
            title="Back to Regional Presence"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-[#3BBA93] uppercase tracking-wider">
                Regional Presence Hub
              </span>
              <span>•</span>
              <span className="text-[11px] text-gray-400 font-mono">
                {isNew ? 'New Entry' : `/${countryData?.slug || form.slug}`}
              </span>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-[#2A292D] flex items-center gap-2.5 mt-0.5">
              {!isNew && <CountryFlag country={form.code.toLowerCase()} className="w-6 h-4" />}
              <span>{isNew ? (form.name || 'Create New Market Hub') : countryData?.name}</span>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!isNew && countryData && (
            <a
              href={`/${countryData.slug}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-gray-200 text-xs font-bold text-gray-700 hover:text-[#3BBA93] hover:border-[#3BBA93]/40 shadow-xs transition-colors"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>View Live Page</span>
              <ExternalLink className="w-3 h-3 opacity-60" />
            </a>
          )}

          {canEdit('countries') && (!isNew ? canManageCountry(id!) : isSuperAdmin) && (
            <>
              {isEditing && !isNew ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false);
                    fetchCountry();
                  }}
                  className="rounded-xl text-xs font-bold h-9"
                >
                  Cancel
                </Button>
              ) : !isEditing ? (
                <Button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="bg-[#3BBA93] hover:bg-[#32a481] text-white rounded-xl text-xs font-bold h-9 space-x-1.5 shadow-sm"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Details</span>
                </Button>
              ) : null}
            </>
          )}
        </div>
      </div>

      {/* Notifications / Alerts */}
      {successMessage && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in-0">
          <CheckCircle2 className="w-4 h-4 text-[#3BBA93] shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in-0">
          <ShieldAlert className="w-4 h-4 text-red-500 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Hero Overview Card — Apple Grouped Inset Surface */}
      <div className="rounded-2xl bg-white border border-black/[0.06] shadow-sm p-6 overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-gray-100">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-900 flex items-center justify-center font-black text-xl tracking-wider font-mono shadow-xs shrink-0">
              {form.code || '??'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-[#2A292D]">
                  {form.name || 'Unnamed African Country'}
                </h2>
                {form.active ? (
                  <Badge className="bg-emerald-500/15 text-emerald-700 border-emerald-300 text-[10px] font-bold">
                    Active Market
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-gray-400 text-[10px]">
                    Market Disabled
                  </Badge>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1 font-medium max-w-xl">
                {form.headline || 'Configure regional headline and financial infrastructure rails.'}
              </p>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="flex items-center gap-3">
            <div className="px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-100 text-center min-w-[90px]">
              <span className="block text-[10px] uppercase font-bold text-gray-400">Currency</span>
              <span className="text-sm font-black text-[#2A292D] font-mono">{form.currencyCode || 'USD'}</span>
            </div>
            <div className="px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-100 text-center min-w-[90px]">
              <span className="block text-[10px] uppercase font-bold text-gray-400">Rails</span>
              <span className="text-sm font-black text-[#3BBA93]">{form.paymentRails.length}</span>
            </div>
            <div className="px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-100 text-center min-w-[90px]">
              <span className="block text-[10px] uppercase font-bold text-gray-400">Telcos</span>
              <span className="text-sm font-black text-[#2A292D]">{form.telcoPartners.length}</span>
            </div>
          </div>
        </div>

        {/* Apple Segmented Control Navigation */}
        <div className="pt-4 flex flex-wrap gap-1.5 border-b border-gray-100 -mb-6 pb-4">
          {[
            { key: 'overview', label: 'Market Overview', icon: Globe2 },
            { key: 'location', label: 'Head Office & Maps', icon: MapPin },
            { key: 'notifications', label: 'Notification Settings', icon: Bell, highlight: true },
            { key: 'rails', label: 'Rails & Telcos', icon: CreditCard },
            { key: 'team', label: 'Market Leadership', icon: UserCheck },
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key as any)}
                className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  isSelected
                    ? 'bg-[#2A292D] text-white shadow-sm'
                    : 'bg-gray-100/80 text-gray-600 hover:bg-gray-200/70 hover:text-gray-900'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-[#3BBA93]' : 'text-gray-500'}`} />
                <span>{tab.label}</span>
                {tab.key === 'notifications' && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#3BBA93]" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <Card className="p-6 rounded-2xl bg-white border border-black/[0.06] shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-[#2A292D] uppercase tracking-wide">
                  General Market Information
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">Country Name *</label>
                    <input
                      type="text"
                      required
                      disabled={!isEditing}
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="e.g. Kenya"
                      className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-[#3BBA93] disabled:opacity-75 disabled:bg-gray-50/50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">URL Slug *</label>
                    <input
                      type="text"
                      required
                      disabled={!isEditing}
                      value={form.slug}
                      onChange={(e) => setForm({ ...form, slug: e.target.value.toLowerCase().trim() })}
                      placeholder="e.g. kenya"
                      className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-mono text-xs focus:ring-2 focus:ring-[#3BBA93] disabled:opacity-75"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">ISO Code (2-4 chars) *</label>
                    <input
                      type="text"
                      required
                      maxLength={4}
                      disabled={!isEditing}
                      value={form.code}
                      onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                      placeholder="KE"
                      className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-mono font-bold text-xs uppercase focus:ring-2 focus:ring-[#3BBA93] disabled:opacity-75"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">Local Currency Code *</label>
                    <input
                      type="text"
                      required
                      maxLength={5}
                      disabled={!isEditing}
                      value={form.currencyCode}
                      onChange={(e) => setForm({ ...form, currencyCode: e.target.value.toUpperCase() })}
                      placeholder="KES"
                      className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-mono font-bold text-xs uppercase focus:ring-2 focus:ring-[#3BBA93] disabled:opacity-75"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Market Headline</label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={form.headline}
                    onChange={(e) => setForm({ ...form, headline: e.target.value })}
                    placeholder="e.g. Next-Generation Mobile Money & Processing in Kenya"
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-[#3BBA93] disabled:opacity-75"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Tagline / Sub-heading</label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={form.tagline}
                    onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                    placeholder="e.g. Direct integrations with M-Pesa and Airtel Money"
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-[#3BBA93] disabled:opacity-75"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Market Overview &amp; Description</label>
                  <textarea
                    rows={4}
                    disabled={!isEditing}
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="Describe market operations, licensing status, and capabilities..."
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs leading-relaxed focus:ring-2 focus:ring-[#3BBA93] disabled:opacity-75"
                  />
                </div>
              </Card>
            </div>

            {/* Sidebar Status Column */}
            <div className="space-y-6">
              <Card className="p-6 rounded-2xl bg-white border border-black/[0.06] shadow-sm space-y-4">
                <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wide">
                  Live Market Status
                </h4>

                <div className="flex items-center justify-between p-3.5 rounded-xl bg-gray-50 border border-gray-100">
                  <div>
                    <span className="block text-xs font-bold text-[#2A292D]">
                      {form.active ? 'Market is Active' : 'Market is Disabled'}
                    </span>
                    <span className="text-[11px] text-gray-500">
                      {form.active
                        ? 'Visible on public website navigation & footer'
                        : 'Hidden from public lists and returns coming soon'}
                    </span>
                  </div>
                  {isEditing ? (
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, active: !form.active })}
                      className="p-1 text-[#3BBA93]"
                    >
                      {form.active ? (
                        <ToggleRight className="w-8 h-8 text-[#3BBA93]" />
                      ) : (
                        <ToggleLeft className="w-8 h-8 text-gray-300" />
                      )}
                    </button>
                  ) : form.active ? (
                    <Badge className="bg-emerald-500/15 text-emerald-700 border-emerald-300 text-[10px]">Active</Badge>
                  ) : (
                    <Badge variant="outline" className="text-gray-400 text-[10px]">Disabled</Badge>
                  )}
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* TAB 2: LOCATION & MAPS */}
        {activeTab === 'location' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6 rounded-2xl bg-white border border-black/[0.06] shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-[#2A292D] uppercase tracking-wide flex items-center gap-2">
                <Building className="w-4 h-4 text-[#3BBA93]" />
                <span>Regional Office Contact Details</span>
              </h3>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Physical Head Office Address</label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={form.officeAddress}
                  onChange={(e) => setForm({ ...form, officeAddress: e.target.value })}
                  placeholder="e.g. 8th Floor, Westpark Towers, Westlands, Nairobi, Kenya"
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-[#3BBA93] disabled:opacity-75"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Office Phone Number</label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={form.officePhone}
                  onChange={(e) => setForm({ ...form, officePhone: e.target.value })}
                  placeholder="+254 712 345 678"
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-[#3BBA93] disabled:opacity-75"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Official Country Contact Email</label>
                <input
                  type="email"
                  disabled={!isEditing}
                  value={form.officeEmail}
                  onChange={(e) => setForm({ ...form, officeEmail: e.target.value })}
                  placeholder="avada.kenya@avadapay.com"
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-[#3BBA93] disabled:opacity-75"
                />
                <span className="text-[11px] text-gray-500 mt-1 block">
                  Used as the official routing address for customer inquiries originating from this country.
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Google Maps Embed URL</label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={form.mapEmbedUrl}
                  onChange={(e) => setForm({ ...form, mapEmbedUrl: e.target.value })}
                  placeholder="https://maps.google.com/maps?q=...&output=embed"
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-mono text-xs focus:ring-2 focus:ring-[#3BBA93] disabled:opacity-75"
                />
              </div>
            </Card>

            <Card className="p-6 rounded-2xl bg-white border border-black/[0.06] shadow-sm flex flex-col justify-between">
              <div>
                <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wide mb-3 flex items-center justify-between">
                  <span>Interactive Map Preview</span>
                  {form.officeAddress && (
                    <a
                      href={getMapExternalLink(form.officeAddress)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] font-bold text-[#3BBA93] hover:underline inline-flex items-center gap-1"
                    >
                      <span>Open External Map</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </h4>

                <div className="aspect-video w-full rounded-xl overflow-hidden border border-gray-200 bg-gray-100 flex items-center justify-center">
                  {form.officeAddress || form.mapEmbedUrl ? (
                    <iframe
                      src={resolveMapEmbedUrl(form.mapEmbedUrl, form.officeAddress || `${form.name} Office`)}
                      title={`${form.name} Regional Office Location`}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      loading="lazy"
                      allowFullScreen
                    />
                  ) : (
                    <div className="text-center p-6 text-gray-400 text-xs">
                      <MapPin className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                      <span>Enter an office address or Google Map URL to preview</span>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* TAB 3: NOTIFICATION SETTINGS (APPLE DESIGN INSET GROUP) */}
        {activeTab === 'notifications' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 space-y-6">
              <div className="rounded-2xl bg-white border border-black/[0.06] shadow-sm overflow-hidden">
                <div className="p-5 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#3BBA93] flex items-center justify-center">
                      <Bell className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-[#2A292D]">
                        Inquiry Notification Routing
                      </h3>
                      <p className="text-xs text-gray-500">
                        Control which regional team members receive emails when customers submit contact inquiries.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Apple Settings Grouped Rows */}
                <div className="divide-y divide-gray-100 text-xs">
                  {/* Row 1: Country Office Email */}
                  <div className="p-4 flex items-center justify-between gap-4 hover:bg-gray-50/50 transition-colors">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#3BBA93] flex items-center justify-center shrink-0 mt-0.5">
                        <Building className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="block font-bold text-[#2A292D]">
                          Send to Country Contact Email
                        </span>
                        <span className="text-gray-500 font-mono text-[11px]">
                          {form.officeEmail ? form.officeEmail : 'No office email configured'}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      disabled={!isEditing}
                      onClick={() =>
                        setForm((prev) => ({
                          ...prev,
                          notificationSettings: {
                            ...prev.notificationSettings,
                            notifyOfficeEmail: !prev.notificationSettings.notifyOfficeEmail,
                          },
                        }))
                      }
                      className="p-1 text-[#3BBA93] disabled:opacity-70 transition-transform active:scale-95"
                    >
                      {form.notificationSettings.notifyOfficeEmail ? (
                        <ToggleRight className="w-9 h-9 text-[#3BBA93]" />
                      ) : (
                        <ToggleLeft className="w-9 h-9 text-gray-300" />
                      )}
                    </button>
                  </div>

                  {/* Row 2: Country Manager / CEO */}
                  <div className="p-4 flex items-center justify-between gap-4 hover:bg-gray-50/50 transition-colors">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#3BBA93] flex items-center justify-center shrink-0 mt-0.5">
                        <UserCheck className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="block font-bold text-[#2A292D]">
                          Send to Country Manager / CEO
                        </span>
                        <span className="text-gray-500 text-[11px]">
                          {assignedManager
                            ? `${assignedManager.name} (${assignedManager.email})`
                            : 'No country manager currently assigned'}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      disabled={!isEditing}
                      onClick={() =>
                        setForm((prev) => ({
                          ...prev,
                          notificationSettings: {
                            ...prev.notificationSettings,
                            notifyManagerEmail: !prev.notificationSettings.notifyManagerEmail,
                          },
                        }))
                      }
                      className="p-1 text-[#3BBA93] disabled:opacity-70 transition-transform active:scale-95"
                    >
                      {form.notificationSettings.notifyManagerEmail ? (
                        <ToggleRight className="w-9 h-9 text-[#3BBA93]" />
                      ) : (
                        <ToggleLeft className="w-9 h-9 text-gray-300" />
                      )}
                    </button>
                  </div>

                  {/* Row 3: Extra Recipients */}
                  <div className="p-4 space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#3BBA93] flex items-center justify-center shrink-0 mt-0.5">
                        <Users className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <span className="block font-bold text-[#2A292D]">
                          Additional Country Recipients
                        </span>
                        <span className="text-gray-500 text-[11px]">
                          Specific staff members who should also be copied on inquiries for {form.name || 'this country'}.
                        </span>

                        {/* Extra Recipients Pills */}
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {(form.notificationSettings.extraRecipients || []).map((email) => (
                            <span
                              key={email}
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gray-100 text-gray-700 text-xs font-mono font-medium border border-gray-200"
                            >
                              <span>{email}</span>
                              {isEditing && (
                                <button
                                  type="button"
                                  onClick={() => handleRemoveExtraEmail(email)}
                                  className="text-gray-400 hover:text-red-600"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              )}
                            </span>
                          ))}
                        </div>

                        {isEditing && (
                          <div className="flex gap-2 mt-3">
                            <input
                              type="email"
                              value={extraEmailInput}
                              onChange={(e) => setExtraEmailInput(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  handleAddExtraEmail();
                                }
                              }}
                              placeholder="colleague@avadapay.com"
                              className="w-full max-w-xs p-1.5 px-3 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-[#3BBA93]"
                            />
                            <Button
                              type="button"
                              onClick={handleAddExtraEmail}
                              variant="outline"
                              className="h-8 rounded-xl text-xs font-bold"
                            >
                              Add
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Live Recipient Delivery Simulation Card */}
            <div className="lg:col-span-5 space-y-6">
              <div className="rounded-2xl bg-gradient-to-br from-[#2A292D] to-[#1E1D21] text-white p-6 shadow-md border border-white/10 space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#3BBA93]/20 text-[#3BBA93] flex items-center justify-center">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                    Live Routing Simulation
                  </h4>
                </div>

                <p className="text-xs text-gray-300 leading-relaxed font-medium">
                  When a customer fills out the contact form for <strong className="text-white">{form.name || 'this country'}</strong>, email dispatches will be delivered to:
                </p>

                <div className="space-y-2 pt-1">
                  {simulatedRecipients.length === 0 ? (
                    <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-amber-300 flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4 shrink-0" />
                      <span>No regional recipients selected. System fallback (sales@avadapay.com) will be used.</span>
                    </div>
                  ) : (
                    simulatedRecipients.map((rec) => (
                      <div
                        key={rec}
                        className="p-2.5 rounded-xl bg-white/10 border border-white/10 flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-2 font-mono text-emerald-300 font-semibold truncate">
                          <Send className="w-3 h-3 text-[#3BBA93] shrink-0" />
                          <span className="truncate">{rec}</span>
                        </div>
                        <span className="text-[10px] text-gray-400 font-sans uppercase">Delivered</span>
                      </div>
                    ))
                  )}
                </div>

                <div className="pt-3 border-t border-white/10 text-[11px] text-gray-400 leading-relaxed">
                  <strong>Global Admin Routing:</strong> Winnie/Global Admin also receives notifications depending on her global preference (configured in Global Settings).
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: RAILS & TELCOS */}
        {activeTab === 'rails' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Telco Partners */}
            <Card className="p-6 rounded-2xl bg-white border border-black/[0.06] shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-[#2A292D] uppercase tracking-wide flex items-center gap-2">
                <Radio className="w-4 h-4 text-[#3BBA93]" />
                <span>Telco &amp; Network Partners</span>
              </h3>

              <div className="flex flex-wrap gap-1.5 min-h-[60px] p-3 rounded-xl bg-gray-50 border border-gray-100 items-start">
                {form.telcoPartners.length === 0 ? (
                  <span className="text-gray-400 text-xs italic">No telecom partners configured</span>
                ) : (
                  form.telcoPartners.map((telco) => (
                    <span
                      key={telco}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white border border-gray-200 text-gray-800 text-xs font-semibold shadow-2xs"
                    >
                      <span>{telco}</span>
                      {isEditing && (
                        <button
                          type="button"
                          onClick={() => handleRemoveTelco(telco)}
                          className="text-gray-400 hover:text-red-500"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </span>
                  ))
                )}
              </div>

              {isEditing && (
                <div className="flex gap-2 pt-2">
                  <input
                    type="text"
                    value={newTelcoInput}
                    onChange={(e) => setNewTelcoInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTelco();
                      }
                    }}
                    placeholder="e.g. MTN Mobile Money"
                    className="flex-1 p-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-[#3BBA93]"
                  />
                  <Button
                    type="button"
                    onClick={handleAddTelco}
                    variant="outline"
                    className="rounded-xl text-xs font-bold"
                  >
                    Add Partner
                  </Button>
                </div>
              )}
            </Card>

            {/* Payment Rails */}
            <Card className="p-6 rounded-2xl bg-white border border-black/[0.06] shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-[#2A292D] uppercase tracking-wide flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-[#3BBA93]" />
                <span>Enabled Payment Rails</span>
              </h3>

              <div className="flex flex-wrap gap-1.5 min-h-[60px] p-3 rounded-xl bg-gray-50 border border-gray-100 items-start">
                {form.paymentRails.length === 0 ? (
                  <span className="text-gray-400 text-xs italic">No payment rails configured</span>
                ) : (
                  form.paymentRails.map((rail) => (
                    <span
                      key={rail}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold shadow-2xs"
                    >
                      <span>{rail}</span>
                      {isEditing && (
                        <button
                          type="button"
                          onClick={() => handleRemoveRail(rail)}
                          className="text-emerald-500 hover:text-red-500"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </span>
                  ))
                )}
              </div>

              {isEditing && (
                <div className="flex gap-2 pt-2">
                  <input
                    type="text"
                    value={newRailInput}
                    onChange={(e) => setNewRailInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddRail();
                      }
                    }}
                    placeholder="e.g. STK Push, Smart POS"
                    className="flex-1 p-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-[#3BBA93]"
                  />
                  <Button
                    type="button"
                    onClick={handleAddRail}
                    variant="outline"
                    className="rounded-xl text-xs font-bold"
                  >
                    Add Rail
                  </Button>
                </div>
              )}
            </Card>
          </div>
        )}

        {/* TAB 5: LEADERSHIP & TEAM */}
        {activeTab === 'team' && (
          <div className="max-w-xl space-y-6">
            <Card className="p-6 rounded-2xl bg-white border border-black/[0.06] shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-[#2A292D] uppercase tracking-wide flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-[#3BBA93]" />
                <span>Designated Country Manager</span>
              </h3>

              <p className="text-xs text-gray-500 leading-relaxed">
                The country manager has operational oversight for inquiries, local settings, and regional compliance.
                {isSuperAdmin
                  ? ' As a Super Administrator, you can assign or change this leader.'
                  : ' Only Super Administrators can reassign country leaders.'}
              </p>

              {isEditing && isSuperAdmin ? (
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Assign Manager</label>
                  <select
                    value={form.managerId}
                    onChange={(e) => setForm({ ...form, managerId: e.target.value })}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-[#3BBA93]"
                  >
                    <option value="">No manager assigned (Unassigned Market)</option>
                    {users.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name} ({u.email})
                      </option>
                    ))}
                  </select>
                </div>
              ) : selectedManager ? (
                <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#3BBA93]/15 text-[#3BBA93] flex items-center justify-center font-bold text-sm">
                      {selectedManager.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <span className="block font-bold text-[#2A292D] text-xs">{selectedManager.name}</span>
                      <span className="text-[11px] text-gray-500 font-mono">{selectedManager.email}</span>
                    </div>
                  </div>
                  <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px]">Leader</Badge>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-medium">
                  No manager currently assigned. Inquiries will route to Global Administration until a leader is selected.
                </div>
              )}
            </Card>
          </div>
        )}

        {/* Floating / Sticky Save Bar when Editing */}
        {isEditing && (
          <div className="sticky bottom-6 z-20 p-4 rounded-2xl bg-[#2A292D] text-white shadow-2xl border border-white/10 flex items-center justify-between">
            <span className="text-xs font-medium text-gray-300">
              Unsaved changes to <strong className="text-white">{form.name || 'market hub'}</strong>
            </span>
            <div className="flex items-center gap-2">
              {!isNew && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                  className="rounded-xl text-xs text-gray-800 font-bold bg-white h-9"
                >
                  Cancel
                </Button>
              )}
              <Button
                type="submit"
                disabled={saving}
                className="bg-[#3BBA93] hover:bg-[#32a481] text-white rounded-xl text-xs font-bold h-9 space-x-1.5 shadow-md shadow-[#3BBA93]/30"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{saving ? 'Saving...' : isNew ? 'Create Market Hub' : 'Save Changes'}</span>
              </Button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};
