
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
