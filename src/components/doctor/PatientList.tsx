
import React from 'react';
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Database } from "@/integrations/supabase/types";

type Doctor = Database["public"]["Tables"]["doctors"]["Row"] & {
  name: string;
  email: string;
};

type Patient = Database["public"]["Tables"]["patients"]["Row"] & {
  name: string;
  authorizedDoctors?: string[];
};

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
  return (
    <Card>
      <CardHeader>
        <CardTitle>Patient Access</CardTitle>
        <CardDescription>Access patient records with their permission</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleRequestAccess}>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <label htmlFor="patientId" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Patient Aadhaar Number
              </label>
              <Input 
                id="patientId"
                type="text" 
                placeholder="Enter Aadhaar number (e.g., 123456789012)" 
                value={patientIdentifier}
                onChange={(e) => setPatientIdentifier(e.target.value)}
                required
              />
              <p className="text-sm text-gray-500">Enter the patient's 12-digit Aadhaar number</p>
            </div>
            <button 
              type="submit" 
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
            >
              Request Access
            </button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default PatientList;
