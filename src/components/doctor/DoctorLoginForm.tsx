
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

// Import mock data
import { mockDoctorDB, mockAadhaarDB } from '@/utils/mockDatabase';

const DoctorLoginForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Authentication states
  const [aadhaarId, setAadhaarId] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

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
    
    console.log("Attempting login with Aadhaar:", aadhaarId);
    console.log("Available doctors:", mockDoctorDB);
    console.log("Available Aadhaar records:", mockAadhaarDB);
    
    // Check if doctor exists with this Aadhaar ID
    const doctorExists = mockDoctorDB.some(d => d.aadhaarId === aadhaarId);
    if (!doctorExists) {
      toast({
        title: "Doctor not found",
        description: "No doctor account found with this Aadhaar ID. Please register first.",
        variant: "destructive"
      });
      return;
    }
    
    // Find Aadhaar data
    const userData = mockAadhaarDB.find(p => p.aadhaarId === aadhaarId);
    if (!userData) {
      toast({
        title: "Aadhaar ID not found",
        description: "This Aadhaar ID is not registered in our system",
        variant: "destructive"
      });
      return;
    }
    
    // Mock OTP sending
    setOtpSent(true);
    toast({
      title: "OTP Sent",
      description: `A mock OTP has been sent to ${userData.phone.substring(0, 2)}****${userData.phone.substring(6)}`,
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
    const doctor = mockDoctorDB.find(d => d.aadhaarId === aadhaarId);
    
    if (doctor) {
      // Store doctor data in localStorage for persistence
      localStorage.setItem("userType", "doctor");
      localStorage.setItem("userData", JSON.stringify(doctor));
      
      toast({
        title: "Login Successful",
        description: `Welcome back, Dr. ${doctor.name}!`,
      });
      
      navigate("/doctor/dashboard");
    } else {
      toast({
        title: "Login Failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <Card>
      <CardHeader>
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
              
              <Button type="submit" className="w-full">Get OTP</Button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleVerifyOTP}>
            <div className="grid gap-6">
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
              
              <Button type="submit" className="w-full">Verify OTP</Button>
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
  );
};

export default DoctorLoginForm;
