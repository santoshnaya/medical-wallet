'use client';

import { useEffect, useState } from 'react';
import { Patient } from '@/types/patient';
import { firebaseService } from '@/lib/firebaseService';

export default function PatientDetails({ params }: { params: { id: string } }) {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        setLoading(true);
        // Fetch the patient data from Firebase
        const patientData = await firebaseService.getPatient(params.id);
        if (patientData) {
          setPatient(patientData as Patient);
        } else {
          setError('Patient not found');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch patient data');
      } finally {
        setLoading(false);
      }
    };

    fetchPatientData();
  }, [params.id]);

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;
  if (!patient) return <div className="p-4">Patient not found</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Patient Details</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
            <div className="space-y-2">
              <p><span className="font-medium">Name:</span> {patient.fullName}</p>
              <p><span className="font-medium">Date of Birth:</span> {patient.dateOfBirth}</p>
              <p><span className="font-medium">Gender:</span> {patient.gender}</p>
              <p><span className="font-medium">Blood Group:</span> {patient.bloodGroup}</p>
              <p><span className="font-medium">Marital Status:</span> {patient.maritalStatus}</p>
              <p><span className="font-medium">National ID:</span> {patient.nationalId}</p>
            </div>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
            <div className="space-y-2">
              <p><span className="font-medium">Phone:</span> {patient.contactInfo.phoneNumber}</p>
              <p><span className="font-medium">Email:</span> {patient.contactInfo.email}</p>
              <p><span className="font-medium">Address:</span> {patient.contactInfo.address.street}, {patient.contactInfo.address.city}, {patient.contactInfo.address.state} {patient.contactInfo.address.zip}</p>
              <p><span className="font-medium">Emergency Contact:</span> {patient.contactInfo.emergencyContact.name} ({patient.contactInfo.emergencyContact.relationship}) - {patient.contactInfo.emergencyContact.phone}</p>
            </div>
          </div>
        </div>
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-4">Medical History</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium mb-2">Past Illnesses</h3>
              <ul className="list-disc pl-5">
                {patient.medicalHistory.pastIllnesses.map((illness, index) => (
                  <li key={index}>{illness}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-2">Surgeries</h3>
              <ul className="list-disc pl-5">
                {patient.medicalHistory.surgeries.map((surgery, index) => (
                  <li key={index}>{surgery.name} ({surgery.date})</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-2">Allergies</h3>
              <ul className="list-disc pl-5">
                {patient.medicalHistory.allergies.map((allergy, index) => (
                  <li key={index}>{allergy}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-2">Chronic Diseases</h3>
              <ul className="list-disc pl-5">
                {patient.medicalHistory.chronicDiseases.map((disease, index) => (
                  <li key={index}>{disease}</li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-6">
            <h3 className="font-medium mb-2">Family Medical History</h3>
            <p>{patient.medicalHistory.familyMedicalHistory}</p>
          </div>
          <div className="mt-6">
            <h3 className="font-medium mb-2">Lifestyle</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p><span className="font-medium">Smoking:</span> {patient.medicalHistory.smoking.status ? 'Yes' : 'No'} {patient.medicalHistory.smoking.frequency && `(${patient.medicalHistory.smoking.frequency})`}</p>
              </div>
              <div>
                <p><span className="font-medium">Alcohol:</span> {patient.medicalHistory.alcohol.status ? 'Yes' : 'No'} {patient.medicalHistory.alcohol.frequency && `(${patient.medicalHistory.alcohol.frequency})`}</p>
              </div>
            </div>
          </div>
          <div className="mt-6">
            <h3 className="font-medium mb-2">Medical Documents</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {patient.medicalHistory.medicalDocuments?.map((doc, index) => (
                <div key={index} className="border rounded p-4">
                  <h4 className="font-medium">{doc.title}</h4>
                  <p className="text-sm text-gray-500">Uploaded: {new Date(doc.uploadedAt).toLocaleDateString()}</p>
                  <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                    View Document
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 