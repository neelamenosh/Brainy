import { Trophy, Star, RotateCcw, Home, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface QuizResultProps {
  score: number;
  total: number;
  categoryName: string;
  onRestart: () => void;
}

const QuizResult = ({ score, total, categoryName, onRestart }: QuizResultProps) => {
  const percentage = Math.round((score / total) * 100);

  const getMessage = () => {
    if (percentage === 100) return { text: "Perfect Score!", emoji: "🏆" };
    if (percentage >= 80) return { text: "Excellent!", emoji: "🌟" };
    if (percentage >= 60) return { text: "Good Job!", emoji: "👍" };
    if (percentage >= 40) return { text: "Keep Practicing!", emoji: "💪" };
    return { text: "Try Again!", emoji: "📚" };
  };

  const { text, emoji } = getMessage();

  return (
    <div className="min-h-[60vh] flex items-center justify-center animate-scale-in">
      <div className="liquid-glass-strong rounded-3xl p-8 sm:p-12 max-w-lg w-full text-center relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -left-20 w-40 h-40 bg-primary/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-accent/20 rounded-full blur-3xl" />
        </div>

        <div className="relative">
          {/* Trophy icon */}
          <div className="inline-flex p-6 rounded-full bg-primary/20 mb-6 animate-pulse-glow">
            <Trophy className="w-12 h-12 text-primary" />
          </div>

          {/* Title */}
          <h2 className="text-3xl sm:text-4xl font-bold mb-2">
            Quiz Complete! {emoji}
          </h2>
          <p className="text-muted-foreground mb-8">{categoryName}</p>

          {/* Score display */}
          <div className="mb-8">
            <div className="text-7xl sm:text-8xl font-extrabold gradient-text mb-2">
              {percentage}%
            </div>
            <div className="flex items-center justify-center gap-2 text-lg text-muted-foreground">
              <Star className="w-5 h-5 text-primary" />
              <span>
                {score} out of {total} correct
              </span>
            </div>
          </div>

          {/* Message */}
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary/20 text-primary font-medium mb-8">
            <Sparkles className="w-5 h-5" />
            {text}
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={onRestart}
              className="gap-2"
              size="lg"
            >
              <RotateCcw className="w-5 h-5" />
              Try Again
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="gap-2"
            >
              <Link to="/home">
                <Home className="w-5 h-5" />
                All Quizzes
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizResult;
