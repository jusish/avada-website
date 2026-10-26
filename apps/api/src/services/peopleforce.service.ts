import { prisma } from '../prisma';
import { IntegrationLogger } from './integration-logger';

export interface PeopleForceConfig {
  apiKey: string;
  baseUrl: string;
  autoSync?: boolean;
  syncIntervalMinutes?: number;
}

export interface VacancyQueryFilters {
  search?: string;
  country?: string;
  department?: string;
  employmentType?: string;
}

/**
 * Normalizes location strings to ISO country codes for vector flag display
 */
export function inferCountryCode(location?: string | null): string {
  if (!location) return 'remote';
  const loc = location.toLowerCase();

  if (loc.includes('rwanda') || loc.includes('kigali')) return 'rw';
  if (loc.includes('kenya') || loc.includes('nairobi')) return 'ke';
  if (loc.includes('tanzania') || loc.includes('dar es salaam')) return 'tz';
  if (loc.includes('congo') || loc.includes('drc') || loc.includes('kinshasa') || loc.includes('brazzaville')) return 'cd';
  if (loc.includes('dubai') || loc.includes('uae') || loc.includes('emirates')) return 'ae';
  if (loc.includes('benin') || loc.includes('cotonou')) return 'bj';
  if (loc.includes('togo') || loc.includes('lome') || loc.includes('lomé')) return 'tg';
  if (loc.includes('remote')) return 'remote';

  return 'global';
}

export class PeopleForceService {
  private static readonly INTEGRATION_KEY = 'peopleforce';
  private static readonly DEFAULT_BASE_URL = 'https://app.peopleforce.io/api/careers/v1';

  /**
   * Retrieves current PeopleForce configuration from database
   */
  static async getConfig(): Promise<{ integrationId: string; enabled: boolean; config: PeopleForceConfig }> {
    const integration = await prisma.integration.findUnique({
      where: { key: this.INTEGRATION_KEY },
    });

    if (!integration) {
      throw new Error('PeopleForce integration is not registered in the database. Run pnpm db:seed.');
    }

    const rawConfig = (integration.config as Record<string, unknown>) || {};
    const apiKey = (rawConfig.apiKey as string) || process.env.PEOPLEFORCE_API_KEY || '';
    const baseUrl = (rawConfig.baseUrl as string) || this.DEFAULT_BASE_URL;

    return {
      integrationId: integration.id,
      enabled: integration.enabled,
      config: {
        apiKey,
        baseUrl: baseUrl.replace(/\/+$/, ''),
        autoSync: typeof rawConfig.autoSync === 'boolean' ? rawConfig.autoSync : true,
        syncIntervalMinutes: typeof rawConfig.syncIntervalMinutes === 'number' ? rawConfig.syncIntervalMinutes : 60,
      },
    };
  }

  /**
   * Updates PeopleForce configuration in database
   */
  static async updateConfig(updates: Partial<PeopleForceConfig> & { enabled?: boolean }) {
    const current = await this.getConfig();
    const newConfig: PeopleForceConfig = {
      ...current.config,
      ...updates,
    };

    const updated = await prisma.integration.update({
      where: { key: this.INTEGRATION_KEY },
      data: {
        enabled: updates.enabled !== undefined ? updates.enabled : current.enabled,
        config: newConfig as object,
      },
    });

    return updated;
  }

