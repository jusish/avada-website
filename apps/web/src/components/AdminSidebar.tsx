import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  BarChart3,
  ShieldCheck,
  Inbox,
  Tags,
  Globe2,
  FileText,
  Scale,
  Settings,
  ShieldAlert,
  Users,
  ScrollText,
  ExternalLink,
  LogOut,
  User as UserIcon,
} from 'lucide-react';
import { CmsModule } from '@avada/shared';

interface NavItem {
  name: string;
  path: string;
  icon: React.FC<{ className?: string }>;
  module: CmsModule;
  badge?: number;
}

interface NavGroup {
  group: string;
  items: NavItem[];
}

export const AdminSidebar: React.FC = () => {
  const { user, logout, canView } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState<number>(0);

  useEffect(() => {
    // Fetch unread inquiries count for badge
    const fetchUnread = () => {
      const token = localStorage.getItem('avada_auth_token');
      if (!token) return;
      fetch('/api/admin/inquiries/stats', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((json) => {
          if (json.success && json.data) {
            setUnreadCount(json.data.unread || 0);
          }
        })
        .catch(() => {});
    };

    fetchUnread();
    const interval = setInterval(fetchUnread, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navGroups: NavGroup[] = [
    {
      group: 'Overview',
      items: [
        {
          name: 'Dashboard Overview',
          path: '/admin/dashboard',
          icon: LayoutDashboard,
          module: 'insights',
        },
      ],
    },
    {
      group: 'Insights & Health',
      items: [
        {
          name: 'Traffic & Visits',
          path: '/admin/insights/analytics',
          icon: BarChart3,
          module: 'insights',
        },
        {
          name: 'Threats & Availability',
          path: '/admin/insights/security',
          icon: ShieldCheck,
          module: 'insights',
        },
      ],
    },
    {
      group: 'Communications',
      items: [
        {
          name: 'Inquiries Inbox',
          path: '/admin/inquiries',
          icon: Inbox,
          module: 'inquiries',
          badge: unreadCount,
        },
        {
          name: 'Inquiry Categories',
          path: '/admin/inquiries/types',
          icon: Tags,
          module: 'inquiry_types',
        },
      ],
    },
    {
      group: 'Content Management',
      items: [
        {
          name: 'Countries & Markets',
          path: '/admin/content/countries',
          icon: Globe2,
          module: 'countries',
        },
        {
          name: 'Articles & Press',
          path: '/admin/content/articles',
          icon: FileText,
          module: 'articles',
        },
        {
          name: 'Legal & Policies',
          path: '/admin/content/policies',
          icon: Scale,
          module: 'policies',
        },
        {
          name: 'Site Settings & Footer',
          path: '/admin/content/settings',
          icon: Settings,
          module: 'settings',
        },
      ],
    },
    {
      group: 'Governance & Access',
      items: [
        {
          name: 'Roles & Privileges',
          path: '/admin/governance/roles',
          icon: ShieldAlert,
          module: 'roles',
        },
        {
          name: 'Team Members',
          path: '/admin/governance/users',
          icon: Users,
          module: 'users',
        },
        {
          name: 'System Audit Trail',
          path: '/admin/governance/audit-logs',
          icon: ScrollText,
          module: 'audit_logs',
        },
      ],
    },
  ];

  return (
    <aside className="w-64 bg-[#2A292D] border-r border-white/10 flex flex-col justify-between h-screen sticky top-0 text-white select-none overflow-x-hidden">
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-6">
        {/* Brand header with AvadaPay Logo */}
        <Link
          to="/"
          title="Return to AvadaPay Website"
          className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors group"
        >
          <img
            src="/logo.svg"
            alt="AvadaPay"
            className="h-5 w-auto max-w-[110px] object-contain shrink-0 transition-transform group-hover:scale-105"
          />
          <span className="shrink-0 text-[10px] font-semibold tracking-wide px-1.5 py-0.5 rounded-md bg-[#3BBA93]/20 text-[#3BBA93] border border-[#3BBA93]/30">
            CMS
          </span>
        </Link>

        {/* Grouped Navigation */}
        <div className="space-y-6">
          {navGroups.map((grp) => {
            // Filter items user has permission to view
            const visibleItems = grp.items.filter((item) => canView(item.module));
            if (visibleItems.length === 0) return null;

            return (
              <div key={grp.group} className="space-y-1">
                <p className="px-3 text-[11px] font-semibold tracking-wide text-white/45">
                  {grp.group}
                </p>
                <nav className="space-y-1">
                  {visibleItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                          isActive
                            ? 'bg-[#3BBA93] text-white shadow-sm'
                            : 'text-white/70 hover:text-white hover:bg-white/10'
                        }`}
                      >
                        <div className="flex items-center space-x-2.5 min-w-0">
                          <Icon className="w-4 h-4 flex-shrink-0" />
                          <span className="truncate">{item.name}</span>
                        </div>
                        {item.badge != null && item.badge > 0 && (
                          <span className="px-1.5 py-0.5 rounded-full bg-red-500 text-white text-[10px] font-bold">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </nav>
              </div>
            );
          })}
        </div>

        {/* Live Site Link */}
        <div className="pt-4 border-t border-white/10">
          <Link
            to="/"
            className="flex items-center justify-between px-3 py-2 text-xs font-medium text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors border border-transparent hover:border-white/10"
          >
            <span className="flex items-center space-x-2">
              <ExternalLink className="w-3.5 h-3.5 text-[#3BBA93]" />
              <span>View Live Website</span>
            </span>
            <span className="text-[10px] text-white/40">↗</span>
          </Link>
        </div>
      </div>

      {/* User profile & logout footer */}
      <div className="p-4 border-t border-white/10 bg-black/20 flex-shrink-0">
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-[#3BBA93]/20 text-[#3BBA93] flex items-center justify-center font-bold text-xs border border-[#3BBA93]/30">
            {user?.name ? user.name.slice(0, 2).toUpperCase() : <UserIcon className="w-4 h-4" />}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-white truncate">{user?.name || 'Administrator'}</p>
            <p className="text-[10px] text-[#3BBA93] truncate font-medium">
              {user?.role?.name || 'Super Administrator'}
            </p>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleLogout}
          className="w-full justify-center space-x-2 text-xs bg-transparent border-white/15 text-white/75 hover:text-red-400 hover:border-red-500/40 hover:bg-red-500/10 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </Button>
      </div>
    </aside>
  );
};
