
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
    authorizedDoctors: ["DOC987654"]
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
      }
    ]
  }
];

// Mock access requests database
export const mockAccessRequestsDB = [];

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
  localStorage.setItem(key, JSON.stringify(data));
};

// Helper function to load data from localStorage
export const loadFromLocalStorage = (key: string, defaultValue: any = null) => {
  const storedData = localStorage.getItem(key);
  if (storedData) {
    try {
      return JSON.parse(storedData);
    } catch (error) {
      console.error(`Error parsing data for key ${key}:`, error);
      return defaultValue;
    }
  }
  return defaultValue;
};

// Initialize mock databases from localStorage or use defaults
export const initMockDatabases = () => {
  // Initialize Aadhaar DB
  const storedAadhaarDB = loadFromLocalStorage('aadhaarDB', mockAadhaarDB);
  mockAadhaarDB.length = 0;
  mockAadhaarDB.push(...storedAadhaarDB);
  
  // Initialize Patient DB
  const storedPatientDB = loadFromLocalStorage('patientDB', mockPatientDB);
  mockPatientDB.length = 0;
  mockPatientDB.push(...storedPatientDB);
  
  // Initialize Doctor DB
  const storedDoctorDB = loadFromLocalStorage('doctorDB', mockDoctorDB);
  mockDoctorDB.length = 0;
  mockDoctorDB.push(...storedDoctorDB);
  
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
  // Initialize mock databases from localStorage or use defaults
  initMockDatabases();
}
