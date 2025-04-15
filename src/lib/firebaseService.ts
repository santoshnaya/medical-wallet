import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc,
  query,
  where,
  orderBy
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, listAll, deleteObject } from 'firebase/storage';
import { db, storage } from './firebase';

export const firebaseService = {
  // Patient operations
  async getPatients() {
    try {
      const q = query(collection(db, 'patients'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error getting patients:', error);
      throw error;
    }
  },

  async getPatient(patientId: string) {
    try {
      const docRef = doc(db, 'patients', patientId);
      const docSnap = await getDoc(docRef);
      return docSnap.exists() ? docSnap.data() : null;
    } catch (error) {
      console.error('Error getting patient:', error);
      throw error;
    }
  },

  async savePatient(patientId: string, data: any) {
    try {
      const docRef = doc(db, 'patients', patientId);
      await setDoc(docRef, data, { merge: true });
      return true;
    } catch (error) {
      console.error('Error saving patient:', error);
      throw error;
    }
  },

  async updatePatient(patientId: string, updates: any) {
    try {
      const docRef = doc(db, 'patients', patientId);
      await updateDoc(docRef, updates);
      return true;
    } catch (error) {
      console.error('Error updating patient:', error);
      throw error;
    }
  },

  async deletePatient(patientId: string) {
    try {
      const docRef = doc(db, 'patients', patientId);
      await deleteDoc(docRef);
      return true;
    } catch (error) {
      console.error('Error deleting patient:', error);
      throw error;
    }
  },

  // Medication operations
  async getMedications(userId: string) {
    try {
      const q = query(
        collection(db, 'medications'),
        where('userId', '==', userId),
        orderBy('created_at', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error getting medications:', error);
      throw error;
    }
  },

  async saveMedication(data: any) {
    try {
      const docRef = doc(collection(db, 'medications'));
      await setDoc(docRef, { ...data, id: docRef.id });
      return docRef.id;
    } catch (error) {
      console.error('Error saving medication:', error);
      throw error;
    }
  },

  async updateMedication(medicationId: string, updates: any) {
    try {
      const docRef = doc(db, 'medications', medicationId);
      await updateDoc(docRef, updates);
      return true;
    } catch (error) {
      console.error('Error updating medication:', error);
      throw error;
    }
  },

  async deleteMedication(medicationId: string) {
    try {
      const docRef = doc(db, 'medications', medicationId);
      await deleteDoc(docRef);
      return true;
    } catch (error) {
      console.error('Error deleting medication:', error);
      throw error;
    }
  },

  // File operations
  async uploadFile(userId: string, file: File, path: string) {
    try {
      const storageRef = ref(storage, `${userId}/${path}/${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      return { url: downloadURL, path: snapshot.ref.fullPath };
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  },

  async getFileUrl(path: string) {
    try {
      const storageRef = ref(storage, path);
      return await getDownloadURL(storageRef);
    } catch (error) {
      console.error('Error getting file URL:', error);
      throw error;
    }
  },

  async listFiles(userId: string, path: string) {
    try {
      const listRef = ref(storage, `${userId}/${path}`);
      const res = await listAll(listRef);
      return res.items.map(item => item.fullPath);
    } catch (error) {
      console.error('Error listing files:', error);
      throw error;
    }
  },

  async deleteFile(path: string) {
    try {
      const storageRef = ref(storage, path);
      await deleteObject(storageRef);
      return true;
    } catch (error) {
      console.error('Error deleting file:', error);
      throw error;
    }
  }
}; 