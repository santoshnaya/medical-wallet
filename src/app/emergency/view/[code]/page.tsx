'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

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

export default function EmergencyViewPage() {
  const { code } = useParams()
  const [medicalInfo, setMedicalInfo] = useState<MedicalInfo | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // In a real app, this would fetch the medical info from your backend
    // using the emergency code
    const fetchMedicalInfo = async () => {
      try {
        // Simulated API call
        const response = await fetch(`/api/emergency/${code}`)
        const data = await response.json()
        setMedicalInfo(data)
      } catch (error) {
        console.error('Error fetching medical info:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchMedicalInfo()
  }, [code])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading medical information...</p>
        </div>
      </div>
    )
  }

  if (!medicalInfo) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Invalid Emergency Code</h2>
          <p className="mt-2 text-gray-600">The emergency code you entered is invalid or has expired.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6 bg-red-600">
            <h2 className="text-xl font-bold text-white">Emergency Medical Information</h2>
          </div>
          
          <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
            <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Blood Type</dt>
                <dd className="mt-1 text-sm text-gray-900">{medicalInfo.bloodType}</dd>
              </div>
              
              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-gray-500">Allergies</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {medicalInfo.allergies.join(', ') || 'None'}
                </dd>
              </div>
              
              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-gray-500">Medical Conditions</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {medicalInfo.conditions.join(', ') || 'None'}
                </dd>
              </div>
              
              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-gray-500">Current Medications</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {medicalInfo.medications.join(', ') || 'None'}
                </dd>
              </div>
              
              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-gray-500">Emergency Contacts</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  <ul className="divide-y divide-gray-200">
                    {medicalInfo.emergencyContacts.map((contact, index) => (
                      <li key={index} className="py-2">
                        <div className="flex items-center space-x-4">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {contact.name}
                            </p>
                            <p className="text-sm text-gray-500 truncate">
                              {contact.relationship}
                            </p>
                          </div>
                          <div>
                            <a
                              href={`tel:${contact.phone}`}
                              className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200"
                            >
                              Call
                            </a>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  )
} 