import { Camera, Users, Sparkles, Package, Heart, Mountain } from 'lucide-react';

const services = [
  {
    icon: Heart,
    title: 'Wedding Photography',
    description: 'Capture every precious moment of your special day with our comprehensive wedding photography packages.',
  },
  {
    icon: Users,
    title: 'Portrait Photography',
    description: 'Professional portraits that showcase your personality and style, perfect for individuals and families.',
  },
  {
    icon: Sparkles,
    title: 'Event Photography',
    description: 'From corporate events to celebrations, we document your occasions with creativity and professionalism.',
  },
  {
    icon: Package,
    title: 'Product Photography',
    description: 'High-quality product images that elevate your brand and drive sales with stunning visual appeal.',
  },
  {
    icon: Mountain,
    title: 'Outdoor Shoots',
    description: 'Breathtaking outdoor photography sessions in scenic locations, capturing natural beauty and authentic moments.',
  },
  {
    icon: Camera,
    title: 'Pre-Wedding Shoots',
    description: 'Romantic and creative pre-wedding photography that tells your unique love story in stunning frames.',
  },
];

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
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div
                key={index}
                className="group p-8 bg-card border border-border hover:border-accent/50 transition-all duration-300 hover:shadow-warm"
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
