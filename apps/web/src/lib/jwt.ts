export interface DecodedJwtPayload {
  id?: string;
  email?: string;
  exp?: number;
  iat?: number;
  [key: string]: unknown;
}

/**
 * Safely decodes the payload portion of a JWT without external libraries.
 * Handles URL-safe base64, proper padding, and UTF-8 characters.
 */
export function decodeJwtPayload(token: string): DecodedJwtPayload | null {
  if (!token || typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;

  try {
    let base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4 !== 0) {
      base64 += '=';
    }
    const decodedStr = atob(base64);
    const jsonStr = decodeURIComponent(
      decodedStr
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonStr) as DecodedJwtPayload;
  } catch {
    return null;
  }
}

/**
 * Checks whether a given JWT token is expired.
 * Includes a buffer in seconds (default 10s) to avoid edge-case race conditions.
 */
export function isTokenExpired(token: string | null | undefined, bufferSeconds = 10): boolean {
  if (!token) return true;
  const payload = decodeJwtPayload(token);
  if (!payload) return true;
  if (!payload.exp) return false;

  const currentTimeSeconds = Math.floor(Date.now() / 1000);
  return currentTimeSeconds >= payload.exp - bufferSeconds;
}

/**
 * Returns the expiration Date of a JWT token, or null if invalid / no expiry claim.
 */
export function getTokenExpirationDate(token: string | null | undefined): Date | null {
  if (!token) return null;
  const payload = decodeJwtPayload(token);
  if (!payload || !payload.exp) return null;
  return new Date(payload.exp * 1000);
}
