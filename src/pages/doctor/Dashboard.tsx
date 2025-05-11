
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Label } from "@/components/ui/label";
import { mockPatientDB } from '@/utils/mockDatabase';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userData, setUserData] = useState<any>(null);
  const [patientIdentifier, setPatientIdentifier] = useState("");
  const [otp, setOtp] = useState("");
  const [showOTPInput, setShowOTPInput] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  
  useEffect(() => {
    // Check if user is logged in
    const userType = sessionStorage.getItem("userType");
    const storedUserData = sessionStorage.getItem("userData");
    
    if (userType !== "doctor" || !storedUserData) {
      toast({
        title: "Unauthorized Access",
        description: "Please login as a doctor to view this page",
        variant: "destructive"
      });
      navigate("/doctor/login");
      return;
    }
    
    // Parse user data
    const parsedUserData = JSON.parse(storedUserData);
    setUserData(parsedUserData);
  }, [navigate, toast]);
  
  const handleRequestAccess = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate patient identifier
    if (!patientIdentifier) {
      toast({
        title: "Missing Information",
        description: "Please enter a Patient ID or Aadhaar number",
        variant: "destructive"
      });
      return;
    }
    
    // Check if patient exists
    let patient;
    if (patientIdentifier.startsWith("PAT")) {
      // Search by Patient ID
      patient = mockPatientDB.find(p => p.patientId === patientIdentifier);
    } else {
      // Search by Aadhaar ID
      patient = mockPatientDB.find(p => p.aadhaarId === patientIdentifier);
    }
    
    if (!patient) {
      toast({
        title: "Patient Not Found",
        description: "No patient found with the provided information",
        variant: "destructive"
      });
      return;
    }
    
    // Check if doctor already has access
    if (patient.authorizedDoctors && patient.authorizedDoctors.includes(userData.doctorId)) {
      // Doctor already has access, direct to patient history
      toast({
        title: "Access Already Granted",
        description: "You already have access to this patient's records",
      });
      
      setSelectedPatient(patient);
      // Store the selected patient for use in PatientHistory component
      sessionStorage.setItem("selectedPatient", JSON.stringify(patient));
      navigate("/doctor/patient-history");
      return;
    }
    
    // Request OTP for access
    setSelectedPatient(patient);
    setShowOTPInput(true);
    
    toast({
      title: "Access Request Sent",
      description: "Ask patient to share the OTP displayed on their device",
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
    
    // Update patient's authorized doctors list
    if (selectedPatient) {
      const updatedPatient = {
        ...selectedPatient,
        authorizedDoctors: [...(selectedPatient.authorizedDoctors || []), userData.doctorId]
      };
      
      // In a real app, this would update the database
      // Update mock data for demo purposes
      const patientIndex = mockPatientDB.findIndex(p => p.patientId === selectedPatient.patientId);
      if (patientIndex !== -1) {
        mockPatientDB[patientIndex] = updatedPatient;
      }
      
      toast({
        title: "Access Granted",
        description: `You now have access to ${selectedPatient.name}'s medical records`,
      });
      
      // Store the selected patient for use in PatientHistory component
      sessionStorage.setItem("selectedPatient", JSON.stringify(updatedPatient));
      
      // Navigate to patient history page
      navigate("/doctor/patient-history");
    }
  };
  
  const handleLogout = () => {
    sessionStorage.removeItem("userType");
    sessionStorage.removeItem("userData");
    sessionStorage.removeItem("selectedPatient");
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully",
    });
    navigate("/");
  };

  if (!userData) {
    return null; // Will redirect in useEffect
  }

  return (
    <Layout>
      <div className="container mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Doctor Dashboard</h1>
          <Button variant="outline" onClick={handleLogout}>Logout</Button>
        </div>
        
        <Tabs defaultValue="access">
          <TabsList className="mb-8">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="access">Patient Access</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Doctor Profile</CardTitle>
                <CardDescription>Your professional information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">Doctor ID</p>
                      <p className="font-medium">{userData.doctorId}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">Name</p>
                      <p className="font-medium">{userData.name}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium">{userData.email}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">Specialization</p>
                      <p className="font-medium">{userData.specialization}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">Hospital Affiliation</p>
                      <p className="font-medium">{userData.hospitalAffiliation}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="access">
            <Card>
              <CardHeader>
                <CardTitle>Patient Access</CardTitle>
                <CardDescription>Access patient records with their permission</CardDescription>
              </CardHeader>
              <CardContent>
                {!showOTPInput ? (
                  <form onSubmit={handleRequestAccess}>
                    <div className="grid gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="patientId">Patient ID or Aadhaar Number</Label>
                        <Input 
                          id="patientId"
                          type="text" 
                          placeholder="Enter Patient ID (e.g., PAT103245) or Aadhaar number" 
                          value={patientIdentifier}
                          onChange={(e) => setPatientIdentifier(e.target.value)}
                          required
                        />
                        <p className="text-sm text-gray-500">For demo: Try PAT103245 or 123456789012</p>
                      </div>
                      
                      <Button type="submit" className="w-full">Request Access</Button>
                    </div>
                  </form>
                ) : (
                  <form onSubmit={handleVerifyOTP}>
                    <div className="grid gap-6">
                      <div className="p-4 bg-gray-50 rounded-md">
                        <p className="font-medium">Requesting access to:</p>
                        <div className="mt-2">
                          <p><span className="text-gray-500">Name:</span> {selectedPatient?.name}</p>
                          <p><span className="text-gray-500">Patient ID:</span> {selectedPatient?.patientId}</p>
                        </div>
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="otp">One-Time Password from Patient</Label>
                        <Input 
                          id="otp"
                          type="text" 
                          placeholder="Enter 6-digit OTP shared by patient" 
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          maxLength={6}
                          required
                        />
                        <p className="text-sm text-gray-500">
                          For demo purposes, enter any 6 digits
                        </p>
                      </div>
                      
                      <div className="flex gap-4">
                        <Button type="submit" className="flex-1">Verify OTP</Button>
                        <Button 
                          type="button" 
                          variant="outline"
                          onClick={() => {
                            setShowOTPInput(false);
                            setSelectedPatient(null);
                            setOtp("");
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </form>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default DoctorDashboard;
