'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Search, Filter, ChevronDown, Eye, Download, FileText, User, X } from 'lucide-react';
import { jsPDF } from 'jspdf';
import { firebaseService } from '@/lib/firebaseService';

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
  uploadedFiles: {
    name: string;
    url: string;
    type: string;
    uploadedAt: string;
  }[];
}

export default function AdminDashboard() {
  const router = useRouter();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [showFilters, setShowFilters] = useState(true);
  const [filters, setFilters] = useState({
    gender: '',
    bloodGroup: '',
    maritalStatus: ''
  });
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    const userRole = localStorage.getItem('userRole');
    
    if (!isAuthenticated || userRole !== 'admin') {
      router.push('/login?role=admin');
      return;
    }

    loadPatients();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = patients.filter(patient =>
        patient.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.nationalId.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredPatients(filtered);
    } else {
      setFilteredPatients(patients);
    }
  }, [searchTerm, patients]);

  const loadPatients = async () => {
    try {
      setLoading(true);
      console.log('Starting to load patients...');

      // Get all patients from Firebase
      const patientsList = await firebaseService.getPatients();
      setPatients(patientsList);
      setFilteredPatients(patientsList);
    } catch (error) {
      console.error('Error loading patients:', error);
      alert('Failed to load patients. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePatient = async (patientId: string) => {
    if (!confirm('Are you sure you want to delete this patient?')) return;

    try {
      await firebaseService.deletePatient(patientId);
      setPatients(prev => prev.filter(p => p.id !== patientId));
      setFilteredPatients(prev => prev.filter(p => p.id !== patientId));
      alert('Patient deleted successfully');
    } catch (error) {
      console.error('Error deleting patient:', error);
      alert('Failed to delete patient. Please try again.');
    }
  };

  const generatePatientPDF = (patient: Patient) => {
    const doc = new jsPDF();
    
    // Add content to PDF
    doc.setFontSize(20);
    doc.text('Patient Medical Record', 20, 20);
    
    // Basic Information
    doc.setFontSize(12);
    doc.text('Basic Information', 20, 30);
    doc.text(`Full Name: ${patient.fullName}`, 20, 40);
    doc.text(`Date of Birth: ${patient.dateOfBirth}`, 20, 50);
    doc.text(`Gender: ${patient.gender}`, 20, 60);
    doc.text(`Blood Group: ${patient.bloodGroup}`, 20, 70);
    doc.text(`Marital Status: ${patient.maritalStatus}`, 20, 80);
    doc.text(`National ID: ${patient.nationalId}`, 20, 90);

    // Contact Information
    doc.text('Contact Information', 20, 110);
    doc.text(`Phone: ${patient.contactInfo.phoneNumber}`, 20, 120);
    doc.text(`Email: ${patient.contactInfo.email}`, 20, 130);
    doc.text(`Address: ${patient.contactInfo.address.street}, ${patient.contactInfo.address.city}, ${patient.contactInfo.address.state} ${patient.contactInfo.address.zip}`, 20, 140);
    doc.text(`Emergency Contact: ${patient.contactInfo.emergencyContact.name} (${patient.contactInfo.emergencyContact.phone})`, 20, 150);

    // Medical History
    doc.text('Medical History', 20, 170);
    doc.text(`Past Illnesses: ${patient.medicalHistory.pastIllnesses.join(', ')}`, 20, 180);
    doc.text(`Allergies: ${patient.medicalHistory.allergies.join(', ')}`, 20, 190);
    doc.text(`Chronic Diseases: ${patient.medicalHistory.chronicDiseases.join(', ')}`, 20, 200);
    doc.text(`Family Medical History: ${patient.medicalHistory.familyMedicalHistory}`, 20, 210);

    // Save the PDF
    doc.save(`${patient.fullName}-medical-record.pdf`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Patient Records</h1>
          <div className="flex items-center gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search patients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              <Filter className="h-5 w-5" />
              Filters
              <ChevronDown className={`h-5 w-5 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <select
                value={filters.gender}
                onChange={(e) => setFilters({ ...filters, gender: e.target.value })}
                className="border border-gray-300 rounded-lg px-4 py-2"
              >
                <option value="">All Genders</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              <select
                value={filters.bloodGroup}
                onChange={(e) => setFilters({ ...filters, bloodGroup: e.target.value })}
                className="border border-gray-300 rounded-lg px-4 py-2"
              >
                <option value="">All Blood Groups</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
              <select
                value={filters.maritalStatus}
                onChange={(e) => setFilters({ ...filters, maritalStatus: e.target.value })}
                className="border border-gray-300 rounded-lg px-4 py-2"
              >
                <option value="">All Marital Status</option>
                <option value="Single">Single</option>
                <option value="Married">Married</option>
                <option value="Divorced">Divorced</option>
                <option value="Widowed">Widowed</option>
              </select>
            </div>
          </div>
        )}

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPatients.map((patient,index) => (
              
              <div
                key={index}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200">
                      {patient.profilePhoto ? (
                        <img
                          src={patient.profilePhoto}
                          alt={patient.fullName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <User className="h-8 w-8" />
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{patient.fullName}</h3>
                      <p className="text-sm text-gray-500">ID: {patient.nationalId}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Gender</p>
                      <p className="font-medium">{patient.gender}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Blood Group</p>
                      <p className="font-medium">{patient.bloodGroup}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Marital Status</p>
                      <p className="font-medium">{patient.maritalStatus}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">National ID</p>
                      <p className="font-medium">{patient.nationalId}</p>
                    </div>
                  </div>
                  <div className="mt-6 flex justify-end gap-2">
                    <button
                      onClick={() => setSelectedPatient(patient)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => generatePatientPDF(patient)}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      Download PDF
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedPatient && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">{selectedPatient.fullName}</h2>
                  <button
                    onClick={() => setSelectedPatient(null)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-500">Date of Birth</p>
                        <p className="font-medium">{selectedPatient.dateOfBirth}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Gender</p>
                        <p className="font-medium">{selectedPatient.gender}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Blood Group</p>
                        <p className="font-medium">{selectedPatient.bloodGroup}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Marital Status</p>
                        <p className="font-medium">{selectedPatient.maritalStatus}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">National ID</p>
                        <p className="font-medium">{selectedPatient.nationalId}</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-500">Phone Number</p>
                        <p className="font-medium">{selectedPatient.contactInfo.phoneNumber}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium">{selectedPatient.contactInfo.email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Address</p>
                        <p className="font-medium">
                          {selectedPatient.contactInfo.address.street}, {selectedPatient.contactInfo.address.city}, {selectedPatient.contactInfo.address.state} {selectedPatient.contactInfo.address.zip}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Emergency Contact</p>
                        <p className="font-medium">
                          {selectedPatient.contactInfo.emergencyContact.name} ({selectedPatient.contactInfo.emergencyContact.relationship})
                        </p>
                        <p className="text-sm text-gray-600">{selectedPatient.contactInfo.emergencyContact.phone}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
} 