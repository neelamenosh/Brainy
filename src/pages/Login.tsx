import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Brain, CheckCircle, AlertCircle, Eye, EyeOff, Mail, Lock, Sparkles, ArrowRight, GraduationCap, Shield, Users } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

type LoginRole = "student" | "faculty" | "admin";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [activeTab, setActiveTab] = useState<LoginRole>("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const tabs = [
    { 
      id: "student" as LoginRole, 
      label: "Student", 
      icon: GraduationCap, 
      gradient: "from-violet-500 via-purple-500 to-fuchsia-600",
      glow: "rgba(139, 92, 246, 0.4)",
      border: "border-violet-500/30",
      text: "text-violet-400"
    },
    { 
      id: "faculty" as LoginRole, 
      label: "Faculty", 
      icon: Users, 
      gradient: "from-cyan-500 via-teal-500 to-emerald-600",
      glow: "rgba(6, 182, 212, 0.4)",
      border: "border-cyan-500/30",
      text: "text-cyan-400"
    },
    { 
      id: "admin" as LoginRole, 
      label: "Admin", 
      icon: Shield, 
      gradient: "from-pink-500 via-rose-500 to-red-600",
      glow: "rgba(236, 72, 153, 0.4)",
      border: "border-pink-500/30",
      text: "text-pink-400"
    },
  ];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login({ email, password, role: activeTab });
      setShowSuccess(true);
      toast.success("Login successful!");
      
      const redirectPath = activeTab === "admin" ? "/admin" : activeTab === "faculty" ? "/faculty" : "/home";
      setTimeout(() => navigate(redirectPath), 1000);
    } catch (err: any) {
      setError(err.message || "Login failed. Please try again.");
      toast.error(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (tab: LoginRole) => {
    setActiveTab(tab);
    setError("");
  };

  const activeTabData = tabs.find(t => t.id === activeTab)!;
  const activeGradient = activeTabData.gradient;
  const activeGlow = activeTabData.glow;

  const getPlaceholderText = () => {
    switch (activeTab) {
      case "admin": return { email: "admin@brainy.com", password: "Admin password" };
      case "faculty": return { email: "faculty@brainy.com", password: "Faculty password" };
      default: return { email: "student@example.com", password: "Your password" };
    }
  };

  const getSuccessMessage = () => {
    switch (activeTab) {
      case "admin": return "Redirecting to Admin Dashboard...";
      case "faculty": return "Redirecting to Faculty Portal...";
      default: return "Redirecting to your dashboard...";
    }
  };

  return (
    <div className="min-h-screen bg-mesh noise-overlay pt-20 pb-12 flex items-center justify-center">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 -left-32 w-[500px] h-[500px] bg-violet-500/20 rounded-full blur-[150px] morph-blob float-slow" />
        <div className="absolute top-40 -right-32 w-[600px] h-[600px] bg-pink-500/15 rounded-full blur-[180px] morph-blob float-medium" style={{ animationDelay: "-2s" }} />
        <div className="absolute bottom-40 left-1/4 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[120px] morph-blob float-fast" style={{ animationDelay: "-4s" }} />
      </div>

      {showSuccess ? (
        <div 
          className="w-full max-w-md mx-4 liquid-glass-strong rounded-3xl p-8 text-center scale-in"
          style={{ boxShadow: `0 0 50px ${activeGlow}, 0 20px 50px rgba(0,0,0,0.5)` }}
        >
          <div className="flex justify-center mb-6">
            <div className="p-4 rounded-full bg-green-500/20 pulse-glow">
              <CheckCircle className="w-12 h-12 text-green-400" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-green-400 mb-2">Welcome Back!</h2>
          <p className="text-gray-400">{getSuccessMessage()}</p>
        </div>
      ) : (
        <div className="w-full max-w-md mx-4 slide-up" style={{ opacity: 0, animationDelay: "0.1s" }}>
          <div 
            className="liquid-glass-strong rounded-3xl p-8 transition-all duration-700 relative group overflow-hidden"
            style={{ boxShadow: `0 0 40px ${activeGlow.replace('0.4', '0.2')}, 0 25px 50px -12px rgba(0,0,0,0.6)` }}
          >
            {/* Animated background glow */}
            <div className={`absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br ${activeGradient} blur-3xl opacity-20 group-hover:opacity-30 transition-opacity duration-700`} />
            
            <div className="text-center mb-8 relative">
              <div className="flex justify-center mb-4">
                <div className="relative group/logo">
                  {/* Rotating ring */}
                  <div className={`absolute -inset-4 bg-gradient-to-r ${activeGradient} rounded-full blur-md opacity-40 animate-spin-slow group-hover/logo:opacity-60 transition-opacity`} />
                  
                  <div className={`relative p-5 rounded-2xl bg-gradient-to-br ${activeGradient} shadow-2xl transition-all duration-500 transform group-hover/logo:scale-110 group-hover/logo:rotate-3`}>
                    <Brain className="w-10 h-10 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
                  </div>
                </div>
              </div>
              <h1 className="text-4xl font-black gradient-text-aurora mb-2 tracking-tight">
                Brainy
              </h1>
              <p className="text-gray-400 font-medium tracking-wide uppercase text-[10px]">
                Sign in to continue
              </p>
            </div>

            <div className="flex gap-2 p-1.5 rounded-2xl liquid-glass mb-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold transition-all duration-500 relative overflow-hidden group/tab ${
                    activeTab === tab.id
                      ? `text-white`
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  {activeTab === tab.id && (
                    <div className={`absolute inset-0 bg-gradient-to-br ${tab.gradient} scale-in shadow-[0_0_20px_rgba(0,0,0,0.2)]`} />
                  )}
                  <div className="relative z-10 flex items-center gap-2">
                    <tab.icon className={`w-4 h-4 transition-transform duration-500 ${activeTab === tab.id ? 'scale-110' : 'group-hover/tab:scale-110'}`} />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </div>
                </button>
              ))}
            </div>

            <div className={`mb-6 p-4 rounded-xl liquid-glass border transition-all duration-500 backdrop-blur-md ${activeTabData.border}`}>
              <p className={`text-[11px] font-bold text-center uppercase tracking-widest ${activeTabData.text}`}>
                {activeTab === "admin" && "Administrator Access • System Control"}
                {activeTab === "faculty" && "Faculty Access • Academic Management"}
                {activeTab === "student" && "Student Access • Learning Portal"}
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 rounded-2xl liquid-glass border border-red-500/30 flex items-start gap-3 fade-in shadow-[0_0_20px_rgba(239,68,68,0.1)]">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-400 font-semibold">{error}</p>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">
                  {activeTab === "student" ? "Email Address" : `${tabs.find(t => t.id === activeTab)?.label} Email`}
                </Label>
                <div className="relative group/input">
                  <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-300 ${activeTabData.text.replace('text-', 'text-gray-500 group-focus-within/input:')}`} />
                  <Input
                    id="email"
                    type="email"
                    placeholder={getPlaceholderText().email}
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error) setError("");
                    }}
                    required
                    disabled={loading}
                    className={`pl-12 h-14 rounded-xl bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:bg-white/[0.08] transition-all duration-500 focus:ring-4 ${activeTabData.border.replace('border-', 'focus:border-')} ${activeTabData.text.replace('text-', 'focus:ring-')}/10`}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">
                  Password
                </Label>
                <div className="relative group/input">
                  <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-300 ${activeTabData.text.replace('text-', 'text-gray-500 group-focus-within/input:')}`} />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder={getPlaceholderText().password}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (error) setError("");
                    }}
                    required
                    disabled={loading}
                    className={`pl-12 pr-12 h-14 rounded-xl bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:bg-white/[0.08] transition-all duration-500 focus:ring-4 ${activeTabData.border.replace('border-', 'focus:border-')} ${activeTabData.text.replace('text-', 'focus:ring-')}/10`}
                  />
                  <button
                    type="button"
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              
              <Button
                type="submit"
                disabled={loading || !email || !password}
                className={`w-full h-14 rounded-xl btn-liquid bg-gradient-to-r ${activeGradient} text-white font-bold text-lg shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-500 transform hover:scale-[1.02] active:scale-[0.98]`}
                style={{ boxShadow: `0 10px 30px -5px ${activeGlow}` }}
              >
                {loading ? (
                  <span className="flex items-center gap-3">
                    <span className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                    Authenticating...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Sign In as {tabs.find(t => t.id === activeTab)?.label}
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                )}
              </Button>

              {activeTab === "student" && (
                <>
                  <div className="relative my-8">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-white/5" />
                    </div>
                    <div className="relative flex justify-center text-[10px]">
                      <span className="px-4 bg-[#0a0c10] text-gray-500 font-bold uppercase tracking-[0.2em]">New to Brainy?</span>
                    </div>
                  </div>

                  <Link to="/register" className="block">
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full h-14 rounded-xl border-white/5 bg-white/[0.02] hover:bg-white/[0.08] text-gray-400 hover:text-white font-bold transition-all duration-500 group/reg"
                    >
                      <Sparkles className="w-5 h-5 mr-2 text-violet-400 group-hover:animate-pulse" />
                      Create Student Account
                    </Button>
                  </Link>
                </>
              )}

              {(activeTab === "admin" || activeTab === "faculty") && (
                <div className="pt-4">
                  <p className="text-center text-[11px] text-gray-500 font-medium leading-relaxed">
                    Access is restricted. {activeTab === "admin" ? "Admin" : "Faculty"} credentials are 
                    <br />
                    provisioned by the system administrator.
                    <br />
                    <button 
                      type="button"
                      onClick={() => setActiveTab("student")}
                      className="text-violet-400 hover:text-violet-300 mt-2 font-bold transition-colors uppercase tracking-widest text-[10px]"
                    >
                      Return to Student Login
                    </button>
                  </p>
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
