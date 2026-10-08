import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ScrollText,
  Search,
  Eye,
  X,
  RotateCw,
} from 'lucide-react';

interface AuditLogItem {
  id: string;
  userId?: string | null;
  userEmail: string;
  action: string;
  entityType: string;
  entityId?: string | null;
  details?: any;
  ipAddress?: string | null;
  userAgent?: string | null;
  user?: { id: string; name: string; email: string } | null;
  createdAt: string;
}

export const AdminAuditLogsPage: React.FC = () => {
  const { token } = useAuth();
  const [logs, setLogs] = useState<AuditLogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Filters
  const [search, setSearch] = useState('');
  const [selectedEntity, setSelectedEntity] = useState<string>('ALL');
  const [selectedAction, setSelectedAction] = useState<string>('ALL');

  // Selected Log for Diff Modal
  const [activeLog, setActiveLog] = useState<AuditLogItem | null>(null);

  const fetchLogs = async () => {
    if (!token) return;
    try {
      setRefreshing(true);
      let query = '/api/admin/audit-logs?limit=100';
      if (selectedEntity !== 'ALL') query += `&entityType=${selectedEntity}`;
      if (selectedAction !== 'ALL') query += `&action=${selectedAction}`;
      if (search.trim()) query += `&search=${encodeURIComponent(search.trim())}`;

      const res = await fetch(query, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setLogs(data.data);
      }
    } catch (err) {
      console.error('Failed to load audit logs:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [token, selectedEntity, selectedAction]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchLogs();
  };

  const getActionBadge = (action: string) => {
    if (action.includes('CREATE')) {
      return <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px] font-bold">CREATE</Badge>;
    }
    if (action.includes('UPDATE') || action.includes('EDIT')) {
      return <Badge className="bg-blue-50 text-blue-700 border-blue-200 text-[10px] font-bold">UPDATE</Badge>;
    }
    if (action.includes('DELETE')) {
      return <Badge className="bg-red-50 text-red-700 border-red-200 text-[10px] font-bold">DELETE</Badge>;
    }
    if (action.includes('TOGGLE')) {
      return <Badge className="bg-amber-50 text-amber-700 border-amber-200 text-[10px] font-bold">TOGGLE</Badge>;
    }
    return <Badge variant="outline" className="text-[10px] font-bold">{action}</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#2A292D] flex items-center gap-2">
            <ScrollText className="w-6 h-6 text-[#3BBA93]" />
            <span>System Audit Trail & Compliance Ledger</span>
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Immutable log of all administrative actions, data modifications, before/after diffs, and security events.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchLogs}
            disabled={refreshing}
            className="rounded-xl border-gray-200 text-xs font-semibold space-x-1"
          >
            <RotateCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Refresh Logs</span>
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <Card className="bg-white border-gray-200/80 shadow-sm rounded-2xl p-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative flex-1 w-full sm:w-auto">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by action, email, or entity..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3BBA93] text-[#2A292D]"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={selectedEntity}
              onChange={(e) => setSelectedEntity(e.target.value)}
              className="text-xs bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-gray-700 font-medium focus:ring-2 focus:ring-[#3BBA93]"
            >
              <option value="ALL">All Entities</option>
              <option value="ContactInquiry">Inquiries</option>
              <option value="InquiryType">Inquiry Categories</option>
              <option value="Country">Countries & Markets</option>
              <option value="LegalPolicy">Legal Policies</option>
              <option value="SiteSetting">Site Settings</option>
              <option value="Role">Roles & Access</option>
              <option value="User">Team Members</option>
              <option value="ContentItem">Articles</option>
            </select>

            <select
              value={selectedAction}
              onChange={(e) => setSelectedAction(e.target.value)}
              className="text-xs bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-gray-700 font-medium focus:ring-2 focus:ring-[#3BBA93]"
            >
              <option value="ALL">All Actions</option>
              <option value="CREATE">CREATE</option>
              <option value="UPDATE">UPDATE</option>
              <option value="DELETE">DELETE</option>
              <option value="TOGGLE">TOGGLE</option>
              <option value="LOGIN">LOGIN</option>
            </select>

            <Button type="submit" variant="gradient" size="sm" className="rounded-xl text-xs font-bold px-4">
              Filter
            </Button>
          </div>
        </form>
      </Card>

      {/* Audit Log Table */}
      <Card className="bg-white border-gray-200/80 shadow-sm rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-200/80 text-[11px] font-bold text-gray-500 tracking-wider">
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Actor / Staff</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Entity Type</th>
                <th className="py-3 px-4">Entity ID</th>
                <th className="py-3 px-4">IP Address</th>
                <th className="py-3 px-4 text-right">Inspection</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-gray-400">
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 border-2 border-[#3BBA93] border-t-transparent rounded-full animate-spin"></div>
                      <span>Querying audit ledger...</span>
                    </div>
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-gray-400">
                    No audit records found matching criteria.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="py-3 px-4 text-gray-500 font-mono text-[11px] whitespace-nowrap">
                      {new Date(log.createdAt).toLocaleString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                      })}
                    </td>

                    <td className="py-3 px-4">
                      {log.user ? (
                        <div>
                          <div className="font-bold text-gray-800">{log.user.name}</div>
                          <div className="text-[10px] text-gray-400">{log.user.email}</div>
                        </div>
                      ) : (
                        <div>
                          <div className="font-bold text-gray-700">{log.userEmail}</div>
                          <div className="text-[10px] text-gray-400 italic">Direct Credentials</div>
                        </div>
                      )}
                    </td>

                    <td className="py-3 px-4">{getActionBadge(log.action)}</td>

                    <td className="py-3 px-4 font-mono font-bold text-gray-600 text-[11px]">
                      {log.entityType}
                    </td>

                    <td className="py-3 px-4 font-mono text-gray-500 text-[11px] max-w-[120px] truncate">
                      {log.entityId || '—'}
                    </td>

                    <td className="py-3 px-4 font-mono text-gray-400 text-[11px]">
                      {log.ipAddress || '127.0.0.1'}
                    </td>

                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      {log.details ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setActiveLog(log)}
                          className="text-xs text-[#3BBA93] hover:text-[#2A292D] font-bold space-x-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View Payload</span>
                        </Button>
                      ) : (
                        <span className="text-gray-300 text-[11px] italic">No payload</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Modal: Diff / Details Viewer */}
      {activeLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="p-5 bg-[#2A292D] text-white flex items-center justify-between">
              <div>
                <span className="text-xs font-bold tracking-wider text-[#3BBA93]">
                  Audit Record Details
                </span>
                <h2 className="text-lg font-bold">{activeLog.action}</h2>
                <div className="text-xs text-white/60 mt-0.5">
                  Actor: <strong>{activeLog.user?.name || activeLog.userEmail}</strong> • Entity: <strong>{activeLog.entityType}</strong>
                </div>
              </div>
              <button
                onClick={() => setActiveLog(null)}
                className="text-white/60 hover:text-white p-1 rounded-full hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4 text-xs overflow-y-auto flex-1">
              <div className="space-y-1.5">
                <label className="font-bold text-gray-700 tracking-wider text-[11px] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#3BBA93]"></span>
                  <span>Modification Payload & Before/After Snapshot</span>
                </label>
                <pre className="p-4 bg-gray-50 border border-gray-200 rounded-2xl text-[11px] font-mono text-gray-800 overflow-x-auto max-h-96 leading-relaxed">
                  {JSON.stringify(activeLog.details, null, 2)}
                </pre>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
              <span className="text-[11px] text-gray-400 font-mono">
                Log ID: {activeLog.id} • IP: {activeLog.ipAddress || '127.0.0.1'}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActiveLog(null)}
                className="rounded-xl border-gray-200 text-xs font-bold"
              >
                Close Inspector
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
