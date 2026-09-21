import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, CheckCircle2, Clock, Activity, Plus, ArrowUpRight } from 'lucide-react';
import { ContentItem } from '@avada/shared';

export const AdminDashboardPage: React.FC = () => {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [apiHealth, setApiHealth] = useState<string>('Checking...');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check API health
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 'healthy') setApiHealth('Operational (5005)');
        else setApiHealth('Degraded');
      })
      .catch(() => setApiHealth('Offline'));

    // Fetch items
    fetch('/api/content')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          setItems(data.data);
        }
      })
      .catch((err) => console.error('Failed to load items:', err))
      .finally(() => setLoading(false));
  }, []);

  const publishedCount = items.filter((i) => i.status === 'PUBLISHED').length;
  const draftCount = items.filter((i) => i.status === 'DRAFT').length;

  return (
    <div className="space-y-8">
      {/* Top action header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Content Management Overview</h1>
          <p className="text-xs text-muted-foreground mt-1">
            Monitor publishing activity, backend health, and manage customer-facing articles.
          </p>
        </div>
        <Link to="/admin/content">
          <Button variant="gradient" size="sm" className="space-x-2">
            <Plus className="w-4 h-4" />
            <span>Manage Content Items</span>
          </Button>
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase">
              Total Articles
            </CardTitle>
            <FileText className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{loading ? '-' : items.length}</div>
            <p className="text-[11px] text-muted-foreground mt-1">Managed CMS resources</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase">
              Live & Published
            </CardTitle>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              {loading ? '-' : publishedCount}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">Visible on public marketing site</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase">
              Drafts & Staging
            </CardTitle>
            <Clock className="w-4 h-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
              {loading ? '-' : draftCount}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">Under review by editors</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase">
              Backend API Status
            </CardTitle>
            <Activity className="w-4 h-4 text-cyan-500" />
          </CardHeader>
          <CardContent>
            <div className="text-sm font-bold text-foreground mt-1">{apiHealth}</div>
            <p className="text-[11px] text-muted-foreground mt-2">Node.js Express + Prisma</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent content snapshot */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base">Recent Content Activity</CardTitle>
            <CardDescription className="text-xs">
              Latest items synced from PostgreSQL database
            </CardDescription>
          </div>
          <Link to="/admin/content">
            <Button variant="ghost" size="sm" className="space-x-1 text-xs text-primary">
              <span>View All</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-xs text-muted-foreground py-4">Loading content records...</p>
          ) : items.length === 0 ? (
            <p className="text-xs text-muted-foreground py-4">No content items found.</p>
          ) : (
            <div className="divide-y divide-border">
              {items.slice(0, 5).map((item) => (
                <div key={item.id} className="py-3 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium text-foreground">{item.title}</p>
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                      <span className="capitalize">{item.category}</span>
                      <span>•</span>
                      <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <Badge variant={item.status === 'PUBLISHED' ? 'success' : 'warning'}>
                    {item.status}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
