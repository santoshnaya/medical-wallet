'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { User, Stethoscope, UserCog, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

const DEMO_CREDENTIALS = {
  user: { email: 'user@example.com', password: 'password123' },
  doctor: { email: 'doctor@example.com', password: 'password123' },
  admin: { email: 'admin@example.com', password: 'password123' }
}

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const role = searchParams.get('role') || 'user'
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Check credentials based on role
    const credentials = DEMO_CREDENTIALS[role as keyof typeof DEMO_CREDENTIALS]
    if (email === credentials.email && password === credentials.password) {
      // Store role in localStorage for session management
      localStorage.setItem('userRole', role)
      localStorage.setItem('isAuthenticated', 'true')
      
      // Redirect based on role
      switch (role) {
        case 'user':
          router.push('/user/dashboard')
          break
        case 'doctor':
          router.push('/doctor/dashboard')
          break
        case 'admin':
          router.push('/admin/dashboard')
          break
        default:
          router.push('/')
      }
    } else {
      setError('Invalid email or password')
    }
  }

  const getRoleIcon = () => {
    switch (role) {
      case 'user':
        return <User className="h-8 w-8" />
      case 'doctor':
        return <Stethoscope className="h-8 w-8" />
      case 'admin':
        return <UserCog className="h-8 w-8" />
      default:
        return <User className="h-8 w-8" />
    }
  }

  const getRoleTitle = () => {
    switch (role) {
      case 'user':
        return 'User Login'
      case 'doctor':
        return 'Doctor Login'
      case 'admin':
        return 'Admin Login'
      default:
        return 'Login'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md"
      >
        <div className="flex items-center justify-between mb-6">
          <Link href="/" className="text-gray-600 hover:text-gray-900">
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <div className="flex items-center gap-2">
            {getRoleIcon()}
            <h1 className="text-2xl font-bold text-gray-900">{getRoleTitle()}</h1>
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm">{error}</div>
          )}

          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Login
          </button>
        </form>

        <div className="mt-6 text-sm text-gray-500">
          <p>Demo Credentials:</p>
          <p>Email: {DEMO_CREDENTIALS[role as keyof typeof DEMO_CREDENTIALS].email}</p>
          <p>Password: {DEMO_CREDENTIALS[role as keyof typeof DEMO_CREDENTIALS].password}</p>
        </div>
      </motion.div>
    </div>
  )
} 