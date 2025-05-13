
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

// Import mock data
import { mockDoctorDB } from '@/utils/mockDatabase';

const DoctorLoginForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [doctorEmail, setDoctorEmail] = useState("");
  const [doctorPassword, setDoctorPassword] = useState("");

  const handleDoctorLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log("Attempting login with:", doctorEmail);
    console.log("Available doctors:", mockDoctorDB);
    
    // Validate doctor credentials
    const doctor = mockDoctorDB.find(
      d => d.email === doctorEmail && d.password === doctorPassword
    );
    
    if (!doctor) {
      // Check if email exists but password is wrong
      const doctorEmailExists = mockDoctorDB.some(d => d.email === doctorEmail);
      
      if (doctorEmailExists) {
        toast({
          title: "Login Failed",
          description: "Invalid password. Please try again.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Doctor not found",
          description: "No account found with this email. Please register first.",
          variant: "destructive"
        });
      }
      return;
    }
    
    // Login successful
    localStorage.setItem("userType", "doctor");
    localStorage.setItem("userData", JSON.stringify(doctor));
    toast({
      title: "Login Successful",
      description: `Welcome, Dr. ${doctor.name}!`,
    });
    navigate("/doctor/dashboard");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Doctor Login</CardTitle>
        <CardDescription>
          Access your medical dashboard securely
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleDoctorLogin}>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email"
                type="email" 
                placeholder="doctor@example.com" 
                value={doctorEmail}
                onChange={(e) => setDoctorEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link to="/forgot-password" className="text-sm text-medical-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
              <Input 
                id="password"
                type="password" 
                value={doctorPassword}
                onChange={(e) => setDoctorPassword(e.target.value)}
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                For demo: doctor@example.com / password123
              </p>
            </div>
            
            <Button type="submit" className="w-full">Sign In</Button>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col">
        <p className="text-sm text-gray-500 text-center w-full">
          Need access? <Link to="/doctor/register" className="text-blue-600 hover:underline">Register here</Link>
        </p>
      </CardFooter>
    </Card>
  );
};

export default DoctorLoginForm;
