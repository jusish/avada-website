import React, { useEffect } from 'react';
import { Routes, Route, Navigate, Outlet, useLocation, useParams } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { SiteConfigProvider } from '@/context/SiteConfigContext';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { AdminSidebar } from '@/components/AdminSidebar';
import { ScrollToTop } from '@/components/ScrollToTop';
import { AdminPermissionGuard } from '@/components/AdminPermissionGuard';

// Public Marketing & Regional Pages
import { HomePage } from '@/pages/public/HomePage';
import { PaymentProcessingPage } from '@/pages/public/PaymentProcessingPage';
import { PosPage } from '@/pages/public/PosPage';
import { BulkSmsPage } from '@/pages/public/BulkSmsPage';
import { CountryPage } from '@/pages/public/CountryPage';
import { ContactPage } from '@/pages/public/ContactPage';
import { LegalPolicyPage } from '@/pages/public/LegalPolicyPage';
import { CareersPage } from '@/pages/public/CareersPage';
import { DocsPage } from '@/pages/public/DocsPage';
import { NotFoundPage } from '@/pages/public/NotFoundPage';

// Admin CMS & Operations Pages
import { AdminLoginPage } from '@/pages/admin/AdminLoginPage';
import { AdminForgotPasswordPage } from '@/pages/admin/AdminForgotPasswordPage';
import { AdminResetPasswordPage } from '@/pages/admin/AdminResetPasswordPage';
import { AdminSetPasswordPage } from '@/pages/admin/AdminSetPasswordPage';
import { AdminProfilePage } from '@/pages/admin/AdminProfilePage';
import { AdminDashboardPage } from '@/pages/admin/AdminDashboardPage';
import { AdminAnalyticsPage } from '@/pages/admin/AdminAnalyticsPage';
import { AdminSecurityPage } from '@/pages/admin/AdminSecurityPage';
import { AdminInquiriesPage } from '@/pages/admin/AdminInquiriesPage';
import { AdminInquiryTypesPage } from '@/pages/admin/AdminInquiryTypesPage';
import { AdminCountriesPage } from '@/pages/admin/AdminCountriesPage';
import { AdminContentPage } from '@/pages/admin/AdminContentPage';
import { AdminPoliciesPage } from '@/pages/admin/AdminPoliciesPage';
import { AdminSettingsPage } from '@/pages/admin/AdminSettingsPage';
import { AdminRolesPage } from '@/pages/admin/AdminRolesPage';
import { AdminUsersPage } from '@/pages/admin/AdminUsersPage';
import { AdminAuditLogsPage } from '@/pages/admin/AdminAuditLogsPage';
import { AdminIntegrationsPage } from '@/pages/admin/AdminIntegrationsPage';

// Public Layout
const PublicLayout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

// Backward-compatibility redirect for legacy /countries/:countrySlug URLs
const CountryRedirect: React.FC = () => {
  const { countrySlug } = useParams<{ countrySlug: string }>();
  return <Navigate to={`/${countrySlug || ''}`} replace />;
};

// Admin Route Title Mapping
const ADMIN_ROUTE_TITLES: Record<string, string> = {
  '/admin': 'Dashboard Overview | AvadaPay CMS',
  '/admin/dashboard': 'Dashboard Overview | AvadaPay CMS',
  '/admin/insights/analytics': 'Analytics & Telemetry | AvadaPay CMS',
  '/admin/insights/security': 'Security Telemetry | AvadaPay CMS',
  '/admin/inquiries': 'Inquiries CRM | AvadaPay CMS',
  '/admin/inquiries/types': 'Inquiry Categories | AvadaPay CMS',
  '/admin/content/countries': 'Regional Markets | AvadaPay CMS',
  '/admin/content/articles': 'Articles & Announcements | AvadaPay CMS',
  '/admin/content/policies': 'Legal Policies | AvadaPay CMS',
  '/admin/content/settings': 'Global Site Settings | AvadaPay CMS',
  '/admin/integrations': 'Connected Integrations | AvadaPay CMS',
  '/admin/integrations/logs': 'Integration Telemetry Logs | AvadaPay CMS',
  '/admin/settings/integrations': 'Connected Integrations | AvadaPay CMS',
  '/admin/governance/roles': 'Role Permissions | AvadaPay CMS',
  '/admin/governance/users': 'User Directory | AvadaPay CMS',
  '/admin/governance/audit-logs': 'Audit Logs | AvadaPay CMS',
  '/admin/roles': 'Role Permissions | AvadaPay CMS',
  '/admin/users': 'User Directory | AvadaPay CMS',
  '/admin/audit-logs': 'Audit Logs | AvadaPay CMS',
  '/admin/profile': 'My Profile & Security | AvadaPay CMS',
};

