import React, { useEffect, useState, useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import { ContactInquiry, Country, InquiryType, InquiryStatus } from '@avada/shared';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Inbox,
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  Mail,
  Phone,
  Building,
  Globe2,
  UserCheck,
  Trash2,
  X,
  Save,
  RotateCw,
} from 'lucide-react';

export const AdminInquiriesPage: React.FC = () => {
  const { token, canEdit } = useAuth();
  const [inquiries, setInquiries] = useState<ContactInquiry[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [inquiryTypes, setInquiryTypes] = useState<InquiryType[]>([]);
  const [stats, setStats] = useState({ total: 0, unread: 0, contacted: 0, resolved: 0 });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Filters
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedCountry, setSelectedCountry] = useState<string>('ALL');
  const [selectedType, setSelectedType] = useState<string>('ALL');

  // Selected Inquiry for Drawer / Modal
  const [activeInquiry, setActiveInquiry] = useState<ContactInquiry | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [savingNotes, setSavingNotes] = useState(false);

  // Fetch data
  const fetchData = async () => {
    if (!token) return;
    try {
      setRefreshing(true);
      const [inqRes, statsRes, countriesRes, typesRes] = await Promise.all([
        fetch('/api/admin/inquiries?limit=100', {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch('/api/admin/inquiries/stats', {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch('/api/admin/countries', {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch('/api/admin/inquiry-types', {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const [inqData, statsData, countriesData, typesData] = await Promise.all([
        inqRes.json(),
        statsRes.json(),
        countriesRes.json(),
        typesRes.json(),
      ]);

      if (inqData.success && Array.isArray(inqData.data)) {
        setInquiries(inqData.data);
      }
      if (statsData.success && statsData.data) {
        setStats(statsData.data);
      }
      if (countriesData.success && Array.isArray(countriesData.data)) {
        setCountries(countriesData.data);
      }
      if (typesData.success && Array.isArray(typesData.data)) {
        setInquiryTypes(typesData.data);
      }
    } catch (err) {
      console.error('Failed to load inquiries:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  // Open drawer and set notes
  const openInquiry = (inquiry: ContactInquiry) => {
    setActiveInquiry(inquiry);
    setAdminNotes(inquiry.adminNotes || '');
  };

  // Update Status
  const handleStatusChange = async (newStatus: InquiryStatus) => {
    if (!activeInquiry || !token || !canEdit('inquiries')) return;
    setUpdatingStatus(true);
    try {
      const res = await fetch(`/api/admin/inquiries/${activeInquiry.id}/status`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setActiveInquiry(data.data);
        setInquiries((prev) => prev.map((item) => (item.id === data.data.id ? data.data : item)));
        // Refresh stats
        fetch('/api/admin/inquiries/stats', {
          headers: { Authorization: `Bearer ${token}` },
        })
          .then((r) => r.json())
          .then((s) => s.success && setStats(s.data))
          .catch(() => {});
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    } finally {
      setUpdatingStatus(false);
    }
  };

  // Save Notes
  const handleSaveNotes = async () => {
    if (!activeInquiry || !token || !canEdit('inquiries')) return;
    setSavingNotes(true);
    try {
      const res = await fetch(`/api/admin/inquiries/${activeInquiry.id}/notes`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ adminNotes }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setActiveInquiry(data.data);
        setInquiries((prev) => prev.map((item) => (item.id === data.data.id ? data.data : item)));
      }
    } catch (err) {
      console.error('Failed to save notes:', err);
    } finally {
      setSavingNotes(false);
    }
  };

  // Delete Inquiry
  const handleDelete = async (id: string) => {
    if (!token || !canEdit('inquiries')) return;
    if (!window.confirm('Are you sure you want to delete this inquiry submission permanently?')) return;
    try {
      const res = await fetch(`/api/admin/inquiries/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setInquiries((prev) => prev.filter((item) => item.id !== id));
        if (activeInquiry?.id === id) setActiveInquiry(null);
        fetchData();
      }
    } catch (err) {
      console.error('Failed to delete inquiry:', err);
    }
  };

  // Filtered List
  const filteredInquiries = useMemo(() => {
    return inquiries.filter((inq) => {
      if (selectedStatus !== 'ALL' && inq.status !== selectedStatus) return false;
      if (selectedCountry !== 'ALL' && inq.country?.toLowerCase() !== selectedCountry.toLowerCase()) return false;
      if (selectedType !== 'ALL' && inq.inquiryType?.toLowerCase() !== selectedType.toLowerCase()) return false;
      if (search.trim()) {
        const query = search.toLowerCase();
        const match =
          inq.fullName.toLowerCase().includes(query) ||
          inq.email.toLowerCase().includes(query) ||
          (inq.orgName && inq.orgName.toLowerCase().includes(query)) ||
          inq.message.toLowerCase().includes(query);
        if (!match) return false;
      }
      return true;
    });
  }, [inquiries, selectedStatus, selectedCountry, selectedType, search]);

  const getStatusBadge = (status: InquiryStatus) => {
    switch (status) {
      case 'UNREAD':
        return <Badge className="bg-emerald-500/15 text-emerald-700 border-emerald-300 font-semibold text-[11px]">Unread Lead</Badge>;
      case 'READ':
        return <Badge className="bg-amber-500/15 text-amber-700 border-amber-300 font-semibold text-[11px]">Under Review</Badge>;
      case 'CONTACTED':
        return <Badge className="bg-blue-500/15 text-blue-700 border-blue-300 font-semibold text-[11px]">Contacted</Badge>;
      case 'RESOLVED':
        return <Badge className="bg-purple-500/15 text-purple-700 border-purple-300 font-semibold text-[11px]">Resolved</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#2A292D] flex items-center gap-2">
            <Inbox className="w-6 h-6 text-[#3BBA93]" />
            <span>Inquiries & Leads Inbox</span>
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Review incoming partnership, sales, and merchant support requests from the AvadaPay website.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchData}
            disabled={refreshing}
            className="rounded-xl border-gray-200 text-xs font-semibold space-x-1.5"
          >
            <RotateCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white border-gray-200/80 shadow-sm rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between pb-1 pt-4 px-5">
            <CardTitle className="text-xs font-semibold text-gray-500 tracking-wider">
              Total Inquiries
            </CardTitle>
            <Inbox className="w-4 h-4 text-[#3BBA93]" />
          </CardHeader>
          <CardContent className="px-5 pb-4">
            <div className="text-2xl font-black text-[#2A292D]">{stats.total}</div>
            <p className="text-[11px] text-gray-400 mt-0.5">All time submissions</p>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200/80 shadow-sm rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between pb-1 pt-4 px-5">
            <CardTitle className="text-xs font-semibold text-gray-500 tracking-wider">
              Unread Leads
            </CardTitle>
            <AlertCircle className="w-4 h-4 text-emerald-500" />
          </CardHeader>
          <CardContent className="px-5 pb-4">
            <div className="text-2xl font-black text-emerald-600">{stats.unread}</div>
            <p className="text-[11px] text-gray-400 mt-0.5">Require initial outreach</p>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200/80 shadow-sm rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between pb-1 pt-4 px-5">
            <CardTitle className="text-xs font-semibold text-gray-500 tracking-wider">
              Contacted
            </CardTitle>
            <Clock className="w-4 h-4 text-blue-500" />
          </CardHeader>
          <CardContent className="px-5 pb-4">
            <div className="text-2xl font-black text-blue-600">{stats.contacted}</div>
            <p className="text-[11px] text-gray-400 mt-0.5">Under conversation</p>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200/80 shadow-sm rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between pb-1 pt-4 px-5">
            <CardTitle className="text-xs font-semibold text-gray-500 tracking-wider">
              Resolved
            </CardTitle>
            <CheckCircle2 className="w-4 h-4 text-purple-500" />
          </CardHeader>
          <CardContent className="px-5 pb-4">
            <div className="text-2xl font-black text-purple-600">{stats.resolved}</div>
            <p className="text-[11px] text-gray-400 mt-0.5">Successfully concluded</p>
          </CardContent>
        </Card>
      </div>

      {/* Filter and Search Bar */}
      <Card className="bg-white border-gray-200/80 shadow-sm rounded-2xl p-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by sender name, email, organization, or message..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs bg-gray-50/80 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3BBA93] focus:bg-white transition-all text-[#2A292D]"
            />
          </div>

          {/* Status Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0">
            {['ALL', 'UNREAD', 'READ', 'CONTACTED', 'RESOLVED'].map((st) => (
              <button
                key={st}
                onClick={() => setSelectedStatus(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                  selectedStatus === st
                    ? 'bg-[#3BBA93] text-white shadow-sm'
                    : 'bg-gray-100 hover:bg-gray-200/70 text-gray-600'
                }`}
              >
                {st === 'ALL' ? 'All' : st}
              </button>
            ))}
          </div>

          {/* Country & Type Dropdowns */}
          <div className="flex items-center gap-2">
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="text-xs bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-[#3BBA93]"
            >
              <option value="ALL">All Countries</option>
              {countries.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>

            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="text-xs bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-[#3BBA93]"
            >
              <option value="ALL">All Categories</option>
              {inquiryTypes.map((t) => (
                <option key={t.id} value={t.key}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Inquiries Table */}
      <Card className="bg-white border-gray-200/80 shadow-sm rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-200/80 text-[11px] font-bold text-gray-500 tracking-wider">
                <th className="py-3 px-4">Sender & Contact</th>
                <th className="py-3 px-4">Market & Category</th>
                <th className="py-3 px-4">Message Snippet</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Handled By</th>
                <th className="py-3 px-4">Received</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-400">
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-5 h-5 border-2 border-[#3BBA93] border-t-transparent rounded-full animate-spin"></div>
                      <span>Loading incoming inquiries...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredInquiries.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-400">
                    <Inbox className="w-8 h-8 mx-auto text-gray-300 mb-2" />
                    <p className="font-semibold text-gray-600">No inquiries found matching criteria</p>
                    <p className="text-[11px] text-gray-400 mt-1">Try clearing filters or search terms</p>
                  </td>
                </tr>
              ) : (
                filteredInquiries.map((inq) => (
                  <tr
                    key={inq.id}
                    onClick={() => openInquiry(inq)}
                    className="hover:bg-gray-50/80 cursor-pointer transition-colors group"
                  >
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-[#2A292D] group-hover:text-[#3BBA93] transition-colors">
                        {inq.fullName}
                      </div>
                      <div className="text-[11px] text-gray-500 flex items-center gap-2 mt-0.5">
                        <span>{inq.email}</span>
                        {inq.phone && <span>• {inq.phone}</span>}
                      </div>
                      {inq.orgName && (
                        <div className="text-[10px] text-gray-400 flex items-center gap-1 mt-0.5">
                          <Building className="w-3 h-3" />
                          <span>{inq.orgName}</span>
                        </div>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-gray-100 text-gray-700 font-semibold text-[11px]">
                        <Globe2 className="w-3 h-3 text-[#3BBA93]" />
                        <span>{inq.country || 'Global'}</span>
                      </div>
                      <div className="text-[11px] text-gray-500 mt-1 font-medium">{inq.inquiryType}</div>
                    </td>

                    <td className="py-3.5 px-4 max-w-xs">
                      <p className="text-gray-700 font-medium truncate">{inq.message}</p>
                    </td>

                    <td className="py-3.5 px-4">{getStatusBadge(inq.status)}</td>

                    <td className="py-3.5 px-4">
                      {inq.handledBy ? (
                        <div className="text-[11px]">
                          <span className="font-semibold text-gray-800">{inq.handledBy.name}</span>
                          <div className="text-[10px] text-gray-400">
                            {inq.handledAt ? new Date(inq.handledAt).toLocaleDateString() : 'Active'}
                          </div>
                        </div>
                      ) : (
                        <span className="text-gray-400 text-[11px] italic">Unassigned</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap text-gray-500 text-[11px]">
                      {new Date(inq.createdAt).toLocaleString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>

                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          openInquiry(inq);
                        }}
                        className="text-xs text-[#3BBA93] hover:text-[#2A292D] font-bold"
                      >
                        Inspect
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Inquiry Detail Drawer / Modal */}
      {activeInquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-6 bg-[#2A292D] text-white flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold tracking-wider text-[#3BBA93]">Inquiry Details</span>
                  <span className="text-white/40">•</span>
                  <span className="text-xs text-white/70">ID: {activeInquiry.id.slice(0, 8)}</span>
                </div>
                <h2 className="text-xl font-bold">{activeInquiry.fullName}</h2>
                <div className="text-xs text-white/70 mt-1 flex flex-wrap items-center gap-3">
                  <span className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-[#3BBA93]" />
                    {activeInquiry.email}
                  </span>
                  {activeInquiry.phone && (
                    <span className="flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-[#3BBA93]" />
                      {activeInquiry.phone}
                    </span>
                  )}
                  {activeInquiry.orgName && (
                    <span className="flex items-center gap-1">
                      <Building className="w-3.5 h-3.5 text-[#3BBA93]" />
                      {activeInquiry.orgName}
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={() => setActiveInquiry(null)}
                className="text-white/60 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
              {/* Submission Metadata */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-2xl bg-gray-50 border border-gray-100">
                <div>
                  <span className="text-[10px] text-gray-400 font-bold">Country</span>
                  <p className="font-bold text-gray-800 mt-0.5">{activeInquiry.country || 'Global'}</p>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 font-bold">Category</span>
                  <p className="font-bold text-gray-800 mt-0.5">{activeInquiry.inquiryType}</p>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 font-bold">Submitted</span>
                  <p className="font-bold text-gray-800 mt-0.5">
                    {new Date(activeInquiry.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 font-bold">Current Status</span>
                  <div className="mt-0.5">{getStatusBadge(activeInquiry.status)}</div>
                </div>
              </div>

              {/* Message Content */}
              <div>
                <label className="text-xs font-bold text-gray-700 tracking-wider block mb-2">
                  Customer Message
                </label>
                <div className="p-4 rounded-2xl bg-gray-50/80 border border-gray-200/70 text-gray-800 text-sm whitespace-pre-wrap leading-relaxed font-normal">
                  {activeInquiry.message}
                </div>
              </div>

              {/* Action: Status Workflow */}
              <div className="p-4 rounded-2xl border border-gray-200/80 bg-white space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-gray-800 flex items-center gap-1.5">
                    <UserCheck className="w-4 h-4 text-[#3BBA93]" />
                    <span>Response & Workflow Status</span>
                  </span>
                  {activeInquiry.handledBy && (
                    <span className="text-[11px] text-gray-500">
                      Handled by <strong className="text-gray-800">{activeInquiry.handledBy.name}</strong> (
                      {activeInquiry.handledAt ? new Date(activeInquiry.handledAt).toLocaleDateString() : 'Recent'})
                    </span>
                  )}
                </div>

                {canEdit('inquiries') ? (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {(['UNREAD', 'READ', 'CONTACTED', 'RESOLVED'] as const).map((st) => (
                      <Button
                        key={st}
                        size="sm"
                        disabled={updatingStatus}
                        variant={activeInquiry.status === st ? 'gradient' : 'outline'}
                        onClick={() => handleStatusChange(st)}
                        className={`text-xs font-bold rounded-xl ${
                          activeInquiry.status === st ? 'shadow-md' : 'border-gray-200 text-gray-700'
                        }`}
                      >
                        {st}
                      </Button>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 italic text-[11px]">
                    You have view-only permissions. Status cannot be modified.
                  </p>
                )}
              </div>

              {/* Internal Notes */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-700 tracking-wider flex items-center justify-between">
                  <span>Internal Staff Notes</span>
                  <span className="text-[10px] text-gray-400 font-normal">Private team log</span>
                </label>
                <textarea
                  rows={3}
                  disabled={!canEdit('inquiries')}
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Record outcome of phone call, email response, assigned account manager, or follow-up details..."
                  className="w-full p-3 text-xs bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#3BBA93] focus:bg-white transition-all text-[#2A292D]"
                />
                {canEdit('inquiries') && (
                  <div className="flex justify-end">
                    <Button
                      size="sm"
                      onClick={handleSaveNotes}
                      disabled={savingNotes}
                      className="bg-[#2A292D] hover:bg-black text-white text-xs font-bold rounded-xl space-x-1.5"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>{savingNotes ? 'Saving...' : 'Save Notes'}</span>
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
              {canEdit('inquiries') ? (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(activeInquiry.id)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50 text-xs font-bold space-x-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Inquiry</span>
                </Button>
              ) : (
                <div />
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActiveInquiry(null)}
                className="rounded-xl border-gray-200 text-xs font-bold"
              >
                Close Drawer
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
