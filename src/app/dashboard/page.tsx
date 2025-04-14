'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { QRCodeSVG } from 'qrcode.react'

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
  emergencyCode: string
}

export default function DashboardPage() {
  const [medicalInfo, setMedicalInfo] = useState<MedicalInfo | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // In a real app, this would fetch the user's medical info from your backend
    const fetchMedicalInfo = async () => {
      try {
        // Simulated API call
        const response = await fetch('/api/medical-info')
        const data = await response.json()
        setMedicalInfo(data)
      } catch (error) {
        console.error('Error fetching medical info:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchMedicalInfo()
  }, [])

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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Medical Information Dashboard</h1>
            <Link
              href="/dashboard/edit"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              Edit Information
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {/* Emergency Access Card */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900">Emergency Access</h3>
                <div className="mt-4">
                  <p className="text-sm text-gray-500">
                    Share this QR code with emergency responders or healthcare providers to access your critical medical information.
                  </p>
                  <div className="mt-4 flex justify-center">
                    {medicalInfo?.emergencyCode && (
                      <QRCodeSVG
                        value={`${window.location.origin}/emergency/view/${medicalInfo.emergencyCode}`}
                        size={200}
                      />
                    )}
                  </div>
                  <div className="mt-4">
                    <p className="text-sm text-gray-500">
                      Emergency Code: <span className="font-mono">{medicalInfo?.emergencyCode}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Medical Information Card */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900">Your Medical Information</h3>
                <div className="mt-4 space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Blood Type</h4>
                    <p className="mt-1 text-sm text-gray-900">{medicalInfo?.bloodType}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Allergies</h4>
                    <p className="mt-1 text-sm text-gray-900">
                      {medicalInfo?.allergies.join(', ') || 'None'}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Medical Conditions</h4>
                    <p className="mt-1 text-sm text-gray-900">
                      {medicalInfo?.conditions.join(', ') || 'None'}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Current Medications</h4>
                    <p className="mt-1 text-sm text-gray-900">
                      {medicalInfo?.medications.join(', ') || 'None'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Emergency Contacts Card */}
            <div className="bg-white overflow-hidden shadow rounded-lg sm:col-span-2">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900">Emergency Contacts</h3>
                <div className="mt-4">
                  <ul className="divide-y divide-gray-200">
                    {medicalInfo?.emergencyContacts.map((contact, index) => (
                      <li key={index} className="py-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{contact.name}</p>
                            <p className="text-sm text-gray-500">{contact.relationship}</p>
                          </div>
                          <a
                            href={`tel:${contact.phone}`}
                            className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
                          >
                            Call
                          </a>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 