import { create } from 'zustand';
import { User } from 'firebase/auth';

interface UserState {
  user: User | null;
  setUser: (user: User | null) => void;
}

interface MedicalState {
  medicalHistory: any[];
  medications: any[];
  appointments: any[];
  reports: any[];
  emergencyProfile: any;
  setMedicalHistory: (history: any[]) => void;
  setMedications: (meds: any[]) => void;
  setAppointments: (appts: any[]) => void;
  setReports: (reports: any[]) => void;
  setEmergencyProfile: (profile: any) => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));

export const useMedicalStore = create<MedicalState>((set) => ({
  medicalHistory: [],
  medications: [],
  appointments: [],
  reports: [],
  emergencyProfile: null,
  setMedicalHistory: (history) => set({ medicalHistory: history }),
  setMedications: (meds) => set({ medications: meds }),
  setAppointments: (appts) => set({ appointments: appts }),
  setReports: (reports) => set({ reports: reports }),
  setEmergencyProfile: (profile) => set({ emergencyProfile: profile }),
})); 