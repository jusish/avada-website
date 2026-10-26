import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Shield,
  Clock,
  FileText,
  ChevronRight,
  Loader2,
  Mail,
  Printer,
  Copy,
  Check,
  BookOpen,
} from 'lucide-react';
import { LegalPolicy } from '@avada/shared';
import { Button } from '@/components/ui/button';
import { SEO } from '@/components/seo/SEO';

interface LegalPolicyPageProps {
  slug: 'terms' | 'privacy' | 'cookies';
  fallbackTitle: string;
}

interface ParsedBlock {
  type: 'h1' | 'h2' | 'h3' | 'paragraph' | 'list' | 'divider' | 'callout';
  id?: string;
  title?: string;
  text?: string;
  items?: string[];
}

/**
 * Robust markdown block parser designed for legal compliance documents.
 * Correctly isolates headings, numbered clauses, bullet lists, and paragraphs
 * without collapsing lines or leaving unrendered markdown tokens.
 */
function parsePolicyMarkdown(raw: string): {
  blocks: ParsedBlock[];
  tableOfContents: { id: string; title: string }[];
} {
  const lines = raw.split(/\r?\n/);
  const blocks: ParsedBlock[] = [];
  const tableOfContents: { id: string; title: string }[] = [];

  let currentList: string[] | null = null;
  let currentParagraph: string[] = [];

  const flushParagraph = () => {
    if (currentParagraph.length > 0) {
      const text = currentParagraph.join(' ').trim();
      if (text) {
        // Check for effective date / version header line
        if (text.startsWith('*Effective Date:') || text.startsWith('Effective Date:')) {
          blocks.push({ type: 'callout', text });
        } else {
          blocks.push({ type: 'paragraph', text });
        }
      }
      currentParagraph = [];
    }
  };

  const flushList = () => {
    if (currentList && currentList.length > 0) {
      blocks.push({ type: 'list', items: currentList });
      currentList = null;
    }
  };

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed) {
      flushParagraph();
      flushList();
      continue;
    }

    if (trimmed.startsWith('---')) {
      flushParagraph();
      flushList();
      blocks.push({ type: 'divider' });
      continue;
    }

    if (trimmed.startsWith('# ')) {
      flushParagraph();
      flushList();
      const text = trimmed.replace(/^#\s+/, '').trim();
      blocks.push({ type: 'h1', text });
      continue;
    }

    if (trimmed.startsWith('## ') || trimmed.startsWith('### ')) {
      flushParagraph();
      flushList();
      const text = trimmed.replace(/^#{2,3}\s+/, '').trim();
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      tableOfContents.push({ id, title: text });
      blocks.push({ type: 'h3', id, text });
      continue;
    }

    if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
      flushParagraph();
      if (!currentList) currentList = [];
      currentList.push(trimmed.replace(/^([*]|-)\s+/, '').trim());
      continue;
    }

    if (currentList) {
      flushList();
    }
    currentParagraph.push(trimmed);
  }

  flushParagraph();
  flushList();

  return { blocks, tableOfContents };
}

/**
 * Formats inline Markdown strings: **bold**, *italic*, emails, and links into React nodes.
 * Eliminates stray markdown stars while keeping key terms cleanly bolded.
 */
function renderFormattedInline(text: string): React.ReactNode {
  let cleanText = text.trim();

  // Strip accidental outer italics wrappers
  if (cleanText.startsWith('*') && cleanText.endsWith('*') && !cleanText.slice(1, -1).includes('*')) {
    cleanText = cleanText.slice(1, -1);
  }

  // Tokenize bold occurrences: **bold text**
  const boldParts = cleanText.split(/(\*\*[^*]+\*\*)/g);

  return boldParts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      const boldText = part.slice(2, -2);
      return (
        <strong key={index} className="font-semibold text-gray-900">
          {boldText}
        </strong>
      );
    }

    // Tokenize inner italics: *italic*
    if (part.includes('*')) {
      const italicParts = part.split(/(\*[^*]+\*)/g);
      return (
        <span key={index}>
          {italicParts.map((sub, sIdx) => {
            if (sub.startsWith('*') && sub.endsWith('*')) {
              return (
                <em key={sIdx} className="italic text-gray-700">
                  {sub.slice(1, -1)}
                </em>
              );
            }
            return renderLinksAndEmails(sub, sIdx);
          })}
        </span>
      );
    }

    return renderLinksAndEmails(part, index);
  });
}

