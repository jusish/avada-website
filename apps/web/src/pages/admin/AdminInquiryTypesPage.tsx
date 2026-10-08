import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { InquiryType } from '@avada/shared';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Tags,
  Plus,
  Edit2,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Search,
  X,
  Save,
} from 'lucide-react';

export const AdminInquiryTypesPage: React.FC = () => {
  const { token, canEdit } = useAuth();
  const [types, setTypes] = useState<InquiryType[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingType, setEditingType] = useState<InquiryType | null>(null);
  const [form, setForm] = useState({
    label: '',
    key: '',
    description: '',
    displayOrder: 0,
    active: true,
  });
  const [saving, setSaving] = useState(false);

  // Fetch
  const fetchTypes = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const res = await fetch('/api/admin/inquiry-types', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setTypes(data.data);
      }
    } catch (err) {
      console.error('Failed to load inquiry categories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTypes();
  }, [token]);

  // Open Create
  const handleOpenCreate = () => {
    setEditingType(null);
    setForm({
      label: '',
      key: '',
      description: '',
      displayOrder: (types.length + 1) * 10,
      active: true,
    });
    setIsModalOpen(true);
  };

  // Open Edit
  const handleOpenEdit = (t: InquiryType) => {
    setEditingType(t);
    setForm({
      label: t.label,
      key: t.key,
      description: t.description || '',
      displayOrder: t.displayOrder,
      active: t.active,
    });
    setIsModalOpen(true);
  };

  // Auto-slugify
  const handleLabelChange = (val: string) => {
    if (!editingType) {
      const generatedKey = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      setForm((prev) => ({ ...prev, label: val, key: generatedKey }));
    } else {
      setForm((prev) => ({ ...prev, label: val }));
    }
  };

  // Save (Create or Update)
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !canEdit('inquiry_types')) return;
    setSaving(true);
    try {
      const url = editingType
        ? `/api/admin/inquiry-types/${editingType.id}`
        : '/api/admin/inquiry-types';
      const method = editingType ? 'PUT' : 'POST';

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
        fetchTypes();
      } else {
        alert(json.error || 'Failed to save inquiry category');
      }
    } catch (err) {
      console.error('Save error:', err);
    } finally {
      setSaving(false);
    }
  };

  // Toggle active
  const handleToggle = async (id: string) => {
    if (!token || !canEdit('inquiry_types')) return;
    try {
      const res = await fetch(`/api/admin/inquiry-types/${id}/toggle`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setTypes((prev) =>
          prev.map((item) => (item.id === id ? { ...item, active: !item.active } : item))
        );
      }
    } catch (err) {
      console.error('Toggle error:', err);
    }
  };

  // Delete
  const handleDelete = async (id: string, label: string) => {
    if (!token || !canEdit('inquiry_types')) return;
    if (!window.confirm(`Are you sure you want to delete inquiry category "${label}"?`)) return;
    try {
      const res = await fetch(`/api/admin/inquiry-types/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setTypes((prev) => prev.filter((item) => item.id !== id));
      } else {
        alert(data.error || 'Could not delete inquiry type');
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const filtered = types.filter(
    (t) =>
      t.label.toLowerCase().includes(search.toLowerCase()) ||
      t.key.toLowerCase().includes(search.toLowerCase()) ||
      (t.description && t.description.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#2A292D] flex items-center gap-2">
            <Tags className="w-6 h-6 text-[#3BBA93]" />
            <span>Inquiry Categories & Types</span>
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Configure contact classifications presented to website visitors on the Contact page.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {canEdit('inquiry_types') && (
            <Button
              variant="gradient"
              size="sm"
              onClick={handleOpenCreate}
              className="space-x-1.5 rounded-xl font-bold text-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Add Inquiry Type</span>
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
              placeholder="Filter categories..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3BBA93] text-[#2A292D]"
            />
          </div>
          <div className="text-xs text-gray-500 flex items-center gap-3">
            <span>Total Categories: <strong>{types.length}</strong></span>
            <span>•</span>
            <span className="text-emerald-600 font-semibold">Active: {types.filter((t) => t.active).length}</span>
          </div>
        </div>
      </Card>

      {/* Categories Table */}
      <Card className="bg-white border-gray-200/80 shadow-sm rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-200/80 text-[11px] font-bold text-gray-500 tracking-wider">
                <th className="py-3 px-4">Category Label</th>
                <th className="py-3 px-4">Identifier Key</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4">Display Order</th>
                <th className="py-3 px-4">Live Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-gray-400">
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 border-2 border-[#3BBA93] border-t-transparent rounded-full animate-spin"></div>
                      <span>Loading categories...</span>
                    </div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-gray-400">
                    No categories found.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-[#2A292D] flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#3BBA93] flex items-center justify-center font-bold text-xs border border-emerald-100">
                        {item.label.charAt(0)}
                      </div>
                      <span>{item.label}</span>
                    </td>

                    <td className="py-3.5 px-4 text-gray-500 font-mono text-[11px]">
                      {item.key}
                    </td>

                    <td className="py-3.5 px-4 text-gray-600 max-w-xs truncate">
                      {item.description || '—'}
                    </td>

                    <td className="py-3.5 px-4 text-gray-600 font-semibold">
                      {item.displayOrder}
                    </td>

                    <td className="py-3.5 px-4">
                      {item.active ? (
                        <Badge className="bg-emerald-500/15 text-emerald-700 border-emerald-300 text-[10px] font-semibold">
                          Active on site
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-gray-400 border-gray-300 text-[10px]">
                          Hidden
                        </Badge>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1">
                        {canEdit('inquiry_types') && (
                          <>
                            <button
                              onClick={() => handleToggle(item.id)}
                              title={item.active ? 'Disable' : 'Enable'}
                              className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-[#3BBA93] transition-colors"
                            >
                              {item.active ? (
                                <ToggleRight className="w-5 h-5 text-[#3BBA93]" />
                              ) : (
                                <ToggleLeft className="w-5 h-5 text-gray-300" />
                              )}
                            </button>
                            <button
                              onClick={() => handleOpenEdit(item)}
                              title="Edit Category"
                              className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-[#2A292D] transition-colors"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(item.id, item.label)}
                              title="Delete Category"
                              className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Modal: Create or Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
            <div className="p-5 bg-[#2A292D] text-white flex items-center justify-between">
              <div>
                <span className="text-xs font-bold tracking-wider text-[#3BBA93]">
                  {editingType ? 'Edit Category' : 'Create Category'}
                </span>
                <h2 className="text-lg font-bold">{editingType ? editingType.label : 'New Inquiry Category'}</h2>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-white/60 hover:text-white p-1 rounded-full hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Category Label *</label>
                <input
                  type="text"
                  required
                  value={form.label}
                  onChange={(e) => handleLabelChange(e.target.value)}
                  placeholder="e.g. Developer & API Integration"
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#3BBA93] focus:bg-white text-[#2A292D]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Unique Key Identifier *</label>
                <input
                  type="text"
                  required
                  value={form.key}
                  onChange={(e) => setForm({ ...form, key: e.target.value })}
                  placeholder="e.g. developer-api"
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-mono text-xs focus:ring-2 focus:ring-[#3BBA93] focus:bg-white text-[#2A292D]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Description (Optional)</label>
                <textarea
                  rows={2}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Brief explanation of when users should select this inquiry category..."
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#3BBA93] focus:bg-white text-[#2A292D]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Display Sort Order</label>
                  <input
                    type="number"
                    value={form.displayOrder}
                    onChange={(e) => setForm({ ...form, displayOrder: parseInt(e.target.value) || 0 })}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-center font-bold text-[#2A292D]"
                  />
                </div>
                <div className="flex flex-col justify-end">
                  <label className="inline-flex items-center gap-2 cursor-pointer pb-2">
                    <input
                      type="checkbox"
                      checked={form.active}
                      onChange={(e) => setForm({ ...form, active: e.target.checked })}
                      className="rounded text-[#3BBA93] focus:ring-[#3BBA93] w-4 h-4"
                    />
                    <span className="text-xs font-bold text-gray-700">Display as Active</span>
                  </label>
                </div>
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
                  <span>{saving ? 'Saving...' : 'Save Category'}</span>
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
