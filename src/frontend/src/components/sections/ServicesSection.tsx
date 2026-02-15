import { Camera, Users, Sparkles, Package, Heart, Mountain } from 'lucide-react';
import { SERVICES } from '@/content/siteContent';

const serviceIcons = {
  'service-wedding': Heart,
  'service-portrait': Users,
  'service-event': Sparkles,
  'service-product': Package,
  'service-outdoor': Mountain,
  'service-prewedding': Camera,
};

export function ServicesSection() {
  return (
    <section id="services" className="py-24 md:py-32 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-serif text-4xl md:text-5xl font-light mb-6">
            Our Services
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            We offer a comprehensive range of photography services tailored to capture your most important moments with artistry and precision.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {SERVICES.map((service) => {
            const Icon = serviceIcons[service.id as keyof typeof serviceIcons];
            return (
              <div
                key={service.id}
                id={service.id}
                className="group p-8 bg-card border border-border hover:border-accent/50 transition-all duration-300 hover:shadow-warm scroll-mt-24"
              >
                <div className="mb-6 inline-flex p-4 bg-accent/10 group-hover:bg-accent/20 transition-colors">
                  <Icon size={32} className="text-accent" />
                </div>
                <h3 className="font-serif text-2xl font-normal mb-4 group-hover:text-accent transition-colors">
                  {service.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {service.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