function renderLinksAndEmails(text: string, key: string | number): React.ReactNode {
  // Support [link text](url)
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;

  if (linkRegex.test(text)) {
    const parts = text.split(/(\[[^\]]+\]\([^)]+\))/g);
    return (
      <span key={key}>
        {parts.map((p, i) => {
          const match = /\[([^\]]+)\]\(([^)]+)\)/.exec(p);
          if (match) {
            return (
              <a
                key={i}
                href={match[2]}
                target={match[2].startsWith('http') ? '_blank' : undefined}
                rel="noopener noreferrer"
                className="text-[#3BBA93] hover:underline font-semibold"
              >
                {match[1]}
              </a>
            );
          }
          return renderEmailsOnly(p, i);
        })}
      </span>
    );
  }

  return renderEmailsOnly(text, key);
}

function renderEmailsOnly(text: string, key: string | number): React.ReactNode {
  const emailRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g;
  const parts = text.split(emailRegex);

  if (parts.length === 1) return text;

  return (
    <span key={key}>
      {parts.map((p, i) => {
        if (/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(p)) {
          return (
            <a
              key={i}
              href={`mailto:${p}`}
              className="text-[#3BBA93] hover:underline font-semibold inline-flex items-center"
            >
              {p}
            </a>
          );
        }
        return p;
      })}
    </span>
  );
}

