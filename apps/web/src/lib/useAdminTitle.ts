import { useEffect } from 'react';

/**
 * Hook to set the document.title for CMS Administration pages and enforce noindex.
 */
export function useAdminTitle(title?: string): void {
  useEffect(() => {
    const formatted = title
      ? title.toLowerCase().includes('avadapay')
        ? title
        : `${title} | AvadaPay CMS`
      : 'Administration Portal | AvadaPay CMS';

    document.title = formatted;

    // Enforce noindex on administrative portals
    if (typeof document !== 'undefined') {
      let metaRobots = document.querySelector('meta[name="robots"]') as HTMLMetaElement | null;
      if (!metaRobots) {
        metaRobots = document.createElement('meta');
        metaRobots.name = 'robots';
        document.head.appendChild(metaRobots);
      }
      metaRobots.content = 'noindex, nofollow';
    }
  }, [title]);
}
