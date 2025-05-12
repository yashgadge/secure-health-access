
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Database } from "@/integrations/supabase/types";

type Doctor = Database["public"]["Tables"]["doctors"]["Row"] & {
  name: string;
  email: string;
};

interface DoctorProfileProps {
  userData: Doctor;
}

const DoctorProfile: React.FC<DoctorProfileProps> = ({ userData }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Doctor Profile</CardTitle>
        <CardDescription>Your professional information</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Doctor ID</p>
              <p className="font-medium">{userData.id}</p>
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
              <p className="text-sm text-gray-500">Specialization</p>
              <p className="font-medium">{userData.specialization}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Hospital Affiliation</p>
              <p className="font-medium">{userData.hospital_affiliation}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DoctorProfile;
