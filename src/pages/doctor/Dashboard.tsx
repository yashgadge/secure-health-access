
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { 
  mockDoctorDB, 
  mockPatientDB, 
  mockAadhaarDB, 
  createAccessRequest, 
  getPatientsByDoctor,
  getAccessRequests,
  persistMockDatabases,
  saveToLocalStorage
} from "@/utils/mockDatabase";

// Types
import { Patient } from '@/components/doctor/PatientTypes';

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userData, setUserData] = useState<any>(null);
  const [patientIdToAdd, setPatientIdToAdd] = useState("");
  const [patientIdForAccess, setPatientIdForAccess] = useState("");
  const [myPatients, setMyPatients] = useState<any[]>([]);
  const [accessRequests, setAccessRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingAdd, setLoadingAdd] = useState(false);
  const [loadingRequest, setLoadingRequest] = useState(false);
  const [activeTab, setActiveTab] = useState('myPatients');
  
  useEffect(() => {
    // Check if user is logged in
    const checkSession = async () => {
      setLoading(true);
      
      // Check localStorage for user data
      const userType = localStorage.getItem("userType");
      const storedUserData = localStorage.getItem("userData");
      
      if (userType !== "doctor" || !storedUserData) {
        toast({
          title: "Unauthorized Access",
          description: "Please login as a doctor to view this page",
          variant: "destructive"
        });
        navigate("/doctor/login");
        return;
      }
      
      try {
        // Parse user data
        const parsedUserData = JSON.parse(storedUserData);
        setUserData(parsedUserData);
        
        // Load doctor's patients
        loadDoctorPatients(parsedUserData.doctorId);
      } catch (err) {
        console.error("Failed to parse user data:", err);
        toast({
          title: "Session Error",
          description: "There was an issue with your session. Please login again.",
          variant: "destructive"
        });
        navigate("/doctor/login");
      } finally {
        setLoading(false);
      }
    };
    
    checkSession();
    
    // Set up interval to refresh data every 30 seconds
    const intervalId = setInterval(() => {
      if (userData?.doctorId) {
        loadDoctorPatients(userData.doctorId);
      }
    }, 30000);
    
    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, [navigate, toast]);
  
  // Refresh data when userData changes
  useEffect(() => {
    if (userData?.doctorId) {
      loadDoctorPatients(userData.doctorId);
    }
  }, [userData]);
  
  const loadDoctorPatients = (doctorId: string) => {
    // Get patients that have authorized this doctor
    const patients = getPatientsByDoctor(doctorId);
    setMyPatients(patients);
    
    // Get pending access requests sent by this doctor
    const pendingRequests = (window as any).mockAccessRequestsDB?.filter(
      (req: any) => req.doctorId === doctorId && req.status === "pending"
    ) || [];
    setAccessRequests(pendingRequests);
  };
  
  const handleAddPatient = () => {
    if (!patientIdToAdd) {
      toast({
        title: "Input Required",
        description: "Please enter a patient ID",
        variant: "destructive"
      });
      return;
    }
    
    setLoadingAdd(true);
    
    // Find patient in mock database
    const patient = mockPatientDB.find(p => p.patientId === patientIdToAdd);
    
    if (!patient) {
      toast({
        title: "Patient Not Found",
        description: "No patient found with the provided ID",
        variant: "destructive"
      });
      setLoadingAdd(false);
      return;
    }
    
    // Check if doctor already has access
    if (patient.authorizedDoctors && patient.authorizedDoctors.includes(userData.doctorId)) {
      toast({
        title: "Already Added",
        description: `Patient ${patientIdToAdd} is already in your patient list`,
        variant: "default"
      });
      setLoadingAdd(false);
      return;
    }
    
    // Check if access request already exists
    const existingRequest = (window as any).mockAccessRequestsDB?.find(
      (req: any) => req.doctorId === userData.doctorId && 
                  req.patientId === patient.patientId && 
                  req.status === "pending"
    );
    
    if (existingRequest) {
      toast({
        title: "Request Already Sent",
        description: `A request for patient ${patientIdToAdd} is already pending`,
        variant: "default"
      });
      setLoadingAdd(false);
      return;
    }
    
    // Create access request
    createAccessRequest(userData.doctorId, patient.patientId);
    
    // Update UI
    loadDoctorPatients(userData.doctorId);
    
    toast({
      title: "Patient Request Sent",
      description: `Access request sent to patient ${patientIdToAdd}`,
    });
    
    // Reset input field
    setPatientIdToAdd("");
    setLoadingAdd(false);
  };
  
  const handleRequestAccess = () => {
    if (!patientIdForAccess) {
      toast({
        title: "Input Required",
        description: "Please enter a patient ID or Aadhaar number",
        variant: "destructive"
      });
      return;
    }
    
    setLoadingRequest(true);
    
    // Try to find by patient ID first
    let patient = mockPatientDB.find(p => p.patientId === patientIdForAccess);
    
    // If not found by patient ID, try Aadhaar ID
    if (!patient) {
      // Find by Aadhaar ID
      patient = mockPatientDB.find(p => p.aadhaarId === patientIdForAccess);
    }
    
    if (!patient) {
      toast({
        title: "Patient Not Found",
        description: "No patient found with the provided ID",
        variant: "destructive"
      });
      setLoadingRequest(false);
      return;
    }
    
    // Check if doctor already has access
    if (patient.authorizedDoctors && patient.authorizedDoctors.includes(userData.doctorId)) {
      toast({
        title: "Access Already Granted",
        description: `You already have access to patient ${patient.patientId}'s records`,
        variant: "default"
      });
      setLoadingRequest(false);
      
      // Navigate to patient history
      saveToLocalStorage("selectedPatient", patient);
      navigate("/doctor/patient-history");
      return;
    }
    
    // Check if access request already exists
    const existingRequest = (window as any).mockAccessRequestsDB?.find(
      (req: any) => req.doctorId === userData.doctorId && 
                  req.patientId === patient.patientId && 
                  req.status === "pending"
    );
    
    if (existingRequest) {
      toast({
        title: "Request Already Sent",
        description: `A request for patient ${patient.patientId} is already pending`,
        variant: "default"
      });
      setLoadingRequest(false);
      return;
    }
    
    // Create access request
    createAccessRequest(userData.doctorId, patient.patientId);
    
    // Update UI
    loadDoctorPatients(userData.doctorId);
    
    toast({
      title: "Access Request Sent",
      description: `Request sent to patient ${patient.patientId}`,
    });
    
    // Reset input field
    setPatientIdForAccess("");
    setLoadingRequest(false);
  };
  
  const handleViewPatient = (patient: any) => {
    saveToLocalStorage("selectedPatient", patient);
    navigate("/doctor/patient-history");
  };
  
  const handleLogout = () => {
    localStorage.removeItem("userType");
    localStorage.removeItem("userData");
    localStorage.removeItem("selectedPatient");
    
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully",
    });
    
    navigate("/");
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

  // Doctor user code display
  const doctorCode = userData?.doctorId?.substring(3, 7) || '0000';
  const randomSuffix = userData?.doctorId?.substring(7, 11) || 'xxxx';

  return (
    <Layout>
      <div className="container mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Doctor Dashboard</h1>
            <p className="text-gray-500">Welcome, Dr. User {doctorCode} | {randomSuffix}</p>
          </div>
          <Button variant="outline" onClick={handleLogout}>Logout</Button>
        </div>
        
        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab}
          defaultValue="myPatients" 
          className="space-y-6"
        >
          <TabsList className="mb-4 w-full bg-gray-100">
            <TabsTrigger 
              value="myPatients" 
              className="flex-1"
            >
              My Patients
            </TabsTrigger>
            <TabsTrigger 
              value="patientHistory" 
              className="flex-1"
            >
              Patient History
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="myPatients">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Add New Patient</CardTitle>
                    <CardDescription>Add a patient to your care list</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex space-x-2">
                      <Input
                        placeholder="Enter Patient ID (e.g., PAT103245)"
                        value={patientIdToAdd}
                        onChange={(e) => setPatientIdToAdd(e.target.value)}
                      />
                      <Button 
                        onClick={handleAddPatient} 
                        disabled={loadingAdd}
                        className="shrink-0"
                      >
                        <span className="mr-2">+</span>
                        Add
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>My Patients</CardTitle>
                    <CardDescription>{myPatients.length} patients under your care</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {myPatients.length > 0 ? (
                      <div className="space-y-4">
                        {myPatients.map((patient) => (
                          <div 
                            key={patient.patientId} 
                            className="p-4 border rounded-md flex justify-between items-center hover:bg-gray-50 cursor-pointer"
                            onClick={() => handleViewPatient(patient)}
                          >
                            <div>
                              <h3 className="font-medium">{patient.name}</h3>
                              <p className="text-sm text-gray-500">ID: {patient.patientId}</p>
                            </div>
                            <Button variant="outline" size="sm">View</Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        No patients yet
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
              
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Request Access</CardTitle>
                    <CardDescription>Request access to patient records</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex space-x-2">
                      <Input
                        placeholder="Enter Patient ID (e.g., PAT103245)"
                        value={patientIdForAccess}
                        onChange={(e) => setPatientIdForAccess(e.target.value)}
                      />
                      <Button 
                        onClick={handleRequestAccess} 
                        disabled={loadingRequest}
                        className="shrink-0"
                      >
                        <span className="mr-2">🔍</span>
                        Request
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Pending Requests</CardTitle>
                    <CardDescription>Access requests awaiting patient approval</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {accessRequests.length > 0 ? (
                      <div className="space-y-4">
                        {accessRequests.map((request: any) => {
                          const patient = mockPatientDB.find(p => p.patientId === request.patientId);
                          return (
                            <div key={request.id} className="p-4 border rounded-md">
                              <div className="flex justify-between">
                                <div>
                                  <h3 className="font-medium">{patient?.name || "Unknown Patient"}</h3>
                                  <p className="text-sm text-gray-500">ID: {request.patientId}</p>
                                </div>
                                <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded">
                                  Pending
                                </span>
                              </div>
                              <p className="text-xs text-gray-400 mt-2">
                                Requested: {new Date(request.requestDate).toLocaleDateString()}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        No pending requests
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="patientHistory">
            <Card>
              <CardHeader>
                <CardTitle>Patient Search</CardTitle>
                <CardDescription>Search for a patient by ID or Aadhaar number</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-2">
                  <Input
                    placeholder="Enter Patient ID or Aadhaar Number"
                    value={patientIdForAccess}
                    onChange={(e) => setPatientIdForAccess(e.target.value)}
                  />
                  <Button 
                    onClick={handleRequestAccess} 
                    disabled={loadingRequest}
                    className="shrink-0"
                  >
                    Search
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default DoctorDashboard;
