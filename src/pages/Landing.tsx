import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
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
  Star,
  Flame,
  Trophy,
  Rocket
} from "lucide-react";
import { courses } from "@/data/quizData";

const Landing = () => {
  const features = [
    {
      icon: Brain,
      title: "Adaptive Learning",
      description: "AI-powered quizzes that adapt to your knowledge level and learning pace.",
      gradient: "from-violet-500 to-purple-600"
    },
    {
      icon: Target,
      title: "Targeted Practice",
      description: "Focus on weak areas with personalized question recommendations.",
      gradient: "from-pink-500 to-rose-600"
    },
    {
      icon: BarChart3,
      title: "Progress Tracking",
      description: "Detailed analytics and insights to monitor your improvement over time.",
      gradient: "from-orange-500 to-amber-600"
    },
    {
      icon: Award,
      title: "Achievements",
      description: "Earn badges and certificates as you master different subjects.",
      gradient: "from-cyan-500 to-teal-600"
    },
    {
      icon: BookOpen,
      title: "Comprehensive Content",
      description: "Extensive question bank covering all major engineering disciplines.",
      gradient: "from-fuchsia-500 to-pink-600"
    },
    {
      icon: Users,
      title: "Community Learning",
      description: "Connect with peers, share insights, and learn together.",
      gradient: "from-indigo-500 to-violet-600"
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
      content: "Brainy helped me ace my semester exams. The quizzes are perfectly aligned with my syllabus!",
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

  const gradients = [
    "from-violet-500 to-purple-600",
    "from-pink-500 to-rose-600",
    "from-orange-500 to-amber-600",
    "from-cyan-500 to-teal-600",
    "from-fuchsia-500 to-pink-600",
    "from-indigo-500 to-violet-600",
  ];

  return (
    <div className="min-h-screen bg-mesh noise-overlay">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 -left-32 w-[500px] h-[500px] bg-violet-500/20 rounded-full blur-[150px] morph-blob float-slow" />
        <div className="absolute top-40 -right-32 w-[600px] h-[600px] bg-pink-500/15 rounded-full blur-[180px] morph-blob float-medium" style={{ animationDelay: "-2s" }} />
        <div className="absolute bottom-40 left-1/4 w-[400px] h-[400px] bg-orange-500/10 rounded-full blur-[120px] morph-blob float-fast" style={{ animationDelay: "-4s" }} />
        <div className="absolute -bottom-32 right-1/4 w-[500px] h-[500px] bg-fuchsia-500/15 rounded-full blur-[150px] morph-blob float-slow" style={{ animationDelay: "-3s" }} />
      </div>

      <section className="relative pt-28 pb-20 overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full liquid-glass text-sm font-medium mb-8 slide-up" style={{ opacity: 0, animationDelay: "0.1s" }}>
              <Sparkles className="w-4 h-4 text-violet-400" />
              <span className="gradient-text-static">Master Statistics & Engineering Concepts</span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight slide-up" style={{ opacity: 0, animationDelay: "0.2s" }}>
              <span className="text-white">Learn Smarter with</span>
              <br />
              <span className="gradient-text-aurora text-glow">Brainy</span>
            </h1>

            <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10 slide-up" style={{ opacity: 0, animationDelay: "0.3s" }}>
              Interactive quizzes, adaptive learning, and comprehensive coverage of engineering subjects. 
              Your path to academic excellence starts here.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 slide-up" style={{ opacity: 0, animationDelay: "0.4s" }}>
              <Link to="/register">
                <Button size="lg" className="h-14 px-8 rounded-2xl btn-liquid gradient-aurora text-white font-semibold text-lg shadow-xl glow-violet">
                  <Rocket className="w-5 h-5 mr-2" />
                  Get Started Free
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="h-14 px-8 rounded-2xl border-white/20 bg-white/5 hover:bg-white/10 text-white font-semibold text-lg transition-all duration-300">
                  Sign In
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 slide-up" style={{ opacity: 0, animationDelay: "0.5s" }}>
              {stats.map((stat, index) => (
                <div key={index} className="liquid-glass-card rounded-2xl p-5 hover-lift">
                  <div className="text-3xl sm:text-4xl font-bold gradient-text-static mb-1">
                    {stat.value}
                  </div>
                  <div className="text-gray-400 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="relative py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 slide-up" style={{ opacity: 0, animationDelay: "0.1s" }}>
              <span className="text-white">Everything You Need to </span>
              <span className="gradient-text-static">Excel</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto slide-up" style={{ opacity: 0, animationDelay: "0.2s" }}>
              Powerful features designed to enhance your learning experience and help you achieve your academic goals.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="liquid-glass-card rounded-3xl p-8 card-3d hover-glow slide-up"
                style={{ opacity: 0, animationDelay: `${0.3 + index * 0.1}s` }}
              >
                <div className={`relative w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 shadow-lg`}>
                  <feature.icon className="w-7 h-7 text-white" />
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.gradient} blur-xl opacity-50`} />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 slide-up" style={{ opacity: 0, animationDelay: "0.1s" }}>
              <span className="text-white">Explore </span>
              <span className="gradient-text-static">Courses</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto slide-up" style={{ opacity: 0, animationDelay: "0.2s" }}>
              Comprehensive coverage across all major engineering disciplines.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.slice(0, 6).map((course, index) => (
              <div 
                key={`${course.id}-${index}`} 
                className="liquid-glass-card rounded-3xl overflow-hidden card-3d hover-glow slide-up"
                style={{ opacity: 0, animationDelay: `${0.3 + index * 0.1}s` }}
              >
                <div className={`h-1.5 bg-gradient-to-r ${gradients[index % gradients.length]}`} />
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`relative w-12 h-12 rounded-xl bg-gradient-to-br ${gradients[index % gradients.length]} flex items-center justify-center shadow-lg`}>
                      <GraduationCap className="w-6 h-6 text-white" />
                      <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${gradients[index % gradients.length]} blur-lg opacity-50`} />
                    </div>
                    <span className="px-3 py-1.5 rounded-full liquid-glass text-gray-300 text-sm font-medium">
                      {course.subjects.length} Subjects
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{course.name}</h3>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">{course.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {course.subjects.slice(0, 3).map((subject) => (
                      <span key={subject.id} className="px-2.5 py-1 rounded-lg liquid-glass text-gray-300 text-xs font-medium">
                        {subject.name}
                      </span>
                    ))}
                    {course.subjects.length > 3 && (
                      <span className="px-2.5 py-1 rounded-lg bg-violet-500/20 text-violet-300 text-xs font-medium">
                        +{course.subjects.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12 slide-up" style={{ opacity: 0, animationDelay: "0.9s" }}>
            <Link to="/register">
              <Button size="lg" className="h-14 px-8 rounded-2xl btn-liquid gradient-aurora text-white font-semibold shadow-xl glow-violet">
                Start Learning Now
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="relative py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 slide-up" style={{ opacity: 0, animationDelay: "0.1s" }}>
              <span className="text-white">Loved by </span>
              <span className="gradient-text-static">Students</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto slide-up" style={{ opacity: 0, animationDelay: "0.2s" }}>
              See what engineering students are saying about Brainy.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index} 
                className="liquid-glass-strong rounded-3xl p-8 card-3d hover-glow slide-up"
                style={{ opacity: 0, animationDelay: `${0.3 + index * 0.1}s` }}
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-gray-300 mb-6 italic leading-relaxed">"{testimonial.content}"</p>
                <div className="flex items-center gap-3">
                  <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${gradients[index % gradients.length]} flex items-center justify-center text-white font-semibold`}>
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-white">{testimonial.name}</p>
                    <p className="text-sm text-gray-400">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="liquid-glass-strong rounded-3xl p-10 md:p-16 text-center glow-mixed slide-up" style={{ opacity: 0, animationDelay: "0.1s" }}>
            <div className="flex justify-center mb-6">
              <div className="p-4 rounded-2xl gradient-aurora pulse-glow">
                <Trophy className="w-10 h-10 text-white" />
              </div>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              Ready to Master Your Subjects?
            </h2>
            <p className="text-xl text-gray-400 mb-10">
              Join thousands of engineering students who are already improving their knowledge with Brainy.
            </p>
            <Link to="/register">
              <Button size="lg" className="h-14 px-10 rounded-2xl btn-liquid gradient-sunset text-white font-semibold text-lg shadow-xl glow-pink">
                <Flame className="w-5 h-5 mr-2" />
                Create Free Account
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <p className="text-gray-500 mt-6 text-sm">
              No credit card required. Start learning instantly.
            </p>
          </div>
        </div>
      </section>

      <footer className="relative py-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl gradient-aurora shadow-lg">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <span className="font-bold text-xl gradient-text-aurora">Brainy</span>
            </div>
            <div className="flex gap-8">
              <Link to="/about" className="text-gray-400 hover:text-white transition-colors">About</Link>
              <Link to="/contact" className="text-gray-400 hover:text-white transition-colors">Contact</Link>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Terms</a>
            </div>
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} <span className="gradient-text-static">Brainy</span>. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
