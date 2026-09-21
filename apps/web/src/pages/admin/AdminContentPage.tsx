import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, AlertCircle, RefreshCw, X } from 'lucide-react';
import { ContentItem } from '@avada/shared';

export const AdminContentPage: React.FC = () => {
  const { token } = useAuth();
  const [items, setItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form State for creating new item
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('announcements');
  const [status, setStatus] = useState<'PUBLISHED' | 'DRAFT'>('PUBLISHED');
  const [excerpt, setExcerpt] = useState('');
  const [body, setBody] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchItems = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/content');
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setItems(data.data);
      } else {
        throw new Error(data.error || 'Failed to retrieve content');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setSaving(true);
    setError(null);

    try {
      const res = await fetch('/api/content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          category,
          status,
          excerpt,
          body,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to save content item');
      }

      setShowModal(false);
      setTitle('');
      setExcerpt('');
      setBody('');
      fetchItems();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this content item?')) return;
    if (!token) return;

    try {
      const res = await fetch(`/api/content/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to delete');
      }

      setItems(items.filter((item) => item.id !== id));
    } catch (err: any) {
      alert(`Delete error: ${err.message}`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Content Articles & Pages</h1>
          <p className="text-xs text-muted-foreground mt-1">
            Create, publish, and manage all site content stored in the Avada PostgreSQL database.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={fetchItems} disabled={loading}>
            <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </Button>
          <Button variant="gradient" size="sm" onClick={() => setShowModal(true)}>
            <Plus className="w-3.5 h-3.5 mr-1.5" />
            <span>New Article</span>
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Content Table Card */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40%]">Title & Slug</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Date Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-xs text-muted-foreground">
                    Fetching content records from API...
                  </TableCell>
                </TableRow>
              ) : items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-xs text-muted-foreground">
                    No articles found. Click "New Article" to create your first content piece.
                  </TableCell>
                </TableRow>
              ) : (
                items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">
                      <div className="text-foreground text-sm font-semibold">{item.title}</div>
                      <div className="text-xs text-muted-foreground font-mono mt-0.5">/{item.slug}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="capitalize text-[11px]">
                        {item.category}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={item.status === 'PUBLISHED' ? 'success' : 'warning'}>
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {item.author?.name || 'Administrator'}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(item.id)}
                        className="text-muted-foreground hover:text-destructive"
                        title="Delete article"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create Content Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <div>
                <h3 className="text-base font-bold text-foreground">Create New Content Article</h3>
                <p className="text-xs text-muted-foreground">Publish or draft new company announcements</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowModal(false)}
                className="rounded-full w-8 h-8 text-muted-foreground"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="title" className="text-xs">Article Title</Label>
                <Input
                  id="title"
                  placeholder="e.g. Next-Gen Multi-Currency Virtual Accounts"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="category" className="text-xs">Category</Label>
                  <select
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    <option value="announcements">Announcements</option>
                    <option value="products">Products</option>
                    <option value="security">Security</option>
                    <option value="insights">Insights</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="status" className="text-xs">Publishing Status</Label>
                  <select
                    id="status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    <option value="PUBLISHED">Published (Live)</option>
                    <option value="DRAFT">Draft</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="excerpt" className="text-xs">Short Excerpt / Summary</Label>
                <Input
                  id="excerpt"
                  placeholder="Brief summary appearing on homepage news cards..."
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="body" className="text-xs">Body Content</Label>
                <textarea
                  id="body"
                  rows={5}
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="Write the full article text here..."
                  className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  required
                />
              </div>

              <div className="pt-4 border-t border-border flex items-center justify-end space-x-3">
                <Button variant="outline" type="button" onClick={() => setShowModal(false)}>
                  Cancel
                </Button>
                <Button variant="gradient" type="submit" disabled={saving}>
                  {saving ? 'Publishing...' : 'Save & Publish'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
