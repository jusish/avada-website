export type UserRole = 'ADMIN' | 'EDITOR';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    name: string;
    role: UserRole;
  };
  token: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export type ContentStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

export interface ContentItem {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  category: string;
  status: ContentStatus;
  authorId: string;
  author?: {
    id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateContentPayload {
  title: string;
  slug?: string;
  excerpt: string;
  body: string;
  category: string;
  status?: ContentStatus;
}

export interface UpdateContentPayload extends Partial<CreateContentPayload> {}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
