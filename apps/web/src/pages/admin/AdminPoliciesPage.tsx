import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { LegalPolicy, ContentStatus } from '@avada/shared';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Scale,
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  Save,
  Calendar,
  ShieldCheck,
} from 'lucide-react';

export const AdminPoliciesPage: React.FC = () => {
  const { token, canEdit } = useAuth();
  const [policies, setPolicies] = useState<LegalPolicy[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPolicy, setEditingPolicy] = useState<LegalPolicy | null>(null);
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState<{
    title: string;
    slug: string;
    summary: string;
    content: string;
    version: string;
    effectiveDate: string;
    status: ContentStatus;
  }>({
    title: '',
    slug: '',
    summary: '',
    content: '',
    version: '2026.1',
    effectiveDate: new Date().toISOString().split('T')[0],
    status: 'PUBLISHED',
  });

  const fetchPolicies = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const res = await fetch('/api/admin/policies', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setPolicies(data.data);
      }
    } catch (err) {
      console.error('Failed to load policies:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPolicies();
  }, [token]);

  // Open Create
  const handleOpenCreate = () => {
    setEditingPolicy(null);
    setForm({
      title: '',
      slug: '',
      summary: '',
      content: '## 1. Overview\n\nAvadaPay provides secure financial infrastructure across Africa...',
      version: '2026.1',
      effectiveDate: new Date().toISOString().split('T')[0],
      status: 'PUBLISHED',
    });
    setActiveTab('edit');
    setIsModalOpen(true);
  };

  // Open Edit
  const handleOpenEdit = (p: LegalPolicy) => {
    setEditingPolicy(p);
    setForm({
      title: p.title,
      slug: p.slug,
      summary: p.summary || '',
      content: p.content,
      version: p.version,
      effectiveDate: p.effectiveDate.slice(0, 10),
      status: p.status,
    });
    setActiveTab('edit');
    setIsModalOpen(true);
  };

  // Auto-slugify
  const handleTitleChange = (val: string) => {
    if (!editingPolicy) {
      const generatedSlug = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      setForm((prev) => ({ ...prev, title: val, slug: generatedSlug }));
    } else {
      setForm((prev) => ({ ...prev, title: val }));
    }
  };

  // Save (Create or Update)
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !canEdit('policies')) return;
    setSaving(true);
    try {
      const url = editingPolicy
        ? `/api/admin/policies/${editingPolicy.id}`
        : '/api/admin/policies';
      const method = editingPolicy ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (json.success) {
        setIsModalOpen(false);
        fetchPolicies();
      } else {
        alert(json.error || 'Failed to save policy');
      }
    } catch (err) {
      console.error('Save error:', err);
    } finally {
      setSaving(false);
    }
  };

  // Delete
  const handleDelete = async (id: string, title: string) => {
    if (!token || !canEdit('policies')) return;
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;
    try {
      const res = await fetch(`/api/admin/policies/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setPolicies((prev) => prev.filter((item) => item.id !== id));
      } else {
        alert(data.error || 'Failed to delete policy');
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#2A292D] flex items-center gap-2">
            <Scale className="w-6 h-6 text-[#3BBA93]" />
            <span>Legal Documents & Compliance Policies</span>
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Author and version corporate Terms of Service, Privacy Policy, Cookie Policy, and regulatory agreements.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {canEdit('policies') && (
            <Button
              variant="gradient"
              size="sm"
              onClick={handleOpenCreate}
              className="space-x-1.5 rounded-xl font-bold text-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Create Legal Document</span>
            </Button>
          )}
        </div>
      </div>

      {/* Policies List Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading ? (
          <div className="col-span-full py-16 text-center text-gray-400">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-5 h-5 border-2 border-[#3BBA93] border-t-transparent rounded-full animate-spin"></div>
              <span className="text-xs">Loading legal policies...</span>
            </div>
          </div>
        ) : policies.length === 0 ? (
          <div className="col-span-full py-16 text-center text-gray-400 bg-white rounded-xl border border-gray-100">
            <Scale className="w-10 h-10 mx-auto text-gray-300 mb-2" />
            <p className="font-bold text-gray-600">No legal policies found</p>
          </div>
        ) : (
          policies.map((pol) => (
            <Card
              key={pol.id}
              className="bg-white border border-gray-200/90 shadow-sm rounded-xl overflow-hidden flex flex-col justify-between hover:shadow-md transition-all"
            >
              <div>
                {/* Card Top */}
                <div className="p-5 pb-3 border-b border-gray-100 flex items-start justify-between">
                  <div>
                    <span className="text-[11px] font-semibold text-[#3BBA93] flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Version {pol.version}</span>
                    </span>
                    <h3 className="font-bold text-base text-[#2A292D] mt-1">{pol.title}</h3>
                    <div className="text-[11px] text-gray-400 font-mono mt-0.5">/{pol.slug}</div>
                  </div>

                  {pol.status === 'PUBLISHED' ? (
                    <Badge className="bg-emerald-500/15 text-emerald-700 border-emerald-300 text-[10px] font-semibold">
                      Published
                    </Badge>
                  ) : pol.status === 'DRAFT' ? (
                    <Badge variant="outline" className="text-amber-600 border-amber-300 text-[10px]">
                      Draft
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-gray-400 border-gray-300 text-[10px]">
                      Archived
                    </Badge>
                  )}
                </div>

                {/* Card Body */}
                <div className="p-5 space-y-3 text-xs">
                  {pol.summary && (
                    <p className="text-gray-600 line-clamp-3 leading-relaxed">{pol.summary}</p>
                  )}

                  <div className="flex items-center gap-2 text-[11px] text-gray-400">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Effective: {new Date(pol.effectiveDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="p-4 bg-gray-50/80 border-t border-gray-100 flex items-center justify-between">
                <a
                  href={`/${pol.slug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-[#3BBA93] hover:text-[#2A292D] transition-colors"
                >
                  <span>View Live Page</span>
                  <ExternalLink className="w-3 h-3" />
                </a>

                <div className="flex items-center gap-1">
                  {canEdit('policies') && (
                    <>
                      <button
                        onClick={() => handleOpenEdit(pol)}
                        title="Edit Policy"
                        className="p-1.5 rounded-lg hover:bg-gray-200/70 text-gray-600 transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(pol.id, pol.title)}
                        title="Delete Policy"
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

      {/* Editor Dialog */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-0 rounded-xl gap-0 border-gray-200">
          {/* Header */}
          <div className="p-5 bg-[#2A292D] text-white">
            <span className="text-xs font-semibold text-[#3BBA93] block mb-1">
              {editingPolicy ? 'Edit Compliance Document' : 'Create Legal Policy'}
            </span>
            <DialogTitle className="text-lg font-bold text-white">
              {editingPolicy ? editingPolicy.title : 'New Legal Document'}
            </DialogTitle>
          </div>

          {/* Form Body */}
          <form onSubmit={handleSave} className="p-6 space-y-4 text-xs overflow-y-auto flex-1">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Document Title *</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="e.g. Terms of Service"
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#3BBA93] focus:bg-white text-[#2A292D]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">URL Path Slug *</label>
                <input
                  type="text"
                  required
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  placeholder="e.g. terms"
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg font-mono text-xs focus:ring-2 focus:ring-[#3BBA93] focus:bg-white text-[#2A292D]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Version Number *</label>
                <input
                  type="text"
                  required
                  value={form.version}
                  onChange={(e) => setForm({ ...form, version: e.target.value })}
                  placeholder="e.g. 2026.1"
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg font-semibold text-[#2A292D]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Effective Date *</label>
                <input
                  type="date"
                  required
                  value={form.effectiveDate}
                  onChange={(e) => setForm({ ...form, effectiveDate: e.target.value })}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg font-semibold text-[#2A292D]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Executive Summary / Banner Subtitle</label>
              <textarea
                rows={2}
                value={form.summary}
                onChange={(e) => setForm({ ...form, summary: e.target.value })}
                placeholder="Summary of terms or privacy scope..."
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#3BBA93] focus:bg-white text-[#2A292D]"
              />
            </div>

            {/* Content Tabs (Edit vs Preview) */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-gray-700">Document Body (Markdown Supported)</label>
                <div className="flex items-center gap-1 bg-gray-100 p-0.5 rounded-lg">
                  <button
                    type="button"
                    onClick={() => setActiveTab('edit')}
                    className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                      activeTab === 'edit' ? 'bg-white text-[#2A292D] shadow-sm' : 'text-gray-500'
                    }`}
                  >
                    Markdown Editor
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('preview')}
                    className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                      activeTab === 'preview' ? 'bg-white text-[#2A292D] shadow-sm' : 'text-gray-500'
                    }`}
                  >
                    Formatted Preview
                  </button>
                </div>
              </div>

              {activeTab === 'edit' ? (
                <textarea
                  rows={12}
                  required
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  placeholder="## 1. Introduction&#10;&#10;Write markdown terms here..."
                  className="w-full p-3 font-mono text-xs bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#3BBA93] focus:bg-white text-[#2A292D] leading-relaxed"
                />
              ) : (
                <div className="w-full h-72 overflow-y-auto p-4 bg-gray-50 border border-gray-200 rounded-lg whitespace-pre-wrap text-xs text-gray-800 leading-relaxed font-sans">
                  {form.content}
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Publication Lifecycle Status</label>
              <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as ContentStatus })}>
                <SelectTrigger className="w-full h-9 bg-gray-50 border-gray-200 rounded-lg text-xs font-medium">
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PUBLISHED">PUBLISHED - Visible to public</SelectItem>
                  <SelectItem value="DRAFT">DRAFT - Under legal review</SelectItem>
                  <SelectItem value="ARCHIVED">ARCHIVED - Obsolete</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="pt-4 flex items-center justify-end gap-2 border-t border-gray-100">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg border-gray-200 text-xs font-semibold"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={saving}
                variant="gradient"
                className="rounded-lg text-xs font-semibold space-x-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{saving ? 'Saving...' : 'Save Document'}</span>
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
