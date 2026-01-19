import { Brain, Sparkles, Zap, BookOpen, Target, ArrowRight, Trophy, Flame, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { courses, quizCategories } from "@/data/quizData";

const Index = () => {
  const { user } = useAuth();
  
  const totalQuestions = quizCategories.reduce((acc, cat) => acc + cat.questions.length, 0);

  const gradients = [
    "from-violet-500 to-purple-600",
    "from-pink-500 to-rose-600",
    "from-orange-500 to-amber-600",
    "from-cyan-500 to-teal-600",
    "from-fuchsia-500 to-pink-600",
    "from-indigo-500 to-violet-600",
  ];

  return (
    <div className="min-h-screen pt-20 pb-12 bg-mesh noise-overlay">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 -left-32 w-96 h-96 bg-violet-500/20 rounded-full blur-[120px] morph-blob float-slow" />
        <div className="absolute top-40 -right-32 w-[500px] h-[500px] bg-pink-500/15 rounded-full blur-[150px] morph-blob float-medium" style={{ animationDelay: "-2s" }} />
        <div className="absolute bottom-20 left-1/4 w-80 h-80 bg-orange-500/10 rounded-full blur-[100px] morph-blob float-fast" style={{ animationDelay: "-4s" }} />
        <div className="absolute -bottom-32 right-1/3 w-96 h-96 bg-fuchsia-500/15 rounded-full blur-[120px] morph-blob float-slow" style={{ animationDelay: "-3s" }} />
      </div>

      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full liquid-glass text-sm font-medium mb-6 slide-up" style={{ opacity: 0, animationDelay: "0.1s" }}>
              <Sparkles className="w-4 h-4 text-violet-400" />
              <span className="text-gray-300">Welcome back, </span>
              <span className="gradient-text-static font-semibold">{user?.fullName?.split(" ")[0]}!</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight slide-up" style={{ opacity: 0, animationDelay: "0.2s" }}>
              <span className="text-white">Continue Your</span>
              <br />
              <span className="gradient-text-aurora text-glow">Learning Journey</span>
            </h1>

            <p className="text-lg text-gray-400 max-w-xl mb-8 slide-up" style={{ opacity: 0, animationDelay: "0.3s" }}>
              Pick up where you left off. Explore quizzes across multiple engineering subjects 
              and track your progress towards mastery.
            </p>

            <div className="flex flex-wrap justify-center lg:justify-start gap-6 mb-8 slide-up" style={{ opacity: 0, animationDelay: "0.4s" }}>
              {[
                { icon: Brain, value: courses.length, label: "Courses", color: "violet" },
                { icon: BookOpen, value: quizCategories.length, label: "Subjects", color: "pink" },
                { icon: Zap, value: `${totalQuestions}+`, label: "Questions", color: "orange" },
              ].map((stat, index) => (
                <div key={stat.label} className="flex items-center gap-3 liquid-glass-card rounded-2xl px-5 py-4 hover-lift">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color === 'violet' ? 'from-violet-500 to-purple-600' : stat.color === 'pink' ? 'from-pink-500 to-rose-600' : 'from-orange-500 to-amber-600'} shadow-lg`}>
                    <stat.icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="text-2xl font-bold text-white">{stat.value}</div>
                    <div className="text-sm text-gray-400">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex-1 w-full max-w-md slide-up" style={{ opacity: 0, animationDelay: "0.5s" }}>
            <div className="liquid-glass-strong rounded-3xl p-6 card-3d">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 rounded-xl gradient-aurora">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Quick Actions</h3>
                  <p className="text-sm text-gray-400">Jump right into learning</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <Link to={`/quiz/${quizCategories[0]?.id}`} className="block">
                  <Button className="w-full justify-between h-12 rounded-xl btn-liquid gradient-aurora text-white font-semibold shadow-lg glow-violet">
                    <span className="flex items-center gap-2">
                      <Flame className="w-4 h-4" />
                      Start a Random Quiz
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link to="/services" className="block">
                  <Button variant="outline" className="w-full justify-between h-12 rounded-xl border-white/10 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-all duration-300">
                    <span className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4" />
                      Browse All Subjects
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>

              <div className="mt-6 pt-6 border-t border-white/10">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Daily Streak</span>
                  <div className="flex items-center gap-2">
                    <Flame className="w-4 h-4 text-orange-400" />
                    <span className="font-semibold text-white">7 days</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <div className="slide-up" style={{ opacity: 0, animationDelay: "0.6s" }}>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Featured Courses</h2>
            <p className="text-gray-400">Start learning from our comprehensive course catalog</p>
          </div>
          <Link to="/services" className="hidden sm:block slide-up" style={{ opacity: 0, animationDelay: "0.7s" }}>
            <Button variant="outline" className="rounded-xl border-white/10 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-all duration-300">
              View All
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.slice(0, 3).map((course, index) => (
            <div 
              key={`course-${course.id}-${index}`} 
              className="liquid-glass-card rounded-3xl overflow-hidden card-3d hover-glow slide-up"
              style={{ opacity: 0, animationDelay: `${0.8 + index * 0.1}s` }}
            >
              <div className={`h-1.5 bg-gradient-to-r ${gradients[index % gradients.length]}`} />
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className={`relative w-14 h-14 rounded-2xl bg-gradient-to-br ${gradients[index % gradients.length]} flex items-center justify-center shadow-lg`}>
                    <Brain className="w-7 h-7 text-white" />
                    <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${gradients[index % gradients.length]} blur-xl opacity-50`} />
                  </div>
                  <span className="px-3 py-1.5 rounded-full liquid-glass text-gray-300 text-sm font-medium">
                    {course.subjects.length} Subjects
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{course.name}</h3>
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">{course.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex -space-x-2">
                    {course.subjects.slice(0, 3).map((subject, i) => (
                      <div 
                        key={subject.id} 
                        className={`w-8 h-8 rounded-full bg-gradient-to-br ${gradients[(index + i) % gradients.length]} border-2 border-[hsl(230,25%,10%)] flex items-center justify-center text-xs text-white font-bold`}
                      >
                        {subject.name.charAt(0)}
                      </div>
                    ))}
                    {course.subjects.length > 3 && (
                      <div className="w-8 h-8 rounded-full liquid-glass border-2 border-[hsl(230,25%,10%)] flex items-center justify-center text-xs font-medium text-gray-300">
                        +{course.subjects.length - 3}
                      </div>
                    )}
                  </div>
                  <Link to="/services">
                    <Button variant="ghost" size="sm" className="text-violet-400 hover:text-violet-300 hover:bg-violet-500/10 rounded-lg transition-all duration-300">
                      Explore
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <div className="slide-up" style={{ opacity: 0, animationDelay: "1.1s" }}>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Popular Subjects</h2>
            <p className="text-gray-400">Choose a subject and start practicing</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quizCategories.slice(0, 8).map((category, index) => (
            <Link 
              key={`cat-${category.id}-${index}`} 
              to={`/quiz/${category.id}`}
              className="slide-up"
              style={{ opacity: 0, animationDelay: `${1.2 + index * 0.05}s` }}
            >
              <div className="liquid-glass-card rounded-2xl p-5 h-full hover-lift hover-glow shimmer transition-all duration-500">
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${gradients[index % gradients.length]} flex items-center justify-center mb-3 shadow-lg`}>
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-semibold text-white mb-1 line-clamp-1">{category.name}</h3>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-400">{category.questions.length} questions</span>
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                    <span className="text-xs text-amber-400">4.8</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-10 slide-up" style={{ opacity: 0, animationDelay: "1.6s" }}>
          <Link to="/services">
            <Button size="lg" className="h-14 px-8 rounded-2xl btn-liquid gradient-aurora text-white font-semibold shadow-xl glow-mixed">
              <span className="flex items-center gap-2">
                Browse All Subjects
                <ArrowRight className="w-5 h-5" />
              </span>
            </Button>
          </Link>
        </div>
      </section>

      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="liquid-glass-strong rounded-3xl p-8 md:p-12 text-center slide-up glow-mixed" style={{ opacity: 0, animationDelay: "1.7s" }}>
          <div className="flex justify-center mb-6">
            <div className="p-4 rounded-2xl gradient-aurora pulse-glow">
              <Trophy className="w-10 h-10 text-white" />
            </div>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Ready to Test Your Knowledge?
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto mb-8">
            Challenge yourself with our comprehensive quizzes and track your improvement over time.
          </p>
          <Link to={`/quiz/${quizCategories[Math.floor(Math.random() * quizCategories.length)]?.id}`}>
            <Button size="lg" className="h-14 px-10 rounded-2xl btn-liquid gradient-sunset text-white font-semibold shadow-xl glow-pink">
              <Flame className="w-5 h-5 mr-2" />
              Start Random Challenge
            </Button>
          </Link>
        </div>
      </section>

      <footer className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 border-t border-white/10">
        <div className="text-center text-gray-500 text-sm">
          <p>Built with passion for learning. Start a quiz and challenge yourself today!</p>
          <p className="mt-2 gradient-text-static">© {new Date().getFullYear()} Stats Mastermind. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
