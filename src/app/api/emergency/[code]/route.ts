import { NextResponse } from 'next/server'

// This is a mock database - in a real app, you'd use a proper database
const mockMedicalInfo = {
  '123456': {
    bloodType: 'O+',
    allergies: ['Penicillin', 'Peanuts'],
    conditions: ['Type 2 Diabetes', 'Hypertension'],
    medications: ['Metformin', 'Lisinopril'],
    emergencyContacts: [
      {
        name: 'John Doe',
        relationship: 'Spouse',
        phone: '+1234567890'
      },
      {
        name: 'Jane Smith',
        relationship: 'Primary Care Physician',
        phone: '+1987654321'
      }
    ]
  }
}

export async function GET(
  request: Request,
  { params }: { params: { code: string } }
) {
  const { code } = params

  // In a real app, you would:
  // 1. Validate the emergency code
  // 2. Check if it's expired
  // 3. Fetch the actual medical info from your database
  // 4. Apply any access restrictions

  const medicalInfo = mockMedicalInfo[code as keyof typeof mockMedicalInfo]

  if (!medicalInfo) {
    return NextResponse.json(
      { error: 'Invalid or expired emergency code' },
      { status: 404 }
    )
  }

  return NextResponse.json(medicalInfo)
} 