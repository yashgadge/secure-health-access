
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface ProfileTabProps {
  userData: any;
}

const ProfileTab: React.FC<ProfileTabProps> = ({ userData }) => {
  return (
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
  );
};

export default ProfileTab;
