
import { Database } from "@/integrations/supabase/types";

// Define the Doctor type
export type Doctor = Database["public"]["Tables"]["doctors"]["Row"] & {
  name: string;
  email: string;
};

// Define the Patient type with address as optional
export type Patient = Database["public"]["Tables"]["patients"]["Row"] & {
  name: string;
  authorizedDoctors?: string[];
};
