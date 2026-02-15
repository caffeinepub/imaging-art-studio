import { useGetRecentBehaviorEvents, useGetTopBehaviorEvents, useIsCallerAdmin } from '@/hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { RefreshCw, Activity, Clock, TrendingUp, AlertCircle } from 'lucide-react';
import { parseEventDetails } from '@/utils/behaviorTracking';

export function BehaviorAnalyticsSection() {
  const { data: isAdmin, isLoading: isAdminLoading } = useIsCallerAdmin();

  const recentEventsQuery = useGetRecentBehaviorEvents(BigInt(20));
  const topEventsQuery = useGetTopBehaviorEvents(BigInt(10));

  // Don't render if not admin
  if (isAdminLoading) {
    return null;
  }

  if (!isAdmin) {
    return null;
  }

  const handleRefresh = () => {
    recentEventsQuery.refetch();
    topEventsQuery.refetch();
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

  const formatEventType = (eventType: string) => {
    return eventType
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const isLoading = recentEventsQuery.isLoading || topEventsQuery.isLoading;
  const isError = recentEventsQuery.isError || topEventsQuery.isError;

  return (
    <section id="behavior-analytics" className="py-24 md:py-32 bg-muted/30 scroll-mt-20">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-serif text-4xl md:text-5xl font-light mb-6">
            Behavior Analytics
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Track visitor interactions and engagement patterns across your site.
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
                Failed to load behavior analytics. Please try again.
              </AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Top Events */}
            <Card className="shadow-warm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-serif text-2xl font-normal">
                  <TrendingUp className="h-5 w-5 text-accent" />
                  Top Events
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
                ) : topEventsQuery.data && topEventsQuery.data.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Event Type</TableHead>
                        <TableHead className="text-right">Count</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {topEventsQuery.data.map(([eventType, count], index) => (
                        <TableRow key={`${eventType}-${index}`}>
                          <TableCell className="font-medium">{formatEventType(eventType)}</TableCell>
                          <TableCell className="text-right">{count.toString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Activity className="h-12 w-12 text-muted-foreground/50 mb-3" />
                    <p className="text-sm text-muted-foreground">
                      No behavior data yet. Events will appear here once visitors interact with the site.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Events */}
            <Card className="shadow-warm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-serif text-2xl font-normal">
                  <Clock className="h-5 w-5 text-accent" />
                  Recent Events
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
                          <TableHead>Event Type</TableHead>
                          <TableHead className="text-right">Time</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {recentEventsQuery.data.map((event, index) => (
                          <TableRow key={`${event.id}-${index}`}>
                            <TableCell className="font-medium">
                              {formatEventType(event.eventType)}
                            </TableCell>
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
                      No recent events. Activity will appear here once visitors interact with the site.
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
