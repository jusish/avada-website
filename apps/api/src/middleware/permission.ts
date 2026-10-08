import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './auth';
import { CmsModule } from '@avada/shared';

export const requirePermission = (module: CmsModule, action: 'view' | 'edit') => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Authentication required',
      });
      return;
    }

    const perms = req.user.permissions?.[module];

    if (!perms) {
      res.status(403).json({
        success: false,
        error: `Access Denied: You do not have permissions for the ${module} module.`,
      });
      return;
    }

    // If 'edit' action required, check perms.edit
    if (action === 'edit' && !perms.edit) {
      res.status(403).json({
        success: false,
        error: `Permission Denied: You have view-only access to ${module}. Modifications are prohibited.`,
      });
      return;
    }

    // If 'view' action required, check either perms.view or perms.edit
    if (action === 'view' && !perms.view && !perms.edit) {
      res.status(403).json({
        success: false,
        error: `Access Denied: You cannot view ${module}.`,
      });
      return;
    }

    next();
  };
};
