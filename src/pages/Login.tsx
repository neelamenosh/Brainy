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
    { id: "student" as LoginRole, label: "Student", icon: GraduationCap, gradient: "from-violet-500 to-purple-600" },
    { id: "faculty" as LoginRole, label: "Faculty", icon: Users, gradient: "from-cyan-500 to-teal-600" },
    { id: "admin" as LoginRole, label: "Admin", icon: Shield, gradient: "from-pink-500 to-rose-600" },
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

  const getActiveGradient = () => {
    return tabs.find(t => t.id === activeTab)?.gradient || "from-violet-500 to-purple-600";
  };

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
        <div className="absolute bottom-40 left-1/4 w-[400px] h-[400px] bg-orange-500/10 rounded-full blur-[120px] morph-blob float-fast" style={{ animationDelay: "-4s" }} />
      </div>

      {showSuccess ? (
        <div className="w-full max-w-md mx-4 liquid-glass-strong rounded-3xl p-8 text-center scale-in glow-mixed">
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
          <div className="liquid-glass-strong rounded-3xl p-8 glow-mixed">
            <div className="text-center mb-6">
              <div className="flex justify-center mb-4">
                <div className="relative">
                  <div className={`absolute inset-0 bg-gradient-to-br ${getActiveGradient()} rounded-2xl blur-lg opacity-60 transition-all duration-500`} />
                  <div className={`relative p-4 rounded-2xl bg-gradient-to-br ${getActiveGradient()} shadow-lg transition-all duration-500`}>
                    <Brain className="w-8 h-8 text-white" />
                  </div>
                </div>
              </div>
              <h1 className="text-3xl font-bold gradient-text-aurora mb-2">
                Brainy
              </h1>
              <p className="text-gray-400">
                Sign in to continue
              </p>
            </div>

            <div className="flex gap-2 p-1.5 rounded-2xl liquid-glass mb-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-300 ${
                    activeTab === tab.id
                      ? `bg-gradient-to-br ${tab.gradient} text-white shadow-lg`
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
            </div>

            <div className={`mb-6 p-3 rounded-xl liquid-glass border transition-all duration-300 ${
              activeTab === "admin" ? "border-pink-500/30" : 
              activeTab === "faculty" ? "border-cyan-500/30" : "border-violet-500/30"
            }`}>
              <p className={`text-xs font-medium text-center ${
                activeTab === "admin" ? "text-pink-400" : 
                activeTab === "faculty" ? "text-cyan-400" : "text-violet-400"
              }`}>
                {activeTab === "admin" && "Administrator access - System management & controls"}
                {activeTab === "faculty" && "Faculty access - Course management & student progress"}
                {activeTab === "student" && "Student access - Quizzes, courses & learning materials"}
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 rounded-2xl liquid-glass border border-red-500/30 flex items-start gap-3 fade-in">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-400 font-medium">{error}</p>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold text-gray-300">
                  {activeTab === "student" ? "Email Address" : `${tabs.find(t => t.id === activeTab)?.label} Email`}
                </Label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
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
                    className="pl-12 h-12 rounded-xl bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-violet-500 focus:ring-violet-500/20 transition-all duration-300"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-semibold text-gray-300">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
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
                    className="pl-12 pr-12 h-12 rounded-xl bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-violet-500 focus:ring-violet-500/20 transition-all duration-300"
                  />
                  <button
                    type="button"
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              
              <Button
                type="submit"
                disabled={loading || !email || !password}
                className={`w-full h-12 rounded-xl btn-liquid bg-gradient-to-r ${getActiveGradient()} text-white font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-500`}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing in...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Sign In as {tabs.find(t => t.id === activeTab)?.label}
                    <ArrowRight className="w-5 h-5" />
                  </span>
                )}
              </Button>

              {activeTab === "student" && (
                <>
                  <div className="relative my-8">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-white/10" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-[hsl(230,25%,10%)] text-gray-500">New to Brainy?</span>
                    </div>
                  </div>

                  <Link to="/register" className="block">
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full h-12 rounded-xl border-white/10 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white font-semibold transition-all duration-300"
                    >
                      <Sparkles className="w-5 h-5 mr-2 text-violet-400" />
                      Create Student Account
                    </Button>
                  </Link>
                </>
              )}

              {(activeTab === "admin" || activeTab === "faculty") && (
                <p className="text-center text-sm text-gray-500 mt-6">
                  {activeTab === "admin" ? "Admin" : "Faculty"} accounts are created by system administrators.
                  <br />
                  <button 
                    type="button"
                    onClick={() => setActiveTab("student")}
                    className="text-violet-400 hover:text-violet-300 mt-1 transition-colors"
                  >
                    Switch to Student login
                  </button>
                </p>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
