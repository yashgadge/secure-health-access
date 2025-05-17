
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

// Import mock data
import { mockAadhaarDB, mockPatientDB } from '@/utils/mockDatabase';

const PatientLoginForm = () => {
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
    console.log("Available patients:", mockPatientDB);
    console.log("Available Aadhaar records:", mockAadhaarDB);
    
    // Check if patient exists with this Aadhaar ID
    const patientExists = mockPatientDB.some(p => p.aadhaarId === aadhaarId);
    if (!patientExists) {
      toast({
        title: "Patient not found",
        description: "No patient found with this Aadhaar ID. Please register first.",
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
    
    // Find patient data
    const patient = mockPatientDB.find(p => p.aadhaarId === aadhaarId);
    
    if (patient) {
      // Store patient data in localStorage for persistence
      localStorage.setItem("userType", "patient");
      localStorage.setItem("userData", JSON.stringify(patient));
      
      toast({
        title: "Login Successful",
        description: `Welcome back, ${patient.name}!`,
      });
      
      navigate("/patient-dashboard");
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
        <CardTitle className="text-2xl">Patient Login</CardTitle>
        <CardDescription>
          Sign in using your Aadhaar ID to access your medical records
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
                <p className="text-sm text-gray-500 mt-1">
                  For demo: 123456789012
                </p>
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
                <p className="text-sm text-gray-500 mt-1">
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
          <Link to="/patient/register" className="text-blue-600 hover:underline">
            Register here
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
};

export default PatientLoginForm;
