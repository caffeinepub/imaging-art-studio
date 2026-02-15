import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { useIsCallerAdmin, useRecordBehaviorEvent } from '@/hooks/useQueries';
import { LoginButton } from '@/components/auth/LoginButton';
import { SiteSearch } from './SiteSearch';
import { SearchResult } from '@/utils/siteSearch';
import { BEHAVIOR_EVENT_TYPES, BEHAVIOR_ACTIONS, formatEventDetails } from '@/utils/behaviorTracking';

interface HeaderProps {
  onNavigate: (sectionId: string, context?: { category?: string; itemId?: string }) => void;
}

export function Header({ onNavigate }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { identity } = useInternetIdentity();
  const { data: isAdmin } = useIsCallerAdmin();
  const recordBehaviorMutation = useRecordBehaviorEvent();

  const isAuthenticated = !!identity;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Services', id: 'services' },
    { label: 'Portfolio', id: 'portfolio' },
    { label: 'About', id: 'about' },
    { label: 'Testimonials', id: 'testimonials' },
    { label: 'Contact', id: 'contact' },
  ];

  // Add Inquiries nav item only when authenticated
  if (isAuthenticated) {
    navItems.push({ label: 'Inquiries', id: 'bookings' });
  }

  // Add admin-only nav items
  if (isAuthenticated && isAdmin) {
    navItems.push({ label: 'Search Analytics', id: 'search-analytics' });
    navItems.push({ label: 'Feedback Review', id: 'feedback-review' });
    navItems.push({ label: 'Behavior Analytics', id: 'behavior-analytics' });
  }

  const handleNavClick = (id: string) => {
    onNavigate(id);
    setIsMobileMenuOpen(false);
  };

  const handleSearchNavigate = (result: SearchResult) => {
    const context: { category?: string; itemId?: string } = {};
    
    if (result.category) {
      context.category = result.category;
    }
    if (result.itemId) {
      context.itemId = result.itemId;
    }

    onNavigate(result.sectionId, context);
    setIsMobileMenuOpen(false);
  };

  const handleBookNowClick = () => {
    // Record click event asynchronously (non-blocking)
    recordBehaviorMutation.mutate({
      eventType: BEHAVIOR_EVENT_TYPES.CLICK,
      details: formatEventDetails({ action: BEHAVIOR_ACTIONS.CLICK_HEADER_BOOK_NOW }),
    });
    handleNavClick('contact');
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-background/95 backdrop-blur-md shadow-sm border-b border-border'
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-3 group"
          >
            <img
              src="/assets/generated/imaging-art-studio-logo.dim_512x512.png"
              alt="IMAGING ART STUDIO"
              className="h-12 w-12 object-contain transition-transform group-hover:scale-105"
            />
            <div className="flex flex-col">
              <span className="font-serif text-xl font-semibold tracking-tight text-foreground">
                IMAGING ART STUDIO
              </span>
              <span className="text-xs text-muted-foreground tracking-wide">
                Prayagraj
              </span>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <SiteSearch onNavigate={handleSearchNavigate} />
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors relative group"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent transition-all group-hover:w-full" />
              </button>
            ))}
            <LoginButton />
            <button
              onClick={handleBookNowClick}
              className="px-6 py-2.5 bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors shadow-warm"
            >
              Book Now
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-foreground hover:text-foreground/80 transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-background border-t border-border">
          <nav className="container mx-auto px-4 py-6 flex flex-col gap-4">
            <div className="mb-2">
              <SiteSearch onNavigate={handleSearchNavigate} isMobile />
            </div>
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className="text-left text-base font-medium text-foreground/80 hover:text-foreground transition-colors py-2"
              >
                {item.label}
              </button>
            ))}
            <div className="pt-2 border-t border-border">
              <LoginButton />
            </div>
            <button
              onClick={handleBookNowClick}
              className="mt-2 px-6 py-3 bg-primary text-primary-foreground text-base font-medium hover:bg-primary/90 transition-colors shadow-warm text-center"
            >
              Book Now
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
