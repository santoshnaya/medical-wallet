import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from './firebase';

export const storageService = {
  async uploadFile(file: File, userId: string, path: string) {
    try {
      const storageRef = ref(storage, `users/${userId}/${path}/${file.name}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      return {
        url: downloadURL,
        name: file.name,
        path: storageRef.fullPath
      };
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  },

  async deleteFile(filePath: string) {
    try {
      const fileRef = ref(storage, filePath);
      await deleteObject(fileRef);
    } catch (error) {
      console.error('Error deleting file:', error);
      throw error;
    }
  }
}; 