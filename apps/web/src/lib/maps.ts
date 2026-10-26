/**
 * Utility functions for Google Maps URL resolution and embeds.
 */

/**
 * Resolves a user-provided location string, Google Maps link, or iframe embed code
 * into a clean, embeddable Google Maps iframe src URL.
 *
 * Supports:
 * - Plain street addresses, buildings, or city names (e.g. "Kigali Heights, Kigali, Rwanda")
 * - Full Google Maps <iframe> embed snippet (extracts the src)
 * - Google Maps share URLs (extracts query parameter or place name)
 * - Existing Google Maps embed URLs
 */
export function resolveMapEmbedUrl(
  input?: string | null,
  fallbackQuery?: string | null
): string {
  const trimmed = (input || '').trim();

  // 1. If empty, fall back to fallbackQuery (e.g. officeAddress)
  if (!trimmed) {
    if (fallbackQuery && fallbackQuery.trim()) {
      return `https://maps.google.com/maps?q=${encodeURIComponent(fallbackQuery.trim())}&output=embed`;
    }
    return '';
  }

  // 2. Full iframe snippet: <iframe ... src="..." ...>
  if (trimmed.includes('<iframe')) {
    const srcMatch = trimmed.match(/src=["']([^"']+)["']/i);
    if (srcMatch && srcMatch[1]) {
      return srcMatch[1];
    }
  }

  // 3. Already a Google Maps embed URL
  if (trimmed.includes('/maps/embed') || trimmed.includes('output=embed')) {
    return trimmed;
  }

  // 4. Google Maps link with /place/Location+Name
  const placeMatch = trimmed.match(/maps\/(?:search|place)\/([^/@?]+)/i);
  if (placeMatch && placeMatch[1]) {
    const place = decodeURIComponent(placeMatch[1].replace(/\+/g, ' '));
    return `https://maps.google.com/maps?q=${encodeURIComponent(place)}&output=embed`;
  }

  // 5. Google Maps URL with ?q=...
  if (trimmed.includes('google.com/maps') || trimmed.includes('maps.google.com')) {
    try {
      const url = new URL(trimmed);
      const q = url.searchParams.get('q') || url.searchParams.get('query');
      if (q) {
        return `https://maps.google.com/maps?q=${encodeURIComponent(q)}&output=embed`;
      }
    } catch {
      // Continue to query formatting
    }
  }

  // 6. Generic web URL that is not plain text
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  // 7. Plain text location / address (e.g. "Kigali Heights, Kigali" or "Plot 14 Jinja Road")
  return `https://maps.google.com/maps?q=${encodeURIComponent(trimmed)}&output=embed`;
}

/**
 * Returns a direct Google Maps external link for opening the location in a new browser tab.
 */
export function getMapExternalLink(locationOrEmbedUrl?: string | null): string {
  if (!locationOrEmbedUrl) return '';
  const trimmed = locationOrEmbedUrl.trim();
  if (trimmed.includes('output=embed')) {
    try {
      const url = new URL(trimmed);
      const q = url.searchParams.get('q');
      if (q) return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
    } catch {
      // fallback
    }
  }
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(trimmed)}`;
}
