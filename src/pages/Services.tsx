import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  GraduationCap, 
  TrendingUp, 
  Send, 
  Search, 
  Filter, 
  ChevronDown, 
  ChevronUp,
  Award,
  BookOpen,
  Clock,
  CheckCircle,
  XCircle,
  Sparkles,
  X,
  FileText,
  Mail,
  AlertCircle
} from "lucide-react";
import { quizCategories } from "@/data/quizData";

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

const Services = () => {
  const { user, token } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [expandedStudent, setExpandedStudent] = useState<string | null>(null);
  const [showSendModal, setShowSendModal] = useState(false);
  const [sendMessage, setSendMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [notification, setNotification] = useState<{type: 'success' | 'error', message: string} | null>(null);

  const isFaculty = user?.role === 'Faculty';

  useEffect(() => {
    if (isFaculty) {
      fetchStudents();
    } else {
      setLoading(false);
    }
  }, [isFaculty]);

  const fetchStudents = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/faculty/students', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (response.ok) {
        setStudents(data.students);
      }
    } catch (error) {
      console.error('Failed to fetch students:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSubjectName = (subjectId: string) => {
    const subject = quizCategories.find(cat => cat.id === subjectId);
    return subject?.name || subjectId;
  };

  const filteredStudents = students.filter(student =>
    student.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectStudent = (studentId: string) => {
    setSelectedStudents(prev =>
      prev.includes(studentId)
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleSelectAll = () => {
    if (selectedStudents.length === filteredStudents.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(filteredStudents.map(s => s.id));
    }
  };

  const handleSendToAdmin = async () => {
    if (selectedStudents.length === 0) return;
    
    setSending(true);
    try {
      const response = await fetch('http://localhost:3001/api/faculty/send-to-admin', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          studentIds: selectedStudents,
          message: sendMessage,
          reportType: 'progress_report'
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        setNotification({ type: 'success', message: 'Report sent to admin successfully!' });
        setShowSendModal(false);
        setSelectedStudents([]);
        setSendMessage("");
      } else {
        setNotification({ type: 'error', message: data.error || 'Failed to send report' });
      }
    } catch (error) {
      setNotification({ type: 'error', message: 'Failed to send report to admin' });
    } finally {
      setSending(false);
    }
  };

  const getGradeColor = (percentage: number) => {
    if (percentage >= 90) return 'text-emerald-400';
    if (percentage >= 75) return 'text-green-400';
    if (percentage >= 60) return 'text-yellow-400';
    if (percentage >= 40) return 'text-orange-400';
    return 'text-red-400';
  };

  const getGradeBg = (percentage: number) => {
    if (percentage >= 90) return 'bg-emerald-500/20 border-emerald-500/30';
    if (percentage >= 75) return 'bg-green-500/20 border-green-500/30';
    if (percentage >= 60) return 'bg-yellow-500/20 border-yellow-500/30';
    if (percentage >= 40) return 'bg-orange-500/20 border-orange-500/30';
    return 'bg-red-500/20 border-red-500/30';
  };

  if (!isFaculty) {
    return (
      <div className="min-h-screen pt-20 pb-12 bg-mesh noise-overlay">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="liquid-glass-strong rounded-3xl p-8 text-center">
            <AlertCircle className="w-16 h-16 text-amber-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white mb-2">Access Restricted</h1>
            <p className="text-gray-400 mb-6">
              This page is only accessible to faculty members.
            </p>
            <Link to="/home">
              <Button className="rounded-xl gradient-aurora text-white">
                Back to Home
              </Button>
            </Link>
          </div>
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
        {notification && (
          <div 
            className={`fixed top-24 right-4 z-50 px-6 py-4 rounded-2xl shadow-2xl border backdrop-blur-xl flex items-center gap-3 animate-in slide-in-from-right ${
              notification.type === 'success' 
                ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400' 
                : 'bg-red-500/20 border-red-500/30 text-red-400'
            }`}
            style={{ animation: 'slideInRight 0.3s ease-out' }}
          >
            {notification.type === 'success' ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <XCircle className="w-5 h-5" />
            )}
            <span className="font-medium">{notification.message}</span>
            <button 
              onClick={() => setNotification(null)}
              className="ml-2 p-1 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-8">
          <div className="slide-up" style={{ opacity: 0, animationDelay: "0.1s" }}>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 rounded-2xl gradient-aurora">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white">Faculty Dashboard</h1>
            </div>
            <p className="text-gray-400">Monitor student progress and performance</p>
          </div>

          <div className="flex flex-wrap gap-3 slide-up" style={{ opacity: 0, animationDelay: "0.2s" }}>
            {selectedStudents.length > 0 && (
              <Button 
                onClick={() => setShowSendModal(true)}
                className="rounded-xl gradient-sunset text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <Send className="w-4 h-4 mr-2" />
                Send to Admin ({selectedStudents.length})
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { icon: Users, label: "Total Students", value: students.length, color: "from-violet-500 to-purple-600" },
            { icon: BookOpen, label: "Avg. Quizzes", value: students.length > 0 ? Math.round(students.reduce((acc, s) => acc + s.totalQuizzes, 0) / students.length) : 0, color: "from-pink-500 to-rose-600" },
            { icon: TrendingUp, label: "Avg. Score", value: `${students.length > 0 ? Math.round(students.reduce((acc, s) => acc + s.overallPercentage, 0) / students.length) : 0}%`, color: "from-cyan-500 to-teal-600" },
            { icon: Award, label: "Top Performers", value: students.filter(s => s.overallPercentage >= 80).length, color: "from-amber-500 to-orange-600" },
          ].map((stat, index) => (
            <div 
              key={stat.label}
              className="liquid-glass-card rounded-2xl p-5 hover-lift slide-up"
              style={{ opacity: 0, animationDelay: `${0.3 + index * 0.1}s` }}
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} shadow-lg`}>
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">{stat.label}</p>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="liquid-glass-strong rounded-3xl overflow-hidden slide-up" style={{ opacity: 0, animationDelay: "0.7s" }}>
          <div className="p-6 border-b border-white/10">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold text-white">Student Progress</h2>
                <span className="px-3 py-1 rounded-full liquid-glass text-sm text-gray-300">
                  {filteredStudents.length} students
                </span>
              </div>
              
              <div className="flex flex-wrap gap-3 w-full sm:w-auto">
                <div className="relative flex-1 sm:flex-none sm:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search students..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500/50 transition-colors"
                  />
                </div>
                
                <Button
                  variant="outline"
                  onClick={handleSelectAll}
                  className="rounded-xl border-white/10 bg-white/5 hover:bg-white/10 text-gray-300"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  {selectedStudents.length === filteredStudents.length ? 'Deselect All' : 'Select All'}
                </Button>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="p-12 text-center">
              <div className="w-12 h-12 border-4 border-violet-500/30 border-t-violet-500 rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-400">Loading student data...</p>
            </div>
          ) : filteredStudents.length === 0 ? (
            <div className="p-12 text-center">
              <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No students found</p>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {filteredStudents.map((student, index) => (
                <div 
                  key={student.id}
                  className="hover:bg-white/[0.02] transition-colors"
                  style={{ animation: `fadeIn 0.3s ease-out ${index * 0.05}s forwards`, opacity: 0 }}
                >
                  <div 
                    className="p-4 sm:p-6 cursor-pointer"
                    onClick={() => setExpandedStudent(expandedStudent === student.id ? null : student.id)}
                  >
                    <div className="flex items-center gap-4">
                      <div 
                        className={`w-5 h-5 rounded-md border-2 flex items-center justify-center cursor-pointer transition-all ${
                          selectedStudents.includes(student.id) 
                            ? 'bg-violet-500 border-violet-500' 
                            : 'border-gray-600 hover:border-violet-400'
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectStudent(student.id);
                        }}
                      >
                        {selectedStudents.includes(student.id) && (
                          <CheckCircle className="w-3 h-3 text-white" />
                        )}
                      </div>

                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                        {student.fullName.charAt(0)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                          <h3 className="font-semibold text-white truncate">{student.fullName}</h3>
                          <span className="text-sm text-gray-500">{student.rollNumber}</span>
                        </div>
                        <p className="text-sm text-gray-400 truncate">{student.email}</p>
                      </div>

                      <div className="hidden md:flex items-center gap-6">
                        <div className="text-center">
                          <p className="text-xs text-gray-500 mb-1">Quizzes</p>
                          <p className="font-semibold text-white">{student.totalQuizzes}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-gray-500 mb-1">Score</p>
                          <p className="font-semibold text-white">{student.totalScore}/{student.totalQuestions}</p>
                        </div>
                        <div className={`px-4 py-2 rounded-xl border ${getGradeBg(student.overallPercentage)}`}>
                          <p className={`text-lg font-bold ${getGradeColor(student.overallPercentage)}`}>
                            {student.overallPercentage}%
                          </p>
                        </div>
                      </div>

                      <div className="md:hidden">
                        <div className={`px-3 py-1.5 rounded-lg border ${getGradeBg(student.overallPercentage)}`}>
                          <p className={`text-sm font-bold ${getGradeColor(student.overallPercentage)}`}>
                            {student.overallPercentage}%
                          </p>
                        </div>
                      </div>

                      <div className="p-2 rounded-lg hover:bg-white/10 transition-colors">
                        {expandedStudent === student.id ? (
                          <ChevronUp className="w-5 h-5 text-gray-400" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                    </div>
                  </div>

                  {expandedStudent === student.id && (
                    <div 
                      className="px-4 sm:px-6 pb-6 border-t border-white/5 pt-4"
                      style={{ animation: 'expandIn 0.3s ease-out forwards' }}
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
                        <div className="liquid-glass rounded-xl p-4">
                          <p className="text-xs text-gray-500 mb-1">Department</p>
                          <p className="font-medium text-white text-sm">{student.department}</p>
                        </div>
                        <div className="liquid-glass rounded-xl p-4">
                          <p className="text-xs text-gray-500 mb-1">Course</p>
                          <p className="font-medium text-white text-sm">{student.course || 'N/A'}</p>
                        </div>
                        <div className="liquid-glass rounded-xl p-4">
                          <p className="text-xs text-gray-500 mb-1">Semester</p>
                          <p className="font-medium text-white text-sm">{student.semester}</p>
                        </div>
                        <div className="liquid-glass rounded-xl p-4">
                          <p className="text-xs text-gray-500 mb-1">Last Active</p>
                          <p className="font-medium text-white text-sm">
                            {new Date(student.lastActive).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <h4 className="text-sm font-semibold text-gray-400 mb-3 flex items-center gap-2">
                        <Sparkles className="w-4 h-4" />
                        Subject-wise Performance
                      </h4>

                      {Object.keys(student.subjectScores).length === 0 ? (
                        <p className="text-gray-500 text-sm">No quizzes attempted yet</p>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                          {Object.entries(student.subjectScores).map(([subjectId, score]) => (
                            <div 
                              key={subjectId}
                              className={`rounded-xl p-4 border ${getGradeBg(score.percentage)} transition-all hover:scale-[1.02]`}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <h5 className="font-medium text-white text-sm truncate pr-2">
                                  {getSubjectName(subjectId)}
                                </h5>
                                <span className={`font-bold ${getGradeColor(score.percentage)}`}>
                                  {score.percentage}%
                                </span>
                              </div>
                              <div className="flex items-center justify-between text-xs text-gray-400">
                                <span>{score.score}/{score.totalQuestions} correct</span>
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {new Date(score.completedAt).toLocaleDateString()}
                                </span>
                              </div>
                              <div className="mt-2 h-1.5 bg-white/10 rounded-full overflow-hidden">
                                <div 
                                  className={`h-full rounded-full bg-gradient-to-r ${
                                    score.percentage >= 75 ? 'from-emerald-500 to-green-500' :
                                    score.percentage >= 50 ? 'from-yellow-500 to-amber-500' :
                                    'from-red-500 to-orange-500'
                                  }`}
                                  style={{ width: `${score.percentage}%`, transition: 'width 0.5s ease-out' }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showSendModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={() => setShowSendModal(false)}
        >
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
            style={{ animation: 'fadeIn 0.3s ease-out forwards' }}
          />
          
          <div 
            className="relative w-full max-w-lg rounded-3xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
            style={{ animation: 'modalSlideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards' }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-2xl border border-white/20 rounded-3xl" />
            
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-violet-500 via-pink-500 to-rose-500" />
            
            <div className="relative p-6 sm:p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl gradient-aurora">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Send Report to Admin</h2>
                    <p className="text-sm text-gray-400">{selectedStudents.length} students selected</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowSendModal(false)}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 hover:text-white transition-all duration-300"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Message (Optional)
                </label>
                <textarea
                  value={sendMessage}
                  onChange={(e) => setSendMessage(e.target.value)}
                  placeholder="Add a note for the admin..."
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500/50 resize-none transition-colors"
                />
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowSendModal(false)}
                  className="flex-1 h-12 rounded-xl border-white/10 bg-white/5 hover:bg-white/10 text-gray-300"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSendToAdmin}
                  disabled={sending}
                  className="flex-1 h-12 rounded-xl gradient-aurora text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
                >
                  {sending ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Mail className="w-4 h-4 mr-2" />
                      Send Report
                    </>
                  )}
                </Button>
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
        
        @keyframes expandIn {
          from { 
            opacity: 0;
            max-height: 0;
          }
          to { 
            opacity: 1;
            max-height: 1000px;
          }
        }
        
        @keyframes slideInRight {
          from { 
            opacity: 0;
            transform: translateX(100px);
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

export default Services;
