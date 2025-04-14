'use client';

import { useEffect, useState } from 'react';
import { Patient } from '@/types/patient';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function PatientDetails({ params }: { params: { id: string } }) {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        setLoading(true);
        // Fetch the patient data from Supabase storage
        const { data, error } = await supabase.storage
          .from('new')
          .download(`users/${params.id}/files/${params.id}_person.jpg`);

        if (error) throw error;

        if (data) {
          const text = await data.text();
          const patientData = JSON.parse(text) as Patient;
          setPatient(patientData);
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
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Patient Details</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
            <div className="space-y-2">
              <p><span className="font-medium">Name:</span> {patient.full_name}</p>
              <p><span className="font-medium">Date of Birth:</span> {patient.date_of_birth}</p>
              <p><span className="font-medium">Gender:</span> {patient.gender}</p>
              <p><span className="font-medium">Blood Group:</span> {patient.blood_group}</p>
              <p><span className="font-medium">Marital Status:</span> {patient.marital_status}</p>
              <p><span className="font-medium">National ID:</span> {patient.national_id}</p>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
            <div className="space-y-2">
              <p><span className="font-medium">Phone:</span> {patient.contact_info.phone_number}</p>
              <p><span className="font-medium">Email:</span> {patient.contact_info.email}</p>
              <p><span className="font-medium">Address:</span> {patient.contact_info.address.street}, {patient.contact_info.address.city}, {patient.contact_info.address.state} {patient.contact_info.address.zip}</p>
              <p><span className="font-medium">Emergency Contact:</span> {patient.contact_info.emergency_contact.name} ({patient.contact_info.emergency_contact.phone})</p>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Medical History</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium">Past Illnesses</h3>
              <ul className="list-disc list-inside">
                {patient.medical_history.past_illnesses.map((illness, index) => (
                  <li key={index}>{illness}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-medium">Allergies</h3>
              <ul className="list-disc list-inside">
                {patient.medical_history.allergies.map((allergy, index) => (
                  <li key={index}>{allergy}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-medium">Chronic Diseases</h3>
              <ul className="list-disc list-inside">
                {patient.medical_history.chronic_diseases.map((disease, index) => (
                  <li key={index}>{disease}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-medium">Family Medical History</h3>
              <p>{patient.medical_history.family_medical_history}</p>
            </div>
            <div>
              <h3 className="font-medium">Lifestyle</h3>
              <p>Smoking: {patient.medical_history.smoking.status ? 'Yes' : 'No'}</p>
              <p>Alcohol: {patient.medical_history.alcohol.status ? 'Yes' : 'No'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 