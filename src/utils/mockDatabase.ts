// Mock Aadhaar database
export const mockAadhaarDB = [
  {
    aadhaarId: "123456789012",
    name: "Rahul Sharma",
    dob: "1990-05-15",
    gender: "Male",
    address: "123 Main Street, Mumbai, Maharashtra",
    phone: "9876543210",
    email: "rahul.sharma@example.com"
  },
  {
    aadhaarId: "234567890123",
    name: "Priya Patel",
    dob: "1985-11-22",
    gender: "Female",
    address: "456 Park Avenue, Delhi, Delhi",
    phone: "8765432109",
    email: "priya.patel@example.com"
  },
  {
    aadhaarId: "345678901234",
    name: "Dr. Anjali Desai",
    dob: "1980-03-18",
    gender: "Female",
    address: "789 Hospital Road, Bangalore, Karnataka",
    phone: "7654321098",
    email: "doctor@example.com"
  },
  {
    aadhaarId: "456789012345",
    name: "Dr. Vikram Singh",
    dob: "1975-09-25",
    gender: "Male",
    address: "234 Medical Center Drive, Chennai, Tamil Nadu",
    phone: "6543210987",
    email: "vikram.singh@example.com"
  },
  {
    aadhaarId: "567890123456",
    name: "Neha Gupta",
    dob: "1992-12-08",
    gender: "Female",
    address: "567 Lake View, Kolkata, West Bengal",
    phone: "5432109876",
    email: "neha.gupta@example.com"
  }
];

// Mock patient database
export const mockPatientDB = [
  {
    aadhaarId: "123456789012",
    patientId: "PAT103245",
    name: "Rahul Sharma",
    email: "rahul.sharma@example.com",
    phone: "9876543210",
    address: "123 Main Street, Mumbai, Maharashtra",
    authorizedDoctors: ["DOC987654", "DOC765432", "DOC654321"] // Added more authorized doctors for demo
  },
  {
    aadhaarId: "234567890123",
    patientId: "PAT204356",
    name: "Priya Patel",
    email: "priya.patel@example.com",
    phone: "8765432109",
    address: "456 Park Avenue, Delhi, Delhi",
    authorizedDoctors: ["DOC654321"]
  },
  {
    aadhaarId: "567890123456",
    patientId: "PAT305467",
    name: "Neha Gupta",
    email: "neha.gupta@example.com",
    phone: "5432109876",
    address: "567 Lake View, Kolkata, West Bengal",
    authorizedDoctors: []
  }
];

// Mock doctor database
export const mockDoctorDB = [
  {
    aadhaarId: "345678901234",
    doctorId: "DOC987654",
    email: "doctor@example.com",
    password: "password123",
    name: "Dr. Anjali Desai",
    specialization: "Cardiologist",
    hospitalAffiliation: "City Medical Center"
  },
  {
    aadhaarId: "456789012345",
    doctorId: "DOC765432",
    email: "vikram.singh@example.com",
    password: "password456",
    name: "Dr. Vikram Singh",
    specialization: "Neurologist",
    hospitalAffiliation: "National Neuro Institute"
  },
  {
    aadhaarId: "678901234567",
    doctorId: "DOC654321",
    email: "rohit.kumar@example.com",
    password: "password789",
    name: "Dr. Rohit Kumar",
    specialization: "Pediatrician",
    hospitalAffiliation: "Children's Hospital"
  },
  {
    aadhaarId: "789012345678",
    doctorId: "DOC543210",
    email: "priya.verma@example.com",
    password: "password321",
    name: "Dr. Priya Verma",
    specialization: "Dermatologist",
    hospitalAffiliation: "Skin & Care Hospital"
  },
  {
    aadhaarId: "890123456789",
    doctorId: "DOC432109",
    email: "sunil.mehta@example.com",
    password: "password654",
    name: "Dr. Sunil Mehta",
    specialization: "Orthopedic Surgeon",
    hospitalAffiliation: "Joint & Bone Medical Center"
  }
];

