import { useState, useMemo } from 'react';
import { LightboxModal } from '../portfolio/LightboxModal';
import { PortfolioFilters } from '../portfolio/PortfolioFilters';

const portfolioItems = [
  {
    image: '/assets/generated/portfolio-01.dim_1200x800.png',
    title: 'Wedding Moments',
    category: 'Wedding',
  },
  {
    image: '/assets/generated/portfolio-02.dim_1200x800.png',
    title: 'Studio Portraits',
    category: 'Portrait',
  },
  {
    image: '/assets/generated/portfolio-03.dim_1200x800.png',
    title: 'Event Highlights',
    category: 'Event',
  },
  {
    image: '/assets/generated/portfolio-04.dim_1200x800.png',
    title: 'Product Showcase',
    category: 'Product',
  },
  {
    image: '/assets/generated/portfolio-05.dim_1200x800.png',
    title: 'Family Memories',
    category: 'Portrait',
  },
  {
    image: '/assets/generated/portfolio-06.dim_1200x800.png',
    title: 'Pre-Wedding Story',
    category: 'Pre-Wedding',
  },
];

export function PortfolioSection() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Derive unique categories from portfolio items
  const categories = useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(portfolioItems.map((item) => item.category))
    );
    return uniqueCategories.sort();
  }, []);

  // Filter items based on selected category
  const filteredItems = useMemo(() => {
    if (selectedCategory === 'All') {
      return portfolioItems;
    }
    return portfolioItems.filter((item) => item.category === selectedCategory);
  }, [selectedCategory]);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const goToNext = () => {
    if (lightboxIndex < filteredItems.length - 1) {
      setLightboxIndex(lightboxIndex + 1);
    }
  };

  const goToPrevious = () => {
    if (lightboxIndex > 0) {
      setLightboxIndex(lightboxIndex - 1);
    }
  };

  return (
    <section id="portfolio" className="py-24 md:py-32 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-serif text-4xl md:text-5xl font-light mb-6">
            Our Portfolio
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Explore our collection of captured moments, each telling a unique story through the art of photography.
          </p>
        </div>

        {/* Category filters */}
        <PortfolioFilters
          categories={categories}
          selectedCategory={selectedCategory}
          onChange={setSelectedCategory}
        />

        {/* Portfolio grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item, index) => (
            <button
              key={`${item.category}-${index}`}
              onClick={() => openLightbox(index)}
              className="group relative overflow-hidden bg-card aspect-[3/2] cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background transition-all"
              aria-label={`View ${item.title}`}
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <span className="inline-block px-3 py-1 bg-accent/20 text-accent text-xs font-medium mb-2 backdrop-blur-sm">
                    {item.category}
                  </span>
                  <h3 className="font-serif text-xl font-normal text-foreground">
                    {item.title}
                  </h3>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Show message when no items match filter */}
        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No items found in this category.
            </p>
          </div>
        )}
      </div>

      {/* Lightbox modal */}
      <LightboxModal
        isOpen={lightboxOpen}
        currentIndex={lightboxIndex}
        images={filteredItems}
        onClose={closeLightbox}
        onNext={goToNext}
        onPrevious={goToPrevious}
      />
    </section>
  );
}