  /**
   * Executes a live health check ping against PeopleForce API and logs the attempt
   */
  static async testHealth(): Promise<{
    healthy: boolean;
    latencyMs: number;
    statusCode: number;
    status: 'HEALTHY' | 'DEGRADED' | 'DISCONNECTED' | 'ERROR';
    message: string;
    totalVacancies?: number;
  }> {
    const { integrationId, config } = await this.getConfig();

    if (!config.apiKey) {
      const result = {
        healthy: false,
        latencyMs: 0,
        statusCode: 400,
        status: 'DISCONNECTED' as const,
        message: 'No PeopleForce Careers API key configured in database.',
      };

      await prisma.integration.update({
        where: { key: this.INTEGRATION_KEY },
        data: {
          status: 'DISCONNECTED',
          lastHealthCheck: new Date(),
          healthMessage: result.message,
          latencyMs: 0,
        },
      });

      return result;
    }

    const testUrl = `${config.baseUrl}/vacancies?per_page=1`;
    const startTime = Date.now();

    try {
      const response = await fetch(testUrl, {
        method: 'GET',
        headers: {
          'X-API-KEY': config.apiKey,
          Accept: 'application/json',
        },
      });

      const durationMs = Date.now() - startTime;
      const resJson = await response.json().catch(() => null);

      const isSuccess = response.ok;
      const status = isSuccess ? 'HEALTHY' : response.status >= 500 ? 'ERROR' : 'DEGRADED';
      const totalVacancies = resJson?.metadata?.total_count ?? (Array.isArray(resJson?.data) ? resJson.data.length : 0);

      const message = isSuccess
        ? `Connection verified successfully (${durationMs}ms, ${totalVacancies} positions available)`
        : `PeopleForce API returned HTTP ${response.status}: ${response.statusText}`;

      // Record to Integration Log
      await IntegrationLogger.logCall({
        integrationKey: this.INTEGRATION_KEY,
        integrationId,
        method: 'GET',
        endpoint: '/vacancies?per_page=1 (health check)',
        url: testUrl,
        requestHeaders: { 'X-API-KEY': config.apiKey, Accept: 'application/json' },
        responseStatus: response.status,
        responsePayload: resJson,
        durationMs,
        status: isSuccess ? 'SUCCESS' : 'ERROR',
        errorMessage: isSuccess ? null : message,
      });

      // Update Integration health record
      await prisma.integration.update({
        where: { key: this.INTEGRATION_KEY },
        data: {
          status,
          latencyMs: durationMs,
          lastHealthCheck: new Date(),
          healthMessage: message,
        },
      });

      return {
        healthy: isSuccess,
        latencyMs: durationMs,
        statusCode: response.status,
        status,
        message,
        totalVacancies,
      };
    } catch (err: unknown) {
      const durationMs = Date.now() - startTime;
      const errorMsg = err instanceof Error ? err.message : 'Network connection failure';

      await IntegrationLogger.logCall({
        integrationKey: this.INTEGRATION_KEY,
        integrationId,
        method: 'GET',
        endpoint: '/vacancies?per_page=1 (health check)',
        url: testUrl,
        requestHeaders: { 'X-API-KEY': config.apiKey },
        responseStatus: 0,
        responsePayload: null,
        durationMs,
        status: 'ERROR',
        errorMessage: errorMsg,
      });

      await prisma.integration.update({
        where: { key: this.INTEGRATION_KEY },
        data: {
          status: 'ERROR',
          latencyMs: durationMs,
          lastHealthCheck: new Date(),
          healthMessage: errorMsg,
        },
      });

      return {
        healthy: false,
        latencyMs: durationMs,
        statusCode: 0,
        status: 'ERROR',
        message: errorMsg,
      };
    }
  }

  /**
   * Synchronizes all open vacancies from PeopleForce ATS into local database
   */
  static async syncVacancies(): Promise<{
    syncedCount: number;
    deactivatedCount: number;
    totalActive: number;
    latencyMs: number;
  }> {
    const { integrationId, config } = await this.getConfig();

    if (!config.apiKey) {
      throw new Error('Cannot sync: PeopleForce API key is missing.');
    }

    const syncUrl = `${config.baseUrl}/vacancies?per_page=100`;
    const startTime = Date.now();

    const response = await fetch(syncUrl, {
      method: 'GET',
      headers: {
        'X-API-KEY': config.apiKey,
        Accept: 'application/json',
      },
    });

    const durationMs = Date.now() - startTime;
    const resData = await response.json();

    await IntegrationLogger.logCall({
      integrationKey: this.INTEGRATION_KEY,
      integrationId,
      method: 'GET',
      endpoint: '/vacancies?per_page=100 (sync)',
      url: syncUrl,
      requestHeaders: { 'X-API-KEY': config.apiKey, Accept: 'application/json' },
      responseStatus: response.status,
      responsePayload: resData,
      durationMs,
      status: response.ok ? 'SUCCESS' : 'ERROR',
      errorMessage: response.ok ? null : `Sync failed with status ${response.status}`,
    });

    if (!response.ok || !Array.isArray(resData?.data)) {
      throw new Error(resData?.message || `PeopleForce API returned HTTP ${response.status}`);
    }

    const vacancies = resData.data as Array<{
      id: number | string;
      title: string;
      description?: string;
      department?: string;
      location?: string;
      employment_type?: string;
      apply_url?: string;
    }>;

    const activeIds: string[] = [];

    for (const v of vacancies) {
      const strId = String(v.id);
      activeIds.push(strId);
      const countryCode = inferCountryCode(v.location);

      await prisma.jobVacancy.upsert({
        where: { id: strId },
        update: {
          title: v.title,
          description: v.description || '',
          department: v.department || 'General',
          location: v.location || 'Remote',
          countryCode,
          employmentType: v.employment_type || 'Full-time',
          applyUrl: v.apply_url || `https://avadapay.peopleforce.io/careers/v/${strId}`,
          active: true,
          rawPayload: v as object,
          syncedAt: new Date(),
        },
        create: {
          id: strId,
          title: v.title,
          description: v.description || '',
          department: v.department || 'General',
          location: v.location || 'Remote',
          countryCode,
          employmentType: v.employment_type || 'Full-time',
          applyUrl: v.apply_url || `https://avadapay.peopleforce.io/careers/v/${strId}`,
          active: true,
          rawPayload: v as object,
          syncedAt: new Date(),
        },
      });
    }

    // Deactivate vacancies no longer present in PeopleForce
    const deactivation = await prisma.jobVacancy.updateMany({
      where: {
        id: { notIn: activeIds },
        active: true,
      },
      data: {
        active: false,
      },
    });

    // Update integration last sync timestamp
    await prisma.integration.update({
      where: { key: this.INTEGRATION_KEY },
      data: {
        lastSyncAt: new Date(),
        status: 'HEALTHY',
        healthMessage: `Successfully synchronized ${vacancies.length} positions.`,
      },
    });

    return {
      syncedCount: vacancies.length,
      deactivatedCount: deactivation.count,
      totalActive: vacancies.length,
      latencyMs: durationMs,
    };
  }

