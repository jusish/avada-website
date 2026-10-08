import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Role, CmsModule, PermissionMatrix, ModulePermission } from '@avada/shared';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  ShieldAlert,
  Plus,
  Edit2,
  Trash2,
  Save,
  Users,
  Shield,
} from 'lucide-react';

interface ModuleDefinition {
  key: CmsModule;
  label: string;
  description: string;
  category: string;
}

const MODULES: ModuleDefinition[] = [
  { key: 'insights', label: 'Traffic & Health Insights', description: 'Visits analytics, top routes, geo distribution, and uptime telemetry', category: 'Analytics' },
  { key: 'inquiries', label: 'Inquiries & Leads Inbox', description: 'Read and respond to incoming contact submissions and assign owners', category: 'Communications' },
  { key: 'inquiry_types', label: 'Inquiry Categories', description: 'Manage classification categories available on the Contact page', category: 'Communications' },
  { key: 'countries', label: 'Countries & African Markets', description: 'Manage national landing hubs, telco partners, rails, and office maps', category: 'Content' },
  { key: 'articles', label: 'Articles & Content Items', description: 'Publish corporate press announcements, guides, and marketing posts', category: 'Content' },
  { key: 'policies', label: 'Legal & Compliance Policies', description: 'Author Terms of Service, Privacy, Cookies, and regulatory docs', category: 'Content' },
  { key: 'settings', label: 'Site Settings & Footer', description: 'Corporate emails, phones, headquarters, and social network links', category: 'Content' },
  { key: 'roles', label: 'Roles & Privileges Matrix', description: 'Configure granular permission matrices and security roles', category: 'Governance' },
  { key: 'users', label: 'Team Members & Staff', description: 'Invite staff members, assign roles, and toggle access states', category: 'Governance' },
  { key: 'audit_logs', label: 'System Audit Trail', description: 'Immutable log of administrative modifications with diff viewer', category: 'Governance' },
];

const createEmptyPermissions = (): PermissionMatrix => ({
  insights: { view: false, edit: false },
  inquiries: { view: false, edit: false },
  inquiry_types: { view: false, edit: false },
  countries: { view: false, edit: false },
  articles: { view: false, edit: false },
  policies: { view: false, edit: false },
  settings: { view: false, edit: false },
  roles: { view: false, edit: false },
  users: { view: false, edit: false },
  audit_logs: { view: false, edit: false },
});

