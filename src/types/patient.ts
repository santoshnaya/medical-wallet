export type Gender = 'Male' | 'Female' | 'Other';
export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
export type MaritalStatus = 'Single' | 'Married' | 'Divorced' | 'Widowed';
export type MedicationFrequency = 'Once Daily' | 'Twice Daily' | 'Three Times Daily' | 'Four Times Daily' | 'As Needed';
export type VisitType = 'Check-up' | 'Emergency' | 'Surgery' | 'Follow-up' | 'Consultation';
export type ReportType = 'Lab' | 'X-ray' | 'MRI' | 'Prescription' | 'CT Scan' | 'Ultrasound' | 'Other';

export interface Address {
  street: string;
  city: string;
  state: string;
  zip: string;
}

export interface EmergencyContact {
  name: string;
  phone: string;
  relationship: string;
}

export interface ContactInfo {
  phone_number: string;
  email: string;
  address: Address;
  emergency_contact: EmergencyContact;
}

export interface Smoking {
  status: boolean;
  frequency: string;
}

export interface Alcohol {
  status: boolean;
  frequency: string;
}

export interface MedicalHistory {
  past_illnesses: string[];
  surgeries: string[];
  allergies: string[];
  chronic_diseases: string[];
  family_medical_history: string;
  smoking: Smoking;
  alcohol: Alcohol;
  disabilities: string[];
  genetic_conditions: string[];
  medical_documents: string[];
}

export interface Medication {
  name: string;
  dosage: string;
  frequency: MedicationFrequency;
  startDate: string;
  endDate?: string;
  notes: string;
}

export interface Appointment {
  doctorName: string;
  department: string;
  hospitalClinic: string;
  visitType: VisitType;
  dateTime: string;
  symptoms: string;
  diagnosis: string;
  prescription: string;
  notes: string;
}

export interface MedicalDocument {
  title: string;
  type: ReportType;
  fileUrl: string;
  date: string;
  description: string;
}

export interface Vaccination {
  name: string;
  doseNumber: number;
  vaccinationDate: string;
  nextDueDate: string;
  certificateUrl: string;
}

export interface Vitals {
  height: number;
  weight: number;
  bloodPressure: string;
  bloodSugar: number;
  heartRate: number;
  oxygenSaturation: number;
  temperature: number;
  bmi: number;
}

export interface Insurance {
  provider: string;
  policyNumber: string;
  coverageDetails: string;
  validFrom: string;
  validTo: string;
  cardUrl: string;
}

export interface EmergencyProfile {
  criticalConditions: string[];
  allergies: string[];
  medications: string[];
  bloodGroup: BloodGroup;
  emergencyContact: string;
}

export interface Patient {
  id: string;
  full_name: string;
  date_of_birth: string;
  gender: string;
  blood_group: string;
  marital_status: string;
  national_id: string;
  profile_photo: string;
  contact_info: ContactInfo;
  medical_history: MedicalHistory;
  uploaded_files: string[];
  updated_at: string;
} 