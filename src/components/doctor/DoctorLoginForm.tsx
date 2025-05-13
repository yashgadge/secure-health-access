
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

// Import mock data
import { mockDoctorDB, mockAadhaarDB, generateDoctorId, addNewAadhaarToMockDB, persistMockDatabases } from '@/utils/mockDatabase';

const DoctorLoginForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Authentication states
  const [aadhaarId, setAadhaarId] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  
  // Registration states (only shown for new users)
  const [isNewUser, setIsNewUser] = useState(false);
  const [specialization, setSpecialization] = useState("");
  const [hospital, setHospital] = useState("");
  const [userData, setUserData] = useState<any>(null);
  const [doctorId, setDoctorId] = useState("");

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
    
    if (!doctorExists) {
      // New doctor - show registration fields
      setIsNewUser(true);
      
      // Auto-generate Doctor ID
      const newDoctorId = generateDoctorId();
      setDoctorId(newDoctorId);
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
      // Registration for new doctor
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
      
      // Create new doctor
      const newDoctor = {
        aadhaarId,
        doctorId,
        email: userData.email,
        password: "password123", // Default password
        name: userData.name,
        specialization,
        hospitalAffiliation: hospital
      };
      
      // Add to mock DB
      mockDoctorDB.push(newDoctor);
      persistMockDatabases(); // Save to localStorage
      
      // Store doctor data in localStorage
      localStorage.setItem("userType", "doctor");
      localStorage.setItem("userData", JSON.stringify(newDoctor));
      
      toast({
        title: "Registration Successful",
        description: `Welcome, Dr. ${userData.name}! Your account has been created.`,
      });
      
      navigate("/doctor/dashboard");
    } else {
      // Login for existing doctor
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
                      <div className="text-gray-500">Doctor ID:</div>
                      <div className="font-medium">{doctorId}</div>
                    </div>
                  </div>
                  
                  {/* Additional doctor information for new users */}
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
                <p className="text-sm text-gray-500">
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

export default DoctorLoginForm;