export const LegalPolicyPage: React.FC<LegalPolicyPageProps> = ({ slug, fallbackTitle }) => {
  const [policy, setPolicy] = useState<LegalPolicy | null>(null);
  const [loading, setLoading] = useState(true);
  const [copiedLink, setCopiedLink] = useState(false);

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

  // Parse structured blocks and table of contents
  const { blocks, tableOfContents } = useMemo(() => {
    if (!policy?.content) return { blocks: [], tableOfContents: [] };
    return parsePolicyMarkdown(policy.content);
  }, [policy?.content]);

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#2A292D] font-sans pb-20">
      <SEO
        title={policy?.title || fallbackTitle}
        description={policy?.summary || `${fallbackTitle} for AvadaPay financial infrastructure, payments, POS, and SMS services.`}
        canonical={`/${slug}`}
        keywords={`Avadapay ${fallbackTitle}, legal compliance, terms of service, privacy policy`}
        noindex={true}
      />

      {/* 1. Sleek, Elevated Header (Starts close to top with tight padding) */}
      <section className="bg-[#2A292D] text-white pt-8 sm:pt-12 pb-10 sm:pb-12 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-xs font-medium text-white/50 mb-4">
            <Link to="/" className="hover:text-[#3BBA93] transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-white/30" />
            <span className="text-white/60">Legal & Compliance</span>
            <ChevronRight className="w-3.5 h-3.5 text-white/30" />
            <span className="text-[#3BBA93] font-semibold">{policy?.title || fallbackTitle}</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2 max-w-3xl">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-[#3BBA93]/15 text-[#3BBA93] text-[11px] font-bold border border-[#3BBA93]/30">
                  <Shield className="w-3 h-3" />
                  <span>Official Compliance Document</span>
                </span>
                <span className="text-[11px] font-medium text-white/50">
                  AvadaPay Financial Infrastructure
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                {policy?.title || fallbackTitle}
              </h1>

              {policy?.summary && (
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-normal pt-1">
                  {policy.summary}
                </p>
              )}
            </div>

            {/* Document Telemetry Strip */}
            <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 backdrop-blur-xs flex-shrink-0">
              <div className="flex items-center space-x-1.5 text-xs text-white/70">
                <FileText className="w-3.5 h-3.5 text-[#3BBA93]" />
                <span className="text-[11px] text-white/50">Version:</span>
                <span className="text-xs font-mono font-bold text-white">{policy?.version || '1.0'}</span>
              </div>
              <span className="text-white/20">•</span>
              <div className="flex items-center space-x-1.5 text-xs text-white/70">
                <Clock className="w-3.5 h-3.5 text-[#3BBA93]" />
                <span className="text-[11px] text-white/50">Effective:</span>
                <span className="text-xs font-mono font-bold text-white">
                  {policy?.effectiveDate
                    ? new Date(policy.effectiveDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })
                    : 'Jan 1, 2026'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Wide, Balanced 2-Column Content Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8 items-start">
          
          {/* Left Sticky Navigation Column */}
          <aside className="space-y-5 lg:sticky lg:top-24">
            {/* Document Navigation Card */}
            <div className="bg-white rounded-xl border border-gray-200/80 p-4 shadow-2xs space-y-3">
              <div className="flex items-center space-x-2 text-xs font-bold text-gray-400 uppercase tracking-wider px-2">
                <BookOpen className="w-3.5 h-3.5 text-[#3BBA93]" />
                <span>Compliance Suite</span>
              </div>

              <nav className="space-y-1">
                {[
                  { label: 'Terms of Service', path: '/terms', slugKey: 'terms' },
                  { label: 'Privacy Policy', path: '/privacy', slugKey: 'privacy' },
                  { label: 'Cookie Policy', path: '/cookies', slugKey: 'cookies' },
                ].map((item) => {
                  const isActive = slug === item.slugKey;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                        isActive
                          ? 'bg-[#3BBA93] text-white shadow-xs font-bold'
                          : 'text-gray-600 hover:bg-gray-100/70 hover:text-gray-900'
                      }`}
                    >
                      <span>{item.label}</span>
                      {isActive && <ChevronRight className="w-3.5 h-3.5 text-white" />}
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* In-Page Table of Contents (Numbered Clauses) */}
            {tableOfContents.length > 0 && (
              <div className="hidden lg:block bg-white rounded-xl border border-gray-200/80 p-4 shadow-2xs space-y-3">
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider px-2">
                  On This Page
                </p>
                <nav className="space-y-0.5 max-h-[380px] overflow-y-auto pr-1 text-xs">
                  {tableOfContents.map((section) => (
                    <a
                      key={section.id}
                      href={`#${section.id}`}
                      className="block px-2.5 py-1.5 rounded-md text-[12px] text-gray-600 hover:text-[#3BBA93] hover:bg-emerald-50/50 transition-colors truncate font-medium"
                      title={section.title}
                    >
                      {section.title}
                    </a>
                  ))}
                </nav>
              </div>
            )}

            {/* Legal Support Help Card */}
            <div className="bg-gradient-to-br from-gray-50 to-emerald-50/40 rounded-xl border border-gray-200/80 p-4 shadow-2xs space-y-2">
              <p className="text-xs font-bold text-[#2A292D]">Contract Questions?</p>
              <p className="text-[11px] text-gray-500 leading-relaxed font-normal">
                Our legal and regulatory compliance team is available to assist enterprise merchants with custom MSAs.
              </p>
              <div className="pt-2">
                <Link to="/contact">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-xs font-semibold rounded-lg border-gray-300 hover:border-[#3BBA93] hover:text-[#3BBA93] bg-white space-x-1.5 h-8"
                  >
                    <Mail className="w-3.5 h-3.5 text-[#3BBA93]" />
                    <span>Contact Legal Desk</span>
                  </Button>
                </Link>
              </div>
            </div>
          </aside>

          {/* Right Main Document Paper Column */}
          <main className="bg-white rounded-xl border border-gray-200/80 shadow-2xs p-6 sm:p-10 space-y-6">
            
            {/* Top Document Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-gray-100 gap-3">
              <div>
                <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider block">
                  Official Terms
                </span>
                <h2 className="text-lg sm:text-xl font-bold text-[#2A292D]">
                  {policy?.title || fallbackTitle}
                </h2>
              </div>

              {/* Action Buttons: Print & Copy Link */}
              <div className="flex items-center space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleCopyLink}
                  className="h-8 text-xs font-semibold rounded-lg border-gray-200 text-gray-600 hover:text-gray-900 space-x-1.5"
                  title="Copy permanent document link"
                >
                  {copiedLink ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#3BBA93]" />
                      <span className="text-[#3BBA93] font-bold">Link Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-gray-400" />
                      <span>Share Link</span>
                    </>
                  )}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handlePrint}
                  className="h-8 text-xs font-semibold rounded-lg border-gray-200 text-gray-600 hover:text-gray-900 space-x-1.5"
                  title="Print or save as PDF"
                >
                  <Printer className="w-3.5 h-3.5 text-gray-400" />
                  <span>Print Document</span>
                </Button>
              </div>
            </div>

            {/* Document Content Rendering */}
            {loading ? (
              <div className="py-20 text-center space-y-3">
                <Loader2 className="w-7 h-7 animate-spin text-[#3BBA93] mx-auto" />
                <p className="text-xs font-medium text-gray-400">Loading verified compliance document...</p>
              </div>
            ) : (
              <div className="policy-document space-y-5 text-gray-700 text-xs sm:text-[13px] leading-relaxed">
                {blocks.map((block, idx) => {
                  switch (block.type) {
                    case 'h1':
                      // We already display the title in the header bar
                      return null;

                    case 'h3':
                      return (
                        <div key={idx} id={block.id} className="pt-4 scroll-mt-24">
                          <h3 className="text-sm sm:text-base font-bold text-[#2A292D] pb-1.5 border-b border-gray-100 flex items-center justify-between">
                            <span>{block.text}</span>
                            <a
                              href={`#${block.id}`}
                              className="text-gray-300 hover:text-[#3BBA93] text-xs font-normal"
                              title="Link to this clause"
                            >
                              #
                            </a>
                          </h3>
                        </div>
                      );

                    case 'list':
                      return (
                        <div key={idx} className="my-2.5 pl-3 border-l-2 border-emerald-500/25 space-y-2">
                          {block.items?.map((item, iIdx) => (
                            <div key={iIdx} className="flex items-start space-x-2 text-xs sm:text-[13px] leading-relaxed text-gray-600 font-normal">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#3BBA93] mt-1.5 flex-shrink-0" />
                              <div className="flex-1">
                                {renderFormattedInline(item)}
                              </div>
                            </div>
                          ))}
                        </div>
                      );

                    case 'divider':
                      return <hr key={idx} className="my-6 border-gray-100" />;

                    case 'callout':
                      return (
                        <div
                          key={idx}
                          className="p-3.5 rounded-lg bg-emerald-50/50 border border-emerald-200/60 text-emerald-950 text-xs leading-relaxed font-normal"
                        >
                          {renderFormattedInline(block.text || '')}
                        </div>
                      );

                    case 'paragraph':
                    default:
                      return (
                        <p key={idx} className="text-xs sm:text-[13px] text-gray-600 leading-relaxed font-normal">
                          {renderFormattedInline(block.text || '')}
                        </p>
                      );
                  }
                })}
              </div>
            )}

            {/* Bottom Inquiries Footer */}
            <div className="mt-10 pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gray-50/70 p-5 rounded-xl">
              <div>
                <p className="text-xs font-bold text-[#2A292D]">Need tailored terms or compliance certificates?</p>
                <p className="text-[11px] text-gray-500 mt-0.5 font-normal">
                  Our regional legal teams in Dubai, Kigali, and Nairobi support enterprise compliance requests.
                </p>
              </div>

              <Link to="/contact">
                <Button
                  size="sm"
                  variant="gradient"
                  className="rounded-xl text-xs font-semibold h-8 px-4 whitespace-nowrap"
                >
                  <Mail className="w-3.5 h-3.5 mr-1.5" />
                  <span>Inquire with Legal</span>
                </Button>
              </Link>
            </div>
          </main>
        </div>
      </section>
    </div>
  );
};
