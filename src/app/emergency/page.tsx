'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function EmergencyPage() {
  const [code, setCode] = useState('')
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would verify the emergency code
    router.push(`/emergency/view/${code}`)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-sm">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
            Emergency Medical Access
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter the emergency access code to view critical medical information
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="code" className="sr-only">
              Emergency Code
            </label>
            <input
              id="code"
              name="code"
              type="text"
              required
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              placeholder="Emergency Access Code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Access Medical Information
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 