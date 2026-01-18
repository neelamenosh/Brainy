import { Brain, Sparkles, Users, Zap } from "lucide-react";
import CategoryCard from "@/components/CategoryCard";
import { quizCategories } from "@/data/quizData";

const Index = () => {
  return (
    <div className="min-h-screen pt-20 pb-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "3s" }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6 animate-slide-up">
              <Sparkles className="w-4 h-4" />
              Challenge Your Knowledge
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold mb-6 animate-slide-up" style={{ animationDelay: "100ms" }}>
              Test Your Brain with{" "}
              <span className="gradient-text">Brainy</span>
            </h1>

            {/* Description */}
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 animate-slide-up" style={{ animationDelay: "200ms" }}>
              Explore engaging quizzes across multiple categories. Learn something new, 
              challenge yourself, and track your progress.
            </p>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-8 sm:gap-12 animate-slide-up" style={{ animationDelay: "300ms" }}>
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-primary/20">
                  <Brain className="w-6 h-6 text-primary" />
                </div>
                <div className="text-left">
                  <div className="text-2xl font-bold">{quizCategories.length}</div>
                  <div className="text-sm text-muted-foreground">Categories</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-accent/20">
                  <Zap className="w-6 h-6 text-accent" />
                </div>
                <div className="text-left">
                  <div className="text-2xl font-bold">
                    {quizCategories.reduce((acc, cat) => acc + cat.questions.length, 0)}
                  </div>
                  <div className="text-sm text-muted-foreground">Questions</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-teal/20">
                  <Users className="w-6 h-6 text-teal" />
                </div>
                <div className="text-left">
                  <div className="text-2xl font-bold">Free</div>
                  <div className="text-sm text-muted-foreground">Forever</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-2">Quiz Categories</h2>
            <p className="text-muted-foreground">Choose a category and start learning</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizCategories.map((category, index) => (
            <CategoryCard key={category.id} category={category} index={index} />
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 border-t border-border">
        <div className="text-center text-muted-foreground text-sm">
          <p>Built with passion for learning. Start a quiz and challenge yourself today!</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
