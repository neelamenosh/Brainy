import { Link } from "react-router-dom";
import { 
  BarChart3, 
  Calculator, 
  Atom, 
  Landmark, 
  Globe, 
  Cpu,
  ArrowRight
} from "lucide-react";
import { QuizCategory } from "@/data/quizData";

const iconMap: { [key: string]: React.ComponentType<{ className?: string }> } = {
  BarChart3,
  Calculator,
  Atom,
  Landmark,
  Globe,
  Cpu,
};

interface CategoryCardProps {
  category: QuizCategory;
  index: number;
}

const CategoryCard = ({ category, index }: CategoryCardProps) => {
  const Icon = iconMap[category.icon] || BarChart3;

  return (
    <Link
      to={`/quiz/${category.id}`}
      className="group relative overflow-hidden rounded-2xl bg-card border border-border card-hover"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Gradient overlay */}
      <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
      
      <div className="relative p-6 sm:p-8">
        {/* Icon */}
        <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${category.color} mb-6 group-hover:scale-110 transition-transform duration-300`}>
          <Icon className="w-8 h-8 text-primary-foreground" />
        </div>

        {/* Content */}
        <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
          {category.name}
        </h3>
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
          {category.description}
        </p>

        {/* Stats */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            {category.questions.length} Questions
          </span>
          <div className="flex items-center gap-1 text-primary font-medium text-sm group-hover:gap-2 transition-all">
            Start Quiz
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className={`absolute -bottom-20 -right-20 w-40 h-40 rounded-full bg-gradient-to-br ${category.color} opacity-5 group-hover:opacity-20 transition-opacity duration-500`} />
    </Link>
  );
};

export default CategoryCard;
