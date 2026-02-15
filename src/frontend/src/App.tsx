import { useRef } from 'react';
import { Header } from './components/site/Header';
import { Footer } from './components/site/Footer';
import { HeroSection } from './components/sections/HeroSection';
import { ServicesSection } from './components/sections/ServicesSection';
import { PortfolioSection, PortfolioSectionRef } from './components/sections/PortfolioSection';
import { AboutSection } from './components/sections/AboutSection';
import { TestimonialsSection } from './components/sections/TestimonialsSection';
import { ContactSection } from './components/sections/ContactSection';
import { FeedbackSection } from './components/sections/FeedbackSection';
import { BookingsSection } from './components/sections/BookingsSection';
import { SearchAnalyticsSection } from './components/sections/SearchAnalyticsSection';
import { FeedbackReviewSection } from './components/sections/FeedbackReviewSection';
import { BehaviorAnalyticsSection } from './components/sections/BehaviorAnalyticsSection';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useRecordBehaviorEvent } from './hooks/useQueries';
import { BEHAVIOR_EVENT_TYPES, formatEventDetails } from './utils/behaviorTracking';

function App() {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const portfolioRef = useRef<PortfolioSectionRef>(null);
  const recordBehaviorMutation = useRecordBehaviorEvent();

  const scrollToSection = (sectionId: string, context?: { category?: string; itemId?: string }) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });

      // Record view event asynchronously (non-blocking)
      recordBehaviorMutation.mutate({
        eventType: BEHAVIOR_EVENT_TYPES.VIEW,
        details: formatEventDetails({ section: sectionId }),
      });

      // Handle portfolio-specific navigation with category and item
      if (sectionId === 'portfolio' && context?.category && context?.itemId) {
        setTimeout(() => {
          portfolioRef.current?.selectCategoryAndItem(context.category!, context.itemId!);
        }, 500);
      }

      // Handle service-specific navigation
      if (sectionId === 'services' && context?.itemId) {
        setTimeout(() => {
          const serviceElement = document.getElementById(context.itemId!);
          if (serviceElement) {
            serviceElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 500);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header onNavigate={scrollToSection} />
      <main className="flex-1">
        <HeroSection onCtaClick={() => scrollToSection('contact')} />
        <ServicesSection />
        <PortfolioSection ref={portfolioRef} />
        <AboutSection />
        <TestimonialsSection />
        <ContactSection />
        <FeedbackSection />
        {isAuthenticated && <BookingsSection />}
        {isAuthenticated && <SearchAnalyticsSection />}
        {isAuthenticated && <FeedbackReviewSection />}
        {isAuthenticated && <BehaviorAnalyticsSection />}
      </main>
      <Footer />
    </div>
  );
}

export default App;
