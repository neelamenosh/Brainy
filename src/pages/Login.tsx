import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, CheckCircle, AlertCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

type AuthStep = 'rollNumber' | 'otp' | 'registration';

const Login = () => {
  const navigate = useNavigate();
  const { sendOTP, verifyOTP, register } = useAuth();
  
  // OTP Flow
  const [currentStep, setCurrentStep] = useState<AuthStep>('rollNumber');
  const [rollNumber, setRollNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOTP] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  
  // Registration Form
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [department, setDepartment] = useState("");
  const [course, setCourse] = useState("");
  const [semester, setSemester] = useState("");

  const departments = [
    'Computer Science Engineering',
    'Electronics Engineering',
    'Mechanical Engineering',
    'Civil Engineering',
    'Electrical Engineering'
  ];

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await sendOTP(rollNumber, phone);
      setSuccessMessage("OTP sent successfully! Check your phone.");
      setTimeout(() => {
        setSuccessMessage("");
        setCurrentStep("otp");
      }, 2000);
      toast.success("OTP sent successfully");
    } catch (err: any) {
      setError(err.message || "Failed to send OTP");
      toast.error(err.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await verifyOTP(rollNumber, otp);
      
      if (result.status === "existing_user") {
        setSuccessMessage("Login successful! Redirecting to dashboard...");
        setShowSuccess(true);
        setTimeout(() => navigate("/home"), 1500);
        toast.success("Login successful!");
      } else {
        setSuccessMessage("OTP verified! Please complete registration.");
        setTimeout(() => {
          setSuccessMessage("");
          setCurrentStep("registration");
        }, 2000);
        toast.success("OTP verified! Complete your registration.");
      }
    } catch (err: any) {
      setError(err.message || "Failed to verify OTP");
      toast.error(err.message || "Failed to verify OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      await register({
        rollNumber,
        fullName,
        email,
        phone,
        password,
        department,
        course,
        semester: semester ? parseInt(semester) : undefined
      });
      setSuccessMessage(`Welcome to Brainy, ${fullName}! Your account has been created successfully.`);
      setShowSuccess(true);
      setTimeout(() => navigate("/home"), 2000);
      toast.success("Registration successful!");
    } catch (err: any) {
      setError(err.message || "Registration failed");
      toast.error(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setError("");
    setSuccessMessage("");
    if (currentStep === "otp") {
      setCurrentStep("rollNumber");
      setOTP("");
    } else if (currentStep === "registration") {
      setCurrentStep("otp");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 pt-20 pb-12 flex items-center justify-center">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
      </div>

      {showSuccess ? (
        <Card className="w-full max-w-md mx-4 border-0 shadow-xl relative z-10">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-4 rounded-xl bg-green-500/20">
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </div>
            <CardTitle className="text-2xl text-green-600">Success!</CardTitle>
            <CardDescription className="text-base">
              {successMessage}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-muted-foreground mb-4">
              Redirecting you to your dashboard...
            </p>
            <Button onClick={() => navigate("/home")} className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
              Go to Dashboard
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="w-full max-w-md mx-4 border-0 shadow-xl relative z-10">
          <CardHeader className="text-center pb-8">
            <div className="flex justify-center mb-4">
              <div className="p-3 rounded-xl bg-blue-100">
                <Sparkles className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Stats Mastermind</CardTitle>
            <CardDescription className="text-base mt-2">
              Master Statistics Through Interactive Learning
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-600 font-medium">{error}</p>
              </div>
            )}
            
            {successMessage && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-600 font-medium">{successMessage}</p>
              </div>
            )}

            {currentStep === "rollNumber" && (
              <form onSubmit={handleSendOTP} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="rollNumber">Roll Number</Label>
                  <Input
                    id="rollNumber"
                    type="text"
                    placeholder="Enter your roll number"
                    value={rollNumber}
                    onChange={(e) => {
                      setRollNumber(e.target.value);
                      if (error) setError("");
                    }}
                    required
                    disabled={loading}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="10-digit phone number"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value.replace(/\D/g, "").slice(0, 10));
                      if (error) setError("");
                    }}
                    maxLength={10}
                    required
                    disabled={loading}
                  />
                </div>
                
                <Button
                  type="submit"
                  disabled={loading || !rollNumber || phone.length < 10}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                >
                  {loading ? "Sending OTP..." : "Send OTP"}
                </Button>

                <div className="text-center pt-4 border-t">
                  <p className="text-sm text-muted-foreground">
                    Don't have an account?{" "}
                    <Link
                      to="/register"
                      className="text-blue-600 hover:text-blue-700 font-semibold hover:underline"
                    >
                      Register here
                    </Link>
                  </p>
                </div>
              </form>
            )}

            {currentStep === "otp" && (
              <form onSubmit={handleVerifyOTP} className="space-y-4">
                <div className="text-center mb-4">
                  <p className="text-sm text-muted-foreground">
                    OTP sent to <span className="font-semibold">{phone}</span>
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Valid for 3 minutes. Max 3 attempts.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="otp">Enter OTP</Label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder="6-digit OTP"
                    value={otp}
                    onChange={(e) => {
                      setOTP(e.target.value.replace(/\D/g, "").slice(0, 6));
                      if (error) setError("");
                    }}
                    maxLength={6}
                    required
                    disabled={loading}
                    className="text-center text-2xl tracking-widest"
                  />
                </div>
                
                <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1"
                      onClick={handleBack}
                      disabled={loading}
                    >
                      Back
                    </Button>
                    <Button
                    type="submit"
                    disabled={loading || otp.length !== 6}
                    className="flex-1"
                  >
                    {loading ? "Verifying..." : "Verify OTP"}
                  </Button>
                </div>
              </form>
            )}

            {currentStep === "registration" && (
              <form onSubmit={handleRegister} className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Enter your full name"
                    value={fullName}
                    onChange={(e) => {
                      setFullName(e.target.value);
                      if (error) setError("");
                    }}
                    required
                    disabled={loading}
                    className="h-9 text-sm"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
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
                    className="h-9 text-sm"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <select
                    id="department"
                    value={department}
                    onChange={(e) => {
                      setDepartment(e.target.value);
                      if (error) setError("");
                    }}
                    className="w-full h-9 px-3 py-2 text-sm border border-input rounded-md bg-background"
                    required
                    disabled={loading}
                  >
                    <option value="">Select Department</option>
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Minimum 6 characters"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (error) setError("");
                    }}
                    required
                    disabled={loading}
                    className="h-9 text-sm"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Re-enter password"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (error) setError("");
                    }}
                    required
                    disabled={loading}
                    className="h-9 text-sm"
                  />
                </div>
                
                <div className="flex gap-2 pt-2">
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1 h-9"
                      onClick={handleBack}
                      disabled={loading}
                    >
                      Back
                    </Button>
                    <Button
                    type="submit"
                    disabled={loading || !fullName || !email || !department || !password || password !== confirmPassword}
                    className="flex-1 h-9"
                  >
                    {loading ? "Creating..." : "Complete Registration"}
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Login;