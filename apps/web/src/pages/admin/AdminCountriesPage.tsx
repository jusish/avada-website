import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Country } from '@avada/shared';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CountryFlag } from '@/components/CountryFlag';
import {
  Globe2,
  Plus,
  Trash2,
  ToggleLeft,
  ToggleRight,
  ExternalLink,
  MapPin,
  Radio,
  CreditCard,
  Search,
  Phone,
  Mail,
  Lock,
  UserCheck,
  ChevronRight,
  Bell,
  Settings,
} from 'lucide-react';

export const AdminCountriesPage: React.FC = () => {
  const { token, canEdit, isSuperAdmin, canManageCountry } = useAuth();
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

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

  // Toggle active
  const handleToggle = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
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
  const handleDelete = async (id: string, name: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
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
      (c.officeAddress && c.officeAddress.toLowerCase().includes(search.toLowerCase())) ||
      (c.officeEmail && c.officeEmail.toLowerCase().includes(search.toLowerCase())) ||
      (c.officePhone && c.officePhone.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#2A292D] flex items-center gap-2">
            <Globe2 className="w-6 h-6 text-[#3BBA93]" />
            <span>Regional Presence</span>
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Define, update, and manage national payment markets, carrier integrations, inquiry notification routing, and regional office locations across Africa and our UAE headquarters.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isSuperAdmin && canEdit('countries') && (
            <Link to="/admin/content/countries/new">
              <Button
                variant="gradient"
                size="sm"
                className="space-x-1.5 rounded-xl font-bold text-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Add Regional Presence</span>
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Filter and Summary */}
      <Card className="bg-white border-gray-200/80 shadow-sm rounded-xl p-4">
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
          <div className="col-span-full py-16 text-center text-gray-400 bg-white rounded-xl border border-gray-100">
            <Globe2 className="w-10 h-10 mx-auto text-gray-300 mb-2" />
            <p className="font-bold text-gray-600">No countries found</p>
            <p className="text-xs text-gray-400 mt-1">Try another search or click Add Regional Presence</p>
          </div>
        ) : (
          filtered.map((country) => (
            <Card
              key={country.id}
              className={`bg-white border transition-all rounded-xl overflow-hidden flex flex-col justify-between hover:border-gray-300 ${
                country.active ? 'border-gray-200/90 shadow-sm hover:shadow-md' : 'border-gray-200/50 opacity-75'
              }`}
            >
              <div>
                {/* Card Top */}
                <div className="p-5 pb-3 border-b border-gray-100 flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-gray-50 border border-gray-200/80 flex items-center justify-center overflow-hidden shadow-xs">
                      <CountryFlag country={country.code} className="w-6 h-4" />
                    </div>
                    <div>
                      <h3 className="font-bold text-base text-[#2A292D] flex items-center gap-1.5">
                        <span>{country.name}</span>
                      </h3>
                      <div className="text-[11px] text-gray-400 font-mono mt-0.5">
                        /{country.slug} • {country.code.toUpperCase()} • {country.currencyCode.toUpperCase()}
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
                    <span className="text-[11px] text-gray-500 font-semibold tracking-wide flex items-center gap-1 mb-1">
                      <MapPin className="w-3 h-3 text-[#3BBA93]" />
                      <span>Head Office</span>
                    </span>
                    <p className="text-gray-700 font-medium leading-relaxed line-clamp-2">
                      {country.officeAddress || 'No regional physical office configured'}
                    </p>
                  </div>

                  {/* Office Contact Info (Phone & Email) */}
                  {(country.officePhone || country.officeEmail) && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-gray-100">
                      {country.officePhone && (
                        <div className="flex items-center gap-1.5 text-gray-600">
                          <Phone className="w-3 h-3 text-[#3BBA93] shrink-0" />
                          <span className="truncate">{country.officePhone}</span>
                        </div>
                      )}
                      {country.officeEmail && (
                        <div className="flex items-center gap-1.5 text-gray-600">
                          <Mail className="w-3 h-3 text-[#3BBA93] shrink-0" />
                          <span className="truncate">{country.officeEmail}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Designated Country Manager */}
                  {country.manager ? (
                    <div className="flex items-center gap-1.5 p-2 rounded-lg bg-emerald-50/70 border border-emerald-100 text-gray-700">
                      <UserCheck className="w-3.5 h-3.5 text-[#3BBA93] shrink-0" />
                      <span className="text-[11px] truncate">
                        Manager: <strong className="font-semibold text-[#2A292D]">{country.manager.name}</strong>
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 p-2 rounded-lg bg-amber-50/70 border border-amber-200/60 text-amber-800">
                      <Bell className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span className="text-[11px] truncate">
                        No manager assigned (Global Admin receives inquiries)
                      </span>
                    </div>
                  )}

                  {/* Telecom & Carrier Partners */}
                  <div>
                    <span className="text-[11px] text-gray-500 font-semibold tracking-wide flex items-center gap-1 mb-1.5">
                      <Radio className="w-3 h-3 text-[#3BBA93]" />
                      <span>Telco & Carrier Partners</span>
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {Array.isArray(country.telcoPartners) && country.telcoPartners.length > 0 ? (
                        country.telcoPartners.slice(0, 3).map((p, idx) => (
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
                      {Array.isArray(country.telcoPartners) && country.telcoPartners.length > 3 && (
                        <span className="px-1.5 py-0.5 rounded-lg bg-gray-100 text-gray-500 text-[10px] font-medium">
                          +{country.telcoPartners.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Payment Rails */}
                  <div>
                    <span className="text-[11px] text-gray-500 font-semibold tracking-wide flex items-center gap-1 mb-1.5">
                      <CreditCard className="w-3 h-3 text-[#3BBA93]" />
                      <span>Payment Rails</span>
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {Array.isArray(country.paymentRails) && country.paymentRails.length > 0 ? (
                        country.paymentRails.slice(0, 3).map((r, idx) => (
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
                      {Array.isArray(country.paymentRails) && country.paymentRails.length > 3 && (
                        <span className="px-1.5 py-0.5 rounded-lg bg-emerald-50 text-emerald-700 text-[10px] font-medium">
                          +{country.paymentRails.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="p-4 bg-gray-50/80 border-t border-gray-100 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <a
                    href={`/${country.slug}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-gray-500 hover:text-[#2A292D] transition-colors"
                  >
                    <span>Live Page</span>
                    <ExternalLink className="w-3 h-3 text-gray-400" />
                  </a>

                  {canEdit('countries') && canManageCountry(country.id) && (
                    <button
                      onClick={(e) => handleToggle(country.id, e)}
                      title={country.active ? 'Disable market' : 'Enable market'}
                      className="p-1 rounded-md hover:bg-gray-200/70 text-gray-500 transition-colors"
                    >
                      {country.active ? (
                        <ToggleRight className="w-5 h-5 text-[#3BBA93]" />
                      ) : (
                        <ToggleLeft className="w-5 h-5 text-gray-300" />
                      )}
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  {canEdit('countries') && canManageCountry(country.id) ? (
                    <>
                      <Link
                        to={`/admin/content/countries/${country.id}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#2A292D] hover:bg-black text-white font-semibold text-xs transition-all shadow-xs"
                      >
                        <Settings className="w-3.5 h-3.5 text-[#3BBA93]" />
                        <span>Details & Preferences</span>
                        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                      </Link>

                      {isSuperAdmin && (
                        <button
                          onClick={(e) => handleDelete(country.id, country.name, e)}
                          title="Delete Country"
                          className="p-1.5 rounded-xl hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </>
                  ) : (
                    <Link
                      to={`/admin/content/countries/${country.id}`}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 font-medium text-xs transition-colors"
                    >
                      <Lock className="w-3 h-3 text-gray-400" />
                      <span>View Details</span>
                      <ChevronRight className="w-3 h-3 text-gray-400" />
                    </Link>
                  )}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
