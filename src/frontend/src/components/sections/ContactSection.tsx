import { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { contactInfo } from '@/config/contactInfo';
import { useSubmitInquiry } from '@/hooks/useQueries';
import { ServiceType } from '@/backend';
import { serviceTypeOptions, validateEmail, validateRequired, validatePhone } from '@/utils/inquiry';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function ContactSection() {
  const [formData, setFormData] = useState({
    serviceType: '' as ServiceType | '',
    customerName: '',
    phoneNumber: '',
    email: '',
    message: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showSuccess, setShowSuccess] = useState(false);

  const submitInquiry = useSubmitInquiry();

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.serviceType) {
      newErrors.serviceType = 'Please select a service';
    }
    if (!validateRequired(formData.customerName)) {
      newErrors.customerName = 'Name is required';
    }
    if (!validateRequired(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!validatePhone(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Please enter a valid phone number';
    }
    if (!validateRequired(formData.email)) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!validateRequired(formData.message)) {
      newErrors.message = 'Message is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuccess(false);

    if (!validateForm()) {
      return;
    }

    try {
      await submitInquiry.mutateAsync({
        serviceType: formData.serviceType as ServiceType,
        customerName: formData.customerName,
        phoneNumber: formData.phoneNumber,
        email: formData.email,
        message: formData.message,
      });

      // Clear form on success
      setFormData({
        serviceType: '',
        customerName: '',
        phoneNumber: '',
        email: '',
        message: '',
      });
      setErrors({});
      setShowSuccess(true);

      // Hide success message after 5 seconds
      setTimeout(() => setShowSuccess(false), 5000);
    } catch (error) {
      console.error('Failed to submit inquiry:', error);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return (
    <section id="contact" className="py-24 md:py-32 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-serif text-4xl md:text-5xl font-light mb-6">
            Get in Touch
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Ready to capture your special moments? Contact us today to discuss your photography needs and book your session.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h3 className="font-serif text-2xl font-normal mb-6">
                Contact Information
              </h3>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-accent/10 flex items-center justify-center">
                    <MapPin size={20} className="text-accent" />
                  </div>
                  <div>
                    <div className="font-medium text-foreground mb-1">Address</div>
                    <div className="text-muted-foreground">
                      {contactInfo.address.line1}<br />
                      {contactInfo.address.line2}
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-accent/10 flex items-center justify-center">
                    <Phone size={20} className="text-accent" />
                  </div>
                  <div>
                    <div className="font-medium text-foreground mb-1">Phone</div>
                    <div className="text-muted-foreground space-y-1">
                      {contactInfo.phones.map((phone, index) => (
                        <div key={index}>
                          <a
                            href={`tel:${phone.tel}`}
                            className="hover:text-accent focus-visible:text-accent focus-visible:outline-none focus-visible:underline transition-colors"
                            aria-label={phone.label}
                          >
                            {phone.display}
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-accent/10 flex items-center justify-center">
                    <Mail size={20} className="text-accent" />
                  </div>
                  <div>
                    <div className="font-medium text-foreground mb-1">Email</div>
                    <div className="text-muted-foreground space-y-1">
                      {contactInfo.emails.map((email, index) => (
                        <div key={index}>
                          <a
                            href={`mailto:${email.address}`}
                            className="hover:text-accent focus-visible:text-accent focus-visible:outline-none focus-visible:underline transition-colors"
                            aria-label={email.label}
                          >
                            {email.address}
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-accent/10 flex items-center justify-center">
                    <Clock size={20} className="text-accent" />
                  </div>
                  <div>
                    <div className="font-medium text-foreground mb-1">Business Hours</div>
                    <div className="text-muted-foreground">
                      {contactInfo.hours.weekdays}<br />
                      {contactInfo.hours.sunday}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-card border border-border p-8 shadow-warm">
            <h3 className="font-serif text-2xl font-normal mb-6">
              Send us a Message
            </h3>

            {showSuccess && (
              <Alert className="mb-6 border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950">
                <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                <AlertDescription className="text-green-800 dark:text-green-200">
                  Thank you for your inquiry! We'll get back to you soon.
                </AlertDescription>
              </Alert>
            )}

            {submitInquiry.isError && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Failed to submit your inquiry. Please try again or contact us directly.
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="service" className="text-sm font-medium text-foreground mb-2">
                  Service Interested In
                </Label>
                <Select
                  value={formData.serviceType}
                  onValueChange={(value) => handleInputChange('serviceType', value)}
                >
                  <SelectTrigger
                    id="service"
                    className={`w-full ${errors.serviceType ? 'border-destructive' : ''}`}
                  >
                    <SelectValue placeholder="Select a service" />
                  </SelectTrigger>
                  <SelectContent>
                    {serviceTypeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.serviceType && (
                  <p className="text-sm text-destructive mt-1">{errors.serviceType}</p>
                )}
              </div>

              <div>
                <Label htmlFor="name" className="text-sm font-medium text-foreground mb-2">
                  Your Name
                </Label>
                <Input
                  type="text"
                  id="name"
                  value={formData.customerName}
                  onChange={(e) => handleInputChange('customerName', e.target.value)}
                  placeholder="Enter your name"
                  className={errors.customerName ? 'border-destructive' : ''}
                />
                {errors.customerName && (
                  <p className="text-sm text-destructive mt-1">{errors.customerName}</p>
                )}
              </div>

              <div>
                <Label htmlFor="phone" className="text-sm font-medium text-foreground mb-2">
                  Phone Number
                </Label>
                <Input
                  type="tel"
                  id="phone"
                  value={formData.phoneNumber}
                  onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                  placeholder="+91 XXXXX XXXXX"
                  className={errors.phoneNumber ? 'border-destructive' : ''}
                />
                {errors.phoneNumber && (
                  <p className="text-sm text-destructive mt-1">{errors.phoneNumber}</p>
                )}
              </div>

              <div>
                <Label htmlFor="email" className="text-sm font-medium text-foreground mb-2">
                  Email Address
                </Label>
                <Input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="your.email@example.com"
                  className={errors.email ? 'border-destructive' : ''}
                />
                {errors.email && (
                  <p className="text-sm text-destructive mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <Label htmlFor="message" className="text-sm font-medium text-foreground mb-2">
                  Message
                </Label>
                <Textarea
                  id="message"
                  rows={4}
                  value={formData.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  placeholder="Tell us about your photography needs..."
                  className={`resize-none ${errors.message ? 'border-destructive' : ''}`}
                />
                {errors.message && (
                  <p className="text-sm text-destructive mt-1">{errors.message}</p>
                )}
              </div>

              <Button
                type="submit"
                disabled={submitInquiry.isPending}
                className="w-full px-8 py-6 text-base font-medium shadow-warm hover:shadow-warm-lg"
              >
                {submitInquiry.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Get a Quote'
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
