
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <header className="border-b">
        <div className="container mx-auto py-4 px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-medical-primary">
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
            </svg>
            <span className="text-xl font-bold text-medical-primary">MediRecord</span>
          </div>
          <div className="flex items-center gap-4">
            <Button asChild variant="outline">
              <Link to="/login">Login</Link>
            </Button>
            <Button asChild>
              <Link to="/login">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero section */}
      <section className="container mx-auto px-6 py-16 md:py-24 flex flex-col md:flex-row items-center gap-8">
        <div className="flex-1 space-y-6">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-medical-dark">
            Your Medical History, <span className="text-medical-primary">Securely Managed</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl">
            Store, manage, and share your medical documents with healthcare providers securely. Take control of your health records with Aadhaar-based authentication.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button asChild size="lg" className="px-8">
              <Link to="/login">Patient Login</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="px-8">
              <Link to="/doctor-login">Doctor Login</Link>
            </Button>
          </div>
        </div>
        <div className="flex-1 mt-8 md:mt-0">
          <img 
            src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&auto=format&fit=crop&q=80&w=1470" 
            alt="Medical records" 
            className="w-full rounded-lg shadow-lg"
          />
        </div>
      </section>

      {/* Features section */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-medical-secondary rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-medical-primary">
                  <path d="M21 9v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7"></path>
                  <line x1="16" x2="22" y1="6" y2="12"></line>
                  <path d="M17 21v-2"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure Document Upload</h3>
              <p className="text-gray-600">
                Upload and store your medical documents with end-to-end encryption for maximum security.
              </p>
            </Card>
            
            <Card className="p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-medical-secondary rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-medical-primary">
                  <path d="M9 11h6"></path>
                  <path d="M12 8v6"></path>
                  <rect width="18" height="18" x="3" y="3" rx="2"></rect>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Aadhaar Authentication</h3>
              <p className="text-gray-600">
                Log in securely with Aadhaar-based authentication to access your medical records.
              </p>
            </Card>
            
            <Card className="p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-medical-secondary rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-medical-primary">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Doctor Access Control</h3>
              <p className="text-gray-600">
                Grant and revoke access to specific doctors for your medical documents.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* How it works section */}
      <section className="container mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-medical-primary text-white flex items-center justify-center mb-4 font-bold text-lg">1</div>
            <h3 className="text-xl font-semibold mb-2">Create Account</h3>
            <p className="text-gray-600">Sign up using your Aadhaar ID for quick and secure registration.</p>
          </div>
          
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-medical-primary text-white flex items-center justify-center mb-4 font-bold text-lg">2</div>
            <h3 className="text-xl font-semibold mb-2">Upload Documents</h3>
            <p className="text-gray-600">Upload your medical documents securely to your personal dashboard.</p>
          </div>
          
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-medical-primary text-white flex items-center justify-center mb-4 font-bold text-lg">3</div>
            <h3 className="text-xl font-semibold mb-2">Share with Doctors</h3>
            <p className="text-gray-600">Grant access to your healthcare providers when needed.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-medical-dark text-white mt-auto">
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-medical-accent">
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
              </svg>
              <span className="text-lg font-bold">MediRecord</span>
            </div>
            <div className="text-sm text-gray-300">
              © {new Date().getFullYear()} MediRecord. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
