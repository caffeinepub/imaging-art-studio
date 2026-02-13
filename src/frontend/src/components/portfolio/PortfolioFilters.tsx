import { Button } from '@/components/ui/button';

interface PortfolioFiltersProps {
  categories: string[];
  selectedCategory: string;
  onChange: (category: string) => void;
}

export function PortfolioFilters({
  categories,
  selectedCategory,
  onChange,
}: PortfolioFiltersProps) {
  const allCategories = ['All', ...categories];

  return (
    <div className="flex flex-wrap justify-center gap-3 mb-12">
      {allCategories.map((category) => (
        <Button
          key={category}
          variant={selectedCategory === category ? 'default' : 'outline'}
          onClick={() => onChange(category)}
          className="px-6 py-2 transition-all duration-200"
        >
          {category}
        </Button>
      ))}
    </div>
  );
}
