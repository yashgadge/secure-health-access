
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { mockAadhaarDB, generateDoctorId, addNewAadhaarToMockDB, mockDoctorDB, persistMockDatabases } from '@/utils/mockDatabase';

const DoctorRegister = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [aadhaarId, setAadhaarId] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [doctorId, setDoctorId] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [hospital, setHospital] = useState("");

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
    
    // For demo purpose - if it's the predefined Aadhaar, redirect to login
    if (aadhaarId === "345678901234") {
      toast({
        title: "Already Registered",
        description: "This Aadhaar is already registered. Redirecting to login...",
      });
      
      setTimeout(() => {
        navigate("/doctor/login");
      }, 1000);
      return;
    }
    
    // Check if a doctor already exists with this Aadhaar ID
    const existingDoctor = mockDoctorDB.find(d => d.aadhaarId === aadhaarId);
    if (existingDoctor) {
      toast({
        title: "Doctor Already Exists",
        description: "An account with this Aadhaar ID already exists. Please login instead.",
        variant: "destructive"
      });
      
      setTimeout(() => {
        navigate("/doctor/login");
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
    
    // Auto-generate Doctor ID
    const newDoctorId = generateDoctorId();
    setDoctorId(newDoctorId);
    
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
    
    // Validate additional fields
    if (!specialization.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter your specialization",
        variant: "destructive"
      });
      return;
    }
    
    if (!hospital.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter your hospital affiliation",
        variant: "destructive"
      });
      return;
    }
    
    // Create new doctor record
    const doctorData = {
      aadhaarId,
      doctorId,
      email: userData.email,
      password: "password123", // Default password
      name: userData.name,
      specialization,
      hospitalAffiliation: hospital
    };
    
    // Add to mock database
    mockDoctorDB.push(doctorData);
    persistMockDatabases();
    
    toast({
      title: "Registration Successful",
      description: `Welcome, Dr. ${userData.name}! Your Doctor ID is ${doctorId}`,
    });
    
    // Redirect to login page
    setTimeout(() => {
      navigate("/doctor/login");
    }, 1000);
  };

  return (
    <Layout>
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-md mx-auto">
          <Card className="shadow-md">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Doctor Registration</CardTitle>
              <CardDescription>
                Register using your Aadhaar ID to create your doctor profile
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
                    
                    <p className="text-sm text-gray-500 text-center mt-2">
                      By registering, you agree to our Terms of Service and Privacy Policy
                    </p>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleVerifyOTP}>
                  <div className="grid gap-6">
                    {/* Display auto-filled details */}
                    <div className="grid gap-4 p-4 bg-gray-50 rounded-md">
                      <h3 className="font-medium">Auto-filled Details from Aadhaar</h3>
                      <div className="grid grid-cols-2 gap-y-3">
                        <div className="text-gray-500">Name:</div>
                        <div className="font-medium">{userData?.name}</div>
                        <div className="text-gray-500">Email:</div>
                        <div className="font-medium">{userData?.email}</div>
                        <div className="text-gray-500">Doctor ID:</div>
                        <div className="font-medium">{doctorId}</div>
                      </div>
                    </div>
                    
                    {/* Additional doctor information */}
                    <div className="grid gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="specialization">Specialization</Label>
                        <Input 
                          id="specialization"
                          type="text" 
                          placeholder="e.g., Cardiology, Pediatrics" 
                          value={specialization}
                          onChange={(e) => setSpecialization(e.target.value)}
                          required
                        />
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="hospital">Hospital Affiliation</Label>
                        <Input 
                          id="hospital"
                          type="text" 
                          placeholder="e.g., City General Hospital" 
                          value={hospital}
                          onChange={(e) => setHospital(e.target.value)}
                          required
                        />
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
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default DoctorRegister;
