
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import Layout from "@/components/Layout";
import { Check, Eye, EyeOff } from "lucide-react";
import { 
  InputOTP, 
  InputOTPGroup, 
  InputOTPSlot 
} from "@/components/ui/input-otp";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const Login = () => {
  // Form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [role, setRole] = useState("user");
  
  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  
  // OTP verification state
  const [showEmailOTP, setShowEmailOTP] = useState(false);
  const [showPhoneOTP, setShowPhoneOTP] = useState(false);
  const [emailOTP, setEmailOTP] = useState("");
  const [phoneOTP, setPhoneOTP] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  
  // Navigation and authentication
  const navigate = useNavigate();
  const { login } = useAuth();

  // Email validation function
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Password validation function
  const isValidPassword = (password: string) => {
    return password.length >= 6;
  };

  // Phone number validation
  const isValidPhoneNumber = (phone: string) => {
    const phoneRegex = /^\d{10}$/;
    return phone === "" || phoneRegex.test(phone);
  };

  // Check if the email has a valid domain
  const hasValidDomain = (email: string) => {
    const validDomains = ["gmail.com", "yahoo.com", "hotmail.com", "outlook.com", "municipal.gov", "gov.in", "example.com"];
    const domain = email.split('@')[1]?.toLowerCase();
    return domain && validDomains.some(validDomain => domain === validDomain || domain.endsWith(`.${validDomain}`));
  };

  // Generate random OTP
  const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  // Send email OTP
  const sendEmailOTP = () => {
    if (!isValidEmail(email)) {
      toast({
        title: "Error",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    if (!hasValidDomain(email)) {
      toast({
        title: "Error",
        description: "Please use a valid email domain",
        variant: "destructive",
      });
      return;
    }

    const otp = generateOTP();
    console.log("Email OTP:", otp);
    
    // In a real implementation, this would send the OTP via email
    toast({
      title: "OTP Sent",
      description: `An OTP has been sent to ${email}. For demo, use: ${otp}`,
    });
    
    setShowEmailOTP(true);
    
    // Auto-fill OTP for demo purposes (in real app, this would be removed)
    setTimeout(() => setEmailOTP(otp), 1000);
  };

  // Send phone OTP
  const sendPhoneOTP = () => {
    if (!isValidPhoneNumber(phoneNumber)) {
      toast({
        title: "Error",
        description: "Please enter a valid 10-digit phone number",
        variant: "destructive",
      });
      return;
    }

    const otp = generateOTP();
    console.log("Phone OTP:", otp);
    
    // In a real implementation, this would send the OTP via SMS
    toast({
      title: "OTP Sent",
      description: `An OTP has been sent to ${phoneNumber}. For demo, use: ${otp}`,
    });
    
    setShowPhoneOTP(true);
    
    // Auto-fill OTP for demo purposes (in real app, this would be removed)
    setTimeout(() => setPhoneOTP(otp), 1000);
  };

  // Verify email OTP
  const verifyEmailOTP = () => {
    // In a real app, this would validate against the sent OTP
    if (emailOTP.length === 6) {
      setEmailVerified(true);
      setShowEmailOTP(false);
      toast({
        title: "Success",
        description: "Email verified successfully",
      });
    } else {
      toast({
        title: "Error",
        description: "Invalid OTP. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Verify phone OTP
  const verifyPhoneOTP = () => {
    // In a real app, this would validate against the sent OTP
    if (phoneOTP.length === 6) {
      setPhoneVerified(true);
      setShowPhoneOTP(false);
      toast({
        title: "Success",
        description: "Phone number verified successfully",
      });
    } else {
      toast({
        title: "Error",
        description: "Invalid OTP. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    if (!isValidEmail(email)) {
      toast({
        title: "Error",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }
    
    // If remember me is checked, save credentials to localStorage
    if (rememberMe) {
      localStorage.setItem("savedEmail", email);
      // For security reasons, we're not storing the password in real applications
      // This is just for demonstration purposes
      localStorage.setItem("rememberMe", "true");
    } else {
      localStorage.removeItem("savedEmail");
      localStorage.removeItem("rememberMe");
    }
    
    const success = await login(email, password);
    
    if (success) {
      toast({
        title: "Success",
        description: "You have been logged in successfully",
      });
      navigate("/");
    } else {
      toast({
        title: "Error",
        description: "Invalid credentials",
        variant: "destructive",
      });
    }
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !password || !confirmPassword) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (!isValidEmail(email)) {
      toast({
        title: "Error",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    if (!hasValidDomain(email)) {
      toast({
        title: "Error",
        description: "Please use a valid email domain",
        variant: "destructive",
      });
      return;
    }

    if (!isValidPassword(password)) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters long",
        variant: "destructive",
      });
      return;
    }
    
    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    if (phoneNumber && !isValidPhoneNumber(phoneNumber)) {
      toast({
        title: "Error",
        description: "Please enter a valid 10-digit phone number",
        variant: "destructive",
      });
      return;
    }
    
    // Check if email is verified (required)
    if (!emailVerified) {
      toast({
        title: "Error",
        description: "Please verify your email address",
        variant: "destructive",
      });
      return;
    }

    // Check if phone number is verified (if provided)
    if (phoneNumber && !phoneVerified) {
      toast({
        title: "Error",
        description: "Please verify your phone number",
        variant: "destructive",
      });
      return;
    }

    // If admin role is selected, check if the email domain is valid for admin
    if (role === "admin" && !email.includes("@municipal.gov") && !email.includes("@gov.in")) {
      toast({
        title: "Error",
        description: "Admin accounts must use an official government email domain",
        variant: "destructive",
      });
      return;
    }
    
    // In a real app, we would register the user with the specified role
    // For demo purposes, we'll just log them in with the admin flag set based on the role
    login(email, password, role === "admin").then(() => {
      toast({
        title: "Success",
        description: `${role === "admin" ? "Admin" : "User"} account created successfully`,
      });
      navigate("/");
    });
  };

  // Check for saved credentials when the component mounts
  useState(() => {
    const savedEmail = localStorage.getItem("savedEmail");
    const isRememberMe = localStorage.getItem("rememberMe") === "true";
    
    if (savedEmail && isRememberMe) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  });

  return (
    <Layout>
      <div className="container mx-auto py-12 px-4 flex justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Welcome</CardTitle>
            <CardDescription className="text-center">
              Sign in to your account or create a new one
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="pr-10"
                      />
                      <button 
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="remember-me" 
                      checked={rememberMe} 
                      onCheckedChange={() => setRememberMe(!rememberMe)} 
                    />
                    <Label htmlFor="remember-me" className="text-sm font-medium cursor-pointer">Remember me</Label>
                  </div>
                  <Button type="submit" className="w-full bg-municipal-orange hover:bg-orange-600">
                    Sign In
                  </Button>
                  <div className="mt-4 p-3 bg-gray-50 rounded-md border border-gray-200">
                    <p className="text-sm text-gray-500 font-medium">Admin Login:</p>
                    <p className="text-sm text-gray-500">Email: admin@municipal.gov</p>
                    <p className="text-sm text-gray-500">Password: admin123</p>
                  </div>
                </form>
              </TabsContent>
              
              <TabsContent value="register">
                <form onSubmit={handleSignup} className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name <span className="text-red-500">*</span></Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Enter your full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="register-email">Email <span className="text-red-500">*</span></Label>
                      {emailVerified && (
                        <span className="text-green-600 text-xs flex items-center">
                          <Check size={14} className="mr-1" /> Verified
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        id="register-email"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={emailVerified}
                        required
                        className="flex-1"
                      />
                      {!emailVerified && (
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={sendEmailOTP}
                        >
                          Verify
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  {showEmailOTP && !emailVerified && (
                    <div className="space-y-2 p-3 border rounded-md bg-gray-50">
                      <Label htmlFor="email-otp">Email Verification Code</Label>
                      <div className="flex gap-2">
                        <div className="flex-1">
                          <InputOTP maxLength={6} value={emailOTP} onChange={setEmailOTP}>
                            <InputOTPGroup>
                              <InputOTPSlot index={0} />
                              <InputOTPSlot index={1} />
                              <InputOTPSlot index={2} />
                              <InputOTPSlot index={3} />
                              <InputOTPSlot index={4} />
                              <InputOTPSlot index={5} />
                            </InputOTPGroup>
                          </InputOTP>
                        </div>
                        <Button type="button" onClick={verifyEmailOTP}>
                          Submit
                        </Button>
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="phone-number">Phone Number</Label>
                      {phoneVerified && phoneNumber && (
                        <span className="text-green-600 text-xs flex items-center">
                          <Check size={14} className="mr-1" /> Verified
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        id="phone-number"
                        type="tel"
                        placeholder="10-digit phone number"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        disabled={phoneVerified}
                        className="flex-1"
                      />
                      {phoneNumber && !phoneVerified && (
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={sendPhoneOTP}
                        >
                          Verify
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  {showPhoneOTP && !phoneVerified && phoneNumber && (
                    <div className="space-y-2 p-3 border rounded-md bg-gray-50">
                      <Label htmlFor="phone-otp">Phone Verification Code</Label>
                      <div className="flex gap-2">
                        <div className="flex-1">
                          <InputOTP maxLength={6} value={phoneOTP} onChange={setPhoneOTP}>
                            <InputOTPGroup>
                              <InputOTPSlot index={0} />
                              <InputOTPSlot index={1} />
                              <InputOTPSlot index={2} />
                              <InputOTPSlot index={3} />
                              <InputOTPSlot index={4} />
                              <InputOTPSlot index={5} />
                            </InputOTPGroup>
                          </InputOTP>
                        </div>
                        <Button type="button" onClick={verifyPhoneOTP}>
                          Submit
                        </Button>
                      </div>
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <Label htmlFor="role">Account Type <span className="text-red-500">*</span></Label>
                    <RadioGroup defaultValue="user" value={role} onValueChange={setRole} className="flex flex-col space-y-1">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="user" id="user-role" />
                        <Label htmlFor="user-role">Citizen (Regular user)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="admin" id="admin-role" />
                        <Label htmlFor="admin-role">Municipal Administrator</Label>
                      </div>
                    </RadioGroup>
                    {role === "admin" && (
                      <p className="text-xs text-amber-600">Note: Admin accounts require an official government email domain.</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="register-password">Password <span className="text-red-500">*</span></Label>
                    <div className="relative">
                      <Input
                        id="register-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a password (min. 6 characters)"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="pr-10"
                      />
                      <button 
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm Password <span className="text-red-500">*</span></Label>
                    <div className="relative">
                      <Input
                        id="confirm-password"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="pr-10"
                      />
                      <button 
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    <span className="text-red-500">*</span> Required fields
                  </div>
                  <Button type="submit" className="w-full bg-municipal-orange hover:bg-orange-600">
                    Create Account
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-center text-sm text-muted-foreground">
            Municipal Corporation - Public Service Portal
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
};

export default Login;
