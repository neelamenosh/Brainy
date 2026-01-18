import { Check, X } from "lucide-react";

interface QuizOptionProps {
  option: string;
  index: number;
  isSelected: boolean;
  isCorrect?: boolean;
  showResult: boolean;
  correctIndex?: number;
  onClick: () => void;
  disabled: boolean;
}

const QuizOption = ({
  option,
  index,
  isSelected,
  isCorrect,
  showResult,
  correctIndex,
  onClick,
  disabled,
}: QuizOptionProps) => {
  const letters = ["A", "B", "C", "D"];

  const getOptionStyles = () => {
    if (showResult) {
      if (index === correctIndex) {
        return "border-primary bg-primary/20 text-foreground";
      }
      if (isSelected && !isCorrect) {
        return "border-destructive bg-destructive/20 text-foreground";
      }
      return "border-border bg-card/50 text-muted-foreground";
    }
    if (isSelected) {
      return "border-primary bg-primary/10 text-foreground glow";
    }
    return "border-border bg-card hover:border-primary/50 hover:bg-secondary/50 text-foreground";
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full p-4 sm:p-5 rounded-xl border-2 text-left transition-all duration-300 flex items-center gap-4 group ${getOptionStyles()} ${
        disabled ? "cursor-not-allowed" : "cursor-pointer"
      }`}
    >
      {/* Letter indicator */}
      <div
        className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm transition-all ${
          showResult && index === correctIndex
            ? "bg-primary text-primary-foreground"
            : showResult && isSelected && !isCorrect
            ? "bg-destructive text-destructive-foreground"
            : isSelected
            ? "bg-primary text-primary-foreground"
            : "bg-secondary text-muted-foreground group-hover:bg-primary/20 group-hover:text-primary"
        }`}
      >
        {showResult && index === correctIndex ? (
          <Check className="w-5 h-5" />
        ) : showResult && isSelected && !isCorrect ? (
          <X className="w-5 h-5" />
        ) : (
          letters[index]
        )}
      </div>

      {/* Option text */}
      <span className="font-medium">{option}</span>
    </button>
  );
};

export default QuizOption;
