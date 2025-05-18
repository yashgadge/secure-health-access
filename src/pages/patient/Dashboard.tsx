
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Check, Upload, FileText, Clock } from 'lucide-react';
import { 
  mockMedicalHistoryDB, 
  mockDoctorDB, 
  mockPatientFilesDB,
  mockPatientDB, 
  getAccessRequests, 
  updateAccessRequest,
  persistMockDatabases
} from '@/utils/mockDatabase';

// Create a simple file uploader component
const FileUploader = ({ patientId, onUploadComplete }: { patientId: string, onUploadComplete: () => void }) => {
  const { toast } = useToast();
  const [fileTitle, setFileTitle] = useState("");
  const [fileDescription, setFileDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (!file) {
      toast({
        title: "File Required",
        description: "Please select a file to upload",
        variant: "destructive"
      });
      return;
    }

    if (!fileTitle) {
      toast({
        title: "Title Required",
        description: "Please enter a title for this record",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);

    // Create a mock URL for the file
    const fileURL = "#";
    const fileType = file.type.split('/')[1] || 'document';
    
    // Find patient files or create new entry
    const patientFilesIndex = mockPatientFilesDB.findIndex(p => p.patientId === patientId);
    
    if (patientFilesIndex === -1) {
      // Create new patient files entry
      mockPatientFilesDB.push({
        patientId,
        files: [
          {
            name: file.name,
            type: fileType,
            date: new Date().toISOString().slice(0, 10),
            url: fileURL
          }
        ]
      });
    } else {
      // Add to existing files
      mockPatientFilesDB[patientFilesIndex].files.push({
        name: file.name,
        type: fileType,
        date: new Date().toISOString().slice(0, 10),
        url: fileURL
      });
    }
    
    // Add to medical history
    const patientHistoryIndex = mockMedicalHistoryDB.findIndex(h => h.patientId === patientId);
    
    if (patientHistoryIndex === -1) {
      // Create new entry
      mockMedicalHistoryDB.push({
        patientId,
        entries: [
          {
            id: `MH${Date.now()}`,
            date: new Date().toISOString().slice(0, 10),
            doctorId: "",
            doctorName: "Self Upload",
            notes: fileDescription || `Uploaded ${file.name}`,
            documents: [
              {
                name: file.name,
                url: fileURL
              }
            ]
          }
        ]
      });
    } else {
      // Add to existing history
      mockMedicalHistoryDB[patientHistoryIndex].entries.push({
        id: `MH${Date.now()}`,
        date: new Date().toISOString().slice(0, 10),
        doctorId: "",
        doctorName: "Self Upload",
        notes: fileDescription || `Uploaded ${file.name}`,
        documents: [
          {
            name: file.name,
            url: fileURL
          }
        ]
      });
    }
    
    // Persist data
    persistMockDatabases();
    
    // Reset form
    setFile(null);
    setFileTitle("");
    setFileDescription("");
    setUploading(false);
    
    toast({
      title: "File Uploaded",
      description: "Your medical record has been uploaded successfully",
    });
    
    onUploadComplete();
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-2">
        <Label htmlFor="fileTitle">Record Title</Label>
        <Input
          id="fileTitle"
          value={fileTitle}
          onChange={(e) => setFileTitle(e.target.value)}
          placeholder="e.g., Blood Test Results"
        />
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="fileDescription">Description (Optional)</Label>
        <Textarea
          id="fileDescription"
          value={fileDescription}
          onChange={(e) => setFileDescription(e.target.value)}
          placeholder="Add notes about this medical record"
          rows={3}
        />
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="file">Upload File</Label>
        <Input
          id="file"
          type="file"
          onChange={handleFileChange}
        />
        {file && (
          <p className="text-sm text-gray-500">Selected: {file.name}</p>
        )}
      </div>
      
      <Button
        onClick={handleUpload}
        disabled={uploading || !file}
        className="w-full"
      >
        <Upload className="h-4 w-4 mr-2" />
        {uploading ? "Uploading..." : "Upload Record"}
      </Button>
    </div>
  );
};

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
        
        <div className="mb-6">
          <TabsList className="bg-gray-100 p-1">
            <TabsTrigger 
              value="profile" 
              className={`px-6 py-2 ${activeTab === 'profile' ? 'bg-white shadow-sm' : ''}`}
              onClick={() => setActiveTab("profile")}
            >
              Profile
            </TabsTrigger>
            <TabsTrigger 
              value="doctors" 
              className={`px-6 py-2 ${activeTab === 'doctors' ? 'bg-white shadow-sm' : ''}`}
              onClick={() => setActiveTab("doctors")}
            >
              Doctor Access
            </TabsTrigger>
            <TabsTrigger 
              value="medical" 
              className={`px-6 py-2 ${activeTab === 'medical' ? 'bg-white shadow-sm' : ''}`}
              onClick={() => setActiveTab("medical")}
            >
              Medical History
            </TabsTrigger>
            <TabsTrigger 
              value="requests" 
              className={`px-6 py-2 ${activeTab === 'requests' ? 'bg-white shadow-sm' : ''}`}
              onClick={() => setActiveTab("requests")}
            >
              Access Requests
            </TabsTrigger>
          </TabsList>
        </div>
        
        {activeTab === "profile" && (
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Patient Profile</CardTitle>
              <CardDescription>Your personal information from Aadhaar</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm text-gray-500">Patient ID</h3>
                  <p className="font-medium text-lg">{userData.patientId}</p>
                </div>
                <div>
                  <h3 className="text-sm text-gray-500">Aadhaar ID</h3>
                  <p className="font-medium text-lg">{userData.aadhaarId}</p>
                </div>
                <div>
                  <h3 className="text-sm text-gray-500">Name</h3>
                  <p className="font-medium text-lg">{userData.name}</p>
                </div>
                <div>
                  <h3 className="text-sm text-gray-500">Email</h3>
                  <p className="font-medium text-lg">{userData.email}</p>
                </div>
                <div>
                  <h3 className="text-sm text-gray-500">Phone</h3>
                  <p className="font-medium text-lg">{userData.phone}</p>
                </div>
                <div>
                  <h3 className="text-sm text-gray-500">Address</h3>
                  <p className="font-medium text-lg">{userData.address}</p>
                </div>
              </div>
              <p className="text-sm text-gray-500 pt-4">
                Note: Personal details cannot be edited as they are linked to your Aadhaar.
              </p>
            </CardContent>
          </Card>
        )}
        
        {activeTab === "doctors" && (
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Authorized Doctors</CardTitle>
              <CardDescription>Manage which doctors have access to your medical records</CardDescription>
            </CardHeader>
            <CardContent>
              {authorizedDoctors.length > 0 ? (
                <div className="space-y-4">
                  {authorizedDoctors.map((doctor) => (
                    <div key={doctor.doctorId} className="p-4 border rounded-md flex justify-between items-center bg-white shadow-sm">
                      <div>
                        <p className="font-medium text-lg">{doctor.name}</p>
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
        )}
        
        {activeTab === "medical" && (
          <Card className="shadow-md">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Medical History Timeline</CardTitle>
                <CardDescription>View your complete medical history in chronological order</CardDescription>
              </div>
              <Button onClick={() => setShowUploadDialog(true)} className="bg-blue-500 hover:bg-blue-600">
                <Upload className="h-4 w-4 mr-2" /> Upload
              </Button>
            </CardHeader>
            <CardContent>
              {medicalHistory.length > 0 ? (
                <div className="relative space-y-8 before:absolute before:top-0 before:bottom-0 before:left-6 before:w-[2px] before:bg-blue-200">
                  {medicalHistory.map((entry) => (
                    <div key={entry.id} className="relative pl-14">
                      <div className="absolute left-5 w-4 h-4 bg-blue-500 rounded-full transform -translate-x-1/2 mt-1 z-10"></div>
                      <div className="mb-1 flex items-center">
                        <p className="font-medium">{new Date(entry.date).toLocaleDateString('en-GB')}</p>
                        {entry.doctorName && (
                          <>
                            <span className="mx-2 text-gray-400">•</span>
                            <p className="text-gray-500">{entry.doctorName}</p>
                          </>
                        )}
                      </div>
                      <div className="p-4 bg-gray-50 rounded-md shadow-sm">
                        <p className="mb-3">{entry.notes}</p>
                        {entry.documents && entry.documents.length > 0 && (
                          <div className="mt-2">
                            <p className="text-sm font-medium mb-2">Documents:</p>
                            <div className="flex flex-wrap gap-2">
                              {entry.documents.map((doc: any, idx: number) => (
                                <Button key={idx} variant="outline" size="sm" asChild>
                                  <a href={doc.url} target="_blank" rel="noopener noreferrer">
                                    <FileText className="h-4 w-4 mr-1" /> {doc.name}
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
        )}
        
        {activeTab === "requests" && (
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Doctor Access Requests</CardTitle>
              <CardDescription>Approve or deny doctor access to your medical records</CardDescription>
            </CardHeader>
            <CardContent>
              {accessRequests.length > 0 ? (
                <div className="space-y-4">
                  {accessRequests.map((request: any) => {
                    const doctor = mockDoctorDB.find(d => d.doctorId === request.doctorId);
                    return (
                      <div key={request.id} className="p-4 border rounded-md bg-white shadow-sm">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">{doctor?.name || "Unknown Doctor"}</h3>
                            <p className="text-sm text-gray-500">{doctor?.specialization}, {doctor?.hospitalAffiliation}</p>
                            <p className="text-xs text-gray-400 mt-1">
                              <Clock className="h-3 w-3 inline mr-1" />
                              Requested: {new Date(request.requestDate).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="space-x-2">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="bg-green-50 text-green-600 hover:bg-green-100 border-green-200"
                              onClick={() => handleApproveRequest(request)}
                            >
                              <Check className="h-4 w-4 mr-1" /> Approve
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="bg-red-50 text-red-600 hover:bg-red-100 border-red-200"
                              onClick={() => handleRejectRequest(request)}
                            >
                              <X className="h-4 w-4 mr-1" /> Reject
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No pending access requests.
                </div>
              )}
            </CardContent>
          </Card>
        )}
        
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
