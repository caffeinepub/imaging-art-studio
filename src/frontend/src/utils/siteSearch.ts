import { SERVICES, PORTFOLIO_ITEMS, SECTIONS } from '@/content/siteContent';

export interface SearchResult {
  type: 'service' | 'portfolio' | 'section';
  id: string;
  title: string;
  label: string;
  sectionId: string;
  category?: string;
  itemId?: string;
}

/**
 * Performs case-insensitive search across site content
 * @param query - Search query string
 * @returns Array of matching search results
 */
export function searchSiteContent(query: string): SearchResult[] {
  if (!query || query.trim().length === 0) {
    return [];
  }

  const normalizedQuery = query.toLowerCase().trim();
  const results: SearchResult[] = [];

  // Search services
  SERVICES.forEach((service) => {
    const searchableText = [
      service.title,
      service.description,
      ...service.keywords,
    ].join(' ').toLowerCase();

    if (searchableText.includes(normalizedQuery)) {
      results.push({
        type: 'service',
        id: service.id,
        title: service.title,
        label: `Service: ${service.title}`,
        sectionId: 'services',
        itemId: service.id,
      });
    }
  });

  // Search portfolio items
  PORTFOLIO_ITEMS.forEach((item) => {
    const searchableText = [
      item.title,
      item.category,
      ...item.keywords,
    ].join(' ').toLowerCase();

    if (searchableText.includes(normalizedQuery)) {
      results.push({
        type: 'portfolio',
        id: item.id,
        title: item.title,
        label: `Portfolio: ${item.title}`,
        sectionId: 'portfolio',
        category: item.category,
        itemId: item.id,
      });
    }
  });

  // Search sections
  SECTIONS.forEach((section) => {
    const searchableText = [
      section.title,
      ...section.keywords,
    ].join(' ').toLowerCase();

    if (searchableText.includes(normalizedQuery)) {
      results.push({
        type: 'section',
        id: section.id,
        title: section.title,
        label: `Section: ${section.title}`,
        sectionId: section.id,
      });
    }
  });

  return results;
}
