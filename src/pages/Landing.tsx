import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Brain, 
  Sparkles, 
  Users, 
  Zap, 
  CheckCircle, 
  ArrowRight,
  BookOpen,
  Target,
  Award,
  BarChart3,
  GraduationCap,
  Star
} from "lucide-react";
import { courses } from "@/data/quizData";

const Landing = () => {
  const features = [
    {
      icon: Brain,
      title: "Adaptive Learning",
      description: "AI-powered quizzes that adapt to your knowledge level and learning pace."
    },
    {
      icon: Target,
      title: "Targeted Practice",
      description: "Focus on weak areas with personalized question recommendations."
    },
    {
      icon: BarChart3,
      title: "Progress Tracking",
      description: "Detailed analytics and insights to monitor your improvement over time."
    },
    {
      icon: Award,
      title: "Achievements",
      description: "Earn badges and certificates as you master different subjects."
    },
    {
      icon: BookOpen,
      title: "Comprehensive Content",
      description: "Extensive question bank covering all major engineering disciplines."
    },
    {
      icon: Users,
      title: "Community Learning",
      description: "Connect with peers, share insights, and learn together."
    }
  ];

  const stats = [
    { value: "5+", label: "Engineering Courses" },
    { value: "500+", label: "Practice Questions" },
    { value: "20+", label: "Subject Areas" },
    { value: "100%", label: "Free Access" }
  ];

  const testimonials = [
    {
      name: "Priya Sharma",
      role: "Computer Science, 3rd Year",
      content: "Stats Mastermind helped me ace my semester exams. The quizzes are perfectly aligned with my syllabus!",
      rating: 5
    },
    {
      name: "Rahul Verma",
      role: "Electrical Engineering, 2nd Year",
      content: "The adaptive learning feature is incredible. It identifies my weak points and helps me improve systematically.",
      rating: 5
    },
    {
      name: "Ananya Patel",
      role: "Civil Engineering, 4th Year",
      content: "Best platform for engineering exam preparation. Highly recommend to all engineering students!",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <section className="relative pt-24 pb-20 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-500/5 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-8">
              <Sparkles className="w-4 h-4" />
              Master Statistics & Engineering Concepts
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight">
              Learn Smarter with{" "}
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Stats Mastermind
              </span>
            </h1>

            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
              Interactive quizzes, adaptive learning, and comprehensive coverage of engineering subjects. 
              Your path to academic excellence starts here.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link to="/register">
                <Button size="lg" className="h-14 px-8 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-lg shadow-xl shadow-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/40 transition-all duration-300">
                  Get Started Free
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="h-14 px-8 border-2 font-semibold text-lg">
                  Sign In
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  <div className="text-gray-600 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Everything You Need to{" "}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Excel</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful features designed to enhance your learning experience and help you achieve your academic goals.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white">
                <CardContent className="p-8">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mb-6 shadow-lg shadow-blue-500/30">
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Explore{" "}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Courses</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive coverage across all major engineering disciplines.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.slice(0, 6).map((course, index) => (
              <Card key={`${course.id}-${index}`} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
                <CardContent className="p-0">
                  <div className={`h-2 bg-gradient-to-r ${course.color}`} />
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${course.color} flex items-center justify-center`}>
                        <GraduationCap className="w-6 h-6 text-white" />
                      </div>
                      <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-sm font-medium">
                        {course.subjects.length} Subjects
                      </span>
                    </div>
                    <h3 className="text-lg font-bold mb-2">{course.name}</h3>
                    <p className="text-gray-600 text-sm mb-4">{course.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {course.subjects.slice(0, 3).map((subject) => (
                        <span key={subject.id} className="px-2 py-1 rounded bg-gray-100 text-gray-700 text-xs">
                          {subject.name}
                        </span>
                      ))}
                      {course.subjects.length > 3 && (
                        <span className="px-2 py-1 rounded bg-blue-100 text-blue-700 text-xs">
                          +{course.subjects.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/register">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                Start Learning Now
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Loved by{" "}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Students</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              See what engineering students are saying about Stats Mastermind.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-lg bg-white">
                <CardContent className="p-8">
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-6 italic">"{testimonial.content}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-gray-500">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Ready to Master Your Subjects?
          </h2>
          <p className="text-xl text-blue-100 mb-10">
            Join thousands of engineering students who are already improving their knowledge with Stats Mastermind.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" className="h-14 px-8 bg-white text-blue-600 hover:bg-gray-100 font-semibold text-lg shadow-xl">
                Create Free Account
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
          <p className="text-blue-200 mt-6 text-sm">
            No credit card required. Start learning instantly.
          </p>
        </div>
      </section>

      <footer className="py-12 bg-gray-900 text-gray-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <span className="font-bold text-xl text-white">Stats Mastermind</span>
            </div>
            <div className="flex gap-8">
              <Link to="/about" className="hover:text-white transition-colors">About</Link>
              <Link to="/contact" className="hover:text-white transition-colors">Contact</Link>
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
            </div>
            <p className="text-sm">
              © {new Date().getFullYear()} Stats Mastermind. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
