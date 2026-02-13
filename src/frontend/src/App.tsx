import { Header } from './components/site/Header';
import { Footer } from './components/site/Footer';
import { HeroSection } from './components/sections/HeroSection';
import { ServicesSection } from './components/sections/ServicesSection';
import { PortfolioSection } from './components/sections/PortfolioSection';
import { AboutSection } from './components/sections/AboutSection';
import { TestimonialsSection } from './components/sections/TestimonialsSection';
import { ContactSection } from './components/sections/ContactSection';
import { BookingsSection } from './components/sections/BookingsSection';
import { useInternetIdentity } from './hooks/useInternetIdentity';

function App() {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header onNavigate={scrollToSection} />
      <main className="flex-1">
        <HeroSection onCtaClick={() => scrollToSection('contact')} />
        <ServicesSection />
        <PortfolioSection />
        <AboutSection />
        <TestimonialsSection />
        <ContactSection />
        {isAuthenticated && <BookingsSection />}
      </main>
      <Footer />
    </div>
  );
}

export default App;
