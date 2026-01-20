import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowRight, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import QuizProgress from "@/components/QuizProgress";
import QuizOption from "@/components/QuizOption";
import QuizResult from "@/components/QuizResult";
import { quizCategories } from "@/data/quizData";

const Quiz = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();

  const category = quizCategories.find((c) => c.id === categoryId);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [quizComplete, setQuizComplete] = useState(false);
  // per-question timeout (seconds)
  const TIMEOUT_SECONDS = 30;
  const [timeLeft, setTimeLeft] = useState<number>(TIMEOUT_SECONDS);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!category) {
      navigate("/");
    }
  }, [category, navigate]);

  // Reset timer when question changes
  useEffect(() => {
    setTimeLeft(TIMEOUT_SECONDS);
    // clear any previous timer
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
    // start countdown
    if (!answered) {
      timerRef.current = window.setInterval(() => {
        setTimeLeft((t) => t - 1);
      }, 1000);
    }
    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [currentQuestion]);

  // Stop timer when answered or when timeLeft reaches 0
  useEffect(() => {
    if (answered && timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (timeLeft <= 0 && !answered) {
      // auto-submit as answered (count as incorrect if nothing selected)
      if (selectedOption !== null) {
        if (selectedOption === question.correct) {
          setScore((s) => s + 1);
        }
      }
      setAnswered(true);
      setShowResult(true);
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  }, [timeLeft, answered]);

  if (!category) {
    return null;
  }

  const question = category.questions[currentQuestion];

  const handleOptionClick = (index: number) => {
    if (answered) return;
    setSelectedOption(index);
  };

  const handleConfirmAnswer = () => {
    if (selectedOption === null) return;
    
    if (selectedOption === question.correct) {
      setScore(score + 1);
    }
    setAnswered(true);
    setShowResult(true);
  };

  const handleNext = () => {
    if (currentQuestion < category.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption(null);
      setAnswered(false);
      setShowResult(false);
    } else {
      setQuizComplete(true);
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setSelectedOption(null);
    setScore(0);
    setShowResult(false);
    setAnswered(false);
    setQuizComplete(false);
  };

  if (quizComplete) {
    return (
      <div className="min-h-screen pt-20 px-4 bg-mesh noise-overlay">
        <QuizResult
          score={score}
          total={category.questions.length}
          categoryName={category.name}
          onRestart={handleRestart}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-12 bg-mesh noise-overlay">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold mb-1">{category.name} Quiz</h1>
              <p className="text-muted-foreground text-sm">{category.description}</p>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-medium">{timeLeft > 0 ? `${timeLeft}s` : "0s"}</span>
            </div>
          </div>
          <QuizProgress current={currentQuestion + 1} total={category.questions.length} />
        </div>

        {/* Question Card */}
        <div className="liquid-glass-strong rounded-2xl p-6 sm:p-8 mb-6 animate-scale-in" key={currentQuestion}>
          <h2 className="text-xl sm:text-2xl font-bold mb-8">
            {question.question}
          </h2>

          <div className="space-y-3">
            {question.options.map((option, index) => (
              <QuizOption
                key={index}
                option={option}
                index={index}
                isSelected={selectedOption === index}
                isCorrect={selectedOption === question.correct}
                showResult={showResult}
                correctIndex={question.correct}
                onClick={() => handleOptionClick(index)}
                disabled={answered}
              />
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-end">
          {!answered ? (
            <Button
              onClick={handleConfirmAnswer}
              disabled={selectedOption === null}
              size="lg"
              className="gap-2"
            >
              Confirm Answer
              <ArrowRight className="w-5 h-5" />
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              size="lg"
              variant="glow"
              className="gap-2"
            >
              {currentQuestion < category.questions.length - 1 ? "Next Question" : "View Results"}
              <ArrowRight className="w-5 h-5" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Quiz;
