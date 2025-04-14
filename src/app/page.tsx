'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Heart, Clock, Lock, QrCode, Shield, Share2, FileText, CheckCircle2, ArrowRight, Users, User, Stethoscope, UserCog, MapPin } from 'lucide-react'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-black mb-6">
            Your Medical Records, <span className="text-blue-600">Securely Stored</span>
          </h1>
          <p className="text-xl text-black mb-8 max-w-2xl mx-auto">
            Access your complete medical history anytime, anywhere. Share securely with healthcare providers when needed.
          </p>
          
          {/* Login Buttons */}
          <div className="flex flex-col md:flex-row gap-4 justify-center mb-12">
            <Link href="/login?role=user" className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <User className="h-5 w-5" />
              Login as User
            </Link>
            <Link href="/login?role=doctor" className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              <Stethoscope className="h-5 w-5" />
              Login as Doctor
            </Link>
            <Link href="/login?role=admin" className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
              <UserCog className="h-5 w-5" />
              Login as Admin
            </Link>
          </div>

          <div className="text-sm text-black">
            <p>Demo Credentials:</p>
            <p>User: user@example.com / password123</p>
            <p>Doctor: doctor@example.com / password123</p>
            <p>Admin: admin@example.com / password123</p>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-6 rounded-lg shadow-sm"
          >
            <Shield className="h-8 w-8 text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-black">Secure Storage</h3>
            <p className="text-black">Your medical records are encrypted and stored securely in the cloud.</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white p-6 rounded-lg shadow-sm"
          >
            <Share2 className="h-8 w-8 text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-black">Easy Sharing</h3>
            <p className="text-black">Share your medical history with healthcare providers instantly.</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white p-6 rounded-lg shadow-sm"
          >
            <FileText className="h-8 w-8 text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-black">Complete History</h3>
            <p className="text-black">Access your complete medical history in one place.</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-white p-6 rounded-lg shadow-sm"
          >
            <MapPin className="h-8 w-8 text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-black">Find Nearby Facilities</h3>
            <p className="text-black">Locate hospitals and pharmacies near you.</p>
            <Link href="/nearby" className="mt-4 inline-flex items-center text-blue-600 hover:text-blue-700">
              Find Now
              <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </motion.div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Link href="/patients" className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            View All Patients
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </main>
  )
}
