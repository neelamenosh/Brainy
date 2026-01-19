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
  AlertCircle,
  Shield,
  FileCheck,
  Eye,
  ArrowUpRight
} from "lucide-react";
import { quizCategories } from "@/data/quizData";

interface ProgressItem {
  completed: boolean;
  score: number;
  totalQuestions: number;
  completedAt: string;
}

interface RawStudent {
  id: string;
  rollNumber: string;
  fullName: string;
  email: string;
  department: string;
  course: string;
  semester: number;
  progress?: Record<string, ProgressItem>;
  lastLogin?: string;
}

interface ProcessedStudent {
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
  subjectScores: Record<string, { score: number; totalQuestions: number; percentage: number; completedAt: string }>;
  lastActive: string;
}

interface AdminReport {
  id: string;
  facultyId: string;
  facultyName: string;
  facultyEmail: string;
  reportType: string;
  message: string;
  students: RawStudent[];
  createdAt: string;
  status: 'pending' | 'published';
  publishedAt?: string;
}

const processStudent = (student: RawStudent): ProcessedStudent => {
  const progress = student.progress || {};
  const subjects = Object.keys(progress);
  
  let totalScore = 0;
  let totalQuestions = 0;
  const subjectScores: Record<string, { score: number; totalQuestions: number; percentage: number; completedAt: string }> = {};
  
  subjects.forEach(subjectId => {
    const subjectData = progress[subjectId];
    if (subjectData) {
      totalScore += subjectData.score;
      totalQuestions += subjectData.totalQuestions;
      subjectScores[subjectId] = {
        score: subjectData.score,
        totalQuestions: subjectData.totalQuestions,
        percentage: subjectData.totalQuestions > 0 ? Math.round((subjectData.score / subjectData.totalQuestions) * 100) : 0,
        completedAt: subjectData.completedAt
      };
    }
  });
  
  return {
    id: student.id,
    rollNumber: student.rollNumber,
    fullName: student.fullName,
    email: student.email,
    department: student.department,
    course: student.course,
    semester: student.semester,
    totalQuizzes: subjects.length,
    totalScore,
    totalQuestions,
    overallPercentage: totalQuestions > 0 ? Math.round((totalScore / totalQuestions) * 100) : 0,
    subjectScores,
    lastActive: student.lastLogin || new Date().toISOString()
  };
};

