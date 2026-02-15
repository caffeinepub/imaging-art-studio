// Stable behavior event identifiers and helpers

export const BEHAVIOR_EVENT_TYPES = {
  VIEW: 'view',
  CLICK: 'click',
} as const;

export const BEHAVIOR_ACTIONS = {
  // Navigation views
  VIEW_HERO: 'view-hero',
  VIEW_SERVICES: 'view-services',
  VIEW_PORTFOLIO: 'view-portfolio',
  VIEW_ABOUT: 'view-about',
  VIEW_TESTIMONIALS: 'view-testimonials',
  VIEW_CONTACT: 'view-contact',
  VIEW_BOOKINGS: 'view-bookings',
  VIEW_SEARCH_ANALYTICS: 'view-search-analytics',
  VIEW_FEEDBACK_REVIEW: 'view-feedback-review',
  VIEW_BEHAVIOR_ANALYTICS: 'view-behavior-analytics',
  
  // CTA clicks
  CLICK_HEADER_BOOK_NOW: 'click-header-book-now',
  CLICK_HERO_BOOK_SHOOT: 'click-hero-book-shoot',
  CLICK_HERO_VIEW_PORTFOLIO: 'click-hero-view-portfolio',
  CLICK_PORTFOLIO_ITEM: 'click-portfolio-item',
} as const;

export type BehaviorEventType = typeof BEHAVIOR_EVENT_TYPES[keyof typeof BEHAVIOR_EVENT_TYPES];
export type BehaviorAction = typeof BEHAVIOR_ACTIONS[keyof typeof BEHAVIOR_ACTIONS];

/**
 * Format event details as JSON string for consistent storage
 */
export function formatEventDetails(details: Record<string, unknown>): string {
  try {
    return JSON.stringify(details);
  } catch {
    return '{}';
  }
}

/**
 * Parse event details from JSON string
 */
export function parseEventDetails(details: string): Record<string, unknown> {
  try {
    return JSON.parse(details);
  } catch {
    return {};
  }
}
