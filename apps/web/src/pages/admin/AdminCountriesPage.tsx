import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Country } from '@avada/shared';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Globe2,
  Plus,
  Edit2,
  Trash2,
  ToggleLeft,
  ToggleRight,
  ExternalLink,
  MapPin,
  Radio,
  CreditCard,
  Search,
  X,
  Save,
} from 'lucide-react';

export const AdminCountriesPage: React.FC = () => {
  const { token, canEdit } = useAuth();
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCountry, setEditingCountry] = useState<Country | null>(null);
  const [form, setForm] = useState({
    name: '',
    slug: '',
    code: '',
    currencyCode: '',
    headline: '',
    description: '',
    active: true,
    telcoPartners: '',
    paymentRails: '',
    officeAddress: '',
    officePhone: '',
    mapEmbedUrl: '',
  });
  const [saving, setSaving] = useState(false);

  // Fetch
  const fetchCountries = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const res = await fetch('/api/admin/countries', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setCountries(data.data);
      }
    } catch (err) {
      console.error('Failed to load countries:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCountries();
  }, [token]);

  // Open Create
  const handleOpenCreate = () => {
    setEditingCountry(null);
    setForm({
      name: '',
      slug: '',
      code: '',
      currencyCode: 'USD',
      headline: 'Next-Gen Financial Infrastructure',
      description: 'AvadaPay provides direct mobile money aggregation, smart POS terminals, and developer payment APIs.',
      active: true,
      telcoPartners: 'MTN Mobile Money, Airtel Money',
      paymentRails: 'Mobile Money, Visa, Mastercard, Bank Payouts',
      officeAddress: '',
      officePhone: '+260 968 332 766',
      mapEmbedUrl: '',
    });
    setIsModalOpen(true);
  };

  // Open Edit
  const handleOpenEdit = (c: Country) => {
    setEditingCountry(c);
    setForm({
      name: c.name,
      slug: c.slug,
      code: c.code,
      currencyCode: c.currencyCode,
      headline: c.headline || 'Payment Infrastructure',
      description: c.description || '',
      active: c.active,
      telcoPartners: Array.isArray(c.telcoPartners) ? c.telcoPartners.join(', ') : '',
      paymentRails: Array.isArray(c.paymentRails) ? c.paymentRails.join(', ') : '',
      officeAddress: c.officeAddress || '',
      officePhone: c.officePhone || '',
      mapEmbedUrl: c.mapEmbedUrl || '',
    });
    setIsModalOpen(true);
  };

  // Auto-slugify & code generator
  const handleNameChange = (val: string) => {
    if (!editingCountry) {
      const generatedSlug = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      const code = val.slice(0, 2).toUpperCase();
      setForm((prev) => ({
        ...prev,
        name: val,
        slug: generatedSlug,
        code: prev.code || code,
        headline: `Modern Payment Solutions in ${val}`,
        description: `AvadaPay powers high-volume merchant processing, telco mobile money, and automated payouts in ${val}.`,
      }));
    } else {
      setForm((prev) => ({ ...prev, name: val }));
    }
  };

  // Save (Create or Update)
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !canEdit('countries')) return;
    setSaving(true);
    try {
      const payload = {
        name: form.name,
        slug: form.slug,
        code: form.code.toUpperCase(),
        currencyCode: form.currencyCode.toUpperCase(),
        headline: form.headline,
        description: form.description,
        active: form.active,
        officeAddress: form.officeAddress,
        officePhone: form.officePhone,
        mapEmbedUrl: form.mapEmbedUrl,
        telcoPartners: form.telcoPartners
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
        paymentRails: form.paymentRails
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
      };

      const url = editingCountry
        ? `/api/admin/countries/${editingCountry.id}`
        : '/api/admin/countries';
      const method = editingCountry ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (json.success) {
        setIsModalOpen(false);
        fetchCountries();
      } else {
        alert(json.error || 'Failed to save country');
      }
    } catch (err) {
      console.error('Save error:', err);
    } finally {
      setSaving(false);
    }
  };

  // Toggle active
  const handleToggle = async (id: string) => {
    if (!token || !canEdit('countries')) return;
    try {
      const res = await fetch(`/api/admin/countries/${id}/toggle`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setCountries((prev) =>
          prev.map((item) => (item.id === id ? { ...item, active: !item.active } : item))
        );
      }
    } catch (err) {
      console.error('Toggle error:', err);
    }
  };

  // Delete
  const handleDelete = async (id: string, name: string) => {
    if (!token || !canEdit('countries')) return;
    if (!window.confirm(`Are you sure you want to delete "${name}"? This removes its dedicated live landing page.`)) return;
    try {
      const res = await fetch(`/api/admin/countries/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setCountries((prev) => prev.filter((item) => item.id !== id));
      } else {
        alert(data.error || 'Could not delete country');
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const filtered = countries.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.code.toLowerCase().includes(search.toLowerCase()) ||
      c.slug.toLowerCase().includes(search.toLowerCase()) ||
      (c.officeAddress && c.officeAddress.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#2A292D] flex items-center gap-2">
            <Globe2 className="w-6 h-6 text-[#3BBA93]" />
            <span>African Markets & Countries</span>
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Define, update, and manage national payment markets, carrier integrations, and regional office locations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {canEdit('countries') && (
            <Button
              variant="gradient"
              size="sm"
              onClick={handleOpenCreate}
              className="space-x-1.5 rounded-xl font-bold text-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Country</span>
            </Button>
          )}
        </div>
      </div>

      {/* Filter and Summary */}
      <Card className="bg-white border-gray-200/80 shadow-sm rounded-2xl p-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search country, code, or city..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3BBA93] text-[#2A292D]"
            />
          </div>
          <div className="text-xs text-gray-500 flex items-center gap-3">
            <span>Configured Markets: <strong>{countries.length}</strong></span>
            <span>•</span>
            <span className="text-emerald-600 font-semibold">Active: {countries.filter((c) => c.active).length}</span>
          </div>
        </div>
      </Card>

      {/* Countries Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading ? (
          <div className="col-span-full py-16 text-center text-gray-400">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-5 h-5 border-2 border-[#3BBA93] border-t-transparent rounded-full animate-spin"></div>
              <span className="text-xs">Loading African country markets...</span>
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="col-span-full py-16 text-center text-gray-400 bg-white rounded-3xl border border-gray-100">
            <Globe2 className="w-10 h-10 mx-auto text-gray-300 mb-2" />
            <p className="font-bold text-gray-600">No countries found</p>
            <p className="text-xs text-gray-400 mt-1">Try another search or click Add New Country</p>
          </div>
        ) : (
          filtered.map((country) => (
            <Card
              key={country.id}
              className={`bg-white border transition-all rounded-3xl overflow-hidden flex flex-col justify-between ${
                country.active ? 'border-gray-200/90 shadow-sm hover:shadow-md' : 'border-gray-200/50 opacity-75'
              }`}
            >
              <div>
                {/* Card Top */}
                <div className="p-5 pb-3 border-b border-gray-100 flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-[#2A292D] text-white flex items-center justify-center font-black text-sm tracking-wider shadow-sm">
                      {country.code}
                    </div>
                    <div>
                      <h3 className="font-bold text-base text-[#2A292D] flex items-center gap-1.5">
                        <span>{country.name}</span>
                      </h3>
                      <div className="text-[11px] text-gray-400 font-mono mt-0.5">
                        /{country.slug} • {country.currencyCode} • {country.officePhone || ''}
                      </div>
                    </div>
                  </div>

                  {country.active ? (
                    <Badge className="bg-emerald-500/15 text-emerald-700 border-emerald-300 text-[10px] font-semibold">
                      Live
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-gray-400 border-gray-300 text-[10px]">
                      Disabled
                    </Badge>
                  )}
                </div>

                {/* Card Content */}
                <div className="p-5 space-y-4 text-xs">
                  {/* Office Address */}
                  <div>
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider flex items-center gap-1 mb-1">
                      <MapPin className="w-3 h-3 text-[#3BBA93]" />
                      <span>Head Office</span>
                    </span>
                    <p className="text-gray-700 font-medium leading-relaxed">
                      {country.officeAddress || 'No regional physical office configured'}
                    </p>
                  </div>

                  {/* Telecom & Carrier Partners */}
                  <div>
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider flex items-center gap-1 mb-1.5">
                      <Radio className="w-3 h-3 text-[#3BBA93]" />
                      <span>Telco & Network Partners</span>
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {Array.isArray(country.telcoPartners) && country.telcoPartners.length > 0 ? (
                        country.telcoPartners.map((p, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded-lg bg-gray-100 text-gray-700 text-[10px] font-semibold"
                          >
                            {p}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-400 italic text-[11px]">Direct Mobile Rails</span>
                      )}
                    </div>
                  </div>

                  {/* Payment Rails */}
                  <div>
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider flex items-center gap-1 mb-1.5">
                      <CreditCard className="w-3 h-3 text-[#3BBA93]" />
                      <span>Payment Rails</span>
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {Array.isArray(country.paymentRails) && country.paymentRails.length > 0 ? (
                        country.paymentRails.map((r, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-800 text-[10px] font-semibold border border-emerald-100"
                          >
                            {r}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-400 italic text-[11px]">Cards & MoMo</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="p-4 bg-gray-50/80 border-t border-gray-100 flex items-center justify-between">
                <a
                  href={`/countries/${country.slug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-[#3BBA93] hover:text-[#2A292D] transition-colors"
                >
                  <span>View Public Page</span>
                  <ExternalLink className="w-3 h-3" />
                </a>

                <div className="flex items-center gap-1">
                  {canEdit('countries') && (
                    <>
                      <button
                        onClick={() => handleToggle(country.id)}
                        title={country.active ? 'Disable' : 'Enable'}
                        className="p-1.5 rounded-lg hover:bg-gray-200/70 text-gray-500 transition-colors"
                      >
                        {country.active ? (
                          <ToggleRight className="w-5 h-5 text-[#3BBA93]" />
                        ) : (
                          <ToggleLeft className="w-5 h-5 text-gray-300" />
                        )}
                      </button>
                      <button
                        onClick={() => handleOpenEdit(country)}
                        title="Edit Country"
                        className="p-1.5 rounded-lg hover:bg-gray-200/70 text-gray-600 transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(country.id, country.name)}
                        title="Delete Country"
                        className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Modal: Create or Edit Country */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-5 bg-[#2A292D] text-white flex items-center justify-between">
              <div>
                <span className="text-xs uppercase font-bold tracking-wider text-[#3BBA93]">
                  {editingCountry ? 'Edit African Market' : 'Add New Market'}
                </span>
                <h2 className="text-lg font-bold">{editingCountry ? editingCountry.name : 'Configure African Country'}</h2>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-white/60 hover:text-white p-1 rounded-full hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4 text-xs overflow-y-auto flex-1">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Country Name *</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="e.g. Uganda"
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#3BBA93] focus:bg-white text-[#2A292D]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">URL Slug *</label>
                  <input
                    type="text"
                    required
                    value={form.slug}
                    onChange={(e) => setForm({ ...form, slug: e.target.value })}
                    placeholder="e.g. uganda"
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-mono text-xs focus:ring-2 focus:ring-[#3BBA93] focus:bg-white text-[#2A292D]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">ISO Code (2-4 letters) *</label>
                  <input
                    type="text"
                    required
                    maxLength={4}
                    value={form.code}
                    onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                    placeholder="UG"
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl uppercase font-bold text-center text-[#2A292D]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Currency Code *</label>
                  <input
                    type="text"
                    required
                    maxLength={4}
                    value={form.currencyCode}
                    onChange={(e) => setForm({ ...form, currencyCode: e.target.value.toUpperCase() })}
                    placeholder="UGX"
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl uppercase font-bold text-center text-[#2A292D]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Regional Office Address</label>
                <input
                  type="text"
                  value={form.officeAddress}
                  onChange={(e) => setForm({ ...form, officeAddress: e.target.value })}
                  placeholder="e.g. Plot 14, Jinja Road, Kampala, Uganda"
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#3BBA93] focus:bg-white text-[#2A292D]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Office Contact Phone</label>
                <input
                  type="text"
                  value={form.officePhone}
                  onChange={(e) => setForm({ ...form, officePhone: e.target.value })}
                  placeholder="+256 700 000 000"
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#3BBA93] focus:bg-white text-[#2A292D]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Google Maps Embed URL (Iframe src)
                </label>
                <input
                  type="text"
                  value={form.mapEmbedUrl}
                  onChange={(e) => setForm({ ...form, mapEmbedUrl: e.target.value })}
                  placeholder="https://www.google.com/maps/embed?pb=..."
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-mono text-[11px] focus:ring-2 focus:ring-[#3BBA93] focus:bg-white text-[#2A292D]"
                />
                <span className="text-[10px] text-gray-400 mt-1 block">
                  Paste the full src link from Google Maps &gt; Share &gt; Embed a map.
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Telco & Mobile Money Partners (comma-separated)
                </label>
                <input
                  type="text"
                  value={form.telcoPartners}
                  onChange={(e) => setForm({ ...form, telcoPartners: e.target.value })}
                  placeholder="MTN Mobile Money, Airtel Money"
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#3BBA93] focus:bg-white text-[#2A292D]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Supported Payment Rails (comma-separated)
                </label>
                <input
                  type="text"
                  value={form.paymentRails}
                  onChange={(e) => setForm({ ...form, paymentRails: e.target.value })}
                  placeholder="Mobile Money, Visa, Mastercard, Automated Bank Payouts"
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#3BBA93] focus:bg-white text-[#2A292D]"
                />
              </div>

              <div className="pt-2">
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.active}
                    onChange={(e) => setForm({ ...form, active: e.target.checked })}
                    className="rounded text-[#3BBA93] focus:ring-[#3BBA93] w-4 h-4"
                  />
                  <span className="text-xs font-bold text-gray-700">
                    Publish country to Live Website (Navbar, Contact, and Hub)
                  </span>
                </label>
              </div>

              <div className="pt-4 flex items-center justify-end gap-2 border-t border-gray-100">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border-gray-200 text-xs font-bold"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={saving}
                  variant="gradient"
                  className="rounded-xl text-xs font-bold space-x-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{saving ? 'Saving...' : 'Save Market'}</span>
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
