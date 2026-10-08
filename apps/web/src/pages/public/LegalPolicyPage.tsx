import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Clock, FileText, ChevronRight, Loader2, Mail } from 'lucide-react';
import { LegalPolicy } from '@avada/shared';
import { Button } from '@/components/ui/button';

interface LegalPolicyPageProps {
  slug: 'terms' | 'privacy' | 'cookies';
  fallbackTitle: string;
}

export const LegalPolicyPage: React.FC<LegalPolicyPageProps> = ({ slug, fallbackTitle }) => {
  const [policy, setPolicy] = useState<LegalPolicy | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/public/policies/${slug}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) {
          setPolicy(json.data);
        }
      })
      .catch((err) => console.error('Failed to load legal policy:', err))
      .finally(() => setLoading(false));
  }, [slug]);

  // Clean lines for markdown rendering
  const content = policy?.content || '';

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#2A292D] font-sans pb-24">
      {/* Top Brand Banner */}
      <section className="bg-[#2A292D] text-white pt-24 sm:pt-32 pb-16 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-xs font-semibold text-white/60 mb-6">
            <Link to="/" className="hover:text-[#3BBA93] transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span>Legal & Compliance</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-[#3BBA93]">{policy?.title || fallbackTitle}</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#3BBA93]/20 border border-[#3BBA93]/30 text-[#3BBA93] text-xs font-bold mb-4">
                <Shield className="w-3.5 h-3.5" />
                <span>Official Compliance Document</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
                {policy?.title || fallbackTitle}
              </h1>
              {policy?.summary && (
                <p className="mt-4 text-base sm:text-lg text-white/80 max-w-2xl font-medium leading-relaxed">
                  {policy.summary}
                </p>
              )}
            </div>

            {/* Version & Date Card */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 sm:p-6 backdrop-blur-sm flex flex-col space-y-3 flex-shrink-0">
              <div className="flex items-center space-x-2 text-xs font-semibold text-white/70">
                <FileText className="w-4 h-4 text-[#3BBA93]" />
                <span>Version: <strong className="text-white font-mono">{policy?.version || '1.0'}</strong></span>
              </div>
              <div className="flex items-center space-x-2 text-xs font-semibold text-white/70">
                <Clock className="w-4 h-4 text-[#3BBA93]" />
                <span>
                  Effective:{' '}
                  <strong className="text-white font-mono">
                    {policy?.effectiveDate ? new Date(policy.effectiveDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Jan 1, 2026'}
                  </strong>
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="max-w-5xl mx-auto px-4 -mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-8">
          {/* Quick Legal Navigation Sidebar */}
          <aside className="hidden lg:block sticky top-28 h-fit space-y-4 bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <p className="text-xs font-extrabold uppercase tracking-wider text-gray-400">
              Legal Documents
            </p>
            <nav className="space-y-1">
              {[
                { label: 'Terms of Service', path: '/terms', slugKey: 'terms' },
                { label: 'Privacy Policy', path: '/privacy', slugKey: 'privacy' },
                { label: 'Cookie Policy', path: '/cookies', slugKey: 'cookies' },
              ].map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`block px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                    slug === item.slugKey
                      ? 'bg-[#3BBA93] text-white shadow-sm'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-[#2A292D]'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="pt-4 border-t border-gray-100 text-xs text-gray-500 space-y-2">
              <p className="font-semibold text-gray-700">Need clarification?</p>
              <Link to="/contact" className="inline-flex items-center text-[#3BBA93] hover:underline font-bold">
                <span>Talk to Legal</span>
                <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
              </Link>
            </div>
          </aside>

          {/* Formatted Policy Document Container */}
          <main className="bg-white rounded-3xl p-6 sm:p-12 border border-gray-100 shadow-xl space-y-6">
            {loading ? (
              <div className="py-24 text-center space-y-3">
                <Loader2 className="w-8 h-8 animate-spin text-[#3BBA93] mx-auto" />
                <p className="text-sm font-semibold text-gray-500">Loading verified policy text...</p>
              </div>
            ) : (
              <article className="prose prose-slate max-w-none prose-headings:text-[#2A292D] prose-headings:font-black prose-p:text-[#2A292D]/85 prose-p:leading-relaxed prose-li:text-[#2A292D]/85">
                {content.split('\n\n').map((paragraph, index) => {
                  const trimmed = paragraph.trim();
                  if (trimmed.startsWith('# ')) {
                    return <h1 key={index} className="text-2xl sm:text-3xl font-black mt-8 mb-4 text-[#2A292D]">{trimmed.replace(/^#\s+/, '')}</h1>;
                  }
                  if (trimmed.startsWith('### ')) {
                    return <h3 key={index} className="text-lg sm:text-xl font-bold mt-6 mb-2 text-[#2A292D]">{trimmed.replace(/^###\s+/, '')}</h3>;
                  }
                  if (trimmed.startsWith('* ')) {
                    const items = trimmed.split('\n* ').map((item) => item.replace(/^\*\s+/, ''));
                    return (
                      <ul key={index} className="list-disc pl-5 space-y-1.5 my-3">
                        {items.map((it, i) => (
                          <li key={i} className="text-sm sm:text-base font-medium text-[#2A292D]/85">{it}</li>
                        ))}
                      </ul>
                    );
                  }
                  if (trimmed.startsWith('---')) {
                    return <hr key={index} className="my-6 border-gray-200" />;
                  }
                  return (
                    <p key={index} className="text-sm sm:text-base font-medium leading-relaxed text-[#2A292D]/85">
                      {trimmed}
                    </p>
                  );
                })}
              </article>
            )}

            {/* Questions Banner */}
            <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gray-50 p-6 rounded-2xl">
              <div>
                <p className="text-sm font-bold text-[#2A292D]">Have questions regarding this document?</p>
                <p className="text-xs text-gray-500 mt-0.5">Our legal and compliance team can assist with enterprise contracts.</p>
              </div>
              <Link to="/contact">
                <Button className="bg-[#3BBA93] hover:bg-[#32a481] text-white font-bold h-10 px-5 rounded-xl text-xs">
                  <Mail className="w-3.5 h-3.5 mr-1.5" />
                  <span>Contact Legal Team</span>
                </Button>
              </Link>
            </div>
          </main>
        </div>
      </section>
    </div>
  );
};
