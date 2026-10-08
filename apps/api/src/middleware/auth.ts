import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../prisma';
import { PermissionMatrix } from '@avada/shared';

const JWT_SECRET = process.env.JWT_SECRET || 'avada_fallback_secret_key';

export interface AuthenticatedUser {
  id: string;
  email: string;
  name: string;
  roleId?: string;
  roleName?: string;
  permissions: PermissionMatrix;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthenticatedUser;
}

interface JwtTokenPayload {
  id: string;
  email: string;
}

export const requireAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({
      success: false,
      error: 'Authentication required. Missing or malformed token.',
    });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtTokenPayload;
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      include: { role: true },
    });

    if (!user || user.status === 'SUSPENDED') {
      res.status(401).json({
        success: false,
        error: 'User account not found or suspended.',
      });
      return;
    }

    const defaultPermissions: PermissionMatrix = {
      insights: { view: true, edit: true },
      inquiries: { view: true, edit: true },
      inquiry_types: { view: true, edit: true },
      countries: { view: true, edit: true },
      articles: { view: true, edit: true },
      policies: { view: true, edit: true },
      settings: { view: true, edit: true },
      roles: { view: true, edit: true },
      users: { view: true, edit: true },
      audit_logs: { view: true, edit: true },
    };

    req.user = {
      id: user.id,
      email: user.email,
      name: user.name,
      roleId: user.roleId || undefined,
      roleName: user.role?.name || 'Administrator',
      permissions: (user.role?.permissions as unknown as PermissionMatrix) || defaultPermissions,
    };

    next();
  } catch {
    res.status(401).json({
      success: false,
      error: 'Invalid or expired token.',
    });
    return;
  }
};
