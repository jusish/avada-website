import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  FileText,
  ExternalLink,
  LogOut,
  Sparkles,
  User as UserIcon,
} from 'lucide-react';

export const AdminSidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const menuItems = [
    {
      name: 'Dashboard Overview',
      path: '/admin/dashboard',
      icon: LayoutDashboard,
    },
    {
      name: 'Content Manager',
      path: '/admin/content',
      icon: FileText,
    },
  ];

  return (
    <aside className="w-64 bg-card border-r border-border flex flex-col justify-between h-screen sticky top-0">
      <div className="p-5">
        {/* Brand header */}
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-md">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-base leading-none text-foreground">Avada CMS</h1>
            <p className="text-[11px] text-muted-foreground mt-1 font-mono">v1.0.0 • Admin Portal</p>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-8 pt-6 border-t border-border">
          <Link
            to="/"
            target="_blank"
            className="flex items-center justify-between px-3 py-2 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/40 rounded-lg transition-colors"
          >
            <span className="flex items-center space-x-2">
              <ExternalLink className="w-3.5 h-3.5" />
              <span>View Live Website</span>
            </span>
          </Link>
        </div>
      </div>

      {/* User profile & logout footer */}
      <div className="p-4 border-t border-border bg-muted/20">
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold text-xs border border-primary/20">
            {user?.name ? user.name.slice(0, 2).toUpperCase() : <UserIcon className="w-4 h-4" />}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-foreground truncate">{user?.name || 'Administrator'}</p>
            <p className="text-[11px] text-muted-foreground truncate">{user?.email || 'admin@avada.com'}</p>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleLogout}
          className="w-full justify-center space-x-2 text-xs text-muted-foreground hover:text-destructive hover:border-destructive/30"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </Button>
      </div>
    </aside>
  );
};