// Mock medical history database
export const mockMedicalHistoryDB = [
  {
    patientId: "PAT103245",
    entries: [
      {
        id: "MH001",
        date: "2023-10-15",
        doctorId: "DOC987654",
        doctorName: "Dr. Anjali Desai",
        notes: "Patient presented with symptoms of common cold. Prescribed antihistamines and rest.",
        documents: [
          {
            name: "Prescription.pdf",
            url: "#"
          }
        ]
      },
      {
        id: "MH002",
        date: "2023-09-02",
        doctorId: "DOC987654",
        doctorName: "Dr. Anjali Desai",
        notes: "Routine check-up. Blood pressure normal. Recommended regular exercise.",
        documents: [
          {
            name: "BloodTest.pdf",
            url: "#"
          },
          {
            name: "CheckupReport.pdf",
            url: "#"
          }
        ]
      },
      {
        id: "MH003",
        date: "2024-01-10",
        doctorId: "DOC765432",
        doctorName: "Dr. Vikram Singh",
        notes: "Patient reported occasional headaches. Recommended stress management techniques and proper sleep hygiene.",
        documents: [
          {
            name: "HeadacheDiagnosis.pdf",
            url: "#"
          }
        ]
      },
      {
        id: "MH004",
        date: "2024-03-25",
        doctorName: "Self Upload",
        notes: "Uploaded personal health records from annual employer health checkup.",
        documents: [
          {
            name: "AnnualCheckup2024.pdf",
            url: "#"
          },
          {
            name: "BloodWorkResults.pdf",
            url: "#"
          }
        ]
      },
      {
        id: "MH005",
        date: "2024-05-08", 
        doctorId: "DOC654321",
        doctorName: "Dr. Rohit Kumar",
        notes: "Patient visited for flu symptoms. Prescribed antibiotics and rest for 5 days. Follow up if symptoms persist.",
        documents: [
          {
            name: "FluPrescription.pdf",
            url: "#"
          },
          {
            name: "MedicationInstructions.pdf",
            url: "#"
          }
        ]
      },
      {
        id: "MH006",
        date: "2024-05-17",
        doctorId: "DOC987654",
        doctorName: "Dr. Anjali Desai",
        notes: "Patient complained of occasional chest pain after exercise. ECG conducted and no abnormalities found. Recommended cardiac stress test as precautionary measure.",
        documents: [
          {
            name: "ECGReport.pdf",
            url: "#"
          },
          {
            name: "CardiacTestReferral.pdf",
            url: "#"
          }
        ]
      }
    ]
  },
  {
    patientId: "PAT204356",
    entries: [
      {
        id: "MH005",
        date: "2023-11-20",
        doctorId: "DOC654321",
        doctorName: "Dr. Rohit Kumar",
        notes: "Patient reported seasonal allergies. Prescribed antiallergic medication for two weeks.",
        documents: [
          {
            name: "AllergyPrescription.pdf",
            url: "#"
          }
        ]
      },
      {
        id: "MH006",
        date: "2024-02-15",
        doctorId: "DOC654321",
        doctorName: "Dr. Rohit Kumar",
        notes: "Follow-up for allergies. Symptoms have subsided. Recommended to continue medication for one more week.",
        documents: []
      }
    ]
  },
  {
    patientId: "PAT305467",
    entries: [
      {
        id: "MH007",
        date: "2024-04-05",
        doctorName: "Self Upload",
        notes: "Uploaded medical reports from routine gynecological examination.",
        documents: [
          {
            name: "GynecologicalReport.pdf",
            url: "#"
          }
        ]
      }
    ]
  }
];

// Mock access requests database
export const mockAccessRequestsDB = [
  {
    id: "REQ123456",
    doctorId: "DOC654321",
    patientId: "PAT103245",
    status: "pending",
    requestDate: "2024-05-15T10:30:00Z"
  },
  {
    id: "REQ234567",
    doctorId: "DOC765432",
    patientId: "PAT305467",
    status: "pending", 
    requestDate: "2024-05-16T14:45:00Z"
  },
  {
    id: "REQ345678",
    doctorId: "DOC543210",
    patientId: "PAT103245",
    status: "pending",
    requestDate: "2024-05-16T09:15:00Z"
  },
  {
    id: "REQ456789",
    doctorId: "DOC432109",
    patientId: "PAT103245",
    status: "pending",
    requestDate: "2024-05-17T11:20:00Z"
  }
];

// Mock patient files database
export const mockPatientFilesDB = [
  {
    patientId: "PAT103245",
    files: [
      {
        name: "prescription1.pdf",
        type: "pdf",
        date: "2023-10-15",
        url: "#"
      },
      {
        name: "bloodtest1.pdf",
        type: "pdf",
        date: "2023-09-02",
        url: "#"
      },
      {
        name: "headache_diagnosis.pdf",
        type: "pdf",
        date: "2024-01-10",
        url: "#"
      },
      {
        name: "annual_checkup_2024.pdf",
        type: "pdf",
        date: "2024-03-25",
        url: "#"
      }
    ]
  },
  {
    patientId: "PAT204356",
    files: [
      {
        name: "allergy_prescription.pdf",
        type: "pdf",
        date: "2023-11-20",
        url: "#"
      }
    ]
  },
  {
    patientId: "PAT305467",
    files: [
      {
        name: "gynecological_report.pdf",
        type: "pdf",
        date: "2024-04-05",
        url: "#"
      }
    ]
  }
];

