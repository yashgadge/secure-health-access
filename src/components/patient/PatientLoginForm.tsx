
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

// Import mock data
import { mockAadhaarDB, mockPatientDB, generatePatientId, addNewAadhaarToMockDB, persistMockDatabases } from '@/utils/mockDatabase';

const PatientLoginForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Authentication states
  const [aadhaarId, setAadhaarId] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  
  // Registration states
  const [isNewUser, setIsNewUser] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [patientId, setPatientId] = useState("");

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
    
    // Check if Aadhaar ID exists in mock DB, if not, add it
    let user = mockAadhaarDB.find(p => p.aadhaarId === aadhaarId);
    if (!user) {
      // Add new Aadhaar with generated mock data
      user = addNewAadhaarToMockDB(aadhaarId);
      
      toast({
        title: "New Aadhaar ID Registered",
        description: "We've created a profile for your new Aadhaar ID",
      });
    }
    
    // Set user data from Aadhaar
    setUserData(user);
    
    if (!patientExists) {
      // New patient - show registration flow
      setIsNewUser(true);
      
      // Auto-generate Patient ID
      const newPatientId = generatePatientId();
      setPatientId(newPatientId);
    }
    
    // Mock OTP sending
    setOtpSent(true);
    toast({
      title: "OTP Sent",
      description: `A mock OTP has been sent to ${user.phone.substring(0, 2)}****${user.phone.substring(6)}`,
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
    
    if (isNewUser) {
      // Registration for new patient
      // Create new patient record
      const newPatient = {
        aadhaarId,
        patientId,
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        authorizedDoctors: []
      };
      
      // Add to mock DB
      mockPatientDB.push(newPatient);
      persistMockDatabases(); // Save to localStorage
      
      // Store patient data in localStorage
      localStorage.setItem("userType", "patient");
      localStorage.setItem("userData", JSON.stringify(newPatient));
      
      toast({
        title: "Registration Successful",
        description: `Welcome, ${userData.name}! Your Patient ID is ${patientId}`,
      });
      
      navigate("/patient-dashboard");
    } else {
      // Login for existing patient
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
        // This should not happen given our earlier checks
        toast({
          title: "Login Failed",
          description: "Something went wrong. Please try again.",
          variant: "destructive"
        });
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
              {isNewUser && (
                <>
                  {/* Display auto-filled details for new users */}
                  <div className="grid gap-4 p-4 bg-gray-50 rounded-md">
                    <h3 className="font-medium">Auto-filled Details from Aadhaar</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="text-gray-500">Name:</div>
                      <div className="font-medium">{userData?.name}</div>
                      <div className="text-gray-500">Email:</div>
                      <div className="font-medium">{userData?.email}</div>
                      <div className="text-gray-500">Phone:</div>
                      <div className="font-medium">{userData?.phone}</div>
                      <div className="text-gray-500">Patient ID:</div>
                      <div className="font-medium">{patientId}</div>
                    </div>
                  </div>
                </>
              )}
              
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
              
              <Button type="submit" className="w-full">
                {isNewUser ? "Complete Registration" : "Verify OTP"}
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
};

export default PatientLoginForm;
