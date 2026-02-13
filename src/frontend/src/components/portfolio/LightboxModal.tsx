import { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock';
import { useFocusTrap } from '@/hooks/useFocusTrap';

interface LightboxModalProps {
  isOpen: boolean;
  currentIndex: number;
  images: Array<{ image: string; title: string; category: string }>;
  onClose: () => void;
  onNext: () => void;
  onPrevious: () => void;
}

export function LightboxModal({
  isOpen,
  currentIndex,
  images,
  onClose,
  onNext,
  onPrevious,
}: LightboxModalProps) {
  const containerRef = useFocusTrap<HTMLDivElement>(isOpen);
  useBodyScrollLock(isOpen);

  const currentItem = images[currentIndex];
  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex < images.length - 1;

  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          if (hasPrevious) onPrevious();
          break;
        case 'ArrowRight':
          if (hasNext) onNext();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, hasPrevious, hasNext, onClose, onNext, onPrevious]);

  if (!isOpen || !currentItem) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="lightbox-title"
      tabIndex={-1}
    >
      {/* Close button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 right-4 z-10 text-foreground hover:bg-accent/20"
        onClick={onClose}
        aria-label="Close lightbox"
      >
        <X className="h-6 w-6" />
      </Button>

      {/* Previous button */}
      {hasPrevious && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-foreground hover:bg-accent/20 hidden md:flex"
          onClick={onPrevious}
          aria-label="Previous image"
        >
          <ChevronLeft className="h-8 w-8" />
        </Button>
      )}

      {/* Next button */}
      {hasNext && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 text-foreground hover:bg-accent/20 hidden md:flex"
          onClick={onNext}
          aria-label="Next image"
        >
          <ChevronRight className="h-8 w-8" />
        </Button>
      )}

      {/* Image container */}
      <div className="relative w-full h-full flex flex-col items-center justify-center p-4 md:p-8">
        <div className="relative max-w-7xl max-h-full flex flex-col items-center">
          <img
            src={currentItem.image}
            alt={currentItem.title}
            className="max-w-full max-h-[calc(100vh-12rem)] md:max-h-[calc(100vh-8rem)] object-contain"
          />
          
          {/* Image info */}
          <div className="mt-6 text-center">
            <span className="inline-block px-3 py-1 bg-accent/20 text-accent text-xs font-medium mb-2 backdrop-blur-sm">
              {currentItem.category}
            </span>
            <h2 id="lightbox-title" className="font-serif text-2xl md:text-3xl font-normal text-foreground">
              {currentItem.title}
            </h2>
            <p className="text-sm text-muted-foreground mt-2">
              {currentIndex + 1} / {images.length}
            </p>
          </div>
        </div>

        {/* Mobile navigation */}
        <div className="flex gap-4 mt-6 md:hidden">
          <Button
            variant="outline"
            size="icon"
            onClick={onPrevious}
            disabled={!hasPrevious}
            aria-label="Previous image"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={onNext}
            disabled={!hasNext}
            aria-label="Next image"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Backdrop click to close */}
      <div
        className="absolute inset-0 -z-10"
        onClick={onClose}
        aria-hidden="true"
      />
    </div>
  );
}
