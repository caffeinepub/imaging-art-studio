// Single source of truth for site-visible searchable content

export interface SearchableService {
  id: string;
  title: string;
  description: string;
  keywords: string[];
}

export interface SearchablePortfolioItem {
  id: string;
  title: string;
  category: string;
  image: string;
  keywords: string[];
}

export interface SearchableSection {
  id: string;
  title: string;
  keywords: string[];
}

export const SERVICES: SearchableService[] = [
  {
    id: 'service-wedding',
    title: 'Wedding Photography',
    description: 'Capture every precious moment of your special day with our comprehensive wedding photography packages.',
    keywords: ['wedding', 'marriage', 'bride', 'groom', 'ceremony', 'reception', 'special day'],
  },
  {
    id: 'service-portrait',
    title: 'Portrait Photography',
    description: 'Professional portraits that showcase your personality and style, perfect for individuals and families.',
    keywords: ['portrait', 'headshot', 'family', 'individual', 'professional', 'personal'],
  },
  {
    id: 'service-event',
    title: 'Event Photography',
    description: 'From corporate events to celebrations, we document your occasions with creativity and professionalism.',
    keywords: ['event', 'corporate', 'celebration', 'party', 'conference', 'gathering'],
  },
  {
    id: 'service-product',
    title: 'Product Photography',
    description: 'High-quality product images that elevate your brand and drive sales with stunning visual appeal.',
    keywords: ['product', 'commercial', 'brand', 'ecommerce', 'catalog', 'merchandise'],
  },
  {
    id: 'service-outdoor',
    title: 'Outdoor Shoots',
    description: 'Breathtaking outdoor photography sessions in scenic locations, capturing natural beauty and authentic moments.',
    keywords: ['outdoor', 'nature', 'landscape', 'scenic', 'natural', 'location'],
  },
  {
    id: 'service-prewedding',
    title: 'Pre-Wedding Shoots',
    description: 'Romantic and creative pre-wedding photography that tells your unique love story in stunning frames.',
    keywords: ['pre-wedding', 'prewedding', 'engagement', 'couple', 'romantic', 'love story'],
  },
];

export const PORTFOLIO_ITEMS: SearchablePortfolioItem[] = [
  {
    id: 'portfolio-01',
    title: 'Wedding Moments',
    category: 'Wedding',
    image: '/assets/generated/portfolio-01.dim_1200x800.png',
    keywords: ['wedding', 'ceremony', 'bride', 'groom', 'celebration'],
  },
  {
    id: 'portfolio-02',
    title: 'Studio Portraits',
    category: 'Portrait',
    image: '/assets/generated/portfolio-02.dim_1200x800.png',
    keywords: ['portrait', 'studio', 'professional', 'headshot'],
  },
  {
    id: 'portfolio-03',
    title: 'Event Highlights',
    category: 'Event',
    image: '/assets/generated/portfolio-03.dim_1200x800.png',
    keywords: ['event', 'corporate', 'party', 'celebration'],
  },
  {
    id: 'portfolio-04',
    title: 'Product Showcase',
    category: 'Product',
    image: '/assets/generated/portfolio-04.dim_1200x800.png',
    keywords: ['product', 'commercial', 'brand', 'showcase'],
  },
  {
    id: 'portfolio-05',
    title: 'Family Memories',
    category: 'Portrait',
    image: '/assets/generated/portfolio-05.dim_1200x800.png',
    keywords: ['family', 'portrait', 'memories', 'group'],
  },
  {
    id: 'portfolio-06',
    title: 'Pre-Wedding Story',
    category: 'Pre-Wedding',
    image: '/assets/generated/portfolio-06.dim_1200x800.png',
    keywords: ['pre-wedding', 'couple', 'romantic', 'engagement'],
  },
];

export const SECTIONS: SearchableSection[] = [
  {
    id: 'services',
    title: 'Services',
    keywords: ['services', 'offerings', 'what we do', 'photography services'],
  },
  {
    id: 'portfolio',
    title: 'Portfolio',
    keywords: ['portfolio', 'gallery', 'work', 'examples', 'photos'],
  },
  {
    id: 'about',
    title: 'About',
    keywords: ['about', 'studio', 'prayagraj', 'team', 'story', 'who we are'],
  },
  {
    id: 'testimonials',
    title: 'Testimonials',
    keywords: ['testimonials', 'reviews', 'feedback', 'clients', 'ratings'],
  },
  {
    id: 'contact',
    title: 'Contact',
    keywords: ['contact', 'book', 'inquiry', 'reach us', 'get in touch'],
  },
];
