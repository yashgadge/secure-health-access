
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockPatientDB, mockAadhaarDB } from '@/utils/mockDatabase';

const PatientLogin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [identifier, setIdentifier] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loginMethod, setLoginMethod] = useState<'aadhaar' | 'patientId'>('aadhaar');
  
  // Check for existing login on component mount
  useEffect(() => {
    const userType = localStorage.getItem("userType");
    const userData = localStorage.getItem("userData");
    
    if (userType === "patient" && userData) {
      // User is already logged in as a patient
      navigate("/patient-dashboard");
    }
  }, [navigate]);
  
  const handleSendOTP = (e: React.FormEvent) => {
    e.preventDefault();
    
    // For demo purposes, always allow login for the demo Aadhaar IDs
    if (identifier === "123456789012" || identifier === "234567890123" || identifier === "567890123456") {
      // Find user data for the demo Aadhaar
      const userData = mockAadhaarDB.find(p => p.aadhaarId === identifier);
      
      // Mock OTP sending
      setOtpSent(true);
      toast({
        title: "OTP Sent",
        description: `A mock OTP has been sent to ${userData?.phone.substring(0, 2)}****${userData?.phone.substring(6)}`,
      });
      return;
    }
    
    if (loginMethod === 'patientId' && (identifier === "PAT103245" || identifier === "PAT204356" || identifier === "PAT305467")) {
      // These are our demo patient IDs
      setOtpSent(true);
      toast({
        title: "OTP Sent",
        description: "A mock OTP has been sent to your registered phone number",
      });
      return;
    }
    
    // For other identifiers, validate properly
    if (loginMethod === 'aadhaar') {
      // Validate Aadhaar ID
      if (identifier.length !== 12 || !/^\d+$/.test(identifier)) {
        toast({
          title: "Invalid Aadhaar ID",
          description: "Please enter a valid 12-digit Aadhaar ID",
          variant: "destructive"
        });
        return;
      }
      
      // Check if Aadhaar ID exists
      const userData = mockAadhaarDB.find(p => p.aadhaarId === identifier);
      
      // Check patient registration
      const patientExists = mockPatientDB.some(p => p.aadhaarId === identifier);
      
      if (!userData || !patientExists) {
        // For any non-demo Aadhaar, just show a registration message
        toast({
          title: "Registration Required",
          description: "Please register first before logging in",
          variant: "destructive"
        });
        
        setTimeout(() => {
          navigate("/patient/register");
        }, 1000);
        return;
      }
      
      setOtpSent(true);
      toast({
        title: "OTP Sent",
        description: `A mock OTP has been sent to ${userData.phone.substring(0, 2)}****${userData.phone.substring(6)}`,
      });
    } else {
      // Validate Patient ID
      if (!identifier.startsWith("PAT") || identifier.length !== 9) {
        toast({
          title: "Invalid Patient ID",
          description: "Please enter a valid Patient ID (e.g., PAT103245)",
          variant: "destructive"
        });
        return;
      }
      
      // Check if Patient ID exists
      const patientExists = mockPatientDB.some(p => p.patientId === identifier);
      
      if (!patientExists) {
        toast({
          title: "Patient Not Found",
          description: "No patient found with this ID. Please register first.",
          variant: "destructive"
        });
        
        setTimeout(() => {
          navigate("/patient/register");
        }, 1000);
        return;
      }
      
      setOtpSent(true);
      toast({
        title: "OTP Sent",
        description: "A mock OTP has been sent to your registered phone number",
      });
    }
  };

  const handleVerifyOTP = (e: React.FormEvent) => {
    e.preventDefault();
    
    // For demo purposes, accept any 6-digit OTP
    if (otp.length !== 6 || !/^\d+$/.test(otp)) {
      toast({
        title: "Invalid OTP",
        description: "Please enter a valid 6-digit OTP",
        variant: "destructive"
      });
      return;
    }
    
    let userData;
    
    if (loginMethod === 'aadhaar') {
      // Find patient by Aadhaar ID
      userData = mockPatientDB.find(p => p.aadhaarId === identifier);
    } else {
      // Find patient by Patient ID
      userData = mockPatientDB.find(p => p.patientId === identifier);
    }
    
    if (userData) {
      // Store patient data in localStorage for persistence
      localStorage.setItem("userType", "patient");
      localStorage.setItem("userData", JSON.stringify(userData));
      
      toast({
        title: "Login Successful",
        description: `Welcome, ${userData.name}!`,
      });
      
      navigate("/patient-dashboard");
    } else {
      // This should rarely happen with our demo setup
      toast({
        title: "Login Failed",
        description: "Please register first before attempting to login",
        variant: "destructive"
      });
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-md mx-auto">
          <Card className="shadow-md">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Patient Login</CardTitle>
              <CardDescription>
                Access your medical records securely
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              {!otpSent ? (
                <form onSubmit={handleSendOTP}>
                  <div className="grid gap-4">
                    <Tabs defaultValue="aadhaar" onValueChange={(v) => setLoginMethod(v as 'aadhaar' | 'patientId')}>
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="aadhaar">Aadhaar ID</TabsTrigger>
                        <TabsTrigger value="patientId">Patient ID</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="aadhaar" className="mt-4">
                        <div className="grid gap-2">
                          <Label htmlFor="aadhaar">Aadhaar ID</Label>
                          <Input 
                            id="aadhaar"
                            type="text" 
                            placeholder="12-digit Aadhaar Number" 
                            value={identifier}
                            onChange={(e) => setIdentifier(e.target.value)}
                            maxLength={12}
                            required
                          />
                          <p className="text-sm text-gray-500">For demo: Try 123456789012</p>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="patientId" className="mt-4">
                        <div className="grid gap-2">
                          <Label htmlFor="patientId">Patient ID</Label>
                          <Input 
                            id="patientId"
                            type="text" 
                            placeholder="e.g., PAT103245" 
                            value={identifier}
                            onChange={(e) => setIdentifier(e.target.value)}
                            required
                          />
                          <p className="text-sm text-gray-500">For demo: Try PAT103245</p>
                        </div>
                      </TabsContent>
                    </Tabs>
                    
                    <Button type="submit" className="w-full mt-2 bg-blue-500 hover:bg-blue-600">Get OTP</Button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleVerifyOTP}>
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="otp">One-Time Password</Label>
                      <Input 
                        id="otp"
                        type="text" 
                        placeholder="Enter 6-digit OTP" 
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        maxLength={6}
                        required
                      />
                      <p className="text-sm text-gray-500">
                        For demo purposes, enter any 6 digits
                      </p>
                    </div>
                    
                    <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600">Verify OTP</Button>
                  </div>
                </form>
              )}
            </CardContent>
            
            <CardFooter className="flex justify-center">
              <p className="text-sm text-gray-500">
                Don't have an account?{" "}
                <Link to="/patient/register" className="text-blue-600 hover:underline">
                  Register here
                </Link>
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default PatientLogin;
