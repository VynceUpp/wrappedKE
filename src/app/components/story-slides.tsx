import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, ChevronLeft, X, BarChart3 } from 'lucide-react';
import { Button } from './ui/button';
import { FinancialSummary } from '../utils/data-processor';
import { WelcomeSlide } from './slides/welcome-slide';
import { TransactionsSlide } from './slides/transactions-slide';
import { PersonalitySlide } from './slides/personality-slide';
import { CategoriesSlide } from './slides/categories-slide';
import { RecipientsSlide } from './slides/recipients-slide';
import { HighlightsSlide } from './slides/highlights-slide';
import { SummarySlide } from './slides/summary-slide';

interface StorySlidesProps {
  data: FinancialSummary;
  onClose: () => void;
  onViewDashboard: () => void;
}

export function StorySlides({ data, onClose, onViewDashboard }: StorySlidesProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    <WelcomeSlide key="welcome" />,
    <TransactionsSlide key="transactions" data={data} />,
    <PersonalitySlide key="personality" personality={data.spendingPersonality} />,
    <CategoriesSlide key="categories" categories={data.categoryBreakdown} />,
    <RecipientsSlide key="recipients" recipients={data.topRecipients} />,
    <HighlightsSlide key="highlights" highlights={data.highlights} />,
    <SummarySlide key="summary" data={data} onViewDashboard={onViewDashboard} />
  ];

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  return (
    <div className="fixed inset-0 bg-black z-50">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 p-4 flex items-center justify-between">
        <div className="flex gap-1">
          {slides.map((_, index) => (
            <div
              key={index}
              className="h-1 bg-white/30 rounded-full transition-all"
              style={{
                width: index === currentSlide ? '32px' : '24px',
                backgroundColor: index <= currentSlide ? 'white' : 'rgba(255,255,255,0.3)'
              }}
            />
          ))}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="text-white hover:bg-white/10"
        >
          <X className="h-6 w-6" />
        </Button>
      </div>

      {/* Slides */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
          className="h-full w-full flex items-center justify-center p-4"
        >
          {slides[currentSlide]}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-4 px-4">
        {currentSlide > 0 && (
          <Button
            onClick={prevSlide}
            variant="outline"
            className="bg-white/10 border-white/30 text-white hover:bg-white/20"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
        )}
        {currentSlide < slides.length - 1 && (
          <Button
            onClick={nextSlide}
            className="bg-green-600 hover:bg-green-700"
          >
            Next
            <ChevronRight className="h-5 w-5 ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
}
