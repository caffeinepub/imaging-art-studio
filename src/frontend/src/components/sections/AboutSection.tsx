import { Award, Users, Camera, Heart } from 'lucide-react';

const stats = [
  { icon: Camera, value: '500+', label: 'Projects Completed' },
  { icon: Users, value: '300+', label: 'Happy Clients' },
  { icon: Award, value: '10+', label: 'Years Experience' },
  { icon: Heart, value: '100%', label: 'Satisfaction Rate' },
];

export function AboutSection() {
  return (
    <section id="about" className="py-24 md:py-32 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div className="space-y-6">
            <h2 className="font-serif text-4xl md:text-5xl font-light">
              About Our Studio
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Based in the historic city of <span className="text-foreground font-medium">Prayagraj, India</span>, 
                IMAGING ART STUDIO has been capturing life's most precious moments for over a decade. 
                We believe that every photograph tells a story, and we're passionate about telling yours.
              </p>
              <p>
                Our team of experienced photographers combines technical expertise with artistic vision 
                to create images that are not just pictures, but timeless works of art. From intimate 
                portraits to grand celebrations, we approach each project with dedication and creativity.
              </p>
              <p>
                We pride ourselves on our personalized approach, working closely with each client to 
                understand their vision and exceed their expectations. Our state-of-the-art equipment 
                and post-production techniques ensure that every image we deliver is of the highest quality.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-6 pt-8">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="text-center p-6 bg-secondary/50 border border-border">
                    <Icon size={32} className="text-accent mx-auto mb-3" />
                    <div className="font-serif text-3xl font-semibold text-foreground mb-1">
                      {stat.value}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {stat.label}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Image */}
          <div className="relative">
            <div className="aspect-[4/5] overflow-hidden shadow-warm-lg">
              <img
                src="/assets/generated/portfolio-02.dim_1200x800.png"
                alt="About IMAGING ART STUDIO"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 w-48 h-48 bg-accent/20 -z-10" />
            <div className="absolute -top-6 -right-6 w-48 h-48 bg-primary/10 -z-10" />
          </div>
        </div>
      </div>
    </section>
  );
}
