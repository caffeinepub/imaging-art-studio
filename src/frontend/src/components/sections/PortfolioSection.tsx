import { useState, useMemo, useImperativeHandle, forwardRef } from 'react';
import { LightboxModal } from '../portfolio/LightboxModal';
import { PortfolioFilters } from '../portfolio/PortfolioFilters';
import { PORTFOLIO_ITEMS } from '@/content/siteContent';
import { useRecordBehaviorEvent } from '@/hooks/useQueries';
import { BEHAVIOR_EVENT_TYPES, BEHAVIOR_ACTIONS, formatEventDetails } from '@/utils/behaviorTracking';

export interface PortfolioSectionRef {
  selectCategoryAndItem: (category: string, itemId: string) => void;
}

export const PortfolioSection = forwardRef<PortfolioSectionRef>((_, ref) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [highlightItemId, setHighlightItemId] = useState<string | null>(null);
  const recordBehaviorMutation = useRecordBehaviorEvent();

  // Derive unique categories from portfolio items
  const categories = useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(PORTFOLIO_ITEMS.map((item) => item.category))
    );
    return uniqueCategories.sort();
  }, []);

  // Filter items based on selected category
  const filteredItems = useMemo(() => {
    if (selectedCategory === 'All') {
      return PORTFOLIO_ITEMS;
    }
    return PORTFOLIO_ITEMS.filter((item) => item.category === selectedCategory);
  }, [selectedCategory]);

  // Expose method to parent for search navigation
  useImperativeHandle(ref, () => ({
    selectCategoryAndItem: (category: string, itemId: string) => {
      // Set the category filter
      setSelectedCategory(category);
      
      // Wait for filter to apply, then scroll to item
      setTimeout(() => {
        const element = document.getElementById(itemId);
        if (element) {
          setHighlightItemId(itemId);
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          
          // Remove highlight after animation
          setTimeout(() => setHighlightItemId(null), 2000);
        }
      }, 100);
    },
  }));

  const openLightbox = (index: number) => {
    const item = filteredItems[index];
    
    // Record click event asynchronously (non-blocking)
    recordBehaviorMutation.mutate({
      eventType: BEHAVIOR_EVENT_TYPES.CLICK,
      details: formatEventDetails({
        action: BEHAVIOR_ACTIONS.CLICK_PORTFOLIO_ITEM,
        itemId: item.id,
        category: item.category,
      }),
    });

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
    <section id="portfolio" className="py-24 md:py-32 bg-secondary/30 scroll-mt-20">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-serif text-4xl md:text-5xl font-light mb-6">
            Our Portfolio
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Explore our collection of captured moments, each telling a unique story through the art of photography.
          </p>
        </div>

        {/* Category Filters */}
        <PortfolioFilters
          categories={categories}
          selectedCategory={selectedCategory}
          onChange={setSelectedCategory}
        />

        {/* Portfolio Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item, index) => (
            <button
              key={item.id}
              id={item.id}
              onClick={() => openLightbox(index)}
              className={`group relative aspect-[4/3] overflow-hidden bg-muted transition-all hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 scroll-mt-32 ${
                highlightItemId === item.id ? 'ring-2 ring-accent ring-offset-2' : ''
              }`}
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="font-serif text-xl font-normal text-foreground mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{item.category}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      <LightboxModal
        isOpen={lightboxOpen}
        images={filteredItems}
        currentIndex={lightboxIndex}
        onClose={closeLightbox}
        onNext={goToNext}
        onPrevious={goToPrevious}
      />
    </section>
  );
});

PortfolioSection.displayName = 'PortfolioSection';
