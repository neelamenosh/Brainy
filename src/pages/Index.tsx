import { Brain, Sparkles, Users, Zap, BookOpen, Target, Trophy, Clock, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { courses, quizCategories } from "@/data/quizData";

const Index = () => {
  const { user } = useAuth();
  
  const totalQuestions = quizCategories.reduce((acc, cat) => acc + cat.questions.length, 0);

  return (
    <div className="min-h-screen pt-20 pb-12 bg-gradient-to-br from-gray-50 to-white">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-6">
                <Sparkles className="w-4 h-4" />
                Welcome back, {user?.fullName?.split(" ")[0]}!
              </div>

              <h1 className="text-4xl sm:text-5xl font-extrabold mb-6 leading-tight">
                Continue Your{" "}
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Learning Journey
                </span>
              </h1>

              <p className="text-lg text-gray-600 max-w-xl mb-8">
                Pick up where you left off. Explore quizzes across multiple engineering subjects 
                and track your progress towards mastery.
              </p>

              <div className="flex flex-wrap justify-center lg:justify-start gap-6 mb-8">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-blue-100">
                    <Brain className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="text-left">
                    <div className="text-2xl font-bold text-gray-900">{courses.length}</div>
                    <div className="text-sm text-gray-500">Courses</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-indigo-100">
                    <BookOpen className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div className="text-left">
                    <div className="text-2xl font-bold text-gray-900">{quizCategories.length}</div>
                    <div className="text-sm text-gray-500">Subjects</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-purple-100">
                    <Zap className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="text-left">
                    <div className="text-2xl font-bold text-gray-900">{totalQuestions}+</div>
                    <div className="text-sm text-gray-500">Questions</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1 w-full max-w-md">
              <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-blue-600" />
                    Quick Actions
                  </CardTitle>
                  <CardDescription>Jump right into learning</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Link to={`/quiz/${quizCategories[0]?.id}`} className="block">
                    <Button className="w-full justify-between bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                      Start a Random Quiz
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Link to="/services" className="block">
                    <Button variant="outline" className="w-full justify-between">
                      Browse All Subjects
                      <BookOpen className="w-4 h-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-2">Featured Courses</h2>
            <p className="text-gray-600">Start learning from our comprehensive course catalog</p>
          </div>
          <Link to="/services">
            <Button variant="outline" className="hidden sm:flex">
              View All
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.slice(0, 3).map((course, index) => (
            <Card key={`course-${course.id}-${index}`} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden group">
              <CardContent className="p-0">
                <div className={`h-2 bg-gradient-to-r ${course.color}`} />
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${course.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                      <Brain className="w-6 h-6 text-white" />
                    </div>
                    <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-sm font-medium">
                      {course.subjects.length} Subjects
                    </span>
                  </div>
                  <h3 className="text-lg font-bold mb-2 group-hover:text-blue-600 transition-colors">{course.name}</h3>
                  <p className="text-gray-600 text-sm mb-4">{course.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex -space-x-2">
                      {course.subjects.slice(0, 3).map((subject, i) => (
                        <div key={subject.id} className={`w-8 h-8 rounded-full bg-gradient-to-r ${subject.color} border-2 border-white flex items-center justify-center text-xs text-white font-bold`}>
                          {subject.name.charAt(0)}
                        </div>
                      ))}
                      {course.subjects.length > 3 && (
                        <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs font-medium text-gray-600">
                          +{course.subjects.length - 3}
                        </div>
                      )}
                    </div>
                    <Link to="/services">
                      <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                        Explore
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-2">Popular Subjects</h2>
            <p className="text-gray-600">Choose a subject and start practicing</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quizCategories.slice(0, 8).map((category, index) => (
            <Link key={`cat-${category.id}-${index}`} to={`/quiz/${category.id}`}>
              <Card className="border-0 shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-1 h-full">
                <CardContent className="p-5">
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${category.color} flex items-center justify-center mb-3`}>
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">{category.name}</h3>
                  <p className="text-sm text-gray-500">{category.questions.length} questions</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link to="/services">
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
              Browse All Subjects
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 border-t border-gray-200">
        <div className="text-center text-gray-500 text-sm">
          <p>Built with passion for learning. Start a quiz and challenge yourself today!</p>
          <p className="mt-2">© {new Date().getFullYear()} Stats Mastermind. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
