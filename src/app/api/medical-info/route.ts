import { NextResponse } from 'next/server'

// This is a mock database - in a real app, you'd use a proper database
let mockMedicalInfo = {
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
  ],
  emergencyCode: '123456'
}

export async function GET() {
  // In a real app, you would:
  // 1. Verify the user's authentication
  // 2. Fetch the user's medical info from your database
  // 3. Apply any access restrictions

  return NextResponse.json(mockMedicalInfo)
}

export async function PUT(request: Request) {
  // In a real app, you would:
  // 1. Verify the user's authentication
  // 2. Validate the incoming data
  // 3. Update the user's medical info in your database
  // 4. Apply any access restrictions

  try {
    const data = await request.json()
    mockMedicalInfo = {
      ...mockMedicalInfo,
      ...data,
      emergencyCode: mockMedicalInfo.emergencyCode // Preserve the emergency code
    }
    return NextResponse.json(mockMedicalInfo)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update medical information' },
      { status: 400 }
    )
  }
} 