// ==========================================
// User & Role-Based Access Control (RBAC)
// ==========================================

export type CmsModule =
  | 'insights'
  | 'inquiries'
  | 'inquiry_types'
  | 'countries'
  | 'articles'
  | 'policies'
  | 'settings'
  | 'roles'
  | 'users'
  | 'audit_logs';

export interface ModulePermission {
  view: boolean;
  edit: boolean;
}

export type PermissionMatrix = Record<CmsModule, ModulePermission>;

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: PermissionMatrix;
  isSystem: boolean; // System roles cannot be deleted
  createdAt: string;
  updatedAt: string;
}

export type UserStatus = 'ACTIVE' | 'INVITED' | 'SUSPENDED';

export interface User {
  id: string;
  email: string;
  name: string;
  roleId: string;
  role?: Role;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    name: string;
    roleId: string;
    role: Role;
    status: UserStatus;
  };
  token: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

// ==========================================
// Dynamic Countries & African Market Hubs
// ==========================================

export interface Country {
  id: string;
  code: string; // ISO 2 code (e.g. "ke", "rw", "tz", "ug")
  slug: string; // Unique URL slug (e.g. "kenya", "rwanda", "uganda")
  name: string; // Country Name
  currencyCode: string; // e.g. "KES", "RWF", "TZS", "UGX"
  headline: string;
  tagline: string;
  description: string;
  telcoPartners: string[]; // e.g. ["MTN MoMo", "Airtel Money"]
  paymentRails: string[]; // e.g. ["Mobile Money", "Cards", "Payout APIs"]
  pricingSummary?: string | null;
  officeAddress?: string | null;
  officePhone?: string | null;
  officeEmail?: string | null;
  mapEmbedUrl?: string | null;
  active: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCountryPayload {
  code: string;
  slug: string;
  name: string;
  currencyCode?: string;
  headline: string;
  tagline?: string;
  description: string;
  telcoPartners?: string[];
  paymentRails?: string[];
  pricingSummary?: string;
  officeAddress?: string;
  officePhone?: string;
  officeEmail?: string;
  mapEmbedUrl?: string;
  active?: boolean;
  displayOrder?: number;
}

export type UpdateCountryPayload = Partial<CreateCountryPayload>;

// ==========================================
// Inquiry Types & Inquiries CRM
// ==========================================

export interface InquiryType {
  id: string;
  key: string; // e.g. "sms", "payments", "pos", "api"
  label: string; // e.g. "SMS Pricing & Aggregator"
  description?: string | null;
  active: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateInquiryTypePayload {
  key: string;
  label: string;
  description?: string;
  active?: boolean;
  displayOrder?: number;
}

export type UpdateInquiryTypePayload = Partial<CreateInquiryTypePayload>;

export type InquiryStatus = 'UNREAD' | 'READ' | 'CONTACTED' | 'RESOLVED';

export interface ContactInquiry {
  id: string;
  fullName: string;
  email: string;
  phone?: string | null;
  orgName?: string | null;
  roleTitle?: string | null;
  country: string;
  inquiryType: string;
  message: string;
  status: InquiryStatus;
  handledById?: string | null;
  handledBy?: {
    id: string;
    name: string;
    email: string;
  } | null;
  handledAt?: string | null;
  adminNotes?: string | null;
  ipAddress?: string | null;
  userAgent?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SubmitInquiryPayload {
  fullName: string;
  email: string;
  phone?: string;
  orgName?: string;
  roleTitle?: string;
  country: string;
  inquiryType: string;
  message: string;
}

// ==========================================
// Global Site Settings, Contacts & Socials
// ==========================================

export interface SocialLink {
  key: string;
  name: string;
  url: string | null;
  enabled: boolean;
  target: '_blank' | '_self';
}

export interface GeneralContacts {
  supportEmail: string;
  supportPhone: string;
  salesEmail?: string;
  officeAddress: string;
}

export interface FooterConfig {
  disclaimerText: string;
  copyrightText: string;
}

export interface SiteSettingsData {
  contacts: GeneralContacts;
  socials: SocialLink[];
  footer: FooterConfig;
}

// Bundled site configuration for public web hydration
export interface PublicSiteConfig {
  countries: Country[];
  inquiryTypes: InquiryType[];
  contacts: GeneralContacts;
  socials: SocialLink[];
  footer: FooterConfig;
}

// ==========================================
// Legal & Compliance Policies
// ==========================================

export type ContentStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

export interface LegalPolicy {
  id: string;
  slug: string; // "terms", "privacy", "cookies"
  title: string;
  summary?: string | null;
  content: string; // Markdown or rich text
  version: string; // e.g. "1.0", "1.1"
  status: ContentStatus;
  effectiveDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateLegalPolicyPayload {
  slug: string;
  title: string;
  summary?: string;
  content: string;
  version?: string;
  status?: ContentStatus;
  effectiveDate?: string;
}

export type UpdateLegalPolicyPayload = Partial<CreateLegalPolicyPayload>;

// ==========================================
// Standard Content Items (Articles/Press)
// ==========================================

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

export type UpdateContentPayload = Partial<CreateContentPayload>;

// ==========================================
// Audit Logs & Security Telemetry
// ==========================================

export interface AuditLog {
  id: string;
  userId?: string | null;
  userEmail: string;
  action: string;
  entityType: string;
  entityId?: string | null;
  details?: Record<string, unknown> | null;
  ipAddress?: string | null;
  userAgent?: string | null;
  createdAt: string;
}

export interface SiteTelemetry {
  id: string;
  path: string;
  country?: string | null;
  referrer?: string | null;
  isSuspicious: boolean;
  flagReason?: string | null;
  responseTime?: number | null;
  statusCode?: number | null;
  createdAt: string;
}

export interface AnalyticsOverview {
  totalVisits: number;
  uniqueVisitors: number;
  uptimePercentage: number;
  averageResponseTimeMs: number;
  suspiciousEventsCount: number;
  topRoutes: { path: string; count: number }[];
  countryBreakdown: { country: string; count: number; percentage: number }[];
  timeline: { date: string; visits: number; unique: number }[];
  recentThreats: SiteTelemetry[];
}

// ==========================================
// Generic API Response
// ==========================================

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  details?: unknown;
}
