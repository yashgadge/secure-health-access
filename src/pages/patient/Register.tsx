
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { mockAadhaarDB, generatePatientId, addNewAadhaarToMockDB, mockPatientDB, persistMockDatabases } from '@/utils/mockDatabase';

const PatientRegister = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [aadhaarId, setAadhaarId] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [patientId, setPatientId] = useState("");

  // Check for temp Aadhaar ID on component mount
  useEffect(() => {
    const tempAadhaarId = sessionStorage.getItem("tempAadhaarId");
    if (tempAadhaarId) {
      setAadhaarId(tempAadhaarId);
      sessionStorage.removeItem("tempAadhaarId"); // Clear after use
      
      // Automatically trigger verification if Aadhaar ID was provided
      if (tempAadhaarId.length === 12) {
        const event = new Event('submit') as unknown as React.FormEvent;
        handleVerifyAadhaar(event);
      }
    }
  }, []);

  const handleVerifyAadhaar = (e: React.FormEvent) => {
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
    
    // For demo Aadhaar IDs, handle specially
    if (aadhaarId === "123456789012") {
      // Redirect to login since this is our demo Aadhaar
      toast({
        title: "Already Registered",
        description: "This Aadhaar is already registered. Redirecting to login...",
      });
      
      setTimeout(() => {
        navigate("/patient/login");
      }, 1000);
      return;
    }
    
    // Check if a patient already exists with this Aadhaar ID
    const existingPatient = mockPatientDB.find(p => p.aadhaarId === aadhaarId);
    if (existingPatient) {
      toast({
        title: "Patient Already Exists",
        description: "An account with this Aadhaar ID already exists. Please login instead.",
        variant: "destructive"
      });
      
      setTimeout(() => {
        navigate("/patient/login");
      }, 1000);
      return;
    }
    
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
    
    // Auto-generate Patient ID
    const newPatientId = generatePatientId();
    setPatientId(newPatientId);
    
    // Set user data from Aadhaar
    setUserData(user);
    
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
    
    // Create new patient record
    const patientData = {
      aadhaarId,
      patientId,
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      address: userData.address, // Add the address property from userData
      authorizedDoctors: []
    };
    
    // Add to mock database
    mockPatientDB.push(patientData);
    persistMockDatabases();
    
    toast({
      title: "Registration Successful",
      description: `Welcome, ${userData.name}! Your Patient ID is ${patientId}`,
    });
    
    // Redirect to login page
    setTimeout(() => {
      navigate("/patient/login");
    }, 1000);
  };

  return (
    <Layout>
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-md mx-auto">
          <Card className="shadow-md">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Patient Registration</CardTitle>
              <CardDescription>
                Register using your Aadhaar ID to create your medical profile
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              {!otpSent ? (
                <form onSubmit={handleVerifyAadhaar}>
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
                      <p className="text-sm text-gray-500">Enter any 12-digit number for testing</p>
                    </div>
                    
                    <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600">Verify Aadhaar</Button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleVerifyOTP}>
                  <div className="grid gap-6">
                    {/* Display auto-filled details */}
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
                    
                    <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600">Complete Registration</Button>
                  </div>
                </form>
              )}
            </CardContent>
            
            <CardFooter className="flex flex-col">
              <p className="text-sm text-gray-500 text-center w-full">
                By registering, you agree to our Terms of Service and Privacy Policy
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default PatientRegister;
