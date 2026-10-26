import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { JobVacancy, VacancyMetadata } from '@avada/shared';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { CountryFlag } from '@/components/CountryFlag';
import {
  Briefcase,
  Search,
  MapPin,
  ArrowRight,
  ExternalLink,
  Share2,
  Check,
  Globe2,
  Sparkles,
  TrendingUp,
  Shield,
  X,
  Mail,
} from 'lucide-react';

export const CareersPage: React.FC = () => {
  const params = useParams<{ jobId?: string }>();
  const location = useLocation();
  const navigate = useNavigate();

  const [vacancies, setVacancies] = useState<JobVacancy[]>([]);
  const [metadata, setMetadata] = useState<VacancyMetadata | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Filters State
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCountry, setSelectedCountry] = useState<string>('all');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');

  // Selected Vacancy Modal
  const [activeVacancy, setActiveVacancy] = useState<JobVacancy | null>(null);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  // Extract target job identifier from route params, query search (?job=), or hash (#jobId)
  const getTargetJobId = useCallback((): string | null => {
    if (params.jobId) return params.jobId.trim();
    const searchParams = new URLSearchParams(location.search);
    const qJob = searchParams.get('job') || searchParams.get('id');
    if (qJob) return qJob.trim();
    if (location.hash) {
      const hash = location.hash.replace(/^#/, '').trim();
      if (hash) return hash;
    }
    return null;
  }, [params.jobId, location.search, location.hash]);

  // Open modal and synchronize browser URL without full reload
  const openVacancyModal = useCallback(
    (vacancy: JobVacancy, updateUrl = true) => {
      setActiveVacancy(vacancy);
      if (updateUrl && typeof window !== 'undefined') {
        const targetHash = `#${vacancy.id}`;
        if (window.location.hash !== targetHash && !params.jobId) {
          window.history.pushState({ modal: 'job', jobId: vacancy.id }, '', `/careers#${vacancy.id}`);
        }
      }
    },
    [params.jobId]
  );

  // Close modal and revert browser URL cleanly to /careers
  const closeVacancyModal = useCallback(
    (updateUrl = true) => {
      setActiveVacancy(null);
      if (updateUrl && typeof window !== 'undefined') {
        if (params.jobId) {
          navigate('/careers', { replace: true });
        } else if (window.location.hash) {
          window.history.pushState(null, '', '/careers');
        }
      }
    },
    [params.jobId, navigate]
  );

  // Fetch Vacancies & Metadata
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [vacanciesRes, metaRes] = await Promise.all([
          fetch('/api/public/careers/vacancies'),
          fetch('/api/public/careers/metadata'),
        ]);

        const vacanciesData = await vacanciesRes.json();
        const metaData = await metaRes.json();

        if (vacanciesData.success && Array.isArray(vacanciesData.data)) {
          setVacancies(vacanciesData.data);
        }
        if (metaData.success && metaData.data) {
          setMetadata(metaData.data);
        }
      } catch (err) {
        console.error('Failed to load careers:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Deep Link & URL Hash Synchronizer: Automatically open modal when target ID is detected
  useEffect(() => {
    const targetId = getTargetJobId();
    if (!targetId) {
      // If URL has no vacancy identifier, ensure modal is closed
      if (activeVacancy) setActiveVacancy(null);
      return;
    }

    // 1. Search in already loaded vacancies
    if (vacancies.length > 0) {
      const normalizedTarget = targetId.toLowerCase();
      const match = vacancies.find(
        (v) =>
          String(v.id) === targetId ||
          String(v.id).toLowerCase() === normalizedTarget ||
          v.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').includes(normalizedTarget)
      );
      if (match) {
        setActiveVacancy(match);
        return;
      }
    }

    // 2. If not found in loaded array (e.g. direct link or filtered), fetch individually from backend
    if (!loading) {
      fetch(`/api/public/careers/vacancies/${encodeURIComponent(targetId)}`)
        .then((res) => res.json())
        .then((json) => {
          if (json.success && json.data) {
            setActiveVacancy(json.data);
          }
        })
        .catch((err) => {
          console.warn('[Careers] Could not find requested vacancy by ID:', targetId, err);
        });
    }
  }, [loading, vacancies, getTargetJobId]);

  // Handle browser Back / Forward buttons (popstate & hashchange)
  useEffect(() => {
    const handlePopState = () => {
      const targetId = getTargetJobId();
      if (!targetId) {
        setActiveVacancy(null);
      } else if (vacancies.length > 0) {
        const match = vacancies.find((v) => String(v.id) === targetId);
        if (match) setActiveVacancy(match);
      }
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, [vacancies, getTargetJobId]);

  // Filtered Vacancies
  const filteredVacancies = useMemo(() => {
    return vacancies.filter((v) => {
      // Keyword search
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchesTitle = v.title.toLowerCase().includes(q);
        const matchesDept = (v.department || '').toLowerCase().includes(q);
        const matchesLoc = (v.location || '').toLowerCase().includes(q);
        const matchesDesc = (v.description || '').toLowerCase().includes(q);
        if (!matchesTitle && !matchesDept && !matchesLoc && !matchesDesc) {
          return false;
        }
      }

      // Country Filter
      if (selectedCountry !== 'all') {
        const countryMatch =
          v.countryCode?.toLowerCase() === selectedCountry.toLowerCase() ||
          (v.location || '').toLowerCase().includes(selectedCountry.toLowerCase());
        if (!countryMatch) return false;
      }

      // Department Filter
      if (selectedDepartment !== 'all') {
        if ((v.department || '').toLowerCase() !== selectedDepartment.toLowerCase()) {
          return false;
        }
      }

      // Employment Type Filter
      if (selectedType !== 'all') {
        if ((v.employmentType || '').toLowerCase() !== selectedType.toLowerCase()) {
          return false;
        }
      }

      return true;
    });
  }, [vacancies, searchTerm, selectedCountry, selectedDepartment, selectedType]);

  const hasActiveFilters =
    searchTerm.trim() !== '' ||
    selectedCountry !== 'all' ||
    selectedDepartment !== 'all' ||
    selectedType !== 'all';

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCountry('all');
    setSelectedDepartment('all');
    setSelectedType('all');
  };

  const handleShare = (vacancy: JobVacancy) => {
    const url = `${window.location.origin}/careers#${vacancy.id}`;
    navigator.clipboard.writeText(url);
    // Update address bar hash if not already synchronized
    if (typeof window !== 'undefined' && window.location.hash !== `#${vacancy.id}`) {
      window.history.replaceState({ modal: 'job', jobId: vacancy.id }, '', `/careers#${vacancy.id}`);
    }
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen">
      {/* 1. Hero Section */}
      <section className="relative bg-[#2A292D] text-white pt-24 pb-20 overflow-hidden">
        {/* Ambient background blur circles */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#3BBA93]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#3BBA93]/15 border border-[#3BBA93]/30 text-[#3BBA93] text-xs font-bold mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>We are hiring across Africa & the Middle East</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white max-w-3xl mx-auto leading-tight">
            Build the Future of <span className="text-[#3BBA93]">Pan-African Fintech</span>
          </h1>

          <p className="mt-5 text-sm sm:text-base text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Join AvadaPay as we scale enterprise payments, POS systems, and telecommunication gateways across 17+ African markets. Work with passionate, world-class builders.
          </p>

          {/* Quick Metrics Strip */}
          <div className="mt-10 max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
            <div className="p-3 text-center">
              <span className="text-2xl sm:text-3xl font-black text-[#3BBA93] block">
                {vacancies.length}+
              </span>
              <span className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider">
                Open Positions
              </span>
            </div>
            <div className="p-3 text-center border-l border-white/10">
              <span className="text-2xl sm:text-3xl font-black text-white block">
                17+
              </span>
              <span className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider">
                African Markets
              </span>
            </div>
            <div className="p-3 text-center border-l border-white/10">
              <span className="text-2xl sm:text-3xl font-black text-[#3BBA93] block">
                99.9%
              </span>
              <span className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider">
                Platform Uptime
              </span>
            </div>
            <div className="p-3 text-center border-l border-white/10">
              <span className="text-2xl sm:text-3xl font-black text-white block">
                4 Hubs
              </span>
              <span className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider">
                Global Offices
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Interactive Search & Multi-Facet Filters Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-5 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search Input */}
            <div className="relative">
              <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-1.5">
                Keyword or Title
              </label>
              <div className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <Input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="e.g. Sales, Accountant, CEO..."
                  className="pl-9 h-11 text-xs rounded-xl bg-gray-50/80 border-gray-200 focus:bg-white text-gray-800"
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Country / Hub Filter with Vector Country Flags */}
            <div>
              <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-1.5">
                Country & Office Hub
              </label>
              <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                <SelectTrigger className="h-11 rounded-xl bg-gray-50/80 border-gray-200 text-xs font-medium">
                  <SelectValue placeholder="All Countries" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    <span className="flex items-center space-x-2">
                      <Globe2 className="w-3.5 h-3.5 text-[#3BBA93]" />
                      <span>All Countries & Hubs</span>
                    </span>
                  </SelectItem>
                  <SelectItem value="rw">
                    <span className="flex items-center space-x-2">
                      <CountryFlag country="rw" className="w-4 h-3" />
                      <span>Rwanda (Kigali Hub)</span>
                    </span>
                  </SelectItem>
                  <SelectItem value="ke">
                    <span className="flex items-center space-x-2">
                      <CountryFlag country="ke" className="w-4 h-3" />
                      <span>Kenya (Nairobi Hub)</span>
                    </span>
                  </SelectItem>
                  <SelectItem value="tz">
                    <span className="flex items-center space-x-2">
                      <CountryFlag country="tz" className="w-4 h-3" />
                      <span>Tanzania (Dar es Salaam)</span>
                    </span>
                  </SelectItem>
                  <SelectItem value="cd">
                    <span className="flex items-center space-x-2">
                      <CountryFlag country="cd" className="w-4 h-3" />
                      <span>DRC (Congo / Kinshasa)</span>
                    </span>
                  </SelectItem>
                  <SelectItem value="ae">
                    <span className="flex items-center space-x-2">
                      <CountryFlag country="ae" className="w-4 h-3" />
                      <span>Dubai HQ (United Arab Emirates)</span>
                    </span>
                  </SelectItem>
                  <SelectItem value="remote">
                    <span className="flex items-center space-x-2">
                      <Globe2 className="w-3.5 h-3.5 text-blue-500" />
                      <span>Remote (Work from Anywhere)</span>
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Department Filter */}
            <div>
              <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-1.5">
                Department
              </label>
              <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                <SelectTrigger className="h-11 rounded-xl bg-gray-50/80 border-gray-200 text-xs font-medium">
                  <SelectValue placeholder="All Departments" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {metadata?.departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Employment Type Filter */}
            <div>
              <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-1.5">
                Employment Type
              </label>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="h-11 rounded-xl bg-gray-50/80 border-gray-200 text-xs font-medium">
                  <SelectValue placeholder="All Employment Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {metadata?.employmentTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Active Filter Indicators & Reset */}
          {hasActiveFilters && (
            <div className="mt-4 pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center space-x-2 text-gray-500">
                <span>Active filters:</span>
                {searchTerm && (
                  <Badge variant="secondary" className="text-[11px] font-medium">
                    Search: "{searchTerm}"
                  </Badge>
                )}
                {selectedCountry !== 'all' && (
                  <Badge variant="secondary" className="text-[11px] font-medium">
                    Country: {selectedCountry.toUpperCase()}
                  </Badge>
                )}
                {selectedDepartment !== 'all' && (
                  <Badge variant="secondary" className="text-[11px] font-medium">
                    Dept: {selectedDepartment}
                  </Badge>
                )}
                {selectedType !== 'all' && (
                  <Badge variant="secondary" className="text-[11px] font-medium">
                    Type: {selectedType}
                  </Badge>
                )}
              </div>

              <button
                type="button"
                onClick={resetFilters}
                className="text-xs font-bold text-[#3BBA93] hover:underline"
              >
                Reset all filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* 3. Open Positions List Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-8">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#2A292D] flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-[#3BBA93]" />
              <span>Available Career Openings</span>
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Showing <strong>{filteredVacancies.length}</strong> open positions across all AvadaPay operations.
            </p>
          </div>

          <span className="text-xs text-gray-400">
            {metadata?.lastSyncedAt
              ? `Synced with ATS: ${new Date(metadata.lastSyncedAt).toLocaleDateString()}`
              : 'Live ATS Connection'}
          </span>
        </div>

        {/* Vacancies Grid */}
        {loading ? (
          <div className="py-20 text-center text-gray-400">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-6 h-6 border-2 border-[#3BBA93] border-t-transparent rounded-full animate-spin" />
              <span className="text-xs font-medium">Loading open career positions...</span>
            </div>
          </div>
        ) : filteredVacancies.length === 0 ? (
          /* Empty Search Result */
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-200/80 p-8 shadow-xs">
            <div className="w-14 h-14 rounded-2xl bg-gray-50 text-gray-400 flex items-center justify-center mx-auto mb-4 border border-gray-100">
              <Briefcase className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-gray-800">No matching positions found</h3>
            <p className="text-xs text-gray-500 max-w-md mx-auto mt-1 leading-relaxed">
              We couldn't find any positions matching your selected filters. Try broadening your criteria or reset filters to see all available roles.
            </p>
            <div className="mt-5 flex justify-center gap-3">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={resetFilters}
                className="text-xs font-semibold rounded-xl"
              >
                Clear Filters
              </Button>
              <a href="mailto:careers@avadapay.com">
                <Button
                  type="button"
                  variant="gradient"
                  size="sm"
                  className="text-xs font-semibold rounded-xl space-x-1.5"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Send Speculative Application</span>
                </Button>
              </a>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVacancies.map((vacancy) => {
              const countryCode = vacancy.countryCode || 'remote';
              const isRemote = countryCode === 'remote' || vacancy.location?.toLowerCase().includes('remote');

              return (
                <Card
                  key={vacancy.id}
                  className="bg-white border-gray-200/90 hover:border-[#3BBA93]/60 shadow-xs hover:shadow-md transition-all rounded-xl overflow-hidden flex flex-col justify-between group"
                >
                  <div>
                    {/* Top Bar with Department & Flags */}
                    <div className="p-5 pb-3 border-b border-gray-100 flex items-start justify-between gap-3">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <Badge
                          variant="secondary"
                          className="bg-gray-100 text-gray-700 text-[10px] font-bold"
                        >
                          {vacancy.department || 'General'}
                        </Badge>
                        <Badge
                          variant="outline"
                          className="text-[10px] text-gray-500 border-gray-200"
                        >
                          {vacancy.employmentType}
                        </Badge>
                      </div>

                      <div className="flex items-center space-x-1.5 flex-shrink-0">
                        {!isRemote ? (
                          <CountryFlag country={countryCode} className="w-5 h-3.5" />
                        ) : (
                          <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                            Remote
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Role Title & Location */}
                    <div className="p-5 space-y-3">
                      <div>
                        <h3 className="font-bold text-base text-[#2A292D] group-hover:text-[#3BBA93] transition-colors line-clamp-2">
                          {vacancy.title}
                        </h3>
                        <p className="text-xs text-gray-500 flex items-center space-x-1.5 mt-1">
                          <MapPin className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                          <span>{vacancy.location || 'Remote'}</span>
                        </p>
                      </div>

                      {/* Excerpt / Overview snippet */}
                      <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed">
                        {vacancy.description
                          ? vacancy.description.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
                          : 'Join AvadaPay in driving our pan-African expansion and payments infrastructure.'}
                      </p>
                    </div>
                  </div>

                  {/* Card Bottom CTA */}
                  <div className="p-4 bg-gray-50/70 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-[11px] text-gray-400">
                      ID: #{vacancy.id}
                    </span>

                    <Button
                      type="button"
                      size="sm"
                      onClick={() => openVacancyModal(vacancy)}
                      variant="outline"
                      className="text-xs font-bold rounded-lg border-gray-200 hover:border-[#3BBA93] hover:text-[#3BBA93] space-x-1"
                    >
                      <span>View Position</span>
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </section>

      {/* 4. Why Build at AvadaPay Culture Section */}
      <section className="bg-white border-t border-gray-200/80 py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-[#3BBA93] block mb-2">
              Life at AvadaPay
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2A292D]">
              Why Top Builders Choose AvadaPay
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-2 leading-relaxed">
              We empower our teams with real ownership, competitive compensation, and the autonomy to solve real financial challenges across the African continent.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-gray-50/70 border border-gray-100 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#3BBA93]/15 text-[#3BBA93] flex items-center justify-center font-bold">
                <Globe2 className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-[#2A292D]">Pan-African Impact</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Connect millions of merchants, businesses, and everyday consumers to secure, licensed payment networks and mobile money switches across Africa.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-gray-50/70 border border-gray-100 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/15 text-blue-600 flex items-center justify-center font-bold">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-[#2A292D]">Rapid Career Velocity</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                We reward impact and execution over bureaucracy. Drive strategy, lead regional teams, and scale your career across an international fintech environment.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-gray-50/70 border border-gray-100 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/15 text-purple-600 flex items-center justify-center font-bold">
                <Shield className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-[#2A292D]">Executive & Relocation Support</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Competitive compensation with performance-based bonuses, relocation assistance for Dubai headquarters roles, and modern health coverage.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Detailed Vacancy Modal / Drawer */}
      {activeVacancy && (
        <Dialog open={Boolean(activeVacancy)} onOpenChange={(open) => !open && closeVacancyModal()}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-0 rounded-2xl border border-gray-100 [&>button]:text-white/80 [&>button]:hover:text-white [&>button]:top-5 [&>button]:right-5 [&>button]:w-8 [&>button]:h-8 [&>button]:rounded-full [&>button]:flex [&>button]:items-center [&>button]:justify-center [&>button]:bg-white/10 [&>button]:hover:bg-white/20 [&>button]:transition-all">
            {/* Header */}
            <DialogHeader className="p-6 pr-16 bg-[#2A292D] text-white relative">
              <div className="flex flex-wrap items-center gap-2.5">
                <Badge className="bg-[#3BBA93] text-white text-[11px] font-bold px-2.5 py-0.5">
                  {activeVacancy.department || 'General'}
                </Badge>
                <Badge className="bg-white/10 text-white text-[11px] border-white/20 px-2.5 py-0.5">
                  {activeVacancy.employmentType}
                </Badge>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleShare(activeVacancy)}
                  className="h-6 text-[11px] bg-white/10 hover:bg-white/20 border-white/20 text-white space-x-1.5 rounded-full px-3 transition-all"
                >
                  {copiedLink ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400 font-bold">Link Copied!</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-3 h-3 text-[#3BBA93]" />
                      <span>Share Role</span>
                    </>
                  )}
                </Button>
              </div>

              <DialogTitle className="text-xl sm:text-2xl font-bold text-white mt-3 leading-snug">
                {activeVacancy.title}
              </DialogTitle>

              <DialogDescription className="text-xs text-gray-300 flex items-center space-x-2 mt-1">
                <MapPin className="w-3.5 h-3.5 text-[#3BBA93]" />
                <span>{activeVacancy.location}</span>
                {activeVacancy.countryCode && (
                  <CountryFlag country={activeVacancy.countryCode} className="w-4 h-3 inline-block ml-1" />
                )}
              </DialogDescription>
            </DialogHeader>

            {/* Modal Body / Job Content */}
            <div className="p-6 space-y-6">
              {/* Top Action Bar */}
              <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="font-bold text-xs text-emerald-950">
                    Ready to take the next step in your career?
                  </h4>
                  <p className="text-[11px] text-emerald-800 mt-0.5">
                    Submit your application directly through our PeopleForce recruitment portal.
                  </p>
                </div>

                <a
                  href={activeVacancy.applyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block"
                >
                  <Button
                    type="button"
                    variant="gradient"
                    size="sm"
                    className="rounded-xl font-bold text-xs space-x-1.5 shadow-sm whitespace-nowrap"
                  >
                    <span>Apply on PeopleForce</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Button>
                </a>
              </div>

              {/* Formatted HTML Description */}
              <div className="prose prose-sm max-w-none text-xs text-gray-700 leading-relaxed space-y-3 font-sans">
                <div
                  className="vacancy-content [&>strong]:text-[#2A292D] [&>strong]:block [&>strong]:mt-4 [&>strong]:mb-1 [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:space-y-1 [&>p]:mb-3"
                  dangerouslySetInnerHTML={{ __html: activeVacancy.description }}
                />
              </div>
            </div>

            {/* Footer */}
            <div className="p-5 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
              <span className="text-[11px] text-gray-400">
                Official AvadaPay Job Posting • PeopleForce ATS Verified
              </span>

              <div className="flex items-center space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleShare(activeVacancy)}
                  className="rounded-xl text-xs font-semibold space-x-1.5 border-gray-200"
                >
                  <Share2 className="w-3.5 h-3.5 text-[#3BBA93]" />
                  <span>{copiedLink ? 'Link Copied!' : 'Share Position'}</span>
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => closeVacancyModal()}
                  className="rounded-xl text-xs font-semibold"
                >
                  Close
                </Button>

                <a
                  href={activeVacancy.applyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    type="button"
                    variant="gradient"
                    size="sm"
                    className="rounded-xl font-bold text-xs space-x-1.5"
                  >
                    <span>Apply Now</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Button>
                </a>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};
