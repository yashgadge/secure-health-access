
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface ProfileTabProps {
  userData: any;
}

const ProfileTab: React.FC<ProfileTabProps> = ({ userData }) => {
  // Fixed user data to show regardless of who logs in
  const fixedUserData = {
    patientId: "PAT540726",
    aadhaarId: "123456789012",
    name: "Neha Joshi",
    email: "neha.joshi@example.com",
    phone: "9397195857",
    address: "908 Joshi Street, Chennai"
  };

  // Always use the fixed data regardless of the userData provided
  const displayData = fixedUserData;

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
            <p className="font-medium text-lg">{displayData.patientId}</p>
          </div>
          <div>
            <h3 className="text-sm text-gray-500">Aadhaar ID</h3>
            <p className="font-medium text-lg">{displayData.aadhaarId}</p>
          </div>
          <div>
            <h3 className="text-sm text-gray-500">Name</h3>
            <p className="font-medium text-lg">{displayData.name}</p>
          </div>
          <div>
            <h3 className="text-sm text-gray-500">Email</h3>
            <p className="font-medium text-lg">{displayData.email}</p>
          </div>
          <div>
            <h3 className="text-sm text-gray-500">Phone</h3>
            <p className="font-medium text-lg">{displayData.phone}</p>
          </div>
          <div>
            <h3 className="text-sm text-gray-500">Address</h3>
            <p className="font-medium text-lg">{displayData.address}</p>
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
