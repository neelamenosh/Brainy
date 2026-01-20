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
    if (percentage >= 90) return 'text-emerald-300';
    if (percentage >= 75) return 'text-teal-300';
    if (percentage >= 60) return 'text-amber-300';
    if (percentage >= 40) return 'text-orange-300';
    return 'text-rose-300';
  };

  const getGradeBg = (percentage: number) => {
    if (percentage >= 90) return 'bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border-emerald-400/30';
    if (percentage >= 75) return 'bg-gradient-to-br from-teal-500/20 to-cyan-500/10 border-teal-400/30';
    if (percentage >= 60) return 'bg-gradient-to-br from-amber-500/20 to-yellow-500/10 border-amber-400/30';
    if (percentage >= 40) return 'bg-gradient-to-br from-orange-500/20 to-red-500/10 border-orange-400/30';
    return 'bg-gradient-to-br from-rose-500/20 to-pink-500/10 border-rose-400/30';
  };

  const getGradeIcon = (percentage: number) => {
    if (percentage >= 90) return '🏆';
    if (percentage >= 75) return '⭐';
    if (percentage >= 60) return '📊';
    if (percentage >= 40) return '📈';
    return '📉';
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
      <div className="min-h-screen pt-20 flex items-center justify-center bg-[#030306]">
        <div className="relative">
          <div className="w-20 h-20 border-2 border-transparent border-t-rose-500 border-r-amber-500 rounded-full animate-spin" />
          <div className="absolute inset-2 border-2 border-transparent border-b-violet-500 border-l-cyan-500 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
          <Shield className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-amber-400" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-12 bg-[#030306] noise-overlay overflow-hidden">
      <div className="fixed inset-0 pointer-events-none" style={{ willChange: 'auto' }}>
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,rgba(251,191,36,0.06),transparent_50%)]" />
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_left,rgba(236,72,153,0.06),transparent_50%)]" />
        <div className="absolute top-[10%] right-[10%] w-72 h-72 bg-gradient-to-br from-amber-500/8 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-[10%] left-[5%] w-64 h-64 bg-gradient-to-tr from-violet-600/8 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {notification && (
          <div className={`fixed top-24 right-4 z-50 px-6 py-4 rounded-2xl shadow-2xl border backdrop-blur-xl flex items-center gap-3 animate-in slide-in-from-right ${
            notification.type === 'success' ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border-emerald-400/30 text-emerald-300' : 'bg-gradient-to-r from-rose-500/20 to-red-500/20 border-rose-400/30 text-rose-300'
          }`}>
            <CheckCircle className="w-5 h-5" />
            <span className="font-bold">{notification.message}</span>
            <button onClick={() => setNotification(null)} className="ml-2 p-1.5 hover:bg-white/10 rounded-xl transition-colors"><X className="w-4 h-4" /></button>
          </div>
        )}

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 mb-12 slide-up">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-violet-500/10 border border-amber-400/20 text-amber-300 text-[10px] font-black tracking-[0.2em] uppercase mb-5 shadow-[0_0_30px_rgba(251,191,36,0.15)]">
              <Shield className="w-3 h-3" />
              Administrative Authority
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-white mb-3 tracking-tight">
              Academic <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-rose-400 to-violet-400 animate-gradient">Oversight</span>
            </h1>
            <p className="text-gray-400 font-medium text-lg">Review and publish academic progress reports from the faculty department.</p>
          </div>
          <div className="flex gap-4">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-amber-500/20 via-rose-500/20 to-violet-500/20 rounded-3xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-xl px-8 py-5 rounded-2xl border border-white/10 flex items-center gap-6">
                <div className="text-center">
                  <p className="text-[10px] font-black text-amber-400/80 uppercase tracking-[0.15em] mb-1">Pending</p>
                  <p className="text-3xl font-black bg-gradient-to-b from-amber-300 to-amber-500 bg-clip-text text-transparent">{reports.filter(r => r.status === 'pending').length}</p>
                </div>
                <div className="w-px h-12 bg-gradient-to-b from-transparent via-white/20 to-transparent" />
                <div className="text-center">
                  <p className="text-[10px] font-black text-emerald-400/80 uppercase tracking-[0.15em] mb-1">Published</p>
                  <p className="text-3xl font-black bg-gradient-to-b from-emerald-300 to-emerald-500 bg-clip-text text-transparent">{reports.filter(r => r.status === 'published').length}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8">
          {reports.length === 0 ? (
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-500/20 via-rose-500/20 to-violet-500/20 rounded-[2.5rem] blur opacity-50" />
              <div className="relative bg-gradient-to-br from-white/[0.06] to-transparent backdrop-blur-xl rounded-[2.5rem] p-20 text-center border border-white/10">
                <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-amber-500/20 via-rose-500/20 to-violet-500/20 flex items-center justify-center mx-auto mb-8 border border-white/10">
                  <FileText className="w-12 h-12 text-amber-300" />
                </div>
                <h3 className="text-2xl font-black text-white mb-3">No Reports Yet</h3>
                <p className="text-gray-400 max-w-md mx-auto text-lg">Reports from faculty will appear here once they are submitted for review.</p>
              </div>
            </div>
          ) : (
            reports.map((report, i) => (
              <div key={report.id} className="group relative slide-up" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-500/30 via-rose-500/30 to-violet-500/30 rounded-[2rem] blur-xl opacity-0 group-hover:opacity-100 transition-all duration-700" />
                <div className="absolute -inset-px bg-gradient-to-r from-amber-400/20 via-rose-400/20 to-violet-400/20 rounded-[2rem] opacity-0 group-hover:opacity-100 transition-all duration-500" />
                <div className="relative bg-gradient-to-br from-white/[0.08] via-white/[0.04] to-transparent backdrop-blur-xl rounded-[2rem] p-8 border border-white/10 group-hover:border-white/20 transition-all duration-500 overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-amber-500/5 via-rose-500/5 to-transparent rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  
                  <div className="relative flex flex-col lg:flex-row gap-8">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-5">
                          <div className="relative">
                            <div className="absolute -inset-1 bg-gradient-to-br from-amber-500 via-rose-500 to-violet-500 rounded-2xl blur opacity-40 group-hover:opacity-60 transition-opacity" />
                            <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 via-rose-500 to-violet-600 flex items-center justify-center shadow-2xl">
                              <GraduationCap className="w-8 h-8 text-white" />
                            </div>
                          </div>
                          <div>
                            <h3 className="text-2xl font-black text-white group-hover:text-amber-200 transition-colors">{report.facultyName}</h3>
                            <p className="text-sm text-gray-400 font-medium">{report.facultyEmail}</p>
                          </div>
                        </div>
                        <div className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.15em] backdrop-blur-xl ${
                          report.status === 'published' 
                            ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-400/30 text-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.2)]' 
                            : 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-400/30 text-amber-300 shadow-[0_0_20px_rgba(251,191,36,0.2)]'
                        }`}>
                          {report.status === 'published' ? '✓ Published' : '⏳ Pending'}
                        </div>
                      </div>

                      <div className="relative p-6 rounded-2xl bg-gradient-to-br from-white/[0.06] to-transparent border border-white/10 mb-8 group-hover:border-white/20 transition-colors">
                        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-amber-400 via-rose-400 to-violet-400 rounded-l-full" />
                        <div className="flex items-center gap-2 mb-3 pl-2">
                          <Mail className="w-4 h-4 text-rose-400" />
                          <span className="text-xs font-black text-rose-300/80 uppercase tracking-[0.15em]">Faculty Message</span>
                        </div>
                        <p className="text-gray-300 font-medium italic text-lg pl-2">"{report.message || 'No message provided'}"</p>
                      </div>

                      <div className="flex flex-wrap gap-4">
                        <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-gradient-to-r from-violet-500/10 to-purple-500/10 border border-violet-400/20 group-hover:border-violet-400/30 transition-colors">
                          <Users className="w-5 h-5 text-violet-400" />
                          <span className="text-sm font-bold text-white">{report.students.length} Students</span>
                        </div>
                        <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500/10 to-teal-500/10 border border-cyan-400/20 group-hover:border-cyan-400/30 transition-colors">
                          <Clock className="w-5 h-5 text-cyan-400" />
                          <span className="text-sm font-bold text-white">{new Date(report.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      </div>
                    </div>

                    <div className="lg:w-72 flex flex-col justify-center gap-4">
                      <Button 
                        onClick={() => setSelectedReport(report)}
                        className="w-full h-14 rounded-xl bg-gradient-to-r from-white/10 to-white/5 border border-white/20 hover:border-white/40 hover:bg-white/15 text-white font-bold transition-all duration-300 group/btn"
                      >
                        <Eye className="w-5 h-5 mr-2 group-hover/btn:scale-110 transition-transform" />
                        Inspect Report
                      </Button>
                      <Button 
                        onClick={() => handlePublish(report.id)}
                        disabled={report.status === 'published' || publishing === report.id}
                        className={`w-full h-14 rounded-xl font-black transition-all duration-300 ${
                          report.status === 'published' 
                            ? 'bg-gradient-to-r from-emerald-500/10 to-teal-500/10 text-emerald-400 cursor-not-allowed border border-emerald-500/20' 
                            : 'bg-gradient-to-r from-amber-500 via-rose-500 to-violet-500 text-white shadow-[0_8px_32px_rgba(251,191,36,0.3)] hover:shadow-[0_12px_40px_rgba(251,191,36,0.4)] hover:scale-[1.02] active:scale-[0.98]'
                        }`}
                      >
                        {publishing === report.id ? (
                          <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : report.status === 'published' ? (
                          <div className="flex items-center gap-2"><CheckCircle className="w-5 h-5" /> Published</div>
                        ) : (
                          <div className="flex items-center gap-2"><ArrowUpRight className="w-5 h-5" /> Publish Results</div>
                        )}
                      </Button>
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
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => setSelectedReport(null)} />
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-[20%] right-[20%] w-64 h-64 bg-gradient-to-br from-amber-500/8 to-transparent rounded-full blur-3xl" />
            <div className="absolute bottom-[20%] left-[20%] w-64 h-64 bg-gradient-to-tr from-violet-500/8 to-transparent rounded-full blur-3xl" />
          </div>
          
          <div className="relative w-full max-w-5xl max-h-[90vh] overflow-hidden rounded-[2rem] border border-white/20 flex flex-col animate-in fade-in zoom-in duration-300 bg-gradient-to-br from-[#0a0a0f] via-[#080810] to-[#0a0a0f]">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-400/50 to-transparent" />
            
            <div className="p-8 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-white/[0.03] to-transparent">
              <div className="flex items-center gap-5">
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-br from-amber-500 via-rose-500 to-violet-500 rounded-2xl blur opacity-40" />
                  <div className="relative w-14 h-14 rounded-xl bg-gradient-to-br from-amber-500 via-rose-500 to-violet-600 flex items-center justify-center">
                    <FileCheck className="w-7 h-7 text-white" />
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white">Report Inspection</h2>
                  <p className="text-sm text-gray-400">Reviewing <span className="text-amber-300 font-semibold">{selectedReport.students.length} students</span> from {selectedReport.facultyName}</p>
                </div>
              </div>
              <button onClick={() => setSelectedReport(null)} className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-gray-400 hover:text-white transition-all hover:rotate-90 duration-300">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
              <div className="space-y-5">
                {selectedReport.students.map((rawStudent, index) => {
                  const student = processStudent(rawStudent);
                  return (
                    <div key={student.id} className="group relative">
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-500/20 via-rose-500/20 to-violet-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-all duration-500" />
                      <div className="relative rounded-2xl bg-gradient-to-br from-white/[0.06] via-white/[0.03] to-transparent border border-white/10 group-hover:border-white/20 transition-all duration-300 overflow-hidden">
                        <div 
                          className="p-6 cursor-pointer"
                          onClick={() => setExpandedStudent(expandedStudent === student.id ? null : student.id)}
                        >
                          <div className="flex items-center gap-5">
                            <div className="relative">
                              <div className="absolute -inset-0.5 bg-gradient-to-br from-amber-500 via-rose-500 to-violet-500 rounded-xl blur opacity-30" />
                              <div className="relative w-14 h-14 rounded-xl bg-gradient-to-br from-amber-500 via-rose-500 to-violet-600 flex items-center justify-center text-white font-black text-xl shadow-lg">
                                {student.fullName.charAt(0)}
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-bold text-white text-lg truncate group-hover:text-amber-200 transition-colors">{student.fullName}</h4>
                              <p className="text-sm text-gray-500 font-medium">{student.rollNumber} • {student.department}</p>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="text-right hidden sm:block">
                                <p className="text-[10px] text-gray-500 uppercase tracking-[0.1em] font-bold mb-1">Total Score</p>
                                <p className="text-lg font-black text-white">{student.totalScore}<span className="text-gray-500">/{student.totalQuestions}</span></p>
                              </div>
                              <div className={`relative px-5 py-3 rounded-xl border ${getGradeBg(student.overallPercentage)} overflow-hidden`}>
                                <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent" />
                                <div className="relative flex items-center gap-2">
                                  <span className="text-lg">{getGradeIcon(student.overallPercentage)}</span>
                                  <p className={`text-xl font-black ${getGradeColor(student.overallPercentage)}`}>{student.overallPercentage}%</p>
                                </div>
                              </div>
                              <div className={`p-2.5 rounded-xl transition-all duration-300 ${expandedStudent === student.id ? 'bg-amber-500/20 text-amber-300 rotate-180' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}>
                                <ChevronDown className="w-5 h-5" />
                              </div>
                            </div>
                          </div>
                          <div className="mt-5 h-2 bg-white/5 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-amber-500 via-rose-500 to-violet-500 transition-all duration-1000 rounded-full shadow-[0_0_20px_rgba(251,191,36,0.5)]" 
                              style={{ width: `${student.overallPercentage}%` }} 
                            />
                          </div>
                        </div>
                        
                        {expandedStudent === student.id && (
                          <div className="px-6 pb-6 border-t border-white/10 pt-5 bg-gradient-to-b from-white/[0.02] to-transparent animate-in slide-in-from-top-2 duration-300">
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                              {[
                                { label: 'Department', value: student.department, color: 'from-violet-500/20 to-purple-500/10' },
                                { label: 'Course', value: student.course || 'N/A', color: 'from-rose-500/20 to-pink-500/10' },
                                { label: 'Semester', value: student.semester, color: 'from-cyan-500/20 to-teal-500/10' },
                                { label: 'Total Quizzes', value: student.totalQuizzes, color: 'from-amber-500/20 to-orange-500/10' },
                              ].map((item) => (
                                <div key={item.label} className={`p-4 rounded-xl bg-gradient-to-br ${item.color} border border-white/10`}>
                                  <p className="text-[10px] text-gray-400 uppercase tracking-[0.1em] font-bold mb-1">{item.label}</p>
                                  <p className="text-sm font-bold text-white truncate">{item.value}</p>
                                </div>
                              ))}
                            </div>
                            
                            <div className="flex items-center gap-3 mb-4">
                              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-rose-500 flex items-center justify-center">
                                <Sparkles className="w-4 h-4 text-white" />
                              </div>
                              <h5 className="text-sm font-black text-white uppercase tracking-[0.1em]">Subject Performance</h5>
                            </div>
                            <div className="grid sm:grid-cols-2 gap-4">
                              {Object.entries(student.subjectScores).map(([subjectId, score]) => (
                                <div key={subjectId} className={`relative rounded-xl p-5 border ${getGradeBg(score.percentage)} overflow-hidden group/subject`}>
                                  <div className="absolute top-0 right-0 w-20 h-20 bg-white/5 rounded-full blur-2xl opacity-0 group-hover/subject:opacity-100 transition-opacity" />
                                  <div className="relative">
                                    <div className="flex items-center justify-between mb-3">
                                      <h6 className="font-bold text-white text-sm truncate">{getSubjectName(subjectId)}</h6>
                                      <span className={`text-lg font-black ${getGradeColor(score.percentage)}`}>{score.percentage}%</span>
                                    </div>
                                    <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
                                      <span className="font-medium">{score.score}/{score.totalQuestions} correct</span>
                                      <span>{new Date(score.completedAt).toLocaleDateString()}</span>
                                    </div>
                                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                                      <div className="h-full bg-gradient-to-r from-white/60 to-white/40 rounded-full" style={{ width: `${score.percentage}%` }} />
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            <div className="p-6 border-t border-white/10 bg-gradient-to-r from-white/[0.03] to-transparent flex justify-end gap-4">
              <Button variant="ghost" onClick={() => setSelectedReport(null)} className="h-12 px-8 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 font-bold border border-white/10">
                Close
              </Button>
              <Button 
                onClick={() => { handlePublish(selectedReport.id); setSelectedReport(null); }} 
                disabled={selectedReport.status === 'published'} 
                className={`h-12 px-8 rounded-xl font-black ${
                  selectedReport.status === 'published' 
                    ? 'bg-emerald-500/20 text-emerald-400 cursor-not-allowed border border-emerald-500/20' 
                    : 'bg-gradient-to-r from-amber-500 via-rose-500 to-violet-500 text-white shadow-[0_8px_32px_rgba(251,191,36,0.3)] hover:shadow-[0_12px_40px_rgba(251,191,36,0.4)]'
                }`}
              >
                {selectedReport.status === 'published' ? 'Already Published' : 'Publish Report'}
              </Button>
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
      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ willChange: 'auto' }}>
        <div className="absolute top-20 -left-32 w-72 h-72 bg-violet-500/10 rounded-full blur-3xl" />
        <div className="absolute top-40 -right-32 w-80 h-80 bg-pink-500/8 rounded-full blur-3xl" />
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

interface StudentResult {
  reportId: string;
  facultyName: string;
  facultyEmail: string;
  message: string;
  publishedAt: string;
  studentData: RawStudent;
}

interface StudentResultsData {
  results: StudentResult[];
  student: {
    id: string;
    fullName: string;
    rollNumber: string;
    email: string;
    department: string;
    course: string;
    semester: number;
  };
}

const StudentResults = () => {
  const { user, token } = useAuth();
  const [data, setData] = useState<StudentResultsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedResult, setExpandedResult] = useState<string | null>(null);

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/student/results', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await response.json();
      if (response.ok) {
        setData(result);
      }
    } catch (error) {
      console.error('Failed to fetch results:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSubjectName = (subjectId: string) => {
    const subject = quizCategories.find(cat => cat.id === subjectId);
    return subject?.name || subjectId;
  };

  const getGradeColor = (percentage: number) => {
    if (percentage >= 90) return 'text-emerald-400';
    if (percentage >= 75) return 'text-teal-400';
    if (percentage >= 60) return 'text-amber-400';
    if (percentage >= 40) return 'text-orange-400';
    return 'text-rose-400';
  };

  const getGradeBg = (percentage: number) => {
    if (percentage >= 90) return 'from-emerald-500 to-teal-600';
    if (percentage >= 75) return 'from-teal-500 to-cyan-600';
    if (percentage >= 60) return 'from-amber-500 to-yellow-600';
    if (percentage >= 40) return 'from-orange-500 to-red-600';
    return 'from-rose-500 to-pink-600';
  };

  const getGradeLabel = (percentage: number) => {
    if (percentage >= 90) return 'Excellent';
    if (percentage >= 75) return 'Good';
    if (percentage >= 60) return 'Average';
    if (percentage >= 40) return 'Below Average';
    return 'Needs Improvement';
  };

  const getGradeIcon = (percentage: number) => {
    if (percentage >= 90) return '🏆';
    if (percentage >= 75) return '⭐';
    if (percentage >= 60) return '📊';
    if (percentage >= 40) return '📈';
    return '📉';
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center bg-mesh noise-overlay">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-violet-500/30 border-t-violet-500 rounded-full animate-spin mx-auto" />
            <Award className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-violet-400" />
          </div>
          <p className="text-gray-400 mt-4 font-medium">Loading your results...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-12 bg-mesh noise-overlay">
      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ willChange: 'auto' }}>
        <div className="absolute top-20 -left-32 w-72 h-72 bg-violet-500/10 rounded-full blur-3xl" />
        <div className="absolute top-40 -right-32 w-80 h-80 bg-pink-500/8 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-1/4 w-64 h-64 bg-emerald-500/8 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12 slide-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full liquid-glass text-sm font-medium mb-6">
            <Award className="w-4 h-4 text-violet-400" />
            <span className="text-gray-300">Academic Results</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Your <span className="gradient-text-aurora">Published Results</span>
          </h1>
          <p className="text-gray-400 max-w-xl mx-auto">
            View your academic performance reports published by faculty and verified by administration.
          </p>
        </div>

        {data?.student && (
          <div className="liquid-glass-strong rounded-3xl p-6 mb-8 slide-up" style={{ animationDelay: "0.1s" }}>
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="w-20 h-20 rounded-2xl gradient-aurora flex items-center justify-center text-3xl font-bold text-white shadow-xl">
                {data.student.fullName.charAt(0)}
              </div>
              <div className="text-center sm:text-left flex-1">
                <h2 className="text-2xl font-bold text-white mb-1">{data.student.fullName}</h2>
                <p className="text-gray-400">{data.student.rollNumber} • {data.student.department}</p>
                <div className="flex flex-wrap justify-center sm:justify-start gap-3 mt-3">
                  <span className="px-3 py-1 rounded-lg bg-violet-500/20 text-violet-300 text-sm font-medium">
                    {data.student.course || 'Course N/A'}
                  </span>
                  <span className="px-3 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 text-sm font-medium">
                    Semester {data.student.semester}
                  </span>
                </div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-black gradient-text-aurora">{data.results.length}</div>
                <p className="text-sm text-gray-500">Published Results</p>
              </div>
            </div>
          </div>
        )}

        {data?.results.length === 0 ? (
          <div className="liquid-glass-strong rounded-3xl p-16 text-center slide-up" style={{ animationDelay: "0.2s" }}>
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-violet-500/20 to-purple-500/10 flex items-center justify-center mx-auto mb-6 border border-white/10">
              <FileText className="w-12 h-12 text-violet-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">No Results Yet</h3>
            <p className="text-gray-400 max-w-md mx-auto mb-8">
              Your academic results will appear here once they are published by the administration. Keep working hard on your quizzes!
            </p>
            <Link to="/home">
              <Button className="h-12 px-8 rounded-xl gradient-aurora text-white font-semibold shadow-lg">
                <BookOpen className="w-4 h-4 mr-2" />
                Continue Learning
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {data?.results.map((result, index) => {
              const studentData = processStudent(result.studentData);
              const isExpanded = expandedResult === result.reportId;

              return (
                <div 
                  key={result.reportId} 
                  className="liquid-glass-card rounded-3xl overflow-hidden hover-lift slide-up"
                  style={{ animationDelay: `${0.2 + index * 0.1}s` }}
                >
                  <div className={`h-1.5 bg-gradient-to-r ${getGradeBg(studentData.overallPercentage)}`} />
                  
                  <div className="p-6">
                    <div className="flex flex-col lg:flex-row gap-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-4">
                          <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${getGradeBg(studentData.overallPercentage)} flex items-center justify-center shadow-lg`}>
                            <span className="text-2xl">{getGradeIcon(studentData.overallPercentage)}</span>
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-xl font-bold text-white">Performance Report</h3>
                              <span className={`px-3 py-1 rounded-full text-xs font-bold ${getGradeColor(studentData.overallPercentage)} bg-white/5`}>
                                {getGradeLabel(studentData.overallPercentage)}
                              </span>
                            </div>
                            <p className="text-sm text-gray-400">
                              Published on {new Date(result.publishedAt).toLocaleDateString('en-US', { 
                                year: 'numeric', month: 'long', day: 'numeric' 
                              })}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
                          <GraduationCap className="w-4 h-4 text-violet-400" />
                          <span>Submitted by <span className="text-white font-medium">{result.facultyName}</span></span>
                        </div>

                        {result.message && (
                          <div className="p-4 rounded-xl bg-white/5 border border-white/10 mb-4">
                            <div className="flex items-center gap-2 mb-2">
                              <Mail className="w-4 h-4 text-pink-400" />
                              <span className="text-xs font-bold text-pink-300 uppercase tracking-wider">Faculty Remarks</span>
                            </div>
                            <p className="text-gray-300 italic">"{result.message}"</p>
                          </div>
                        )}

                        <div className="grid grid-cols-3 gap-4">
                          <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
                            <p className="text-2xl font-bold text-white">{studentData.totalScore}</p>
                            <p className="text-xs text-gray-500 uppercase tracking-wider">Total Score</p>
                          </div>
                          <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
                            <p className="text-2xl font-bold text-white">{studentData.totalQuizzes}</p>
                            <p className="text-xs text-gray-500 uppercase tracking-wider">Quizzes</p>
                          </div>
                          <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
                            <p className={`text-2xl font-bold ${getGradeColor(studentData.overallPercentage)}`}>{studentData.overallPercentage}%</p>
                            <p className="text-xs text-gray-500 uppercase tracking-wider">Overall</p>
                          </div>
                        </div>
                      </div>

                      <div className="lg:w-48 flex flex-col items-center justify-center">
                        <div className="relative w-32 h-32 mb-4">
                          <svg className="w-32 h-32 transform -rotate-90">
                            <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="8" fill="none" className="text-white/10" />
                            <circle 
                              cx="64" cy="64" r="56" 
                              stroke="url(#gradient)" 
                              strokeWidth="8" 
                              fill="none"
                              strokeLinecap="round"
                              strokeDasharray={`${studentData.overallPercentage * 3.52} 352`}
                              className="transition-all duration-1000"
                            />
                            <defs>
                              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#8B5CF6" />
                                <stop offset="100%" stopColor="#EC4899" />
                              </linearGradient>
                            </defs>
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center">
                              <span className={`text-3xl font-black ${getGradeColor(studentData.overallPercentage)}`}>{studentData.overallPercentage}%</span>
                            </div>
                          </div>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setExpandedResult(isExpanded ? null : result.reportId)}
                          className="rounded-xl border-white/10 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white"
                        >
                          {isExpanded ? 'Hide Details' : 'View Details'}
                          <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                        </Button>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="mt-6 pt-6 border-t border-white/10 animate-in slide-in-from-top-2">
                        <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-violet-400" />
                          Subject-wise Performance
                        </h4>
                        <div className="grid sm:grid-cols-2 gap-4">
                          {Object.entries(studentData.subjectScores).map(([subjectId, score]) => (
                            <div 
                              key={subjectId} 
                              className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                            >
                              <div className="flex items-center justify-between mb-3">
                                <h5 className="font-semibold text-white truncate">{getSubjectName(subjectId)}</h5>
                                <span className={`text-lg font-bold ${getGradeColor(score.percentage)}`}>{score.percentage}%</span>
                              </div>
                              <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                                <span>{score.score}/{score.totalQuestions} correct</span>
                                <span>{new Date(score.completedAt).toLocaleDateString()}</span>
                              </div>
                              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                <div 
                                  className={`h-full bg-gradient-to-r ${getGradeBg(score.percentage)} rounded-full transition-all duration-500`}
                                  style={{ width: `${score.percentage}%` }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-12 liquid-glass-strong rounded-3xl p-8 text-center slide-up glow-mixed" style={{ animationDelay: "0.5s" }}>
          <div className="flex justify-center mb-6">
            <div className="p-4 rounded-2xl gradient-aurora pulse-glow">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">
            Keep Improving Your Scores!
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto mb-6">
            Practice more quizzes to improve your academic performance and see better results.
          </p>
          <Link to="/home">
            <Button size="lg" className="h-12 px-8 rounded-xl gradient-sunset text-white font-semibold shadow-lg">
              <Sparkles className="w-4 h-4 mr-2" />
              Take More Quizzes
            </Button>
          </Link>
        </div>
      </div>
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

  return <StudentResults />;
};

export default Services;
