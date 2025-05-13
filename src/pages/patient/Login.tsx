
import React, { useState } from 'react';
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

  const handleSendOTP = (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log("Attempting to send OTP for:", identifier);
    console.log("Available patients:", mockPatientDB);
    console.log("Available Aadhaar records:", mockAadhaarDB);
    
    let isValid = false;
    let userData = null;
    
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
      userData = mockAadhaarDB.find(p => p.aadhaarId === identifier);
      isValid = !!userData;
      
      // Verify patient registration
      const patientExists = mockPatientDB.some(p => p.aadhaarId === identifier);
      if (userData && !patientExists) {
        toast({
          title: "Registration Required",
          description: "Your Aadhaar is valid but you need to register as a patient first",
          variant: "destructive"
        });
        return;
      }
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
      const patient = mockPatientDB.find(p => p.patientId === identifier);
      if (patient) {
        userData = mockAadhaarDB.find(p => p.aadhaarId === patient.aadhaarId);
        isValid = !!userData;
      }
    }
    
    if (!isValid || !userData) {
      toast({
        title: "Invalid Credentials",
        description: "The entered information is not registered in our system",
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
    
    let userData;
    
    if (loginMethod === 'aadhaar') {
      // Find patient by Aadhaar ID
      const patientData = mockPatientDB.find(p => p.aadhaarId === identifier);
      userData = patientData;
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
      
      navigate("/patient/dashboard");
    } else {
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
          <Card>
            <CardHeader>
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
                    
                    <Button type="submit" className="w-full mt-2">Get OTP</Button>
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
                    
                    <Button type="submit" className="w-full">Verify OTP</Button>
                  </div>
                </form>
              )}
            </CardContent>
            
            <CardFooter className="flex justify-center">
              <p className="text-sm text-gray-500">
                Don't have an account?{" "}
                <Link to="/patient/register" className="text-medical-primary hover:underline">
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
