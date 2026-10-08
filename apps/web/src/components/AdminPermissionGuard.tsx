import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { CmsModule } from '@avada/shared';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface AdminPermissionGuardProps {
  module: CmsModule;
  children: React.ReactNode;
}

export const AdminPermissionGuard: React.FC<AdminPermissionGuardProps> = ({ module, children }) => {
  const { canView } = useAuth();

  if (!canView(module)) {
    return (
      <div className="py-16 flex items-center justify-center">
        <div className="max-w-md bg-white border border-gray-100 rounded-xl p-8 text-center space-y-4 shadow-xl">
          <div className="w-16 h-16 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto border border-red-100">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-black text-[#2A292D]">Access Restricted</h2>
          <p className="text-xs text-gray-500 leading-relaxed">
            Your role does not have authorization to view the <strong>{module}</strong> module.
            Please reach out to your system Super Administrator to request permission elevation.
          </p>
          <div className="pt-2">
            <Link to="/admin/dashboard">
              <Button variant="outline" className="border-gray-200 text-xs font-bold rounded-xl space-x-1.5">
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Overview</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
