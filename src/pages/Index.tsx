
import React from 'react';
import { Link } from 'react-router-dom';
import PageLayout from '@/components/PageLayout';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const Index = () => {
  return (
    <PageLayout>
      <div className="container mx-auto px-6 py-12">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-4xl font-bold tracking-tight">
            MediRecord - Secure Medical Records System
          </h1>
          <p className="mt-4 text-xl text-gray-600">
            Your medical data, securely stored and easily accessible.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">For Patients</CardTitle>
              <CardDescription>
                Access and manage your medical records securely
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <p>
                Patients can access their complete medical history, control which doctors can view their records, and securely share their information when needed.
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>Complete access to your medical history</li>
                <li>Control doctor access to your records</li>
                <li>Upload and manage your medical documents</li>
                <li>Secure and private</li>
              </ul>
            </CardContent>
            <CardFooter className="flex flex-col gap-3">
              <Button asChild className="w-full">
                <Link to="/patient/login">Patient Login</Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link to="/patient/register">Register as Patient</Link>
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">For Doctors</CardTitle>
              <CardDescription>
                Manage patient records and treatment plans
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <p>
                Doctors can securely access patient records with permission, maintain treatment history, and collaborate more effectively with patients and other healthcare providers.
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>Request access to patient records</li>
                <li>View comprehensive medical history</li>
                <li>Maintain treatment notes securely</li>
                <li>Add medical documents and test results</li>
              </ul>
            </CardContent>
            <CardFooter className="flex flex-col gap-3">
              <Button asChild className="w-full">
                <Link to="/doctor/login">Doctor Login</Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link to="/doctor/register">Register as Doctor</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        <div className="mt-8 text-center">
          <Button asChild variant="outline">
            <Link to="/admin/dashboard">Admin Dashboard</Link>
          </Button>
        </div>
      </div>
    </PageLayout>
  );
};

export default Index;
