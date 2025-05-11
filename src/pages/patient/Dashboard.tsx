
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { mockMedicalHistoryDB, mockDoctorDB } from '@/utils/mockDatabase';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { X } from 'lucide-react';

const PatientDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userData, setUserData] = useState<any>(null);
  const [medicalHistory, setMedicalHistory] = useState<any[]>([]);
  const [authorizedDoctors, setAuthorizedDoctors] = useState<any[]>([]);
  
  useEffect(() => {
    // Check if user is logged in
    const userType = sessionStorage.getItem("userType");
    const storedUserData = sessionStorage.getItem("userData");
    
    if (userType !== "patient" || !storedUserData) {
      toast({
        title: "Unauthorized Access",
        description: "Please login as a patient to view this page",
        variant: "destructive"
      });
      navigate("/patient/login");
      return;
    }
    
    // Parse user data
    const parsedUserData = JSON.parse(storedUserData);
    setUserData(parsedUserData);
    
    // Fetch medical history
    const patientHistory = mockMedicalHistoryDB.find(h => h.patientId === parsedUserData.patientId);
    if (patientHistory) {
      setMedicalHistory(patientHistory.entries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    }
    
    // Fetch authorized doctors
    const authDoctors = parsedUserData.authorizedDoctors || [];
    const doctorDetails = authDoctors.map((doctorId: string) => {
      return mockDoctorDB.find(d => d.doctorId === doctorId);
    }).filter(Boolean);
    
    setAuthorizedDoctors(doctorDetails);
  }, [navigate, toast]);
  
  const handleRevokeAccess = (doctorId: string) => {
    // Filter out the doctor from authorized doctors
    const updatedAuthDoctors = authorizedDoctors.filter(d => d.doctorId !== doctorId);
    setAuthorizedDoctors(updatedAuthDoctors);
    
    // Update user data
    const updatedUserData = {
      ...userData,
      authorizedDoctors: updatedAuthDoctors.map(d => d.doctorId)
    };
    setUserData(updatedUserData);
    sessionStorage.setItem("userData", JSON.stringify(updatedUserData));
    
    toast({
      title: "Access Revoked",
      description: `Doctor access has been revoked successfully`,
    });
  };
  
  const handleLogout = () => {
    sessionStorage.removeItem("userType");
    sessionStorage.removeItem("userData");
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
          <h1 className="text-3xl font-bold">Patient Dashboard</h1>
          <Button variant="outline" onClick={handleLogout}>Logout</Button>
        </div>
        
        <Tabs defaultValue="profile">
          <TabsList className="mb-8">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="doctors">Doctor Access</TabsTrigger>
            <TabsTrigger value="history">Medical History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Patient Profile</CardTitle>
                <CardDescription>Your personal information from Aadhaar</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">Patient ID</p>
                      <p className="font-medium">{userData.patientId}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">Aadhaar ID</p>
                      <p className="font-medium">{userData.aadhaarId}</p>
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
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="font-medium">{userData.phone}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">Address</p>
                      <p className="font-medium">{userData.address}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 pt-4">
                    Note: Personal details cannot be edited as they are linked to your Aadhaar.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="doctors">
            <Card>
              <CardHeader>
                <CardTitle>Authorized Doctors</CardTitle>
                <CardDescription>Manage which doctors have access to your medical records</CardDescription>
              </CardHeader>
              <CardContent>
                {authorizedDoctors.length > 0 ? (
                  <div className="space-y-4">
                    {authorizedDoctors.map((doctor) => (
                      <div key={doctor.doctorId} className="flex items-center justify-between p-4 border rounded-md">
                        <div>
                          <p className="font-medium">{doctor.name}</p>
                          <p className="text-sm text-gray-500">{doctor.specialization}, {doctor.hospitalAffiliation}</p>
                          <p className="text-xs text-gray-400">ID: {doctor.doctorId}</p>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-red-500 border-red-200 hover:bg-red-50"
                          onClick={() => handleRevokeAccess(doctor.doctorId)}
                        >
                          <X className="h-4 w-4 mr-1" /> Revoke Access
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No doctors currently have access to your records.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Medical History Timeline</CardTitle>
                <CardDescription>View your complete medical history in chronological order</CardDescription>
              </CardHeader>
              <CardContent>
                {medicalHistory.length > 0 ? (
                  <div className="relative space-y-8 before:absolute before:top-0 before:bottom-0 before:left-6 before:w-[2px] before:bg-gray-200">
                    {medicalHistory.map((entry) => (
                      <div key={entry.id} className="relative pl-14">
                        <div className="absolute left-5 w-4 h-4 bg-medical-primary rounded-full transform -translate-x-1/2 mt-1 z-10"></div>
                        <div className="mb-1 flex items-center">
                          <p className="font-medium">{new Date(entry.date).toLocaleDateString()}</p>
                          <span className="mx-2 text-gray-400">•</span>
                          <p className="text-gray-500">{entry.doctorName}</p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-md">
                          <p className="mb-3">{entry.notes}</p>
                          {entry.documents.length > 0 && (
                            <div className="mt-2">
                              <p className="text-sm font-medium mb-2">Documents:</p>
                              <div className="flex flex-wrap gap-2">
                                {entry.documents.map((doc: any, idx: number) => (
                                  <Button key={idx} variant="outline" size="sm" asChild>
                                    <a href={doc.url}>
                                      {doc.name}
                                    </a>
                                  </Button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No medical history records found.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default PatientDashboard;
