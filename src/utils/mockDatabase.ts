
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
  
  return newUserData;
};
