import { Camera } from 'lucide-react';
import { useRecordBehaviorEvent } from '@/hooks/useQueries';
import { BEHAVIOR_EVENT_TYPES, BEHAVIOR_ACTIONS, formatEventDetails } from '@/utils/behaviorTracking';

interface HeroSectionProps {
  onCtaClick: () => void;
}

export function HeroSection({ onCtaClick }: HeroSectionProps) {
  const recordBehaviorMutation = useRecordBehaviorEvent();

  const handleBookShootClick = () => {
    // Record click event asynchronously (non-blocking)
    recordBehaviorMutation.mutate({
      eventType: BEHAVIOR_EVENT_TYPES.CLICK,
      details: formatEventDetails({ action: BEHAVIOR_ACTIONS.CLICK_HERO_BOOK_SHOOT }),
    });
    onCtaClick();
  };

  const handleViewPortfolioClick = () => {
    // Record click event asynchronously (non-blocking)
    recordBehaviorMutation.mutate({
      eventType: BEHAVIOR_EVENT_TYPES.CLICK,
      details: formatEventDetails({ action: BEHAVIOR_ACTIONS.CLICK_HERO_VIEW_PORTFOLIO }),
    });
    const element = document.getElementById('portfolio');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/assets/generated/hero-banner.dim_1920x1080.png"
          alt="Photography Studio"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background/80" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/20 backdrop-blur-sm border border-accent/30 mb-4">
            <Camera size={16} className="text-accent" />
            <span className="text-sm font-medium text-accent-foreground">
              Professional Photography Services
            </span>
          </div>

          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-light text-foreground leading-tight">
            IMAGING ART
            <br />
            <span className="text-accent">STUDIO</span>
          </h1>

          <p className="text-lg md:text-xl text-foreground/80 max-w-2xl mx-auto leading-relaxed">
            Capturing timeless moments with artistic vision and technical excellence. 
            Your story, beautifully told through the lens.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <button
              onClick={handleBookShootClick}
              className="px-8 py-4 bg-primary text-primary-foreground text-base font-medium hover:bg-primary/90 transition-all shadow-warm-lg hover:shadow-warm hover:scale-105"
            >
              Book a Shoot
            </button>
            <button
              onClick={handleViewPortfolioClick}
              className="px-8 py-4 bg-background/80 backdrop-blur-sm text-foreground text-base font-medium hover:bg-background transition-all border border-border"
            >
              View Portfolio
            </button>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
        <div className="w-6 h-10 border-2 border-foreground/30 rounded-full flex items-start justify-center p-2">
          <div className="w-1 h-2 bg-foreground/30 rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  );
}
