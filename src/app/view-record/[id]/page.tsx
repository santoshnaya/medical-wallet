'use client';

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useParams } from 'next/navigation';

export default function ViewRecord() {
  const { id } = useParams();
  const [record, setRecord] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecord = async () => {
      try {
        const docRef = doc(db, 'medicalRecords', id as string);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setRecord(docSnap.data());
        } else {
          setError('Record not found');
        }
      } catch (err) {
        setError('Failed to fetch record');
        console.error('Error fetching record:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchRecord();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading record...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  if (!record) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-2xl font-bold mb-6">Medical Record</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-semibold mb-4">Personal Information</h2>
              <div className="space-y-2">
                <p><span className="font-medium">Name:</span> {record.name}</p>
                <p><span className="font-medium">Age:</span> {record.age}</p>
                <p><span className="font-medium">Gender:</span> {record.gender}</p>
                <p><span className="font-medium">Blood Group:</span> {record.bloodGroup}</p>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-4">Medical Information</h2>
              <div className="space-y-2">
                <p><span className="font-medium">Allergies:</span> {record.allergies.join(', ')}</p>
                <p><span className="font-medium">Medications:</span> {record.medications.join(', ')}</p>
                <p><span className="font-medium">Conditions:</span> {record.conditions.join(', ')}</p>
              </div>
            </div>

            <div className="md:col-span-2">
              <h2 className="text-lg font-semibold mb-4">Emergency Contact</h2>
              <div className="space-y-2">
                <p><span className="font-medium">Name:</span> {record.emergencyContact.name}</p>
                <p><span className="font-medium">Phone:</span> {record.emergencyContact.phone}</p>
                <p><span className="font-medium">Relation:</span> {record.emergencyContact.relation}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 