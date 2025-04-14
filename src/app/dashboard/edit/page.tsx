'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface MedicalInfo {
  bloodType: string
  allergies: string[]
  conditions: string[]
  medications: string[]
  emergencyContacts: {
    name: string
    relationship: string
    phone: string
  }[]
}

export default function EditMedicalInfoPage() {
  const router = useRouter()
  const [formData, setFormData] = useState<MedicalInfo>({
    bloodType: '',
    allergies: [''],
    conditions: [''],
    medications: [''],
    emergencyContacts: [
      {
        name: '',
        relationship: '',
        phone: '',
      },
    ],
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    // In a real app, this would fetch the user's medical info from your backend
    const fetchMedicalInfo = async () => {
      try {
        // Simulated API call
        const response = await fetch('/api/medical-info')
        const data = await response.json()
        setFormData(data)
      } catch (error) {
        console.error('Error fetching medical info:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchMedicalInfo()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      // In a real app, this would save the medical info to your backend
      const response = await fetch('/api/medical-info', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('Failed to save medical information')
      }

      router.push('/dashboard')
    } catch (error) {
      console.error('Error saving medical info:', error)
      alert('Failed to save medical information. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const addItem = (field: keyof MedicalInfo) => {
    if (Array.isArray(formData[field])) {
      setFormData({
        ...formData,
        [field]: [...(formData[field] as any[]), ''],
      })
    }
  }

  const removeItem = (field: keyof MedicalInfo, index: number) => {
    if (Array.isArray(formData[field])) {
      setFormData({
        ...formData,
        [field]: (formData[field] as any[]).filter((_, i) => i !== index),
      })
    }
  }

  const updateItem = (field: keyof MedicalInfo, index: number, value: string) => {
    if (Array.isArray(formData[field])) {
      const newArray = [...(formData[field] as any[])]
      newArray[index] = value
      setFormData({
        ...formData,
        [field]: newArray,
      })
    }
  }

  const updateContact = (index: number, field: keyof MedicalInfo['emergencyContacts'][0], value: string) => {
    const newContacts = [...formData.emergencyContacts]
    newContacts[index] = {
      ...newContacts[index],
      [field]: value,
    }
    setFormData({
      ...formData,
      emergencyContacts: newContacts,
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your medical information...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Edit Medical Information</h2>
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Blood Type */}
              <div>
                <label htmlFor="bloodType" className="block text-sm font-medium text-gray-700">
                  Blood Type
                </label>
                <select
                  id="bloodType"
                  name="bloodType"
                  value={formData.bloodType}
                  onChange={(e) => setFormData({ ...formData, bloodType: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                >
                  <option value="">Select blood type</option>
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

              {/* Allergies */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Allergies</label>
                <div className="mt-2 space-y-2">
                  {formData.allergies.map((allergy, index) => (
                    <div key={index} className="flex space-x-2">
                      <input
                        type="text"
                        value={allergy}
                        onChange={(e) => updateItem('allergies', index, e.target.value)}
                        className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        placeholder="Enter allergy"
                      />
                      <button
                        type="button"
                        onClick={() => removeItem('allergies', index)}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addItem('allergies')}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
                  >
                    Add Allergy
                  </button>
                </div>
              </div>

              {/* Medical Conditions */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Medical Conditions</label>
                <div className="mt-2 space-y-2">
                  {formData.conditions.map((condition, index) => (
                    <div key={index} className="flex space-x-2">
                      <input
                        type="text"
                        value={condition}
                        onChange={(e) => updateItem('conditions', index, e.target.value)}
                        className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        placeholder="Enter medical condition"
                      />
                      <button
                        type="button"
                        onClick={() => removeItem('conditions', index)}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addItem('conditions')}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
                  >
                    Add Condition
                  </button>
                </div>
              </div>

              {/* Medications */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Current Medications</label>
                <div className="mt-2 space-y-2">
                  {formData.medications.map((medication, index) => (
                    <div key={index} className="flex space-x-2">
                      <input
                        type="text"
                        value={medication}
                        onChange={(e) => updateItem('medications', index, e.target.value)}
                        className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        placeholder="Enter medication"
                      />
                      <button
                        type="button"
                        onClick={() => removeItem('medications', index)}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addItem('medications')}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
                  >
                    Add Medication
                  </button>
                </div>
              </div>

              {/* Emergency Contacts */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Emergency Contacts</label>
                <div className="mt-2 space-y-4">
                  {formData.emergencyContacts.map((contact, index) => (
                    <div key={index} className="space-y-2 p-4 border rounded-lg">
                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Name</label>
                          <input
                            type="text"
                            value={contact.name}
                            onChange={(e) => updateContact(index, 'name', e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Relationship</label>
                          <input
                            type="text"
                            value={contact.relationship}
                            onChange={(e) => updateContact(index, 'relationship', e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                          <input
                            type="tel"
                            value={contact.phone}
                            onChange={(e) => updateContact(index, 'phone', e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                          />
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem('emergencyContacts', index)}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200"
                      >
                        Remove Contact
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        emergencyContacts: [
                          ...formData.emergencyContacts,
                          { name: '', relationship: '', phone: '' },
                        ],
                      })
                    }
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
                  >
                    Add Emergency Contact
                  </button>
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => router.push('/dashboard')}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
} 