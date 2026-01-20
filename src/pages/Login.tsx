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
    { id: "student" as LoginRole, label: "Student", icon: GraduationCap },
    { id: "faculty" as LoginRole, label: "Faculty", icon: Users },
    { id: "admin" as LoginRole, label: "Admin", icon: Shield },
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
      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ willChange: 'auto' }}>
        <div className="absolute top-20 -left-32 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute top-40 -right-32 w-96 h-96 bg-primary/8 rounded-full blur-3xl" />
        <div className="absolute bottom-40 left-1/4 w-72 h-72 bg-secondary/20 rounded-full blur-3xl" />
      </div>

      {showSuccess ? (
        <div 
          className="w-full max-w-md mx-4 liquid-glass-strong rounded-3xl p-8 text-center scale-in"
        >
          <div className="flex justify-center mb-6">
            <div className="p-4 rounded-full bg-green-500/20 pulse-glow">
              <CheckCircle className="w-12 h-12 text-green-400" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Welcome Back!</h2>
          <p className="text-muted-foreground">{getSuccessMessage()}</p>
        </div>
      ) : (
        <div className="w-full max-w-md mx-4 slide-up" style={{ opacity: 0, animationDelay: "0.1s" }}>
          <div 
            className="liquid-glass-strong rounded-3xl p-8 relative overflow-hidden"
          >
            <div className="text-center mb-8 relative">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-3xl bg-secondary/70 border border-border flex items-center justify-center">
                  <Brain className="w-8 h-8 text-foreground" />
                </div>
              </div>
              <h1 className="text-3xl font-bold tracking-tight mb-2">Sign in</h1>
              <p className="text-muted-foreground font-medium tracking-wide uppercase text-[10px]">
                Sign in to continue
              </p>
            </div>

            <div className="flex gap-1 p-1.5 rounded-2xl bg-secondary/60 border border-border mb-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-sm font-semibold transition-colors duration-200 ${
                    activeTab === tab.id
                      ? "bg-background/60 text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
            </div>

            <div className="mb-6 p-4 rounded-xl liquid-glass border border-border">
              <p className="text-[11px] font-semibold text-center uppercase tracking-widest text-muted-foreground">
                {activeTab === "admin" && "Administrator Access • System Control"}
                {activeTab === "faculty" && "Faculty Access • Academic Management"}
                {activeTab === "student" && "Student Access • Learning Portal"}
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 rounded-2xl liquid-glass border border-destructive/30 flex items-start gap-3 fade-in">
                <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                <p className="text-sm text-destructive font-semibold">{error}</p>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider ml-1">
                  {activeTab === "student" ? "Email Address" : `${tabs.find(t => t.id === activeTab)?.label} Email`}
                </Label>
                <div className="relative group/input">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within/input:text-primary transition-colors" />
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
                    className="pl-12 h-14 rounded-xl bg-background/60 border-border text-foreground placeholder:text-muted-foreground focus:bg-background/70 transition-all duration-200 focus:ring-4 focus:ring-ring/15"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider ml-1">
                  Password
                </Label>
                <div className="relative group/input">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within/input:text-primary transition-colors" />
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
                    className="pl-12 pr-12 h-14 rounded-xl bg-background/60 border-border text-foreground placeholder:text-muted-foreground focus:bg-background/70 transition-all duration-200 focus:ring-4 focus:ring-ring/15"
                  />
                  <button
                    type="button"
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              
              <Button
                type="submit"
                disabled={loading || !email || !password}
                className="w-full h-14 rounded-xl text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center gap-3">
                    <span className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                    Authenticating...
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
