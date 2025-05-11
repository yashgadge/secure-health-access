
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

// Mock patient list - patients who gave access to this doctor
const mockPatientList = [
  {
    id: "P001",
    aadhaarId: "123456789012",
    name: "Rahul Sharma",
    age: 33,
    gender: "Male",
    phone: "9876543210",
    lastVisit: "2023-04-15",
    documentCount: 3
  },
  {
    id: "P002",
    aadhaarId: "234567890123",
    name: "Priya Patel",
    age: 38,
    gender: "Female",
    phone: "8765432109",
    lastVisit: "2023-05-22",
    documentCount: 2
  },
  {
    id: "P003",
    aadhaarId: "345678901234",
    name: "Amit Kumar",
    age: 45,
    gender: "Male",
    phone: "7654321098",
    lastVisit: "2023-06-10",
    documentCount: 1
  }
];

// Mock documents for patients
const mockPatientDocuments = {
  "P001": [
    {
      id: "DOC001",
      title: "Blood Test Report",
      date: "2023-01-15",
      type: "Lab Report",
      notes: "Cholesterol levels are slightly elevated.",
      fileUrl: "#"
    },
    {
      id: "DOC004",
      title: "ECG Report",
      date: "2023-04-10",
      type: "Cardiology",
      notes: "Normal sinus rhythm.",
      fileUrl: "#"
    },
    {
      id: "DOC005",
      title: "Prescription",
      date: "2023-04-15",
      type: "Medication",
      notes: "Statins prescribed for cholesterol management.",
      fileUrl: "#"
    }
  ],
  "P002": [
    {
      id: "DOC002",
      title: "MRI Scan",
      date: "2023-05-20",
      type: "Radiology",
      notes: "No abnormalities detected.",
      fileUrl: "#"
    },
    {
      id: "DOC006",
      title: "Follow-up Visit Notes",
      date: "2023-05-22",
      type: "Consultation",
      notes: "Patient reports improvement in symptoms.",
      fileUrl: "#"
    }
  ],
  "P003": [
    {
      id: "DOC003",
      title: "Annual Health Checkup",
      date: "2023-06-10",
      type: "General",
      notes: "Overall health is good. Recommended lifestyle changes.",
      fileUrl: "#"
    }
  ]
};

interface DoctorData {
  id: string;
  email: string;
  name: string;
  specialization: string;
  hospitalAffiliation: string;
}

interface Patient {
  id: string;
  aadhaarId: string;
  name: string;
  age: number;
  gender: string;
  phone: string;
  lastVisit: string;
  documentCount: number;
}