// Admin Protected Layout
const AdminProtectedLayout: React.FC = () => {
  const { user, token, isLoading } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const cleanPath = location.pathname.replace(/\/$/, '');
    const title = ADMIN_ROUTE_TITLES[cleanPath] || 'Administration Portal | AvadaPay CMS';
    document.title = title;

    if (typeof document !== 'undefined') {
      let metaRobots = document.querySelector('meta[name="robots"]') as HTMLMetaElement | null;
      if (!metaRobots) {
        metaRobots = document.createElement('meta');
        metaRobots.name = 'robots';
        document.head.appendChild(metaRobots);
      }
      metaRobots.content = 'noindex, nofollow';
    }
  }, [location.pathname]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#2A292D]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3BBA93]"></div>
      </div>
    );
  }

  if (!token) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // Force users with pending initial temporary password to set their permanent password
  if (user?.mustChangePassword) {
    return <Navigate to="/admin/set-password" replace />;
  }

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <AdminSidebar />
      <main className="flex-1 p-6 sm:p-8 overflow-y-auto max-w-7xl">
        <Outlet />
      </main>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <SiteConfigProvider>
        <ScrollToTop />
        <Routes>
          {/* Public Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/payment-processing" element={<PaymentProcessingPage />} />
            <Route path="/pos" element={<PosPage />} />
            <Route path="/bulk-sms" element={<BulkSmsPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/careers" element={<CareersPage />} />
            <Route path="/careers/:jobId" element={<CareersPage />} />
            <Route path="/docs" element={<DocsPage />} />

            {/* Official Legal & Compliance Pages */}
            <Route
              path="/terms"
              element={<LegalPolicyPage slug="terms" fallbackTitle="Terms of Service" />}
            />
            <Route
              path="/privacy"
              element={<LegalPolicyPage slug="privacy" fallbackTitle="Privacy Policy" />}
            />
            <Route
              path="/cookies"
              element={<LegalPolicyPage slug="cookies" fallbackTitle="Cookie Policy" />}
            />

            {/* Backward-compatibility redirect for legacy /countries/:countrySlug */}
            <Route path="/countries/:countrySlug" element={<CountryRedirect />} />

            {/* Direct Country Pages: /kenya, /rwanda, /tanzania, etc. */}
            <Route path="/:countrySlug" element={<CountryPage />} />
          </Route>

          {/* Admin Login & Password Recovery Routes */}
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin/forgot-password" element={<AdminForgotPasswordPage />} />
          <Route path="/admin/reset-password" element={<AdminResetPasswordPage />} />
          <Route path="/admin/set-password" element={<AdminSetPasswordPage />} />

          {/* Admin CMS Protected Routes */}
          <Route path="/admin" element={<AdminProtectedLayout />}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route
              path="dashboard"
              element={
                <AdminPermissionGuard module="insights">
                  <AdminDashboardPage />
                </AdminPermissionGuard>
              }
            />

            {/* Insights & Telemetry */}
            <Route
              path="insights/analytics"
              element={
                <AdminPermissionGuard module="insights">
                  <AdminAnalyticsPage />
                </AdminPermissionGuard>
              }
            />
            <Route
              path="insights/security"
              element={
                <AdminPermissionGuard module="insights">
                  <AdminSecurityPage />
                </AdminPermissionGuard>
              }
            />

            {/* Communications & Inquiries CRM */}
            <Route
              path="inquiries"
              element={
                <AdminPermissionGuard module="inquiries">
                  <AdminInquiriesPage />
                </AdminPermissionGuard>
              }
            />
            <Route
              path="inquiries/types"
              element={
                <AdminPermissionGuard module="inquiry_types">
                  <AdminInquiryTypesPage />
                </AdminPermissionGuard>
              }
            />

            {/* Content Management */}
            <Route
              path="content/countries"
              element={
                <AdminPermissionGuard module="countries">
                  <AdminCountriesPage />
                </AdminPermissionGuard>
              }
            />
            <Route
              path="content/articles"
              element={
                <AdminPermissionGuard module="articles">
                  <AdminContentPage />
                </AdminPermissionGuard>
              }
            />
            <Route
              path="content/policies"
              element={
                <AdminPermissionGuard module="policies">
                  <AdminPoliciesPage />
                </AdminPermissionGuard>
              }
            />
            <Route
              path="content/settings"
              element={
                <AdminPermissionGuard module="settings">
                  <AdminSettingsPage />
                </AdminPermissionGuard>
              }
            />

            {/* Integrations & External APIs */}
            <Route
              path="integrations"
              element={
                <AdminPermissionGuard module="integrations">
                  <AdminIntegrationsPage />
                </AdminPermissionGuard>
              }
            />
            <Route path="integrations/logs" element={<Navigate to="/admin/integrations" replace />} />
            <Route path="settings/integrations" element={<Navigate to="/admin/integrations" replace />} />

            {/* Backward compatibility aliases */}
            <Route path="content" element={<Navigate to="/admin/content/articles" replace />} />

            {/* Governance & Access */}
            <Route
              path="governance/roles"
              element={
                <AdminPermissionGuard module="roles">
                  <AdminRolesPage />
                </AdminPermissionGuard>
              }
            />
            <Route
              path="governance/users"
              element={
                <AdminPermissionGuard module="users">
                  <AdminUsersPage />
                </AdminPermissionGuard>
              }
            />
            <Route
              path="governance/audit-logs"
              element={
                <AdminPermissionGuard module="audit_logs">
                  <AdminAuditLogsPage />
                </AdminPermissionGuard>
              }
            />

            {/* Administrator Profile & Security */}
            <Route path="profile" element={<AdminProfilePage />} />

            {/* Convenience redirects */}
            <Route path="roles" element={<Navigate to="/admin/governance/roles" replace />} />
            <Route path="users" element={<Navigate to="/admin/governance/users" replace />} />
            <Route path="audit-logs" element={<Navigate to="/admin/governance/audit-logs" replace />} />
          </Route>

          {/* 404 Catch-all with Public Layout */}
          <Route element={<PublicLayout />}>
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </SiteConfigProvider>
    </AuthProvider>
  );
};

export default App;
