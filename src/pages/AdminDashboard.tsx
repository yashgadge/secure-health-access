
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Download, RefreshCw } from 'lucide-react';

import { mockPatientDB, mockDoctorDB, exportDataToCSV, initMockDatabases } from '@/utils/mockDatabase';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [patients, setPatients] = useState(mockPatientDB);
  const [doctors, setDoctors] = useState(mockDoctorDB);
  const [patientSearch, setPatientSearch] = useState("");
  const [doctorSearch, setDoctorSearch] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Effect to check admin login
  useEffect(() => {
    const userType = localStorage.getItem("userType");
    if (userType !== "admin") {
      // For now, let's allow access if there's no login, assuming it's a demo
      // But in production, we'd redirect to a login page
      // navigate("/login");
    }
  }, [navigate]);

  // Effect to load data
  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    // Force re-initialize mock databases from localStorage
    initMockDatabases();
    
    // Create fresh copies of the arrays to trigger re-render
    setPatients([...mockPatientDB]);
    setDoctors([...mockDoctorDB]);
    
    console.log("Admin Dashboard loaded patients:", mockPatientDB);
    console.log("Admin Dashboard loaded doctors:", mockDoctorDB);
  };

  const refreshData = () => {
    setIsRefreshing(true);
    loadData();
    
    setTimeout(() => {
      setIsRefreshing(false);
      toast({
        title: "Data Refreshed",
        description: "The latest data has been loaded from the database."
      });
    }, 800);
  };

  const handleExport = (dataType: 'patients' | 'doctors') => {
    const { url, filename } = exportDataToCSV(dataType);
    
    // Create and trigger download
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Export Complete",
      description: `${dataType.charAt(0).toUpperCase() + dataType.slice(1)} data has been exported to ${filename}`
    });
  };

  const filteredPatients = patientSearch 
    ? patients.filter(p => 
        p.name.toLowerCase().includes(patientSearch.toLowerCase()) || 
        p.patientId.toLowerCase().includes(patientSearch.toLowerCase()) ||
        p.aadhaarId.includes(patientSearch)
      )
    : patients;

  const filteredDoctors = doctorSearch
    ? doctors.filter(d => 
        d.name.toLowerCase().includes(doctorSearch.toLowerCase()) || 
        d.doctorId.toLowerCase().includes(doctorSearch.toLowerCase()) || 
        (d.specialization && d.specialization.toLowerCase().includes(doctorSearch.toLowerCase()))
      )
    : doctors;

  return (
    <Layout>
      <div className="container mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <p className="text-gray-500">Manage patients and doctors</p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-1"
              onClick={refreshData}
              disabled={isRefreshing}
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh Data
            </Button>
            <Button variant="outline" size="sm" onClick={() => navigate("/")}>
              Back to Home
            </Button>
          </div>
        </div>

        <Tabs defaultValue="patients">
          <TabsList className="mb-4">
            <TabsTrigger value="patients">Patients</TabsTrigger>
            <TabsTrigger value="doctors">Doctors</TabsTrigger>
          </TabsList>

          <TabsContent value="patients">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Registered Patients</CardTitle>
                    <CardDescription>Total patients: {patients.length}</CardDescription>
                  </div>
                  <Button onClick={() => handleExport('patients')} className="flex items-center gap-1">
                    <Download className="h-4 w-4" /> Export to CSV
                  </Button>
                </div>
                <Input
                  placeholder="Search patients by name, ID or Aadhaar..."
                  className="max-w-sm"
                  value={patientSearch}
                  onChange={(e) => setPatientSearch(e.target.value)}
                />
              </CardHeader>
              <CardContent>
                <div className="border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Patient ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead className="hidden md:table-cell">Email</TableHead>
                        <TableHead className="hidden md:table-cell">Phone</TableHead>
                        <TableHead className="hidden md:table-cell">Aadhaar ID</TableHead>
                        <TableHead className="hidden md:table-cell">Authorized Doctors</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredPatients.length > 0 ? (
                        filteredPatients.map(patient => (
                          <TableRow key={patient.patientId}>
                            <TableCell>{patient.patientId}</TableCell>
                            <TableCell>{patient.name}</TableCell>
                            <TableCell className="hidden md:table-cell">{patient.email}</TableCell>
                            <TableCell className="hidden md:table-cell">{patient.phone}</TableCell>
                            <TableCell className="hidden md:table-cell">{patient.aadhaarId}</TableCell>
                            <TableCell className="hidden md:table-cell">
                              {patient.authorizedDoctors && patient.authorizedDoctors.length > 0 ? 
                                patient.authorizedDoctors.join(", ") : "None"}
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-4">
                            No patients found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="doctors">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Registered Doctors</CardTitle>
                    <CardDescription>Total doctors: {doctors.length}</CardDescription>
                  </div>
                  <Button onClick={() => handleExport('doctors')} className="flex items-center gap-1">
                    <Download className="h-4 w-4" /> Export to CSV
                  </Button>
                </div>
                <Input
                  placeholder="Search doctors by name, ID or specialization..."
                  className="max-w-sm"
                  value={doctorSearch}
                  onChange={(e) => setDoctorSearch(e.target.value)}
                />
              </CardHeader>
              <CardContent>
                <div className="border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Doctor ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead className="hidden md:table-cell">Email</TableHead>
                        <TableHead className="hidden md:table-cell">Specialization</TableHead>
                        <TableHead className="hidden md:table-cell">Hospital</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredDoctors.length > 0 ? (
                        filteredDoctors.map(doctor => (
                          <TableRow key={doctor.doctorId}>
                            <TableCell>{doctor.doctorId}</TableCell>
                            <TableCell>{doctor.name}</TableCell>
                            <TableCell className="hidden md:table-cell">{doctor.email}</TableCell>
                            <TableCell className="hidden md:table-cell">{doctor.specialization}</TableCell>
                            <TableCell className="hidden md:table-cell">{doctor.hospitalAffiliation}</TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-4">
                            No doctors found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