interface Document {
  id: string;
  title: string;
  date: string;
  type: string;
  notes: string;
  fileUrl: string;
}

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userData, setUserData] = useState<DoctorData | null>(null);
  const [patients, setPatients] = useState<Patient[]>(mockPatientList);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [patientDocuments, setPatientDocuments] = useState<Document[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [editedNotes, setEditedNotes] = useState("");
  
  useEffect(() => {
    // Check if user is logged in as doctor
    const userType = sessionStorage.getItem("userType");
    const storedUserData = sessionStorage.getItem("userData");
    
    if (userType !== "doctor" || !storedUserData) {
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
  
  useEffect(() => {
    // Load patient documents when a patient is selected
    if (selectedPatient) {
      setPatientDocuments(mockPatientDocuments[selectedPatient.id as keyof typeof mockPatientDocuments] || []);
    } else {
      setPatientDocuments([]);
    }
  }, [selectedPatient]);
  
  const handleLogout = () => {
    sessionStorage.removeItem("userType");
    sessionStorage.removeItem("userData");
    navigate("/login");
  };
  
  const handlePatientSelect = (patient: Patient) => {
    setSelectedPatient(patient);
  };
  
  const handleEditDocument = (document: Document) => {
    setSelectedDocument(document);
    setEditedNotes(document.notes);
    setEditDialogOpen(true);
  };
  
  const handleSaveNotes = () => {
    if (!selectedDocument) return;
    
    // Update the document notes
    const updatedDocuments = patientDocuments.map(doc => 
      doc.id === selectedDocument.id
        ? { ...doc, notes: editedNotes }
        : doc
    );
    
    setPatientDocuments(updatedDocuments);
    setEditDialogOpen(false);
    
    toast({
      title: "Notes Updated",
      description: "Document notes have been successfully updated",
    });
  };
  
  const filteredPatients = patients.filter(patient => 
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.aadhaarId.includes(searchTerm)
  );

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
              <div className="text-sm text-gray-500">{userData.specialization}</div>
            </div>
            <Button variant="outline" onClick={handleLogout}>Logout</Button>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Doctor Dashboard</h1>
          <p className="text-gray-500">Manage patient records and medical documents</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Patient List */}
          <div className="md:col-span-1 space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>My Patients</CardTitle>
                <CardDescription>
                  Patients who have granted you access
                </CardDescription>
                <div className="mt-2">
                  <Input
                    placeholder="Search patients..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </CardHeader>
              <CardContent className="max-h-[500px] overflow-auto">
                {filteredPatients.length === 0 ? (
                  <div className="text-center p-4">
                    <p className="text-gray-500">No patients found</p>
                  </div>
                ) : (
                  <div className="grid gap-2">
                    {filteredPatients.map(patient => (
                      <div
                        key={patient.id}
                        className={`p-3 rounded-md cursor-pointer transition-colors ${
                          selectedPatient?.id === patient.id
                            ? 'bg-medical-secondary border border-medical-primary'
                            : 'hover:bg-gray-100 border border-transparent'
                        }`}
                        onClick={() => handlePatientSelect(patient)}
                      >
                        <div className="font-medium">{patient.name}</div>
                        <div className="text-sm text-gray-500 mt-1">
                          {patient.age} yrs • {patient.gender}
                        </div>
                        <div className="text-xs text-gray-500 mt-1 flex justify-between">
                          <span>Last visit: {patient.lastVisit}</span>
                          <span>{patient.documentCount} docs</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          {/* Patient Details and Documents */}
          <div className="md:col-span-2">
            {selectedPatient ? (
              <Tabs defaultValue="documents" className="space-y-4">
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-xl font-semibold">{selectedPatient.name}</h2>
                  <TabsList>
                    <TabsTrigger value="documents">Documents</TabsTrigger>
                    <TabsTrigger value="profile">Profile</TabsTrigger>
                  </TabsList>
                </div>
                
                <TabsContent value="documents" className="space-y-4">
                  {patientDocuments.length === 0 ? (
                    <div className="text-center p-8 border rounded-lg bg-gray-50">
                      <p className="text-gray-500">No documents available</p>
                    </div>
                  ) : (
                    patientDocuments.map(doc => (
                      <Card key={doc.id} className="overflow-hidden">
                        <CardContent className="p-0">
                          <div className="border-b p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-semibold">{doc.title}</h3>
                                <div className="flex gap-4 mt-1">
                                  <p className="text-sm text-gray-500">Date: {doc.date}</p>
                                  <p className="text-sm text-gray-500">Type: {doc.type}</p>
                                </div>
                              </div>
                              <div>
                                <Button variant="outline" size="sm" asChild>
                                  <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer">
                                    View File
                                  </a>
                                </Button>
                              </div>
                            </div>
                          </div>
                          <div className="p-4 bg-gray-50">
                            <div className="flex justify-between items-start">
                              <div className="space-y-1 flex-1">
                                <Label className="text-sm font-semibold">Doctor's Notes</Label>
                                <p className="text-sm whitespace-pre-line">{doc.notes}</p>
                              </div>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleEditDocument(doc)}
                              >
                                Edit
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </TabsContent>
                
                <TabsContent value="profile">
                  <Card>
                    <CardHeader>
                      <CardTitle>Patient Information</CardTitle>
                      <CardDescription>
                        Personal details from Aadhaar registration
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-x-8 gap-y-4">
                        <div>
                          <Label className="text-sm font-medium">Full Name</Label>
                          <Input value={selectedPatient.name} disabled />
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Gender</Label>
                          <Input value={selectedPatient.gender} disabled />
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Age</Label>
                          <Input value={`${selectedPatient.age} years`} disabled />
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Phone Number</Label>
                          <Input value={selectedPatient.phone} disabled />
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Aadhaar ID</Label>
                          <Input 
                            value={selectedPatient.aadhaarId.replace(/(\d{4})(\d{4})(\d{4})/, '$1-$2-$3')} 
                            disabled 
                          />
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Last Visit</Label>
                          <Input value={selectedPatient.lastVisit} disabled />
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <p className="text-sm text-gray-500">
                        Personal information is read-only as per data protection policies
                      </p>
                    </CardFooter>
                  </Card>
                </TabsContent>
              </Tabs>
            ) : (
              <div className="h-full flex items-center justify-center border rounded-lg bg-gray-50 p-12">
                <div className="text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-gray-400 mb-4">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900">Select a patient</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Click on a patient from the list to view their records
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Doctor's Notes</DialogTitle>
            <DialogDescription>
              Update your notes for {selectedDocument?.title}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              value={editedNotes}
              onChange={(e) => setEditedNotes(e.target.value)}
              rows={6}
              placeholder="Enter your clinical notes here..."
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveNotes}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <footer className="bg-gray-50 border-t">
        <div className="container mx-auto py-4 px-6 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} MediRecord. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default DoctorDashboard;
