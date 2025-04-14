'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, ChevronDown, Plus, X } from 'lucide-react';
import { loadCSVData } from '@/lib/dataService';
import { Patient } from '@/types';
import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs } from 'firebase/firestore';

interface Patient {
  id: string;
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

function SkeletonCard() {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="h-6 bg-gray-200 rounded w-32 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-24"></div>
        </div>
        <div className="h-6 bg-gray-200 rounded w-16"></div>
      </div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-full"></div>
      </div>
      <div className="mt-4 pt-4 border-t">
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-full mt-2"></div>
      </div>
    </div>
  );
}

export default function PatientsList() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    gender: '',
    bloodType: '',
    medicalCondition: '',
    hospital: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newPatient, setNewPatient] = useState<Partial<Patient>>({
    name: '',
    age: 0,
    gender: '',
    bloodType: '',
    medicalCondition: '',
    dateOfAdmission: new Date().toISOString().split('T')[0],
    doctor: '',
    hospital: '',
    insuranceProvider: '',
    billingAmount: 0,
    roomNumber: '',
    admissionType: '',
    dischargeDate: '',
    medication: '',
    testResults: ''
  });

  useEffect(() => {
    loadPatients();
  }, []);

  useEffect(() => {
    filterPatients();
  }, [searchTerm, filters, patients]);

  const loadPatients = async () => {
    try {
      setLoading(true);
      setError(null);
      // First try to load from Firestore
      const querySnapshot = await getDocs(collection(db, 'patients'));
      const firestorePatients = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Patient[];

      if (firestorePatients.length > 0) {
        setPatients(firestorePatients);
        setFilteredPatients(firestorePatients);
      } else {
        // If no data in Firestore, load from CSV
        const data = await loadCSVData();
        setPatients(data);
        setFilteredPatients(data);
      }
    } catch (error) {
      console.error('Error loading patients:', error);
      setError('Failed to load patient data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const filterPatients = () => {
    let filtered = [...patients];

    if (searchTerm) {
      filtered = filtered.filter(patient =>
        patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.medicalCondition.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.hospital.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filters.gender) {
      filtered = filtered.filter(patient => patient.gender === filters.gender);
    }
    if (filters.bloodType) {
      filtered = filtered.filter(patient => patient.bloodType === filters.bloodType);
    }
    if (filters.medicalCondition) {
      filtered = filtered.filter(patient => patient.medicalCondition === filters.medicalCondition);
    }
    if (filters.hospital) {
      filtered = filtered.filter(patient => patient.hospital === filters.hospital);
    }

    setFilteredPatients(filtered);
  };

  const uniqueValues = (key: keyof Patient) => {
    return Array.from(new Set(patients.map(patient => patient[key])));
  };

  const handleAddPatient = async () => {
    try {
      setLoading(true);
      setError(null);

      // Add patient to Firestore
      const docRef = await addDoc(collection(db, 'patients'), {
        ...newPatient,
        dateOfAdmission: new Date(newPatient.dateOfAdmission).toISOString(),
        createdAt: new Date().toISOString()
      });

      // Create patient object with Firestore ID
      const patientWithId = {
        ...newPatient,
        id: docRef.id,
      } as Patient;
      
      // Add new patient at the beginning of the arrays
      setPatients([patientWithId, ...patients]);
      setFilteredPatients([patientWithId, ...filteredPatients]);
      
      // Reset form and close modal
      setIsAddModalOpen(false);
      setNewPatient({
        name: '',
        age: 0,
        gender: '',
        bloodType: '',
        medicalCondition: '',
        dateOfAdmission: new Date().toISOString().split('T')[0],
        doctor: '',
        hospital: '',
        insuranceProvider: '',
        billingAmount: 0,
        roomNumber: '',
        admissionType: '',
        dischargeDate: '',
        medication: '',
        testResults: ''
      });
    } catch (error) {
      console.error('Error adding patient:', error);
      setError('Failed to add patient. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold text-gray-900">Patient Records</h1>
          <div className="flex gap-4 w-full md:w-auto">
            <div className="relative flex-grow md:flex-grow-0">
              <input
                type="text"
                placeholder="Search patients..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-5 w-5" />
              Add Patient
            </button>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-700"
            >
              <Filter className="h-5 w-5" />
              Filters
              <ChevronDown className={`h-5 w-5 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>

        {/* Add Patient Modal */}
        {isAddModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">Add New Patient</h2>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-200 rounded-lg text-gray-900"
                    value={newPatient.name}
                    onChange={(e) => setNewPatient({ ...newPatient, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                  <input
                    type="number"
                    className="w-full p-2 border border-gray-200 rounded-lg text-gray-900"
                    value={newPatient.age}
                    onChange={(e) => setNewPatient({ ...newPatient, age: parseInt(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                  <select
                    className="w-full p-2 border border-gray-200 rounded-lg text-gray-900"
                    value={newPatient.gender}
                    onChange={(e) => setNewPatient({ ...newPatient, gender: e.target.value })}
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Blood Type</label>
                  <select
                    className="w-full p-2 border border-gray-200 rounded-lg text-gray-900"
                    value={newPatient.bloodType}
                    onChange={(e) => setNewPatient({ ...newPatient, bloodType: e.target.value })}
                  >
                    <option value="">Select Blood Type</option>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Medical Condition</label>
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-200 rounded-lg text-gray-900"
                    value={newPatient.medicalCondition}
                    onChange={(e) => setNewPatient({ ...newPatient, medicalCondition: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Doctor</label>
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-200 rounded-lg text-gray-900"
                    value={newPatient.doctor}
                    onChange={(e) => setNewPatient({ ...newPatient, doctor: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hospital</label>
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-200 rounded-lg text-gray-900"
                    value={newPatient.hospital}
                    onChange={(e) => setNewPatient({ ...newPatient, hospital: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Insurance Provider</label>
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-200 rounded-lg text-gray-900"
                    value={newPatient.insuranceProvider}
                    onChange={(e) => setNewPatient({ ...newPatient, insuranceProvider: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Billing Amount</label>
                  <input
                    type="number"
                    className="w-full p-2 border border-gray-200 rounded-lg text-gray-900"
                    value={newPatient.billingAmount}
                    onChange={(e) => setNewPatient({ ...newPatient, billingAmount: parseFloat(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Room Number</label>
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-200 rounded-lg text-gray-900"
                    value={newPatient.roomNumber}
                    onChange={(e) => setNewPatient({ ...newPatient, roomNumber: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Admission Type</label>
                  <select
                    className="w-full p-2 border border-gray-200 rounded-lg text-gray-900"
                    value={newPatient.admissionType}
                    onChange={(e) => setNewPatient({ ...newPatient, admissionType: e.target.value })}
                  >
                    <option value="">Select Type</option>
                    <option value="Emergency">Emergency</option>
                    <option value="Elective">Elective</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Medication</label>
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-200 rounded-lg text-gray-900"
                    value={newPatient.medication}
                    onChange={(e) => setNewPatient({ ...newPatient, medication: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Test Results</label>
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-200 rounded-lg text-gray-900"
                    value={newPatient.testResults}
                    onChange={(e) => setNewPatient({ ...newPatient, testResults: e.target.value })}
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-4">
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddPatient}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Add Patient
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white p-4 rounded-lg shadow-sm mb-6 border border-gray-200"
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                <select
                  className="w-full p-2 border border-gray-200 rounded-lg text-gray-700 bg-white"
                  value={filters.gender}
                  onChange={(e) => setFilters({ ...filters, gender: e.target.value })}
                >
                  <option value="">All</option>
                  {uniqueValues('gender').map(gender => (
                    <option key={gender} value={gender}>{gender}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Blood Type</label>
                <select
                  className="w-full p-2 border border-gray-200 rounded-lg text-gray-700 bg-white"
                  value={filters.bloodType}
                  onChange={(e) => setFilters({ ...filters, bloodType: e.target.value })}
                >
                  <option value="">All</option>
                  {uniqueValues('bloodType').map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Condition</label>
                <select
                  className="w-full p-2 border border-gray-200 rounded-lg text-gray-700 bg-white"
                  value={filters.medicalCondition}
                  onChange={(e) => setFilters({ ...filters, medicalCondition: e.target.value })}
                >
                  <option value="">All</option>
                  {uniqueValues('medicalCondition').map(condition => (
                    <option key={condition} value={condition}>{condition}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hospital</label>
                <select
                  className="w-full p-2 border border-gray-200 rounded-lg text-gray-700 bg-white"
                  value={filters.hospital}
                  onChange={(e) => setFilters({ ...filters, hospital: e.target.value })}
                >
                  <option value="">All</option>
                  {uniqueValues('hospital').map(hospital => (
                    <option key={hospital} value={hospital}>{hospital}</option>
                  ))}
                </select>
              </div>
            </div>
          </motion.div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <SkeletonCard key={index} />
            ))
          ) : (
            filteredPatients.map((patient) => (
              <motion.div
                key={patient.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-200"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">{patient.name}</h2>
                    <p className="text-sm text-gray-600">{patient.age} years old • {patient.gender}</p>
                  </div>
                  <span className="px-3 py-1 text-sm font-medium rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                    {patient.bloodType}
                  </span>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Condition</span>
                    <span className="font-medium text-gray-900">{patient.medicalCondition}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Hospital</span>
                    <span className="font-medium text-gray-900">{patient.hospital}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Doctor</span>
                    <span className="font-medium text-gray-900">{patient.doctor}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Admission</span>
                    <span className="font-medium text-gray-900">{new Date(patient.dateOfAdmission).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Insurance</span>
                    <span className="font-medium text-gray-900">{patient.insuranceProvider}</span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-gray-600">Billing</span>
                    <span className="font-medium text-gray-900">${patient.billingAmount.toLocaleString()}</span>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {!loading && filteredPatients.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No patients found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  );
} 