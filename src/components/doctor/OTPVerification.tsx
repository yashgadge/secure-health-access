
import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Patient } from './PatientTypes';

interface OTPVerificationProps {
  selectedPatient: Patient | null;
  otp: string;
  setOtp: React.Dispatch<React.SetStateAction<string>>;
  handleVerifyOTP: (e: React.FormEvent) => Promise<void>;
  handleCancel: () => void;
}

const OTPVerification: React.FC<OTPVerificationProps> = ({
  selectedPatient,
  otp,
  setOtp,
  handleVerifyOTP,
  handleCancel
}) => {
  if (!selectedPatient) return null;

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleVerifyOTP}>
          <div className="grid gap-6">
            <div className="p-4 bg-gray-50 rounded-md">
              <p className="font-medium">Requesting access to:</p>
              <div className="mt-2">
                <p><span className="text-gray-500">Name:</span> {selectedPatient?.name}</p>
                <p><span className="text-gray-500">Aadhaar ID:</span> {selectedPatient?.aadhaar_id}</p>
              </div>
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="otp" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                One-Time Password from Patient
              </label>
              <Input 
                id="otp"
                type="text" 
                placeholder="Enter 6-digit OTP shared by patient" 
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={6}
                required
              />
              <p className="text-sm text-gray-500">
                For demo purposes, enter any 6 digits
              </p>
            </div>
            
            <div className="flex gap-4">
              <Button type="submit" className="flex-1">Verify OTP</Button>
              <Button 
                type="button" 
                variant="outline"
                onClick={handleCancel}
              >
                Cancel
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default OTPVerification;
