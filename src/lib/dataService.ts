import { Patient } from '@/types';

export async function loadCSVData(): Promise<Patient[]> {
  try {
    const response = await fetch('/healthcare_dataset.csv');
    const csvText = await response.text();
    
    // Split CSV into rows and remove header
    const rows = csvText.split('\n').slice(1);
    
    return rows.map(row => {
      const [
        name,
        age,
        gender,
        bloodType,
        medicalCondition,
        dateOfAdmission,
        doctor,
        hospital,
        insuranceProvider,
        billingAmount,
        roomNumber,
        admissionType,
        dischargeDate,
        medication,
        testResults
      ] = row.split(',');

      return {
        id: Math.random().toString(36).substr(2, 9), // Generate unique ID
        name,
        age: parseInt(age),
        gender,
        bloodType,
        medicalCondition,
        dateOfAdmission,
        doctor,
        hospital,
        insuranceProvider,
        billingAmount: parseFloat(billingAmount),
        roomNumber,
        admissionType,
        dischargeDate,
        medication,
        testResults
      };
    }).filter(patient => patient.name); // Filter out empty rows
  } catch (error) {
    console.error('Error loading CSV data:', error);
    return [];
  }
} 