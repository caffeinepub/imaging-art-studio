import { useGetRecentSearchEvents, useGetTopSearchQueries, useIsCallerAdmin } from '@/hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RefreshCw, TrendingUp, Clock, Search, AlertCircle } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export function SearchAnalyticsSection() {
  const { data: isAdmin, isLoading: isAdminLoading } = useIsCallerAdmin();
  
  const recentEventsQuery = useGetRecentSearchEvents(BigInt(20));
  const topQueriesQuery = useGetTopSearchQueries(BigInt(10));

  // Don't render if not admin
  if (isAdminLoading) {
    return null;
  }

  if (!isAdmin) {
    return null;
  }

  const handleRefresh = () => {
    recentEventsQuery.refetch();
    topQueriesQuery.refetch();
  };

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1_000_000);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const isLoading = recentEventsQuery.isLoading || topQueriesQuery.isLoading;
  const isError = recentEventsQuery.isError || topQueriesQuery.isError;

  return (
    <section id="search-analytics" className="py-24 md:py-32 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-serif text-4xl md:text-5xl font-light mb-6">
            Search Analytics
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Track what visitors are searching for on your site.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Refresh Control */}
          <div className="mb-8 flex justify-end">
            <Button
              variant="outline"
              size="default"
              onClick={handleRefresh}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>

          {isError && (
            <Alert variant="destructive" className="mb-8">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Failed to load search analytics. Please try again.
              </AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Top Searches */}
            <Card className="shadow-warm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-serif text-2xl font-normal">
                  <TrendingUp className="h-5 w-5 text-accent" />
                  Top Searches
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-3">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="flex items-center justify-between">
                        <Skeleton className="h-5 w-32" />
                        <Skeleton className="h-5 w-12" />
                      </div>
                    ))}
                  </div>
                ) : topQueriesQuery.data && topQueriesQuery.data.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Query</TableHead>
                        <TableHead className="text-right">Count</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {topQueriesQuery.data.map(([query, count], index) => (
                        <TableRow key={`${query}-${index}`}>
                          <TableCell className="font-medium">{query}</TableCell>
                          <TableCell className="text-right">{count.toString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Search className="h-12 w-12 text-muted-foreground/50 mb-3" />
                    <p className="text-sm text-muted-foreground">
                      No search data yet. Searches will appear here once visitors use the search feature.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Searches */}
            <Card className="shadow-warm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-serif text-2xl font-normal">
                  <Clock className="h-5 w-5 text-accent" />
                  Recent Searches
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-3">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="flex items-center justify-between">
                        <Skeleton className="h-5 w-32" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                    ))}
                  </div>
                ) : recentEventsQuery.data && recentEventsQuery.data.length > 0 ? (
                  <div className="space-y-1 max-h-96 overflow-y-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Query</TableHead>
                          <TableHead className="text-right">Time</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {recentEventsQuery.data.map((event, index) => (
                          <TableRow key={`${event.search}-${index}`}>
                            <TableCell className="font-medium">{event.search}</TableCell>
                            <TableCell className="text-right text-sm text-muted-foreground">
                              {formatDate(event.timestamp)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Clock className="h-12 w-12 text-muted-foreground/50 mb-3" />
                    <p className="text-sm text-muted-foreground">
                      No recent searches. Activity will appear here once visitors use the search feature.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
