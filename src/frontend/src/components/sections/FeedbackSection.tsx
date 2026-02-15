import { useState } from 'react';
import { useSubmitFeedback } from '@/hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Star, MessageSquare, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export function FeedbackSection() {
  const [rating, setRating] = useState<number | null>(null);
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);
  const [feedbackText, setFeedbackText] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const submitMutation = useSubmitFeedback();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!rating && !feedbackText.trim()) {
      return;
    }

    try {
      await submitMutation.mutateAsync({
        rating: rating ? BigInt(rating) : null,
        feedbackText: feedbackText.trim() || null,
      });

      // Reset form and show success
      setRating(null);
      setFeedbackText('');
      setShowSuccess(true);

      // Hide success message after 5 seconds
      setTimeout(() => setShowSuccess(false), 5000);
    } catch (error) {
      // Error is handled by mutation state
    }
  };

  const displayRating = hoveredRating ?? rating ?? 0;

  return (
    <section id="feedback" className="py-24 md:py-32 bg-secondary/30 scroll-mt-20">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-serif text-4xl md:text-5xl font-light mb-6">
            Share Your Feedback
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            We value your opinion. Let us know how we're doing or share your experience with us.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <Card className="shadow-warm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-serif text-2xl font-normal">
                <MessageSquare className="h-5 w-5 text-accent" />
                Your Feedback
              </CardTitle>
              <CardDescription>
                Rate your experience and share your thoughts (optional)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Rating Stars */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoveredRating(star)}
                        onMouseLeave={() => setHoveredRating(null)}
                        className="transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 rounded"
                        aria-label={`Rate ${star} stars`}
                      >
                        <Star
                          className={`h-8 w-8 transition-colors ${
                            star <= displayRating
                              ? 'fill-accent text-accent'
                              : 'text-muted-foreground/30'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  {rating && (
                    <p className="text-sm text-muted-foreground">
                      You rated {rating} out of 5 stars
                    </p>
                  )}
                </div>

                {/* Feedback Text */}
                <div className="space-y-2">
                  <label htmlFor="feedback-text" className="text-sm font-medium">
                    Your Feedback (Optional)
                  </label>
                  <Textarea
                    id="feedback-text"
                    placeholder="Tell us about your experience..."
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    rows={5}
                    className="resize-none"
                  />
                </div>

                {/* Success Message */}
                {showSuccess && (
                  <Alert className="bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800">
                    <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                    <AlertDescription className="text-green-800 dark:text-green-200">
                      Thank you for your feedback! We appreciate you taking the time to share your thoughts.
                    </AlertDescription>
                  </Alert>
                )}

                {/* Error Message */}
                {submitMutation.isError && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Failed to submit feedback. Please try again.
                    </AlertDescription>
                  </Alert>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full"
                  disabled={submitMutation.isPending || (!rating && !feedbackText.trim())}
                >
                  {submitMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Feedback'
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
