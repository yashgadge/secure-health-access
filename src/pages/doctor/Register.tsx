
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { mockAadhaarDB, generateDoctorId } from '@/utils/mockDatabase';

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
    
    // Check if Aadhaar ID exists in mock DB
    const user = mockAadhaarDB.find(p => p.aadhaarId === aadhaarId);
    if (!user) {
      toast({
        title: "Aadhaar ID not found",
        description: "The entered Aadhaar ID is not registered in our system",
        variant: "destructive"
      });
      return;
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
    
    // Store doctor data in session storage
    const doctorData = {
      ...userData,
      doctorId,
      specialization,
      hospitalAffiliation: hospital
    };
    
    sessionStorage.setItem("userType", "doctor");
    sessionStorage.setItem("userData", JSON.stringify(doctorData));
    
    toast({
      title: "Registration Successful",
      description: `Welcome, Dr. ${userData.name}! Your Doctor ID is ${doctorId}`,
    });
    
    // Redirect to login page
    navigate("/doctor/login");
  };

  return (
    <Layout>
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader>
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
                      <p className="text-sm text-gray-500">For demo: Try 345678901234</p>
                    </div>
                    
                    <Button type="submit" className="w-full">Verify Aadhaar</Button>
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
                    
                    <Button type="submit" className="w-full">Complete Registration</Button>
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

export default DoctorRegister;
