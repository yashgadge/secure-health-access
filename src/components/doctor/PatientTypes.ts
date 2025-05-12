
import { Database } from "@/integrations/supabase/types";

// Define the Doctor type
export type Doctor = Database["public"]["Tables"]["doctors"]["Row"] & {
  name: string;
  email: string;
};

// Define the Patient type with all optional fields from the database schema
export type Patient = {
  id: string;
  aadhaar_id: string;
  gender: string | null;
  dob: string | null;
  address?: string | null;
  name: string;
  authorizedDoctors?: string[];
};
