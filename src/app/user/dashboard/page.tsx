'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { QrCode, Download, Share2, Upload, FileText, Image, FileCheck } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { jsPDF } from 'jspdf';
import { firebaseService } from '@/lib/firebaseService';

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
  bloodGroup: string;
  maritalStatus: string;
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
    geneticConditions: [],
    medicalDocuments: []
  },
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
    const userId = localStorage.getItem('userId');
    if (userId) {
      loadPatientData(userId);
    } else {
      setLoading(false); // Set loading to false if no userId is found
    }
  }, []);

  const loadPatientData = async (userId: string) => {
    try {
      // Try to get data from local storage first
      const cachedData = localStorage.getItem(`patientData_${userId}`);
      if (cachedData) {
        setPatient(JSON.parse(cachedData));
        setLoading(false);
        return;
      }

      // If no cached data, fetch from Firebase
      const patientData = await firebaseService.getPatient(userId);
      if (patientData) {
        setPatient(patientData);
        // Cache the data
        localStorage.setItem(`patientData_${userId}`, JSON.stringify(patientData));
      } else {
        // If no data exists, use the default patient data
        setPatient(defaultPatient);
      }
    } catch (error) {
      console.error('Error loading patient data:', error);
      // In case of error, use the default patient data
      setPatient(defaultPatient);
    } finally {
      setLoading(false);
    }
  };

  const updatePatientData = (updates: Partial<Patient>) => {
    setPatient(prev => ({
      ...prev,
      ...updates
    }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, fileType: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      setUploadProgress(0);
      const userId = localStorage.getItem('userId');
      if (!userId) return;

      // Upload file to Firebase Storage
      const { url, path } = await firebaseService.uploadFile(userId, file, fileType);

      // Add to patient's uploaded files
      const newFile: UploadedFile = {
        name: file.name,
        url,
        type: fileType,
        uploadedAt: new Date().toISOString()
      };

      await updatePatientData({
        uploadedFiles: [...(patient.uploadedFiles || []), newFile]
      });

      // Update specific fields based on file type
      switch (fileType) {
        case 'profile-photo':
          await updatePatientData({ profilePhoto: url });
          break;
        case 'medical-documents':
          // Add to medical documents array
          const updatedDocuments = [...(patient.medicalHistory?.medicalDocuments || []), {
            title: file.name,
            url,
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
      alert('Failed to upload file. Please try again.');
    } finally {
      setUploading(false);
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
      const userId = localStorage.getItem('userId');
      if (!userId) return;
      
      // Update local state and cache
      localStorage.setItem(`patientData_${userId}`, JSON.stringify(patient));
      
      // Save to Firebase
      await firebaseService.savePatient(userId, patient);

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

          {loading && (
            <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center z-10">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          )}

          <div className="space-y-6 relative">
            {activeTab === 'basic' && renderBasicInfo()}
            {activeTab === 'contact' && renderContactInfo()}
            {activeTab === 'medical' && renderMedicalHistory()}
            {activeTab === 'uploads' && renderUploadSection()}
          </div>

          <div className="mt-8 flex justify-end gap-4">
            <button
              onClick={handleSave}
              disabled={saving || loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save & Generate QR'}
            </button>
            <button
              onClick={generatePDF}
              disabled={loading}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              Generate PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 