export const AdminRolesPage: React.FC = () => {
  const { token, canEdit } = useAuth();
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [permissions, setPermissions] = useState<PermissionMatrix>(createEmptyPermissions());
  const [saving, setSaving] = useState(false);

  // Fetch Roles
  const fetchRoles = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const res = await fetch('/api/admin/roles', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setRoles(data.data);
      }
    } catch (err) {
      console.error('Failed to load roles:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, [token]);

  // Open Create Modal
  const handleOpenCreate = () => {
    setEditingRole(null);
    setName('');
    setDescription('');
    setPermissions(createEmptyPermissions());
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (role: Role) => {
    setEditingRole(role);
    setName(role.name);
    setDescription(role.description || '');
    const currentPerms = createEmptyPermissions();
    MODULES.forEach((m) => {
      const existing = role.permissions?.[m.key];
      currentPerms[m.key] = {
        view: !!(existing?.view || existing?.edit),
        edit: !!existing?.edit,
      };
    });
    setPermissions(currentPerms);
    setIsModalOpen(true);
  };

  // Permission checkbox toggle handler
  const handleTogglePerm = (mod: CmsModule, type: 'view' | 'edit') => {
    setPermissions((prev) => {
      const current = prev[mod] || { view: false, edit: false };
      if (type === 'edit') {
        const nextEdit = !current.edit;
        return {
          ...prev,
          [mod]: {
            edit: nextEdit,
            view: nextEdit ? true : current.view,
          },
        };
      } else {
        const nextView = !current.view;
        return {
          ...prev,
          [mod]: {
            view: nextView,
            edit: nextView ? current.edit : false,
          },
        };
      }
    });
  };

  // Bulk actions
  const handleSelectAllView = () => {
    const updated = createEmptyPermissions();
    MODULES.forEach((m) => {
      updated[m.key] = { view: true, edit: permissions[m.key]?.edit || false };
    });
    setPermissions(updated);
  };

  const handleSelectAllEdit = () => {
    const updated = createEmptyPermissions();
    MODULES.forEach((m) => {
      updated[m.key] = { view: true, edit: true };
    });
    setPermissions(updated);
  };

  const handleClearAll = () => {
    setPermissions(createEmptyPermissions());
  };

  // Save Role
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !canEdit('roles')) return;
    setSaving(true);
    try {
      const url = editingRole ? `/api/admin/roles/${editingRole.id}` : '/api/admin/roles';
      const method = editingRole ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          description,
          permissions,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setIsModalOpen(false);
        fetchRoles();
      } else {
        alert(data.error || 'Failed to save role');
      }
    } catch (err) {
      console.error('Save error:', err);
    } finally {
      setSaving(false);
    }
  };

  // Delete Role
  const handleDelete = async (id: string, roleName: string) => {
    if (!token || !canEdit('roles')) return;
    if (!window.confirm(`Are you sure you want to delete role "${roleName}"?`)) return;
    try {
      const res = await fetch(`/api/admin/roles/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setRoles((prev) => prev.filter((r) => r.id !== id));
      } else {
        alert(data.error || 'Could not delete role');
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#2A292D] flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-[#3BBA93]" />
            <span>Roles & Visual Permission Governance</span>
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Create fine-grained administrative roles with distinct View and Edit privileges across every CMS subsystem.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {canEdit('roles') && (
            <Button
              variant="gradient"
              size="sm"
              onClick={handleOpenCreate}
              className="space-x-1.5 rounded-xl font-bold text-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Define New Role</span>
            </Button>
          )}
        </div>
      </div>

      {/* Roles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading ? (
          <div className="col-span-full py-16 text-center text-gray-400">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-5 h-5 border-2 border-[#3BBA93] border-t-transparent rounded-full animate-spin"></div>
              <span className="text-xs">Loading roles and permissions...</span>
            </div>
          </div>
        ) : (
          roles.map((role) => {
            const userCount = (role as any)._count?.users ?? 0;
            const isSystem = (role as any).isSystem;
            const perms = role.permissions || {};
            const viewCount = Object.values(perms).filter((p: any) => p && (p.view || p.edit)).length;
            const editCount = Object.values(perms).filter((p: any) => p && p.edit).length;

            return (
              <Card
                key={role.id}
                className="bg-white border border-gray-200/90 shadow-sm rounded-xl overflow-hidden flex flex-col justify-between hover:shadow-md transition-all"
              >
                <div>
                  {/* Top Bar */}
                  <div className="p-5 pb-3 border-b border-gray-100 flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-base text-[#2A292D]">{role.name}</h3>
                        {isSystem && (
                          <Badge className="bg-purple-50 text-purple-700 border-purple-200 text-[10px] font-bold">
                            System
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">{role.description || 'Custom administrative role'}</p>
                    </div>

                    <div className="flex items-center gap-1 text-gray-400 text-xs font-semibold">
                      <Users className="w-3.5 h-3.5" />
                      <span>{userCount}</span>
                    </div>
                  </div>

                  {/* Summary of Permissions */}
                  <div className="p-5 space-y-3 text-xs">
                    <div className="flex items-center justify-between text-[11px] font-semibold text-gray-600">
                      <span>Accessible Modules:</span>
                      <span className="text-[#3BBA93] font-bold">{viewCount} of {MODULES.length}</span>
                    </div>

                    <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-[#3BBA93] h-full rounded-full transition-all duration-300"
                        style={{ width: `${(viewCount / MODULES.length) * 100}%` }}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2">
                      <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-100 text-center">
                        <span className="text-[11px] text-gray-500 font-bold block">View Only</span>
                        <span className="text-sm font-black text-gray-700">{viewCount - editCount}</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-emerald-50/50 border border-emerald-100 text-center">
                        <span className="text-[11px] text-emerald-600 font-bold block">Full Edit</span>
                        <span className="text-sm font-black text-emerald-700">{editCount}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="p-4 bg-gray-50/80 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-[11px] text-gray-400">
                    {isSystem ? 'Built-in security policy' : 'Custom team role'}
                  </span>

                  <div className="flex items-center gap-1">
                    {canEdit('roles') && (
                      <>
                        <button
                          onClick={() => handleOpenEdit(role)}
                          title="Edit Permissions"
                          className="p-1.5 rounded-lg hover:bg-gray-200/70 text-gray-600 transition-colors"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        {!isSystem && (
                          <button
                            onClick={() => handleDelete(role.id, role.name)}
                            title="Delete Role"
                            className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>

      {/* Visual Permission Matrix Editor Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl max-h-[92vh] overflow-y-auto p-0 rounded-xl border border-gray-100">
          {/* Modal Header */}
          <div className="p-5 bg-[#2A292D] text-white">
            <span className="text-xs font-semibold tracking-wider text-[#3BBA93]">
              {editingRole ? 'Edit Permission Matrix' : 'Create Role & Access Policy'}
            </span>
            <DialogTitle className="text-lg font-bold text-white mt-1">
              {editingRole ? editingRole.name : 'New Security Role'}
            </DialogTitle>
            <DialogDescription className="text-xs text-gray-400 mt-0.5">
              Configure granular View and Edit privileges per CMS module.
            </DialogDescription>
          </div>

          {/* Modal Body */}
          <form onSubmit={handleSave} className="p-6 space-y-6 text-xs">
            {/* Role Metadata */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Role Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Regional Support Officer"
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#3BBA93] focus:bg-white text-[#2A292D] font-bold"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Role Description</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description of responsibilities..."
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#3BBA93] focus:bg-white text-[#2A292D]"
                />
              </div>
            </div>

            {/* Visual Permission Manager Section */}
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
                <div>
                  <h3 className="font-bold text-sm text-[#2A292D] flex items-center gap-1.5">
                    <Shield className="w-4 h-4 text-[#3BBA93]" />
                    <span>Visual Access Matrix</span>
                  </h3>
                  <p className="text-[11px] text-gray-500">
                    Configure granular View and Edit privileges per CMS module. Edit privilege automatically includes View access.
                  </p>
                </div>

                <div className="flex items-center gap-1.5">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={handleSelectAllView}
                    className="text-[11px] h-7 rounded-lg border-gray-200 font-semibold"
                  >
                    All View
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={handleSelectAllEdit}
                    className="text-[11px] h-7 rounded-lg border-gray-200 font-semibold"
                  >
                    All Edit
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={handleClearAll}
                    className="text-[11px] h-7 rounded-lg border-gray-200 text-red-500 font-semibold"
                  >
                    Clear All
                  </Button>
                </div>
              </div>

              {/* Matrix Table */}
              <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200 text-[11px] font-bold text-gray-500 tracking-wider">
                      <th className="py-2.5 px-4">Subsystem / Module</th>
                      <th className="py-2.5 px-4 text-center w-28">View Access</th>
                      <th className="py-2.5 px-4 text-center w-28">Edit Access</th>
                      <th className="py-2.5 px-4 text-right w-36">Effective Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-xs">
                    {MODULES.map((mod) => {
                      const perm: ModulePermission = permissions[mod.key] || { view: false, edit: false };
                      const hasView = perm.view || perm.edit;
                      const hasEdit = perm.edit;

                      return (
                        <tr key={mod.key} className="hover:bg-gray-50/70 transition-colors">
                          <td className="py-3 px-4">
                            <div className="font-bold text-[#2A292D]">{mod.label}</div>
                            <div className="text-[11px] text-gray-400 mt-0.5">{mod.description}</div>
                          </td>

                          {/* View Checkbox */}
                          <td className="py-3 px-4 text-center">
                            <label className="inline-flex items-center justify-center cursor-pointer p-1">
                              <input
                                type="checkbox"
                                checked={hasView}
                                onChange={() => handleTogglePerm(mod.key, 'view')}
                                className="w-4 h-4 rounded text-[#3BBA93] focus:ring-[#3BBA93]"
                              />
                            </label>
                          </td>

                          {/* Edit Checkbox */}
                          <td className="py-3 px-4 text-center">
                            <label className="inline-flex items-center justify-center cursor-pointer p-1">
                              <input
                                type="checkbox"
                                checked={hasEdit}
                                onChange={() => handleTogglePerm(mod.key, 'edit')}
                                className="w-4 h-4 rounded text-[#3BBA93] focus:ring-[#3BBA93]"
                              />
                            </label>
                          </td>

                          {/* Effective Status Badge */}
                          <td className="py-3 px-4 text-right">
                            {hasEdit ? (
                              <Badge className="bg-emerald-500/15 text-emerald-700 border-emerald-300 text-[10px] font-bold">
                                Full Edit & View
                              </Badge>
                            ) : hasView ? (
                              <Badge className="bg-blue-500/15 text-blue-700 border-blue-300 text-[10px] font-bold">
                                View Only
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="text-gray-400 border-gray-200 text-[10px]">
                                No Access (Hidden)
                              </Badge>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Modal Buttons */}
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
                <span>{saving ? 'Saving...' : 'Save Permissions'}</span>
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
