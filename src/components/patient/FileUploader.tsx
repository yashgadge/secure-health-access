
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Upload } from 'lucide-react';
import { 
  mockMedicalHistoryDB, 
  mockPatientFilesDB,
  persistMockDatabases
} from '@/utils/mockDatabase';

interface FileUploaderProps {
  patientId: string;
  onUploadComplete: () => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ patientId, onUploadComplete }) => {
  const { toast } = useToast();
  const [fileTitle, setFileTitle] = useState("");
  const [fileDescription, setFileDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (!file) {
      toast({
        title: "File Required",
        description: "Please select a file to upload",
        variant: "destructive"
      });
      return;
    }

    if (!fileTitle) {
      toast({
        title: "Title Required",
        description: "Please enter a title for this record",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);

    // Create a mock URL for the file
    const fileURL = "#";
    const fileType = file.type.split('/')[1] || 'document';
    
    // Find patient files or create new entry
    const patientFilesIndex = mockPatientFilesDB.findIndex(p => p.patientId === patientId);
    
    if (patientFilesIndex === -1) {
      // Create new patient files entry
      mockPatientFilesDB.push({
        patientId,
        files: [
          {
            name: file.name,
            type: fileType,
            date: new Date().toISOString().slice(0, 10),
            url: fileURL
          }
        ]
      });
    } else {
      // Add to existing files
      mockPatientFilesDB[patientFilesIndex].files.push({
        name: file.name,
        type: fileType,
        date: new Date().toISOString().slice(0, 10),
        url: fileURL
      });
    }
    
    // Add to medical history
    const patientHistoryIndex = mockMedicalHistoryDB.findIndex(h => h.patientId === patientId);
    
    if (patientHistoryIndex === -1) {
      // Create new entry
      mockMedicalHistoryDB.push({
        patientId,
        entries: [
          {
            id: `MH${Date.now()}`,
            date: new Date().toISOString().slice(0, 10),
            doctorId: "",
            doctorName: "Self Upload",
            notes: fileDescription || `Uploaded ${file.name}`,
            documents: [
              {
                name: file.name,
                url: fileURL
              }
            ]
          }
        ]
      });
    } else {
      // Add to existing history
      mockMedicalHistoryDB[patientHistoryIndex].entries.push({
        id: `MH${Date.now()}`,
        date: new Date().toISOString().slice(0, 10),
        doctorId: "",
        doctorName: "Self Upload",
        notes: fileDescription || `Uploaded ${file.name}`,
        documents: [
          {
            name: file.name,
            url: fileURL
          }
        ]
      });
    }
    
    // Persist data
    persistMockDatabases();
    
    // Reset form
    setFile(null);
    setFileTitle("");
    setFileDescription("");
    setUploading(false);
    
    toast({
      title: "File Uploaded",
      description: "Your medical record has been uploaded successfully",
    });
    
    onUploadComplete();
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-2">
        <Label htmlFor="fileTitle">Record Title</Label>
        <Input
          id="fileTitle"
          value={fileTitle}
          onChange={(e) => setFileTitle(e.target.value)}
          placeholder="e.g., Blood Test Results"
        />
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="fileDescription">Description (Optional)</Label>
        <Textarea
          id="fileDescription"
          value={fileDescription}
          onChange={(e) => setFileDescription(e.target.value)}
          placeholder="Add notes about this medical record"
          rows={3}
        />
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="file">Upload File</Label>
        <Input
          id="file"
          type="file"
          onChange={handleFileChange}
        />
        {file && (
          <p className="text-sm text-gray-500">Selected: {file.name}</p>
        )}
      </div>
      
      <Button
        onClick={handleUpload}
        disabled={uploading || !file}
        className="w-full"
      >
        <Upload className="h-4 w-4 mr-2" />
        {uploading ? "Uploading..." : "Upload Record"}
      </Button>
    </div>
  );
};

export default FileUploader;
