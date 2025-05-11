
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

// Mock doctor list
const mockDoctorList = [
  {
    id: "D001",
    name: "Dr. Anjali Desai",
    specialization: "Cardiologist",
    hospitalAffiliation: "City Medical Center",
    hasAccess: true
  },
  {
    id: "D002",
    name: "Dr. Rajesh Kumar",
    specialization: "Neurologist",
    hospitalAffiliation: "National Hospital",
    hasAccess: false
  },
  {
    id: "D003",
    name: "Dr. Meera Patel",
    specialization: "Pediatrician",
    hospitalAffiliation: "Children's Hospital",
    hasAccess: true
  }
];

// Mock medical documents
const initialDocuments = [
  {
    id: "DOC001",
    title: "Blood Test Report",
    date: "2023-01-15",
    doctorName: "Dr. Anjali Desai",
    type: "Lab Report",
    accessibleTo: ["D001", "D003"],
    fileUrl: "#"
  },
  {
    id: "DOC002",
    title: "Chest X-Ray",
    date: "2023-02-20",
    doctorName: "Dr. Rajesh Kumar",
    type: "Radiology",
    accessibleTo: ["D001"],
    fileUrl: "#"
  },
  {
    id: "DOC003",
    title: "Annual Checkup Results",
    date: "2023-03-10",
    doctorName: "Dr. Meera Patel",
    type: "General",
    accessibleTo: ["D003"],
    fileUrl: "#"
  }
];

interface PatientData {
  aadhaarId: string;
  name: string;
  dob: string;
  gender: string;
  address: string;
  phone: string;
  email: string;
}

interface Document {
  id: string;
  title: string;
  date: string;
  doctorName: string;
  type: string;
  accessibleTo: string[];
  fileUrl: string;
}

interface Doctor {
  id: string;
  name: string;
  specialization: string;
  hospitalAffiliation: string;
  hasAccess: boolean;
}

const PatientDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userData, setUserData] = useState<PatientData | null>(null);
  const [documents, setDocuments] = useState<Document[]>(initialDocuments);
  const [doctors, setDoctors] = useState<Doctor[]>(mockDoctorList);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [newDocument, setNewDocument] = useState({
    title: "",
    type: "",
    doctorName: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  useEffect(() => {
    // Check if user is logged in as patient
    const userType = sessionStorage.getItem("userType");
    const storedUserData = sessionStorage.getItem("userData");
    
    if (userType !== "patient" || !storedUserData) {
      navigate("/login");
      return;
    }
    
    try {
      const parsedUserData = JSON.parse(storedUserData);
      setUserData(parsedUserData);
    } catch (error) {
      console.error("Failed to parse user data:", error);
      navigate("/login");
    }
  }, [navigate]);
  
  const handleLogout = () => {
    sessionStorage.removeItem("userType");
    sessionStorage.removeItem("userData");
    navigate("/login");
  };
  
  const toggleDoctorAccess = (doctorId: string) => {
    setDoctors(prevDoctors => 
      prevDoctors.map(doctor => 
        doctor.id === doctorId
          ? { ...doctor, hasAccess: !doctor.hasAccess }
          : doctor
      )
    );
    
    const doctor = doctors.find(d => d.id === doctorId);
    if (doctor) {
      toast({
        title: `Access ${doctor.hasAccess ? "Revoked" : "Granted"}`,
        description: `You have ${doctor.hasAccess ? "revoked" : "granted"} access to ${doctor.name}`,
      });
    }

    // Update document access as well
    if (doctor && !doctor.hasAccess) {
      // If granting access, add doctor to all documents' accessibility
      setDocuments(prevDocs => 
        prevDocs.map(doc => ({
          ...doc,
          accessibleTo: [...doc.accessibleTo, doctorId]
        }))
      );
    } else {
      // If revoking access, remove doctor from all documents' accessibility
      setDocuments(prevDocs => 
        prevDocs.map(doc => ({
          ...doc,
          accessibleTo: doc.accessibleTo.filter(id => id !== doctorId)
        }))
      );
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };
  
  const handleUploadDocument = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile) {
      toast({
        title: "No file selected",
        description: "Please select a file to upload",
        variant: "destructive"
      });
      return;
    }
    
    // Create new document
    const newDoc: Document = {
      id: `DOC${Math.floor(Math.random() * 10000).toString().padStart(3, '0')}`,
      title: newDocument.title || selectedFile.name,
      date: new Date().toISOString().split('T')[0],
      doctorName: newDocument.doctorName || "Self Upload",
      type: newDocument.type || "General",
      accessibleTo: doctors.filter(d => d.hasAccess).map(d => d.id),
      fileUrl: "#"
    };
    
    setDocuments(prevDocs => [newDoc, ...prevDocs]);
    setUploadDialogOpen(false);
    setNewDocument({ title: "", type: "", doctorName: "" });
    setSelectedFile(null);
    
    toast({
      title: "Document Uploaded",
      description: "Your document has been successfully uploaded",
    });
  };

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto py-4 px-6 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-medical-primary">
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
            </svg>
            <span className="text-xl font-bold text-medical-primary">MediRecord</span>
          </Link>
          
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <div className="font-medium">{userData.name}</div>
              <div className="text-sm text-gray-500">Patient</div>
            </div>
            <Button variant="outline" onClick={handleLogout}>Logout</Button>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Welcome, {userData.name}</h1>
          <p className="text-gray-500">Manage your medical records and doctor access</p>
        </div>
        
        <Tabs defaultValue="documents" className="space-y-4">
          <TabsList>
            <TabsTrigger value="documents">My Documents</TabsTrigger>
            <TabsTrigger value="doctors">Doctor Access</TabsTrigger>
            <TabsTrigger value="profile">My Profile</TabsTrigger>
          </TabsList>
          
          <TabsContent value="documents">
            <div className="grid gap-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Medical Documents</h2>
                <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>Upload Document</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Upload Medical Document</DialogTitle>
                      <DialogDescription>
                        Upload your medical records, reports, or prescriptions
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleUploadDocument}>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label htmlFor="title">Document Title</Label>
                          <Input 
                            id="title" 
                            value={newDocument.title}
                            onChange={e => setNewDocument({...newDocument, title: e.target.value})}
                            placeholder="e.g., Blood Test Results"
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="type">Document Type</Label>
                          <Input 
                            id="type" 
                            value={newDocument.type}
                            onChange={e => setNewDocument({...newDocument, type: e.target.value})}
                            placeholder="e.g., Lab Report, Prescription"
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="doctor">Associated Doctor (Optional)</Label>
                          <Input 
                            id="doctor" 
                            value={newDocument.doctorName}
                            onChange={e => setNewDocument({...newDocument, doctorName: e.target.value})}
                            placeholder="e.g., Dr. Anjali Desai"
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="file">Upload File</Label>
                          <Input 
                            id="file" 
                            type="file" 
                            onChange={handleFileChange}
                            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                          />
                          <p className="text-sm text-gray-500">
                            Accepted formats: PDF, JPEG, PNG, DOC
                          </p>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="submit">Upload</Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
              
              {documents.length === 0 ? (
                <div className="text-center p-8 border rounded-lg bg-gray-50">
                  <p className="text-gray-500">No documents uploaded yet</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {documents.map(doc => (
                    <Card key={doc.id} className="overflow-hidden">
                      <CardContent className="p-0">
                        <div className="grid md:grid-cols-5 border-b">
                          <div className="p-4 md:col-span-2">
                            <h3 className="font-semibold">{doc.title}</h3>
                            <p className="text-sm text-gray-500">Uploaded on {doc.date}</p>
                          </div>
                          <div className="p-4 border-l hidden md:block">
                            <p className="text-sm font-medium">Type</p>
                            <p className="text-sm text-gray-500">{doc.type}</p>
                          </div>
                          <div className="p-4 border-l hidden md:block">
                            <p className="text-sm font-medium">Doctor</p>
                            <p className="text-sm text-gray-500">{doc.doctorName}</p>
                          </div>
                          <div className="p-4 border-l flex items-center justify-end">
                            <Button variant="outline" size="sm" asChild>
                              <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer">
                                View
                              </a>
                            </Button>
                          </div>
                        </div>
                        <div className="p-4 bg-gray-50">
                          <div className="text-sm">
                            <span className="font-medium">Accessible to: </span>
                            {doc.accessibleTo.length > 0 ? (
                              <span className="text-gray-500">
                                {doctors
                                  .filter(d => doc.accessibleTo.includes(d.id))
                                  .map(d => d.name)
                                  .join(", ")}
                              </span>
                            ) : (
                              <span className="text-gray-500">No doctors</span>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="doctors">
            <div className="grid gap-6">
              <h2 className="text-xl font-semibold">Doctor Access Management</h2>
              {doctors.length === 0 ? (
                <div className="text-center p-8 border rounded-lg bg-gray-50">
                  <p className="text-gray-500">No doctors assigned</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {doctors.map(doctor => (
                    <Card key={doctor.id}>
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                          <div>
                            <h3 className="font-semibold text-lg">{doctor.name}</h3>
                            <p className="text-sm text-gray-500">
                              {doctor.specialization} • {doctor.hospitalAffiliation}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`text-sm ${doctor.hasAccess ? 'text-green-600' : 'text-gray-500'}`}>
                              {doctor.hasAccess ? 'Has Access' : 'No Access'}
                            </span>
                            <Button
                              variant={doctor.hasAccess ? "destructive" : "default"}
                              size="sm"
                              onClick={() => toggleDoctorAccess(doctor.id)}
                            >
                              {doctor.hasAccess ? 'Revoke Access' : 'Grant Access'}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Your details from Aadhaar registration</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-x-8 gap-y-4">
                  <div>
                    <Label className="text-sm font-medium">Full Name</Label>
                    <Input value={userData.name} disabled />
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Gender</Label>
                    <Input value={userData.gender} disabled />
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Date of Birth</Label>
                    <Input value={userData.dob} disabled />
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Phone Number</Label>
                    <Input value={userData.phone} disabled />
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Email</Label>
                    <Input value={userData.email} disabled />
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Aadhaar ID</Label>
                    <Input value={userData.aadhaarId.replace(/(\d{4})(\d{4})(\d{4})/, '$1-$2-$3')} disabled />
                  </div>
                  <div className="md:col-span-2">
                    <Label className="text-sm font-medium">Address</Label>
                    <Input value={userData.address} disabled />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t pt-6">
                <p className="text-sm text-gray-500">
                  Data automatically populated from Aadhaar
                </p>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      
      <footer className="bg-gray-50 border-t">
        <div className="container mx-auto py-4 px-6 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} MediRecord. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default PatientDashboard;
