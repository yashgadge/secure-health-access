
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { mockMedicalHistoryDB } from '@/utils/mockDatabase';
import { ArrowLeft, Upload, FileText, Calendar } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Define interfaces for better type safety
interface MonthGroup {
  label: string;
  entries: any[];
}

interface MonthGroups {
  [key: string]: MonthGroup;
}

const PatientHistory = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [doctorData, setDoctorData] = useState<any>(null);
  const [patientData, setPatientData] = useState<any>(null);
  const [medicalHistory, setMedicalHistory] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [newDocument, setNewDocument] = useState<File | null>(null);
  const [notes, setNotes] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [timelineView, setTimelineView] = useState<'list' | 'month'>('list');
  const [filteredHistory, setFilteredHistory] = useState<any[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  
  useEffect(() => {
    // Check if user is logged in as doctor
    const userType = sessionStorage.getItem("userType");
    const storedUserData = sessionStorage.getItem("userData");
    const storedPatientData = sessionStorage.getItem("selectedPatient");
    
    if (userType !== "doctor" || !storedUserData || !storedPatientData) {
      toast({
        title: "Unauthorized Access",
        description: "Please login as a doctor and select a patient first",
        variant: "destructive"
      });
      navigate("/doctor/dashboard");
      return;
    }
    
    // Parse data
    const parsedDoctorData = JSON.parse(storedUserData);
    const parsedPatientData = JSON.parse(storedPatientData);
    setDoctorData(parsedDoctorData);
    setPatientData(parsedPatientData);
    
    // Check if doctor has access to patient
    const hasAccess = parsedPatientData.authorizedDoctors && 
                      parsedPatientData.authorizedDoctors.includes(parsedDoctorData.doctorId);
    
    if (!hasAccess) {
      toast({
        title: "Access Denied",
        description: "You do not have permission to view this patient's records",
        variant: "destructive"
      });
      navigate("/doctor/dashboard");
      return;
    }
    
    // Fetch medical history
    const patientHistory = mockMedicalHistoryDB.find(h => h.patientId === parsedPatientData.patientId);
    if (patientHistory) {
      const sortedHistory = patientHistory.entries.sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      setMedicalHistory(sortedHistory);
      setFilteredHistory(sortedHistory);
    }
  }, [navigate, toast]);
  
  useEffect(() => {
    if (selectedMonth && medicalHistory.length > 0) {
      const filtered = medicalHistory.filter(entry => {
        const entryMonth = new Date(entry.date).toISOString().substring(0, 7); // YYYY-MM
        return entryMonth === selectedMonth;
      });
      setFilteredHistory(filtered);
    } else {
      setFilteredHistory(medicalHistory);
    }
  }, [selectedMonth, medicalHistory]);
  
  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setNewDocument(files[0]);
    }
  };
  
  const handleAddRecord = () => {
    if (!notes.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter notes for the medical record",
        variant: "destructive"
      });
      return;
    }
    
    const today = new Date().toISOString().split('T')[0];
    const newEntry = {
      id: `MH${Math.floor(Math.random() * 10000).toString().padStart(3, '0')}`,
      date: today,
      doctorId: doctorData.doctorId,
      doctorName: doctorData.name,
      notes: notes,
      documents: newDocument ? [
        {
          name: newDocument.name,
          url: "#" // In a real app, this would be a URL to the uploaded file
        }
      ] : []
    };
    
    // Add the new entry to the medical history
    const updatedHistory = [newEntry, ...medicalHistory];
    setMedicalHistory(updatedHistory);
    setFilteredHistory(updatedHistory);
    
    // In a real app, this would update the database
    
    toast({
      title: "Record Added",
      description: "The medical record has been added successfully",
    });
    
    // Reset form fields
    setNotes("");
    setNewDocument(null);
    setOpenDialog(false);
  };
  
  const handleReturn = () => {
    navigate("/doctor/dashboard");
  };

  // Group medical records by month for monthly view
  const groupedByMonth = React.useMemo(() => {
    const groups: MonthGroups = {};
    
    medicalHistory.forEach(entry => {
      const date = new Date(entry.date);
      const monthYear = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      const monthKey = date.toISOString().substring(0, 7); // YYYY-MM format
      
      if (!groups[monthKey]) {
        groups[monthKey] = {
          label: monthYear,
          entries: []
        };
      }
      
      groups[monthKey].entries.push(entry);
    });
    
    // Convert object to array of entries and sort
    return Object.entries(groups).sort(([a], [b]) => b.localeCompare(a));
  }, [medicalHistory]);

  if (!doctorData || !patientData) {
    return null; // Will redirect in useEffect
  }

  return (
    <Layout>
      <div className="container mx-auto px-6 py-8">
        <Button
          variant="ghost"
          className="mb-6 flex items-center"
          onClick={handleReturn}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
        </Button>
        
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold">Patient Medical History</h1>
            <p className="text-gray-500">
              Viewing records for: <span className="font-medium">{patientData.name}</span> | Patient ID: <span className="font-medium">{patientData.patientId}</span>
            </p>
          </div>
          
          <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogTrigger asChild>
              <Button className="flex items-center">
                <Upload className="mr-2 h-4 w-4" /> Add New Record
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Add Medical Record</DialogTitle>
                <DialogDescription>
                  Create a new medical record for {patientData.name}
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="notes">Medical Notes</Label>
                  <Textarea
                    id="notes"
                    placeholder="Enter medical notes, diagnosis, treatment, etc."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="min-h-[120px]"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="document">Upload Document (Optional)</Label>
                  <Input
                    id="document"
                    type="file"
                    onChange={handleDocumentUpload}
                  />
                  {newDocument && (
                    <p className="text-sm text-gray-500">Selected: {newDocument.name}</p>
                  )}
                </div>
              </div>
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setOpenDialog(false)}>
                  Cancel
                </Button>
                <Button type="button" onClick={handleAddRecord}>Add Record</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Medical History Timeline</CardTitle>
                <CardDescription>Chronological record of patient's medical history</CardDescription>
              </div>
              <Tabs 
                defaultValue="list" 
                value={timelineView}
                onValueChange={(value) => setTimelineView(value as 'list' | 'month')}
                className="w-[250px]"
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="list">List View</TabsTrigger>
                  <TabsTrigger value="month">Month View</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            {timelineView === 'month' && (
              <div className="mt-4">
                <Label htmlFor="month-select">Filter by Month</Label>
                <select 
                  id="month-select"
                  className="ml-2 p-2 border rounded-md"
                  value={selectedMonth || ''}
                  onChange={(e) => setSelectedMonth(e.target.value || null)}
                >
                  <option value="">All Months</option>
                  {groupedByMonth.map(([key, value]) => (
                    <option key={key} value={key}>{value.label}</option>
                  ))}
                </select>
              </div>
            )}
          </CardHeader>
          <CardContent>
            {filteredHistory.length > 0 ? (
              <>
                {timelineView === 'list' ? (
                  <div className="relative space-y-8 before:absolute before:top-0 before:bottom-0 before:left-6 before:w-[2px] before:bg-gray-200">
                    {filteredHistory.map((entry) => (
                      <div 
                        key={entry.id} 
                        className={`relative pl-14 ${selectedDate === entry.id ? 'bg-gray-50 p-4 rounded-lg' : ''}`}
                        onClick={() => setSelectedDate(entry.id === selectedDate ? null : entry.id)}
                      >
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
                                    <a href={doc.url} className="flex items-center">
                                      <FileText className="mr-1 h-3 w-3" />
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
                  <div className="space-y-6">
                    <Accordion type="single" collapsible className="w-full">
                      {groupedByMonth.map(([monthKey, data]) => {
                        // Only show months that have entries in filtered view
                        if (selectedMonth && monthKey !== selectedMonth && selectedMonth !== '') {
                          return null;
                        }
                        
                        return (
                          <AccordionItem key={monthKey} value={monthKey}>
                            <AccordionTrigger className="hover:bg-gray-50 px-4 py-2 rounded-md">
                              <div className="flex items-center">
                                <Calendar className="mr-2 h-4 w-4" />
                                <span>{data.label}</span>
                                <span className="ml-2 text-sm text-gray-500">({data.entries.length} records)</span>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent>
                              <div className="space-y-4 pl-4 pt-2">
                                {data.entries.sort((a: any, b: any) => 
                                  new Date(b.date).getTime() - new Date(a.date).getTime()
                                ).map((entry: any) => (
                                  <div key={entry.id} className="border-l-2 border-gray-200 pl-4 py-2">
                                    <div className="flex items-center mb-1">
                                      <h3 className="text-sm font-semibold">
                                        {new Date(entry.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                                      </h3>
                                      <span className="mx-2 text-gray-400">•</span>
                                      <p className="text-xs text-gray-500">{entry.doctorName}</p>
                                    </div>
                                    <div className="bg-gray-50 p-3 rounded-md">
                                      <p className="text-sm">{entry.notes}</p>
                                      {entry.documents.length > 0 && (
                                        <div className="mt-2">
                                          <div className="flex flex-wrap gap-1">
                                            {entry.documents.map((doc: any, idx: number) => (
                                              <Button key={idx} variant="outline" size="sm" asChild>
                                                <a href={doc.url} className="flex items-center text-xs">
                                                  <FileText className="mr-1 h-3 w-3" />
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
                            </AccordionContent>
                          </AccordionItem>
                        );
                      })}
                    </Accordion>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No medical history records found.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default PatientHistory;