// Generate unique IDs
export const generatePatientId = (): string => {
  return `PAT${Math.floor(100000 + Math.random() * 900000)}`;
};

export const generateDoctorId = (): string => {
  return `DOC${Math.floor(100000 + Math.random() * 900000)}`;
};

// Generate mock OTP
export const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Generate random user data
export const generateRandomUserData = (aadhaarId: string) => {
  const firstNames = ["Arun", "Vikram", "Neha", "Sanjay", "Priya", "Ravi", "Anita", "Kiran", "Meera", "Raj"];
  const lastNames = ["Sharma", "Patel", "Singh", "Kumar", "Gupta", "Shah", "Verma", "Joshi", "Mehta", "Das"];
  const cities = ["Mumbai", "Delhi", "Bangalore", "Pune", "Chennai", "Hyderabad", "Kolkata", "Ahmedabad"];
  
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  const name = `${firstName} ${lastName}`;
  
  // Generate a random date of birth (between 18 and 80 years ago)
  const now = new Date();
  const minAge = 18;
  const maxAge = 80;
  const randomAge = Math.floor(Math.random() * (maxAge - minAge + 1)) + minAge;
  const birthYear = now.getFullYear() - randomAge;
  const birthMonth = Math.floor(Math.random() * 12) + 1;
  const birthDay = Math.floor(Math.random() * 28) + 1; // Avoid invalid dates by using max 28
  const dob = `${birthYear}-${String(birthMonth).padStart(2, '0')}-${String(birthDay).padStart(2, '0')}`;
  
  // Generate a random 10-digit phone number
  const phone = `9${Math.floor(Math.random() * 1000000000).toString().padStart(9, '0')}`;
  
  // Generate a random address
  const addressNum = Math.floor(Math.random() * 999) + 1;
  const city = cities[Math.floor(Math.random() * cities.length)];
  const address = `${addressNum} ${lastName} Street, ${city}`;
  
  // Generate email based on name
  const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`;
  
  // Randomly assign gender
  const gender = Math.random() > 0.5 ? "Male" : "Female";
  
  return {
    aadhaarId,
    name,
    dob,
    gender,
    address,
    phone,
    email
  };
};

// Add new Aadhaar ID to the mock database
export const addNewAadhaarToMockDB = (aadhaarId: string) => {
  // Check if the Aadhaar ID already exists
  const existingUser = mockAadhaarDB.find(user => user.aadhaarId === aadhaarId);
  if (existingUser) {
    return existingUser;
  }
  
  // Generate random user data
  const newUserData = generateRandomUserData(aadhaarId);
  
  // Add to mock DB
  mockAadhaarDB.push(newUserData);
  
  // Save to localStorage for persistence
  persistMockDatabases();
  
  return newUserData;
};

// Helper function to save data to localStorage
export const saveToLocalStorage = (key: string, data: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    console.log(`Saved to localStorage: ${key}`, data);
  } catch (error) {
    console.error(`Error saving data for key ${key}:`, error);
  }
};

// Helper function to load data from localStorage
export const loadFromLocalStorage = (key: string, defaultValue: any = null) => {
  try {
    const storedData = localStorage.getItem(key);
    if (storedData) {
      const parsed = JSON.parse(storedData);
      console.log(`Loaded from localStorage: ${key}`, parsed);
      return parsed;
    }
  } catch (error) {
    console.error(`Error parsing data for key ${key}:`, error);
  }
  console.log(`Using default value for ${key}:`, defaultValue);
  return defaultValue;
};

// Initialize mock databases from localStorage or use defaults
export const initMockDatabases = () => {
  console.log("Initializing mock databases...");
  
  // Initialize Aadhaar DB
  const storedAadhaarDB = loadFromLocalStorage('aadhaarDB', mockAadhaarDB);
  mockAadhaarDB.length = 0;
  mockAadhaarDB.push(...storedAadhaarDB);
  console.log("Loaded Aadhaar DB:", mockAadhaarDB);
  
  // Initialize Patient DB
  const storedPatientDB = loadFromLocalStorage('patientDB', mockPatientDB);
  mockPatientDB.length = 0;
  mockPatientDB.push(...storedPatientDB);
  console.log("Loaded Patient DB:", mockPatientDB);
  
  // Initialize Doctor DB
  const storedDoctorDB = loadFromLocalStorage('doctorDB', mockDoctorDB);
  mockDoctorDB.length = 0;
  mockDoctorDB.push(...storedDoctorDB);
  console.log("Loaded Doctor DB:", mockDoctorDB);
  
  // Initialize Medical History DB
  const storedMedicalHistoryDB = loadFromLocalStorage('medicalHistoryDB', mockMedicalHistoryDB);
  mockMedicalHistoryDB.length = 0;
  mockMedicalHistoryDB.push(...storedMedicalHistoryDB);
  
  // Initialize Access Requests DB
  const storedAccessRequestsDB = loadFromLocalStorage('accessRequestsDB', []);
  mockAccessRequestsDB.length = 0;
  (mockAccessRequestsDB as any).push(...storedAccessRequestsDB);
  
  // Initialize Patient Files DB
  const storedPatientFilesDB = loadFromLocalStorage('patientFilesDB', mockPatientFilesDB);
  mockPatientFilesDB.length = 0;
  mockPatientFilesDB.push(...storedPatientFilesDB);
};

// Persist mock databases to localStorage
export const persistMockDatabases = () => {
  saveToLocalStorage('aadhaarDB', mockAadhaarDB);
  saveToLocalStorage('patientDB', mockPatientDB);
  saveToLocalStorage('doctorDB', mockDoctorDB);
  saveToLocalStorage('medicalHistoryDB', mockMedicalHistoryDB);
  saveToLocalStorage('accessRequestsDB', mockAccessRequestsDB);
  saveToLocalStorage('patientFilesDB', mockPatientFilesDB);
};

// Patient-Doctor access request functions
export const createAccessRequest = (doctorId: string, patientId: string) => {
  const request = {
    id: `REQ${Math.floor(100000 + Math.random() * 900000)}`,
    doctorId,
    patientId,
    status: "pending",
    requestDate: new Date().toISOString()
  };
  
  (mockAccessRequestsDB as any).push(request);
  persistMockDatabases();
  return request;
};

export const updateAccessRequest = (requestId: string, status: "approved" | "rejected") => {
  const requestIndex = (mockAccessRequestsDB as any).findIndex((req: any) => req.id === requestId);
  if (requestIndex === -1) return false;
  
  (mockAccessRequestsDB as any)[requestIndex].status = status;
  (mockAccessRequestsDB as any)[requestIndex].responseDate = new Date().toISOString();
  
  if (status === "approved") {
    const request = (mockAccessRequestsDB as any)[requestIndex];
    const patientIndex = mockPatientDB.findIndex(p => p.patientId === request.patientId);
    
    if (patientIndex !== -1) {
      const patient = mockPatientDB[patientIndex];
      if (!patient.authorizedDoctors) {
        patient.authorizedDoctors = [];
      }
      
      if (!patient.authorizedDoctors.includes(request.doctorId)) {
        patient.authorizedDoctors.push(request.doctorId);
      }
    }
  }
  
  persistMockDatabases();
  return true;
};

export const getAccessRequests = (patientId: string) => {
  return (mockAccessRequestsDB as any).filter((req: any) => req.patientId === patientId && req.status === "pending");
};

export const getPatientsByDoctor = (doctorId: string) => {
  const accessApproved = mockPatientDB.filter(patient => 
    patient.authorizedDoctors && patient.authorizedDoctors.includes(doctorId)
  );
  
  return accessApproved;
};

// Export data to Excel format
export const exportDataToCSV = (dataType: 'patients' | 'doctors') => {
  let data = [];
  let headers = [];
  
  if (dataType === 'patients') {
    data = mockPatientDB;
    headers = ['patientId', 'name', 'email', 'phone', 'aadhaarId', 'authorizedDoctors'];
  } else {
    data = mockDoctorDB;
    headers = ['doctorId', 'name', 'email', 'specialization', 'hospitalAffiliation', 'aadhaarId'];
  }
  
  // Create CSV content
  let csvContent = headers.join(',') + '\n';
  
  data.forEach(item => {
    let row = headers.map(header => {
      let value = item[header as keyof typeof item];
      
      // Handle arrays (like authorizedDoctors)
      if (Array.isArray(value)) {
        value = `"${value.join('; ')}"`;
      }
      
      // Escape commas in string values
      if (typeof value === 'string' && value.includes(',')) {
        value = `"${value}"`;
      }
      
      return value || '';
    });
    
    csvContent += row.join(',') + '\n';
  });
  
  // Create downloadable link
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  return { url, filename: `${dataType}_${new Date().toISOString().split('T')[0]}.csv` };
};

// Call initialize on page load
if (typeof window !== 'undefined') {
  // We'll call this in App.tsx useEffect instead to ensure it's loaded at the right time
  // initMockDatabases();
}
