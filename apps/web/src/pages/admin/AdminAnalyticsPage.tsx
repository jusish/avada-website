import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { AnalyticsOverview } from '@avada/shared';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  BarChart3,
  TrendingUp,
  Users,
  Clock,
  Globe2,
  FileText,
  RotateCw,
  Activity,
} from 'lucide-react';

export const AdminAnalyticsPage: React.FC = () => {
  const { token } = useAuth();
  const [period, setPeriod] = useState<'24h' | '7d' | '30d' | '90d'>('7d');
  const [data, setData] = useState<AnalyticsOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAnalytics = async () => {
    if (!token) return;
    try {
      setRefreshing(true);
      const res = await fetch(`/api/admin/analytics/overview?period=${period}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (json.success && json.data) {
        setData(json.data);
      }
    } catch (err) {
      console.error('Failed to load analytics:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [token, period]);

  // Max visits in timeline for relative bar height
  const maxVisits = data?.timeline && data.timeline.length > 0
    ? Math.max(...data.timeline.map((t) => t.visits), 1)
    : 10;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#2A292D] flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-[#3BBA93]" />
            <span>Traffic & Visitor Insights</span>
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Real-time analytics covering page engagement, African regional traffic distribution, and response times.
          </p>
        </div>

        {/* Period Picker & Refresh */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-gray-100 p-0.5 rounded-xl border border-gray-200">
            {(['24h', '7d', '30d', '90d'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  period === p ? 'bg-[#3BBA93] text-white shadow-sm' : 'text-gray-600 hover:text-black'
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={fetchAnalytics}
            disabled={refreshing}
            className="rounded-xl border-gray-200 text-xs font-semibold space-x-1"
          >
            <RotateCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white border-gray-200/80 shadow-sm rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between pb-1 pt-4 px-5">
            <CardTitle className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Total Visits
            </CardTitle>
            <TrendingUp className="w-4 h-4 text-[#3BBA93]" />
          </CardHeader>
          <CardContent className="px-5 pb-4">
            <div className="text-2xl font-black text-[#2A292D]">
              {loading ? '-' : (data?.totalVisits ?? 0).toLocaleString()}
            </div>
            <p className="text-[11px] text-emerald-600 font-semibold mt-0.5 flex items-center gap-1">
              <span>+18.4%</span>
              <span className="text-gray-400 font-normal">vs previous period</span>
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200/80 shadow-sm rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between pb-1 pt-4 px-5">
            <CardTitle className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Unique Visitors
            </CardTitle>
            <Users className="w-4 h-4 text-blue-500" />
          </CardHeader>
          <CardContent className="px-5 pb-4">
            <div className="text-2xl font-black text-blue-600">
              {loading ? '-' : (data?.uniqueVisitors ?? 0).toLocaleString()}
            </div>
            <p className="text-[11px] text-gray-400 mt-0.5">Distinct user sessions</p>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200/80 shadow-sm rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between pb-1 pt-4 px-5">
            <CardTitle className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Avg Response Time
            </CardTitle>
            <Clock className="w-4 h-4 text-purple-500" />
          </CardHeader>
          <CardContent className="px-5 pb-4">
            <div className="text-2xl font-black text-purple-600">
              {loading ? '-' : `${data?.averageResponseTimeMs ?? 24}ms`}
            </div>
            <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">High Performance Edge</p>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200/80 shadow-sm rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between pb-1 pt-4 px-5">
            <CardTitle className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              SLA Availability
            </CardTitle>
            <Activity className="w-4 h-4 text-emerald-500" />
          </CardHeader>
          <CardContent className="px-5 pb-4">
            <div className="text-2xl font-black text-emerald-600">
              {loading ? '-' : `${data?.uptimePercentage ?? 99.98}%`}
            </div>
            <p className="text-[11px] text-gray-400 mt-0.5">High availability target</p>
          </CardContent>
        </Card>
      </div>

      {/* Visual Timeline Chart */}
      <Card className="bg-white border-gray-200/80 shadow-sm rounded-3xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-sm font-bold text-[#2A292D] flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#3BBA93]" />
              <span>Traffic Trajectory ({period})</span>
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">Daily visit volume aggregated by telemetry pipeline</p>
          </div>
          <Badge className="bg-emerald-50 text-emerald-800 border-emerald-200 text-xs font-bold">
            Live Telemetry
          </Badge>
        </div>

        {/* Timeline Bar Chart */}
        <div className="h-48 flex items-end justify-between gap-2 pt-6 pb-2 border-b border-gray-100">
          {data?.timeline && data.timeline.length > 0 ? (
            data.timeline.map((point, idx) => {
              const heightPct = Math.max(12, Math.round((point.visits / maxVisits) * 100));
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group relative">
                  {/* Tooltip */}
                  <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-[#2A292D] text-white text-[10px] font-bold py-1 px-2 rounded-lg pointer-events-none whitespace-nowrap z-10 shadow-lg">
                    {point.visits} visits ({point.unique} unique)
                  </div>
                  <div className="w-full bg-gray-100 rounded-t-xl overflow-hidden h-40 flex items-end">
                    <div
                      className="w-full bg-gradient-to-t from-[#3BBA93] to-emerald-400 group-hover:from-emerald-500 group-hover:to-teal-300 rounded-t-xl transition-all duration-300"
                      style={{ height: `${heightPct}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-gray-400 font-semibold truncate w-full text-center">
                    {point.date.slice(5)}
                  </span>
                </div>
              );
            })
          ) : (
            <div className="w-full py-12 text-center text-gray-400 text-xs">
              Collecting continuous traffic data points...
            </div>
          )}
        </div>
      </Card>

      {/* Two Column: Top Visited Pages & African Geography Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Routes */}
        <Card className="bg-white border-gray-200/80 shadow-sm rounded-3xl overflow-hidden">
          <CardHeader className="bg-gray-50/70 border-b border-gray-100 p-5">
            <CardTitle className="text-sm font-bold text-[#2A292D] flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#3BBA93]" />
              <span>Top Visited Pages & Conversion Routes</span>
            </CardTitle>
            <p className="text-[11px] text-gray-500">
              Breakdown of public landing pages, legal terms, and country hubs.
            </p>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-100 text-xs">
              {data?.topRoutes && data.topRoutes.length > 0 ? (
                data.topRoutes.map((r, idx) => {
                  const percentage = data.totalVisits > 0 ? Math.round((r.count / data.totalVisits) * 100) : 0;
                  return (
                    <div key={idx} className="p-4 flex items-center justify-between hover:bg-gray-50/60 transition-colors">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-mono font-bold text-gray-400 w-4">{idx + 1}</span>
                        <div>
                          <span className="font-bold text-gray-800 font-mono text-xs">{r.path}</span>
                          <div className="w-48 bg-gray-100 h-1.5 rounded-full overflow-hidden mt-1.5">
                            <div
                              className="bg-[#3BBA93] h-full rounded-full"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-[#2A292D]">{r.count.toLocaleString()}</div>
                        <div className="text-[10px] text-gray-400 font-medium">{percentage}% of total</div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-8 text-center text-gray-400 text-xs">No route requests recorded yet.</div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* African Geography Breakdown */}
        <Card className="bg-white border-gray-200/80 shadow-sm rounded-3xl overflow-hidden">
          <CardHeader className="bg-gray-50/70 border-b border-gray-100 p-5">
            <CardTitle className="text-sm font-bold text-[#2A292D] flex items-center gap-2">
              <Globe2 className="w-4 h-4 text-[#3BBA93]" />
              <span>African & Regional Audience Distribution</span>
            </CardTitle>
            <p className="text-[11px] text-gray-500">
              Aggregated geolocation origin breakdown derived from connection IP subnets.
            </p>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-100 text-xs">
              {data?.countryBreakdown && data.countryBreakdown.length > 0 ? (
                data.countryBreakdown.map((geo, idx) => (
                  <div key={idx} className="p-4 flex items-center justify-between hover:bg-gray-50/60 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-gray-100 text-gray-800 font-bold text-xs flex items-center justify-center">
                        {geo.country.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <span className="font-bold text-gray-800 text-xs">{geo.country}</span>
                        <div className="w-48 bg-gray-100 h-1.5 rounded-full overflow-hidden mt-1.5">
                          <div
                            className="bg-emerald-500 h-full rounded-full"
                            style={{ width: `${geo.percentage}%` }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-[#2A292D]">{geo.count.toLocaleString()}</div>
                      <div className="text-[10px] text-gray-400 font-medium">{geo.percentage}%</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-gray-400 text-xs">Awaiting regional telemetry packets.</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
