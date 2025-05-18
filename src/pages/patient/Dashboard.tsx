
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

import ProfileTab from '@/components/patient/ProfileTab';
import DoctorsTab from '@/components/patient/DoctorsTab';
import MedicalHistoryTab from '@/components/patient/MedicalHistoryTab';
import RequestsTab from '@/components/patient/RequestsTab';
import FileUploader from '@/components/patient/FileUploader';

import { 
  mockMedicalHistoryDB, 
  mockDoctorDB, 
  mockPatientDB,
  getAccessRequests, 
  updateAccessRequest,
  persistMockDatabases
} from '@/utils/mockDatabase';

const PatientDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userData, setUserData] = useState<any>(null);
  const [medicalHistory, setMedicalHistory] = useState<any[]>([]);
  const [authorizedDoctors, setAuthorizedDoctors] = useState<any[]>([]);
  const [accessRequests, setAccessRequests] = useState<any[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [showAlertDialog, setShowAlertDialog] = useState(false);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  
  useEffect(() => {
    // Check if user is logged in
    const userType = localStorage.getItem("userType");
    const storedUserData = localStorage.getItem("userData");
    
    if (userType !== "patient" || !storedUserData) {
      toast({
        title: "Unauthorized Access",
        description: "Please login as a patient to view this page",
        variant: "destructive"
      });
      navigate("/patient/login");
      return;
    }
    
    try {
      // Parse user data
      const parsedUserData = JSON.parse(storedUserData);
      setUserData(parsedUserData);
      
      // Load data for the dashboard
      loadDashboardData(parsedUserData);
    } catch (err) {
      console.error("Failed to parse user data:", err);
      toast({
        title: "Session Error",
        description: "There was an issue with your session. Please login again.",
        variant: "destructive"
      });
      navigate("/patient/login");
    }
  }, [navigate, toast]);
  
  useEffect(() => {
    if (uploadComplete) {
      // Reload data after upload
      loadDashboardData(userData);
      setUploadComplete(false);
    }
  }, [uploadComplete, userData]);
  
  const loadDashboardData = (patientData: any) => {
    // Fetch medical history
    const patientHistory = mockMedicalHistoryDB.find(h => h.patientId === patientData.patientId);
    if (patientHistory) {
      setMedicalHistory(patientHistory.entries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    } else {
      setMedicalHistory([]);
    }
    
    // Fetch authorized doctors
    const authDoctors = patientData.authorizedDoctors || [];
    const doctorDetails = authDoctors.map((doctorId: string) => {
      return mockDoctorDB.find(d => d.doctorId === doctorId);
    }).filter(Boolean);
    
    setAuthorizedDoctors(doctorDetails);
    
    // Fetch access requests
    const requests = getAccessRequests(patientData.patientId);
    setAccessRequests(requests);
  };
  
  const handleRevokeAccess = (doctorId: string) => {
    // Find the doctor to show the name in the confirmation
    const doctor = mockDoctorDB.find(d => d.doctorId === doctorId);
    if (!doctor) return;
    
    // Show confirmation dialog
    setSelectedRequest({ doctorId, doctorName: doctor.name });
    setShowAlertDialog(true);
  };
  
  const confirmRevokeAccess = () => {
    if (!selectedRequest || !userData) return;
    
    // Filter out the doctor from authorized doctors
    const updatedAuthDoctors = (userData.authorizedDoctors || []).filter(
      (id: string) => id !== selectedRequest.doctorId
    );
    
    // Update user data
    const updatedUserData = {
      ...userData,
      authorizedDoctors: updatedAuthDoctors
    };
    
    setUserData(updatedUserData);
    localStorage.setItem("userData", JSON.stringify(updatedUserData));
    
    // Update mock database
    const patientIndex = mockPatientDB.findIndex(p => p.patientId === userData.patientId);
    if (patientIndex !== -1) {
      mockPatientDB[patientIndex].authorizedDoctors = updatedAuthDoctors;
      persistMockDatabases();
    }
    
    // Refresh doctor list
    setAuthorizedDoctors(prev => prev.filter(d => d.doctorId !== selectedRequest.doctorId));
    
    // Close dialog and show toast
    setShowAlertDialog(false);
    setSelectedRequest(null);
    
    toast({
      title: "Access Revoked",
      description: `Dr. ${selectedRequest.doctorName}'s access has been revoked successfully`,
    });
  };
  
  const handleApproveRequest = (request: any) => {
    // Find the doctor
    const doctor = mockDoctorDB.find(d => d.doctorId === request.doctorId);
    if (!doctor) return;
    
    // Update request status
    updateAccessRequest(request.id, "approved");
    
    // Refresh data
    loadDashboardData(userData);
    
    toast({
      title: "Access Approved",
      description: `Dr. ${doctor.name} can now access your medical records`,
    });
  };
  
  const handleRejectRequest = (request: any) => {
    // Find the doctor
    const doctor = mockDoctorDB.find(d => d.doctorId === request.doctorId);
    if (!doctor) return;
    
    // Update request status
    updateAccessRequest(request.id, "rejected");
    
    // Refresh data
    loadDashboardData(userData);
    
    toast({
      title: "Access Rejected",
      description: `Access request from Dr. ${doctor.name} has been rejected`,
    });
  };
  
  const handleLogout = () => {
    localStorage.removeItem("userType");
    localStorage.removeItem("userData");
    
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
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-gray-100 p-1">
            <TabsTrigger value="profile">
              Profile
            </TabsTrigger>
            <TabsTrigger value="doctors">
              Doctor Access
            </TabsTrigger>
            <TabsTrigger value="medical">
              Medical History
            </TabsTrigger>
            <TabsTrigger value="requests">
              Access Requests
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile">
            <ProfileTab userData={userData} />
          </TabsContent>
          
          <TabsContent value="doctors">
            <DoctorsTab 
              authorizedDoctors={authorizedDoctors} 
              onRevokeAccess={handleRevokeAccess}
            />
          </TabsContent>
          
          <TabsContent value="medical">
            <MedicalHistoryTab
              medicalHistory={medicalHistory}
              onUploadClick={() => setShowUploadDialog(true)}
            />
          </TabsContent>
          
          <TabsContent value="requests">
            <RequestsTab 
              accessRequests={accessRequests}
              onApprove={handleApproveRequest}
              onReject={handleRejectRequest}
              doctorDB={mockDoctorDB}
            />
          </TabsContent>
        </Tabs>
        
        {/* Revoke Access Confirmation Dialog */}
        <AlertDialog open={showAlertDialog} onOpenChange={setShowAlertDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Access Revocation</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to revoke Dr. {selectedRequest?.doctorName}'s access to your medical records? 
                They will no longer be able to view your history or add new records.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction 
                className="bg-red-600 text-white hover:bg-red-700"
                onClick={confirmRevokeAccess}
              >
                Revoke Access
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        
        {/* Upload Medical Record Dialog */}
        <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload Medical Record</DialogTitle>
              <DialogDescription>
                Add a new file to your medical history
              </DialogDescription>
            </DialogHeader>
            <FileUploader 
              patientId={userData.patientId} 
              onUploadComplete={() => {
                setShowUploadDialog(false);
                setUploadComplete(true);
              }}
            />
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowUploadDialog(false)}>
                Cancel
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default PatientDashboard;
