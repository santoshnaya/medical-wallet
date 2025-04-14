'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { QrCode, Download, Share2, Upload, FileText, Image, FileCheck } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { createClient } from '@supabase/supabase-js';
import { jsPDF } from 'jspdf';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface UploadedFile {
  name: string;
  url: string;
  type: string;
  uploadedAt: string;
}

interface Patient {
  id: string;
  fullName: string;
  dateOfBirth: string;
  gender: 'Male' | 'Female' | 'Other';
  bloodGroup: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  maritalStatus: 'Single' | 'Married' | 'Divorced' | 'Widowed';
  nationalId: string;
  profilePhoto: string;
  contactInfo: {
    phoneNumber: string;
    email: string;
    address: {
      street: string;
      city: string;
      state: string;
      zip: string;
    };
    emergencyContact: {
      name: string;
      phone: string;
      relationship: string;
    };
  };
  medicalHistory: {
    pastIllnesses: string[];
    surgeries: { name: string; date: string }[];
    allergies: string[];
    chronicDiseases: string[];
    familyMedicalHistory: string;
    smoking: { status: boolean; frequency: string };
    alcohol: { status: boolean; frequency: string };
    disabilities: string[];
    geneticConditions: string[];
    medicalDocuments?: { title: string; url: string; uploadedAt: string }[];
  };
  created_at: string;
  uploadedFiles: UploadedFile[];
}

const defaultPatient: Patient = {
  id: '',
  fullName: '',
  dateOfBirth: '',
  gender: 'Male',
  bloodGroup: 'A+',
  maritalStatus: 'Single',
  nationalId: '',
  profilePhoto: '',
  contactInfo: {
    phoneNumber: '',
    email: '',
    address: {
      street: '',
      city: '',
      state: '',
      zip: ''
    },
    emergencyContact: {
      name: '',
      phone: '',
      relationship: ''
    }
  },
  medicalHistory: {
    pastIllnesses: [],
    surgeries: [],
    allergies: [],
    chronicDiseases: [],
    familyMedicalHistory: '',
    smoking: { status: false, frequency: '' },
    alcohol: { status: false, frequency: '' },
    disabilities: [],
    geneticConditions: []
  },
  created_at: new Date().toISOString(),
  uploadedFiles: []
};

