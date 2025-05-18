
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { mockDoctorDB, mockAadhaarDB, addNewAadhaarToMockDB, persistMockDatabases } from '@/utils/mockDatabase';

const DoctorLogin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [aadhaarId, setAadhaarId] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  // Check for existing login on component mount
  useEffect(() => {
    const userType = localStorage.getItem("userType");
    const userData = localStorage.getItem("userData");
    
    if (userType === "doctor" && userData) {
      // User is already logged in as a doctor
      navigate("/doctor/dashboard");
    }
  }, [navigate]);

  const handleSendOTP = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate Aadhaar ID
    if (aadhaarId.length !== 12 || !/^\d+$/.test(aadhaarId)) {
      toast({
        title: "Invalid Aadhaar ID",
        description: "Please enter a valid 12-digit Aadhaar ID",
        variant: "destructive"
      });
      return;
    }
    
    // For demo doctor IDs, always allow login
    if (aadhaarId === "345678901234" || aadhaarId === "456789012345" || aadhaarId === "678901234567") {
      const userData = mockAadhaarDB.find(p => p.aadhaarId === aadhaarId);
      
      setOtpSent(true);
      toast({
        title: "OTP Sent",
        description: `A mock OTP has been sent to ${userData?.phone.substring(0, 2)}****${userData?.phone.substring(6)}`,
      });
      return;
    }
    
    // Check if doctor exists with this Aadhaar ID
    const doctorExists = mockDoctorDB.some(d => d.aadhaarId === aadhaarId);
    
    if (!doctorExists) {
      // For non-demo Aadhaar IDs, redirect to registration
      toast({
        title: "Registration Required",
        description: "Please register first before logging in",
        variant: "destructive"
      });
      
      setTimeout(() => {
        navigate("/doctor/register");
      }, 1000);
      return;
    }
    
    // Find user in Aadhaar DB
    const userData = mockAadhaarDB.find(p => p.aadhaarId === aadhaarId);
    
    // Mock OTP sending
    setOtpSent(true);
    toast({
      title: "OTP Sent",
      description: `A mock OTP has been sent to ${userData?.phone.substring(0, 2)}****${userData?.phone.substring(6)}`,
    });
  };

  const handleVerifyOTP = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Verify OTP (mock verification - any 6-digit OTP is accepted)
    if (otp.length !== 6 || !/^\d+$/.test(otp)) {
      toast({
        title: "Invalid OTP",
        description: "Please enter a valid 6-digit OTP",
        variant: "destructive"
      });
      return;
    }
    
    // Find doctor data
    const doctorData = mockDoctorDB.find(d => d.aadhaarId === aadhaarId);
    
    if (doctorData) {
      // Store doctor data in localStorage for persistence
      localStorage.setItem("userType", "doctor");
      localStorage.setItem("userData", JSON.stringify(doctorData));
      
      toast({
        title: "Login Successful",
        description: `Welcome, Dr. ${doctorData.name}!`,
      });
      
      navigate("/doctor/dashboard");
    } else {
      // This should not happen given our earlier checks
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
              <CardTitle className="text-2xl">Doctor Login</CardTitle>
              <CardDescription>
                Access your medical dashboard securely
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              {!otpSent ? (
                <form onSubmit={handleSendOTP}>
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="aadhaar">Aadhaar ID</Label>
                      <Input 
                        id="aadhaar"
                        type="text" 
                        placeholder="12-digit Aadhaar Number" 
                        value={aadhaarId}
                        onChange={(e) => setAadhaarId(e.target.value)}
                        maxLength={12}
                        required
                      />
                      <p className="text-sm text-gray-500">For demo: Try 345678901234</p>
                    </div>
                    
                    <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600">Get OTP</Button>
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
                <Link to="/doctor/register" className="text-blue-600 hover:underline">
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

export default DoctorLogin;
