'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Clock, AlertCircle, Trash2, Edit2 } from 'lucide-react';
import { firebaseService } from '@/lib/firebaseService';

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  schedule: string[];
  nextRefill: string;
  userId: string;
  created_at: string;
}

export default function MedicationTracker() {
  const router = useRouter();
  const [medications, setMedications] = useState<Medication[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingMedication, setEditingMedication] = useState<Medication | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    dosage: '',
    frequency: '',
    schedule: [''],
    nextRefill: ''
  });

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      loadMedications(userId);
    }
  }, []);

  const loadMedications = async (userId: string) => {
    try {
      setLoading(true);
      const medications = await firebaseService.getMedications(userId);
      setMedications(medications);
    } catch (error) {
      console.error('Error loading medications:', error);
      alert('Failed to load medications. Please try again later.');
      setMedications([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const userId = localStorage.getItem('userId');
    if (!userId) {
      alert('User ID not found. Please log in again.');
      return;
    }

    try {
      const medicationData = {
        ...formData,
        userId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      if (editingMedication) {
        await firebaseService.updateMedication(editingMedication.id, medicationData);
      } else {
        await firebaseService.saveMedication(medicationData);
      }

      // Refresh the medications list
      await loadMedications(userId);

      // Reset form
      setShowForm(false);
      setEditingMedication(null);
      setFormData({
        name: '',
        dosage: '',
        frequency: '',
        schedule: [''],
        nextRefill: ''
      });

      alert('Medication saved successfully!');
    } catch (error) {
      console.error('Error saving medication:', error);
      alert('Failed to save medication. Please try again.');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await firebaseService.deleteMedication(id);
      const userId = localStorage.getItem('userId');
      if (userId) {
        loadMedications(userId);
      }
    } catch (error) {
      console.error('Error deleting medication:', error);
      alert('Failed to delete medication. Please try again.');
    }
  };

  const handleEdit = (medication: Medication) => {
    setEditingMedication(medication);
    setFormData({
      name: medication.name,
      dosage: medication.dosage,
      frequency: medication.frequency,
      schedule: medication.schedule,
      nextRefill: medication.nextRefill
    });
    setShowForm(true);
  };

  const addScheduleTime = () => {
    setFormData({
      ...formData,
      schedule: [...formData.schedule, '']
    });
  };

  const removeScheduleTime = (index: number) => {
    setFormData({
      ...formData,
      schedule: formData.schedule.filter((_, i) => i !== index)
    });
  };

  const updateScheduleTime = (index: number, value: string) => {
    const newSchedule = [...formData.schedule];
    newSchedule[index] = value;
    setFormData({
      ...formData,
      schedule: newSchedule
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Medication Tracker</h1>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="h-5 w-5" />
            Add Medication
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">
              {editingMedication ? 'Edit Medication' : 'Add New Medication'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Medication Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dosage
                </label>
                <input
                  type="text"
                  value={formData.dosage}
                  onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Frequency
                </label>
                <input
                  type="text"
                  value={formData.frequency}
                  onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Schedule Times
                </label>
                <div className="space-y-2">
                  {formData.schedule.map((time, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="time"
                        value={time}
                        onChange={(e) => updateScheduleTime(index, e.target.value)}
                        className="p-2 border border-gray-300 rounded-lg"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => removeScheduleTime(index)}
                        className="p-2 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addScheduleTime}
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
                  >
                    <Plus className="h-5 w-5" />
                    Add Time
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Next Refill Date
                </label>
                <input
                  type="date"
                  value={formData.nextRefill}
                  onChange={(e) => setFormData({ ...formData, nextRefill: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingMedication(null);
                    setFormData({
                      name: '',
                      dosage: '',
                      frequency: '',
                      schedule: [''],
                      nextRefill: ''
                    });
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {editingMedication ? 'Update' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {medications.map((medication) => (
              <div
                key={medication.id}
                className="bg-white rounded-lg shadow-lg p-6"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold">{medication.name}</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(medication)}
                      className="p-2 text-blue-600 hover:text-blue-700"
                    >
                      <Edit2 className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(medication.id)}
                      className="p-2 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <p><span className="font-medium">Dosage:</span> {medication.dosage}</p>
                  <p><span className="font-medium">Frequency:</span> {medication.frequency}</p>
                  <div>
                    <span className="font-medium">Schedule:</span>
                    <ul className="list-disc list-inside mt-1">
                      {medication.schedule.map((time, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gray-500" />
                          {time}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-yellow-500" />
                    <span className="font-medium">Next Refill:</span> {new Date(medication.nextRefill).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 