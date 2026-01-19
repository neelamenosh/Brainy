import { useState, useEffect } from "react";
import { Brain, Sparkles, Zap, BookOpen, Target, ArrowRight, Trophy, Flame, Star, X, Play, Clock, Users, ChevronRight, TrendingUp, Award, BarChart3, PieChart, Activity, GraduationCap, CheckCircle, AlertTriangle, UserCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { courses, quizCategories, Course } from "@/data/quizData";

interface SubjectScore {
  score: number;
  totalQuestions: number;
  percentage: number;
  completedAt: string;
}

interface Student {
  id: string;
  rollNumber: string;
  fullName: string;
  email: string;
  department: string;
  course: string;
  semester: number;
  totalQuizzes: number;
  totalScore: number;
  totalQuestions: number;
  overallPercentage: number;
  subjectScores: Record<string, SubjectScore>;
  lastActive: string;
}

interface FacultyStats {
  totalStudents: number;
  activeStudents: number;
  avgScore: number;
  totalQuizzesAttempted: number;
  topPerformers: number;
  needsAttention: number;
  subjectPerformance: { name: string; avgScore: number; attempts: number }[];
  recentActivity: { name: string; action: string; time: string; score?: number }[];
  gradeDistribution: { grade: string; count: number; color: string }[];
}

const FacultyHome = () => {
  const { user, token } = useAuth();
  const [stats, setStats] = useState<FacultyStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState<Student[]>([]);

  useEffect(() => {
    fetchFacultyData();
  }, []);

  const fetchFacultyData = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/faculty/students', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      
      if (response.ok) {
        setStudents(data.students);
        calculateStats(data.students);
      }
    } catch (error) {
      console.error('Failed to fetch faculty data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (studentList: Student[]) => {
    const totalStudents = studentList.length;
    const activeStudents = studentList.filter(s => s.totalQuizzes > 0).length;
    const avgScore = totalStudents > 0 
      ? Math.round(studentList.reduce((acc, s) => acc + s.overallPercentage, 0) / totalStudents)
      : 0;
    const totalQuizzesAttempted = studentList.reduce((acc, s) => acc + s.totalQuizzes, 0);
    const topPerformers = studentList.filter(s => s.overallPercentage >= 80).length;
    const needsAttention = studentList.filter(s => s.overallPercentage > 0 && s.overallPercentage < 50).length;

    const subjectMap: Record<string, { total: number; count: number }> = {};
    studentList.forEach(student => {
      Object.entries(student.subjectScores).forEach(([subjectId, score]) => {
        if (!subjectMap[subjectId]) {
          subjectMap[subjectId] = { total: 0, count: 0 };
        }
        subjectMap[subjectId].total += score.percentage;
        subjectMap[subjectId].count += 1;
      });
    });

    const subjectPerformance = Object.entries(subjectMap).map(([id, data]) => {
      const subject = quizCategories.find(c => c.id === id);
      return {
        name: subject?.name || id,
        avgScore: Math.round(data.total / data.count),
        attempts: data.count
      };
    }).sort((a, b) => b.attempts - a.attempts).slice(0, 5);

    const gradeDistribution = [
      { grade: 'A+ (90-100%)', count: studentList.filter(s => s.overallPercentage >= 90).length, color: 'from-emerald-500 to-green-600' },
      { grade: 'A (80-89%)', count: studentList.filter(s => s.overallPercentage >= 80 && s.overallPercentage < 90).length, color: 'from-green-500 to-teal-600' },
      { grade: 'B (70-79%)', count: studentList.filter(s => s.overallPercentage >= 70 && s.overallPercentage < 80).length, color: 'from-cyan-500 to-blue-600' },
      { grade: 'C (60-69%)', count: studentList.filter(s => s.overallPercentage >= 60 && s.overallPercentage < 70).length, color: 'from-yellow-500 to-amber-600' },
      { grade: 'D (50-59%)', count: studentList.filter(s => s.overallPercentage >= 50 && s.overallPercentage < 60).length, color: 'from-orange-500 to-red-600' },
      { grade: 'F (<50%)', count: studentList.filter(s => s.overallPercentage > 0 && s.overallPercentage < 50).length, color: 'from-red-500 to-rose-600' },
    ];

    const recentActivity = studentList
      .filter(s => s.totalQuizzes > 0)
      .sort((a, b) => new Date(b.lastActive).getTime() - new Date(a.lastActive).getTime())
      .slice(0, 5)
      .map(s => ({
        name: s.fullName,
        action: `Completed ${s.totalQuizzes} quiz${s.totalQuizzes > 1 ? 'zes' : ''}`,
        time: new Date(s.lastActive).toLocaleDateString(),
        score: s.overallPercentage
      }));

    setStats({
      totalStudents,
      activeStudents,
      avgScore,
      totalQuizzesAttempted,
      topPerformers,
      needsAttention,
      subjectPerformance,
      recentActivity,
      gradeDistribution
    });
  };

  const gradients = [
    "from-violet-500 to-purple-600",
    "from-pink-500 to-rose-600",
    "from-cyan-500 to-teal-600",
    "from-amber-500 to-orange-600",
    "from-emerald-500 to-green-600",
    "from-indigo-500 to-violet-600",
  ];

  if (loading) {
    return (
      <div className="min-h-screen pt-20 pb-12 bg-mesh noise-overlay flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-violet-500/30 border-t-violet-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-12 bg-mesh noise-overlay">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 -left-32 w-96 h-96 bg-violet-500/20 rounded-full blur-[120px] morph-blob float-slow" />
        <div className="absolute top-40 -right-32 w-[500px] h-[500px] bg-pink-500/15 rounded-full blur-[150px] morph-blob float-medium" style={{ animationDelay: "-2s" }} />
        <div className="absolute bottom-20 left-1/4 w-80 h-80 bg-cyan-500/10 rounded-full blur-[100px] morph-blob float-fast" style={{ animationDelay: "-4s" }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-8">
          <div className="slide-up" style={{ opacity: 0, animationDelay: "0.1s" }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full liquid-glass text-sm font-medium mb-4">
              <GraduationCap className="w-4 h-4 text-violet-400" />
              <span className="text-gray-300">Faculty Dashboard</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2">
              Welcome back, <span className="gradient-text-aurora">{user?.fullName?.split(" ")[0]}!</span>
            </h1>
            <p className="text-gray-400">Monitor student progress and performance analytics</p>
          </div>
          
          <Link to="/services" className="slide-up" style={{ opacity: 0, animationDelay: "0.2s" }}>
            <Button className="rounded-xl gradient-aurora text-white font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105">
              <Users className="w-4 h-4 mr-2" />
              View All Students
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {[
            { icon: Users, label: "Total Students", value: stats?.totalStudents || 0, color: "from-violet-500 to-purple-600", delay: "0.3s" },
            { icon: UserCheck, label: "Active", value: stats?.activeStudents || 0, color: "from-emerald-500 to-green-600", delay: "0.35s" },
            { icon: TrendingUp, label: "Avg Score", value: `${stats?.avgScore || 0}%`, color: "from-cyan-500 to-teal-600", delay: "0.4s" },
            { icon: BookOpen, label: "Quizzes Taken", value: stats?.totalQuizzesAttempted || 0, color: "from-pink-500 to-rose-600", delay: "0.45s" },
            { icon: Award, label: "Top Performers", value: stats?.topPerformers || 0, color: "from-amber-500 to-orange-600", delay: "0.5s" },
            { icon: AlertTriangle, label: "Needs Help", value: stats?.needsAttention || 0, color: "from-red-500 to-rose-600", delay: "0.55s" },
          ].map((stat) => (
            <div 
              key={stat.label}
              className="liquid-glass-card rounded-2xl p-4 hover-lift slide-up"
              style={{ opacity: 0, animationDelay: stat.delay }}
            >
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3 shadow-lg`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-xs text-gray-400">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 liquid-glass-strong rounded-3xl p-6 slide-up" style={{ opacity: 0, animationDelay: "0.6s" }}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl gradient-aurora">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Grade Distribution</h3>
                  <p className="text-sm text-gray-400">Student performance overview</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {stats?.gradeDistribution.map((grade, index) => {
                const maxCount = Math.max(...(stats?.gradeDistribution.map(g => g.count) || [1]));
                const percentage = maxCount > 0 ? (grade.count / maxCount) * 100 : 0;
                
                return (
                  <div key={grade.grade} className="group">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-300">{grade.grade}</span>
                      <span className="text-sm font-bold text-white">{grade.count} students</span>
                    </div>
                    <div className="h-8 bg-white/5 rounded-xl overflow-hidden relative">
                      <div 
                        className={`h-full bg-gradient-to-r ${grade.color} rounded-xl transition-all duration-1000 ease-out flex items-center justify-end pr-3`}
                        style={{ 
                          width: `${Math.max(percentage, 5)}%`,
                          animation: `expandWidth 1s ease-out ${0.1 * index}s forwards`,
                          opacity: 0
                        }}
                      >
                        {grade.count > 0 && (
                          <span className="text-xs font-bold text-white/90">
                            {Math.round((grade.count / (stats?.totalStudents || 1)) * 100)}%
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="liquid-glass-strong rounded-3xl p-6 slide-up" style={{ opacity: 0, animationDelay: "0.7s" }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 rounded-xl gradient-sunset">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Recent Activity</h3>
                <p className="text-sm text-gray-400">Latest student actions</p>
              </div>
            </div>

            <div className="space-y-4">
              {stats?.recentActivity.length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-8">No recent activity</p>
              ) : (
                stats?.recentActivity.map((activity, index) => (
                  <div 
                    key={index}
                    className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                    style={{ animation: `fadeSlideIn 0.5s ease-out ${0.1 * index}s forwards`, opacity: 0 }}
                  >
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradients[index % gradients.length]} flex items-center justify-center text-white font-bold text-sm`}>
                      {activity.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{activity.name}</p>
                      <p className="text-xs text-gray-400">{activity.action}</p>
                    </div>
                    <div className="text-right">
                      {activity.score !== undefined && (
                        <p className={`text-sm font-bold ${activity.score >= 70 ? 'text-emerald-400' : activity.score >= 50 ? 'text-amber-400' : 'text-red-400'}`}>
                          {activity.score}%
                        </p>
                      )}
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <div className="liquid-glass-strong rounded-3xl p-6 slide-up" style={{ opacity: 0, animationDelay: "0.8s" }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 rounded-xl gradient-ocean">
                <PieChart className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Subject Performance</h3>
                <p className="text-sm text-gray-400">Average scores by subject</p>
              </div>
            </div>

            {stats?.subjectPerformance.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-12">No quiz data available yet</p>
            ) : (
              <div className="space-y-4">
                {stats?.subjectPerformance.map((subject, index) => (
                  <div key={subject.name} className="group">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${gradients[index % gradients.length]}`} />
                        <span className="text-sm font-medium text-gray-300">{subject.name}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-gray-500">{subject.attempts} attempts</span>
                        <span className={`text-sm font-bold ${subject.avgScore >= 70 ? 'text-emerald-400' : subject.avgScore >= 50 ? 'text-amber-400' : 'text-red-400'}`}>
                          {subject.avgScore}%
                        </span>
                      </div>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                      <div 
                        className={`h-full bg-gradient-to-r ${gradients[index % gradients.length]} rounded-full`}
                        style={{ 
                          width: `${subject.avgScore}%`,
                          animation: `expandWidth 1s ease-out ${0.1 * index}s forwards`,
                          opacity: 0
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="liquid-glass-strong rounded-3xl p-6 slide-up" style={{ opacity: 0, animationDelay: "0.9s" }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 rounded-xl gradient-aurora">
                <Trophy className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Top Performers</h3>
                <p className="text-sm text-gray-400">Students with highest scores</p>
              </div>
            </div>

            {students.filter(s => s.overallPercentage > 0).length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-12">No quiz completions yet</p>
            ) : (
              <div className="space-y-3">
                {students
                  .filter(s => s.overallPercentage > 0)
                  .sort((a, b) => b.overallPercentage - a.overallPercentage)
                  .slice(0, 5)
                  .map((student, index) => (
                    <div 
                      key={student.id}
                      className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                      style={{ animation: `fadeSlideIn 0.5s ease-out ${0.1 * index}s forwards`, opacity: 0 }}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
                        index === 0 ? 'bg-gradient-to-br from-amber-400 to-yellow-500 text-amber-900' :
                        index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-400 text-gray-700' :
                        index === 2 ? 'bg-gradient-to-br from-orange-400 to-amber-600 text-orange-900' :
                        'bg-white/10 text-gray-400'
                      }`}>
                        {index + 1}
                      </div>
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white font-bold">
                        {student.fullName.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">{student.fullName}</p>
                        <p className="text-xs text-gray-400">{student.totalQuizzes} quizzes completed</p>
                      </div>
                      <div className={`px-3 py-1.5 rounded-lg font-bold text-sm ${
                        student.overallPercentage >= 90 ? 'bg-emerald-500/20 text-emerald-400' :
                        student.overallPercentage >= 70 ? 'bg-green-500/20 text-green-400' :
                        'bg-amber-500/20 text-amber-400'
                      }`}>
                        {student.overallPercentage}%
                      </div>
                    </div>
                  ))
                }
              </div>
            )}
          </div>
        </div>

        <div className="liquid-glass-strong rounded-3xl p-8 text-center slide-up glow-mixed" style={{ opacity: 0, animationDelay: "1s" }}>
          <div className="flex justify-center mb-6">
            <div className="p-4 rounded-2xl gradient-aurora pulse-glow">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Quick Actions
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto mb-8">
            Manage your students and track their progress effectively
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/services">
              <Button size="lg" className="h-14 px-8 rounded-2xl btn-liquid gradient-aurora text-white font-semibold shadow-xl glow-violet">
                <Users className="w-5 h-5 mr-2" />
                View All Students
              </Button>
            </Link>
            <Link to="/about">
              <Button size="lg" variant="outline" className="h-14 px-8 rounded-2xl border-white/10 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white">
                <BookOpen className="w-5 h-5 mr-2" />
                About Platform
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes expandWidth {
          from { 
            width: 0;
            opacity: 0;
          }
          to { 
            opacity: 1;
          }
        }
        
        @keyframes fadeSlideIn {
          from { 
            opacity: 0;
            transform: translateX(-10px);
          }
          to { 
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
};

const StudentHome = () => {
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
              ].map((stat) => (
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

const Index = () => {
  const { user } = useAuth();
  
  if (user?.role === 'Faculty') {
    return <FacultyHome />;
  }
  
  return <StudentHome />;
};

export default Index;
