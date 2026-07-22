export interface BookingService {
  id: string;
  name: string;
  category: string;
  description: string;
  durationMinutes: number;
  price: number;
  icon: string;
}

export interface BookingLocation {
  id: string;
  name: string;
  addressLine: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  lat: number;
  lng: number;
  hoursNote: string;
}

export interface BookingDoctor {
  id: string;
  firstName: string;
  lastName: string;
  credentials: string;
  specialty: string;
  bio: string;
  photoColor: string;
  yearsExperience: number;
  locationIds: string[];
}

export interface PatientSummary {
  patientId: string;
  firstName: string;
  lastName: string;
  email: string;
}
