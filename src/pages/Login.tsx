import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Brain, CheckCircle, AlertCircle, Eye, EyeOff, Mail, Lock, Sparkles, ArrowRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login({ email, password });
      setShowSuccess(true);
      toast.success("Login successful!");
      setTimeout(() => navigate("/home"), 1000);
    } catch (err: any) {
      setError(err.message || "Login failed. Please try again.");
      toast.error(err.message || "Login failed");
    } finally {
      setLoading(false);
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
          <p className="text-gray-400">
            Login successful! Redirecting to your dashboard...
          </p>
        </div>
      ) : (
        <div className="w-full max-w-md mx-4 slide-up" style={{ opacity: 0, animationDelay: "0.1s" }}>
          <div className="liquid-glass-strong rounded-3xl p-8 glow-mixed">
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <div className="relative">
                  <div className="absolute inset-0 gradient-aurora rounded-2xl blur-lg opacity-60" />
                  <div className="relative p-4 rounded-2xl gradient-aurora shadow-lg">
                    <Brain className="w-8 h-8 text-white" />
                  </div>
                </div>
              </div>
              <h1 className="text-3xl font-bold gradient-text-aurora mb-2">
                Stats Mastermind
              </h1>
              <p className="text-gray-400">
                Sign in to continue your learning journey
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
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
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
                    placeholder="Enter your password"
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
                className="w-full h-12 rounded-xl btn-liquid gradient-aurora text-white font-semibold shadow-lg glow-violet disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing in...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Sign In
                    <ArrowRight className="w-5 h-5" />
                  </span>
                )}
              </Button>

              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-[hsl(230,25%,10%)] text-gray-500">New to Stats Mastermind?</span>
                </div>
              </div>

              <Link to="/register" className="block">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-12 rounded-xl border-white/10 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white font-semibold transition-all duration-300"
                >
                  <Sparkles className="w-5 h-5 mr-2 text-violet-400" />
                  Create an Account
                </Button>
              </Link>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
