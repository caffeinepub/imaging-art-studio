import { useState, useMemo } from 'react';
import { useGetAllInquiries, useGetInquiriesByServiceType } from '@/hooks/useQueries';
import { getServiceTypeLabel, serviceTypeOptions } from '@/utils/inquiry';
import { Calendar, Mail, Phone, MessageSquare, Loader2, AlertCircle, Inbox, Search, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { ServiceType } from '@/backend';

export function BookingsSection() {
  const [searchText, setSearchText] = useState('');
  const [selectedServiceType, setSelectedServiceType] = useState<ServiceType | null>(null);

  // Use the appropriate query based on filter selection
  const allInquiriesQuery = useGetAllInquiries();
  const filteredInquiriesQuery = useGetInquiriesByServiceType(selectedServiceType);

  // Determine which query to use
  const activeQuery = selectedServiceType ? filteredInquiriesQuery : allInquiriesQuery;
  const { data: inquiries, isLoading, isError, refetch } = activeQuery;

  // Client-side search filtering
  const filteredInquiries = useMemo(() => {
    if (!inquiries) return [];
    if (!searchText.trim()) return inquiries;

    const searchLower = searchText.toLowerCase();
    return inquiries.filter((inquiry) => {
      return (
        inquiry.customerName.toLowerCase().includes(searchLower) ||
        inquiry.phoneNumber.toLowerCase().includes(searchLower) ||
        inquiry.email.toLowerCase().includes(searchLower) ||
        inquiry.message.toLowerCase().includes(searchLower)
      );
    });
  }, [inquiries, searchText]);

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1_000_000); // Convert nanoseconds to milliseconds
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleRefresh = () => {
    refetch();
  };

  const handleServiceTypeChange = (value: string) => {
    if (value === 'all') {
      setSelectedServiceType(null);
    } else {
      setSelectedServiceType(value as ServiceType);
    }
  };

  return (
    <section id="bookings" className="py-24 md:py-32 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-serif text-4xl md:text-5xl font-light mb-6">
            Booking Inquiries
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Manage and review all customer inquiries and booking requests.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Filter Controls */}
          <div className="mb-8 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by name, phone, email, or message..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedServiceType || 'all'} onValueChange={handleServiceTypeChange}>
              <SelectTrigger className="w-full sm:w-[240px]">
                <SelectValue placeholder="All services" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All services</SelectItem>
                {serviceTypeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="default"
              onClick={handleRefresh}
              disabled={isLoading}
              className="w-full sm:w-auto"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>

          {isLoading && (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-6 w-48" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-20 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {isError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Failed to load inquiries. Please make sure you are logged in and try again.
              </AlertDescription>
            </Alert>
          )}

          {!isLoading && !isError && filteredInquiries.length === 0 && (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <Inbox className="h-16 w-16 text-muted-foreground/50 mb-4" />
                <h3 className="font-serif text-2xl font-normal mb-2 text-foreground">
                  {searchText || selectedServiceType ? 'No Matching Inquiries' : 'No Inquiries Yet'}
                </h3>
                <p className="text-muted-foreground text-center max-w-md">
                  {searchText || selectedServiceType
                    ? 'Try adjusting your search or filter criteria.'
                    : 'When customers submit booking inquiries through the contact form, they will appear here.'}
                </p>
              </CardContent>
            </Card>
          )}

          {!isLoading && !isError && filteredInquiries.length > 0 && (
            <div className="space-y-6">
              {filteredInquiries
                .sort((a, b) => Number(b.timestamp - a.timestamp))
                .map((inquiry) => (
                  <Card key={Number(inquiry.id)} className="shadow-warm hover:shadow-warm-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <CardTitle className="font-serif text-2xl font-normal mb-2">
                            {inquiry.customerName}
                          </CardTitle>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            <span>{formatDate(inquiry.timestamp)}</span>
                          </div>
                        </div>
                        <Badge variant="secondary" className="text-sm">
                          {getServiceTypeLabel(inquiry.serviceType)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-3">
                          <div className="flex-shrink-0 w-10 h-10 bg-accent/10 flex items-center justify-center rounded">
                            <Phone className="h-4 w-4 text-accent" />
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground mb-0.5">Phone</div>
                            <a
                              href={`tel:${inquiry.phoneNumber}`}
                              className="text-sm font-medium hover:text-accent transition-colors"
                            >
                              {inquiry.phoneNumber}
                            </a>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="flex-shrink-0 w-10 h-10 bg-accent/10 flex items-center justify-center rounded">
                            <Mail className="h-4 w-4 text-accent" />
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground mb-0.5">Email</div>
                            <a
                              href={`mailto:${inquiry.email}`}
                              className="text-sm font-medium hover:text-accent transition-colors break-all"
                            >
                              {inquiry.email}
                            </a>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-3 pt-2">
                        <div className="flex-shrink-0 w-10 h-10 bg-accent/10 flex items-center justify-center rounded">
                          <MessageSquare className="h-4 w-4 text-accent" />
                        </div>
                        <div className="flex-1">
                          <div className="text-xs text-muted-foreground mb-1">Message</div>
                          <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                            {inquiry.message}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
