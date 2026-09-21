import React from 'react';
import { Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { AdminSidebar } from '@/components/AdminSidebar';
import { ScrollToTop } from '@/components/ScrollToTop';

// Public Pages
import { HomePage } from '@/pages/public/HomePage';
import { PaymentProcessingPage } from '@/pages/public/PaymentProcessingPage';
import { PosPage } from '@/pages/public/PosPage';
import { BulkSmsPage } from '@/pages/public/BulkSmsPage';
import { CountryPage } from '@/pages/public/CountryPage';
import { ContactPage } from '@/pages/public/ContactPage';

// Admin CMS Pages
import { AdminLoginPage } from '@/pages/admin/AdminLoginPage';
import { AdminDashboardPage } from '@/pages/admin/AdminDashboardPage';
import { AdminContentPage } from '@/pages/admin/AdminContentPage';

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

// Admin Protected Layout
const AdminProtectedLayout: React.FC = () => {
  const { token, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3BBA93]"></div>
      </div>
    );
  }

  if (!token) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return (
    <div className="flex min-h-screen bg-muted/20">
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
      <ScrollToTop />
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/payment-processing" element={<PaymentProcessingPage />} />
          <Route path="/pos" element={<PosPage />} />
          <Route path="/bulk-sms" element={<BulkSmsPage />} />
          <Route path="/countries/:countrySlug" element={<CountryPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Route>

        {/* Admin Login Route */}
        <Route path="/admin/login" element={<AdminLoginPage />} />

        {/* Admin CMS Protected Routes */}
        <Route path="/admin" element={<AdminProtectedLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboardPage />} />
          <Route path="content" element={<AdminContentPage />} />
        </Route>

        {/* 404 Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
};

export default App;
