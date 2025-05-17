
import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { mockPatientDB } from "@/utils/mockDatabase";
import { useToast } from "@/components/ui/use-toast";

interface PatientListProps {
  patientIdentifier: string;
  setPatientIdentifier: React.Dispatch<React.SetStateAction<string>>;
  handleRequestAccess: (e: React.FormEvent) => Promise<void>;
}

const PatientList: React.FC<PatientListProps> = ({
  patientIdentifier,
  setPatientIdentifier,
  handleRequestAccess
}) => {
  const { toast } = useToast();
  const [searchType, setSearchType] = useState<'patientId' | 'aadhaarId'>('patientId');
  const [patientData, setPatientData] = useState<any[]>([]);
  const [example, setExample] = useState<string>('');

  // Load patient data on component mount and whenever localStorage updates
  useEffect(() => {
    // Get patient data from localStorage
    const storedPatientData = localStorage.getItem('patientDB');
    if (storedPatientData) {
      try {
        const parsedData = JSON.parse(storedPatientData);
        setPatientData(parsedData);
        console.log("Loaded patient data from localStorage:", parsedData);
      } catch (error) {
        console.error("Error parsing patient data:", error);
      }
    } else {
      setPatientData(mockPatientDB);
      console.log("Using mock patient data:", mockPatientDB);
    }
  }, []);

  useEffect(() => {
    // Set an example ID based on search type
    if (searchType === 'patientId') {
      const examples = ['PAT103245', 'PAT204356', 'PAT305467'];
      setExample(examples[Math.floor(Math.random() * examples.length)]);
    } else {
      const examples = ['123456789012', '234567890123', '567890123456'];
      setExample(examples[Math.floor(Math.random() * examples.length)]);
    }
  }, [searchType]);

  const validateAndSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Log the current patient data for debugging
    console.log("Current patient data for search:", patientData);
    console.log("Current mockPatientDB:", mockPatientDB);
    console.log("Searching for:", patientIdentifier, "using type:", searchType);
    
    if (!patientIdentifier.trim()) {
      toast({
        title: "Input Required",
        description: "Please enter a patient identifier to search",
        variant: "destructive"
      });
      return;
    }

    // Check if we can find the patient in the patientData
    let patientExists = false;
    
    if (searchType === 'patientId') {
      patientExists = patientData.some(patient => patient.patientId === patientIdentifier);
      console.log("Searching by patientId:", patientIdentifier, "Found:", patientExists);
    } else {
      patientExists = patientData.some(patient => patient.aadhaarId === patientIdentifier);
      console.log("Searching by aadhaarId:", patientIdentifier, "Found:", patientExists);
    }

    if (!patientExists) {
      toast({
        title: "Patient Not Found",
        description: `No patient found with the provided ${searchType === 'patientId' ? 'Patient ID' : 'Aadhaar ID'}`,
        variant: "destructive"
      });
      return;
    }

    // If patient exists, proceed with the access request
    handleRequestAccess(e);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Patient Access</CardTitle>
        <CardDescription>Access patient records with their permission</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={validateAndSearch}>
          <div className="grid gap-4">
            <div className="flex gap-2 mb-2">
              <Button 
                type="button" 
                variant={searchType === 'patientId' ? "default" : "outline"} 
                onClick={() => setSearchType('patientId')}
              >
                Patient ID
              </Button>
              <Button 
                type="button" 
                variant={searchType === 'aadhaarId' ? "default" : "outline"} 
                onClick={() => setSearchType('aadhaarId')}
              >
                Aadhaar ID
              </Button>
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="patientId" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                {searchType === 'patientId' ? 'Patient ID' : 'Aadhaar Number'}
              </label>
              <Input 
                id="patientId"
                type="text" 
                placeholder={searchType === 'patientId' ? `Enter Patient ID (e.g., ${example})` : `Enter Aadhaar number (e.g., ${example})`}
                value={patientIdentifier}
                onChange={(e) => setPatientIdentifier(e.target.value)}
                required
              />
              <p className="text-sm text-gray-500">
                {searchType === 'patientId' 
                  ? "Enter the patient's ID number (starts with PAT)" 
                  : "Enter the patient's 12-digit Aadhaar number"}
              </p>
            </div>
            <Button type="submit" className="w-full">
              Search Patient
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default PatientList;
