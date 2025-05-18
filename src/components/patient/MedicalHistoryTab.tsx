
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, FileText } from 'lucide-react';

interface MedicalHistoryTabProps {
  medicalHistory: any[];
  onUploadClick: () => void;
}

const MedicalHistoryTab: React.FC<MedicalHistoryTabProps> = ({ medicalHistory, onUploadClick }) => {
  return (
    <Card className="shadow-md">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Medical History Timeline</CardTitle>
          <CardDescription>View your complete medical history in chronological order</CardDescription>
        </div>
        <Button onClick={onUploadClick} className="bg-blue-500 hover:bg-blue-600">
          <Upload className="h-4 w-4 mr-2" /> Upload
        </Button>
      </CardHeader>
      <CardContent>
        {medicalHistory.length > 0 ? (
          <div className="relative space-y-8 before:absolute before:top-0 before:bottom-0 before:left-6 before:w-[2px] before:bg-blue-200">
            {medicalHistory.map((entry) => (
              <div key={entry.id} className="relative pl-14">
                <div className="absolute left-5 w-4 h-4 bg-blue-500 rounded-full transform -translate-x-1/2 mt-1 z-10"></div>
                <div className="mb-1 flex items-center">
                  <p className="font-medium">{new Date(entry.date).toLocaleDateString('en-GB')}</p>
                  {entry.doctorName && (
                    <>
                      <span className="mx-2 text-gray-400">•</span>
                      <p className="text-gray-500">{entry.doctorName}</p>
                    </>
                  )}
                </div>
                <div className="p-4 bg-gray-50 rounded-md shadow-sm">
                  <p className="mb-3">{entry.notes}</p>
                  {entry.documents && entry.documents.length > 0 && (
                    <div className="mt-2">
                      <p className="text-sm font-medium mb-2">Documents:</p>
                      <div className="flex flex-wrap gap-2">
                        {entry.documents.map((doc: any, idx: number) => (
                          <Button key={idx} variant="outline" size="sm" asChild>
                            <a href={doc.url} target="_blank" rel="noopener noreferrer">
                              <FileText className="h-4 w-4 mr-1" /> {doc.name}
                            </a>
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No medical history records found.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MedicalHistoryTab;
