import { Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Priya & Rahul Sharma',
    role: 'Wedding Clients',
    content: 'IMAGING ART STUDIO captured our wedding day beautifully. Every moment, every emotion was preserved perfectly. The team was professional, creative, and made us feel comfortable throughout. Highly recommended!',
    rating: 5,
  },
  {
    name: 'Amit Verma',
    role: 'Corporate Client',
    content: 'We hired them for our company event and the results exceeded our expectations. The photographs were stunning and captured the essence of our brand perfectly. Professional service from start to finish.',
    rating: 5,
  },
  {
    name: 'Sneha Gupta',
    role: 'Portrait Session',
    content: 'The portrait session was an amazing experience. The photographer made me feel at ease and the final images were absolutely gorgeous. I will definitely be returning for future sessions!',
    rating: 5,
  },
  {
    name: 'Rajesh & Anjali Patel',
    role: 'Pre-Wedding Shoot',
    content: 'Our pre-wedding shoot was magical! The team found the most beautiful locations in Prayagraj and their creative direction resulted in stunning photographs that we will cherish forever.',
    rating: 5,
  },
  {
    name: 'Vikram Singh',
    role: 'Product Photography',
    content: 'Outstanding product photography that helped boost our online sales significantly. The attention to detail and lighting was impeccable. Great value for money and quick turnaround time.',
    rating: 5,
  },
  {
    name: 'Meera Reddy',
    role: 'Family Portrait',
    content: 'They captured our family perfectly! The session was fun and relaxed, and the final photos are now treasured memories. The quality and professionalism are unmatched in Prayagraj.',
    rating: 5,
  },
];

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-24 md:py-32 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-serif text-4xl md:text-5xl font-light mb-6">
            Client Testimonials
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Don't just take our word for it. Here's what our clients have to say about their experience with us.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="p-8 bg-card border border-border hover:border-accent/50 transition-all duration-300 hover:shadow-warm"
            >
              <Quote size={32} className="text-accent/30 mb-4" />
              
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-5 h-5 text-accent fill-accent"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                ))}
              </div>

              <p className="text-muted-foreground leading-relaxed mb-6">
                "{testimonial.content}"
              </p>

              <div className="border-t border-border pt-4">
                <div className="font-medium text-foreground">
                  {testimonial.name}
                </div>
                <div className="text-sm text-muted-foreground">
                  {testimonial.role}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