  /**
   * Retrieves active vacancies from database with rich search & multi-facet filtering
   */
  static async getVacancies(filters: VacancyQueryFilters = {}) {
    // If no vacancies in DB yet, trigger initial sync
    const count = await prisma.jobVacancy.count();
    if (count === 0) {
      try {
        await this.syncVacancies();
      } catch (err) {
        console.warn('Initial vacancy sync deferred:', err);
      }
    }

    const where: Record<string, unknown> = { active: true };

    if (filters.search && filters.search.trim()) {
      const q = filters.search.trim();
      where.OR = [
        { title: { contains: q, mode: 'insensitive' } },
        { department: { contains: q, mode: 'insensitive' } },
        { location: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
      ];
    }

    if (filters.country && filters.country !== 'all') {
      const c = filters.country.toLowerCase();
      where.OR = [
        { countryCode: c },
        { location: { contains: c, mode: 'insensitive' } },
      ];
    }

    if (filters.department && filters.department !== 'all') {
      where.department = { equals: filters.department, mode: 'insensitive' };
    }

    if (filters.employmentType && filters.employmentType !== 'all') {
      where.employmentType = { equals: filters.employmentType, mode: 'insensitive' };
    }

    const vacancies = await prisma.jobVacancy.findMany({
      where,
      orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
    });

    return vacancies;
  }

  /**
   * Retrieves single vacancy by ID
   */
  static async getVacancyById(id: string) {
    let vacancy = await prisma.jobVacancy.findUnique({
      where: { id },
    });

    // If not found in DB, try fetching directly from PeopleForce API
    if (!vacancy) {
      try {
        const { config, integrationId } = await this.getConfig();
        const singleUrl = `${config.baseUrl}/vacancies/${id}`;
        const startTime = Date.now();

        const response = await fetch(singleUrl, {
          headers: { 'X-API-KEY': config.apiKey, Accept: 'application/json' },
        });

        const durationMs = Date.now() - startTime;
        const resJson = await response.json();

        await IntegrationLogger.logCall({
          integrationKey: this.INTEGRATION_KEY,
          integrationId,
          method: 'GET',
          endpoint: `/vacancies/${id}`,
          url: singleUrl,
          requestHeaders: { 'X-API-KEY': config.apiKey },
          responseStatus: response.status,
          responsePayload: resJson,
          durationMs,
          status: response.ok ? 'SUCCESS' : 'ERROR',
        });

        if (response.ok && resJson?.data) {
          const v = resJson.data;
          const countryCode = inferCountryCode(v.location);

          vacancy = await prisma.jobVacancy.create({
            data: {
              id: String(v.id),
              title: v.title,
              description: v.description || '',
              department: v.department || 'General',
              location: v.location || 'Remote',
              countryCode,
              employmentType: v.employment_type || 'Full-time',
              applyUrl: v.apply_url || `https://avadapay.peopleforce.io/careers/v/${id}`,
              active: true,
              rawPayload: v as object,
            },
          });
        }
      } catch (err) {
        console.error(`Failed to fetch individual vacancy ${id}:`, err);
      }
    }

    return vacancy;
  }

  /**
   * Retrieves dynamic filter options (departments, countries, employment types)
   */
  static async getMetadata() {
    const activeVacancies = await prisma.jobVacancy.findMany({
      where: { active: true },
      select: {
        department: true,
        location: true,
        countryCode: true,
        employmentType: true,
      },
    });

    const departmentsSet = new Set<string>();
    const locationsMap = new Map<string, string>();
    const employmentTypesSet = new Set<string>();

    activeVacancies.forEach((v) => {
      if (v.department) departmentsSet.add(v.department);
      if (v.employmentType) employmentTypesSet.add(v.employmentType);
      if (v.location) {
        locationsMap.set(v.location, v.countryCode || inferCountryCode(v.location));
      }
    });

    const integration = await prisma.integration.findUnique({
      where: { key: this.INTEGRATION_KEY },
      select: { lastSyncAt: true },
    });

    return {
      totalCount: activeVacancies.length,
      departments: Array.from(departmentsSet).sort(),
      locations: Array.from(locationsMap.entries()).map(([name, countryCode]) => ({
        name,
        countryCode,
      })),
      employmentTypes: Array.from(employmentTypesSet).sort(),
      lastSyncedAt: integration?.lastSyncAt?.toISOString() || null,
    };
  }
}
