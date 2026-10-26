/**
 * Auth HTTP Interceptor & Session Expiration Dispatcher
 *
 * Catches 401 Unauthorized responses across all fetch calls in the CMS,
 * clears stale authentication credentials, notifies the AuthContext,
 * and seamlessly navigates the user to the login screen with clear feedback.
 */

export const AUTH_EXPIRED_EVENT = 'avada:auth:expired';
export const AUTH_NOTICE_STORAGE_KEY = 'avada_auth_notice';

export interface SessionExpiredEventDetail {
  reason: string;
  url?: string;
  timestamp: number;
}

let isInterceptorInstalled = false;

/**
 * Stores a flash notice for the login page explaining why the user was logged out.
 */
export function setSessionNotice(message: string): void {
  try {
    sessionStorage.setItem(AUTH_NOTICE_STORAGE_KEY, message);
  } catch {
    // Ignore storage quota or disabled sessionStorage errors
  }
}

/**
 * Retrieves and clears the flash notice for the login page.
 */
export function getAndClearSessionNotice(): string | null {
  try {
    const notice = sessionStorage.getItem(AUTH_NOTICE_STORAGE_KEY);
    if (notice) {
      sessionStorage.removeItem(AUTH_NOTICE_STORAGE_KEY);
      return notice;
    }
  } catch {
    // Ignore storage errors
  }
  return null;
}

/**
 * Dispatches a global session expired event to synchronize React state and storage.
 */
export function notifySessionExpired(
  reason = 'Your session has expired. Please sign in again.',
  url?: string
): void {
  setSessionNotice(reason);

  if (typeof window !== 'undefined') {
    const detail: SessionExpiredEventDetail = {
      reason,
      url,
      timestamp: Date.now(),
    };

    window.dispatchEvent(
      new CustomEvent<SessionExpiredEventDetail>(AUTH_EXPIRED_EVENT, { detail })
    );
  }
}

/**
 * Installs a zero-overhead window.fetch interceptor that automatically catches
 * 401 Unauthorized responses from backend API endpoints and triggers session expiration.
 */
export function installAuthFetchInterceptor(): void {
  if (typeof window === 'undefined' || isInterceptorInstalled) {
    return;
  }

  const originalFetch = window.fetch;

  window.fetch = async function (...args: Parameters<typeof fetch>): Promise<Response> {
    const response = await originalFetch.apply(this, args);

    // Check for 401 Unauthorized
    if (response.status === 401) {
      const input = args[0];
      const url =
        typeof input === 'string'
          ? input
          : input instanceof Request
          ? input.url
          : String(input);

      // We explicitly do NOT intercept /api/auth/login failures because invalid credentials
      // should be displayed directly by the login page form error state.
      const isLoginEndpoint = url.includes('/api/auth/login');

      // Only intercept backend API endpoints
      const isApiEndpoint = url.includes('/api/');

      if (!isLoginEndpoint && isApiEndpoint) {
        notifySessionExpired(
          'Your session has expired. Please sign in again to continue.',
          url
        );
      }
    }

    return response;
  };

  isInterceptorInstalled = true;
}
