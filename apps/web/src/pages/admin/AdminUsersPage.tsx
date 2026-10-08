import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { User, Role } from '@avada/shared';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Users,
  UserPlus,
  Edit2,
  Trash2,
  Search,
  X,
  Save,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';

export const AdminUsersPage: React.FC = () => {
  const { token, user: currentUser, canEdit } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [roleId, setRoleId] = useState('');
  const [status, setStatus] = useState<'ACTIVE' | 'INVITED' | 'SUSPENDED'>('ACTIVE');
  const [saving, setSaving] = useState(false);

  // Fetch Users and Roles
  const fetchData = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const [usersRes, rolesRes] = await Promise.all([
        fetch('/api/admin/users', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/admin/roles', { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      const [usersData, rolesData] = await Promise.all([usersRes.json(), rolesRes.json()]);

      if (usersData.success && Array.isArray(usersData.data)) {
        setUsers(usersData.data);
      }
      if (rolesData.success && Array.isArray(rolesData.data)) {
        setRoles(rolesData.data);
      }
    } catch (err) {
      console.error('Failed to load users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  // Open Create Modal
  const handleOpenCreate = () => {
    setEditingUser(null);
    setName('');
    setEmail('');
    setPassword('');
    setRoleId(roles[0]?.id || '');
    setStatus('ACTIVE');
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (u: User) => {
    setEditingUser(u);
    setName(u.name);
    setEmail(u.email);
    setPassword(''); // leave blank if not changing
    setRoleId(u.roleId);
    setStatus(u.status as any || 'ACTIVE');
    setIsModalOpen(true);
  };

  // Save (Create or Edit)
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !canEdit('users')) return;
    setSaving(true);
    try {
      const url = editingUser ? `/api/admin/users/${editingUser.id}` : '/api/admin/users';
      const method = editingUser ? 'PUT' : 'POST';

      const body: any = {
        name,
        email,
        roleId,
        status,
      };
      if (password) body.password = password;

      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.success) {
        setIsModalOpen(false);
        fetchData();
      } else {
        alert(data.error || 'Failed to save team member');
      }
    } catch (err) {
      console.error('Save error:', err);
    } finally {
      setSaving(false);
    }
  };

  // Toggle Status
  const handleToggleStatus = async (id: string) => {
    if (!token || !canEdit('users')) return;
    try {
      const res = await fetch(`/api/admin/users/${id}/toggle-status`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        fetchData();
      }
    } catch (err) {
      console.error('Toggle error:', err);
    }
  };

  // Delete User
  const handleDelete = async (id: string, userName: string) => {
    if (!token || !canEdit('users')) return;
    if (currentUser?.id === id) {
      alert('You cannot delete your own active administrator account.');
      return;
    }
    if (!window.confirm(`Are you sure you want to remove team member "${userName}"?`)) return;
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setUsers((prev) => prev.filter((u) => u.id !== id));
      } else {
        alert(data.error || 'Could not delete user');
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const getStatusBadge = (st: string) => {
    switch (st) {
      case 'ACTIVE':
        return <Badge className="bg-emerald-500/15 text-emerald-700 border-emerald-300 text-[10px] font-semibold">Active</Badge>;
      case 'INVITED':
        return <Badge className="bg-amber-500/15 text-amber-700 border-amber-300 text-[10px] font-semibold">Invited</Badge>;
      case 'SUSPENDED':
        return <Badge className="bg-red-500/15 text-red-700 border-red-300 text-[10px] font-semibold">Suspended</Badge>;
      default:
        return <Badge variant="outline">{st}</Badge>;
    }
  };

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      (u.role?.name && u.role.name.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#2A292D] flex items-center gap-2">
            <Users className="w-6 h-6 text-[#3BBA93]" />
            <span>Team Members & Administrative Access</span>
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Manage authorized staff members, grant system privileges, and control account credentials.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {canEdit('users') && (
            <Button
              variant="gradient"
              size="sm"
              onClick={handleOpenCreate}
              className="space-x-1.5 rounded-xl font-bold text-xs"
            >
              <UserPlus className="w-4 h-4" />
              <span>Invite Team Member</span>
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
              placeholder="Search by name, email, or role..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3BBA93] text-[#2A292D]"
            />
          </div>
          <div className="text-xs text-gray-500 flex items-center gap-3">
            <span>Total Staff: <strong>{users.length}</strong></span>
            <span>•</span>
            <span className="text-emerald-600 font-semibold">Active: {users.filter((u) => u.status === 'ACTIVE').length}</span>
          </div>
        </div>
      </Card>

      {/* Users Table */}
      <Card className="bg-white border-gray-200/80 shadow-sm rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-200/80 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Assigned Role</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Last Login</th>
                <th className="py-3 px-4">Date Joined</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-gray-400">
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 border-2 border-[#3BBA93] border-t-transparent rounded-full animate-spin"></div>
                      <span>Loading team members...</span>
                    </div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-gray-400">
                    No team members found.
                  </td>
                </tr>
              ) : (
                filtered.map((u) => {
                  const isCurrent = currentUser?.id === u.id;
                  return (
                    <tr key={u.id} className="hover:bg-gray-50/60 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-[#2A292D] text-white flex items-center justify-center font-bold text-xs">
                            {u.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-bold text-[#2A292D] flex items-center gap-1.5">
                              <span>{u.name}</span>
                              {isCurrent && (
                                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                                  You
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-gray-400 mt-0.5">{u.email}</div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-gray-800 bg-gray-100 px-2.5 py-1 rounded-lg text-xs">
                          {u.role?.name || 'Assigned Role'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">{getStatusBadge(u.status || 'ACTIVE')}</td>

                      <td className="py-3.5 px-4 text-gray-500 text-[11px]">
                        {u.updatedAt ? new Date(u.updatedAt).toLocaleDateString() : 'Active'}
                      </td>

                      <td className="py-3.5 px-4 text-gray-500 text-[11px]">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>

                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1">
                          {canEdit('users') && (
                            <>
                              <button
                                onClick={() => handleToggleStatus(u.id)}
                                title={u.status === 'ACTIVE' ? 'Suspend Account' : 'Activate Account'}
                                className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-[#3BBA93] transition-colors"
                              >
                                {u.status === 'ACTIVE' ? (
                                  <ToggleRight className="w-5 h-5 text-[#3BBA93]" />
                                ) : (
                                  <ToggleLeft className="w-5 h-5 text-gray-300" />
                                )}
                              </button>
                              <button
                                onClick={() => handleOpenEdit(u)}
                                title="Edit Member"
                                className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-[#2A292D] transition-colors"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              {!isCurrent && (
                                <button
                                  onClick={() => handleDelete(u.id, u.name)}
                                  title="Delete User"
                                  className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Modal: Invite or Edit User */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
            <div className="p-5 bg-[#2A292D] text-white flex items-center justify-between">
              <div>
                <span className="text-xs uppercase font-bold tracking-wider text-[#3BBA93]">
                  {editingUser ? 'Edit Member Credentials' : 'Invite Team Member'}
                </span>
                <h2 className="text-lg font-bold">{editingUser ? editingUser.name : 'New Staff Account'}</h2>
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
                <label className="block text-xs font-bold text-gray-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Kevin Mutesa"
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#3BBA93] focus:bg-white text-[#2A292D]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Corporate Email Address *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@avadapay.com"
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#3BBA93] focus:bg-white text-[#2A292D]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  {editingUser ? 'Update Password (leave blank to keep current)' : 'Account Password *'}
                </label>
                <input
                  type="password"
                  required={!editingUser}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={editingUser ? '••••••••' : 'Minimum 8 characters'}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#3BBA93] focus:bg-white text-[#2A292D]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Assigned Security Role *</label>
                <select
                  required
                  value={roleId}
                  onChange={(e) => setRoleId(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-bold text-[#2A292D] focus:ring-2 focus:ring-[#3BBA93]"
                >
                  {roles.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Account Lifecycle Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-semibold text-[#2A292D] focus:ring-2 focus:ring-[#3BBA93]"
                >
                  <option value="ACTIVE">ACTIVE - Granted Immediate Access</option>
                  <option value="INVITED">INVITED - Pending Onboarding</option>
                  <option value="SUSPENDED">SUSPENDED - Temporarily Blocked</option>
                </select>
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
                  <span>{saving ? 'Saving...' : 'Save Member'}</span>
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