const AdminServices = () => {
  const { user, token } = useAuth();
  const [reports, setReports] = useState<AdminReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState<string | null>(null);
  const [selectedReport, setSelectedReport] = useState<AdminReport | null>(null);
  const [expandedStudent, setExpandedStudent] = useState<string | null>(null);
  const [notification, setNotification] = useState<{type: 'success' | 'error', message: string} | null>(null);

  const getSubjectName = (subjectId: string) => {
    const subject = quizCategories.find(cat => cat.id === subjectId);
    return subject?.name || subjectId;
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

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/admin/reports', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.ok) {
        setReports(data);
      } else {
        console.error('Failed to fetch reports:', data.message);
      }
    } catch (error) {
      console.error('Failed to fetch reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async (reportId: string) => {
    setPublishing(reportId);
    try {
      const response = await fetch('http://localhost:3001/api/admin/publish-results', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ reportId })
      });
      if (response.ok) {
        setNotification({ type: 'success', message: 'Results published successfully!' });
        fetchReports();
      } else {
        setNotification({ type: 'error', message: 'Failed to publish results' });
      }
    } catch (error) {
      setNotification({ type: 'error', message: 'Error publishing results' });
    } finally {
      setPublishing(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center bg-[#050505]">
        <div className="relative">
          <div className="w-16 h-16 border-2 border-violet-500/20 border-t-violet-500 rounded-full animate-spin" />
          <Shield className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-violet-500" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-12 bg-[#050505] noise-overlay">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-violet-600/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[20%] left-[-10%] w-[40%] h-[40%] bg-blue-600/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {notification && (
          <div className={`fixed top-24 right-4 z-50 px-6 py-4 rounded-2xl shadow-2xl border backdrop-blur-xl flex items-center gap-3 animate-in slide-in-from-right ${
            notification.type === 'success' ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400' : 'bg-red-500/20 border-red-500/30 text-red-400'
          }`}>
            <CheckCircle className="w-5 h-5" />
            <span className="font-bold">{notification.message}</span>
            <button onClick={() => setNotification(null)} className="ml-2 p-1 hover:bg-white/10 rounded-lg"><X className="w-4 h-4" /></button>
          </div>
        )}

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-12 slide-up">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-[10px] font-black tracking-widest uppercase mb-4 shadow-[0_0_15px_rgba(139,92,246,0.1)]">
              <Shield className="w-3 h-3" />
              Administrative Authority
            </div>
            <h1 className="text-4xl font-black text-white mb-2 tracking-tight">Academic <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400">Oversight</span></h1>
            <p className="text-gray-500 font-medium">Review and publish academic progress reports from the faculty department.</p>
          </div>
          <div className="flex gap-4">
            <div className="liquid-glass-strong px-6 py-3 rounded-2xl border border-white/5 flex items-center gap-4">
              <div className="text-right">
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Pending</p>
                <p className="text-xl font-black text-white">{reports.filter(r => r.status === 'pending').length}</p>
              </div>
              <div className="w-[1px] h-8 bg-white/10" />
              <div className="text-right">
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Published</p>
                <p className="text-xl font-black text-white">{reports.filter(r => r.status === 'published').length}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
          {reports.length === 0 ? (
            <div className="liquid-glass-strong rounded-[2.5rem] p-20 text-center border border-white/5">
              <div className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center mx-auto mb-6">
                <FileText className="w-10 h-10 text-gray-600" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">No reports found</h3>
              <p className="text-gray-500 max-w-md mx-auto">Reports from faculty will appear here once they are submitted for review.</p>
            </div>
          ) : (
            reports.map((report, i) => (
              <div key={report.id} className="group relative slide-up" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-500/20 to-cyan-500/20 rounded-[2.5rem] blur opacity-0 group-hover:opacity-100 transition duration-500" />
                <div className="relative liquid-glass-strong rounded-[2.5rem] p-8 border border-white/5 group-hover:border-white/10 transition-all duration-500">
                  <div className="flex flex-col lg:flex-row gap-8">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-violet-500/20 group-hover:scale-110 transition-transform duration-500">
                            <GraduationCap className="w-7 h-7 text-white" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-white group-hover:text-violet-400 transition-colors">{report.facultyName}</h3>
                            <p className="text-sm text-gray-500">{report.facultyEmail}</p>
                          </div>
                        </div>
                        <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                          report.status === 'published' ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' : 'bg-amber-500/10 border border-amber-500/20 text-amber-400'
                        }`}>
                          {report.status}
                        </div>
                      </div>

                      <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 mb-6 group-hover:bg-white/[0.04] transition-colors">
                        <div className="flex items-center gap-2 mb-3">
                          <Mail className="w-4 h-4 text-violet-400" />
                          <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Faculty Message</span>
                        </div>
                        <p className="text-gray-300 font-medium italic">"{report.message || 'No message provided'}"</p>
                      </div>

                      <div className="flex flex-wrap gap-4">
                        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/5">
                          <Users className="w-4 h-4 text-gray-500" />
                          <span className="text-xs font-bold text-white">{report.students.length} Students Included</span>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/5">
                          <Clock className="w-4 h-4 text-gray-500" />
                          <span className="text-xs font-bold text-white">{new Date(report.createdAt).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="lg:w-72 flex flex-col justify-between gap-6">
                      <div className="space-y-3">
                        <Button 
                          onClick={() => setSelectedReport(report)}
                          className="w-full h-14 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold transition-all group-hover:border-white/20"
                        >
                          <Eye className="w-5 h-5 mr-2" />
                          Inspect Data
                        </Button>
                        <Button 
                          onClick={() => handlePublish(report.id)}
                          disabled={report.status === 'published' || publishing === report.id}
                          className={`w-full h-14 rounded-2xl font-black transition-all ${
                            report.status === 'published' 
                              ? 'bg-emerald-500/10 text-emerald-500 cursor-not-allowed border border-emerald-500/20' 
                              : 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-xl shadow-violet-600/20 hover:scale-[1.02] active:scale-[0.98]'
                          }`}
                        >
                          {publishing === report.id ? (
                            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          ) : report.status === 'published' ? (
                            <div className="flex items-center gap-2"><CheckCircle className="w-5 h-5" /> PUBLISHED</div>
                          ) : (
                            <div className="flex items-center gap-2"><ArrowUpRight className="w-5 h-5" /> PUBLISH RESULTS</div>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-2xl" onClick={() => setSelectedReport(null)} />
          <div className="relative w-full max-w-4xl max-h-[85vh] overflow-hidden liquid-glass-strong rounded-[2.5rem] border border-white/20 flex flex-col animate-in fade-in zoom-in duration-300">
            <div className="p-8 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-violet-500/20 flex items-center justify-center">
                  <FileCheck className="w-6 h-6 text-violet-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white">Detailed Report Inspection</h2>
                  <p className="text-sm text-gray-500">Reviewing students from {selectedReport.facultyName}</p>
                </div>
              </div>
              <button onClick={() => setSelectedReport(null)} className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 text-gray-400 transition-all hover:rotate-90">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
              <div className="space-y-4 mb-8">
                {selectedReport.students.map(rawStudent => {
                  const student = processStudent(rawStudent);
                  return (
                    <div key={student.id} className="rounded-3xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.05] transition-colors overflow-hidden">
                      <div 
                        className="p-6 cursor-pointer"
                        onClick={() => setExpandedStudent(expandedStudent === student.id ? null : student.id)}
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-white font-black text-lg">{student.fullName.charAt(0)}</div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-white truncate">{student.fullName}</h4>
                            <p className="text-xs text-gray-500">{student.rollNumber}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              <p className="text-[10px] text-gray-500 uppercase tracking-widest">Score</p>
                              <p className="text-sm font-bold text-white">{student.totalScore}/{student.totalQuestions}</p>
                            </div>
                            <div className={`px-4 py-2 rounded-xl border ${getGradeBg(student.overallPercentage)}`}>
                              <p className={`text-lg font-black ${getGradeColor(student.overallPercentage)}`}>{student.overallPercentage}%</p>
                            </div>
                            <div className="p-2 rounded-lg hover:bg-white/10 transition-colors">
                              {expandedStudent === student.id ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                            </div>
                          </div>
                        </div>
                        <div className="mt-4 h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-violet-500 to-cyan-500 transition-all duration-1000" style={{ width: `${student.overallPercentage}%` }} />
                        </div>
                      </div>
                      
                      {expandedStudent === student.id && (
                        <div className="px-6 pb-6 border-t border-white/5 pt-4">
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                            <div className="p-3 rounded-xl bg-white/5"><p className="text-[10px] text-gray-500 uppercase mb-1">Department</p><p className="text-sm font-medium text-white truncate">{student.department}</p></div>
                            <div className="p-3 rounded-xl bg-white/5"><p className="text-[10px] text-gray-500 uppercase mb-1">Course</p><p className="text-sm font-medium text-white truncate">{student.course || 'N/A'}</p></div>
                            <div className="p-3 rounded-xl bg-white/5"><p className="text-[10px] text-gray-500 uppercase mb-1">Semester</p><p className="text-sm font-medium text-white">{student.semester}</p></div>
                            <div className="p-3 rounded-xl bg-white/5"><p className="text-[10px] text-gray-500 uppercase mb-1">Total Quizzes</p><p className="text-sm font-medium text-white">{student.totalQuizzes}</p></div>
                          </div>
                          
                          <h5 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2"><Sparkles className="w-3 h-3" />Subject Scores</h5>
                          <div className="grid sm:grid-cols-2 gap-3">
                            {Object.entries(student.subjectScores).map(([subjectId, score]) => (
                              <div key={subjectId} className={`rounded-xl p-4 border ${getGradeBg(score.percentage)}`}>
                                <div className="flex items-center justify-between mb-2">
                                  <h6 className="font-medium text-white text-sm truncate">{getSubjectName(subjectId)}</h6>
                                  <span className={`font-black ${getGradeColor(score.percentage)}`}>{score.percentage}%</span>
                                </div>
                                <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                                  <span>{score.score}/{score.totalQuestions} correct</span>
                                  <span>{new Date(score.completedAt).toLocaleDateString()}</span>
                                </div>
                                <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                                  <div className="h-full bg-white/40" style={{ width: `${score.percentage}%` }} />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="p-8 border-t border-white/10 bg-white/[0.02] flex justify-end gap-4">
              <Button variant="ghost" onClick={() => setSelectedReport(null)} className="h-12 px-8 rounded-xl text-gray-400 hover:text-white font-bold">Close Inspector</Button>
              <Button onClick={() => { handlePublish(selectedReport.id); setSelectedReport(null); }} disabled={selectedReport.status === 'published'} className="h-12 px-8 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-black">Publish This Report</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const FacultyServices = () => {
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

  useEffect(() => {
    fetchStudents();
  }, []);

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

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center bg-[#050505]">
        <div className="w-12 h-12 border-4 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-12 bg-mesh noise-overlay">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 -left-32 w-96 h-96 bg-violet-500/20 rounded-full blur-[120px] morph-blob float-slow" />
        <div className="absolute top-40 -right-32 w-[500px] h-[500px] bg-pink-500/15 rounded-full blur-[150px] morph-blob float-medium" style={{ animationDelay: "-2s" }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {notification && (
          <div className={`fixed top-24 right-4 z-50 px-6 py-4 rounded-2xl shadow-2xl border backdrop-blur-xl flex items-center gap-3 animate-in slide-in-from-right ${
            notification.type === 'success' ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400' : 'bg-red-500/20 border-red-500/30 text-red-400'
          }`}>
            {notification.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
            <span className="font-medium">{notification.message}</span>
            <button onClick={() => setNotification(null)} className="ml-2 p-1 hover:bg-white/10 rounded-lg"><X className="w-4 h-4" /></button>
          </div>
        )}

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 rounded-2xl gradient-aurora">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white">Faculty Dashboard</h1>
            </div>
            <p className="text-gray-400">Monitor student progress and performance</p>
          </div>

          <div className="flex flex-wrap gap-3">
            {selectedStudents.length > 0 && (
              <Button onClick={() => setShowSendModal(true)} className="rounded-xl gradient-sunset text-white font-semibold shadow-lg hover:scale-105 transition-all">
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
          ].map((stat) => (
            <div key={stat.label} className="liquid-glass-card rounded-2xl p-5 hover-lift">
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

        <div className="liquid-glass-strong rounded-3xl overflow-hidden">
          <div className="p-6 border-b border-white/10">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold text-white">Student Progress</h2>
                <span className="px-3 py-1 rounded-full liquid-glass text-sm text-gray-300">{filteredStudents.length} students</span>
              </div>
              <div className="flex flex-wrap gap-3 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="text" placeholder="Search students..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-violet-500/50" />
                </div>
                <Button variant="outline" onClick={handleSelectAll} className="rounded-xl border-white/10 bg-white/5 hover:bg-white/10 text-gray-300">
                  <Filter className="w-4 h-4 mr-2" />
                  {selectedStudents.length === filteredStudents.length ? 'Deselect All' : 'Select All'}
                </Button>
              </div>
            </div>
          </div>

          <div className="divide-y divide-white/5">
            {filteredStudents.map((student) => (
              <div key={student.id} className="hover:bg-white/[0.02] transition-colors">
                <div className="p-4 sm:p-6 cursor-pointer" onClick={() => setExpandedStudent(expandedStudent === student.id ? null : student.id)}>
                  <div className="flex items-center gap-4">
                    <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${selectedStudents.includes(student.id) ? 'bg-violet-500 border-violet-500' : 'border-gray-600 hover:border-violet-400'}`} onClick={(e) => { e.stopPropagation(); handleSelectStudent(student.id); }}>
                      {selectedStudents.includes(student.id) && <CheckCircle className="w-3 h-3 text-white" />}
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">{student.fullName.charAt(0)}</div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-white truncate">{student.fullName}</h3>
                      <p className="text-sm text-gray-500">{student.rollNumber}</p>
                    </div>
                    <div className={`px-4 py-2 rounded-xl border ${getGradeBg(student.overallPercentage)}`}>
                      <p className={`text-lg font-bold ${getGradeColor(student.overallPercentage)}`}>{student.overallPercentage}%</p>
                    </div>
                    <div className="p-2 rounded-lg hover:bg-white/10 transition-colors">
                      {expandedStudent === student.id ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                    </div>
                  </div>
                </div>
                {expandedStudent === student.id && (
                  <div className="px-4 sm:px-6 pb-6 border-t border-white/5 pt-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
                      <div className="liquid-glass rounded-xl p-4"><p className="text-xs text-gray-500 mb-1">Department</p><p className="font-medium text-white text-sm">{student.department}</p></div>
                      <div className="liquid-glass rounded-xl p-4"><p className="text-xs text-gray-500 mb-1">Course</p><p className="font-medium text-white text-sm">{student.course || 'N/A'}</p></div>
                      <div className="liquid-glass rounded-xl p-4"><p className="text-xs text-gray-500 mb-1">Semester</p><p className="font-medium text-white text-sm">{student.semester}</p></div>
                      <div className="liquid-glass rounded-xl p-4"><p className="text-xs text-gray-500 mb-1">Last Active</p><p className="font-medium text-white text-sm">{new Date(student.lastActive).toLocaleDateString()}</p></div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {Object.entries(student.subjectScores).map(([subjectId, score]) => (
                        <div key={subjectId} className={`rounded-xl p-4 border ${getGradeBg(score.percentage)}`}>
                          <div className="flex items-center justify-between mb-2"><h5 className="font-medium text-white text-sm truncate">{getSubjectName(subjectId)}</h5><span className={`font-bold ${getGradeColor(score.percentage)}`}>{score.percentage}%</span></div>
                          <div className="mt-2 h-1.5 bg-white/10 rounded-full overflow-hidden"><div className="h-full bg-white/40" style={{ width: `${score.percentage}%` }} /></div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {showSendModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setShowSendModal(false)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" />
          <div className="relative w-full max-w-lg rounded-3xl overflow-hidden bg-[#111] border border-white/10 p-8" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-2xl font-bold text-white mb-6">Send Report to Admin</h2>
            <textarea value={sendMessage} onChange={(e) => setSendMessage(e.target.value)} placeholder="Add a note for the admin..." rows={4} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white mb-6 focus:outline-none" />
            <div className="flex gap-4">
              <Button variant="outline" onClick={() => setShowSendModal(false)} className="flex-1 h-12 rounded-xl text-gray-300">Cancel</Button>
              <Button onClick={handleSendToAdmin} disabled={sending} className="flex-1 h-12 rounded-xl gradient-aurora text-white">{sending ? 'Sending...' : 'Send Report'}</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Services = () => {
  const { user } = useAuth();
  
  if (user?.role === 'Admin') {
    return <AdminServices />;
  }
  
  if (user?.role === 'Faculty') {
    return <FacultyServices />;
  }

  return (
    <div className="min-h-screen pt-20 pb-12 bg-[#050505] flex items-center justify-center">
      <div className="text-center p-12 liquid-glass-strong rounded-3xl border border-white/5">
        <AlertCircle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-white mb-2">Access Restricted</h1>
        <p className="text-gray-400 mb-8">This page is for Faculty and Admin only.</p>
        <Link to="/home"><Button className="gradient-aurora text-white rounded-xl h-12 px-8">Back to Home</Button></Link>
      </div>
    </div>
  );
};

export default Services;
