
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { X } from 'lucide-react';

interface DoctorsTabProps {
  authorizedDoctors: any[];
  onRevokeAccess: (doctorId: string) => void;
}

const DoctorsTab: React.FC<DoctorsTabProps> = ({ authorizedDoctors, onRevokeAccess }) => {
  return (
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
                  onClick={() => onRevokeAccess(doctor.doctorId)}
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
  );
};

export default DoctorsTab;
