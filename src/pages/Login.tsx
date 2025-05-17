
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PageLayout from '@/components/PageLayout';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const Login = () => {
  const navigate = useNavigate();

  const handlePatientLogin = () => {
    navigate('/patient/login');
  };

  const handleDoctorLogin = () => {
    navigate('/doctor/login');
  };

  return (
    <PageLayout>
      <div className="flex-1 flex items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Medical Records System</CardTitle>
            <CardDescription>
              Login to access the health records management system
            </CardDescription>
          </CardHeader>
          
          <CardContent className="flex flex-col gap-4">
            <Button 
              variant="default" 
              size="lg" 
              className="w-full"
              onClick={handlePatientLogin}
            >
              Patient Login
            </Button>
            
            <Button 
              variant="outline" 
              size="lg" 
              className="w-full"
              onClick={handleDoctorLogin}
            >
              Doctor Login
            </Button>
          </CardContent>
          
          <CardFooter className="flex justify-center">
            <p className="text-sm text-gray-500">
              Choose your role to proceed to the appropriate login screen
            </p>
          </CardFooter>
        </Card>
      </div>
    </PageLayout>
  );
};

export default Login;
