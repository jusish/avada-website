import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Integration, IntegrationLog, JobVacancy } from '@avada/shared';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { IntegrationLogModal } from '@/components/admin/IntegrationLogModal';
import {
  Cpu,
  Activity,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Eye,
  EyeOff,
  Save,
  Search,
  Trash2,
  Zap,
  Briefcase,
  ToggleLeft,
  ToggleRight,
  Building2,
  MapPin,
} from 'lucide-react';

interface IntegrationWithStats extends Integration {
  stats?: {
    totalLogs: number;
    activeVacancies: number;
  };
}

export const AdminIntegrationsPage: React.FC = () => {
  const { token, canEdit } = useAuth();

  // State
  const [integrations, setIntegrations] = useState<IntegrationWithStats[]>([]);
  const [plannedIntegrations, setPlannedIntegrations] = useState<Array<{ key: string; name: string; category: string; description: string }>>([]);
  const [selectedKey, setSelectedKey] = useState<string>('peopleforce');
  const [activeTab, setActiveTab] = useState<'health' | 'config' | 'logs'>('health');
  const [loading, setLoading] = useState<boolean>(true);

  // PeopleForce Config State
  const [apiKey, setApiKey] = useState<string>('');
  const [showApiKey, setShowApiKey] = useState<boolean>(false);
  const [baseUrl, setBaseUrl] = useState<string>('https://app.peopleforce.io/api/careers/v1');
  const [enabled, setEnabled] = useState<boolean>(true);
  const [autoSync, setAutoSync] = useState<boolean>(true);
  const [savingConfig, setSavingConfig] = useState<boolean>(false);
  const [configSuccess, setConfigSuccess] = useState<string | null>(null);

  // Health Test State
  const [testingHealth, setTestingHealth] = useState<boolean>(false);
  const [healthResult, setHealthResult] = useState<{
    healthy: boolean;
    latencyMs: number;
    statusCode: number;
    message: string;
  } | null>(null);

  // Vacancy Sync State
  const [syncingVacancies, setSyncingVacancies] = useState<boolean>(false);
  const [syncedVacancies, setSyncedVacancies] = useState<JobVacancy[]>([]);
  const [syncSuccess, setSyncSuccess] = useState<string | null>(null);

  // Logs State
  const [logs, setLogs] = useState<IntegrationLog[]>([]);
  const [logsLoading, setLogsLoading] = useState<boolean>(false);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [selectedLog, setSelectedLog] = useState<IntegrationLog | null>(null);

  // Fetch Integrations List
  const fetchIntegrations = useCallback(async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/admin/integrations', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success && data.data) {
        setIntegrations(data.data.active || []);
        setPlannedIntegrations(data.data.planned || []);

        const pf = (data.data.active || []).find((i: Integration) => i.key === 'peopleforce');
        if (pf) {
          const cfg = (pf.config as Record<string, unknown>) || {};
          setApiKey((cfg.apiKey as string) || '');
          setBaseUrl((cfg.baseUrl as string) || 'https://app.peopleforce.io/api/careers/v1');
          setEnabled(pf.enabled);
          setAutoSync(typeof cfg.autoSync === 'boolean' ? cfg.autoSync : true);
        }
      }
    } catch (err) {
      console.error('Failed to load integrations:', err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Fetch Synced Vacancies
  const fetchVacancies = useCallback(async () => {
    try {
      const res = await fetch('/api/public/careers/vacancies');
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setSyncedVacancies(data.data);
      }
    } catch (err) {
      console.error('Failed to load vacancies:', err);
    }
  }, []);

  // Fetch Integration Logs
  const fetchLogs = useCallback(
    async (currentPage = page, status = statusFilter, search = searchQuery) => {
      if (!token) return;
      setLogsLoading(true);
      try {
        const queryParams = new URLSearchParams({
          page: String(currentPage),
          limit: '15',
        });
        if (status !== 'ALL') queryParams.append('status', status);
        if (search.trim()) queryParams.append('search', search.trim());

        const res = await fetch(`/api/admin/integrations/${selectedKey}/logs?${queryParams.toString()}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success && Array.isArray(data.data)) {
          setLogs(data.data);
          setTotalPages(data.pagination?.totalPages || 1);
        }
      } catch (err) {
        console.error('Failed to load logs:', err);
      } finally {
        setLogsLoading(false);
      }
    },
    [token, selectedKey, page, statusFilter, searchQuery]
  );

  useEffect(() => {
    fetchIntegrations();
    fetchVacancies();
  }, [fetchIntegrations, fetchVacancies]);

  useEffect(() => {
    if (activeTab === 'logs') {
      fetchLogs(1, statusFilter, searchQuery);
    }
  }, [activeTab, statusFilter, fetchLogs, searchQuery]);

  // Handle Live Health Check
  const handleTestHealth = async () => {
    if (!token) return;
    setTestingHealth(true);
    setHealthResult(null);
    try {
      const res = await fetch(`/api/admin/integrations/${selectedKey}/health`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setHealthResult(data.data);
      fetchIntegrations();
      if (activeTab === 'logs') fetchLogs();
    } catch (err) {
      console.error('Health test error:', err);
      setHealthResult({
        healthy: false,
        latencyMs: 0,
        statusCode: 0,
        message: 'Network request error occurred while contacting the server.',
      });
    } finally {
      setTestingHealth(false);
    }
  };

  // Handle Manual Vacancy Sync
  const handleSyncVacancies = async () => {
    if (!token) return;
    setSyncingVacancies(true);
    setSyncSuccess(null);
    try {
      const res = await fetch(`/api/admin/integrations/${selectedKey}/sync`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setSyncSuccess(data.message || 'Vacancies successfully synchronized.');
        fetchVacancies();
        fetchIntegrations();
        if (activeTab === 'logs') fetchLogs();
        setTimeout(() => setSyncSuccess(null), 4000);
      } else {
        alert(data.error || 'Failed to sync vacancies.');
      }
    } catch (err) {
      console.error('Sync error:', err);
      alert('An error occurred during synchronization.');
    } finally {
      setSyncingVacancies(false);
    }
  };

  // Handle Save Configuration
  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !canEdit('integrations')) return;
    setSavingConfig(true);
    try {
      const res = await fetch(`/api/admin/integrations/${selectedKey}/config`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          apiKey,
          baseUrl,
          enabled,
          autoSync,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setConfigSuccess('Integration configuration saved successfully.');
        fetchIntegrations();
        setTimeout(() => setConfigSuccess(null), 4000);
      } else {
        alert(data.error || 'Failed to save configuration.');
      }
    } catch (err) {
      console.error('Save config error:', err);
      alert('Network error while saving configuration.');
    } finally {
      setSavingConfig(false);
    }
  };

  // Handle Clear Logs
  const handleClearLogs = async () => {
    if (!token || !canEdit('integrations')) return;
    if (!window.confirm('Are you sure you want to clear all integration logs for PeopleForce?')) return;
    try {
      const res = await fetch(`/api/admin/integrations/${selectedKey}/logs`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setLogs([]);
        setPage(1);
        fetchIntegrations();
      }
    } catch (err) {
      console.error('Clear logs error:', err);
    }
  };

  const selectedIntegration = integrations.find((i) => i.key === selectedKey);

  return (
    <div className="space-y-6">
      {/* Page Title & Subtitle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#2A292D] flex items-center gap-2">
            <Cpu className="w-6 h-6 text-[#3BBA93]" />
            <span>Integrations & External APIs</span>
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Configure external API connections, monitor live health telemetry, and inspect detailed request/response logs.
          </p>
        </div>

        {/* Global Live Careers Website Button */}
        <div className="flex items-center gap-2">
          <a
            href="/careers"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-white border border-gray-200 text-gray-700 hover:text-[#3BBA93] hover:border-[#3BBA93]/30 transition-all shadow-sm"
          >
            <Briefcase className="w-3.5 h-3.5 text-[#3BBA93]" />
            <span>View Public Careers Page</span>
            <ExternalLink className="w-3 h-3 text-gray-400" />
          </a>
        </div>
      </div>

      {/* Integrations Directory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* PeopleForce Card */}
        {loading ? (
          <div className="col-span-full py-8 text-center text-xs text-gray-400">
            Loading integrations...
          </div>
        ) : (
          integrations.map((item) => {
            const isSelected = selectedKey === item.key;
            const isHealthy = item.status === 'HEALTHY';
            const latency = item.latencyMs ? `${item.latencyMs}ms` : '--';

            return (
              <div
                key={item.key}
                onClick={() => setSelectedKey(item.key)}
                className={`p-4 rounded-xl border transition-all cursor-pointer bg-white relative overflow-hidden ${
                  isSelected
                    ? 'border-[#3BBA93] ring-2 ring-[#3BBA93]/10 shadow-md'
                    : 'border-gray-200/90 hover:border-gray-300 shadow-sm'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-9 h-9 rounded-lg bg-emerald-50 text-[#3BBA93] flex items-center justify-center font-bold text-xs border border-emerald-100">
                      PF
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-[#2A292D] flex items-center gap-1.5">
                        <span>{item.name}</span>
                      </h3>
                      <p className="text-[11px] text-gray-400">{item.category}</p>
                    </div>
                  </div>

                  {/* Status Indicator */}
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      isHealthy
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : item.status === 'DEGRADED'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full mr-1 ${
                        isHealthy ? 'bg-emerald-500 animate-pulse' : 'bg-gray-400'
                      }`}
                    />
                    {item.status}
                  </span>
                </div>

                <p className="text-[11px] text-gray-500 mt-3 line-clamp-2">
                  {item.description || 'Synchronizes open vacancies and recruitment data.'}
                </p>

                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px]">
                  <span className="text-gray-400">
                    Latency: <strong className="text-gray-700">{latency}</strong>
                  </span>
                  <span className="text-[#3BBA93] font-bold">
                    {item.stats?.activeVacancies || 0} active roles
                  </span>
                </div>
              </div>
            );
          })
        )}

        {/* Planned Integrations (Showcases Extensible Architecture) */}
        {plannedIntegrations.map((planned) => (
          <div
            key={planned.key}
            className="p-4 rounded-xl border border-dashed border-gray-200 bg-gray-50/60 opacity-80 select-none relative"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold text-xs text-gray-700">{planned.name}</h3>
                <p className="text-[10px] text-gray-400">{planned.category}</p>
              </div>
              <Badge variant="outline" className="text-[9px] text-gray-400 border-gray-200">
                Future Slot
              </Badge>
            </div>
            <p className="text-[11px] text-gray-400 mt-2 line-clamp-2">
              {planned.description}
            </p>
            <div className="mt-3 pt-2 border-t border-gray-100 text-[10px] text-gray-400 flex items-center justify-between">
              <span>Ready for integration</span>
              <span className="font-semibold text-gray-400">Modular</span>
            </div>
          </div>
        ))}
      </div>

      {/* Management Studio for Selected Integration (PeopleForce) */}
      {selectedIntegration && (
        <Card className="bg-white border-gray-200/90 shadow-sm rounded-xl overflow-hidden">
          {/* Studio Header & Tab Switcher */}
          <CardHeader className="bg-gray-50/80 border-b border-gray-100 p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center space-x-2">
                  <CardTitle className="text-base font-bold text-[#2A292D]">
                    {selectedIntegration.name}
                  </CardTitle>
                  <Badge className="bg-[#3BBA93]/15 text-[#3BBA93] border-[#3BBA93]/30 text-[10px] font-bold">
                    Active Module
                  </Badge>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">
                  Connected to PeopleForce ATS Cloud • Endpoint: <code className="text-[#3BBA93] font-mono text-[11px]">/api/careers/v1/vacancies</code>
                </p>
              </div>

              {/* Sub-tabs */}
              <div className="flex items-center space-x-1 bg-white p-1 rounded-xl border border-gray-200 text-xs">
                <button
                  type="button"
                  onClick={() => setActiveTab('health')}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
                    activeTab === 'health'
                      ? 'bg-[#3BBA93] text-white shadow-xs'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Activity className="w-3.5 h-3.5" />
                  <span>Health & Sync</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('config')}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
                    activeTab === 'config'
                      ? 'bg-[#3BBA93] text-white shadow-xs'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Cpu className="w-3.5 h-3.5" />
                  <span>Configuration</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('logs')}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
                    activeTab === 'logs'
                      ? 'bg-[#3BBA93] text-white shadow-xs'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>Integration Logs</span>
                  {selectedIntegration.stats?.totalLogs ? (
                    <span className="text-[10px] px-1 rounded-full bg-black/10">
                      {selectedIntegration.stats.totalLogs}
                    </span>
                  ) : null}
                </button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            {/* TAB 1: HEALTH & VACANCIES SYNC */}
            {activeTab === 'health' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Live Connection Diagnostics Card */}
                  <div className="p-5 rounded-xl border border-gray-200/90 bg-gray-50/50 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Activity className="w-4 h-4 text-[#3BBA93]" />
                        <h4 className="font-bold text-xs text-gray-800">
                          Live Endpoint Connection & Latency
                        </h4>
                      </div>
                      <Badge
                        className={
                          selectedIntegration.status === 'HEALTHY'
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-200 text-[10px] font-bold'
                            : 'bg-amber-100 text-amber-800 border-amber-200 text-[10px] font-bold'
                        }
                      >
                        {selectedIntegration.status}
                      </Badge>
                    </div>

                    <p className="text-xs text-gray-500 leading-relaxed">
                      Sends an authenticated lightweight ping to PeopleForce Careers API to test latency, TLS certificate validity, and endpoint response.
                    </p>

                    <div className="grid grid-cols-3 gap-3 pt-1">
                      <div className="p-3 rounded-lg bg-white border border-gray-200/80">
                        <span className="text-[10px] text-gray-400 font-bold block">Roundtrip Latency</span>
                        <span className="text-base font-black text-[#2A292D]">
                          {selectedIntegration.latencyMs ? `${selectedIntegration.latencyMs}ms` : '--'}
                        </span>
                      </div>
                      <div className="p-3 rounded-lg bg-white border border-gray-200/80">
                        <span className="text-[10px] text-gray-400 font-bold block">HTTP Status</span>
                        <span className="text-base font-black text-emerald-700">200 OK</span>
                      </div>
                      <div className="p-3 rounded-lg bg-white border border-gray-200/80">
                        <span className="text-[10px] text-gray-400 font-bold block">Last Tested</span>
                        <span className="text-[11px] font-semibold text-gray-700 truncate block">
                          {selectedIntegration.lastHealthCheck
                            ? new Date(selectedIntegration.lastHealthCheck).toLocaleTimeString()
                            : 'Never'}
                        </span>
                      </div>
                    </div>

                    {healthResult && (
                      <div
                        className={`p-3 rounded-lg text-xs flex items-center space-x-2 ${
                          healthResult.healthy
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : 'bg-red-50 text-red-800 border border-red-200'
                        }`}
                      >
                        {healthResult.healthy ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                        )}
                        <span>{healthResult.message}</span>
                      </div>
                    )}

                    <div className="pt-2 flex justify-end">
                      <Button
                        type="button"
                        onClick={handleTestHealth}
                        disabled={testingHealth}
                        variant="outline"
                        size="sm"
                        className="rounded-lg text-xs font-bold border-gray-200 space-x-1.5"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${testingHealth ? 'animate-spin text-[#3BBA93]' : ''}`} />
                        <span>{testingHealth ? 'Testing Connection...' : 'Test Connection Now'}</span>
                      </Button>
                    </div>
                  </div>

                  {/* Vacancy Synchronization Card */}
                  <div className="p-5 rounded-xl border border-gray-200/90 bg-gray-50/50 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Briefcase className="w-4 h-4 text-[#3BBA93]" />
                        <h4 className="font-bold text-xs text-gray-800">
                          Careers Vacancy Synchronization
                        </h4>
                      </div>
                      <span className="text-[11px] font-bold text-[#3BBA93]">
                        {syncedVacancies.length} Positions Cached
                      </span>
                    </div>

                    <p className="text-xs text-gray-500 leading-relaxed">
                      Pulls all active job postings from PeopleForce into the local database. Keeps the public <code className="text-[#3BBA93] font-mono text-[11px]">/careers</code> page lightning fast with sub-10ms response times.
                    </p>

                    <div className="grid grid-cols-2 gap-3 pt-1">
                      <div className="p-3 rounded-lg bg-white border border-gray-200/80">
                        <span className="text-[10px] text-gray-400 font-bold block">Active Postings</span>
                        <span className="text-base font-black text-[#2A292D]">
                          {syncedVacancies.length} Roles
                        </span>
                      </div>
                      <div className="p-3 rounded-lg bg-white border border-gray-200/80">
                        <span className="text-[10px] text-gray-400 font-bold block">Last Synchronized</span>
                        <span className="text-[11px] font-semibold text-gray-700 truncate block">
                          {selectedIntegration.lastSyncAt
                            ? new Date(selectedIntegration.lastSyncAt).toLocaleString()
                            : 'Pending Initial Sync'}
                        </span>
                      </div>
                    </div>

                    {syncSuccess && (
                      <div className="p-3 rounded-lg text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center space-x-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                        <span>{syncSuccess}</span>
                      </div>
                    )}

                    <div className="pt-2 flex justify-end">
                      <Button
                        type="button"
                        onClick={handleSyncVacancies}
                        disabled={syncingVacancies}
                        variant="gradient"
                        size="sm"
                        className="rounded-lg text-xs font-bold space-x-1.5"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${syncingVacancies ? 'animate-spin' : ''}`} />
                        <span>{syncingVacancies ? 'Syncing Vacancies...' : 'Sync Vacancies Now'}</span>
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Synced Vacancies Table Preview */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-xs text-gray-800 flex items-center gap-1.5">
                      <Building2 className="w-4 h-4 text-[#3BBA93]" />
                      <span>Currently Active Vacancies in Database ({syncedVacancies.length})</span>
                    </h4>
                    <span className="text-[11px] text-gray-400">
                      Synchronized via PeopleForce API
                    </span>
                  </div>

                  <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-xs">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-200 text-[11px] font-bold text-gray-500">
                          <th className="py-2.5 px-4">Role Title</th>
                          <th className="py-2.5 px-4">Department</th>
                          <th className="py-2.5 px-4">Location</th>
                          <th className="py-2.5 px-4">Type</th>
                          <th className="py-2.5 px-4 text-right">Apply Link</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {syncedVacancies.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="py-8 text-center text-gray-400">
                              No vacancies cached. Click "Sync Vacancies Now" above.
                            </td>
                          </tr>
                        ) : (
                          syncedVacancies.map((vac) => (
                            <tr key={vac.id} className="hover:bg-gray-50/70 transition-colors">
                              <td className="py-3 px-4 font-bold text-[#2A292D]">
                                {vac.title}
                              </td>
                              <td className="py-3 px-4 text-gray-600 font-medium">
                                <Badge variant="secondary" className="text-[10px]">
                                  {vac.department || 'General'}
                                </Badge>
                              </td>
                              <td className="py-3 px-4 text-gray-600">
                                <span className="flex items-center space-x-1">
                                  <MapPin className="w-3 h-3 text-gray-400" />
                                  <span>{vac.location}</span>
                                </span>
                              </td>
                              <td className="py-3 px-4 text-gray-600 font-medium">
                                {vac.employmentType}
                              </td>
                              <td className="py-3 px-4 text-right">
                                <a
                                  href={vac.applyUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center space-x-1 text-[11px] text-[#3BBA93] hover:underline font-semibold"
                                >
                                  <span>View on ATS</span>
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: CONFIGURATION & CREDENTIALS */}
            {activeTab === 'config' && (
              <form onSubmit={handleSaveConfig} className="max-w-2xl space-y-5 text-xs">
                {configSuccess && (
                  <div className="p-3 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center space-x-2 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-[#3BBA93]" />
                    <span>{configSuccess}</span>
                  </div>
                )}

                {/* API Key */}
                <div>
                  <Label className="text-xs font-bold text-gray-700 block mb-1">
                    PeopleForce Careers API Key (X-API-KEY) *
                  </Label>
                  <div className="relative">
                    <Input
                      type={showApiKey ? 'text' : 'password'}
                      required
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      placeholder="Enter PeopleForce Careers API key..."
                      className="pr-20 font-mono text-xs rounded-xl bg-gray-50 border-gray-200 focus:bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => setShowApiKey(!showApiKey)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 p-1"
                    >
                      {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <span className="text-[10px] text-gray-400 mt-1 block">
                    Saved directly in PostgreSQL database (`integrations` table). Masked in audit logs.
                  </span>
                </div>

                {/* Base URL */}
                <div>
                  <Label className="text-xs font-bold text-gray-700 block mb-1">
                    PeopleForce Careers API Base URL
                  </Label>
                  <Input
                    type="url"
                    required
                    value={baseUrl}
                    onChange={(e) => setBaseUrl(e.target.value)}
                    placeholder="https://app.peopleforce.io/api/careers/v1"
                    className="font-mono text-xs rounded-xl bg-gray-50 border-gray-200 focus:bg-white"
                  />
                  <span className="text-[10px] text-gray-400 mt-1 block">
                    Default: <code className="text-[#3BBA93]">https://app.peopleforce.io/api/careers/v1</code>
                  </span>
                </div>

                {/* Polling / Sync Interval */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs font-bold text-gray-700 block mb-1">
                      Automated Background Sync
                    </Label>
                    <Select
                      value={autoSync ? 'true' : 'false'}
                      onValueChange={(val) => setAutoSync(val === 'true')}
                    >
                      <SelectTrigger className="w-full rounded-xl bg-gray-50 border-gray-200 text-xs">
                        <SelectValue placeholder="Sync status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">Enabled (Auto-Sync)</SelectItem>
                        <SelectItem value="false">Manual Sync Only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-xs font-bold text-gray-700 block mb-1">
                      Integration Status
                    </Label>
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() => setEnabled(!enabled)}
                        className="flex items-center gap-2 cursor-pointer font-semibold text-xs"
                      >
                        {enabled ? (
                          <>
                            <ToggleRight className="w-6 h-6 text-[#3BBA93]" />
                            <span className="text-emerald-700 font-bold">Integration Active</span>
                          </>
                        ) : (
                          <>
                            <ToggleLeft className="w-6 h-6 text-gray-300" />
                            <span className="text-gray-400">Integration Disabled</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  {canEdit('integrations') && (
                    <Button
                      type="submit"
                      disabled={savingConfig}
                      variant="gradient"
                      size="sm"
                      className="rounded-xl text-xs font-bold space-x-1.5"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>{savingConfig ? 'Saving...' : 'Save Configuration'}</span>
                    </Button>
                  )}
                </div>
              </form>
            )}

            {/* TAB 3: INTEGRATION LOGS EXPLORER */}
            {activeTab === 'logs' && (
              <div className="space-y-4">
                {/* Search & Filter Toolbar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-gray-100">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-semibold text-gray-500">Filter Status:</span>
                    {['ALL', 'SUCCESS', 'ERROR'].map((st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => {
                          setStatusFilter(st);
                          setPage(1);
                        }}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors ${
                          statusFilter === st
                            ? 'bg-[#3BBA93] text-white shadow-xs'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <Input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search URL or endpoint..."
                        className="h-8 pl-8 text-xs rounded-lg w-52 bg-gray-50 border-gray-200"
                      />
                    </div>

                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => fetchLogs()}
                      className="h-8 text-xs border-gray-200"
                      title="Refresh Logs"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${logsLoading ? 'animate-spin' : ''}`} />
                    </Button>

                    {canEdit('integrations') && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleClearLogs}
                        className="h-8 text-xs border-gray-200 text-red-500 hover:text-red-700 hover:bg-red-50"
                        title="Clear Logs"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    )}
                  </div>
                </div>

                {/* Logs Table */}
                <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-xs">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200 text-[11px] font-bold text-gray-500 tracking-wider">
                        <th className="py-2.5 px-4 w-20">Method</th>
                        <th className="py-2.5 px-4">Endpoint & URL</th>
                        <th className="py-2.5 px-4 w-28 text-center">HTTP Status</th>
                        <th className="py-2.5 px-4 w-24 text-center">Duration</th>
                        <th className="py-2.5 px-4 w-40">Timestamp</th>
                        <th className="py-2.5 px-4 text-right w-24">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 font-mono">
                      {logsLoading ? (
                        <tr>
                          <td colSpan={6} className="py-8 text-center text-gray-400">
                            Loading integration logs...
                          </td>
                        </tr>
                      ) : logs.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-8 text-center text-gray-400">
                            No logs found matching criteria.
                          </td>
                        </tr>
                      ) : (
                        logs.map((log) => {
                          const isOk = log.responseStatus >= 200 && log.responseStatus < 300;
                          return (
                            <tr key={log.id} className="hover:bg-gray-50/70 transition-colors font-sans">
                              <td className="py-2.5 px-4">
                                <Badge className="bg-gray-100 text-gray-800 text-[10px] font-bold font-mono">
                                  {log.method}
                                </Badge>
                              </td>
                              <td className="py-2.5 px-4 font-mono text-[11px] text-gray-700 truncate max-w-xs">
                                <span className="font-semibold text-[#2A292D]">{log.endpoint}</span>
                              </td>
                              <td className="py-2.5 px-4 text-center">
                                <Badge
                                  className={
                                    isOk
                                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px] font-bold'
                                      : 'bg-red-50 text-red-700 border-red-200 text-[10px] font-bold'
                                  }
                                >
                                  {log.responseStatus || 'FAILED'}
                                </Badge>
                              </td>
                              <td className="py-2.5 px-4 text-center font-mono text-[11px] text-gray-500">
                                {log.durationMs}ms
                              </td>
                              <td className="py-2.5 px-4 text-[11px] text-gray-500">
                                {new Date(log.createdAt).toLocaleString()}
                              </td>
                              <td className="py-2.5 px-4 text-right">
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setSelectedLog(log)}
                                  className="h-7 px-2 text-[11px] rounded-lg font-semibold border-gray-200 text-gray-700 hover:text-[#3BBA93]"
                                >
                                  Inspect
                                </Button>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between text-xs pt-2">
                    <span className="text-gray-500">
                      Page {page} of {totalPages}
                    </span>
                    <div className="flex space-x-1">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={page <= 1}
                        onClick={() => {
                          const p = page - 1;
                          setPage(p);
                          fetchLogs(p);
                        }}
                        className="h-7 text-xs border-gray-200"
                      >
                        Previous
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={page >= totalPages}
                        onClick={() => {
                          const p = page + 1;
                          setPage(p);
                          fetchLogs(p);
                        }}
                        className="h-7 text-xs border-gray-200"
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Log Inspector Modal */}
      <IntegrationLogModal
        log={selectedLog}
        isOpen={Boolean(selectedLog)}
        onClose={() => setSelectedLog(null)}
      />
    </div>
  );
};
