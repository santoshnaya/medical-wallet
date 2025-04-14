import { collection, addDoc, getDocs, query, where, doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from './firebase';

export interface MedicalRecord {
  name: string;
  age: number;
  gender: string;
  bloodType: string;
  medicalCondition: string;
  dateOfAdmission: string;
  doctor: string;
  hospital: string;
  insuranceProvider: string;
  billingAmount: number;
  roomNumber: string;
  admissionType: string;
  dischargeDate: string;
  medication: string;
  testResults: string;
}

export const medicalRecordService = {
  async createRecord(record: MedicalRecord) {
    try {
      const docRef = await addDoc(collection(db, 'medicalRecords'), record);
      return docRef.id;
    } catch (error) {
      console.error('Error creating medical record:', error);
      throw error;
    }
  },

  async getRecordById(id: string) {
    try {
      const docRef = doc(db, 'medicalRecords', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as MedicalRecord & { id: string };
      }
      return null;
    } catch (error) {
      console.error('Error getting medical record:', error);
      throw error;
    }
  },

  async getRecordsByPatientName(name: string) {
    try {
      const q = query(collection(db, 'medicalRecords'), where('name', '==', name));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as (MedicalRecord & { id: string })[];
    } catch (error) {
      console.error('Error getting medical records:', error);
      throw error;
    }
  },

  async updateRecord(id: string, updates: Partial<MedicalRecord>) {
    try {
      const docRef = doc(db, 'medicalRecords', id);
      await updateDoc(docRef, updates);
    } catch (error) {
      console.error('Error updating medical record:', error);
      throw error;
    }
  },

  async deleteRecord(id: string) {
    try {
      const docRef = doc(db, 'medicalRecords', id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting medical record:', error);
      throw error;
    }
  }
}; 