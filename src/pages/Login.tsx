
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";

// Mock Aadhaar database
const mockAadhaarDB = [
  {
    aadhaarId: "123456789012",
    name: "Rahul Sharma",
    dob: "1990-05-15",
    gender: "Male",
    address: "123 Main Street, Mumbai, Maharashtra",
    phone: "9876543210",
    email: "rahul.sharma@example.com"
  },
  {
    aadhaarId: "234567890123",
    name: "Priya Patel",
    dob: "1985-11-22",
    gender: "Female",
    address: "456 Park Avenue, Delhi, Delhi",
    phone: "8765432109",
    email: "priya.patel@example.com"
  }
];

// Mock doctor database
const mockDoctorDB = [
  {
    id: "D001",
    email: "doctor@example.com",
    password: "password123",
    name: "Dr. Anjali Desai",
    specialization: "Cardiologist",
    hospitalAffiliation: "City Medical Center"
  }
];

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [aadhaarId, setAadhaarId] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [doctorEmail, setDoctorEmail] = useState("");
  const [doctorPassword, setDoctorPassword] = useState("");

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

  const handleDoctorLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate doctor credentials
    const doctor = mockDoctorDB.find(
      d => d.email === doctorEmail && d.password === doctorPassword
    );
    
    if (!doctor) {
      toast({
        title: "Login Failed",
        description: "Invalid email or password",
        variant: "destructive"
      });
      return;
    }
    
    // Login successful
    sessionStorage.setItem("userType", "doctor");
    sessionStorage.setItem("userData", JSON.stringify(doctor));
    toast({
      title: "Login Successful",
      description: `Welcome, ${doctor.name}!`,
    });
    navigate("/doctor-dashboard");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <div className="container mx-auto py-4 px-6 flex items-center">
          <Link to="/" className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-medical-primary">
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
            </svg>
            <span className="text-xl font-bold text-medical-primary">MediRecord</span>
          </Link>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center p-6">
        <Tabs defaultValue="patient" className="w-full max-w-md">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="patient">Patient Login</TabsTrigger>
            <TabsTrigger value="doctor">Doctor Login</TabsTrigger>
          </TabsList>
          
          <TabsContent value="patient">
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
          </TabsContent>
          
          <TabsContent value="doctor">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Doctor Login</CardTitle>
                <CardDescription>
                  Sign in to access your patient records and management system
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleDoctorLogin}>
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email"
                        type="email" 
                        placeholder="doctor@example.com" 
                        value={doctorEmail}
                        onChange={(e) => setDoctorEmail(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="password">Password</Label>
                        <Link to="/forgot-password" className="text-sm text-medical-primary hover:underline">
                          Forgot password?
                        </Link>
                      </div>
                      <Input 
                        id="password"
                        type="password" 
                        value={doctorPassword}
                        onChange={(e) => setDoctorPassword(e.target.value)}
                        required
                      />
                      <p className="text-sm text-gray-500 mt-1">
                        For demo: doctor@example.com / password123
                      </p>
                    </div>
                    
                    <Button type="submit" className="w-full">Sign In</Button>
                  </div>
                </form>
              </CardContent>
              <CardFooter className="flex flex-col">
                <p className="text-sm text-gray-500 text-center w-full">
                  Need access? Contact your hospital administrator
                </p>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      <footer className="bg-gray-50 border-t">
        <div className="container mx-auto py-4 px-6 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} MediRecord. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Login;
