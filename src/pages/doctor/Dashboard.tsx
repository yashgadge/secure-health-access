import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

// Import the types from our new types file
import { Doctor, Patient } from '@/components/doctor/PatientTypes';

// Import the components
import PatientList from '@/components/doctor/PatientList';
import OTPVerification from '@/components/doctor/OTPVerification';
import DoctorProfile from '@/components/doctor/DoctorProfile';

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userData, setUserData] = useState<Doctor | null>(null);
  const [patientIdentifier, setPatientIdentifier] = useState("");
  const [otp, setOtp] = useState("");
  const [showOTPInput, setShowOTPInput] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Check if user is logged in
    const checkSession = async () => {
      setLoading(true);
      
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: "Unauthorized Access",
          description: "Please login as a doctor to view this page",
          variant: "destructive"
        });
        navigate("/doctor/login");
        return;
      }
      
      // Fetch doctor profile data
      const { data: doctorData, error } = await supabase
        .from('doctors')
        .select(`
          id,
          specialization,
          hospital_affiliation,
          license_number,
          profiles:id (
            name,
            email
          )
        `)
        .eq('id', session.user.id)
        .single();
      
      if (error || !doctorData) {
        console.error("Error fetching doctor data:", error);
        toast({
          title: "Access Error",
          description: "Unable to fetch your profile. Please login again.",
          variant: "destructive"
        });
        navigate("/doctor/login");
        return;
      }
      
      // Format doctor data for use in the component
      const formattedDoctorData: Doctor = {
        id: doctorData.id,
        specialization: doctorData.specialization,
        hospital_affiliation: doctorData.hospital_affiliation,
        license_number: doctorData.license_number,
        name: (doctorData.profiles as any).name,
        email: (doctorData.profiles as any).email
      };
      
      setUserData(formattedDoctorData);
      setLoading(false);
    };
    
    checkSession();
  }, [navigate, toast]);
  
  const handleRequestAccess = async (e: React.FormEvent) => {
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
    
    try {
      // Check if patient exists by Aadhaar ID
      const { data: patientData, error } = await supabase
        .from('patients')
        .select(`
          id,
          aadhaar_id,
          gender,
          dob,
          profiles:id (
            name
          )
        `)
        .eq('aadhaar_id', patientIdentifier)
        .single();
      
      if (error || !patientData) {
        toast({
          title: "Patient Not Found",
          description: "No patient found with the provided information",
          variant: "destructive"
        });
        return;
      }
      
      // Check if doctor already has access
      const { data: accessData, error: accessError } = await supabase
        .from('doctor_patient_access')
        .select('*')
        .eq('doctor_id', userData?.id)
        .eq('patient_id', patientData.id)
        .single();
      
      if (accessData) {
        // Doctor already has access, direct to patient history
        toast({
          title: "Access Already Granted",
          description: "You already have access to this patient's records",
        });
        
        // Create the patient object with the returned data
        // Now address is optional in our Patient type, so this won't cause a TypeScript error
        const patient: Patient = {
          id: patientData.id,
          aadhaar_id: patientData.aadhaar_id,
          gender: patientData.gender,
          dob: patientData.dob,
          name: (patientData.profiles as any).name,
        };
        
        // Store the selected patient for use in PatientHistory component
        sessionStorage.setItem("selectedPatient", JSON.stringify(patient));
        navigate("/doctor/patient-history");
        return;
      }
      
      // Format patient data
      // Now address is optional in our Patient type, so this won't cause a TypeScript error
      const patient: Patient = {
        id: patientData.id,
        aadhaar_id: patientData.aadhaar_id,
        gender: patientData.gender,
        dob: patientData.dob,
        name: (patientData.profiles as any).name,
      };
      
      // Request OTP for access
      setSelectedPatient(patient);
      setShowOTPInput(true);
      
      toast({
        title: "Access Request Sent",
        description: "Ask patient to share the OTP displayed on their device",
      });
    } catch (err) {
      console.error("Error checking patient:", err);
      toast({
        title: "Error",
        description: "An error occurred while processing your request",
        variant: "destructive"
      });
    }
  };
  
  const handleVerifyOTP = async (e: React.FormEvent) => {
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
    
    if (!userData || !selectedPatient) {
      toast({
        title: "Error",
        description: "Missing user or patient data",
        variant: "destructive"
      });
      return;
    }
    
    try {
      // Add doctor access record
      const { error } = await supabase
        .from('doctor_patient_access')
        .insert({
          doctor_id: userData.id,
          patient_id: selectedPatient.id,
        });
      
      if (error) {
        console.error("Error granting access:", error);
        toast({
          title: "Access Error",
          description: "Failed to grant access to patient records",
          variant: "destructive"
        });
        return;
      }
      
      toast({
        title: "Access Granted",
        description: `You now have access to ${selectedPatient.name}'s medical records`,
      });
      
      // Store the selected patient for use in PatientHistory component
      sessionStorage.setItem("selectedPatient", JSON.stringify(selectedPatient));
      
      // Navigate to patient history page
      navigate("/doctor/patient-history");
    } catch (err) {
      console.error("Error verifying OTP:", err);
      toast({
        title: "Error",
        description: "An error occurred while processing your request",
        variant: "destructive"
      });
    }
  };
  
  const handleLogout = async () => {
    await supabase.auth.signOut();
    sessionStorage.removeItem("userData");
    sessionStorage.removeItem("selectedPatient");
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully",
    });
    navigate("/");
  };

  const handleCancelOTP = () => {
    setShowOTPInput(false);
    setSelectedPatient(null);
    setOtp("");
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-6 py-8">
          <div className="flex justify-center items-center h-64">
            <p>Loading doctor dashboard...</p>
          </div>
        </div>
      </Layout>
    );
  }

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
            <DoctorProfile userData={userData} />
          </TabsContent>
          
          <TabsContent value="access">
            {!showOTPInput ? (
              <PatientList 
                patientIdentifier={patientIdentifier}
                setPatientIdentifier={setPatientIdentifier}
                handleRequestAccess={handleRequestAccess}
              />
            ) : (
              <OTPVerification 
                selectedPatient={selectedPatient}
                otp={otp}
                setOtp={setOtp}
                handleVerifyOTP={handleVerifyOTP}
                handleCancel={handleCancelOTP}
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default DoctorDashboard;
