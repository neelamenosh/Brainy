import { useState } from "react";
import { Brain, Sparkles, Zap, BookOpen, Target, ArrowRight, Trophy, Flame, Star, X, Play, Clock, Users, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { courses, quizCategories, Course } from "@/data/quizData";

const Index = () => {
  const { user } = useAuth();
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  
  const totalQuestions = quizCategories.reduce((acc, cat) => acc + cat.questions.length, 0);

  const gradients = [
    "from-violet-500 to-purple-600",
    "from-pink-500 to-rose-600",
    "from-orange-500 to-amber-600",
    "from-cyan-500 to-teal-600",
    "from-fuchsia-500 to-pink-600",
    "from-indigo-500 to-violet-600",
  ];

  const openCourseModal = (course: Course) => {
    setSelectedCourse(course);
    document.body.style.overflow = 'hidden';
  };

  const closeCourseModal = () => {
    setSelectedCourse(null);
    document.body.style.overflow = 'auto';
  };

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
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-violet-400 hover:text-violet-300 hover:bg-violet-500/10 rounded-lg transition-all duration-300"
                    onClick={() => openCourseModal(course)}
                  >
                    Explore
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
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
          <p className="mt-2 gradient-text-static">© {new Date().getFullYear()} Brainy. All rights reserved.</p>
        </div>
      </footer>

      {selectedCourse && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={closeCourseModal}
        >
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
            style={{ animation: "fadeIn 0.3s ease-out forwards" }}
          />
          
          <div 
            className="absolute inset-0 pointer-events-none overflow-hidden"
          >
            <div className={`absolute top-1/4 -left-20 w-80 h-80 bg-gradient-to-br ${gradients[courses.indexOf(selectedCourse) % gradients.length]} rounded-full blur-[150px] opacity-30`} 
              style={{ animation: "pulse 3s ease-in-out infinite" }} 
            />
            <div className={`absolute bottom-1/4 -right-20 w-96 h-96 bg-gradient-to-br ${gradients[(courses.indexOf(selectedCourse) + 2) % gradients.length]} rounded-full blur-[180px] opacity-20`} 
              style={{ animation: "pulse 4s ease-in-out infinite", animationDelay: "1s" }} 
            />
          </div>

          <div 
            className="relative w-full max-w-3xl max-h-[85vh] overflow-hidden rounded-3xl"
            onClick={(e) => e.stopPropagation()}
            style={{ animation: "modalSlideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards" }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-2xl border border-white/20 rounded-3xl" />
            
            <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${gradients[courses.indexOf(selectedCourse) % gradients.length]}`} />
            
            <div className="relative">
              <div className="p-6 sm:p-8 border-b border-white/10">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div 
                      className={`relative w-16 h-16 rounded-2xl bg-gradient-to-br ${gradients[courses.indexOf(selectedCourse) % gradients.length]} flex items-center justify-center shadow-2xl`}
                      style={{ animation: "scaleIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards", animationDelay: "0.1s", opacity: 0 }}
                    >
                      <Brain className="w-8 h-8 text-white" />
                      <div className={`absolute -inset-2 bg-gradient-to-br ${gradients[courses.indexOf(selectedCourse) % gradients.length]} rounded-2xl blur-xl opacity-50`} />
                    </div>
                    <div style={{ animation: "slideRight 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards", animationDelay: "0.15s", opacity: 0 }}>
                      <h2 className="text-2xl sm:text-3xl font-bold text-white mb-1">
                        {selectedCourse.name}
                      </h2>
                      <p className="text-gray-400 text-sm sm:text-base">{selectedCourse.description}</p>
                    </div>
                  </div>
                  <button 
                    onClick={closeCourseModal}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 hover:text-white transition-all duration-300 hover:rotate-90 hover:scale-110"
                    style={{ animation: "scaleIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards", animationDelay: "0.2s", opacity: 0 }}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div 
                  className="flex flex-wrap gap-4 mt-6"
                  style={{ animation: "slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards", animationDelay: "0.25s", opacity: 0 }}
                >
                  <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10">
                    <BookOpen className="w-4 h-4 text-violet-400" />
                    <span className="text-sm text-gray-300"><span className="font-semibold text-white">{selectedCourse.subjects.length}</span> Subjects</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10">
                    <Zap className="w-4 h-4 text-amber-400" />
                    <span className="text-sm text-gray-300"><span className="font-semibold text-white">{selectedCourse.subjects.reduce((acc, s) => acc + s.questions.length, 0)}</span> Questions</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10">
                    <Clock className="w-4 h-4 text-cyan-400" />
                    <span className="text-sm text-gray-300"><span className="font-semibold text-white">~{Math.ceil(selectedCourse.subjects.reduce((acc, s) => acc + s.questions.length, 0) * 1.5)}</span> min</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10">
                    <Users className="w-4 h-4 text-pink-400" />
                    <span className="text-sm text-gray-300"><span className="font-semibold text-white">{(Math.random() * 5 + 2).toFixed(1)}k</span> Learners</span>
                  </div>
                </div>
              </div>
              
              <div className="p-6 sm:p-8 max-h-[50vh] overflow-y-auto custom-scrollbar">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4"
                  style={{ animation: "slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards", animationDelay: "0.3s", opacity: 0 }}
                >
                  Available Subjects
                </h3>
                <div className="grid gap-3">
                  {selectedCourse.subjects.map((subject, index) => (
                    <Link 
                      key={subject.id}
                      to={`/quiz/${subject.id}`}
                      onClick={closeCourseModal}
                      className="group relative overflow-hidden rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all duration-500"
                      style={{ 
                        animation: "subjectSlideIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards", 
                        animationDelay: `${0.35 + index * 0.05}s`, 
                        opacity: 0,
                        transform: "translateX(-20px)"
                      }}
                    >
                      <div className={`absolute inset-0 bg-gradient-to-r ${gradients[(courses.indexOf(selectedCourse) + index) % gradients.length]} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                      <div className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${gradients[(courses.indexOf(selectedCourse) + index) % gradients.length]} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                      
                      <div className="relative p-4 sm:p-5 flex items-center gap-4">
                        <div className={`relative w-12 h-12 rounded-xl bg-gradient-to-br ${gradients[(courses.indexOf(selectedCourse) + index) % gradients.length]} flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                          <Zap className="w-6 h-6 text-white" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-white group-hover:text-violet-300 transition-colors duration-300 truncate">
                            {subject.name}
                          </h4>
                          <p className="text-sm text-gray-400 truncate">{subject.description}</p>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <div className="hidden sm:flex items-center gap-2 text-sm text-gray-400">
                            <span className="px-2 py-1 rounded-lg bg-white/5">
                              {subject.questions.length} Q's
                            </span>
                            <div className="flex items-center gap-1">
                              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                              <span className="text-amber-400">{(4 + Math.random()).toFixed(1)}</span>
                            </div>
                          </div>
                          
                          <div className="p-2 rounded-xl bg-white/5 group-hover:bg-gradient-to-r group-hover:from-violet-500 group-hover:to-purple-600 text-gray-400 group-hover:text-white transition-all duration-300 group-hover:scale-110">
                            <Play className="w-4 h-4" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
              
              <div 
                className="p-6 sm:p-8 border-t border-white/10 bg-white/[0.02]"
                style={{ animation: "slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards", animationDelay: "0.5s", opacity: 0 }}
              >
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link to="/services" onClick={closeCourseModal} className="flex-1">
                    <Button 
                      variant="outline" 
                      className="w-full h-12 rounded-xl border-white/10 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-all duration-300"
                    >
                      <BookOpen className="w-4 h-4 mr-2" />
                      View All Courses
                    </Button>
                  </Link>
                  <Link 
                    to={`/quiz/${selectedCourse.subjects[0]?.id}`} 
                    onClick={closeCourseModal}
                    className="flex-1"
                  >
                    <Button 
                      className={`w-full h-12 rounded-xl bg-gradient-to-r ${gradients[courses.indexOf(selectedCourse) % gradients.length]} text-white font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300`}
                    >
                      Start First Subject
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes modalSlideUp {
          from { 
            opacity: 0;
            transform: translateY(30px) scale(0.95);
          }
          to { 
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        @keyframes scaleIn {
          from { 
            opacity: 0;
            transform: scale(0.5);
          }
          to { 
            opacity: 1;
            transform: scale(1);
          }
        }
        
        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(15px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideRight {
          from { 
            opacity: 0;
            transform: translateX(-15px);
          }
          to { 
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes subjectSlideIn {
          from { 
            opacity: 0;
            transform: translateX(-20px);
          }
          to { 
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 0.35; transform: scale(1.05); }
        }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 3px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.15);
          border-radius: 3px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.25);
        }
      `}</style>
    </div>
  );
};

export default Index;
