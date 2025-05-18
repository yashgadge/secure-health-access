
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { X, Check, Clock } from 'lucide-react';

interface RequestsTabProps {
  accessRequests: any[];
  onApprove: (request: any) => void;
  onReject: (request: any) => void;
  doctorDB: any[];
}

const RequestsTab: React.FC<RequestsTabProps> = ({ 
  accessRequests, 
  onApprove, 
  onReject,
  doctorDB
}) => {
  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle>Doctor Access Requests</CardTitle>
        <CardDescription>Approve or deny doctor access to your medical records</CardDescription>
      </CardHeader>
      <CardContent>
        {accessRequests.length > 0 ? (
          <div className="space-y-4">
            {accessRequests.map((request: any) => {
              const doctor = doctorDB.find(d => d.doctorId === request.doctorId);
              return (
                <div key={request.id} className="p-4 border rounded-md bg-white shadow-sm">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{doctor?.name || "Unknown Doctor"}</h3>
                      <p className="text-sm text-gray-500">{doctor?.specialization}, {doctor?.hospitalAffiliation}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        <Clock className="h-3 w-3 inline mr-1" />
                        Requested: {new Date(request.requestDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="bg-green-50 text-green-600 hover:bg-green-100 border-green-200"
                        onClick={() => onApprove(request)}
                      >
                        <Check className="h-4 w-4 mr-1" /> Approve
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="bg-red-50 text-red-600 hover:bg-red-100 border-red-200"
                        onClick={() => onReject(request)}
                      >
                        <X className="h-4 w-4 mr-1" /> Reject
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No pending access requests.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RequestsTab;
