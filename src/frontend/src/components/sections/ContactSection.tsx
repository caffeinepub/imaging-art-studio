import { useState } from 'react';
import { useSubmitInquiry } from '@/hooks/useQueries';
import { ServiceType } from '@/backend';
import { validateEmail, validatePhone, validateRequired, getServiceTypeLabel, serviceTypeOptions } from '@/utils/inquiry';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Phone, Mail, MapPin, Clock, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { contactInfo } from '@/config/contactInfo';

export function ContactSection() {
  const [formData, setFormData] = useState({
    serviceType: '' as ServiceType | '',
    customerName: '',
    phoneNumber: '',
    email: '',
    message: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const submitInquiryMutation = useSubmitInquiry();

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!validateRequired(formData.serviceType)) {
      newErrors.serviceType = 'Please select a service type';
    }
    if (!validateRequired(formData.customerName)) {
      newErrors.customerName = 'Name is required';
    }
    if (!validatePhone(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Please enter a valid phone number';
    }
    if (!validateEmail(formData.email)) {
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

    if (!validateForm()) {
      return;
    }

    try {
      await submitInquiryMutation.mutateAsync({
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
    } catch (error) {
      console.error('Failed to submit inquiry:', error);
    }
  };

  return (
    <section id="contact" className="py-24 md:py-32 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-serif text-4xl md:text-5xl font-light mb-6">
            Get in Touch
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Ready to capture your special moments? Reach out to us and let's create something beautiful together.
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h3 className="font-serif text-2xl font-normal mb-6">Contact Information</h3>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="shrink-0 w-12 h-12 bg-accent/10 flex items-center justify-center rounded">
                    <Phone className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Phone</h4>
                    <div className="space-y-1">
                      {contactInfo.phones.map((phone, index) => (
                        <a
                          key={index}
                          href={`tel:${phone.tel}`}
                          className="block text-muted-foreground hover:text-accent transition-colors"
                        >
                          {phone.display}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="shrink-0 w-12 h-12 bg-accent/10 flex items-center justify-center rounded">
                    <Mail className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Email</h4>
                    {contactInfo.emails.map((email, index) => (
                      <a
                        key={index}
                        href={`mailto:${email.address}`}
                        className="text-muted-foreground hover:text-accent transition-colors"
                      >
                        {email.address}
                      </a>
                    ))}
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="shrink-0 w-12 h-12 bg-accent/10 flex items-center justify-center rounded">
                    <MapPin className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Location</h4>
                    <p className="text-muted-foreground leading-relaxed">
                      {contactInfo.address.line1}
                      <br />
                      {contactInfo.address.line2}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="shrink-0 w-12 h-12 bg-accent/10 flex items-center justify-center rounded">
                    <Clock className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Business Hours</h4>
                    <div className="space-y-1 text-muted-foreground">
                      <p>{contactInfo.hours.weekdays}</p>
                      <p>{contactInfo.hours.sunday}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Form */}
          <Card className="shadow-warm">
            <CardHeader>
              <CardTitle className="font-serif text-2xl font-normal">Book a Session</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="serviceType">Service Type *</Label>
                  <Select
                    value={formData.serviceType}
                    onValueChange={(value) => handleInputChange('serviceType', value)}
                  >
                    <SelectTrigger id="serviceType" className={errors.serviceType ? 'border-destructive' : ''}>
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
                    <p className="text-sm text-destructive">{errors.serviceType}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customerName">Your Name *</Label>
                  <Input
                    id="customerName"
                    type="text"
                    placeholder="John Doe"
                    value={formData.customerName}
                    onChange={(e) => handleInputChange('customerName', e.target.value)}
                    className={errors.customerName ? 'border-destructive' : ''}
                  />
                  {errors.customerName && (
                    <p className="text-sm text-destructive">{errors.customerName}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number *</Label>
                  <Input
                    id="phoneNumber"
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={formData.phoneNumber}
                    onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                    className={errors.phoneNumber ? 'border-destructive' : ''}
                  />
                  {errors.phoneNumber && (
                    <p className="text-sm text-destructive">{errors.phoneNumber}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={errors.email ? 'border-destructive' : ''}
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive">{errors.email}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    placeholder="Tell us about your photography needs..."
                    rows={5}
                    value={formData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    className={errors.message ? 'border-destructive' : ''}
                  />
                  {errors.message && (
                    <p className="text-sm text-destructive">{errors.message}</p>
                  )}
                </div>

                {submitInquiryMutation.isSuccess && (
                  <Alert className="bg-green-50 border-green-200">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">
                      Thank you! Your inquiry has been submitted successfully. We'll get back to you soon.
                    </AlertDescription>
                  </Alert>
                )}

                {submitInquiryMutation.isError && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Failed to submit your inquiry. Please try again or contact us directly.
                    </AlertDescription>
                  </Alert>
                )}

                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={submitInquiryMutation.isPending}
                >
                  {submitInquiryMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Inquiry'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
