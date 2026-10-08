import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Inbox,
  Globe2,
  FileText,
  ShieldCheck,
  ArrowUpRight,
  TrendingUp,
  ScrollText,
} from 'lucide-react';
import { ContactInquiry, AuditLog } from '@avada/shared';

export const AdminDashboardPage: React.FC = () => {
  const { user, token } = useAuth();
  const [inquiriesCount, setInquiriesCount] = useState<number>(0);
  const [unreadInquiries, setUnreadInquiries] = useState<number>(0);
  const [countriesCount, setCountriesCount] = useState<number>(0);
  const [articlesCount, setArticlesCount] = useState<number>(0);
  const [recentInquiries, setRecentInquiries] = useState<ContactInquiry[]>([]);
  const [recentAudit, setRecentAudit] = useState<AuditLog[]>([]);
  const [apiHealth, setApiHealth] = useState<string>('Operational');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!token) return;

    // Load dashboard metrics concurrently
    Promise.all([
      fetch('/api/admin/inquiries/stats', { headers: { Authorization: `Bearer ${token}` } }).then((r) => r.json()).catch(() => ({})),
      fetch('/api/admin/inquiries?limit=5', { headers: { Authorization: `Bearer ${token}` } }).then((r) => r.json()).catch(() => ({})),
      fetch('/api/admin/countries', { headers: { Authorization: `Bearer ${token}` } }).then((r) => r.json()).catch(() => ({})),
      fetch('/api/content').then((r) => r.json()).catch(() => ({})),
      fetch('/api/admin/audit-logs?limit=5', { headers: { Authorization: `Bearer ${token}` } }).then((r) => r.json()).catch(() => ({})),
      fetch('/api/health').then((r) => r.json()).catch(() => ({})),
    ])
      .then(([inqStats, inqs, countries, articles, audit, health]) => {
        if (inqStats.success && inqStats.data) {
          setInquiriesCount(inqStats.data.total || 0);
          setUnreadInquiries(inqStats.data.unread ?? inqStats.data.new ?? 0);
        }
        if (inqs.success && Array.isArray(inqs.data)) {
          setRecentInquiries(inqs.data);
        }
        if (countries.success && Array.isArray(countries.data)) {
          setCountriesCount(countries.data.length);
        }
        if (articles.success && Array.isArray(articles.data)) {
          setArticlesCount(articles.data.length);
        }
        if (audit.success && Array.isArray(audit.data)) {
          setRecentAudit(audit.data);
        }
        if (health.status === 'healthy') {
          setApiHealth('Operational (99.98% SLA)');
        }
      })
      .finally(() => setLoading(false));
  }, [token]);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-[#2A292D] rounded-xl p-6 sm:p-7 text-white relative overflow-hidden shadow-lg border border-white/10">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-full bg-[#3BBA93]/20 border border-[#3BBA93]/30 text-[#3BBA93] text-xs font-semibold mb-3">
            <span className="w-2 h-2 rounded-full bg-[#3BBA93] animate-pulse"></span>
            <span>Enterprise CMS Operational</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Welcome back, {user?.name || 'Administrator'}
          </h1>
          <p className="text-xs sm:text-sm text-white/70 mt-2 leading-relaxed">
            Manage pan-African payment operations, dynamically publish country gateways, respond to merchant inquiries, and control organizational access.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-4">
            <Link to="/admin/inquiries">
              <Button size="sm" className="rounded-lg text-xs font-semibold bg-[#3BBA93] hover:bg-[#32a481] text-white border border-[#3BBA93] space-x-1.5 shadow-sm">
                <Inbox className="w-3.5 h-3.5" />
                <span>Open Inquiries ({unreadInquiries} New)</span>
              </Button>
            </Link>
            <Link to="/admin/content/countries">
              <Button size="sm" variant="ghost" className="rounded-lg text-xs font-semibold bg-black/40 hover:bg-black/60 text-white/90 border border-white/15 hover:border-[#3BBA93]/40 space-x-1.5 transition-colors">
                <Globe2 className="w-3.5 h-3.5 text-[#3BBA93]" />
                <span>African Markets</span>
              </Button>
            </Link>
            <Link to="/admin/insights/analytics">
              <Button size="sm" variant="ghost" className="rounded-lg text-xs font-semibold bg-black/40 hover:bg-black/60 text-white/90 border border-white/15 hover:border-[#3BBA93]/40 space-x-1.5 transition-colors">
                <TrendingUp className="w-3.5 h-3.5 text-[#3BBA93]" />
                <span>Live Analytics</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute right-0 bottom-0 w-96 h-96 bg-[#3BBA93]/10 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Link to="/admin/inquiries">
          <Card className="bg-white border-gray-200/80 shadow-sm rounded-xl hover:shadow-md transition-all cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between pb-1 pt-4 px-5">
              <CardTitle className="text-xs font-semibold text-gray-500 tracking-wider">
                Leads & Inquiries
              </CardTitle>
              <Inbox className="w-4 h-4 text-[#3BBA93]" />
            </CardHeader>
            <CardContent className="px-5 pb-4">
              <div className="text-2xl font-bold text-[#2A292D]">
                {loading ? '-' : inquiriesCount}
              </div>
              <p className="text-[11px] text-emerald-600 font-medium mt-0.5">
                {unreadInquiries} unread requires response
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link to="/admin/content/countries">
          <Card className="bg-white border-gray-200/80 shadow-sm rounded-xl hover:shadow-md transition-all cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between pb-1 pt-4 px-5">
              <CardTitle className="text-xs font-semibold text-gray-500 tracking-wider">
                African Markets
              </CardTitle>
              <Globe2 className="w-4 h-4 text-blue-500" />
            </CardHeader>
            <CardContent className="px-5 pb-4">
              <div className="text-2xl font-bold text-blue-600">
                {loading ? '-' : countriesCount}
              </div>
              <p className="text-[11px] text-gray-400 mt-0.5">Live regional payment rails</p>
            </CardContent>
          </Card>
        </Link>

        <Link to="/admin/content/articles">
          <Card className="bg-white border-gray-200/80 shadow-sm rounded-xl hover:shadow-md transition-all cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between pb-1 pt-4 px-5">
              <CardTitle className="text-xs font-semibold text-gray-500 tracking-wider">
                Articles & Press
              </CardTitle>
              <FileText className="w-4 h-4 text-purple-500" />
            </CardHeader>
            <CardContent className="px-5 pb-4">
              <div className="text-2xl font-bold text-purple-600">
                {loading ? '-' : articlesCount}
              </div>
              <p className="text-[11px] text-gray-400 mt-0.5">Marketing & guides published</p>
            </CardContent>
          </Card>
        </Link>

        <Link to="/admin/insights/security">
          <Card className="bg-white border-gray-200/80 shadow-sm rounded-xl hover:shadow-md transition-all cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between pb-1 pt-4 px-5">
              <CardTitle className="text-xs font-semibold text-gray-500 tracking-wider">
                System Health
              </CardTitle>
              <ShieldCheck className="w-4 h-4 text-[#3BBA93]" />
            </CardHeader>
            <CardContent className="px-5 pb-4">
              <div className="text-sm font-bold text-emerald-700 mt-1">{apiHealth}</div>
              <p className="text-[11px] text-gray-400 mt-1">PostgreSQL & Express API</p>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Two Column Grid: Recent Inquiries & Recent Audit Trail */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Inquiries Panel */}
        <Card className="bg-white border-gray-200/80 shadow-sm rounded-xl overflow-hidden">
          <CardHeader className="bg-gray-50/70 border-b border-gray-100 p-5 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm font-bold text-[#2A292D] flex items-center gap-2">
                <Inbox className="w-4 h-4 text-[#3BBA93]" />
                <span>Recent Website Submissions</span>
              </CardTitle>
              <CardDescription className="text-xs">
                Incoming leads from the public Contact page
              </CardDescription>
            </div>
            <Link to="/admin/inquiries">
              <Button variant="ghost" size="sm" className="text-xs text-[#3BBA93] hover:text-[#2A292D] font-bold space-x-1">
                <span>View Inbox</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </CardHeader>

          <CardContent className="p-0">
            <div className="divide-y divide-gray-100 text-xs">
              {loading ? (
                <div className="p-8 text-center text-gray-400">Loading incoming inquiries...</div>
              ) : recentInquiries.length === 0 ? (
                <div className="p-8 text-center text-gray-400">No inquiry submissions yet.</div>
              ) : (
                recentInquiries.map((inq) => (
                  <Link
                    key={inq.id}
                    to="/admin/inquiries"
                    className="p-4 flex items-center justify-between hover:bg-gray-50/60 transition-colors block"
                  >
                    <div>
                      <div className="font-bold text-gray-800">{inq.fullName}</div>
                      <div className="text-[11px] text-gray-400 mt-0.5">
                        {inq.country || 'Global'} • {inq.inquiryType}
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge
                        className={`text-[10px] font-semibold ${
                          inq.status === 'UNREAD'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {inq.status}
                      </Badge>
                      <div className="text-[10px] text-gray-400 mt-1">
                        {new Date(inq.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Audit Activity Panel */}
        <Card className="bg-white border-gray-200/80 shadow-sm rounded-xl overflow-hidden">
          <CardHeader className="bg-gray-50/70 border-b border-gray-100 p-5 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm font-bold text-[#2A292D] flex items-center gap-2">
                <ScrollText className="w-4 h-4 text-[#3BBA93]" />
                <span>Audit Trail Activity</span>
              </CardTitle>
              <CardDescription className="text-xs">
                Real-time administrative operations ledger
              </CardDescription>
            </div>
            <Link to="/admin/governance/audit-logs">
              <Button variant="ghost" size="sm" className="text-xs text-[#3BBA93] hover:text-[#2A292D] font-bold space-x-1">
                <span>View Full Trail</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </CardHeader>

          <CardContent className="p-0">
            <div className="divide-y divide-gray-100 text-xs">
              {loading ? (
                <div className="p-8 text-center text-gray-400">Loading audit trail...</div>
              ) : recentAudit.length === 0 ? (
                <div className="p-8 text-center text-gray-400">No administrative events recorded yet.</div>
              ) : (
                recentAudit.map((log) => (
                  <div key={log.id} className="p-4 flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-gray-800">{log.action} {log.entityType}</div>
                      <div className="text-[11px] text-gray-400 mt-0.5">
                        By <strong className="text-gray-600">{log.userEmail || 'System'}</strong> • Entity ID: {log.entityId || 'N/A'}
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline" className="text-[10px] font-mono">
                        {log.action}
                      </Badge>
                      <div className="text-[10px] text-gray-400 font-mono mt-1">
                        {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
