import { useState, useMemo } from 'react';
import { useGetAllFeedback, useIsCallerAdmin } from '@/hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { RefreshCw, MessageSquare, AlertCircle, Inbox, Search, Star } from 'lucide-react';

export function FeedbackReviewSection() {
  const { data: isAdmin, isLoading: isAdminLoading } = useIsCallerAdmin();
  const [searchText, setSearchText] = useState('');

  const feedbackQuery = useGetAllFeedback();

  // Client-side search filtering - must be called before any conditional returns
  const filteredFeedback = useMemo(() => {
    if (!feedbackQuery.data) return [];
    if (!searchText.trim()) return feedbackQuery.data;

    const searchLower = searchText.toLowerCase();
    return feedbackQuery.data.filter((entry) => {
      const feedbackText = entry.feedback?.toLowerCase() || '';
      const rating = entry.rating?.toString() || '';
      return feedbackText.includes(searchLower) || rating.includes(searchLower);
    });
  }, [feedbackQuery.data, searchText]);

  const sortedFeedback = useMemo(() => {
    return [...filteredFeedback].sort((a, b) => Number(b.timestamp - a.timestamp));
  }, [filteredFeedback]);

  // Don't render if not admin - after all hooks are called
  if (isAdminLoading) {
    return null;
  }

  if (!isAdmin) {
    return null;
  }

  const handleRefresh = () => {
    feedbackQuery.refetch();
  };

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1_000_000);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <section id="feedback-review" className="py-24 md:py-32 bg-background scroll-mt-20">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-serif text-4xl md:text-5xl font-light mb-6">
            Feedback Review
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Review customer feedback and ratings submitted through the site.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Filter Controls */}
          <div className="mb-8 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search feedback..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              variant="outline"
              size="default"
              onClick={handleRefresh}
              disabled={feedbackQuery.isLoading}
              className="w-full sm:w-auto"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${feedbackQuery.isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>

          {feedbackQuery.isError && (
            <Alert variant="destructive" className="mb-8">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Failed to load feedback. Please try again.
              </AlertDescription>
            </Alert>
          )}

          {feedbackQuery.isLoading && (
            <Card className="shadow-warm">
              <CardContent className="pt-6">
                <div className="space-y-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex items-center justify-between">
                      <Skeleton className="h-5 w-48" />
                      <Skeleton className="h-5 w-24" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {!feedbackQuery.isLoading && !feedbackQuery.isError && sortedFeedback.length === 0 && (
            <Card className="border-dashed shadow-warm">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <Inbox className="h-16 w-16 text-muted-foreground/50 mb-4" />
                <h3 className="font-serif text-2xl font-normal mb-2 text-foreground">
                  {searchText ? 'No Matching Feedback' : 'No Feedback Yet'}
                </h3>
                <p className="text-muted-foreground text-center max-w-md">
                  {searchText
                    ? 'Try adjusting your search criteria.'
                    : 'Customer feedback will appear here once submitted through the feedback form.'}
                </p>
              </CardContent>
            </Card>
          )}

          {!feedbackQuery.isLoading && !feedbackQuery.isError && sortedFeedback.length > 0 && (
            <Card className="shadow-warm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-serif text-2xl font-normal">
                  <MessageSquare className="h-5 w-5 text-accent" />
                  Customer Feedback ({sortedFeedback.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Rating</TableHead>
                        <TableHead>Feedback</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sortedFeedback.map((entry) => (
                        <TableRow key={Number(entry.id)}>
                          <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                            {formatDate(entry.timestamp)}
                          </TableCell>
                          <TableCell>
                            {entry.rating ? (
                              <div className="flex items-center gap-1">
                                {Array.from({ length: Number(entry.rating) }).map((_, i) => (
                                  <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                                ))}
                                <span className="ml-1 text-sm text-muted-foreground">
                                  ({entry.rating.toString()})
                                </span>
                              </div>
                            ) : (
                              <span className="text-sm text-muted-foreground">No rating</span>
                            )}
                          </TableCell>
                          <TableCell className="max-w-md">
                            {entry.feedback ? (
                              <p className="text-sm whitespace-pre-wrap">{entry.feedback}</p>
                            ) : (
                              <span className="text-sm text-muted-foreground italic">No written feedback</span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </section>
  );
}
