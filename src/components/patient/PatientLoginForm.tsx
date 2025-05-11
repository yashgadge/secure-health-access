
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

// Import mock data
import { mockAadhaarDB } from '@/utils/mockDatabase';

const PatientLoginForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [aadhaarId, setAadhaarId] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  const handlePatientLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!otpSent) {
      // Validate Aadhaar ID
      if (aadhaarId.length !== 12 || !/^\d+$/.test(aadhaarId)) {
        toast({
          title: "Invalid Aadhaar ID",
          description: "Please enter a valid 12-digit Aadhaar ID",
          variant: "destructive"
        });
        return;
      }
      
      // Check if Aadhaar ID exists in mock DB
      const patient = mockAadhaarDB.find(p => p.aadhaarId === aadhaarId);
      if (!patient) {
        toast({
          title: "Aadhaar ID not found",
          description: "The entered Aadhaar ID is not registered in our system",
          variant: "destructive"
        });
        return;
      }
      
      // Mock OTP sending
      setOtpSent(true);
      toast({
        title: "OTP Sent",
        description: `A mock OTP has been sent to ${patient.phone.substring(0, 2)}****${patient.phone.substring(6)}`,
      });
    } else {
      // Verify OTP (mock verification - any 6-digit OTP is accepted)
      if (otp.length !== 6 || !/^\d+$/.test(otp)) {
        toast({
          title: "Invalid OTP",
          description: "Please enter a valid 6-digit OTP",
          variant: "destructive"
        });
        return;
      }
      
      // Login successful
      const patient = mockAadhaarDB.find(p => p.aadhaarId === aadhaarId);
      if (patient) {
        // Store patient data in session storage
        sessionStorage.setItem("userType", "patient");
        sessionStorage.setItem("userData", JSON.stringify(patient));
        toast({
          title: "Login Successful",
          description: `Welcome, ${patient.name}!`,
        });
        navigate("/patient-dashboard");
      }
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
        <form onSubmit={handlePatientLogin}>
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
                disabled={otpSent}
                required
              />
            </div>
            
            {otpSent && (
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
            )}
            
            <Button type="submit" className="w-full">
              {otpSent ? "Verify OTP" : "Get OTP"}
            </Button>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col">
        <p className="text-sm text-gray-500 text-center w-full">
          By logging in, you agree to our Terms of Service and Privacy Policy
        </p>
      </CardFooter>
    </Card>
  );
};

export default PatientLoginForm;
