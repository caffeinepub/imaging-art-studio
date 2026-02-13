import { SiFacebook, SiInstagram, SiX } from 'react-icons/si';
import { Heart } from 'lucide-react';
import { contactInfo } from '@/config/contactInfo';

export function Footer() {
  const currentYear = new Date().getFullYear();
  const appIdentifier = typeof window !== 'undefined' 
    ? encodeURIComponent(window.location.hostname) 
    : 'imaging-art-studio';

  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img
                src="/assets/generated/imaging-art-studio-logo.dim_512x512.png"
                alt="IMAGING ART STUDIO"
                className="h-12 w-12 object-contain"
              />
              <div className="flex flex-col">
                <span className="font-serif text-lg font-semibold tracking-tight">
                  IMAGING ART STUDIO
                </span>
                <span className="text-xs text-muted-foreground tracking-wide">
                  Prayagraj
                </span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Capturing life's precious moments with artistry and passion. Professional photography services in Prayagraj, India.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-serif text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="#services" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Services
                </a>
              </li>
              <li>
                <a href="#portfolio" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Portfolio
                </a>
              </li>
              <li>
                <a href="#about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#testimonials" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Testimonials
                </a>
              </li>
              <li>
                <a href="#contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-serif text-lg font-semibold mb-4">Get in Touch</h3>
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>{contactInfo.address.short}</p>
              <p>
                Phone:{' '}
                <a
                  href={`tel:${contactInfo.phones[0].tel}`}
                  className="hover:text-accent focus-visible:text-accent focus-visible:outline-none focus-visible:underline transition-colors"
                  aria-label={contactInfo.phones[0].label}
                >
                  {contactInfo.phones[0].display}
                </a>
              </p>
              <p>
                Email:{' '}
                <a
                  href={`mailto:${contactInfo.emails[0].address}`}
                  className="hover:text-accent focus-visible:text-accent focus-visible:outline-none focus-visible:underline transition-colors"
                  aria-label={contactInfo.emails[0].label}
                >
                  {contactInfo.emails[0].address}
                </a>
              </p>
            </div>
            <div className="flex gap-4 mt-6">
              <a
                href="#"
                className="p-2 bg-secondary hover:bg-accent transition-colors"
                aria-label="Facebook"
              >
                <SiFacebook size={18} />
              </a>
              <a
                href="#"
                className="p-2 bg-secondary hover:bg-accent transition-colors"
                aria-label="Instagram"
              >
                <SiInstagram size={18} />
              </a>
              <a
                href="#"
                className="p-2 bg-secondary hover:bg-accent transition-colors"
                aria-label="X (Twitter)"
              >
                <SiX size={18} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {currentYear} IMAGING ART STUDIO. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            Built with <Heart size={14} className="text-accent fill-accent" /> using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appIdentifier}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground hover:text-accent transition-colors font-medium"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