export default function UserDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('basic');
  const [patient, setPatient] = useState<Patient>(defaultPatient);
  const [loading, setLoading] = useState(true);
  const [showQR, setShowQR] = useState(false);
  const [saving, setSaving] = useState(false);
  const [pdfUrl, setPdfUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    const userRole = localStorage.getItem('userRole');
    
    if (!isAuthenticated || userRole !== 'user') {
      router.push('/login?role=user');
      return;
    }

    loadPatientData();
  }, []);

  const loadPatientData = async () => {
    try {
      const userId = localStorage.getItem('userId') || 'demo-user';
      
      // Check if we have cached data
      const cachedData = localStorage.getItem(`patientData_${userId}`);
      if (cachedData) {
        setPatient(JSON.parse(cachedData));
      }

      // Try to get fresh data from Supabase
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        throw new Error(`Failed to fetch patient data: ${error.message}`);
      }

      if (data) {
        setPatient(data as Patient);
        localStorage.setItem(`patientData_${userId}`, JSON.stringify(data));
      } else {
        // Create new patient if not exists
        const newPatient = { ...defaultPatient, id: userId };
        const { error: insertError } = await supabase
          .from('patients')
          .insert([newPatient]);

        if (insertError) {
          throw new Error(`Failed to create patient: ${insertError.message}`);
        }

        setPatient(newPatient);
        localStorage.setItem(`patientData_${userId}`, JSON.stringify(newPatient));
      }
    } catch (error) {
      // If offline, try to load from cache
      const userId = localStorage.getItem('userId') || 'demo-user';
      const cachedData = localStorage.getItem(`patientData_${userId}`);
      if (cachedData) {
        setPatient(JSON.parse(cachedData));
      } else {
        // If no cached data, set default patient
        setPatient({ ...defaultPatient, id: userId });
      }
    } finally {
      setLoading(false);
    }
  };

  const updatePatientData = async (updates: Partial<Patient>) => {
    try {
      const userId = localStorage.getItem('userId') || 'demo-user';
      
      // Update local state first
      setPatient(prev => {
        const updated = { ...prev, ...updates };
        localStorage.setItem(`patientData_${userId}`, JSON.stringify(updated));
        return updated;
      });

      // Try to update Supabase
      const { error } = await supabase
        .from('patients')
        .update(updates)
        .eq('id', userId);

      if (error) {
        throw new Error(`Failed to update patient data: ${error.message}`);
      }
    } catch (error) {
      // If offline, the data is already cached in localStorage
      // We can silently fail here since we've already updated the local state
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, fileType: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      setUploadProgress(0);
      const userId = localStorage.getItem('userId') || 'demo-user';
      const fileExt = file.name.split('.').pop();
      const timestamp = new Date().getTime();
      const fileName = `${userId}/${fileType}/${timestamp}-${file.name}`;
      const filePath = `uploads/${fileName}`;

      // Upload file to Supabase Storage
      const { error: uploadError, data } = await supabase.storage
        .from('new')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('new')
        .getPublicUrl(filePath);

      // Add to patient's uploaded files
      const newFile: UploadedFile = {
        name: file.name,
        url: publicUrl,
        type: fileType,
        uploadedAt: new Date().toISOString()
      };

      await updatePatientData({
        uploadedFiles: [...(patient.uploadedFiles || []), newFile]
      });

      // Update specific fields based on file type
      switch (fileType) {
        case 'profile-photo':
          await updatePatientData({ profilePhoto: publicUrl });
          break;
        case 'medical-documents':
          // Add to medical documents array
          const updatedDocuments = [...(patient.medicalHistory?.medicalDocuments || []), {
            title: file.name,
            url: publicUrl,
            uploadedAt: new Date().toISOString()
          }];
          await updatePatientData({
            medicalHistory: {
              ...patient.medicalHistory,
              medicalDocuments: updatedDocuments
            }
          });
          break;
      }

    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const generatePDF = async () => {
    const doc = new jsPDF();
    
    // Add content to PDF
    doc.setFontSize(20);
    doc.text('Medical Wallet', 20, 20);
    
    doc.setFontSize(12);
    doc.text('Basic Information', 20, 30);
    doc.text(`Full Name: ${patient.fullName}`, 20, 40);
    doc.text(`Date of Birth: ${patient.dateOfBirth}`, 20, 50);
    doc.text(`Gender: ${patient.gender}`, 20, 60);
    doc.text(`Blood Group: ${patient.bloodGroup}`, 20, 70);
    doc.text(`Marital Status: ${patient.maritalStatus}`, 20, 80);
    doc.text(`National ID: ${patient.nationalId}`, 20, 90);

    // Add more sections...
    
    const pdfBlob = doc.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);
    setPdfUrl(pdfUrl);
  };

  const generateQRData = () => {
    return JSON.stringify({
      basicInfo: {
        fullName: patient.fullName,
        dateOfBirth: patient.dateOfBirth,
        gender: patient.gender,
        bloodGroup: patient.bloodGroup,
        maritalStatus: patient.maritalStatus,
        nationalId: patient.nationalId,
        profilePhoto: patient.profilePhoto
      },
      contactInfo: patient.contactInfo,
      medicalHistory: patient.medicalHistory
    });
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const userId = localStorage.getItem('userId') || 'demo-user';
      const timestamp = new Date().getTime();
      
      // Update local state and cache
      localStorage.setItem(`patientData_${userId}`, JSON.stringify(patient));
      
      // Prepare data for Supabase storage
      const patientData = {
        id: userId,
        full_name: patient.fullName || '',
        date_of_birth: patient.dateOfBirth || '',
        gender: patient.gender || 'Male',
        blood_group: patient.bloodGroup || 'A+',
        marital_status: patient.maritalStatus || 'Single',
        national_id: patient.nationalId || '',
        profile_photo: patient.profilePhoto || '',
        contact_info: {
          phone_number: patient.contactInfo.phoneNumber || '',
          email: patient.contactInfo.email || '',
          address: {
            street: patient.contactInfo.address.street || '',
            city: patient.contactInfo.address.city || '',
            state: patient.contactInfo.address.state || '',
            zip: patient.contactInfo.address.zip || ''
          },
          emergency_contact: {
            name: patient.contactInfo.emergencyContact.name || '',
            phone: patient.contactInfo.emergencyContact.phone || '',
            relationship: patient.contactInfo.emergencyContact.relationship || ''
          }
        },
        medical_history: {
          past_illnesses: patient.medicalHistory.pastIllnesses || [],
          surgeries: patient.medicalHistory.surgeries || [],
          allergies: patient.medicalHistory.allergies || [],
          chronic_diseases: patient.medicalHistory.chronicDiseases || [],
          family_medical_history: patient.medicalHistory.familyMedicalHistory || '',
          smoking: patient.medicalHistory.smoking || { status: false, frequency: '' },
          alcohol: patient.medicalHistory.alcohol || { status: false, frequency: '' },
          disabilities: patient.medicalHistory.disabilities || [],
          genetic_conditions: patient.medicalHistory.geneticConditions || [],
          medical_documents: patient.medicalHistory.medicalDocuments || []
        },
        uploaded_files: patient.uploadedFiles || [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Convert patient data to JSON string
      const patientDataString = JSON.stringify(patientData);
      
      // Create a blob from the JSON string
      const blob = new Blob([patientDataString], { type: 'application/json' });
      
      // Upload the JSON file to Supabase storage with a unique timestamp
      const { error: storageError } = await supabase.storage
        .from('new')
        .upload(`users/${userId}/${timestamp}_data.json`, blob, {
          contentType: 'application/json',
          upsert: true
        });

      if (storageError) {
        console.error('Storage error:', storageError);
        alert('Failed to save data. Please try again.');
        return;
      }

      // Save uploaded files to Supabase storage
      if (patient.uploadedFiles && patient.uploadedFiles.length > 0) {
        for (const file of patient.uploadedFiles) {
          try {
            // Check if file is already in storage
            const { data: existingFile } = await supabase.storage
              .from('new')
              .list(`users/${userId}/files`);

            if (!existingFile?.some(f => f.name === file.name)) {
              // Upload file to storage
              const response = await fetch(file.url);
              const blob = await response.blob();
              
              const { error: fileError } = await supabase.storage
                .from('new')
                .upload(`users/${userId}/files/${timestamp}_${file.name}`, blob);

              if (fileError) {
                console.error(`Failed to upload file ${file.name}:`, fileError);
                alert(`Failed to upload file ${file.name}. Please try again.`);
              }
            }
          } catch (error) {
            console.error(`Error processing file ${file.name}:`, error);
            alert(`Error processing file ${file.name}. Please try again.`);
          }
        }
      }

      setShowQR(true);
    } catch (error) {
      console.error('Error saving data:', error);
      alert('An error occurred while saving. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const renderBasicInfo = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Full Name</label>
          <input
            type="text"
            value={patient.fullName}
            onChange={(e) => updatePatientData({ fullName: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
          <input
            type="date"
            value={patient.dateOfBirth}
            onChange={(e) => updatePatientData({ dateOfBirth: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Gender</label>
          <select
            value={patient.gender}
            onChange={(e) => updatePatientData({ gender: e.target.value as Patient['gender'] })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Blood Group</label>
          <select
            value={patient.bloodGroup}
            onChange={(e) => updatePatientData({ bloodGroup: e.target.value as Patient['bloodGroup'] })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
          >
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Marital Status</label>
          <select
            value={patient.maritalStatus}
            onChange={(e) => updatePatientData({ maritalStatus: e.target.value as Patient['maritalStatus'] })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
          >
            <option value="Single">Single</option>
            <option value="Married">Married</option>
            <option value="Divorced">Divorced</option>
            <option value="Widowed">Widowed</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">National ID</label>
          <input
            type="text"
            value={patient.nationalId}
            onChange={(e) => updatePatientData({ nationalId: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Profile Photo</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleFileUpload(e, 'profile-photo')}
            className="mt-1 block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
          />
        </div>
      </div>
    </div>
  );

  const renderContactInfo = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Phone Number</label>
          <input
            type="tel"
            value={patient.contactInfo.phoneNumber}
            onChange={(e) => updatePatientData({
              contactInfo: { ...patient.contactInfo, phoneNumber: e.target.value }
            })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            value={patient.contactInfo.email}
            onChange={(e) => updatePatientData({
              contactInfo: { ...patient.contactInfo, email: e.target.value }
            })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Street Address</label>
          <input
            type="text"
            value={patient.contactInfo.address.street}
            onChange={(e) => updatePatientData({
              contactInfo: {
                ...patient.contactInfo,
                address: { ...patient.contactInfo.address, street: e.target.value }
              }
            })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">City</label>
          <input
            type="text"
            value={patient.contactInfo.address.city}
            onChange={(e) => updatePatientData({
              contactInfo: {
                ...patient.contactInfo,
                address: { ...patient.contactInfo.address, city: e.target.value }
              }
            })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">State</label>
          <input
            type="text"
            value={patient.contactInfo.address.state}
            onChange={(e) => updatePatientData({
              contactInfo: {
                ...patient.contactInfo,
                address: { ...patient.contactInfo.address, state: e.target.value }
              }
            })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">ZIP Code</label>
          <input
            type="text"
            value={patient.contactInfo.address.zip}
            onChange={(e) => updatePatientData({
              contactInfo: {
                ...patient.contactInfo,
                address: { ...patient.contactInfo.address, zip: e.target.value }
              }
            })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Emergency Contact Name</label>
          <input
            type="text"
            value={patient.contactInfo.emergencyContact.name}
            onChange={(e) => updatePatientData({
              contactInfo: {
                ...patient.contactInfo,
                emergencyContact: { ...patient.contactInfo.emergencyContact, name: e.target.value }
              }
            })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Emergency Contact Phone</label>
          <input
            type="tel"
            value={patient.contactInfo.emergencyContact.phone}
            onChange={(e) => updatePatientData({
              contactInfo: {
                ...patient.contactInfo,
                emergencyContact: { ...patient.contactInfo.emergencyContact, phone: e.target.value }
              }
            })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Emergency Contact Relationship</label>
          <input
            type="text"
            value={patient.contactInfo.emergencyContact.relationship}
            onChange={(e) => updatePatientData({
              contactInfo: {
                ...patient.contactInfo,
                emergencyContact: { ...patient.contactInfo.emergencyContact, relationship: e.target.value }
              }
            })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
          />
        </div>
      </div>
    </div>
  );

  const renderMedicalHistory = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Past Illnesses</label>
          <input
            type="text"
            value={patient.medicalHistory.pastIllnesses.join(', ')}
            onChange={(e) => updatePatientData({
              medicalHistory: {
                ...patient.medicalHistory,
                pastIllnesses: e.target.value.split(',').map(item => item.trim())
              }
            })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
            placeholder="Enter illnesses separated by commas"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Allergies</label>
          <input
            type="text"
            value={patient.medicalHistory.allergies.join(', ')}
            onChange={(e) => updatePatientData({
              medicalHistory: {
                ...patient.medicalHistory,
                allergies: e.target.value.split(',').map(item => item.trim())
              }
            })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
            placeholder="Enter allergies separated by commas"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Chronic Diseases</label>
          <input
            type="text"
            value={patient.medicalHistory.chronicDiseases.join(', ')}
            onChange={(e) => updatePatientData({
              medicalHistory: {
                ...patient.medicalHistory,
                chronicDiseases: e.target.value.split(',').map(item => item.trim())
              }
            })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
            placeholder="Enter chronic diseases separated by commas"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Family Medical History</label>
          <textarea
            value={patient.medicalHistory.familyMedicalHistory}
            onChange={(e) => updatePatientData({
              medicalHistory: {
                ...patient.medicalHistory,
                familyMedicalHistory: e.target.value
              }
            })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
            rows={3}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Smoking</label>
          <div className="flex gap-4 mt-1">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                checked={patient.medicalHistory.smoking.status}
                onChange={(e) => updatePatientData({
                  medicalHistory: {
                    ...patient.medicalHistory,
                    smoking: { ...patient.medicalHistory.smoking, status: e.target.checked }
                  }
                })}
                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              <span className="ml-2">Yes</span>
            </label>
            <input
              type="text"
              value={patient.medicalHistory.smoking.frequency}
              onChange={(e) => updatePatientData({
                medicalHistory: {
                  ...patient.medicalHistory,
                  smoking: { ...patient.medicalHistory.smoking, frequency: e.target.value }
                }
              })}
              className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
              placeholder="Frequency"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Alcohol</label>
          <div className="flex gap-4 mt-1">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                checked={patient.medicalHistory.alcohol.status}
                onChange={(e) => updatePatientData({
                  medicalHistory: {
                    ...patient.medicalHistory,
                    alcohol: { ...patient.medicalHistory.alcohol, status: e.target.checked }
                  }
                })}
                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              <span className="ml-2">Yes</span>
            </label>
            <input
              type="text"
              value={patient.medicalHistory.alcohol.frequency}
              onChange={(e) => updatePatientData({
                medicalHistory: {
                  ...patient.medicalHistory,
                  alcohol: { ...patient.medicalHistory.alcohol, frequency: e.target.value }
                }
              })}
              className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
              placeholder="Frequency"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Disabilities</label>
          <input
            type="text"
            value={patient.medicalHistory.disabilities.join(', ')}
            onChange={(e) => updatePatientData({
              medicalHistory: {
                ...patient.medicalHistory,
                disabilities: e.target.value.split(',').map(item => item.trim())
              }
            })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
            placeholder="Enter disabilities separated by commas"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Genetic Conditions</label>
          <input
            type="text"
            value={patient.medicalHistory.geneticConditions.join(', ')}
            onChange={(e) => updatePatientData({
              medicalHistory: {
                ...patient.medicalHistory,
                geneticConditions: e.target.value.split(',').map(item => item.trim())
              }
            })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
            placeholder="Enter genetic conditions separated by commas"
          />
        </div>
      </div>
    </div>
  );

  const renderUploadSection = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Upload Files</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Profile Photo Upload */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
          <input
            type="file"
            id="profile-photo"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFileUpload(e, 'profile-photo')}
          />
          <label
            htmlFor="profile-photo"
            className="cursor-pointer flex flex-col items-center"
          >
            <Image className="h-8 w-8 text-gray-400 mb-2" />
            <span className="text-sm text-gray-600">Profile Photo</span>
          </label>
        </div>

        {/* Medical Documents Upload */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
          <input
            type="file"
            id="medical-documents"
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            className="hidden"
            onChange={(e) => handleFileUpload(e, 'medical-documents')}
          />
          <label
            htmlFor="medical-documents"
            className="cursor-pointer flex flex-col items-center"
          >
            <FileCheck className="h-8 w-8 text-gray-400 mb-2" />
            <span className="text-sm text-gray-600">Medical Documents</span>
          </label>
        </div>

        {/* General Files Upload */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
          <input
            type="file"
            id="general-files"
            accept="*"
            className="hidden"
            onChange={(e) => handleFileUpload(e, 'general')}
          />
          <label
            htmlFor="general-files"
            className="cursor-pointer flex flex-col items-center"
          >
            <FileText className="h-8 w-8 text-gray-400 mb-2" />
            <span className="text-sm text-gray-600">Other Files</span>
          </label>
        </div>
      </div>

      {/* Upload Progress */}
      {uploading && (
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600 mt-2">Uploading... {uploadProgress}%</p>
        </div>
      )}

      {/* Uploaded Files List */}
      {patient.uploadedFiles && patient.uploadedFiles.length > 0 && (
        <div className="mt-6">
          <h4 className="text-md font-medium text-gray-900 mb-2">Uploaded Files</h4>
          <div className="space-y-2">
            {patient.uploadedFiles.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  {file.type === 'profile-photo' ? (
                    <Image className="h-5 w-5 text-gray-400" />
                  ) : file.type === 'medical-documents' ? (
                    <FileCheck className="h-5 w-5 text-gray-400" />
                  ) : (
                    <FileText className="h-5 w-5 text-gray-400" />
                  )}
                  <span className="text-sm text-gray-900">{file.name}</span>
                </div>
                <a
                  href={file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  View
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Medical Wallet</h1>
          {showQR && (
            <div className="flex gap-4">
              <button
                onClick={() => setShowQR(false)}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                <QrCode className="h-5 w-5" />
                Hide QR
              </button>
              {pdfUrl && (
                <>
                  <a
                    href={pdfUrl}
                    download="medical-wallet.pdf"
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    <Download className="h-5 w-5" />
                    Download PDF
                  </a>
                  <button
                    onClick={() => navigator.share({ url: pdfUrl })}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                  >
                    <Share2 className="h-5 w-5" />
                    Share
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        {showQR && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white p-6 rounded-lg shadow-lg mb-8 flex flex-col items-center"
          >
            <QRCodeSVG
              value={generateQRData()}
              size={200}
              level="H"
              includeMargin={true}
            />
            <p className="mt-4 text-gray-600">Scan this QR code to access medical information</p>
          </motion.div>
        )}

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex flex-wrap gap-4 mb-6">
            <button
              onClick={() => setActiveTab('basic')}
              className={`px-4 py-2 rounded-lg ${
                activeTab === 'basic' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
              }`}
            >
              Basic Information
            </button>
            <button
              onClick={() => setActiveTab('contact')}
              className={`px-4 py-2 rounded-lg ${
                activeTab === 'contact' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
              }`}
            >
              Contact Information
            </button>
            <button
              onClick={() => setActiveTab('medical')}
              className={`px-4 py-2 rounded-lg ${
                activeTab === 'medical' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
              }`}
            >
              Medical History
            </button>
            <button
              onClick={() => setActiveTab('uploads')}
              className={`px-4 py-2 rounded-lg ${
                activeTab === 'uploads' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
              }`}
            >
              Upload Files
            </button>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            </div>
          ) : (
            <div className="space-y-6">
              {activeTab === 'basic' && renderBasicInfo()}
              {activeTab === 'contact' && renderContactInfo()}
              {activeTab === 'medical' && renderMedicalHistory()}
              {activeTab === 'uploads' && renderUploadSection()}
            </div>
          )}

          <div className="mt-8 flex justify-end gap-4">
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save & Generate QR'}
            </button>
            <button
              onClick={generatePDF}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Generate PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 