import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Brain, CheckCircle, AlertCircle, Eye, EyeOff, Mail, Lock, User, Phone, Building, BookOpen, GraduationCap, ArrowRight, Sparkles } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  
  const [formData, setFormData] = useState({
    rollNumber: "",
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    department: "",
    course: "",
    semester: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const departments = [
    "Computer Science Engineering",
    "Electronics Engineering",
    "Mechanical Engineering",
    "Civil Engineering",
    "Electrical Engineering",
  ];

  const courses = ["B.Tech", "M.Tech", "B.Sc", "M.Sc"];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.rollNumber.trim()) {
      setError("Roll Number is required");
      return;
    }

    if (!formData.fullName.trim() || formData.fullName.trim().length < 2) {
      setError("Full Name must be at least 2 characters");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (formData.phone.length < 10) {
      setError("Phone number must be at least 10 digits");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!formData.department) {
      setError("Please select a department");
      return;
    }

    setLoading(true);

    try {
      await register({
        rollNumber: formData.rollNumber,
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        department: formData.department,
        course: formData.course,
        semester: formData.semester ? parseInt(formData.semester) : undefined,
      });

      setShowSuccess(true);
      toast.success("Registration successful!");
      setTimeout(() => navigate("/home"), 1500);
    } catch (err: any) {
      const errorMessage = err.message || "Registration failed. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "pl-12 h-12 rounded-xl bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-violet-500 focus:ring-violet-500/20 transition-all duration-300";

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
          <h2 className="text-2xl font-bold text-green-400 mb-2">Account Created!</h2>
          <p className="text-gray-400">
            Welcome to Stats Mastermind, {formData.fullName.split(" ")[0]}! Redirecting to your dashboard...
          </p>
        </div>
      ) : (
        <div className="w-full max-w-2xl mx-4 slide-up" style={{ opacity: 0, animationDelay: "0.1s" }}>
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
                Create Your Account
              </h1>
              <p className="text-gray-400">
                Join Stats Mastermind and start mastering statistics
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 rounded-2xl liquid-glass border border-red-500/30 flex items-start gap-3 fade-in">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-400 font-medium">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="rollNumber" className="text-sm font-semibold text-gray-300">Roll Number</Label>
                  <div className="relative">
                    <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <Input
                      id="rollNumber"
                      name="rollNumber"
                      value={formData.rollNumber}
                      onChange={handleInputChange}
                      placeholder="e.g., 2024001"
                      className={inputClass}
                      disabled={loading}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-sm font-semibold text-gray-300">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <Input
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="Your full name"
                      className={inputClass}
                      disabled={loading}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-semibold text-gray-300">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="your.email@example.com"
                      className={inputClass}
                      disabled={loading}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-semibold text-gray-300">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "").slice(0, 10);
                        setFormData((prev) => ({ ...prev, phone: value }));
                        if (error) setError("");
                      }}
                      placeholder="10-digit number"
                      className={inputClass}
                      disabled={loading}
                      maxLength={10}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-gray-300">Department</Label>
                  <Select
                    value={formData.department}
                    onValueChange={(value) => handleSelectChange("department", value)}
                    disabled={loading}
                  >
                    <SelectTrigger className="h-12 rounded-xl bg-white/5 border-white/10 text-gray-300 focus:border-violet-500 focus:ring-violet-500/20">
                      <div className="flex items-center gap-3">
                        <Building className="w-5 h-5 text-gray-500" />
                        <SelectValue placeholder="Select department" />
                      </div>
                    </SelectTrigger>
                    <SelectContent className="liquid-glass-strong border-white/10 rounded-xl">
                      {departments.map((dept) => (
                        <SelectItem key={dept} value={dept} className="text-gray-300 focus:bg-white/10 focus:text-white rounded-lg">{dept}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-gray-300">Course</Label>
                  <Select
                    value={formData.course}
                    onValueChange={(value) => handleSelectChange("course", value)}
                    disabled={loading}
                  >
                    <SelectTrigger className="h-12 rounded-xl bg-white/5 border-white/10 text-gray-300 focus:border-violet-500 focus:ring-violet-500/20">
                      <div className="flex items-center gap-3">
                        <BookOpen className="w-5 h-5 text-gray-500" />
                        <SelectValue placeholder="Select course" />
                      </div>
                    </SelectTrigger>
                    <SelectContent className="liquid-glass-strong border-white/10 rounded-xl">
                      {courses.map((course) => (
                        <SelectItem key={course} value={course} className="text-gray-300 focus:bg-white/10 focus:text-white rounded-lg">{course}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-300">Semester</Label>
                <Select
                  value={formData.semester}
                  onValueChange={(value) => handleSelectChange("semester", value)}
                  disabled={loading}
                >
                  <SelectTrigger className="h-12 rounded-xl bg-white/5 border-white/10 text-gray-300 focus:border-violet-500 focus:ring-violet-500/20">
                    <SelectValue placeholder="Select semester" />
                  </SelectTrigger>
                  <SelectContent className="liquid-glass-strong border-white/10 rounded-xl">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                      <SelectItem key={sem} value={sem.toString()} className="text-gray-300 focus:bg-white/10 focus:text-white rounded-lg">Semester {sem}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-semibold text-gray-300">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="At least 6 characters"
                      className={`${inputClass} pr-12`}
                      disabled={loading}
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
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-sm font-semibold text-gray-300">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="Re-enter password"
                      className={`${inputClass} pr-12`}
                      disabled={loading}
                    />
                    <button
                      type="button"
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 rounded-xl btn-liquid gradient-aurora text-white font-semibold shadow-lg glow-violet disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creating account...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    Create Account
                    <ArrowRight className="w-5 h-5" />
                  </span>
                )}
              </Button>

              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-[hsl(230,25%,10%)] text-gray-500">Already have an account?</span>
                </div>
              </div>

              <Link to="/login" className="block">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-12 rounded-xl border-white/10 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white font-semibold transition-all duration-300"
                >
                  <Sparkles className="w-5 h-5 mr-2 text-violet-400" />
                  Sign In Instead
                </Button>
              </Link>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Register;
