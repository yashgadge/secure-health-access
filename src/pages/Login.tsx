
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PageLayout from '@/components/PageLayout';
import PatientLoginForm from '@/components/patient/PatientLoginForm';
import DoctorLoginForm from '@/components/doctor/DoctorLoginForm';

const Login = () => {
  return (
    <PageLayout>
      <div className="flex-1 flex items-center justify-center p-6">
        <Tabs defaultValue="patient" className="w-full max-w-md">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="patient">Patient Login</TabsTrigger>
            <TabsTrigger value="doctor">Doctor Login</TabsTrigger>
          </TabsList>
          
          <TabsContent value="patient">
            <PatientLoginForm />
          </TabsContent>
          
          <TabsContent value="doctor">
            <DoctorLoginForm />
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
};

export default Login;
