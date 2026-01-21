import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Brain, 
  Sparkles, 
  ArrowRight,
  GraduationCap,
  Star,
  Flame,
  Trophy,
  Rocket
} from "lucide-react";
import { courses } from "@/data/quizData";

const Landing = () => {
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
    "from-muted-teal to-deep-teal",
    "from-deep-teal to-dark-slate-grey",
    "from-ash-grey to-muted-teal",
    "from-dark-slate-grey to-charcoal-blue",
    "from-muted-teal to-ash-grey",
    "from-deep-teal to-muted-teal",
  ];

  return (
    <div className="min-h-screen bg-mesh noise-overlay">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 -left-32 w-80 h-80 bg-primary/10 rounded-full blur-3xl opacity-50" />
        <div className="absolute top-40 -right-32 w-96 h-96 bg-primary/8 rounded-full blur-3xl opacity-40" />
        <div className="absolute bottom-40 left-1/4 w-72 h-72 bg-secondary/20 rounded-full blur-3xl opacity-40" />
      </div>

      <section className="relative pt-28 pb-16 overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full liquid-glass text-sm font-medium mb-8 slide-up stagger-1">
              <Sparkles className="w-4 h-4 text-muted-teal" />
              <span className="gradient-text-static">Master Statistics & Engineering Concepts</span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight slide-up stagger-2">
              <span className="text-foreground">Learn Smarter with</span>
              <br />
              <span className="gradient-text-aurora text-glow">Brainy</span>
            </h1>

            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 slide-up stagger-3">
              Interactive quizzes, adaptive learning, and comprehensive coverage of engineering subjects. 
              Your path to academic excellence starts here.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 slide-up stagger-4">
              <Link to="/register">
                <Button size="xl" className="h-14 px-8 rounded-2xl font-semibold text-lg">
                  <Rocket className="w-5 h-5 mr-2" />
                  Get Started 
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to="/login">
                <Button size="xl" variant="outline" className="h-14 px-8 rounded-2xl font-semibold text-lg">
                  Sign In
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 slide-up stagger-5">
              {stats.map((stat, index) => (
                <div key={index} className="liquid-glass-card rounded-2xl p-5 hover-lift">
                  <div className="text-3xl sm:text-4xl font-bold gradient-text-static mb-1">
                    {stat.value}
                  </div>
                  <div className="text-muted-foreground text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative pt-12 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 slide-up stagger-1">
              <span className="text-foreground">Explore </span>
              <span className="gradient-text-static">Courses</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto slide-up stagger-2">
              Comprehensive coverage across all major engineering disciplines.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.slice(0, 6).map((course, index) => (
              <div 
                key={`${course.id}-${index}`} 
                className={`liquid-glass-card rounded-3xl overflow-hidden card-3d hover-glow fade-in stagger-${Math.min(index + 3, 6)}`}
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
                  <h3 className="text-lg font-bold text-foreground mb-2">{course.name}</h3>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{course.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {course.subjects.slice(0, 3).map((subject) => (
                      <span key={subject.id} className="px-2.5 py-1 rounded-lg liquid-glass text-foreground/80 text-xs font-medium">
                        {subject.name}
                      </span>
                    ))}
                    {course.subjects.length > 3 && (
                      <span className="px-2.5 py-1 rounded-lg bg-muted-teal/20 text-muted-teal text-xs font-medium">
                        +{course.subjects.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12 slide-up stagger-6">
            <Link to="/register">
              <Button size="xl" className="h-14 px-8 rounded-2xl font-semibold">
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
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 slide-up stagger-1">
              <span className="text-foreground">Loved by </span>
              <span className="gradient-text-static">Students</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto slide-up stagger-2">
              See what engineering students are saying about Brainy.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index} 
                className={`liquid-glass-strong rounded-3xl p-8 card-3d hover-glow fade-in stagger-${Math.min(index + 3, 6)}`}
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
          <div className="liquid-glass-strong rounded-3xl p-10 md:p-16 text-center glow-mixed slide-up stagger-1">
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
